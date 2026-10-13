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

export function trackEvent(
  name: GrowthlyAnalyticsEvent | "page_view",
  params?: EventParameters,
) {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    window.location.pathname.startsWith("/admin")
  )
    return;
  try {
    if (window.localStorage.getItem("growthly_analytics_consent") !== "granted")
      return;
  } catch {
    return;
  }
  window.gtag("event", name, {
    ...params,
    page_location: `${window.location.origin}${window.location.pathname}`,
    page_referrer: safeReferrer(),
  });
}

export function trackLeadConversion() {
  trackEvent("generate_lead");

  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  if (adsId && conversionLabel) {
    trackEvent("conversion", { send_to: `${adsId}/${conversionLabel}` });
  }
}

export function safeReferrer() {
  if (typeof document === "undefined" || !document.referrer) return "";
  try {
    const url = new URL(document.referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}
