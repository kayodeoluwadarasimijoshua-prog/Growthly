import { afterEach, expect, it, vi } from "vitest";
import config from "../next.config";
afterEach(() => vi.unstubAllEnvs());
it("blocks objects, base replacement and foreign form posting without blocking the embedded preview", async () => {
  const rules = await config.headers!();
  const global = rules.find((r) => r.source === "/:path*" && !r.has)!;
  const csp = global.headers.find(
    (h) => h.key === "Content-Security-Policy",
  )!.value;
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).not.toContain("frame-ancestors");
  expect(csp).not.toContain("report-uri");
});
it("retains the baseline restrictions alongside custom production-host frame protection", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://growthly.com.ng");
  const rules = await config.headers!();
  const host = rules.find((r) =>
    r.has?.some((h) => h.type === "host" && h.value === "growthly.com.ng"),
  )!;
  const csp = host.headers.find(
    (h) => h.key === "Content-Security-Policy",
  )!.value;
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("form-action 'self'");
});
it("never applies the production frame block to an explicit preview hostname", async () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://synthetic.e2b.app");
  const rules = await config.headers!();
  expect(
    rules.some((r) => r.headers.some((h) => h.key === "X-Frame-Options")),
  ).toBe(false);
});
