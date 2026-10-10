"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { captureUtmAttribution } from "@/lib/attribution";

const CONSENT_KEY = "growthly_analytics_consent";
const CONSENT_EVENT = "growthly-analytics-consent-change";

type ConsentChoice = "granted" | "denied" | "unknown";

function getConsentSnapshot(): ConsentChoice {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => "unknown");
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const analyticsConfigured = Boolean(gaId || adsId);
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const hasAnalytics = analyticsConfigured && !isAdmin;

  useEffect(() => {
    captureUtmAttribution();
  }, [pathname]);

  useEffect(() => {
    if (!hasAnalytics) return;
    if (choice !== "granted") {
      if (choice === "denied" && window.gtag) {
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
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => { window.dataLayer?.push(args); });
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    window.gtag("js", new Date());
    if (gaId) {
      window.gtag("config", gaId, { send_page_view: false, allow_google_signals: false });
    }
    if (adsId) {
      window.gtag("config", adsId, { send_page_view: false });
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId || adsId || "")}`;
    document.head.appendChild(script);
    window.growthlyAnalyticsReady = true;
  }, [adsId, choice, gaId, hasAnalytics]);

  useEffect(() => {
    if (!isAdmin && choice === "granted" && window.growthlyAnalyticsReady) {
      trackEvent("page_view", { page_path: pathname });
    }
  }, [choice, isAdmin, pathname]);

  function choose(next: Exclude<ConsentChoice, "unknown">) {
    try {
      window.localStorage.setItem(CONSENT_KEY, next);
    } catch {
      // If local storage is unavailable, this choice applies only until navigation or reload.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (!hasAnalytics || choice !== "unknown") return null;

  return (
    <aside className="consent-banner" aria-label="Optional analytics preferences">
      <div>
        <h2>Optional analytics</h2>
        <p>
          With your permission, we use analytics to understand which pages and actions are useful. We never send your form details to analytics. Read our{" "}
          <Link href="/privacy">privacy notice</Link>.
        </p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" onClick={() => choose("granted")}>Allow analytics</button>
        <button type="button" onClick={() => choose("denied")}>No thanks</button>
      </div>
    </aside>
  );
}

export function AnalyticsPreferencesButton() {
  const pathname = usePathname();
  const configured = Boolean(process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID);
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
        try {
          window.localStorage.removeItem(CONSENT_KEY);
        } catch {
          // The banner remains available for this page if storage is blocked.
        }
        window.dispatchEvent(new Event(CONSENT_EVENT));
      }}
    >
      Privacy preferences
    </button>
  );
}
