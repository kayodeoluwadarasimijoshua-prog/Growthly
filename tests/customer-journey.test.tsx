import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  websiteFitChoices,
  independentWebsiteExamples,
} from "@/config/customer-journey";
import { websitePackages } from "@/config/business";
import { websiteTypes } from "@/config/websites";
import { projects, services } from "@/config/content";
import { publicRoutePaths } from "@/config/public-route-ids";
import {
  WebsiteFitGuide,
  IndependentWebsiteExamples,
} from "@/components/CustomerJourney";
import { ProjectCard } from "@/components/ProjectCard";
import { isPublicIndexingEnabled } from "@/lib/indexing";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

afterEach(() => vi.unstubAllEnvs());
describe("fuller customer journey safeguards", () => {
  it("offers only real approved packages and valid website types", async () => {
    expect(websiteFitChoices.map((c) => c.packageId)).toEqual(
      websitePackages.map((p) => p.id),
    );
    for (const choice of websiteFitChoices)
      expect(websiteTypes).toContain(choice.type);
    const html = renderToStaticMarkup(await WebsiteFitGuide());
    expect((html.match(/<details /g) || []).length).toBe(3);
    for (const choice of websiteFitChoices) {
      expect(html).toContain(`package=${choice.packageId}`);
      expect(html).toContain(encodeURIComponent(choice.type));
    }
    expect(html).not.toMatch(/<input|<form|<script/);
  });
  it("keeps independent references separate from commissioned work", () => {
    const html = renderToStaticMarkup(<IndependentWebsiteExamples />);
    expect(html).toContain("Growthly did not build them");
    expect(html).toContain("not affiliated");
    expect(html).not.toMatch(/<img|<iframe/);
    for (const example of independentWebsiteExamples) {
      expect(new URL(example.href).protocol).toBe("https:");
      expect(projects.some((p) => p.liveUrl === example.href)).toBe(false);
      expect(html).toContain(example.href);
    }
  });
  it("uses project configuration rather than StarXCO-specific card copy", () => {
    const sample = {
      ...projects[0],
      name: "Fixture only",
      category: "Test category",
      summary: "Synthetic test description only.",
      image: undefined,
    };
    const html = renderToStaticMarkup(
      <ProjectCard project={sample} headingLevel={3} />,
    );
    expect(html).toContain("<h3>Fixture only</h3>");
    expect(html).toContain("Test category");
    expect(html).toContain("Synthetic test description only.");
    expect(html).not.toContain("Energy, maritime &amp; trade");
  });
  it("sitemap and lightweight public routes remain identical and unique", async () => {
    const paths = (await sitemap()).map((entry) => new URL(entry.url).pathname);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths.sort()).toEqual([...publicRoutePaths].sort());
    for (const path of paths)
      expect(path).not.toMatch(/admin|api\/|review-media|\?/);
    expect(paths).not.toContain("/services/website-development");
  });
  it("all real services remain available, without enabling provider integrations", () => {
    expect(services.map((s) => s.slug)).toContain("ai-integration-automation");
    expect(services).toHaveLength(6);
    expect(
      services
        .find((s) => s.slug === "website-development")!
        .boundaries.join(" "),
    ).toContain("first-year");
  });
});

describe("one consistent public indexing decision", () => {
  const approved = {
    SITE_INDEXING_ENABLED: "true",
    VERCEL_ENV: "production",
    NODE_ENV: "production",
  };
  it("requires explicit approval", () =>
    expect(isPublicIndexingEnabled({})).toBe(false));
  it("permits an approved public production build", () =>
    expect(isPublicIndexingEnabled(approved)).toBe(true));
  for (const [key, value] of [
    ["VERCEL_ENV", "preview"],
    ["VERCEL_ENV", "development"],
    ["NODE_ENV", "development"],
    ["PROJECT_IMAGE_REVIEW_MODE", "true"],
  ]) {
    it(`rejects ${key}=${value} even with inherited approval`, () =>
      expect(isPublicIndexingEnabled({ ...approved, [key]: value })).toBe(
        false,
      ));
  }
  it("private review forces robots to disallow crawling even with inherited approval", () => {
    for (const [key, value] of Object.entries(approved)) vi.stubEnv(key, value);
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });
});
