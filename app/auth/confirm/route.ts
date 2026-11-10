import { getSiteUrl } from "@/lib/site";
import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  hasSupabaseAuthConfig,
} from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const origin = getSiteUrl();
  const destination = new URL("/admin/login", origin ?? request.url);
  if (
    origin?.startsWith("https://") &&
    type === "invite" &&
    hash &&
    /^[a-zA-Z0-9_-]{20,512}$/.test(hash) &&
    hasSupabaseAuthConfig()
  ) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: hash,
        type: "invite",
      });
      if (!error) destination.pathname = "/creative/password";
    } catch {
      /* Return to sign-in without exposing the token or provider error. */
    }
  }
  const response = NextResponse.redirect(destination);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
