import { NextResponse } from "next/server";

/** Sensitive API responses must not be cached, including errors and redirects. */
export function privateJson(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store");
  return NextResponse.json(body, { ...init, headers });
}
