import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { defaultCmsDocument } from "@/lib/cms/defaults";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  configured: vi.fn(),
  rpc: vi.fn(),
  limit: vi.fn(),
  from: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({ getAdminContext: mocks.auth }));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseConfig: mocks.configured,
}));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: mocks.limit }));
import { GET, POST } from "@/app/api/admin/content/route";
let draft = defaultCmsDocument(),
  published: ReturnType<typeof defaultCmsDocument> | null = null,
  revision = 0;
const history: {
  revision: number;
  document: typeof draft;
  published: boolean;
  created_at: string;
}[] = [];
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SITE_CMS_ENABLED", "true");
  draft = defaultCmsDocument();
  published = null;
  revision = 0;
  history.length = 0;
  mocks.configured.mockReturnValue(true);
  mocks.limit.mockReturnValue({ allowed: true });
  mocks.auth.mockResolvedValue({
    ok: true,
    user: { id: "synthetic-owner" },
    supabase: { from: mocks.from, rpc: mocks.rpc },
  });
  mocks.from.mockImplementation((table: string) => ({
    select: () => ({
      eq: (_key: string, value: unknown) => ({
        single: async () =>
          table === "growthly_site_content"
            ? {
                data: { revision, draft, published, published_at: null },
                error: null,
              }
            : { data: history.find((h) => h.revision === value), error: null },
      }),
      order: () => ({
        limit: async () => ({
          data: history.map(({ revision, published, created_at }) => ({
            revision,
            published,
            created_at,
          })),
          error: null,
        }),
      }),
      in: async () => ({ data: [], error: null }),
    }),
  }));
  mocks.rpc.mockImplementation(
    async (
      _name: string,
      args: {
        p_expected: number;
        p_document: typeof draft;
        p_publish: boolean;
      },
    ) => {
      if (args.p_expected !== revision) return { error: { code: "40001" } };
      revision++;
      draft = structuredClone(args.p_document);
      if (args.p_publish) published = structuredClone(args.p_document);
      history.push({
        revision,
        document: structuredClone(args.p_document),
        published: args.p_publish,
        created_at: "2026-10-15T00:00:00Z",
      });
      return { data: revision, error: null };
    },
  );
});
afterEach(() => vi.unstubAllEnvs());
function req(data: unknown, origin = "https://growthly.com.ng") {
  return new NextRequest("https://growthly.com.ng/api/admin/content", {
    method: "POST",
    headers: {
      host: "growthly.com.ng",
      origin,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
describe("private content API (provider mocks, not a live account)", () => {
  it("denies unauthenticated/assistant access and rejects cross-origin writes before reading content", async () => {
    expect((await POST(req({}, "https://untrusted.invalid"))).status).toBe(403);
    expect(mocks.auth).not.toHaveBeenCalled();
    mocks.auth.mockResolvedValue({ ok: false, reason: "forbidden" });
    expect((await GET()).status).toBe(403);
    expect((await POST(req({}))).status).toBe(403);
    expect(mocks.from).not.toHaveBeenCalled();
  });
  it("saves a draft privately and publishes only on explicit action", async () => {
    let r = await POST(
      req({ action: "save", expectedRevision: 0, document: draft }),
    );
    expect(r.status).toBe(200);
    expect(published).toBeNull();
    expect(r.headers.get("cache-control")).toBe("private, no-store");
    r = await POST(
      req({ action: "publish", expectedRevision: 1, document: draft }),
    );
    expect(r.status).toBe(200);
    expect(published?.projects[0].slug).toBe("starxco");
    expect((await GET()).headers.get("cache-control")).toBe(
      "private, no-store",
    );
  });
  it("requires price confirmation and rejects stale-tab overwrites", async () => {
    draft.settings.prices.starter = 150000;
    expect(
      (
        await POST(
          req({ action: "publish", expectedRevision: 0, document: draft }),
        )
      ).status,
    ).toBe(400);
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(
      (
        await POST(
          req({
            action: "publish",
            expectedRevision: 0,
            document: draft,
            confirmPricing: true,
          }),
        )
      ).status,
    ).toBe(200);
    expect(
      (
        await POST(
          req({ action: "save", expectedRevision: 0, document: draft }),
        )
      ).status,
    ).toBe(409);
    expect(revision).toBe(1);
  });
  it("refuses unapproved projects, unregistered images and renamed live URLs", async () => {
    draft.projects[0].publicationConfirmed = false;
    expect(
      (
        await POST(
          req({ action: "publish", expectedRevision: 0, document: draft }),
        )
      ).status,
    ).toBe(400);
    draft = defaultCmsDocument();
    await POST(
      req({ action: "publish", expectedRevision: 0, document: draft }),
    );
    draft.projects[0].slug = "renamed";
    expect(
      (
        await POST(
          req({ action: "publish", expectedRevision: 1, document: draft }),
        )
      ).status,
    ).toBe(400);
    draft.projects[0].slug = "starxco";
    draft.projects[0].image = {
      assetId: "11111111-1111-4111-8111-111111111111",
      width: 800,
      height: 400,
      alt: "Synthetic project image",
      credit: "Synthetic source",
      permissionConfirmed: true,
    };
    expect(
      (
        await POST(
          req({ action: "publish", expectedRevision: 1, document: draft }),
        )
      ).status,
    ).toBe(400);
  });
  it("restores history as a draft with permissions requiring review, not an immediate rollback", async () => {
    await POST(
      req({ action: "publish", expectedRevision: 0, document: draft }),
    );
    const saved = structuredClone(published);
    await POST(
      req({ action: "restore", expectedRevision: 1, restoreRevision: 1 }),
    );
    expect(published).toEqual(saved);
    expect(draft.projects[0].publicationConfirmed).toBe(false);
    expect(revision).toBe(2);
  });
  it("validates fields, byte limits and update rate limits", async () => {
    expect(
      (
        await POST(
          req({
            action: "save",
            expectedRevision: 0,
            document: { bad: "invalid" },
          }),
        )
      ).status,
    ).toBe(400);
    expect((await POST(req({ padding: "x".repeat(410000) }))).status).toBe(413);
    mocks.limit.mockReturnValue({ allowed: false, retryAfterSeconds: 60 });
    const r = await POST(req({}));
    expect(r.status).toBe(429);
    expect(r.headers.get("retry-after")).toBe("60");
  });
  it("does not claim a successful publish when the database commit fails", async () => {
    mocks.rpc.mockResolvedValue({ error: { code: "unknown" } });
    expect(
      (
        await POST(
          req({ action: "publish", expectedRevision: 0, document: draft }),
        )
      ).status,
    ).toBe(503);
    expect(revision).toBe(0);
  });
});
