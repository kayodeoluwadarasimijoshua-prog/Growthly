import { test, expect } from "@playwright/test";
import { projects } from "../../config/content";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/website-development",
  "/business-websites",
  "/ecommerce-websites",
  "/industries",
  "/portfolio",
  "/portfolio/starxco",
  "/pricing",
  "/about",
  "/contact",
  "/request-a-quote",
  "/privacy-policy",
  "/terms",
  "/services",
  "/graphic-design",
  "/aiads",
  "/social-media",
  "/ai-automation",
  "/ads-promotion",
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
  await page.evaluate(() => {
    window.open = ((url?: string | URL) => {
      window.sessionStorage.setItem("testHandoff", String(url));
      return null;
    }) as typeof window.open;
  });
  await page
    .getByRole("button", { name: "Open WhatsApp with my brief" })
    .click();
  const href = await page.evaluate(() =>
    window.sessionStorage.getItem("testHandoff"),
  );
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
    ["/services/graphic-design", "/graphic-design"],
    ["/services/ai-video-adverts", "/aiads"],
    ["/services/social-media-management", "/social-media"],
    ["/services/digital-advertising", "/ads-promotion"],
    ["/services/ai-integration-automation", "/ai-automation"],
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
  test(`full default axe plus label-name check ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .options({ rules: { "label-content-name-mismatch": { enabled: true } } })
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
  // Paint all offscreen sections for a complete review image; production uses native rendering hints.
  await page.addStyleTag({
    content:
      ".supporting-service-section { content-visibility: visible !important; }",
  });
  await page.screenshot({ path: "artifacts/home-desktop-viewport.png" });
  await page.locator(".hero-project").scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    Array.from(document.images).every((i) => i.complete),
  );
  await page.screenshot({ path: "artifacts/work-desktop.png" });
  await page.screenshot({
    path: "artifacts/home-desktop-full.png",
    fullPage: true,
  });
  await page.locator(".closing-cta").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/cta-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  // Paint all offscreen sections for a complete review image; production uses native rendering hints.
  await page.addStyleTag({
    content:
      ".supporting-service-section { content-visibility: visible !important; }",
  });
  await page.screenshot({ path: "artifacts/home-mobile-viewport.png" });
  await page.screenshot({
    path: "artifacts/home-mobile-full.png",
    fullPage: true,
  });
  await page.locator(".menu-toggle").click();
  await page.screenshot({ path: "artifacts/menu-mobile.png" });
  await page.locator(".menu-toggle").click();
  await page.goto("/request-a-quote");
  await page.locator("form").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/quote-mobile.png" });
  await page.goto("/pricing");
  await page.screenshot({
    path: "artifacts/pricing-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "artifacts/pricing-desktop.png",
    fullPage: true,
  });
});

test("only one StarXCO project remains and removed work returns 404", async ({
  page,
  request,
}) => {
  await page.goto("/portfolio");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "StarXCO", exact: true }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /Visit live website/ }),
  ).toHaveAttribute("href", "https://starxco.com.ng/");
  await page
    .getByRole("link", {
      name: "View project details for StarXCO",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/portfolio\/starxco$/);
  await expect(page.locator("h1")).toHaveText("StarXCO");
  if (projects[0].image) {
    await expect(page.locator("figcaption")).toContainText(
      projects[0].image.credit,
    );
    await expect(page.locator("figcaption")).toContainText(
      projects[0].image.kind === "screenshot"
        ? "Website screenshot."
        : "not a website screenshot",
    );
  } else await expect(page.locator("figure, figcaption")).toHaveCount(0);
  for (const slug of [
    "daily-life-review",
    "kora-botanics",
    "abeni-stay",
    "ayo-studio",
  ])
    expect((await request.get(`/portfolio/${slug}`)).status()).toBe(404);
});
test("one consistent sales action and supplied-logo rendition", async ({
  page,
  request,
}) => {
  for (const route of [
    "/",
    "/website-development",
    "/business-websites",
    "/ecommerce-websites",
    "/pricing",
    "/portfolio",
  ]) {
    await page.goto(route);
    const buttons = await page.locator("a.button:visible").all();
    for (const button of buttons) {
      await expect(button).toContainText("Get a Website Quote");
      expect(await button.getAttribute("href")).toMatch(
        /^\/request-a-quote(?:\?|$)/,
      );
    }
    if (route === "/") {
      await expect(page.locator(".hero-actions a")).toHaveCount(1);
      await expect(page.locator(".closing-cta a")).toHaveCount(1);
      await expect(page.locator(".hero-project .project-card")).toHaveCount(1);
    }
  }
  await expect(page.locator("header .brand-mark")).toHaveAttribute(
    "viewBox",
    "0 0 256 245",
  );
  await expect(page.locator("header .brand-mark path[stroke]")).toHaveAttribute(
    "stroke",
    "#292929",
  );
  await expect(page.locator("footer .brand-mark path[stroke]")).toHaveAttribute(
    "stroke",
    "#FFFFFF",
  );
  const icon = await request.get("/icon.svg");
  expect(icon.ok()).toBe(true);
  expect(await icon.text()).toContain('stroke-width="13.4"');
});

test("approved prices appear consistently on the public sales journey", async ({
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
    await expect(page.locator(".package-card__price")).toHaveText([
      "From ₦100,000 NGN",
      "From ₦200,000 NGN",
      "From ₦300,000 NGN",
    ]);
    for (const card of await page.locator(".package-card").all()) {
      await expect(card).toContainText("Free .com.ng domain for 1 year");
      await expect(card).toContainText("Free hosting for 1 year");
    }
    await expect(
      page
        .locator("p.form-fineprint")
        .filter({ hasText: "starting design-and-development charges" }),
    ).toContainText("renewals after year one");
    await expect(page.locator(".package-card").first()).toContainText(
      "multi-page website",
    );
    await expect(
      page
        .locator("p.form-fineprint")
        .filter({ hasText: "starting design-and-development charges" }),
    ).toBeVisible();
  }
  await page.goto("/pricing");
  await expect(page).toHaveTitle(
    "Website Design Prices & Packages in Nigeria | GROWTHLY",
  );
  await expect(
    page.getByRole("heading", {
      name: "What affects the cost of a website in Nigeria?",
    }),
  ).toBeVisible();
});

test("floating WhatsApp drags without opening and remembers its position", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("link", {
    name: "Chat with Growthly on WhatsApp",
    exact: true,
  });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute(
    "href",
    /https:\/\/wa.me\/2348129391626\?text=/,
  );
  const box = (await link.boundingBox())!;
  let popups = 0;
  page.on("popup", () => popups++);
  await page.mouse.move(box.x + 28, box.y + 28);
  await page.mouse.down();
  await page.mouse.move(180, 330, { steps: 10 });
  await page.mouse.up();
  const moved = (await link.boundingBox())!;
  expect(moved.x).toBeCloseTo(152, 0);
  expect(moved.y).toBeCloseTo(302, 0);
  expect(popups).toBe(0);
  await page.reload();
  await expect
    .poll(async () => (await link.boundingBox())!.x)
    .toBeCloseTo(moved.x, 0);
  await page.goto("/pricing");
  await expect
    .poll(async () => (await link.boundingBox())!.y)
    .toBeCloseTo(moved.y, 0);
});

test("floating WhatsApp supports keyboard positioning, reset and viewport clamping", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.locator(".floating-whatsapp");
  await link.focus();
  const start = (await link.boundingBox())!;
  await link.press("ArrowLeft");
  await link.press("ArrowUp");
  const moved = (await link.boundingBox())!;
  expect(moved.x).toBeCloseTo(start.x - 16, 0);
  expect(moved.y).toBeCloseTo(start.y - 16, 0);
  await page.setViewportSize({ width: 390, height: 600 });
  await expect
    .poll(async () => {
      const b = (await link.boundingBox())!;
      return b.x + b.width <= 390 && b.y + b.height <= 600;
    })
    .toBe(true);
  await link.press("Home");
  await expect.poll(async () => (await link.boundingBox())!.x).toBe(314);
  await expect.poll(async () => (await link.boundingBox())!.y).toBe(524);
});

test("floating WhatsApp opens the correct handoff only on activation", async ({
  page,
  context,
}) => {
  await context.route("https://wa.me/**", (route) =>
    route.fulfill({ body: "Test WhatsApp handoff; no message sent." }),
  );
  await page.goto("/");
  const popupPromise = page.waitForEvent("popup");
  await page.locator(".floating-whatsapp").click();
  const popup = await popupPromise;
  await popup.waitForURL(/https:\/\/wa.me\/2348129391626\?text=/);
  expect(decodeURIComponent(popup.url())).toContain("I’d like a website quote");
  await popup.close();
});

test("floating WhatsApp recovers from blocked storage and stays off admin", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", {
      value() {
        throw new Error("Storage unavailable");
      },
    });
    Object.defineProperty(Storage.prototype, "setItem", {
      value() {
        throw new Error("Storage unavailable");
      },
    });
  });
  await page.goto("/");
  await expect(page.locator(".floating-whatsapp")).toBeVisible();
  await page.locator(".floating-whatsapp").focus();
  await page.locator(".floating-whatsapp").press("ArrowUp");
  await page.goto("/admin/login");
  await expect(page.locator(".floating-whatsapp")).toHaveCount(0);
});

test("floating WhatsApp handles touch dragging and avoids consent controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const link = page.locator(".floating-whatsapp");
  const box = (await link.boundingBox())!;
  const session = await page.context().newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + 28, y: box.y + 28 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 180, y: 400 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(async () => (await link.boundingBox())!.y)
    .toBeCloseTo(372, 0);
  await session.detach();
  await page.evaluate(() => {
    const banner = document.createElement("aside");
    banner.className = "consent-banner";
    banner.style.height = "220px";
    banner.textContent = "Test consent controls";
    document.body.append(banner);
  });
  await link.focus();
  await link.press("Home");
  const banner = (await page.locator(".consent-banner").boundingBox())!;
  const position = (await link.boundingBox())!;
  expect(position.y + position.height).toBeLessThanOrEqual(banner.y - 16);
});

test("full homepage hierarchy, real work only and useful CTA spacing", async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const id of [
      "website-solutions",
      "why-growthly",
      "our-work",
      "packages",
      "our-process",
      "questions",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
      await expect(page.locator(`.journey-nav a[href="#${id}"]`)).toBeVisible();
    }
    await expect(page.locator(".solution-card")).toHaveCount(7);
    await expect(page.locator(".project-card")).toHaveCount(1);
    await expect(page.locator(".hero-project h2")).toHaveText("StarXCO");
    await expect(page.locator("#our-process .process-step")).toHaveCount(4);
    await expect(page.locator("#questions .faq-item")).toHaveCount(11);
    const text = await page.locator("main").innerText();
    for (const name of [
      "Daily Life Review",
      "Kora Botanics",
      "Abeni Stay",
      "Ayo Studio",
      "Self-initiated",
      "Demonstration work",
    ])
      expect(text).not.toContain(name);
    const tips = (await page.locator(".hero-assurances").boundingBox())!;
    const action = (await page.locator(".hero-actions").boundingBox())!;
    expect(action.y - (tips.y + tips.height)).toBeGreaterThanOrEqual(24);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});

test("mobile quote action has white text including hover and focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".menu-toggle").click();
  const link = page.locator(".mobile-nav-cta");
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
  await link.hover();
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
  await link.focus();
  await expect(link).toHaveCSS("color", "rgb(255, 255, 255)");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("package details remain accessible on demand", async ({ page }) => {
  await page.goto("/pricing");
  const scope = page.locator(".package-scope").first();
  await expect(scope).not.toHaveAttribute("open", "");
  await scope.locator("summary").click();
  await expect(scope).toHaveAttribute("open", "");
  await expect(scope).toContainText("renewals after year one");
});

test("project media uses only a registered local asset, otherwise intentional text-only work", async ({
  page,
  request,
}) => {
  const remoteImages: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("starxco.com.ng/assets")) remoteImages.push(r.url());
  });
  for (const path of ["/", "/portfolio", "/portfolio/starxco"]) {
    await page.goto(path);
    if (projects[0].image) {
      const asset = projects[0].image;
      const response = await request.get(asset.src);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/webp");
      const image = page.locator(".project-front-image img");
      await expect(image).toHaveAttribute("alt", asset.alt);
      if (path === "/")
        await expect(page.locator(".hero-project img")).toHaveAttribute(
          "fetchpriority",
          "high",
        );
      await expect
        .poll(() =>
          image.evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
        )
        .toBe(true);
    } else {
      await expect(
        page.locator(".project-front-image, .project-image-fallback"),
      ).toHaveCount(0);
      await expect(
        page.getByRole("link", { name: /Visit live website/ }),
      ).toHaveAttribute("href", "https://starxco.com.ng/");
      expect(await page.locator("main").innerText()).not.toContain(
        "Image source",
      );
    }
  }
  expect(remoteImages).toEqual([]);
});

test("external image-host failure cannot break the project or its live link", async ({
  page,
  context,
}) => {
  const external: string[] = [];
  await context.route("https://starxco.com.ng/**", (route) => {
    external.push(route.request().url());
    return route.abort();
  });
  await page.goto("/");
  await expect(
    page
      .locator(".hero-project")
      .getByRole("link", { name: /Visit live website/ }),
  ).toHaveAttribute("href", "https://starxco.com.ng/");
  if (!projects[0].image) {
    await expect(page.locator(".hero-project img")).toHaveCount(0);
    await expect(page.locator(".project-image-fallback")).toHaveCount(0);
    await expect(
      page.locator(".hero-project .project-card--text-only"),
    ).toBeVisible();
  }
  expect(external).toEqual([]);
});
