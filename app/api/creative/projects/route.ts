import { z } from "zod";
import type { NextRequest } from "next/server";
import { getStudioContext } from "@/lib/supabase/studio";
import { privateJson } from "@/lib/api-response";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { creativeSaveSchema } from "@/lib/cms/creative";
import { checkRateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function GET() {
  const auth = await getStudioContext();
  if (!auth.ok)
    return privateJson(
      { message: "Creative workspace access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "unauthenticated"
              ? 401
              : 403,
      },
    );
  const { data, error } = await auth.supabase
    .from("growthly_creative_projects")
    .select("id,creator,revision,project,status,updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);
  return error
    ? privateJson(
        { message: "Creative storage is not ready. Nothing has been changed." },
        { status: 503 },
      )
    : privateJson({ projects: data ?? [] });
}
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getStudioContext();
  if (!auth.ok)
    return privateJson(
      { message: "Creative workspace access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "unauthenticated"
              ? 401
              : 403,
      },
    );
  if (!checkRateLimit(`creative:${auth.user.id}`, 30, 60000).allowed)
    return privateJson(
      { message: "Please wait before saving again." },
      { status: 429 },
    );
  try {
    const parsed = creativeSaveSchema.safeParse(
      await readBoundedJson(request, 60000),
    );
    if (
      !parsed.success ||
      !z.string().uuid().safeParse(parsed.data.project.id).success
    )
      return privateJson(
        {
          message:
            "Check the draft fields. Only private graphic-design and AI-advert projects are accepted.",
        },
        { status: 400 },
      );
    const { project, expectedRevision, status } = parsed.data;
    if (
      status === "submitted" &&
      (!project.name.trim() || project.summary.trim().length < 20)
    )
      return privateJson(
        {
          message: "Add a project name and a useful summary before submitting.",
        },
        { status: 400 },
      );
    if (project.image) {
      const { data: media, error } = await auth.supabase
        .from("growthly_content_media")
        .select("id,width,height,created_by")
        .eq("id", project.image.assetId)
        .single();
      if (
        error ||
        !media ||
        media.created_by !== auth.user.id ||
        media.width !== project.image.width ||
        media.height !== project.image.height
      )
        return privateJson(
          { message: "Use an image uploaded by your account." },
          { status: 400 },
        );
    }
    const { data, error } = await auth.supabase.rpc("save_growthly_creative", {
      p_id: project.id,
      p_expected: expectedRevision,
      p_project: project,
      p_status: status,
    });
    return error
      ? privateJson(
          {
            message:
              error.code === "40001"
                ? "This draft changed. Reload it before saving."
                : "The draft could not be saved.",
          },
          {
            status:
              error.code === "40001" ? 409 : error.code === "42501" ? 403 : 503,
          },
        )
      : privateJson({
          revision: Number(data),
          message:
            status === "submitted"
              ? "Submitted for owner review. Nothing is published yet."
              : "Private draft saved.",
        });
  } catch (error) {
    return privateJson(
      { message: "The draft could not be read." },
      {
        status:
          error instanceof BodyTooLargeError
            ? 413
            : error instanceof BodyReadTimeoutError
              ? 408
              : 400,
      },
    );
  }
}
