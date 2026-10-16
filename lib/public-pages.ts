import { getServicePath } from "@/config/service-pages";
import { services, projects } from "@/config/content";

/** Canonical content only: no redirects, query variants, admin/API or review assets.
 * New client projects are picked up from real project configuration automatically. */
export function getPublicPagePaths(
  publishedProjects: readonly { slug: string }[] = projects,
): string[] {
  return [
    ...new Set([
      "/",
      "/website-development",
      "/business-websites",
      "/ecommerce-websites",
      "/services",
      ...services
        .filter((service) => service.slug !== "website-development")
        .map((service) => getServicePath(service.slug)),
      "/portfolio",
      ...publishedProjects.map((project) => `/portfolio/${project.slug}`),
      "/industries",
      "/pricing",
      "/about",
      "/contact",
      "/request-a-quote",
      "/privacy-policy",
      "/terms",
    ]),
  ];
}
