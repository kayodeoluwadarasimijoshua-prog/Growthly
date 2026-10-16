import { afterEach, describe, expect, it, vi } from "vitest";
import {
  websitePackages,
  websitePriceSummary,
  websiteHostingOffer,
} from "@/config/business";
import { seoPages } from "@/config/seo";
import { pageMetadata } from "@/lib/seo";
import robots from "@/app/robots";

afterEach(() => vi.unstubAllEnvs());
describe("approved pricing and focused SEO", () => {
  it("keeps numeric and displayed starting prices consistent", () => {
    expect(websitePackages.map((p) => p.priceValue)).toEqual([
      100000, 200000, 300000,
    ]);
    for (const p of websitePackages)
      expect(p.price).toBe(`From ₦${p.priceValue.toLocaleString("en-NG")}`);
    expect(websitePriceSummary).toContain("Business Website: from ₦200,000");
    expect(
      websitePackages.every(
        (p) =>
          p.separateFees.includes("hosting") &&
          p.separateFees.includes("maintenance"),
      ),
    ).toBe(true);
  });
  it("includes the approved first-year bundle and multi-page Starter", () => {
    expect(websiteHostingOffer.domainYears).toBe(1);
    expect(websiteHostingOffer.hostingYears).toBe(1);
    for (const p of websitePackages) {
      expect(p.includes).toContain(websiteHostingOffer.domainLabel);
      expect(p.includes).toContain(websiteHostingOffer.hostingLabel);
      expect(p.separateFees).toContain("renewals after year one");
    }
    expect(websitePackages[0].includes[0]).toContain("multi-page");
    expect(websitePackages[0].includes.join(" ")).not.toContain("one-page");
  });
  it("uses unique, descriptive titles, descriptions and canonical routes", () => {
    const pages = Object.values(seoPages);
    expect(new Set(pages.map((p) => p.title)).size).toBe(pages.length);
    expect(new Set(pages.map((p) => p.description)).size).toBe(pages.length);
    for (const page of pages) {
      const metadata = pageMetadata(page.title, page.description, page.path);
      expect(metadata.title).toEqual({ absolute: `${page.title} | GROWTHLY` });
      expect(metadata.alternates?.canonical).toBe(
        `https://growthly.com.ng${page.path}`,
      );
      expect(page.description.length).toBeLessThan(190);
    }
  });
  it("keeps the shared brand image on every child-page social metadata override", () => {
    for (const page of Object.values(seoPages)) {
      const metadata = pageMetadata(page.title, page.description, page.path);
      expect(metadata.openGraph?.images).toEqual([
        {
          url: "https://growthly.com.ng/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Growthly — professional websites for Nigerian businesses",
        },
      ]);
      expect(metadata.twitter?.images).toEqual([
        "https://growthly.com.ng/opengraph-image",
      ]);
    }
  });
  it("keeps pricing SEO in sync with approved package amounts", () => {
    for (const p of websitePackages)
      expect(seoPages.pricing.description).toContain(p.price.toLowerCase());
  });
  it("allows intended public production crawling without exposing admin/API", () => {
    vi.stubEnv("SITE_INDEXING_ENABLED", "true");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots().rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/review-media/"],
    });
  });
  it("blocks preview indexing even when the production flag is inherited", () => {
    vi.stubEnv("SITE_INDEXING_ENABLED", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });
});

it("lightweight client public identifiers stay aligned with the canonical real content", async () => {
  const { publicServiceSlugs, publicProjectSlugs, publicRoutePaths } =
    await import("@/config/public-route-ids");
  const { services, projects } = await import("@/config/content");
  expect([...publicServiceSlugs].sort()).toEqual(
    services.map((s) => s.slug).sort(),
  );
  expect([...publicProjectSlugs].sort()).toEqual(
    projects.map((p) => p.slug).sort(),
  );
  expect(new Set(publicRoutePaths).size).toBe(19);
});
