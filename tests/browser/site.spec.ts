import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/website-development",
  "/business-websites",
  "/ecommerce-websites",
  "/industries",
  "/portfolio",
  "/portfolio/kora-botanics",
  "/portfolio/abeni-stay",
  "/portfolio/ayo-studio",
  "/pricing",
  "/about",
  "/contact",
  "/request-a-quote",
  "/privacy-policy",
  "/terms",
];
for (const width of [390, 768, 1440]) {
  test(`routes, semantics, links and overflow at ${width}px`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const titles = new Set<string>();
    const links = new Set<string>();
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const title = await page.title();
      expect(titles.has(title), title).toBe(false);
      titles.add(title);
      expect(
        await page.locator('meta[name="description"]').getAttribute("content"),
      ).toBeTruthy();
      expect(
        await page.locator('link[rel="canonical"]').getAttribute("href"),
      ).toContain("https://growthly.com.ng");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (i: HTMLImageElement) => i.complete && i.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      for (const href of await page
        .locator('a[href^="/"]')
        .evaluateAll((as) => as.map((a) => a.getAttribute("href")!)))
        links.add(href.split("#")[0]);
      const schemas = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      for (const schema of schemas)
        expect(JSON.parse(schema)["@context"]).toBe("https://schema.org");
    }
    for (const href of links) {
      expect((await request.get(href)).status(), href).toBeLessThan(400);
    }
    expect(errors).toEqual([]);
  });
}
test("mobile menu and primary navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page
    .locator("#primary-navigation")
    .getByRole("link", { name: "Website Development", exact: true })
    .click();
  await expect(page).toHaveURL(/website-development/);
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toHaveAttribute("aria-expanded", "false");
});
test("quote validation and real WhatsApp handoff", async ({ page }) => {
  await page.goto(
    "/request-a-quote?type=Business%20website&package=business-website",
  );
  await page.getByRole("button", { name: "Prepare WhatsApp brief" }).click();
  await expect(page.locator('.form-status[role="alert"]')).toContainText(
    "highlighted",
  );
  await expect(page.locator('[name="full_name"]')).toBeFocused();
  await page.getByLabel("Your name *", { exact: true }).fill("Test Owner");
  await page
    .getByLabel("Business name *", { exact: true })
    .fill("Test Business");
  await page
    .getByLabel("WhatsApp or telephone number *", { exact: true })
    .fill("08012345678");
  await page
    .getByLabel("What does your website need to do? *", { exact: true })
    .fill(
      "A business website that clearly explains our products and services.",
    );
  await page.locator('[name="consent"]').check();
  await page.getByRole("button", { name: "Prepare WhatsApp brief" }).click();
  await expect(page.getByRole("status")).toContainText("not yet sent");
  await page.evaluate(() => { window.open = ((url?: string | URL) => { window.sessionStorage.setItem("testHandoff", String(url)); return null; }) as typeof window.open; });
  await page.getByRole("button", { name: "Open WhatsApp with my brief" }).click();
  const href = await page.evaluate(() => window.sessionStorage.getItem("testHandoff"));
  expect(href).toMatch(/^https:\/\/wa.me\/2348129391626\?text=/);
  expect(decodeURIComponent(href!)).toContain("Test Business");
  expect(decodeURIComponent(href!)).toContain("Business website");
  await page.getByLabel("Business name *", { exact: true }).fill("Changed");
  await expect(
    page.getByRole("button", { name: "Open WhatsApp with my brief" }),
  ).toHaveCount(0);
});
test("API refuses invalid, untrusted and undeliverable requests", async ({
  request,
}) => {
  const body = {
    full_name: "Test Owner",
    business_name: "Test Business",
    phone: "08012345678",
    email: "",
    preferred_contact: "whatsapp",
    website_type: "Business website",
    consent: true,
    service: "website-development",
    package_id: "custom",
    brief: "We need a clear business website with contact options.",
    budget_range: "not-sure",
    preferred_deadline: "flexible",
    website: "",
    attribution: {},
  };
  expect(
    (
      await request.post("/api/inquiries", {
        data: body,
        headers: { origin: "https://untrusted.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/inquiries", {
        data: { ...body, consent: false },
        headers: { "sec-fetch-site": "same-origin" },
      })
    ).status(),
  ).toBe(400);
  const response = await request.post("/api/inquiries", {
    data: body,
    headers: { "sec-fetch-site": "same-origin" },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).not.toHaveProperty("ok", true);
});
test("404, legacy redirects, robots and sitemap", async ({ page, request }) => {
  const notFound = await page.goto("/missing-page");
  expect(notFound?.status()).toBe(404);
  await expect(page.locator("h1")).toBeVisible();
  for (const [old, target] of [
    ["/work", "/portfolio"],
    ["/privacy", "/privacy-policy"],
    ["/start-project", "/request-a-quote"],
    ["/services/website-development", "/website-development"],
  ]) {
    const r = await request.get(old, { maxRedirects: 0 });
    expect(r.status()).toBe(308);
    expect(r.headers().location).toContain(target);
  }
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const route of routes)
    expect(xml).toContain(
      `https://growthly.com.ng${route === "/" ? "" : route}`,
    );
});
for (const route of routes)
  test(`WCAG automated check ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
test("review screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: "artifacts/home-desktop-viewport.png" });
  await page.locator(".project-grid").scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete),
  );
  await page.screenshot({ path: "artifacts/work-desktop.png" });
  await page.locator(".closing-cta").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/cta-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({ path: "artifacts/home-mobile-viewport.png" });
  await page.goto("/request-a-quote");
  await page.locator("form").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/quote-mobile.png" });
});
