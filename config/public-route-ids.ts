import { getServicePath } from "@/config/service-pages";

/** Lightweight public identifiers for client analytics, without importing content/image schemas. */
export const publicServiceSlugs = [
  "graphic-design",
  "website-development",
  "ai-video-adverts",
  "social-media-management",
  "ai-integration-automation",
  "digital-advertising",
] as const;
export const publicProjectSlugs = ["starxco"] as const;
export const publicRoutePaths = [
  "/",
  "/services",
  "/portfolio",
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
  ...publicServiceSlugs
    .filter((s) => s !== "website-development")
    .map((s) => getServicePath(s)),
  ...publicProjectSlugs.map((p) => `/portfolio/${p}`),
];
