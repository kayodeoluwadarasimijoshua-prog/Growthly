import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseAuthConfig: () => true,
  createSupabaseServerClient: async () => ({ auth: { getUser: mocks.user } }),
}));
import { getStudioContext } from "@/lib/supabase/studio";
import { getAdminContext } from "@/lib/supabase/admin";
beforeEach(() => vi.clearAllMocks());
describe("restricted creative identity", () => {
  it("accepts a server-assigned creative role without granting owner access", async () => {
    mocks.user.mockResolvedValue({
      data: {
        user: {
          id: "synthetic-creative",
          app_metadata: { role: "creative_editor" },
          user_metadata: { role: "admin" },
        },
      },
      error: null,
    });
    expect((await getStudioContext()).ok).toBe(true);
    expect(await getAdminContext()).toMatchObject({
      ok: false,
      reason: "forbidden",
    });
  });
  it("does not grant a role through editable metadata or an email address", async () => {
    mocks.user.mockResolvedValue({
      data: {
        user: {
          id: "synthetic-unassigned",
          email: "synthetic-owner@example.com",
          app_metadata: {},
          user_metadata: { role: "creative_editor" },
        },
      },
      error: null,
    });
    expect((await getStudioContext()).ok).toBe(false);
  });
  it("keeps the real owner role authorized in both workspaces", async () => {
    mocks.user.mockResolvedValue({
      data: {
        user: { id: "synthetic-owner", app_metadata: { role: "admin" } },
      },
      error: null,
    });
    expect((await getStudioContext()).ok).toBe(true);
    expect((await getAdminContext()).ok).toBe(true);
  });
});
