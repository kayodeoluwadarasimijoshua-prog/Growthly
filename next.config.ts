import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
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
      ...(process.env.SITE_INDEXING_ENABLED !== "true"
        ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
        : []),
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    const rules: Awaited<ReturnType<NonNullable<NextConfig["headers"]>>> = [
      { source: "/:path*", headers },
    ];
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
                value: "frame-ancestors 'none';",
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
