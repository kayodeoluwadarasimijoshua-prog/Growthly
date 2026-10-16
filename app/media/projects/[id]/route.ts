import { z } from "zod";
import { getContentState } from "@/lib/cms/public";
import { readCmsMedia } from "@/lib/cms/media";
import { createSupabaseLeadWriter } from "@/lib/supabase/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const headers = {
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "Referrer-Policy": "no-referrer",
  };
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success)
    return new Response(null, { status: 404, headers });
  const state = await getContentState();
  if (!state.available) return new Response(null, { status: 503, headers });
  if (
    !state.enabled ||
    !state.document?.projects.some(
      (p) =>
        p.published &&
        p.publicationConfirmed &&
        p.image?.permissionConfirmed &&
        p.image.assetId === id,
    )
  )
    return new Response(null, { status: 404, headers });
  try {
    return (
      (await readCmsMedia(createSupabaseLeadWriter(), id)) ??
      new Response(null, { status: 404, headers })
    );
  } catch {
    return new Response(null, { status: 503, headers });
  }
}
