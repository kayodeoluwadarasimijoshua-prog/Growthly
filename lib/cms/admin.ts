import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { defaultCmsDocument } from "./defaults";
import { cmsDocumentSchema } from "./schema";

export async function readEditorState(client: SupabaseClient) {
  const { data, error } = await client
    .from("growthly_site_content")
    .select("revision,draft,published,published_at,updated_at")
    .eq("id", "main")
    .single();
  if (error || !data)
    throw new Error(
      "Content storage needs setup or is temporarily unavailable.",
    );
  const draft = cmsDocumentSchema.parse(data.draft ?? defaultCmsDocument());
  const published = data.published
    ? cmsDocumentSchema.parse(data.published)
    : null;
  const { data: history, error: historyError } = await client
    .from("growthly_content_history")
    .select("revision,published,created_at")
    .order("revision", { ascending: false })
    .limit(20);
  if (historyError) throw new Error("Content history is unavailable.");
  return {
    revision: Number(data.revision),
    draft,
    published,
    publishedAt: data.published_at,
    history: history ?? [],
    publicEnabled: process.env.SITE_CMS_ENABLED === "true",
  };
}
