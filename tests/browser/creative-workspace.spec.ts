import { test, expect } from "@playwright/test";
import type { CmsProject } from "../../lib/cms/schema";
const base = process.env.CMS_TEST_URL;
test.skip(
  !base,
  "Requires the isolated component harness; not live Auth or provider acceptance.",
);
test("creative draft, AI suggestion review and owner import stay private", async ({
  page,
}) => {
  const rows: {
    id: string;
    revision: number;
    project: CmsProject;
    status: string;
  }[] = [];
  await page.request.post(`${base}/__cms_test/reset`, { data: {} });
  await page.route("**/api/creative/projects", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({ json: { projects: rows } });
    const data = route.request().postDataJSON();
    const row = {
      id: data.project.id,
      revision: 1,
      project: data.project,
      status: data.status,
    };
    rows.splice(0, rows.length, row);
    return route.fulfill({
      json: {
        revision: 1,
        message: "Submitted for owner review. Nothing is published yet.",
      },
    });
  });
  await page.route("**/api/creative/refine", (route) =>
    route.fulfill({
      json: {
        refinement:
          "A synthetic product advert built around the client-supplied script and approved product information.",
      },
    }),
  );
  await page.goto(`${base}/tests/fixtures/creative-editor/index.html`);
  await page.getByRole("button", { name: "Add creative project" }).click();
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Synthetic AI advert");
  await page
    .getByLabel("Short summary", { exact: true })
    .fill("An AI-assisted product advert created for a synthetic test brief.");
  await page
    .getByLabel("Description / factual notes", { exact: true })
    .fill(
      "We created a product advert from a client-supplied script and product information.",
    );
  await page
    .getByRole("button", { name: "Refine description with AI" })
    .click();
  await expect(
    page.getByLabel("AI writing suggestion — review before use"),
  ).toBeVisible();
  expect(rows).toHaveLength(0);
  await expect(
    page.getByLabel("Description / factual notes", { exact: true }),
  ).toHaveValue(
    "We created a product advert from a client-supplied script and product information.",
  );
  await page.getByRole("button", { name: "Apply to draft" }).click();
  await expect(
    page.getByLabel("Description / factual notes", { exact: true }),
  ).toHaveValue(/synthetic product advert/);
  await page.getByRole("button", { name: "Submit for owner review" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Submitted for owner review",
  );
  expect(rows[0].project).toMatchObject({
    service: "ai-video-adverts",
    published: false,
    publicationConfirmed: false,
    featured: false,
  });
  await page.goto(`${base}/tests/fixtures/creative-editor/index.html?owner`);
  await page
    .getByRole("button", { name: "Creative submissions", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Import Synthetic AI advert into owner draft",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Synthetic AI advert", exact: true }),
  ).toBeVisible();
  const state = await page.request
    .get(`${base}/__cms_test/state`)
    .then((r) => r.json());
  expect(state.published).toBeNull();
  await expect(page.getByRole("status")).toContainText("unsaved draft");
});
