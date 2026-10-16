import { test, expect } from "@playwright/test";
const quotePath =
  "/request-a-quote?type=Business%20website&package=business-website";
const privateNames = ["full_name", "business_name", "phone", "email", "brief"];
function assertNoPrivateQuery(url: string) {
  const query = new URL(url).searchParams;
  for (const name of privateNames) expect(query.has(name), name).toBe(false);
}

test("no-JavaScript form is inactive with working direct contact links", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
    baseURL,
  });
  try {
    await context.route("https://wa.me/**", (route) =>
      route.fulfill({
        body: "Mock contact handoff only; no message delivered.",
      }),
    );
    const page = await context.newPage();
    await page.goto(quotePath);
    const form = page.locator(".inquiry-form");
    await expect(form).toHaveAttribute("method", "post");
    await expect(form).toHaveAttribute("action", "/api/inquiries/fallback");
    await expect(form).toHaveAttribute("data-ready", "false");
    await expect(form.locator("fieldset")).toHaveAttribute("disabled", "");
    await expect(form.locator("[name=full_name]")).toBeDisabled();
    await expect(form.locator("fieldset")).toBeHidden();
    const direct = form.locator(".form-unavailable-note");
    await expect(direct).toContainText("JavaScript is disabled");
    await expect(direct).toContainText("No enquiry has been sent");
    await expect(
      direct.getByRole("link", { name: "Call 09162994183" }),
    ).toBeVisible();
    await expect(
      direct.getByRole("link", { name: "WhatsApp 08129391626" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      direct.getByRole("link", { name: "Call 09162994183" }),
    ).toHaveAttribute("href", "tel:09162994183");
    const popupPromise = page.waitForEvent("popup");
    await direct.getByRole("link", { name: "WhatsApp 08129391626" }).click();
    const popup = await popupPromise;
    await popup.waitForURL(/https:\/\/wa.me\/2348129391626\?text=/);
    await popup.close();
    assertNoPrivateQuery(page.url());
  } finally {
    await context.close();
  }
});

test("blocked application scripts leave a safe usable contact fallback", async ({
  page,
}) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort());
  await page.goto(quotePath);
  await expect(page.locator(".inquiry-form")).toHaveAttribute(
    "data-ready",
    "false",
  );
  await expect(page.locator(".inquiry-form-controls")).toBeHidden();
  await expect(page.locator('[name="full_name"]')).toBeDisabled();
  await expect(page.locator(".form-unavailable-note")).toBeVisible();
  await expect(page.locator(".form-unavailable-note a")).toHaveCount(2);
  assertNoPrivateQuery(page.url());
});

test("delayed hydration cannot accept private input then safely enables the form", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/**/*.js", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto(quotePath, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".inquiry-form")).toHaveAttribute(
      "data-ready",
      "false",
    );
    await expect(page.locator('[name="full_name"]')).toBeDisabled();
    await expect(page.locator(".inquiry-form-controls")).toBeHidden();
    assertNoPrivateQuery(page.url());
    release();
    await expect(page.locator(".inquiry-form")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await expect(page.locator(".inquiry-form-controls")).toBeVisible();
    await expect(page.locator(".form-unavailable-note")).toBeHidden();
    await expect(page.locator('[name="package_id"]')).toHaveValue(
      "business-website",
    );
    await expect(page.locator('[name="website_type"]')).toHaveValue(
      "Business website",
    );
    await page.locator('[name="full_name"]').fill("Synthetic Owner");
    await page.locator('[name="business_name"]').fill("Synthetic Business");
    await page.locator('[name="phone"]').fill("08012345678");
    await page
      .locator('[name="brief"]')
      .fill(
        "Synthetic business website brief used only for a privacy regression test.",
      );
    await page.locator('[name="consent"]').check();
    const natives: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/api/inquiries/fallback")) natives.push(r.url());
    });
    await page.getByRole("button", { name: "Prepare WhatsApp brief" }).click();
    await expect(page.getByRole("status")).toContainText("not yet sent");
    expect(natives).toEqual([]);
    assertNoPrivateQuery(page.url());
  } finally {
    release();
  }
});

for (const javaScriptEnabled of [false, true]) {
  test(`forced native submit remains private (JavaScript ${javaScriptEnabled ? "enabled" : "disabled"})`, async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled, baseURL });
    try {
      const page = await context.newPage();
      await page.goto(quotePath);
      const initial = new URL(page.url());
      const urls: string[] = [];
      page.on("request", (r) => {
        if (new URL(r.url()).origin === initial.origin) urls.push(r.url());
      });
      // Bypass the interaction lock/React handler to prove the native POST safety net.
      const native = page.waitForRequest((r) =>
        r.url().includes("/api/inquiries/fallback"),
      );
      const fallback = page.waitForResponse((r) =>
        r.url().includes("/api/inquiries/fallback"),
      );
      await Promise.all([
        page.waitForURL(
          (url) =>
            url.pathname === "/request-a-quote" &&
            url.search === "?form=fallback",
        ),
        page.evaluate(() => {
          const form =
            document.querySelector<HTMLFormElement>(".inquiry-form")!;
          const controls = form.querySelector<HTMLFieldSetElement>("fieldset")!;
          controls.disabled = false;
          controls.hidden = false;
          const values = {
            full_name: "Synthetic Owner",
            business_name: "Synthetic Business",
            phone: "08012345678",
            email: "synthetic@example.com",
            brief: "Synthetic private audit brief only. Do not deliver.",
          };
          for (const [name, value] of Object.entries(values))
            (form.elements.namedItem(name) as HTMLInputElement).value = value;
          HTMLFormElement.prototype.submit.call(form);
        }),
      ]);
      const request = await native;
      expect(request.method()).toBe("POST");
      expect(new URL(request.url()).search).toBe("");
      expect(request.postData()).toContain("full_name=");
      const response = await fallback;
      expect(response.status()).toBe(303);
      expect(response.headers()["cache-control"]).toContain("no-store");
      expect(response.headers()["referrer-policy"]).toBe("no-referrer");
      expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
      expect(response.headers()["location"]).toBe(
        "/request-a-quote?form=fallback",
      );
      for (const url of urls) assertNoPrivateQuery(url);
      await expect(page.locator(".quote-fallback-status")).toContainText(
        "Your request was not sent",
      );
      await expect(page.locator(".quote-fallback-status")).toContainText(
        "not processed",
      );
      if (!javaScriptEnabled)
        await expect(page.locator(".form-unavailable-note")).toBeVisible();
    } finally {
      await context.close();
    }
  });
}
