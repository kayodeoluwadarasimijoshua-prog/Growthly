import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const base = process.env.CMS_TEST_URL;
test.skip(
  !base,
  "Requires explicit isolated CMS component harness; not a real owner account.",
);
const state = (page: Page) =>
  page.request.get(`${base}/__cms_test/state`).then((r) => r.json());
test.beforeEach(async ({ page }) => {
  await page.request.post(`${base}/__cms_test/reset`, { data: {} });
  await page.goto(`${base}/tests/fixtures/cms-editor/index.html`);
  await expect(
    page.getByRole("heading", { name: "Website content", exact: true }),
  ).toBeVisible();
});
async function completeProject(page: Page) {
  await page.getByRole("button", { name: "Add project", exact: true }).click();
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Synthetic owner test project");
  await page
    .getByLabel("Category", { exact: true })
    .fill("Synthetic test category");
  await page
    .getByLabel("Work type", { exact: true })
    .selectOption("demonstration");
  await page
    .getByLabel("Short summary", { exact: true })
    .fill(
      "Synthetic demonstration created only for local testing, not real client work.",
    );
  await page
    .getByLabel("What Growthly delivered", { exact: true })
    .fill(
      "A synthetic layout description used to test the owner content editor in an isolated fixture.",
    );
  await page
    .getByLabel("Purpose / creative intent", { exact: true })
    .fill(
      "Check that the owner can add truthful work without editing application code.",
    );
  await page
    .getByLabel("Deliverables — one per line", { exact: true })
    .fill("Synthetic test layout");
  await page
    .getByLabel("Design decisions — one per line", { exact: true })
    .fill("Readable headings and honest sample labels");
}
test("adds an incomplete private draft with automatic URL and a private text preview", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add project", exact: true }).click();
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Synthetic private work");
  await expect(page.getByLabel("URL slug", { exact: true })).toHaveValue(
    "synthetic-private-work",
  );
  await page.getByText("Preview this draft project", { exact: true }).click();
  await expect(page.locator(".cms-draft-preview")).toContainText(
    "Private preview",
  );
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  const s = await state(page);
  expect(s.published).toBeNull();
  expect(s.draft.projects[1].name).toBe("Synthetic private work");
});
test("publishes complete, permission-confirmed work and locks its live URL", async ({
  page,
}) => {
  await completeProject(page);
  await page.getByLabel(/I confirm this description is truthful/).check();
  await page.getByLabel(/Include this project on the next publication/).check();
  await page
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Published");
  const s = await state(page);
  expect(s.published.projects[1].kind).toBe("demonstration");
  await expect(page.getByLabel("URL slug", { exact: true })).toBeDisabled();
});
test("a saved unpublished price draft still requires explicit confirmation after reload", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Contact & pricing", exact: true })
    .click();
  await page.getByLabel("Starter Website", { exact: true }).fill("150000");
  await expect(
    page.getByRole("button", { name: "Publish changes", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page.reload();
  await page
    .getByRole("button", { name: "Contact & pricing", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Publish changes", exact: true }),
  ).toBeDisabled();
  await page.getByLabel(/I reviewed all three public starting prices/).check();
  await page
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Published");
  expect((await state(page)).published.settings.prices.starter).toBe(150000);
});
test("keeps image uploads private and requires alt, credit and separate image permission", async ({
  page,
}) => {
  await page.getByLabel("Upload image", { exact: true }).setInputFiles({
    name: "synthetic.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(page.getByRole("status")).toContainText("Choose a JPEG");
  await page.getByLabel("Upload image", { exact: true }).setInputFiles({
    name: "synthetic.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "synthetic bytes — upload sanitisation tested by real sharp unit tests",
    ),
  });
  await expect(page.getByRole("status")).toContainText(
    "Image stored privately",
  );
  expect((await state(page)).published).toBeNull();
  await expect(page.locator(".cms-image-preview img")).toHaveAttribute(
    "src",
    /^\/api\/admin\/content\/media\//,
  );
  await page
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Review before publishing",
  );
  await page
    .getByLabel("Image alt text", { exact: true })
    .fill("Synthetic test preview");
  await page
    .getByLabel("Image source / credit", { exact: true })
    .fill("Synthetic fixture only");
  await page
    .getByLabel("I have permission to publish this image.", { exact: true })
    .check();
  await page
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Published");
});
test("shows conflicts without discarding unsaved edits", async ({ page }) => {
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Synthetic unsaved name");
  await page.request.post(`${base}/__cms_test/control`, {
    data: { conflict: true },
  });
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Another tab");
  await expect(page.getByLabel("Project name", { exact: true })).toHaveValue(
    "Synthetic unsaved name",
  );
  await expect(page.locator(".cms-revision")).toContainText("Unsaved changes");
});
test("restores history only as a draft, clearing permissions without changing the publication", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page
    .getByRole("button", { name: "Publish changes", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Published");
  const published = (await state(page)).published;
  await page.getByRole("button", { name: "History", exact: true }).click();
  await page
    .getByRole("button", { name: "Restore as draft", exact: true })
    .last()
    .click();
  await expect(page.getByRole("status")).toContainText("restored as a draft");
  const s = await state(page);
  expect(s.published).toEqual(published);
  expect(s.draft.projects[0].publicationConfirmed).toBe(false);
});
test("supports FAQ price tokens while leaving manually typed campaign amounts unchanged", async ({
  page,
}) => {
  await page.getByRole("button", { name: "FAQs", exact: true }).click();
  await page
    .getByLabel("FAQ page/group", { exact: true })
    .selectOption("graphic-design");
  await page
    .getByLabel("Answer 1", { exact: true })
    .fill("Website {{starter_price}}; separate campaign budget ₦100,000.");
  await expect(page.locator(".cms-faq-row").first()).toContainText(
    "Public answer preview: Website From ₦100,000; separate campaign budget ₦100,000.",
  );
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
});
for (const width of [375, 768, 1440])
  test(`editor sections remain usable with no overflow/a11y findings at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const name of [
      "Projects",
      "Contact & pricing",
      "Page text",
      "FAQs",
      "History",
    ]) {
      await page.getByRole("button", { name, exact: true }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        name,
      ).toBe(true);
      const result = await new AxeBuilder({ page }).analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        name,
      ).toEqual([]);
    }
    if (width === 375)
      await page.screenshot({
        path: "artifacts/cms-editor-mobile.png",
        fullPage: true,
      });
  });

test("discarding different unsaved prices invalidates the prior pricing confirmation", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Contact & pricing", exact: true })
    .click();
  await page.getByLabel("Starter Website", { exact: true }).fill("150000");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await page.getByLabel("Starter Website", { exact: true }).fill("175000");
  await page.getByLabel(/I reviewed all three public starting prices/).check();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Discard unsaved edits", exact: true })
    .click();
  await expect(page.getByLabel("Starter Website", { exact: true })).toHaveValue(
    "150000",
  );
  await expect(
    page.getByRole("button", { name: "Publish changes", exact: true }),
  ).toBeDisabled();
});
test("reorders and removes draft projects without publishing the change", async ({
  page,
}) => {
  await completeProject(page);
  await page.getByRole("button", { name: "Move earlier", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Remove project from draft", exact: true })
    .click();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  const s = await state(page);
  expect(s.draft.projects.map((p: { slug: string }) => p.slug)).toEqual([
    "starxco",
  ]);
  expect(s.published).toBeNull();
});
