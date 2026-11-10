import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";
import { privateJson } from "@/lib/api-response";
import { isSameOriginRequest } from "@/lib/request-security";
import { saveMediaUpload } from "@/lib/cms/upload";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getAdminContext();
  if (!auth.ok) return privateJson({ message: "Administrator access is required." }, { status: auth.reason === "not-configured" ? 503 : auth.reason === "forbidden" ? 403 : 401 });
  return saveMediaUpload(request, auth);
}
