import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ verify: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseAuthConfig: () => true,
  createSupabaseServerClient: async () => ({
    auth: { verifyOtp: mocks.verify },
  }),
}));
import { GET } from "@/app/auth/confirm/route";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://growthly.com.ng");
  mocks.verify.mockResolvedValue({ error: null });
});
afterEach(() => vi.unstubAllEnvs());
it("consumes an invitation hash without forwarding tokens or accepting an arbitrary destination", async () => {
  const response = await GET(
    new NextRequest(
      `https://growthly.com.ng/auth/confirm?type=invite&token_hash=${"a".repeat(64)}&next=https://foreign.invalid`,
    ),
  );
  expect(response.headers.get("location")).toBe(
    "https://growthly.com.ng/creative/password",
  );
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(response.headers.get("referrer-policy")).toBe("no-referrer");
  expect(mocks.verify).toHaveBeenCalledWith({
    token_hash: "a".repeat(64),
    type: "invite",
  });
});
it("does not verify other token types or malformed invitation hashes", async () => {
  const response = await GET(
    new NextRequest(
      "https://growthly.com.ng/auth/confirm?type=recovery&token_hash=invalid",
    ),
  );
  expect(response.headers.get("location")).toBe(
    "https://growthly.com.ng/admin/login",
  );
  expect(mocks.verify).not.toHaveBeenCalled();
});
