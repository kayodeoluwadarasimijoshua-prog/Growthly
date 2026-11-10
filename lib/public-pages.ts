import { getServicePath } from "@/config/service-pages";
import { services, projects } from "@/config/content";
import { portfolioServices, galleryPath } from "@/config/portfolio-services";

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
      ...portfolioServices.map((service) => galleryPath(service.slug)),
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
