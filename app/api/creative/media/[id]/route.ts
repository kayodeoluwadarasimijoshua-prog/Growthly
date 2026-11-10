import { z } from "zod";
import { getStudioContext } from "@/lib/supabase/studio";
import { privateJson } from "@/lib/api-response";
import { readCmsMedia } from "@/lib/cms/media";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await getStudioContext();
  if (!auth.ok)
    return privateJson(
      { message: "Creative workspace access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "unauthenticated"
              ? 401
              : 403,
      },
    );
  const id = (await params).id;
  if (!z.string().uuid().safeParse(id).success)
    return privateJson({ message: "Not found." }, { status: 404 });
  try {
    return (
      (await readCmsMedia(auth.supabase, id)) ??
      privateJson({ message: "Not found." }, { status: 404 })
    );
  } catch {
    return privateJson(
      { message: "Image temporarily unavailable." },
      { status: 503 },
    );
  }
}
