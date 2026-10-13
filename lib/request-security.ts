export function isSameOriginRequest(request: Request) {
  // Modern browsers supply this forbidden request header even when a reverse proxy
  // terminates TLS and rewrites Host; same-origin is safe for this deployment too.
  if (request.headers.get("sec-fetch-site") === "same-origin") return true;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")[0]
      ?.trim();
    const requestHost = forwardedHost || request.headers.get("host");
    if (
      requestHost &&
      originUrl.host.toLowerCase() === requestHost.toLowerCase()
    )
      return true;
    const configuredSite = process.env.NEXT_PUBLIC_SITE_URL;
    return Boolean(
      configuredSite && originUrl.origin === new URL(configuredSite).origin,
    );
  } catch {
    return false;
  }
}
