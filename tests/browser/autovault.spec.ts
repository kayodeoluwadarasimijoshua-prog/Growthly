import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("AutoVault appears as a demonstration with a real screenshot and live demo link", async ({
  page,
  request,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/portfolio");
    const demo = page.locator(".project-card--demonstration");
    await expect(
      demo.getByRole("heading", { name: "AutoVault Motors" }),
    ).toBeVisible();
    await expect(demo).toContainText("not client work");
    await expect(demo.locator(".project-card__tag")).toHaveText(
      "Demonstration",
    );
    await expect(
      demo.getByRole("link", { name: /Visit live demo/ }),
    ).toHaveAttribute("href", "https://autovault-motors-nu.vercel.app/");
    await demo
      .getByRole("link", {
        name: "View project details for AutoVault Motors",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(/\/portfolio\/autovault-motors$/);
    await expect(page.locator("h1")).toHaveText("AutoVault Motors");
    await expect(page.locator(".page-hero")).toContainText(
      "Self-initiated demonstration",
    );
    await expect(page.locator("figcaption")).toContainText("AI-generated");
    const image = page.locator("figure img");
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({
      path: `artifacts/autovault-case-${width}.png`,
      fullPage: true,
    });
  }
  expect(await (await request.get("/sitemap.xml")).text()).toContain(
    "/portfolio/autovault-motors",
  );
});

test("StarXCO remains the genuine client project featured on Home", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-project h2")).toHaveText("StarXCO");
  await expect(
    page.locator(".hero-project .project-card--demonstration"),
  ).toHaveCount(0);
});
