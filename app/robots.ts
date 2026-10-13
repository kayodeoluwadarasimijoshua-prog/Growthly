import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules:
      process.env.SITE_INDEXING_ENABLED !== "true"
        ? { userAgent: "*", disallow: "/" }
        : {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/api/"],
          },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
    host: siteUrl,
  };
}
