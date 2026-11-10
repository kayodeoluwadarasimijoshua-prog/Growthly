import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
export function validMediaPath(path: unknown, id: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  )
    return false;
  return (
    typeof path === "string" &&
    (path === `${id}.webp` ||
      new RegExp(
        `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/${id}\\.webp$`,
        "i",
      ).test(path))
  );
}
export async function readCmsMedia(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from("growthly_content_media")
    .select("storage_path")
    .eq("id", id)
    .single();
  if (error || !validMediaPath(data?.storage_path, id)) return null;
  const result = await client.storage
    .from("growthly-project-media")
    .download(data.storage_path);
  if (result.error || !result.data || result.data.size > 2_000_000) return null;
  return new Response(result.data, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
