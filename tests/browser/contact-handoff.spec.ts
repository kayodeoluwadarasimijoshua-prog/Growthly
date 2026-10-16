import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  servicePages,
  sentenceServiceName,
  serviceContactMessage,
} from "../../config/service-pages";

for (const service of servicePages.filter(
  (p) => p.slug !== "website-development",
))
  test(`${service.path}: Contact detour retains the requested service`, async ({
    page,
  }) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(service.path);
      if (width < 1161)
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
      await page.locator('#primary-navigation a[href^="/contact"]').click();
      await expect(page).toHaveURL(
        new RegExp(`/contact\\?service=${service.slug}$`),
      );
      await expect(page.locator("h1")).toContainText(
        sentenceServiceName(service.label),
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        "https://growthly.com.ng/contact",
      );
      for (const selector of [
        '.contact-hero__actions a[href*="wa.me/"]',
        '.contact-card a[href*="wa.me/"]',
        ".floating-whatsapp",
      ]) {
        const href = await page.locator(selector).getAttribute("href");
        expect(new URL(href!).searchParams.get("text")).toBe(
          serviceContactMessage(service),
        );
      }
      await expect(page.locator("header .header-actions > a")).toHaveAttribute(
        "href",
        "#contact-options",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const hero = page.locator(".contact-hero__actions");
      await expect(hero.locator("a").first()).toBeInViewport();
      await expect(hero.locator("a").last()).toBeInViewport();
      await page.locator(".contact-hero__brief").click();
      await expect(page.locator('[name="service"]')).toHaveValue(service.slug);
      await expect(page.locator('select[name="website_type"]')).toHaveCount(0);
    }
  });

test("generic and invalid Contact entries remain neutral and do not persist query contents", async ({
  page,
}) => {
  for (const query of [
    "",
    "?service=unknown",
    "?service=ai-video-adverts&service=graphic-design",
    "?service=%3Cscript%3E&email=synthetic%40invalid.test",
  ]) {
    await page.goto("/contact" + query);
    const href = await page
      .locator('.contact-hero__actions a[href*="wa.me/"]')
      .getAttribute("href");
    expect(new URL(href!).searchParams.get("text")).toBe(
      serviceContactMessage(),
    );
    await expect(page.locator(".contact-hero__brief")).toHaveAttribute(
      "href",
      "/services#choose-your-service",
    );
    expect(
      await page.evaluate(() =>
        Object.keys(localStorage).filter((k) => !/floating|whatsapp/i.test(k)),
      ),
    ).toEqual([]);
    await expect(page.locator("h1")).not.toContainText("<script>");
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("contextual Contact actions are server-rendered and usable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const c = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  try {
    const page = await c.newPage();
    for (const service of servicePages.filter(
      (p) => p.slug !== "website-development",
    )) {
      await page.goto(service.path);
      await page.locator('#primary-navigation a[href^="/contact"]').click();
      const href = await page
        .locator('.contact-hero__actions a[href*="wa.me/"]')
        .getAttribute("href");
      expect(new URL(href!).searchParams.get("text")).toBe(
        serviceContactMessage(service),
      );
      const floating = await page
        .locator(".floating-whatsapp")
        .getAttribute("href");
      expect(new URL(floating!).searchParams.get("text")).toBe(
        serviceContactMessage(service),
      );
      await page.locator(".contact-hero__brief").click();
      await expect(page.locator(".form-unavailable-note")).toContainText(
        "No enquiry has been sent",
      );
      const direct = await page
        .locator('.form-unavailable-note a[href*="wa.me/"]')
        .getAttribute("href");
      expect(new URL(direct!).searchParams.get("text")).toContain(
        sentenceServiceName(service.label),
      );
    }
  } finally {
    await c.close();
  }
});

test("basic security policy protects forms without breaking preview rendering", async ({
  request,
}) => {
  const r = await request.get("/");
  const csp = r.headers()["content-security-policy"];
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).not.toContain("frame-ancestors");
  const production = await request.get("/", {
    headers: { host: "growthly.com.ng" },
  });
  expect(production.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
});
