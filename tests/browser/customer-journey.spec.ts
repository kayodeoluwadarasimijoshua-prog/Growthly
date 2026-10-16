import { test, expect } from "@playwright/test";
import { websiteFitChoices } from "../../config/customer-journey";

for (const choice of websiteFitChoices) {
  test(`goal guide preserves ${choice.packageId} and type in quote`, async ({
    page,
  }) => {
    await page.goto("/");
    const detail = page.locator(".fit-choice").filter({ hasText: choice.goal });
    const summary = detail.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(detail).toHaveAttribute("open", "");
    await detail.getByRole("link", { name: /Get a Website Quote/ }).click();
    await expect(page).toHaveURL(new RegExp(`package=${choice.packageId}`));
    await expect(page.locator('[name="package_id"]')).toHaveValue(
      choice.packageId,
    );
    await expect(page.locator('[name="website_type"]')).toHaveValue(
      choice.type,
    );
  });
}

test("native package guide and primary navigation work without scripts", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 850 },
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(
      page.locator('#primary-navigation a[href="/services"]'),
    ).toBeVisible();
    await expect(page.locator(".menu-toggle")).not.toBeVisible();
    await page.locator(".fit-choice summary").first().click();
    await expect(page.locator(".fit-choice").first()).toHaveAttribute(
      "open",
      "",
    );
    const next = page
      .locator(".fit-choice")
      .first()
      .getByRole("link", { name: /Get a Website Quote/ });
    await expect(next).toBeVisible();
    await next.click();
    await expect(page).toHaveURL(/package=starter-website/);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("tablet and desktop navigation reflow, escape and service destination", async ({
  page,
}) => {
  for (const width of [768, 1024, 1160, 1161, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const toggle = page.locator(".menu-toggle");
    const service = page.locator('#primary-navigation a[href="/services"]');
    if (width <= 1160) {
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(service).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(service).not.toBeVisible();
      await toggle.click();
    } else {
      await expect(toggle).not.toBeVisible();
      await expect(service).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await service.click();
    await expect(page).toHaveURL(/\/services$/);
  }
});

test("independent examples are explicit, safe links and never client cards", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (r) => {
    if (!new URL(r.url()).hostname.match(/127\.0\.0\.1|localhost/))
      externalRequests.push(r.url());
  });
  await page.goto("/portfolio");
  const examples = page.locator("#website-examples");
  await expect(examples).toContainText("Growthly did not build them");
  await expect(examples.locator(".example-card")).toHaveCount(3);
  await expect(examples.locator("img,iframe,.project-card")).toHaveCount(0);
  for (const a of await examples.locator("a").all()) {
    await expect(a).toHaveAttribute("target", "_blank");
    await expect(a).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(page.locator(".portfolio-layout .project-card h3")).toHaveText(
    "StarXCO",
  );
  expect(externalRequests).toEqual([]);
});

test("expanded page screenshots at mobile and desktop", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of [
      "about",
      "contact",
      "services",
      "portfolio",
      "industries",
    ]) {
      await page.goto(`/${name}`);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.addStyleTag({
        content:
          ".supporting-service-section { content-visibility: visible !important; }",
      });
      await page.screenshot({
        path: `artifacts/redesign-${name}-${width}.png`,
        fullPage: true,
      });
    }
  }
});

test("deeper buying information is visible and service scope remains native", async ({
  page,
}) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("#website-features .capability-row")).toHaveCount(
      4,
    );
    await page.locator('.journey-nav a[href="#website-features"]').click();
    await expect(page).toHaveURL(/#website-features$/);
    for (const route of [
      "/website-development",
      "/business-websites",
      "/ecommerce-websites",
    ]) {
      await page.goto(route);
      await expect(page.locator("#website-capabilities")).toContainText(
        "What we agree in the scope",
      );
      await expect(page.locator(".handover-decisions")).toContainText(
        "not lifetime hosting",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goto("/services");
    const scope = page.locator(".service-working-details").first();
    await scope.locator("summary").click();
    await expect(scope).toHaveAttribute("open", "");
    await expect(scope).toContainText("You provide approved copy");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("/contact");
    await expect(page.locator(".message-example")).toContainText(
      "A starting message you can adapt",
    );
    await page.goto("/pricing");
    await expect(page.locator(".proposal-checklist li")).toHaveCount(7);
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "Your role", exact: true }),
    ).toBeVisible();
  }
});
