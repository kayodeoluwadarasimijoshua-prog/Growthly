/** Small shared route/CTA map; safe for client navigation without full service content. */
export const servicePages = [
  {
    slug: "website-development",
    path: "/website-development",
    label: "Website development",
    cta: "Get a Website Quote",
  },
  {
    slug: "graphic-design",
    path: "/graphic-design",
    label: "Graphic design",
    cta: "Get a Design Quote",
  },
  {
    slug: "ai-video-adverts",
    path: "/aiads",
    label: "AI video adverts",
    cta: "Get an AI Video Quote",
  },
  {
    slug: "social-media-management",
    path: "/social-media",
    label: "Social media management",
    cta: "Discuss Social Media Support",
  },
  {
    slug: "digital-advertising",
    path: "/ads-promotion",
    label: "Ads & promotion",
    cta: "Discuss an Ad Campaign",
  },
  {
    slug: "ai-integration-automation",
    path: "/ai-automation",
    label: "AI & automation",
    cta: "Discuss an Automation Project",
  },
] as const;

export function getServicePage(slug: string | undefined) {
  return servicePages.find((page) => page.slug === slug);
}
export function getServicePath(slug: string) {
  return getServicePage(slug)?.path ?? "/services";
}
export function getServicePageForPath(path: string) {
  return servicePages.find(
    (page) => page.path === path || `/services/${page.slug}` === path,
  );
}
export function getServiceQuoteHref(slug: string) {
  return `/request-a-quote?service=${encodeURIComponent(slug)}`;
}

export type ServicePage = (typeof servicePages)[number];

/** Sentence casing must not turn the acronym AI into "ai". */
export function sentenceServiceName(name: string) {
  return name.startsWith("AI")
    ? name
    : name.charAt(0).toLowerCase() + name.slice(1);
}

/** Unknown, duplicate or object values never become a service or a destination. */
export function getContactService(value: unknown) {
  return typeof value === "string" ? getServicePage(value) : undefined;
}

export function getServiceContactHref(slug: string) {
  const service = getServicePage(slug);
  return service
    ? `/contact?service=${encodeURIComponent(service.slug)}`
    : "/contact";
}

export function getRouteService(path: string, value: unknown) {
  return (
    getServicePageForPath(path) ??
    (["/contact", "/request-a-quote"].includes(path)
      ? getContactService(value)
      : undefined)
  );
}

export function serviceContactMessage(service?: ServicePage) {
  return service
    ? `Hello GROWTHLY, I’d like to discuss ${sentenceServiceName(service.label)} for my business.`
    : "Hello GROWTHLY, I have a question about your services.";
}
