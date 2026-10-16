import { afterEach, describe, expect, it, vi } from "vitest";
import { isSameOriginRequest } from "@/lib/request-security";

describe("same-origin request guard", () => {
  it("accepts matching request origin and host", () => {
    const request = new Request("https://growthly.example/api/admin/leads/1", {
      method: "POST",
      headers: { origin: "https://growthly.example", host: "growthly.example" },
    });
    expect(isSameOriginRequest(request)).toBe(true);
  });

  it("rejects a cross-origin request", () => {
    const request = new Request("https://growthly.example/api/admin/leads/1", {
      method: "POST",
      headers: {
        origin: "https://attacker.example",
        host: "growthly.example",
        "sec-fetch-site": "cross-site",
      },
    });
    expect(isSameOriginRequest(request)).toBe(false);
  });

  it("rejects a state-changing request that has neither Origin nor same-origin Fetch Metadata", () => {
    const request = new Request("https://growthly.example/api/admin/leads/1", {
      method: "PATCH",
      headers: { host: "growthly.example" },
    });
    expect(isSameOriginRequest(request)).toBe(false);
  });

  it("accepts browser same-origin metadata after a trusted reverse proxy rewrites Host", () => {
    const request = new Request("https://internal.example/api/inquiries", {
      method: "POST",
      headers: {
        origin: "https://3000-preview.e2b.app",
        host: "internal.example",
        "sec-fetch-site": "same-origin",
      },
    });
    expect(isSameOriginRequest(request)).toBe(true);
  });
});

afterEach(() => vi.unstubAllEnvs());
it("ignores a forged forwarded host unless the host trust setting is enabled", () => {
  vi.stubEnv("TRUST_PROXY_HEADERS", "false");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://growthly.example");
  const r = new Request("https://growthly.example/api/inquiries", {
    headers: {
      host: "growthly.example",
      origin: "https://attacker.example",
      "x-forwarded-host": "attacker.example",
    },
  });
  expect(isSameOriginRequest(r)).toBe(false);
});
