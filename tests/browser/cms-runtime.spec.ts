import { test, expect } from "@playwright/test";
import { defaultCmsDocument } from "../../lib/cms/defaults";
const base = process.env.CMS_TEST_URL;
const runtime = process.env.CMS_RUNTIME_URL;
test.skip(
  !base || !runtime,
  "Requires CMS-enabled production server and explicit mocked provider. Not live Supabase.",
);
const asset = "11111111-1111-4111-8111-111111111111";
function doc() {
  const d = defaultCmsDocument();
  d.settings.prices = { starter: 150000, business: 250000, ecommerce: 400000 };
  d.settings.whatsapp = "08012345678";
  d.settings.alternativePhone = "08111111111";
  d.settings.homeIntro =
    "Synthetic runtime introduction for integration testing, not a live publication.";
  d.projects.push({
    ...d.projects[0],
    id: "synthetic-public-work",
    slug: "synthetic-public-work",
    name: "Synthetic runtime demonstration",
    kind: "demonstration",
    service: "graphic-design",
    featured: false,
    image: {
      assetId: asset,
      width: 1,
      height: 1,
      alt: "Synthetic runtime test image",
      credit: "Synthetic test fixture",
      permissionConfirmed: true,
    },
  });
  d.projects.push({
    ...d.projects[0],
    id: "unpublished-test-work",
    slug: "unpublished-test-work",
    name: "PRIVATE-DRAFT-MARKER-NOT-PUBLIC",
    published: false,
    publicationConfirmed: false,
    featured: false,
  });
  return d;
}
test.beforeEach(async ({ request }) => {
  await request.post(`${base}/__cms_test/reset`, {
    data: { published: doc() },
  });
});
test("new published project URLs, accurate demonstration labels, sitemap and HTML exclude private drafts", async ({
  page,
  request,
}) => {
  const r = await page.goto(`${runtime}/portfolio/synthetic-public-work`);
  expect(r?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(
    "Synthetic runtime demonstration",
  );
  await expect(page.locator(".page-hero .eyebrow")).toContainText(
    "Self-initiated demonstration",
  );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    "https://growthly.com.ng/portfolio/synthetic-public-work",
  );
  await expect(page.locator(".closing-cta .button")).toHaveAttribute(
    "href",
    "/request-a-quote?service=graphic-design",
  );
  await expect(page.locator(".site-header .header-actions .button")).toHaveAttribute(
    "href",
    "/request-a-quote?service=graphic-design",
  );
  await expect(page.locator(".floating-whatsapp")).toHaveAttribute(
    "href",
    /graphic%20design/i,
  );
  const portfolio = await request.get(`${runtime}/portfolio`);
  expect(await portfolio.text()).not.toContain(
    "PRIVATE-DRAFT-MARKER-NOT-PUBLIC",
  );
  const sitemap = await request.get(`${runtime}/sitemap.xml`);
  expect(await sitemap.text()).toContain("/portfolio/synthetic-public-work");
  expect(await sitemap.text()).not.toContain(
    "/portfolio/unpublished-test-work",
  );
  expect(
    (await request.get(`${runtime}/portfolio/unpublished-test-work`)).status(),
  ).toBe(404);
});
test("runtime contact links, three prices, metadata, quote choices and FAQ tokens stay consistent", async ({
  page,
}) => {
  await page.goto(`${runtime}/`);
  await expect(page.locator(".hero-starting-price")).toContainText("₦150,000");
  await expect(page.locator(".hero-copy > p").first()).toContainText(
    "Synthetic runtime introduction",
  );
  await expect(page.locator(".package-card")).toContainText([
    "₦150,000",
    "₦250,000",
    "₦400,000",
  ]);
  await expect(page.locator(".floating-whatsapp")).toHaveAttribute(
    "href",
    /wa\.me\/2348012345678/,
  );
  await expect(page.locator(".faq-item").first()).toContainText("₦150,000");
  await page.goto(`${runtime}/pricing`);
  await expect(page.locator(".package-card")).toContainText([
    "₦150,000",
    "₦250,000",
    "₦400,000",
  ]);
  expect(
    await page.locator("meta[name=description]").getAttribute("content"),
  ).toContain("150,000");
  await page.goto(`${runtime}/services`);
  await expect(
    page.locator(".section-footer").filter({ hasText: "Starting packages:" }),
  ).toContainText("₦150,000");
  await page.goto(`${runtime}/request-a-quote?package=business-website`);
  await expect(page.locator("[name=package_id]")).toContainText("250,000");
  await expect(page.locator("[name=package_id]")).toHaveValue(
    "business-website",
  );
  await expect(
    page.getByRole("button", { name: "Prepare WhatsApp brief" }),
  ).toBeVisible();
  await page.goto(`${runtime}/contact`);
  await expect(
    page.locator('a[href^="https://wa.me/"]').first(),
  ).toHaveAttribute("href", /2348012345678/);
  await expect(page.locator('a[href="tel:08111111111"]').first()).toBeVisible();
});
test("publication updates and removal take effect without a rebuild, including sitemap and old URLs", async ({
  page,
  request,
}) => {
  await page.goto(`${runtime}/portfolio/synthetic-public-work`);
  const changed = doc();
  changed.projects = changed.projects.filter(
    (p) => p.slug !== "synthetic-public-work",
  );
  changed.settings.homeIntro =
    "Changed synthetic runtime text after the existing production build, proving per-request publication.";
  await request.post(`${base}/__cms_test/control`, {
    data: { document: changed },
  });
  await page.goto(`${runtime}/`);
  await expect(page.locator(".hero-copy")).toContainText(
    "Changed synthetic runtime text",
  );
  expect(
    (await request.get(`${runtime}/portfolio/synthetic-public-work`)).status(),
  ).toBe(404);
  expect(
    await (await request.get(`${runtime}/sitemap.xml`)).text(),
  ).not.toContain("/portfolio/synthetic-public-work");
  changed.projects = [];
  await request.post(`${base}/__cms_test/control`, {
    data: { document: changed },
  });
  const websites = await request.get(`${runtime}/website-development`);
  expect(await websites.text()).not.toContain("/portfolio/starxco");
});
test("image proxies are permission-gated, uncached and cannot be copied by the Next optimizer", async ({
  request,
}) => {
  let r = await request.get(`${runtime}/media/projects/${asset}`);
  expect(r.status()).toBe(200);
  expect(r.headers()["cache-control"]).toContain("no-store");
  expect(r.headers()["content-type"]).toBe("image/webp");
  expect(r.headers()["x-content-type-options"]).toBe("nosniff");
  expect(
    (
      await request.get(
        `${runtime}/_next/image?url=${encodeURIComponent("/media/projects/" + asset)}&w=640&q=75`,
      )
    ).status(),
  ).toBe(400);
  const changed = doc();
  changed.projects = changed.projects.filter(
    (p) => p.slug !== "synthetic-public-work",
  );
  await request.post(`${base}/__cms_test/control`, {
    data: { document: changed },
  });
  r = await request.get(`${runtime}/media/projects/${asset}`);
  expect(r.status()).toBe(404);
  expect(r.headers()["cache-control"]).toContain("no-store");
  expect(
    (await request.get(`${runtime}/api/admin/content/media/${asset}`)).status(),
  ).toBe(401);
});
test("provider outage fails closed without serving old contacts, revoked media or default work", async ({
  page,
  request,
}) => {
  await request.post(`${base}/__cms_test/control`, {
    data: { failProvider: true },
  });
  await page.goto(`${runtime}/portfolio`);
  await expect(
    page.getByRole("heading", {
      name: "This page is temporarily unavailable.",
    }),
  ).toBeVisible();
  expect(await page.locator('a[href^="https://wa.me/"]').count()).toBe(0);
  expect(
    (await request.get(`${runtime}/media/projects/${asset}`)).status(),
  ).toBe(503);
  expect((await request.get(`${runtime}/api/admin/content`)).status()).toBe(
    401,
  );
});

test("published prices, contacts and new work remain server-rendered without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${runtime}/`);
  await expect(page.locator(".hero-starting-price")).toContainText("₦150,000");
  await expect(page.locator(".floating-whatsapp")).toHaveAttribute(
    "href",
    /2348012345678/,
  );
  await page.goto(`${runtime}/portfolio/synthetic-public-work`);
  await expect(page.locator("h1")).toHaveText(
    "Synthetic runtime demonstration",
  );
  await context.close();
});
test("unchecking the featured website does not silently re-feature default work", async ({
  page,
  request,
}) => {
  const changed = doc();
  changed.projects[0].featured = false;
  await request.post(`${base}/__cms_test/control`, {
    data: { document: changed },
  });
  await page.goto(`${runtime}/`);
  await expect(page.locator(".hero-project")).toContainText(
    "Build around your customers’ next step.",
  );
  await expect(page.locator(".case-spotlight")).toHaveCount(0);
});
