import { describe, expect, it } from "vitest";
import { defaultCmsDocument } from "@/lib/cms/defaults";
import { cmsDocumentSchema, publicationIssues } from "@/lib/cms/schema";
import { priceText, packagesFor, expandPriceTokens } from "@/lib/cms/format";

describe("editable content validation and public safety", () => {
  it("preserves the approved defaults and permission-pending image gate", () => {
    const doc = defaultCmsDocument();
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(true);
    expect(doc.projects.map((p) => p.slug)).toEqual(["starxco"]);
    expect(doc.projects[0].image).toBeNull();
    expect(publicationIssues(doc, null)).toEqual([]);
    expect(doc.settings.prices).toEqual({
      starter: 100000,
      business: 200000,
      ecommerce: 300000,
    });
  });
  it("rejects extra fields, markup, foreign protocols, credentials and duplicated slugs", () => {
    const doc = defaultCmsDocument();
    expect(
      cmsDocumentSchema.safeParse({ ...doc, service_key: "not-a-secret" })
        .success,
    ).toBe(false);
    for (const url of [
      "javascript:alert(1)",
      "http://example.com",
      "https://user:pass@example.com",
      "https://localhost/",
      "https://localhost./",
      "https://a.local/",
      "https://192.168.1.1/",
      "https://[::1]/",
    ]) {
      doc.projects[0].liveUrl = url;
      expect(cmsDocumentSchema.safeParse(doc).success).toBe(false);
    }
    doc.projects[0].liveUrl = "";
    doc.settings.homeIntro = "<script>synthetic invalid content</script>";
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(false);
    const dup = defaultCmsDocument();
    dup.projects.push({ ...dup.projects[0] });
    expect(cmsDocumentSchema.safeParse(dup).success).toBe(false);
  });
  it("allows incomplete private project drafts, not incomplete public projects", () => {
    const doc = defaultCmsDocument();
    const p = doc.projects[0];
    p.name = "";
    p.summary = "";
    p.overview = "";
    p.creativeIntent = "";
    p.scope = [];
    p.designChoices = [];
    p.published = false;
    p.publicationConfirmed = false;
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(true);
    expect(publicationIssues(doc, null)).toEqual([]);
    p.published = true;
    expect(publicationIssues(doc, null).length).toBeGreaterThan(0);
  });
  it("requires separate description and image publication permissions and immutable live slugs", () => {
    const old = defaultCmsDocument(),
      doc = defaultCmsDocument();
    doc.projects[0].publicationConfirmed = false;
    doc.projects[0].slug = "changed-url";
    doc.projects[0].image = {
      assetId: "11111111-1111-4111-8111-111111111111",
      width: 800,
      height: 400,
      alt: "Test project image",
      credit: "Synthetic source credit",
      permissionConfirmed: false,
    };
    const problems = publicationIssues(doc, old);
    expect(problems.length).toBe(3);
    expect(problems.join(" ")).toContain("URL cannot be renamed");
  });
  it("keeps Home website-first and demonstrates work honestly", () => {
    const doc = defaultCmsDocument();
    doc.projects[0].kind = "demonstration";
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(false);
    doc.projects[0].featured = false;
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(true);
  });
  it("validates phones and ordered prices", () => {
    const doc = defaultCmsDocument();
    doc.settings.whatsapp = "javascript:123";
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(false);
    doc.settings.whatsapp = "+2348129391626";
    doc.settings.prices.starter = 500000;
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(false);
  });
  it("reprices trusted default text in one pass and supports explicit FAQ tokens", () => {
    const settings = defaultCmsDocument().settings;
    settings.prices = { starter: 200000, business: 300000, ecommerce: 500000 };
    expect(priceText("₦100,000 / ₦200,000 / ₦300,000", settings)).toBe(
      "₦200,000 / ₦300,000 / ₦500,000",
    );
    expect(priceText("{{starter_price}}", settings)).toBe("From ₦200,000");
    expect(packagesFor(settings).map((p) => p.priceValue)).toEqual([
      200000, 300000, 500000,
    ]);
  });
});

it("expands explicit CMS tokens without rewriting unrelated campaign costs", () => {
  const s = defaultCmsDocument().settings;
  s.prices.starter = 150000;
  expect(
    expandPriceTokens("Website {{starter_price}}; campaign budget ₦100,000", s),
  ).toBe("Website From ₦150,000; campaign budget ₦100,000");
  expect(expandPriceTokens(s.websiteFaqs[0].answer, s)).toContain("₦150,000");
});

it("updates prices followed by sentence commas, never a partial larger amount", () => {
  const s = defaultCmsDocument().settings;
  s.prices = { starter: 150000, business: 250000, ecommerce: 400000 };
  expect(
    priceText("Starter ₦100,000, Business ₦200,000, E-commerce ₦300,000.", s),
  ).toBe("Starter ₦150,000, Business ₦250,000, E-commerce ₦400,000.");
  expect(priceText("₦100,000,000 and ₦100,0000", s)).toBe(
    "₦100,000,000 and ₦100,0000",
  );
});
