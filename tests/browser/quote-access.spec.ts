import { test, expect } from "@playwright/test";

test("the brief anchor also reaches direct contact when JavaScript is unavailable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto("/request-a-quote?service=ai-video-adverts");
    await page.locator(".mobile-nav-cta").click();
    await expect(page.locator("#project-brief .form-unavailable-note")).toBeInViewport();
    await expect(page.locator("#project-brief .inquiry-form-controls")).toBeHidden();
    const whatsapp = page.locator("#project-brief .form-direct-contact a").first();
    expect(new URL((await whatsapp.getAttribute("href"))!).searchParams.get("text")).toContain("AI video adverts");
  } finally { await context.close(); }
});

test("quote action reaches the brief and keeps the selected service and package", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(
      "/request-a-quote?service=website-development&package=business-website",
    );
    if (width === 390) await page.locator(".menu-toggle").click();
    const complete = page.locator(
      width === 390 ? ".mobile-nav-cta" : ".header-actions .button",
    );
    await expect(complete).toHaveAttribute("href", "#project-brief");
    await complete.click();
    await expect(page.locator("#project-brief .form-intro h2")).toBeInViewport();
    await expect(page.locator('[name="package_id"]')).toHaveValue(
      "business-website",
    );
    await expect(page.locator(".quote-channel-note")).toContainText(
      "press Send in WhatsApp",
    );
  }
  await page.goto("/request-a-quote?service=ai-video-adverts");
  await expect(page.locator("#project-brief")).toContainText(
    "AI video adverts",
  );
  await expect(page.locator('[name="service"]')).toHaveValue(
    "ai-video-adverts",
  );
});

test("mobile quote page puts the actual form before repeated process guidance", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/request-a-quote");
  const input = await page.locator('[name="full_name"]').boundingBox();
  const process = await page.locator(".form-layout__aside").boundingBox();
  expect(input).not.toBeNull();
  expect(process).not.toBeNull();
  expect(input!.y).toBeLessThan(process!.y);
  expect((await page.locator("#project-brief").boundingBox())!.y).toBeLessThan(
    800,
  );
});

test("About identifies the owner-supplied team without fabricated profile photos", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.locator("#our-team .team-card")).toHaveCount(4);
  await expect(page.locator("#our-team")).toContainText("Kayode Oluwadarasimi");
  await expect(page.locator("#our-team")).toContainText("Kenny");
  await expect(page.locator("#our-team")).toContainText("Sodiq");
  await expect(page.locator("#our-team")).toContainText("Omo Wunmi");
  await expect(page.locator("#our-team img")).toHaveCount(0);
});
