import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("three core services and honest service galleries lead to contextual enquiries", async ({
  page,
}) => {
  await page.goto("/");
  const primary = page.locator(".service-gateway__card--primary");
  await expect(primary).toHaveCount(3);
  await expect(primary.locator("h3")).toHaveText([
    "Website development",
    "Graphic design",
    "AI video adverts",
  ]);
  await expect(
    page
      .locator(".hero-actions")
      .getByRole("link", { name: "Find your service" }),
  ).toHaveAttribute("href", "/services");
  for (const [slug, label] of [
    ["graphic-design", "Get a Design Quote"],
    ["ai-video-adverts", "Get an AI Video Quote"],
  ]) {
    await page.goto(`/portfolio/services/${slug}`);
    await expect(page.locator(".gallery-empty")).toContainText("no published");
    await expect(page.locator(".project-card")).toHaveCount(0);
    await expect(
      page.locator(".header-actions").getByRole("link", { name: label }),
    ).toHaveAttribute("href", `/request-a-quote?service=${slug}`);
  }
  await page.goto("/portfolio/services/website-development");
  await expect(page.locator(".gallery-grid .project-card")).toHaveCount(2);
  await expect(page.locator(".project-card--demonstration")).toContainText(
    "not client work",
  );
});
test("published quick answers work without claiming an unconfigured AI service", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (
      request.url().includes("/api/assistant") ||
      request.url().includes("openai.com")
    )
      requests.push(request.url());
  });
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Quick questions",
    exact: true,
  });
  await trigger.click();
  const panel = page.getByRole("region", { name: "Ask Growthly" });
  await expect(panel).toBeVisible();
  await panel
    .getByRole("button", { name: "What can Growthly help me with?" })
    .click();
  await expect(panel.getByRole("status")).toContainText("graphic design");
  await expect(
    panel.getByRole("button", { name: "Ask AI", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(requests).toEqual([]);
});
test("new layouts remain accessible and readable on phone and desktop", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/services",
      "/about",
      "/portfolio",
      "/portfolio/services/graphic-design",
      "/portfolio/services/ai-video-adverts",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((item) => ({
          id: item.id,
          targets: item.nodes.map((node) => node.target),
        })),
        path,
      ).toEqual([]);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(
        /180%|1984210|99\.98%|NiRA Accredited|800 GROWTHLY|100% On-Time|100% Verifiable/,
      );
    }
  }
});
test("reduced motion and no-JavaScript visits retain useful content", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page
      .locator("h1")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await context.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await nojs.newPage();
  await staticPage.goto("/portfolio/services/graphic-design");
  await expect(staticPage.locator(".gallery-empty")).toBeVisible();
  await expect(
    staticPage.getByRole("button", { name: "Quick questions", exact: true }),
  ).toBeHidden();
  await nojs.close();
});


test("footer privacy links stay clear of floating contact controls", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    for (const link of await page.locator(".footer-bottom__links a").all()) {
      expect(await link.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const top = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return top === element || element.contains(top);
      })).toBe(true);
    }
  }
});
