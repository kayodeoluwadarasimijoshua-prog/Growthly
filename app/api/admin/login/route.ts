import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import type { NextRequest } from "next/server";
import { privateJson } from "@/lib/api-response";
import { z } from "zod";
import { requestIp } from "@/lib/rate-limit";
import { checkApiRateLimit } from "@/lib/api-rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  createSupabaseServerClient,
  hasSupabaseAuthConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

const loginSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z.string().min(1).max(1024),
  })
  .strict();

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return privateJson(
      { message: "This request could not be accepted." },
      { status: 403 },
    );
  }
  if (!hasSupabaseAuthConfig()) {
    return privateJson(
      {
        message:
          "Admin sign-in is not configured. Complete the Supabase setup in the deployment guide.",
      },
      { status: 503 },
    );
  }

  const ip = requestIp(request);
  const limit = await checkApiRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if ("unavailable" in limit && limit.unavailable) {
    return privateJson(
      {
        message:
          "The service is temporarily unavailable. Please try again later.",
      },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }
  if (!limit.allowed) {
    return privateJson(
      {
        message:
          "Too many sign-in attempts. Wait a little before trying again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let input: unknown;
  try {
    input = await readBoundedJson(request, 4_096);
  } catch (error) {
    if (error instanceof BodyReadTimeoutError)
      return privateJson(
        {
          message:
            "The upload took too long. Please retry on a stable connection.",
        },
        { status: 408 },
      );
    if (error instanceof BodyTooLargeError)
      return privateJson(
        { message: "The sign-in request is too large." },
        { status: 413 },
      );
    return privateJson(
      { message: "Enter a valid email address and password." },
      { status: 400 },
    );
  }
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return privateJson(
      { message: "Enter a valid email address and password." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) {
      return privateJson(
        { message: "The email or password was not recognised." },
        { status: 401 },
      );
    }
    if (data.user.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      return privateJson(
        {
          message:
            "This account is not authorised for the GROWTHLY admin area.",
        },
        { status: 403 },
      );
    }
    return privateJson({ ok: true });
  } catch {
    return privateJson(
      { message: "Sign-in is temporarily unavailable. Try again later." },
      { status: 503 },
    );
  }
}
