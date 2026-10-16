import {
  publicServiceSlugs,
  publicRoutePaths,
} from "@/config/public-route-ids";
import { websitePackages } from "@/config/business";
import { analyticsEnabled, readConsent } from "@/lib/analytics-consent";
export type GrowthlyAnalyticsEvent =
  | "service_cta_click"
  | "quote_cta_click"
  | "portfolio_visit"
  | "pricing_visit"
  | "service_visit"
  | "whatsapp_click"
  | "phone_click"
  | "generate_lead"
  | "conversion";

type EventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    growthlyAnalyticsReady?: boolean;
  }
}

const publicPaths = new Set(publicRoutePaths);
function isPublicPath(path: string) {
  if (publicPaths.has(path)) return true;
  // New CMS case studies are allowed only when the server actually rendered a
  // published project for this exact pathname. No query/referrer-derived registry.
  return (
    typeof document !== "undefined" &&
    /^\/portfolio\/[a-z0-9-]{1,80}$/.test(path) &&
    document
      .querySelector?.("[data-published-project]")
      ?.getAttribute("data-published-project") === path
  );
}
function safeParameters(params: EventParameters = {}) {
  const safe: EventParameters = {};
  if (publicServiceSlugs.some((s) => s === params.service))
    safe.service = params.service;
  if (websitePackages.some((p) => p.id === params.package))
    safe.package = params.package;
  if (params.placement === "floating_contact")
    safe.placement = params.placement;
  if (params.contact_type === "alternative_phone")
    safe.contact_type = params.contact_type;
  if (typeof params.page_path === "string" && isPublicPath(params.page_path))
    safe.page_path = params.page_path;
  return safe;
}

export function trackEvent(
  name: GrowthlyAnalyticsEvent | "page_view",
  params?: EventParameters,
) {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    name === "conversion" ||
    !isPublicPath(window.location.pathname) ||
    !analyticsEnabled() ||
    readConsent() !== "granted" ||
    window.location.pathname.startsWith("/admin")
  )
    return;
  window.gtag("event", name, {
    ...safeParameters(params),
    page_location: `${window.location.origin}${window.location.pathname}`,
    page_referrer: safeReferrer(),
  });
}

export function trackLeadConversion() {
  trackEvent("generate_lead");
}

export function safeReferrer() {
  if (typeof document === "undefined" || !document.referrer) return "";
  try {
    const url = new URL(document.referrer);
    return url.origin;
  } catch {
    return "";
  }
}
