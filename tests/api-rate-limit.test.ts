import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  configured: vi.fn(),
  local: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseLeadStoreConfig: mocks.configured,
  createSupabaseLeadWriter: () => ({ rpc: mocks.rpc }),
}));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: mocks.local }));
import { checkApiRateLimit } from "@/lib/api-rate-limit";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DISTRIBUTED_RATE_LIMIT_ENABLED", "true");
  vi.stubEnv("TRUST_PROXY_HEADERS", "true");
  vi.stubEnv(
    "RATE_LIMIT_HASH_SECRET",
    "synthetic-secret-for-tests-only-32-characters",
  );
  mocks.configured.mockReturnValue(true);
});
afterEach(() => vi.unstubAllEnvs());
describe("optional shared limiter transport", () => {
  it("uses only local limits when the shared store is not approved", async () => {
    vi.stubEnv("DISTRIBUTED_RATE_LIMIT_ENABLED", "false");
    mocks.local.mockReturnValue({ allowed: true });
    expect(await checkApiRateLimit("inquiry:192.0.2.1", 5, 600000)).toEqual({
      allowed: true,
    });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("hashes the bucket identity before sending it to the existing database", async () => {
    mocks.rpc.mockResolvedValue({
      data: { allowed: false, retry_after: 42 },
      error: null,
    });
    expect(await checkApiRateLimit("inquiry:192.0.2.1", 5, 600000)).toEqual({
      allowed: false,
      retryAfterSeconds: 42,
    });
    const args = mocks.rpc.mock.calls[0][1];
    expect(args.p_bucket_key).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(args)).not.toContain("192.0.2.1");
    expect(args.p_request_limit).toBe(5);
    expect(args.p_window_seconds).toBe(600);
  });
  it("fails closed on a provider outage rather than bypassing limits", async () => {
    mocks.rpc.mockRejectedValue(new Error("offline"));
    expect(
      await checkApiRateLimit("inquiry:192.0.2.1", 5, 600000),
    ).toMatchObject({ allowed: false, unavailable: true });
    expect(mocks.local).not.toHaveBeenCalled();
  });
  it("fails closed on malformed receipts", async () => {
    mocks.rpc.mockResolvedValue({ data: { allowed: true }, error: null });
    expect(
      await checkApiRateLimit("inquiry:192.0.2.1", 5, 600000),
    ).toMatchObject({ unavailable: true });
  });
  for (const setting of ["RATE_LIMIT_HASH_SECRET", "TRUST_PROXY_HEADERS"]) {
    it(`requires approved ${setting} configuration`, async () => {
      vi.stubEnv(setting, "");
      expect(
        await checkApiRateLimit("inquiry:192.0.2.1", 5, 600000),
      ).toMatchObject({ unavailable: true });
      expect(mocks.rpc).not.toHaveBeenCalled();
    });
  }
});
