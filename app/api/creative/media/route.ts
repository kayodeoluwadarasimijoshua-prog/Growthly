import type { NextRequest } from "next/server";
import { getStudioContext } from "@/lib/supabase/studio";
import { saveMediaUpload } from "@/lib/cms/upload";
import { isSameOriginRequest } from "@/lib/request-security";
import { privateJson } from "@/lib/api-response";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
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
  return saveMediaUpload(request, auth, {
    prefix: auth.user.id,
    previewBase: "/api/creative/media",
  });
}
