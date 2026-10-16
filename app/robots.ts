import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { isPublicIndexingEnabled } from "@/lib/indexing";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: !isPublicIndexingEnabled()
      ? { userAgent: "*", disallow: "/" }
      : {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/api/", "/review-media/"],
        },
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
    host: siteUrl,
  };
}
