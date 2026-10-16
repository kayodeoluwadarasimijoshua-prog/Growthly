import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  getServicePath,
  sentenceServiceName,
} from "../../config/service-pages";
import { services, projects } from "../../config/content";
const supporting = services.filter((s) => s.slug !== "website-development");

for (const service of supporting) {
  test(`${service.slug}: every contextual CTA and WhatsApp brief keep the service`, async ({
    page,
  }) => {
    await page.goto(getServicePath(service.slug));
    for (const selector of [
      ".page-hero .button",
      ".service-detail-grid .button",
      ".closing-cta .button",
    ])
      await expect(page.locator(selector)).toHaveAttribute(
        "href",
        `/request-a-quote?service=${service.slug}`,
      );
    await page.locator(".closing-cta .button").click();
    await expect(page).toHaveURL(new RegExp(`service=${service.slug}`));
    await expect(page).toHaveTitle(new RegExp(service.shortTitle, "i"));
    await expect(page.locator("h1")).toContainText(
      sentenceServiceName(service.shortTitle),
    );
    await expect(page.locator(".form-intro")).toContainText(
      `Requested service: ${service.title}`,
    );
    await expect(page.locator('[name="service"]')).toHaveValue(service.slug);
    await expect(page.locator('[name="package_id"]')).toHaveValue("custom");
    await expect(
      page.getByLabel("Website type *", { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByLabel("Solution you’re considering")).toHaveCount(0);
    await page
      .getByLabel("Your name *", { exact: true })
      .fill("Synthetic Owner");
    await page
      .getByLabel("Business name *", { exact: true })
      .fill("Synthetic Business");
    await page
      .getByLabel("WhatsApp or telephone number *", { exact: true })
      .fill("08012345678");
    await page
      .getByLabel("What do you need help with? *", { exact: true })
      .fill("Synthetic campaign brief for the selected service only.");
    await page.locator('[name="consent"]').check();
    await page.getByRole("button", { name: "Prepare WhatsApp brief" }).click();
    await expect(page.getByRole("status")).toContainText("not yet sent");
    await page.evaluate(() => {
      window.open = ((url?: string | URL) => {
        window.sessionStorage.setItem("serviceHandoff", String(url));
        return null;
      }) as typeof window.open;
    });
    await page
      .getByRole("button", { name: "Open WhatsApp with my brief" })
      .click();
    const href = await page.evaluate(() =>
      window.sessionStorage.getItem("serviceHandoff"),
    );
    const message = new URL(href!).searchParams.get("text")!;
    expect(message).toContain(`Service: ${service.title}`);
    expect(message).toContain("Synthetic campaign brief");
    expect(message).not.toContain("website quote");
    expect(message).not.toContain("Website type:");
    expect(message).not.toContain("Package:");
    const result = await new AxeBuilder({ page })
      .options({ rules: { "label-content-name-mismatch": { enabled: true } } })
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
}

for (const state of ["loaded", "failed"] as const) {
  test(`project media/name handling: local requests ${state} (mock transport if registered)`, async ({
    page,
    context,
  }) => {
    await context.route(
      projects[0].image?.permissionConfirmed
        ? "**/_next/image?**"
        : "**/review-media/starxco*.webp",
      (route) =>
        state === "failed"
          ? route.abort()
          : route.fulfill({
              contentType: "image/svg+xml",
              body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"><rect width="1200" height="700" fill="#DDF5E9"/></svg>',
            }),
    );
    for (const path of ["/", "/portfolio"]) {
      await page.goto(path);
      if (projects[0].image) {
        const link = page.locator(".project-card__visual");
        await expect(link).not.toHaveAttribute("aria-label", /.+/);
        await expect(link).toHaveAccessibleName(
          /StarXCO project details.*Client website/,
        );
        if (state === "failed") {
          await expect(link.locator(".project-image-fallback")).toBeVisible();
          await expect(link).toHaveAccessibleName(
            /Project image temporarily unavailable/,
          );
        } else
          await expect
            .poll(() =>
              link
                .locator("img")
                .evaluate(
                  (img: HTMLImageElement) =>
                    img.complete && img.naturalWidth > 0,
                ),
            )
            .toBe(true);
      } else {
        await expect(
          page.locator(".project-card__visual, .project-image-fallback"),
        ).toHaveCount(0);
        await expect(
          page
            .locator(".project-card")
            .getByRole("link", { name: "View project details for StarXCO" }),
        ).toBeVisible();
      }
      await expect(
        page.locator(path === "/" ? ".project-card h2" : ".project-card h3"),
      ).toHaveText("StarXCO");
      const result = await new AxeBuilder({ page })
        .options({
          rules: { "label-content-name-mismatch": { enabled: true } },
        })
        .analyze();
      expect(result.violations.map((v) => v.id)).toEqual([]);
    }
  });
}

test("dark service hero links retain contrast, keyboard focus and contact landmark", async ({
  page,
}) => {
  for (const service of supporting) {
    await page.goto(getServicePath(service.slug));
    const link = page.locator(".page-hero").getByRole("link", {
      name: `See the ${service.slug === "digital-advertising" ? "ads & promotion" : service.slug === "social-media-management" ? "social media management" : service.slug === "ai-integration-automation" ? "ai & automation" : sentenceServiceName(service.shortTitle)} scope`,
    });
    for (const state of ["default", "hover", "focus"]) {
      if (state === "hover") await link.hover();
      if (state === "focus") {
        await page.mouse.move(0, 0);
        for (let step = 0; step < 30; step++) {
          if (await link.evaluate((el) => el === document.activeElement)) break;
          await page.keyboard.press("Tab");
        }
        await expect(link).toBeFocused();
      }
      expect(await link.evaluate((el) => getComputedStyle(el).color)).toBe(
        "rgb(221, 245, 233)",
      );
      if (state === "focus") {
        expect(
          await link.evaluate((el) => getComputedStyle(el).outlineColor),
        ).toBe("rgb(221, 245, 233)");
        expect(
          await link.evaluate((el) => getComputedStyle(el).outlineStyle),
        ).not.toBe("none");
      }
      const result = await new AxeBuilder({ page })
        .withRules(["color-contrast"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
    await expect(
      page
        .getByRole("complementary", { name: "WhatsApp contact" })
        .getByRole("link", { name: "Chat with Growthly on WhatsApp" }),
    ).toBeVisible();
  }
});

test("unknown and duplicate service queries are not silently accepted", async ({
  page,
}) => {
  for (const query of [
    "service=unknown",
    "service=graphic-design&service=digital-advertising",
  ]) {
    await page.goto(`/request-a-quote?${query}`);
    await expect(page.getByRole("status")).toContainText(
      "service link was not recognized",
    );
    await expect(page.locator('[name="service"]')).toHaveValue(
      "website-development",
    );
    await expect(
      page.getByLabel("Website type *", { exact: true }),
    ).toBeVisible();
  }
});

test("supporting-service no-script fallback preserves safe service context", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto(
      "/request-a-quote?service=graphic-design&package=business-website",
    );
    await expect(page.locator("h1")).toContainText("graphic design");
    await expect(page.locator(".inquiry-form-controls")).toBeHidden();
    const href = await page
      .locator(".form-direct-contact a")
      .first()
      .getAttribute("href");
    expect(new URL(href!).searchParams.get("text")).toContain("graphic design");
    expect(page.url()).not.toContain("full_name");
  } finally {
    await context.close();
  }
});

test("generic website CTA resets supporting-service context during client navigation", async ({
  page,
}) => {
  await page.goto("/request-a-quote?service=graphic-design");
  await page.getByLabel("Your name *", { exact: true }).fill("Synthetic Owner");
  await page.evaluate(() =>
    Reflect.set(window, "navigationMarker", "same-document"),
  );
  await page
    .locator("footer")
    .getByRole("link", { name: "Get a Website Quote", exact: true })
    .click();
  await expect(page).toHaveURL(/\/request-a-quote$/);
  await expect(page.locator('[name="service"]')).toHaveValue(
    "website-development",
  );
  await expect(page.locator(".form-intro")).toContainText(
    "Tell us about your website",
  );
  await expect(page.getByLabel("Your name *", { exact: true })).toHaveValue("");
  expect(
    await page.evaluate(() => Reflect.get(window, "navigationMarker")),
  ).toBe("same-document");
});
