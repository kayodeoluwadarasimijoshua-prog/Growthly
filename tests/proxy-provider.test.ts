import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ create: vi.fn(), getUser: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.create }));
import { proxy } from "@/proxy";
import { providerFetch } from "@/lib/provider-fetch";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://synthetic.invalid");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "synthetic-not-a-secret");
  mocks.create.mockReturnValue({ auth: { getUser: mocks.getUser } });
  mocks.getUser.mockResolvedValue({ data: { user: null } });
});
afterEach(() => vi.unstubAllEnvs());
it("bounds the middleware provider transport as well as route clients", async () => {
  await proxy(new NextRequest("https://growthly.example/admin"));
  expect(mocks.create.mock.calls[0][2].global.fetch).toBe(providerFetch);
});
it("provider failures still reach the independent route authorization check", async () => {
  mocks.getUser.mockRejectedValue(new Error("timeout"));
  const response = await proxy(
    new NextRequest("https://growthly.example/admin"),
  );
  expect(response.headers.get("x-middleware-next")).toBe("1");
});
it("does not initialize any provider without auth configuration", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  await proxy(new NextRequest("https://growthly.example/admin"));
  expect(mocks.create).not.toHaveBeenCalled();
});
