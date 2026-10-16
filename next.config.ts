import type { NextConfig } from "next";
import { isPublicIndexingEnabled } from "./lib/indexing";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Revocable/private proxies must never be copied into Next's shared image cache,
  // including through a manually constructed /_next/image URL.
  images: { localPatterns: [{ pathname: "/images/projects/**", search: "" }] },
  allowedDevOrigins: ["*.e2b.app", "*.arena.ai"],
  async redirects() {
    const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (!configuredSite) return [];
    try {
      const canonical = new URL(configuredSite);
      const aliasHost = canonical.hostname.startsWith("www.")
        ? canonical.hostname.slice(4)
        : `www.${canonical.hostname}`;
      if (aliasHost === canonical.hostname) return [];
      return [
        {
          source: "/:path*",
          has: [{ type: "host", value: aliasHost }],
          destination: `${canonical.origin}/:path*`,
          permanent: true,
        },
      ];
    } catch {
      return [];
    }
  },
  async headers() {
    const headers = [
      ...(!isPublicIndexingEnabled()
        ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
        : []),
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Resource restrictions that work with static Next scripts and the embedded
      // preview. Framing restrictions remain scoped to the production hostname.
      {
        key: "Content-Security-Policy",
        value: "object-src 'none'; base-uri 'self'; form-action 'self';",
      },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    const rules: Awaited<ReturnType<NonNullable<NextConfig["headers"]>>> = [
      { source: "/:path*", headers },
      // Also cover framework-generated errors (e.g. 405), not just handler responses.
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      // Preserve the native-form safety net’s stricter policy over the global default.
      {
        source: "/api/inquiries/fallback",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
    rules.push({
      source: "/review-media/:path*",
      headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
    });
    const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.trim();

    if (
      process.env.NODE_ENV === "production" &&
      configuredSite?.startsWith("https://")
    ) {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
      try {
        const site = new URL(configuredSite);
        const hostname = site.hostname.toLowerCase();
        const isPreviewHost = ["e2b.app", "arena.ai"].some(
          (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`),
        );
        if (!isPreviewHost) {
          rules.push({
            source: "/:path*",
            has: [{ type: "host", value: site.hostname }],
            headers: [
              {
                key: "Content-Security-Policy",
                value:
                  "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
              },
              { key: "X-Frame-Options", value: "DENY" },
            ],
          });
        }
      } catch {
        // Invalid production origins do not receive host-scoped frame protection.
      }
    }

    return rules;
  },
};

export default nextConfig;
