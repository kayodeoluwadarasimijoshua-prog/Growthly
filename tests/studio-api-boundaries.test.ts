import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { blankCreativeProject } from "@/lib/cms/creative";
const mocks = vi.hoisted(() => ({
  owner: vi.fn(),
  studio: vi.fn(),
  invite: vi.fn(),
  updateRole: vi.fn(),
  rpc: vi.fn(),
  updatePassword: vi.fn(),
  available: vi.fn(),
  ai: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({ getAdminContext: mocks.owner }));
vi.mock("@/lib/supabase/studio", () => ({ getStudioContext: mocks.studio }));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseLeadStoreConfig: () => true,
  createSupabaseLeadWriter: () => ({
    auth: {
      admin: {
        inviteUserByEmail: mocks.invite,
        updateUserById: mocks.updateRole,
      },
    },
  }),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: () => ({ allowed: true }),
}));
vi.mock("@/lib/studio-ai", () => ({
  studioAIAvailable: mocks.available,
  askStudioAI: mocks.ai,
  refinementPreservesFacts: () => true,
}));
import { POST as invite } from "@/app/api/admin/creative/invite/route";
import { POST as save } from "@/app/api/creative/projects/route";
import { POST as refine } from "@/app/api/creative/refine/route";
import { POST as password } from "@/app/api/creative/password/route";
const project = {
  ...blankCreativeProject("11111111-1111-4111-8111-111111111111"),
  name: "Synthetic advert",
  summary: "Synthetic project description for a test.",
};
const request = (
  path: string,
  body: unknown,
  origin = "https://growthly.com.ng",
) =>
  new NextRequest(`https://growthly.com.ng${path}`, {
    method: "POST",
    headers: { host: "growthly.com.ng", origin },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://growthly.com.ng");
  vi.stubEnv("CREATIVE_INVITES_ENABLED", "true");
  mocks.owner.mockResolvedValue({
    ok: true,
    user: { id: "synthetic-owner", email: "owner@example.com" },
    supabase: {
      from: () => ({
        select: () => ({ limit: async () => ({ error: null }) }),
      }),
    },
  });
  mocks.studio.mockResolvedValue({
    ok: true,
    role: "creative_editor",
    user: { id: "synthetic-creative" },
    supabase: {
      rpc: mocks.rpc,
      auth: { updateUser: mocks.updatePassword },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { created_by: "someone-else", width: 100, height: 100 },
            }),
          }),
        }),
      }),
    },
  });
  mocks.invite.mockResolvedValue({
    data: { user: { id: "synthetic-invited", app_metadata: {} } },
    error: null,
  });
  mocks.updateRole.mockResolvedValue({ error: null });
  mocks.rpc.mockResolvedValue({ data: 1, error: null });
  mocks.updatePassword.mockResolvedValue({ error: null });
  mocks.available.mockReturnValue(true);
  mocks.ai.mockResolvedValue(
    "A clearer description of the supplied creative work.",
  );
});
afterEach(() => vi.unstubAllEnvs());
describe("owner-only invitations and private creative APIs", () => {
  it("does not let a creative editor send invitations or grant themselves a role", async () => {
    mocks.owner.mockResolvedValue({ ok: false, reason: "forbidden" });
    expect(
      (
        await invite(
          request("/api/admin/creative/invite", {
            email: "friend@example.com",
          }),
        )
      ).status,
    ).toBe(403);
    expect(mocks.invite).not.toHaveBeenCalled();
    expect(mocks.updateRole).not.toHaveBeenCalled();
  });
  it("requires explicit invitation setup and rejects role injection and the owner identity", async () => {
    vi.stubEnv("CREATIVE_INVITES_ENABLED", "false");
    expect(
      (
        await invite(
          request("/api/admin/creative/invite", {
            email: "friend@example.com",
          }),
        )
      ).status,
    ).toBe(503);
    vi.stubEnv("CREATIVE_INVITES_ENABLED", "true");
    expect(
      (
        await invite(
          request("/api/admin/creative/invite", {
            email: "friend@example.com",
            role: "admin",
          }),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await invite(
          request("/api/admin/creative/invite", { email: "OWNER@example.com" }),
        )
      ).status,
    ).toBe(400);
    expect(mocks.invite).not.toHaveBeenCalled();
  });
  it("invites a new identity only into the fixed creative role", async () => {
    expect(
      (
        await invite(
          request("/api/admin/creative/invite", {
            email: "friend@example.com",
          }),
        )
      ).status,
    ).toBe(200);
    expect(mocks.updateRole).toHaveBeenCalledWith("synthetic-invited", {
      app_metadata: { role: "creative_editor" },
    });
    expect(mocks.invite).toHaveBeenCalledWith("friend@example.com", {
      redirectTo: "https://growthly.com.ng/creative/password",
    });
  });
  it("saves an allowed private project but rejects paid ads, publication escalation and foreign media", async () => {
    const body = { project, expectedRevision: 0, status: "draft" };
    expect((await save(request("/api/creative/projects", body))).status).toBe(
      200,
    );
    mocks.rpc.mockClear();
    for (const patch of [
      { service: "digital-advertising" },
      { published: true },
      { featured: true },
      {
        image: {
          assetId: "22222222-2222-4222-8222-222222222222",
          width: 100,
          height: 100,
          alt: "Test image",
          credit: "Test credit",
          permissionConfirmed: false,
        },
      },
    ])
      expect(
        (
          await save(
            request("/api/creative/projects", {
              ...body,
              project: { ...project, ...patch },
            }),
          )
        ).status,
      ).toBe(400);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("returns a conflict without replacing a stale draft", async () => {
    mocks.rpc.mockResolvedValue({ error: { code: "40001" } });
    expect(
      (
        await save(
          request("/api/creative/projects", {
            project,
            expectedRevision: 0,
            status: "submitted",
          }),
        )
      ).status,
    ).toBe(409);
  });
  it("limits a creative writer to its services and never publishes the suggestion", async () => {
    const body = {
      source: "We made a product advert from a client-supplied script.",
      service: "website-development",
    };
    expect((await refine(request("/api/creative/refine", body))).status).toBe(
      403,
    );
    expect(mocks.ai).not.toHaveBeenCalled();
    expect(
      (
        await refine(
          request("/api/creative/refine", {
            ...body,
            service: "ai-video-adverts",
          }),
        )
      ).status,
    ).toBe(200);
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("requires the invited role and a same-origin request to set its own password", async () => {
    expect(
      (
        await password(
          request(
            "/api/creative/password",
            { password: "synthetic-long-password" },
            "https://foreign.invalid",
          ),
        )
      ).status,
    ).toBe(403);
    expect(
      (await password(request("/api/creative/password", { password: "short" })))
        .status,
    ).toBe(400);
    expect(mocks.updatePassword).not.toHaveBeenCalled();
    expect(
      (
        await password(
          request("/api/creative/password", {
            password: "synthetic-long-password",
          }),
        )
      ).status,
    ).toBe(200);
  });
});
