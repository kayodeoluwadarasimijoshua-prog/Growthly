import { z } from "zod";
import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";
import {
  createSupabaseLeadWriter,
  hasSupabaseLeadStoreConfig,
} from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import { privateJson } from "@/lib/api-response";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { isSameOriginRequest } from "@/lib/request-security";
import { checkRateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getAdminContext();
  if (!auth.ok)
    return privateJson(
      { message: "Only the owner can invite creative editors." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "unauthenticated"
              ? 401
              : 403,
      },
    );
  const origin = getSiteUrl();
  if (
    process.env.CREATIVE_INVITES_ENABLED !== "true" ||
    !hasSupabaseLeadStoreConfig() ||
    !origin?.startsWith("https://")
  )
    return privateJson(
      {
        message:
          "Invitation setup is not enabled yet. Configure the Supabase invite template and creative-workspace migration first.",
      },
      { status: 503 },
    );
  if (!checkRateLimit(`creative-invite:${auth.user.id}`, 3, 900000).allowed)
    return privateJson(
      { message: "Please wait before sending more invitations." },
      { status: 429 },
    );
  try {
    const parsed = z
      .object({ email: z.string().trim().email().max(254) })
      .strict()
      .safeParse(await readBoundedJson(request, 2048));
    if (!parsed.success)
      return privateJson(
        { message: "Enter the creative editor’s email address." },
        { status: 400 },
      );
    if (parsed.data.email.toLowerCase() === auth.user.email?.toLowerCase())
      return privateJson(
        { message: "Use your friend’s email, not your owner account." },
        { status: 400 },
      );
    const storage = await auth.supabase
      .from("growthly_creative_projects")
      .select("id")
      .limit(1);
    if (storage.error)
      return privateJson(
        {
          message:
            "Apply and verify the creative-workspace migration before inviting anyone.",
        },
        { status: 503 },
      );
    const admin = createSupabaseLeadWriter().auth.admin;
    const { data, error } = await admin.inviteUserByEmail(parsed.data.email, {
      redirectTo: `${origin}/creative/password`,
    });
    if (error || !data.user)
      return privateJson(
        {
          message:
            "The invitation could not be created. If this person already has a website account, review its role in Supabase rather than creating another account.",
        },
        { status: 409 },
      );
    if (data.user.app_metadata?.role === "admin")
      return privateJson(
        {
          message:
            "An owner account was not changed. Review this identity in Supabase.",
        },
        { status: 409 },
      );
    const updated = await admin.updateUserById(data.user.id, {
      app_metadata: { ...data.user.app_metadata, role: "creative_editor" },
    });
    if (updated.error)
      return privateJson(
        {
          message:
            "The invitation was created but its role could not be assigned. Review the new user in Supabase before retrying. No owner access was granted.",
        },
        { status: 503 },
      );
    return privateJson({
      message:
        "Invitation accepted by Supabase for the creative-editor role. Delivery is not guaranteed; ask your friend to check their inbox and spam folder.",
    });
  } catch (error) {
    return privateJson(
      { message: "The invitation could not be completed." },
      {
        status:
          error instanceof BodyTooLargeError
            ? 413
            : error instanceof BodyReadTimeoutError
              ? 408
              : error instanceof SyntaxError
                ? 400
                : 503,
      },
    );
  }
}
