import "server-only";
import { createSupabaseServerClient, hasSupabaseAuthConfig } from "./server";
export async function getStudioContext() {
  if (!hasSupabaseAuthConfig())
    return { ok: false as const, reason: "not-configured" };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return { ok: false as const, reason: "unauthenticated" };
  const role = user.app_metadata?.role;
  if (role !== "admin" && role !== "creative_editor")
    return { ok: false as const, reason: "forbidden" };
  return {
    ok: true as const,
    supabase,
    user,
    role: role as "admin" | "creative_editor",
  };
}
