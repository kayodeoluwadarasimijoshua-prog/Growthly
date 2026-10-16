import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  create: vi.fn(),
  getUser: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseAuthConfig: mocks.configured,
  createSupabaseServerClient: mocks.create,
}));
import { getAdminContext } from "@/lib/supabase/admin";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.configured.mockReturnValue(true);
  mocks.create.mockResolvedValue({ auth: { getUser: mocks.getUser } });
});
describe("VA planning must not widen existing administrator access", () => {
  for (const role of ["assistant", "support", "customer", undefined])
    it(`does not grant ${role ?? "unassigned"} users full lead access`, async () => {
      mocks.getUser.mockResolvedValue({
        data: {
          user: {
            id: "synthetic-user",
            app_metadata: { role },
            user_metadata: { role: "admin" },
          },
        },
        error: null,
      });
      expect(await getAdminContext()).toEqual({
        ok: false,
        reason: "forbidden",
      });
    });
  it("does not trust an absent user or a provider auth error", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("synthetic auth failure"),
    });
    expect(await getAdminContext()).toEqual({
      ok: false,
      reason: "unauthenticated",
    });
  });
  it("preserves the established server-controlled admin role", async () => {
    mocks.getUser.mockResolvedValue({
      data: {
        user: { id: "synthetic-admin", app_metadata: { role: "admin" } },
      },
      error: null,
    });
    expect((await getAdminContext()).ok).toBe(true);
  });
});
