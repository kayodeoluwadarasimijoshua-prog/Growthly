import { z } from "zod";
import { getAdminContext } from "@/lib/supabase/admin";
import { privateJson } from "@/lib/api-response";
import { readCmsMedia } from "@/lib/cms/media";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getAdminContext();
  if (!auth.ok)
    return privateJson(
      { message: "Administrator access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "forbidden"
              ? 403
              : 401,
      },
    );
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success)
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  try {
    return (
      (await readCmsMedia(auth.supabase, id)) ??
      new Response(null, {
        status: 404,
        headers: { "Cache-Control": "private, no-store" },
      })
    );
  } catch {
    return new Response(null, {
      status: 503,
      headers: { "Cache-Control": "private, no-store" },
    });
  }
}
