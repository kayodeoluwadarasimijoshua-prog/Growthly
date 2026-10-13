import type { MetadataRoute } from "next";
import { services, projects } from "@/config/content";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  const paths = [
    "/",
    "/services",
    ...services
      .filter((s) => s.slug !== "website-development")
      .map((service) => `/services/${service.slug}`),
    "/portfolio",
    ...projects.map((project) => `/portfolio/${project.slug}`),
    "/about",
    "/request-a-quote",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/website-development",
    "/business-websites",
    "/ecommerce-websites",
    "/industries",
    "/pricing",
  ];
  return paths.map((path) => ({ url: `${siteUrl}${path}` }));
}
