export const CONSENT_KEY = "growthly_analytics_consent";
export const CONSENT_EVENT = "growthly-analytics-consent-change";
export type ConsentChoice = "granted" | "denied" | "unknown";
let memoryChoice: ConsentChoice | undefined;

export function analyticsEnabled() {
  // An account ID alone is not approval to collect. Ads are intentionally not loaded.
  return (
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    Boolean(process.env.NEXT_PUBLIC_GA4_ID)
  );
}
export function readConsent(): ConsentChoice {
  if (typeof window === "undefined") return "unknown";
  if (memoryChoice !== undefined) return memoryChoice;
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  } catch {
    return "unknown";
  }
}
export function writeConsent(choice: ConsentChoice) {
  memoryChoice = choice;
  try {
    if (choice === "unknown") window.localStorage.removeItem(CONSENT_KEY);
    else window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* A blocked storage choice still works for this page session. */
  }
  if (choice !== "granted") {
    try {
      window.sessionStorage.removeItem("growthly_campaign_attribution");
    } catch {
      /* Optional storage. */
    }
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
export function subscribeConsent(callback: () => void) {
  const storageChanged = () => {
    memoryChoice = undefined;
    callback();
  };
  window.addEventListener("storage", storageChanged);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}
