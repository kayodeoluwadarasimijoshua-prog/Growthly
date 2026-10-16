import type { NextRequest } from "next/server";
import { privateJson } from "@/lib/api-response";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  createSupabaseServerClient,
  hasSupabaseAuthConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return privateJson(
      { message: "This request could not be accepted." },
      { status: 403 },
    );
  }
  if (hasSupabaseAuthConfig()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      return privateJson(
        {
          message:
            "Sign-out could not be completed. Please close the browser session and try again.",
        },
        { status: 503 },
      );
    }
  }
  return privateJson({ ok: true });
}
