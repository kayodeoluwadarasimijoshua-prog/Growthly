import { test, expect } from "@playwright/test";

test("Business Website alone is recommended across the sales journey", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/pricing",
    "/website-development",
    "/business-websites",
    "/ecommerce-websites",
  ]) {
    await page.goto(route);
    const card = page.locator(".package-card--featured");
    await expect(card).toHaveCount(1);
    await expect(card.locator(".package-card__name")).toHaveText(
      "Business Website",
    );
    await expect(card.locator(".package-card__recommendation")).toHaveText(
      "Recommended",
    );
    await expect(page.locator(".package-card__recommendation")).toHaveCount(1);
    await expect(card.locator(".package-card__price")).toContainText("200,000");
    await expect(
      card.locator('a[href*="package=business-website"]'),
    ).toBeVisible();
  }
});

test("WhatsApp uses brand green with a brief bounce without playback controls and stable interactive target", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const contact = page.locator(".floating-whatsapp");
  await expect(contact).toHaveCSS("background-color", "rgb(37, 211, 102)");
  await expect(contact.locator("svg")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(contact.locator("svg")).toHaveCSS("fill", "rgb(255, 255, 255)");
  await expect(contact.locator("svg path")).toHaveAttribute(
    "d",
    /^M17\.472 14\.382/,
  );
  await expect(contact.locator("svg")).toHaveCSS(
    "animation-name",
    "whatsapp-bounce",
  );
  await expect(contact).toHaveCSS("border-top-width", "0px");
  const pulse = await contact.evaluate((el) => {
    const css = getComputedStyle(el.querySelector("svg")!);
    return {
      name: css.animationName,
      count: css.animationIterationCount,
      duration: css.animationDuration,
    };
  });
  expect(pulse).toEqual({
    name: "whatsapp-bounce",
    count: "2",
    duration: "1.8s",
  });
  const first = await contact.boundingBox();
  await expect
    .poll(() =>
      contact
        .locator("svg")
        .evaluate(
          (el) =>
            el.getAnimations().filter((a) => a.playState === "running").length,
        ),
    )
    .toBe(1);
  await expect(page.locator(".whatsapp-motion-toggle")).toHaveCount(0);
  await expect
    .poll(
      () =>
        contact
          .locator("svg")
          .evaluate(
            (el) =>
              el.getAnimations().filter((a) => a.playState === "running")
                .length,
          ),
      { timeout: 6000 },
    )
    .toBe(0);
  expect(await contact.boundingBox()).toEqual(first);
  await contact.hover();
  expect(
    await contact.evaluate(
      (el) => getComputedStyle(el.querySelector("svg")!).animationName,
    ),
  ).toBe("none");
  await expect(contact).toHaveAttribute(
    "href",
    /^https:\/\/wa.me\/2348129391626/,
  );
});

test("entrances and scroll reveals keep content readable and respect reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-copy h1")).toBeVisible();
  expect(
    await page
      .locator(".hero-copy h1")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("growthly-enter");
  expect(
    await page
      .locator(".hero-copy h1")
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("1");
  await page.locator(".package-card--featured").scrollIntoViewIfNeeded();
  await expect(page.locator(".package-card__recommendation")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const selector of [
    ".hero-copy h1",
    ".hero-project",
    ".package-grid",
    ".fit-guide",
    ".closing-cta",
  ])
    await expect(page.locator(selector)).toHaveCSS("animation-name", "none");
  const contact = page.locator(".floating-whatsapp");
  expect(
    await contact.evaluate(
      (el) => getComputedStyle(el.querySelector("svg")!).animationName,
    ),
  ).toBe("none");
  await contact.focus();
  await expect(contact).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(contact).toBeVisible();
  await page.keyboard.press("Home");
});

test("motion needs no JavaScript and does not break small-screen reflow", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 320, height: 850 },
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".package-card__recommendation")).toHaveText(
      "Recommended",
    );
    await expect(page.locator(".floating-whatsapp")).toHaveCSS(
      "background-color",
      "rgb(37, 211, 102)",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("no-script contact stays static without an unusable pause control", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "no-preference",
    baseURL,
  });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".floating-whatsapp svg")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".whatsapp-motion-toggle")).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("contact stays keyboard accessible without pause/play controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /pause|resume.*animation/i }),
  ).toHaveCount(0);
  const contact = page.locator(".floating-whatsapp");
  await contact.focus();
  await expect(contact).toBeFocused();
  await expect(contact.locator("svg")).toHaveCSS("animation-name", "none");
  await page.keyboard.press("ArrowLeft");
  await expect(contact).toBeVisible();
  await page.keyboard.press("Home");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(contact.locator("svg")).toHaveCSS("animation-name", "none");
});
