import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
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
    return NextResponse.json(
      { message: "This request could not be accepted." },
      { status: 403 },
    );
  }
  if (!hasSupabaseAuthConfig()) {
    return NextResponse.json(
      {
        message:
          "Admin sign-in is not configured. Complete the Supabase setup in the deployment guide.",
      },
      { status: 503 },
    );
  }

  const ip = requestIp(request);
  const limit = checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
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

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > 4_096) {
    return NextResponse.json(
      { message: "The sign-in request is too large." },
      { status: 413 },
    );
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > 4_096) {
      return NextResponse.json(
        { message: "The sign-in request is too large." },
        { status: 413 },
      );
    }
    input = JSON.parse(body);
  } catch {
    return NextResponse.json(
      { message: "Enter a valid email address and password." },
      { status: 400 },
    );
  }
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Enter a valid email address and password." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) {
      return NextResponse.json(
        { message: "The email or password was not recognised." },
        { status: 401 },
      );
    }
    if (data.user.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          message:
            "This account is not authorised for the GROWTHLY admin area.",
        },
        { status: 403 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Sign-in is temporarily unavailable. Try again later." },
      { status: 503 },
    );
  }
}
