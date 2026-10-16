import { getPublishedProjects } from "@/lib/cms/public";
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getPublicPagePaths } from "@/lib/public-pages";

/** Lists only public canonical destinations. No synthetic lastModified dates:
 * a build timestamp is not evidence that a page's substantive content changed.
 * Review indexing is controlled independently by robots, meta and HTTP headers. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];
  return getPublicPagePaths(await getPublishedProjects()).map((path) => ({
    url: `${siteUrl}${path}`,
  }));
}
