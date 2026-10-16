import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
let store: Map<string, string>;
let session: Map<string, string>;
let browser: EventTarget & {
  localStorage: object;
  sessionStorage: object;
  location: object;
  gtag: ReturnType<typeof vi.fn>;
};
beforeEach(() => {
  vi.resetModules();
  store = new Map();
  session = new Map();
  browser = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
    },
    sessionStorage: {
      getItem: (k: string) => session.get(k) ?? null,
      setItem: (k: string, v: string) => session.set(k, v),
      removeItem: (k: string) => session.delete(k),
    },
    location: {
      pathname: "/pricing",
      origin: "https://growthly.example",
      search: "?utm_source=synthetic&email=private@example.com",
    },
    gtag: vi.fn(),
  });
  vi.stubGlobal("window", browser);
  vi.stubGlobal("document", {
    referrer: "https://external.example/private/person@example.com?secret=123",
  });
  vi.stubEnv("NEXT_PUBLIC_GA4_ID", "G-SYNTHETIC");
  vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ID", "AW-SYNTHETIC");
  vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "false");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
describe("optional analytics approval, consent and data minimisation", () => {
  it("account IDs alone do not enable tracking or attribution", async () => {
    const { analyticsEnabled, writeConsent } =
      await import("@/lib/analytics-consent");
    const { trackEvent } = await import("@/lib/analytics");
    const { captureUtmAttribution, getUtmAttribution } =
      await import("@/lib/attribution");
    writeConsent("granted");
    expect(analyticsEnabled()).toBe(false);
    captureUtmAttribution();
    expect(getUtmAttribution()).toEqual({});
    expect(session.size).toBe(0);
    trackEvent("pricing_visit");
    expect(browser.gtag).not.toHaveBeenCalled();
  });
  it("Ads IDs alone never activate the analytics prompt", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA4_ID", "");
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    const { analyticsEnabled } = await import("@/lib/analytics-consent");
    expect(analyticsEnabled()).toBe(false);
  });
  it("allows then withdraws consent even when browser storage is blocked", async () => {
    browser.localStorage = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };
    const { readConsent, writeConsent, subscribeConsent } =
      await import("@/lib/analytics-consent");
    const listener = vi.fn();
    const unsubscribe = subscribeConsent(listener);
    writeConsent("granted");
    expect(readConsent()).toBe("granted");
    writeConsent("denied");
    expect(readConsent()).toBe("denied");
    writeConsent("unknown");
    expect(readConsent()).toBe("unknown");
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
    writeConsent("denied");
    expect(listener).toHaveBeenCalledTimes(3);
  });
  it("an explicit choice wins even when reads work but writes exceed storage quota", async () => {
    store.set("growthly_analytics_consent", "granted");
    browser.localStorage = {
      getItem: (k: string) => store.get(k),
      setItem() {
        throw new Error("quota");
      },
      removeItem() {
        throw new Error("quota");
      },
    };
    const { readConsent, writeConsent } =
      await import("@/lib/analytics-consent");
    writeConsent("denied");
    expect(readConsent()).toBe("denied");
    writeConsent("unknown");
    expect(readConsent()).toBe("unknown");
  });
  it("captures only whitelisted campaign parameters after approved opt-in and clears them on withdrawal", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    const { writeConsent } = await import("@/lib/analytics-consent");
    const { captureUtmAttribution, getUtmAttribution } =
      await import("@/lib/attribution");
    captureUtmAttribution();
    expect(session.size).toBe(0);
    writeConsent("granted");
    captureUtmAttribution();
    expect(getUtmAttribution()).toEqual({ utm_source: "synthetic" });
    expect(JSON.stringify([...session.values()])).not.toContain(
      "private@example.com",
    );
    writeConsent("denied");
    expect(getUtmAttribution()).toEqual({});
    expect(session.size).toBe(0);
  });
  it("manual events exclude URL queries and external referrer paths; Ads conversions are not sent", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    const { writeConsent } = await import("@/lib/analytics-consent");
    const { trackLeadConversion } = await import("@/lib/analytics");
    writeConsent("granted");
    trackLeadConversion();
    expect(browser.gtag).toHaveBeenCalledTimes(1);
    expect(browser.gtag.mock.calls[0]).toEqual([
      "event",
      "generate_lead",
      {
        page_location: "https://growthly.example/pricing",
        page_referrer: "https://external.example",
      },
    ]);
  });
  it("new ad landing events remain consent-gated and exclude query/private data", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    const { writeConsent } = await import("@/lib/analytics-consent");
    const { trackEvent } = await import("@/lib/analytics");
    browser.location = {
      pathname: "/aiads",
      origin: "https://growthly.example",
      search: "?utm_campaign=sample&email=private@example.com",
    };
    trackEvent("service_visit", {
      service: "ai-video-adverts",
      page_path: "/aiads",
    });
    expect(browser.gtag).not.toHaveBeenCalled();
    writeConsent("granted");
    trackEvent("service_visit", {
      service: "ai-video-adverts",
      page_path: "/aiads",
      email: "private@example.com",
    });
    expect(browser.gtag.mock.calls[0]).toEqual([
      "event",
      "service_visit",
      {
        service: "ai-video-adverts",
        page_path: "/aiads",
        page_location: "https://growthly.example/aiads",
        page_referrer: "https://external.example",
      },
    ]);
    writeConsent("denied");
    trackEvent("service_visit", {
      service: "ai-video-adverts",
      page_path: "/aiads",
    });
    expect(browser.gtag).toHaveBeenCalledTimes(1);
  });
  it("denies manual events in private admin pages", async () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
    const { writeConsent } = await import("@/lib/analytics-consent");
    const { trackEvent } = await import("@/lib/analytics");
    writeConsent("granted");
    browser.location = {
      pathname: "/admin",
      origin: "https://growthly.example",
    };
    trackEvent("page_view");
    expect(browser.gtag).not.toHaveBeenCalled();
  });
});

it("manual events allow only known non-personal dimensions and public routes", async () => {
  vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
  const { writeConsent } = await import("@/lib/analytics-consent");
  const { trackEvent } = await import("@/lib/analytics");
  writeConsent("granted");
  trackEvent("quote_cta_click", {
    service: "website-development",
    email: "private@example.com",
    brief: "Private brief",
    page_path: "/private/person@example.com",
    send_to: "AW-SYNTHETIC",
  });
  expect(browser.gtag.mock.calls[0][2]).toEqual({
    service: "website-development",
    page_location: "https://growthly.example/pricing",
    page_referrer: "https://external.example",
  });
  trackEvent("conversion", { send_to: "AW-SYNTHETIC" });
  expect(browser.gtag).toHaveBeenCalledTimes(1);
  browser.location = {
    pathname: "/private/person@example.com",
    origin: "https://growthly.example",
  };
  trackEvent("page_view");
  expect(browser.gtag).toHaveBeenCalledTimes(1);
});

it("only allows a new CMS project analytics pathname when its published route rendered it", async () => {
  vi.stubEnv("NEXT_PUBLIC_ANALYTICS_ENABLED", "true");
  const { writeConsent } = await import("@/lib/analytics-consent");
  const { trackEvent } = await import("@/lib/analytics");
  writeConsent("granted");
  browser.location = {
    pathname: "/portfolio/synthetic-new-public-project",
    origin: "https://growthly.example",
  };
  trackEvent("page_view", {
    page_path: "/portfolio/synthetic-new-public-project",
  });
  expect(browser.gtag).not.toHaveBeenCalled();
  vi.stubGlobal("document", {
    querySelector: () => ({
      getAttribute: () => "/portfolio/synthetic-new-public-project",
    }),
  });
  trackEvent("page_view", {
    page_path: "/portfolio/synthetic-new-public-project",
  });
  expect(browser.gtag).toHaveBeenCalled();
  browser.gtag.mockClear();
  browser.location = {
    pathname: "/admin/content",
    origin: "https://growthly.example",
  };
  trackEvent("page_view", { page_path: "/admin/content" });
  expect(browser.gtag).not.toHaveBeenCalled();
});
