import { NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/request-security";

const privacyHeaders = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

/** Native POST safety net only. Never read, log, store, forward or echo the body. */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return new NextResponse("This request was not processed.", {
      status: 403,
      headers: privacyHeaders,
    });
  }
  // A fixed relative Location works behind the preview proxy and drops all query data.
  // 303 makes the next request a GET, without replaying private POST fields.
  return new NextResponse(null, {
    status: 303,
    headers: { ...privacyHeaders, Location: "/request-a-quote?form=fallback" },
  });
}
