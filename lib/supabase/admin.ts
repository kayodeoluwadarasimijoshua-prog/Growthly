import "server-only";

import {
  createSupabaseServerClient,
  hasSupabaseAuthConfig,
} from "@/lib/supabase/server";

export async function getAdminContext() {
  if (!hasSupabaseAuthConfig())
    return { ok: false as const, reason: "not-configured" as const };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user)
    return { ok: false as const, reason: "unauthenticated" as const };
  if (user.app_metadata?.role !== "admin")
    return { ok: false as const, reason: "forbidden" as const };
  return { ok: true as const, supabase, user };
}
