import type { NextRequest } from "next/server";
import { z } from "zod";
import { getAdminContext } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/request-security";
import { privateJson } from "@/lib/api-response";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { checkRateLimit } from "@/lib/rate-limit";
import { readEditorState } from "@/lib/cms/admin";
import { cmsDocumentSchema, publicationIssues } from "@/lib/cms/schema";
import { defaultCmsDocument } from "@/lib/cms/defaults";
export const runtime = "nodejs";
const requestSchema = z
  .object({
    action: z.enum(["save", "publish", "restore"]),
    expectedRevision: z.number().int().min(0),
    document: cmsDocumentSchema.optional(),
    restoreRevision: z.number().int().positive().optional(),
    confirmPricing: z.boolean().optional(),
  })
  .strict();
export async function GET() {
  const auth = await getAdminContext();
  if (!auth.ok)
    return privateJson(
      { message: "Administrator access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "forbidden"
              ? 403
              : 401,
      },
    );
  try {
    return privateJson(await readEditorState(auth.supabase));
  } catch {
    return privateJson(
      {
        message:
          "Content storage needs setup or is unavailable. Existing public content has not been changed.",
      },
      { status: 503 },
    );
  }
}
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getAdminContext();
  if (!auth.ok)
    return privateJson(
      { message: "Administrator access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "forbidden"
              ? 403
              : 401,
      },
    );
  if (!hasSupabaseConfig())
    return privateJson(
      { message: "Complete content storage setup first." },
      { status: 503 },
    );
  const limit = checkRateLimit(`content-write:${auth.user.id}`, 30, 60000);
  if (!limit.allowed)
    return privateJson(
      { message: "Too many updates. Please wait." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  let input: unknown;
  try {
    input = await readBoundedJson(request, 400_000);
  } catch (e) {
    return privateJson(
      { message: "The content could not be read." },
      {
        status:
          e instanceof BodyTooLargeError
            ? 413
            : e instanceof BodyReadTimeoutError
              ? 408
              : 400,
      },
    );
  }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success)
    return privateJson(
      {
        message: "Check the content fields.",
        issues: parsed.error.issues
          .slice(0, 12)
          .map((i) => `${i.path.join(".")}: ${i.message}`),
      },
      { status: 400 },
    );
  try {
    const state = await readEditorState(auth.supabase);
    if (state.revision !== parsed.data.expectedRevision)
      return privateJson(
        {
          message:
            "Another tab has updated this content. Reload before saving; your changes have not been applied.",
        },
        { status: 409 },
      );
    let document = parsed.data.document;
    if (parsed.data.action === "restore") {
      if (!parsed.data.restoreRevision)
        return privateJson(
          { message: "Choose a saved revision." },
          { status: 400 },
        );
      const { data, error } = await auth.supabase
        .from("growthly_content_history")
        .select("document")
        .eq("revision", parsed.data.restoreRevision)
        .single();
      const restored = cmsDocumentSchema.safeParse(data?.document);
      if (error || !restored.success)
        return privateJson(
          { message: "That revision is unavailable." },
          { status: 404 },
        );
      document = restored.data;
      document.projects.forEach((p) => {
        p.publicationConfirmed = false;
        if (p.image) p.image.permissionConfirmed = false;
      });
    }
    if (!document)
      return privateJson(
        { message: "Add the content to save." },
        { status: 400 },
      );
    const publishing = parsed.data.action === "publish";
    if (publishing) {
      const issues = publicationIssues(document, state.published);
      const baseline = state.published ?? defaultCmsDocument();
      if (
        JSON.stringify(document.settings.prices) !==
          JSON.stringify(baseline.settings.prices) &&
        !parsed.data.confirmPricing
      )
        issues.push(
          "Confirm that you reviewed all three starting prices before publishing.",
        );
      const images = document.projects
        .filter((p) => p.published && p.image)
        .map((p) => p.image!);
      if (images.length) {
        const { data, error } = await auth.supabase
          .from("growthly_content_media")
          .select("id,width,height,storage_path")
          .in(
            "id",
            images.map((i) => i.assetId),
          );
        if (error)
          return privateJson(
            {
              message:
                "Image registration could not be checked. Nothing was published.",
            },
            { status: 503 },
          );
        for (const image of images)
          if (
            !data?.some(
              (m) =>
                m.id === image.assetId &&
                m.width === image.width &&
                m.height === image.height &&
                m.storage_path === `${image.assetId}.webp`,
            )
          )
            issues.push("A project image is not registered. Upload it again.");
      }
      if (issues.length)
        return privateJson(
          { message: "Resolve these publication checks.", issues },
          { status: 400 },
        );
    }
    const { data, error } = await auth.supabase.rpc("commit_growthly_content", {
      p_expected: state.revision,
      p_document: document,
      p_publish: publishing,
    });
    if (error)
      return privateJson(
        {
          message:
            error.code === "40001"
              ? "Another tab updated this content. Reload before saving."
              : "The content was not saved. Please retry.",
        },
        { status: error.code === "40001" ? 409 : 503 },
      );
    return privateJson({
      revision: Number(data),
      message: publishing
        ? state.publicEnabled
          ? "Published. New page requests use this content."
          : "Published to storage. The one-time public CMS switch is not enabled yet."
        : parsed.data.action === "restore"
          ? "Revision restored as a draft. Review it before publishing."
          : "Draft saved. The public website has not changed.",
      publicEnabled: state.publicEnabled,
    });
  } catch {
    return privateJson(
      {
        message:
          "Content storage is unavailable. No success is confirmed; reload to check the latest revision before retrying.",
      },
      { status: 503 },
    );
  }
}
