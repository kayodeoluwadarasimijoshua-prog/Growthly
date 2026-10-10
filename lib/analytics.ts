export type GrowthlyAnalyticsEvent =
  | "service_cta_click"
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

export function trackEvent(name: GrowthlyAnalyticsEvent | "page_view", params?: EventParameters) {
  if (typeof window === "undefined" || !window.gtag || window.location.pathname.startsWith("/admin")) return;
  try {
    if (window.localStorage.getItem("growthly_analytics_consent") !== "granted") return;
  } catch {
    return;
  }
  window.gtag("event", name, params ?? {});
}

export function trackLeadConversion() {
  trackEvent("generate_lead");

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (adsId && conversionLabel) {
    trackEvent("conversion", { send_to: `${adsId}/${conversionLabel}` });
  }
}
