import { test, expect } from "@playwright/test";
import { servicePages, sentenceServiceName } from "../../config/service-pages";

for (const service of servicePages.filter(
  (page) => page.slug !== "website-development",
)) {
  test(`${service.path}: ad destination stays service-specific through all primary contact routes`, async ({
    page,
    request,
  }) => {
    for (const width of [320, 768, 1161, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(
        `${service.path}?utm_source=test&utm_medium=paid&utm_campaign=service-route-check`,
      );
      await expect(page.locator(".service-landing")).toHaveAttribute(
        "data-service",
        service.slug,
      );
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".service-landing .package-grid")).toHaveCount(
        0,
      );
      await expect(
        page.locator(".service-landing-process .process-step"),
      ).toHaveCount(4);
      await expect(page.locator("#service-questions .faq-item")).toHaveCount(3);
      for (const selector of [
        ".page-hero .button--primary",
        "#service-deliverables .button--primary",
        ".closing-cta .button",
      ]) {
        await expect(page.locator(selector)).toHaveText(service.cta);
        await expect(page.locator(selector)).toHaveAttribute(
          "href",
          `/request-a-quote?service=${service.slug}`,
        );
      }
      if (width > 760)
        await expect(page.locator(".header-actions > a")).toHaveText(
          service.cta,
        );
      const floating = await page
        .locator(".floating-whatsapp")
        .getAttribute("href");
      expect(new URL(floating!).searchParams.get("text")).toContain(
        sentenceServiceName(service.label),
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://growthly.com.ng${service.path}`,
      );
    }
    const old = await request.get(`/services/${service.slug}`, {
      maxRedirects: 0,
    });
    expect(old.status()).toBe(308);
    expect(old.headers().location).toContain(service.path);
    await page.locator(".closing-cta .button").click();
    await expect(page.locator('[name="service"]')).toHaveValue(service.slug);
    await expect(page.locator('select[name="website_type"]')).toHaveCount(0);
    await expect(
      page.locator('input[type="hidden"][name="website_type"]'),
    ).toHaveValue("");
    await expect(page.locator("header .header-actions > a")).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
}

test("AI video creative and paid campaign support are visibly different services", async ({
  page,
}) => {
  await page.goto("/aiads");
  await expect(page.locator(".service-distinction")).toContainText(
    "creative production",
  );
  await expect(page.locator(".service-distinction a")).toHaveAttribute(
    "href",
    "/ads-promotion",
  );
  await page.locator(".service-distinction a").click();
  await expect(page.locator(".service-distinction")).toContainText(
    "Platform media spend is separate",
  );
  await expect(page.locator(".service-distinction a")).toHaveAttribute(
    "href",
    "/aiads",
  );
});

test("service destinations work without scripts and without a mixed website quote", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/aiads");
    await expect(page.locator(".page-hero .button--primary")).toHaveText(
      "Get an AI Video Quote",
    );
    await page.locator("#service-questions summary").first().click();
    await expect(
      page.locator("#service-questions details").first(),
    ).toHaveAttribute("open", "");
    await page.locator(".page-hero .button--primary").click();
    await expect(page).toHaveURL(/service=ai-video-adverts/);
    await expect(page.locator(".form-unavailable-note")).toContainText(
      "No enquiry has been sent",
    );
    const href = await page
      .locator('.form-unavailable-note a[href^="https://wa.me"]')
      .getAttribute("href");
    expect(new URL(href!).searchParams.get("text")).toContain(
      "AI video adverts",
    );
  } finally {
    await context.close();
  }
});

test("home and overview expose five separate service sections without replacing website focus", async ({
  page,
}) => {
  for (const path of ["/", "/services"]) {
    await page.goto(path);
    await expect(page.locator(".supporting-service-section")).toHaveCount(5);
    for (const service of servicePages.filter(
      (p) => p.slug !== "website-development",
    )) {
      await expect(
        page.locator(`#support-${service.slug} > div > a`),
      ).toHaveAttribute("href", service.path);
    }
  }
  await page.goto("/");
  await expect(page.locator(".hero-actions .button")).toHaveText(
    "Get a Website Quote",
  );
});

test("full overview sections remain reachable with native anchors and no scripts", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/services");
    await page
      .locator('.journey-nav a[href="#support-digital-advertising"]')
      .click();
    await expect(page.locator("#support-digital-advertising")).toBeInViewport();
    await expect(page.locator("#support-digital-advertising h3")).toBeVisible();
    await page
      .locator("#support-digital-advertising .service-working-details summary")
      .click();
    await expect(
      page.locator("#support-digital-advertising .service-working-details"),
    ).toHaveAttribute("open", "");
    await page.locator("#support-digital-advertising > div > a").click();
    await expect(page).toHaveURL(/\/ads-promotion$/);
    await expect(page.locator(".page-hero .button--primary")).toHaveText(
      "Discuss an Ad Campaign",
    );
  } finally {
    await context.close();
  }
});

test("early service chooser keeps website priority and exposes all ad destinations", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/services"]) {
      await page.goto(path);
      await expect(page.locator(".service-gateway__card")).toHaveCount(6);
      await expect(
        page.locator(".service-gateway__card--primary"),
      ).toHaveAttribute("href", "/website-development");
      for (const service of servicePages)
        await expect(
          page.locator(`.service-gateway__card[href="${service.path}"]`),
        ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto("/");
    const ordering = await page
      .locator(".home-sales-page > section")
      .evaluateAll((es) => es.slice(0, 2).map((e) => e.className));
    expect(ordering[0]).toContain("website-hero");
    expect(ordering[1]).toContain("service-gateway");
    await page.locator(".hero-other-services").click();
    await expect(page.locator("#choose-your-service")).toBeInViewport();
    await page.locator('.service-gateway__card[href="/aiads"]').click();
    await expect(page).toHaveURL(/\/aiads$/);
    await expect(page.locator(".page-hero .button--primary")).toHaveText(
      "Get an AI Video Quote",
    );
  }
});
