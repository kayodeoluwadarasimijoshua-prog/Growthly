const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const STORAGE_KEY = "growthly_campaign_attribution";

type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>>;

function valuesFromParams(params: URLSearchParams): Attribution {
  return Object.fromEntries(
    UTM_KEYS
      .map((key) => [key, params.get(key)?.trim().slice(0, 160) ?? ""] as const)
      .filter(([, value]) => value.length > 0),
  );
}

export function captureUtmAttribution() {
  if (typeof window === "undefined") return;
  const incoming = valuesFromParams(new URLSearchParams(window.location.search));
  if (!Object.keys(incoming).length) return;
  try {
    const existing = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Attribution;
    const safeExisting = valuesFromParams(new URLSearchParams(
      Object.entries(existing).map(([key, value]) => [key, String(value)] as [string, string]),
    ));
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...safeExisting, ...incoming }));
  } catch {
    // Attribution is optional. The inquiry can still be submitted if storage is blocked.
  }
}

export function getUtmAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const fromCurrentUrl = valuesFromParams(new URLSearchParams(window.location.search));
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}") as Attribution;
    const safeStored = valuesFromParams(new URLSearchParams(
      Object.entries(stored).map(([key, value]) => [key, String(value)] as [string, string]),
    ));
    return { ...safeStored, ...fromCurrentUrl };
  } catch {
    return fromCurrentUrl;
  }
}
