import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  single: vi.fn(),
  connection: vi.fn(),
}));
vi.mock("next/server", () => ({ connection: mocks.connection }));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseLeadStoreConfig: mocks.configured,
  createSupabaseLeadWriter: () => ({
    from: () => ({ select: () => ({ eq: () => ({ single: mocks.single }) }) }),
  }),
}));
import {
  getContentState,
  getPublishedProjects,
  getSiteSettings,
  getFeaturedProject,
} from "@/lib/cms/public";
import { defaultCmsDocument } from "@/lib/cms/defaults";
import { getPublicPagePaths } from "@/lib/public-pages";
beforeEach(() => {
  vi.stubEnv("SITE_CMS_ENABLED", "false");
  vi.clearAllMocks();
  mocks.configured.mockReturnValue(true);
});
afterEach(() => vi.unstubAllEnvs());
describe("runtime published content without rebuilds or draft leakage", () => {
  it("preserves the current site while the CMS switch is off, without provider calls", async () => {
    expect((await getPublishedProjects()).map((p) => p.slug)).toEqual([
      "starxco",
    ]);
    expect(mocks.single).not.toHaveBeenCalled();
  });
  it("reads new publications and contact/prices on subsequent requests, filtering hidden work", async () => {
    vi.stubEnv("SITE_CMS_ENABLED", "true");
    const doc = defaultCmsDocument();
    doc.projects.push({
      ...doc.projects[0],
      id: "hidden-project",
      slug: "hidden-project",
      name: "Private draft",
      published: false,
      publicationConfirmed: false,
      featured: false,
    });
    doc.projects.push({
      ...doc.projects[0],
      id: "new-project",
      slug: "new-project",
      name: "Synthetic new public work",
      featured: false,
    });
    doc.settings.whatsapp = "08012345678";
    doc.settings.prices = {
      starter: 150000,
      business: 250000,
      ecommerce: 400000,
    };
    mocks.single.mockResolvedValue({ data: { published: doc }, error: null });
    const projects = await getPublishedProjects();
    expect(projects.map((p) => p.slug)).toEqual(["starxco", "new-project"]);
    expect(getPublicPagePaths(projects)).toContain("/portfolio/new-project");
    expect(getPublicPagePaths(projects)).not.toContain(
      "/portfolio/hidden-project",
    );
    expect((await getSiteSettings()).whatsapp).toBe("08012345678");
    doc.projects = doc.projects.filter((p) => p.slug !== "starxco");
    mocks.single.mockResolvedValue({ data: { published: doc }, error: null });
    expect((await getPublishedProjects()).map((p) => p.slug)).not.toContain(
      "starxco",
    );
  });
  it("fails closed on provider/configuration errors instead of resurrecting withdrawn default work", async () => {
    vi.stubEnv("SITE_CMS_ENABLED", "true");
    mocks.configured.mockReturnValue(false);
    expect((await getContentState()).available).toBe(false);
    await expect(getPublishedProjects()).rejects.toThrow();
  });
  it("refuses malformed or permission-invalid stored publications", async () => {
    vi.stubEnv("SITE_CMS_ENABLED", "true");
    const doc = defaultCmsDocument();
    doc.projects[0].publicationConfirmed = false;
    mocks.single.mockResolvedValue({ data: { published: doc }, error: null });
    expect((await getContentState()).available).toBe(false);
    mocks.single.mockResolvedValue({
      data: { published: { private: "not allowed" } },
      error: null,
    });
    expect((await getContentState()).available).toBe(false);
  });
});

it("does not silently re-feature a CMS website after the owner unchecks it", async () => {
  vi.stubEnv("SITE_CMS_ENABLED", "true");
  const doc = defaultCmsDocument();
  doc.projects[0].featured = false;
  mocks.single.mockResolvedValue({ data: { published: doc }, error: null });
  expect(await getFeaturedProject()).toBeUndefined();
});
