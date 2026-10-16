import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
export async function readCmsMedia(client: SupabaseClient, id: string) {
  const { data, error } = await client
    .from("growthly_content_media")
    .select("storage_path")
    .eq("id", id)
    .single();
  if (error || data?.storage_path !== `${id}.webp`) return null;
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
