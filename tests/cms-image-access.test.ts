import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultCmsDocument } from "@/lib/cms/defaults";
const mocks = vi.hoisted(() => ({
  state: vi.fn(),
  auth: vi.fn(),
  single: vi.fn(),
  download: vi.fn(),
}));
const client = () => ({
  from: () => ({ select: () => ({ eq: () => ({ single: mocks.single }) }) }),
  storage: { from: () => ({ download: mocks.download }) },
});
vi.mock("@/lib/cms/public", () => ({ getContentState: mocks.state }));
vi.mock("@/lib/supabase/admin", () => ({ getAdminContext: mocks.auth }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseLeadWriter: () => client(),
}));
import { GET as publicGET } from "@/app/media/projects/[id]/route";
import { GET as privateGET } from "@/app/api/admin/content/media/[id]/route";
import { readCmsMedia } from "@/lib/cms/media";
import type { SupabaseClient } from "@supabase/supabase-js";
const id = "11111111-1111-4111-8111-111111111111";
let doc = defaultCmsDocument();
const getPublic = (asset = id) =>
  publicGET(new Request("https://growthly.com.ng/media/projects/" + asset), {
    params: Promise.resolve({ id: asset }),
  });
const getPrivate = () =>
  privateGET(
    new Request("https://growthly.com.ng/api/admin/content/media/" + id),
    { params: Promise.resolve({ id }) },
  );
beforeEach(() => {
  vi.clearAllMocks();
  doc = defaultCmsDocument();
  mocks.state.mockImplementation(async () => ({
    available: true,
    enabled: true,
    document: doc,
  }));
  mocks.auth.mockResolvedValue({ ok: false, reason: "unauthenticated" });
  mocks.single.mockResolvedValue({
    data: { storage_path: id + ".webp" },
    error: null,
  });
  mocks.download.mockResolvedValue({
    data: new Blob(["synthetic-image-bytes"]),
    error: null,
  });
});
describe("revocable image access and private response headers", () => {
  it("does not expose draft, unpublished, unapproved or invalid asset references", async () => {
    expect((await getPublic("../invalid")).status).toBe(404);
    expect((await getPublic()).status).toBe(404);
    doc.projects[0].image = {
      assetId: id,
      width: 40,
      height: 40,
      alt: "Synthetic image",
      credit: "Synthetic test",
      permissionConfirmed: false,
    };
    expect((await getPublic()).status).toBe(404);
    doc.projects[0].image.permissionConfirmed = true;
    doc.projects[0].published = false;
    expect((await getPublic()).status).toBe(404);
    expect(mocks.download).not.toHaveBeenCalled();
  });
  it("serves only a currently published and permission-confirmed asset without caching", async () => {
    doc.projects[0].image = {
      assetId: id,
      width: 40,
      height: 40,
      alt: "Synthetic image",
      credit: "Synthetic test",
      permissionConfirmed: true,
    };
    const r = await getPublic();
    expect(r.status).toBe(200);
    expect(r.headers.get("cache-control")).toBe("private, no-store");
    expect(r.headers.get("content-type")).toBe("image/webp");
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    expect(r.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(r.headers.get("referrer-policy")).toBe("no-referrer");
    doc.projects = [];
    expect((await getPublic()).status).toBe(404);
    expect(mocks.download).toHaveBeenCalledOnce();
  });
  it("requires owner auth for private previews, never an assistant account", async () => {
    expect((await getPrivate()).status).toBe(401);
    mocks.auth.mockResolvedValue({ ok: false, reason: "forbidden" });
    expect((await getPrivate()).status).toBe(403);
    expect(mocks.download).not.toHaveBeenCalled();
    mocks.auth.mockResolvedValue({ ok: true, supabase: client() });
    expect((await getPrivate()).status).toBe(200);
  });
  it("returns no bytes while the publication provider is unavailable", async () => {
    mocks.state.mockResolvedValue({
      available: false,
      enabled: true,
      document: null,
    });
    expect((await getPublic()).status).toBe(503);
    expect(mocks.download).not.toHaveBeenCalled();
  });
  it("rejects mismatched registry paths and oversized/missing stored objects", async () => {
    mocks.single.mockResolvedValue({
      data: { storage_path: "elsewhere/private.webp" },
      error: null,
    });
    expect(
      await readCmsMedia(client() as unknown as SupabaseClient, id),
    ).toBeNull();
    expect(mocks.download).not.toHaveBeenCalled();
    mocks.single.mockResolvedValue({
      data: { storage_path: id + ".webp" },
      error: null,
    });
    mocks.download.mockResolvedValue({
      data: new Blob(["x".repeat(2_000_001)]),
      error: null,
    });
    expect(
      await readCmsMedia(client() as unknown as SupabaseClient, id),
    ).toBeNull();
    mocks.download.mockResolvedValue({
      data: null,
      error: { message: "missing" },
    });
    expect(
      await readCmsMedia(client() as unknown as SupabaseClient, id),
    ).toBeNull();
  });
});
