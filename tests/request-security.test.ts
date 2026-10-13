import { describe, expect, it } from "vitest";
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
