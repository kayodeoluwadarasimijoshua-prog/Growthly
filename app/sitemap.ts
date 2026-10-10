import type { MetadataRoute } from "next";
import { services, projects } from "@/config/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const paths = [
    "/",
    "/services",
    ...services.map((service) => `/services/${service.slug}`),
    "/work",
    ...projects.map((project) => `/work/${project.slug}`),
    "/about",
    "/start-project",
    "/contact",
    "/privacy",
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
