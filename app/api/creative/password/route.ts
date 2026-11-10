import { z } from "zod";
import type { NextRequest } from "next/server";
import { getStudioContext } from "@/lib/supabase/studio";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { privateJson } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getStudioContext();
  if (!auth.ok || auth.role !== "creative_editor")
    return privateJson(
      { message: "An invited creative-editor session is required." },
      { status: 403 },
    );
  if (!checkRateLimit(`creative-password:${auth.user.id}`, 3, 900000).allowed)
    return privateJson(
      { message: "Please wait before trying again." },
      { status: 429 },
    );
  try {
    const parsed = z
      .object({ password: z.string().min(12).max(128) })
      .strict()
      .safeParse(await readBoundedJson(request, 2048));
    if (!parsed.success)
      return privateJson(
        { message: "Use a password between 12 and 128 characters." },
        { status: 400 },
      );
    const { error } = await auth.supabase.auth.updateUser({
      password: parsed.data.password,
    });
    return error
      ? privateJson(
          {
            message:
              "The password could not be updated. Request a fresh invitation or contact the owner.",
          },
          { status: 400 },
        )
      : privateJson({
          message: "Password set. You can open your creative workspace.",
        });
  } catch (error) {
    return privateJson(
      { message: "The request could not be completed." },
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
