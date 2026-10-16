import { afterEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, requestIp, MAX_RATE_BUCKETS } from "@/lib/rate-limit";

describe("request rate limiting", () => {
  it("allows a bounded number of requests and then blocks the key", () => {
    const key = `test-${crypto.randomUUID()}`;
    expect(checkRateLimit(key, 2, 60_000).allowed).toBe(true);
    expect(checkRateLimit(key, 2, 60_000).allowed).toBe(true);
    const blocked = checkRateLimit(key, 2, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
it("does not trust forwarded client headers without an explicit host decision", () => {
  vi.stubEnv("TRUST_PROXY_HEADERS", "false");
  expect(
    requestIp(
      new Request("https://growthly.example", {
        headers: { "x-forwarded-for": "192.0.2.1" },
      }),
    ),
  ).toBe("unknown");
});
it("accepts only valid IPs once the proxy is explicitly trusted", () => {
  vi.stubEnv("TRUST_PROXY_HEADERS", "true");
  expect(
    requestIp(
      new Request("https://growthly.example", {
        headers: { "x-forwarded-for": "192.0.2.1, 192.0.2.2" },
      }),
    ),
  ).toBe("192.0.2.1");
  expect(
    requestIp(
      new Request("https://growthly.example", {
        headers: { "x-forwarded-for": "fake-client-key" },
      }),
    ),
  ).toBe("unknown");
});
it("bounds the cache even when every incoming key is new", () => {
  vi.useFakeTimers();
  const state = globalThis as typeof globalThis & {
    __growthlyRateBuckets: Map<string, { count: number; resetAt: number }>;
  };
  state.__growthlyRateBuckets.clear();
  for (let i = 0; i < MAX_RATE_BUCKETS; i++)
    expect(checkRateLimit(`capacity:${i}`, 2, 60000).allowed).toBe(true);
  expect(checkRateLimit("overflow", 2, 60000).allowed).toBe(false);
  expect(state.__growthlyRateBuckets.size).toBe(MAX_RATE_BUCKETS);
  expect(checkRateLimit("capacity:0", 2, 60000).allowed).toBe(true);
  vi.advanceTimersByTime(60001);
  expect(checkRateLimit("after-expiry", 2, 60000).allowed).toBe(true);
  state.__growthlyRateBuckets.clear();
});
