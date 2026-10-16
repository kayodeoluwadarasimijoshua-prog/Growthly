"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { safeReferrer, trackEvent } from "@/lib/analytics";
import { captureUtmAttribution } from "@/lib/attribution";
import { getServicePageForPath } from "@/config/service-pages";

import {
  analyticsEnabled,
  readConsent,
  writeConsent,
  subscribeConsent,
  type ConsentChoice,
} from "@/lib/analytics-consent";

export function AnalyticsConsent() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    () => "unknown",
  );
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const analyticsConfigured = analyticsEnabled();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const hasAnalytics = analyticsConfigured && !isAdmin;

  useEffect(() => {
    if (!isAdmin && choice === "granted" && hasAnalytics)
      captureUtmAttribution();
  }, [pathname, choice, isAdmin, hasAnalytics]);

  useEffect(() => {
    if (!hasAnalytics || choice !== "granted") {
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
      return;
    }
    if (window.growthlyAnalyticsReady) {
      window.gtag?.("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag =
      window.gtag ??
      ((...args: unknown[]) => {
        window.dataLayer?.push(args);
      });
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    if (gaId) {
      window.gtag("config", gaId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: `${window.location.origin}${window.location.pathname}`,
        page_referrer: safeReferrer(),
      });
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId || "")}`;
    document.head.appendChild(script);
    window.growthlyAnalyticsReady = true;
  }, [choice, gaId, hasAnalytics]);

  useEffect(() => {
    if (!isAdmin && choice === "granted" && window.growthlyAnalyticsReady) {
      trackEvent("page_view", { page_path: pathname });
      if (pathname.startsWith("/portfolio"))
        trackEvent("portfolio_visit", { page_path: pathname });
      if (pathname === "/pricing") trackEvent("pricing_visit");
      const servicePage = getServicePageForPath(pathname);
      if (servicePage)
        trackEvent("service_visit", {
          page_path: pathname,
          service: servicePage.slug,
        });
      else if (["/business-websites", "/ecommerce-websites"].includes(pathname))
        trackEvent("service_visit", {
          page_path: pathname,
          service: "website-development",
        });
    }
  }, [choice, isAdmin, pathname]);

  function choose(next: Exclude<ConsentChoice, "unknown">) {
    writeConsent(next);
  }

  if (!hasAnalytics || choice !== "unknown") return null;

  return (
    <aside
      className="consent-banner"
      aria-label="Optional analytics preferences"
    >
      <div>
        <h2>Optional analytics</h2>
        <p>
          With your permission, we use analytics to understand which pages and
          actions are useful. We never send your form details to analytics. Read
          our <Link href="/privacy-policy">privacy notice</Link>.
        </p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" onClick={() => choose("granted")}>
          Allow analytics
        </button>
        <button type="button" onClick={() => choose("denied")}>
          No thanks
        </button>
      </div>
    </aside>
  );
}

export function AnalyticsPreferencesButton() {
  const pathname = usePathname();
  const configured = analyticsEnabled();
  if (!configured || pathname?.startsWith("/admin")) return null;
  return (
    <button
      className="privacy-preferences-button"
      type="button"
      onClick={() => {
        window.gtag?.("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        writeConsent("unknown");
      }}
    >
      Privacy preferences
    </button>
  );
}
