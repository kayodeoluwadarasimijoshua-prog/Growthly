import { test, expect } from "@playwright/test";

test("unapproved tracking stores no attribution or loads any Google tag", async ({
  page,
}) => {
  const tracking: string[] = [];
  page.on("request", (request) => {
    if (
      /googletagmanager|google-analytics|googleadservices|doubleclick/.test(
        request.url(),
      )
    )
      tracking.push(request.url());
  });
  await page.goto(
    "/request-a-quote?utm_source=synthetic&email=private%40example.com",
  );
  await expect(page.locator(".inquiry-form")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.locator(".consent-banner")).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      sessionStorage.getItem("growthly_campaign_attribution"),
    ),
  ).toBeNull();
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  expect(tracking).toEqual([]);
});

test("privacy notice describes local screenshots and the current WhatsApp handoff accurately", async ({
  page,
}) => {
  await page.goto("/privacy-policy");
  await expect(page.locator("main")).toContainText("served from this website");
  await expect(page.locator("main")).toContainText(
    "preparing it does not submit an online enquiry",
  );
  await expect(page.locator("main")).toContainText(
    "Google Ads tags and advertising personalization are not enabled",
  );
  await expect(page.locator("main")).not.toContainText(
    "loaded directly from its public website",
  );
});

test("a raw forged forwarded host cannot satisfy the default origin guard", async ({
  request,
}) => {
  const response = await request.post("/api/inquiries", {
    headers: {
      origin: "https://attacker.example",
      "x-forwarded-host": "attacker.example",
    },
    data: {},
  });
  expect(response.status()).toBe(403);
  expect(response.headers()["cache-control"]).toBe("private, no-store");
});

test("mobile project screenshot selects a smaller private responsive source", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const image = page.locator(".hero-project img");
  if (await image.count()) {
    await expect
      .poll(() =>
        image.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(
      await image.evaluate((el: HTMLImageElement) => el.currentSrc),
    ).toMatch(/review-media\/starxco-480\.webp$/);
  }
});
