import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  servicePages,
  getServicePage,
  getServicePageForPath,
  getServicePath,
  getServiceQuoteHref,
} from "@/config/service-pages";
import { services } from "@/config/content";
import { serviceMarketing } from "@/config/service-marketing";
import { getPublicPagePaths } from "@/lib/public-pages";
import { publicRoutePaths } from "@/config/public-route-ids";
import { StartProjectLink } from "@/components/ContactLinks";

afterEach(() => vi.unstubAllEnvs());

describe("one canonical ad destination for each actual service", () => {
  it("all offered services have a unique known path and CTA", () => {
    expect(servicePages.map((p) => p.slug).sort()).toEqual(
      services.map((s) => s.slug).sort(),
    );
    expect(new Set(servicePages.map((p) => p.path)).size).toBe(services.length);
    expect(getServicePath("ai-video-adverts")).toBe("/aiads");
    expect(getServicePath("digital-advertising")).toBe("/ads-promotion");
    expect(getServicePageForPath("/unknown")).toBeUndefined();
    expect(getServicePath("unknown")).toBe("/services");
  });
  for (const page of servicePages) {
    it(`${page.slug}: CTA, route and quote identity stay consistent`, () => {
      expect(getServicePage(page.slug)).toBe(page);
      expect(getServicePageForPath(page.path)).toBe(page);
      expect(getServicePageForPath(`/services/${page.slug}`)).toBe(page);
      expect(getServiceQuoteHref(page.slug)).toBe(
        `/request-a-quote?service=${page.slug}`,
      );
      const html = renderToStaticMarkup(
        <StartProjectLink service={page.slug} />,
      );
      expect(html).toContain(page.cta);
      expect(html).toContain(getServiceQuoteHref(page.slug));
      if (page.slug !== "website-development")
        expect(html).not.toContain("Get a Website Quote");
    });
  }
  it("explicit CTA labels are honored, not silently replaced by website copy", () => {
    expect(
      renderToStaticMarkup(
        <StartProjectLink service="graphic-design" label="Ask about design" />,
      ),
    ).toContain("Ask about design");
  });
  it("canonical sitemap and client analytics omit redirect destinations", () => {
    expect([...getPublicPagePaths()].sort()).toEqual(
      [...publicRoutePaths].sort(),
    );
    for (const page of servicePages.filter(
      (p) => p.slug !== "website-development",
    )) {
      expect(getPublicPagePaths()).toContain(page.path);
      expect(getPublicPagePaths()).not.toContain(`/services/${page.slug}`);
    }
  });
  it("each supporting service has its own full process, preparation, applications and FAQ", () => {
    for (const page of servicePages.filter(
      (p) => p.slug !== "website-development",
    )) {
      const content = serviceMarketing[page.slug];
      expect(content.useCases).toHaveLength(3);
      expect(content.steps).toHaveLength(4);
      expect(content.faqs).toHaveLength(3);
      expect(content.preparation).toHaveLength(4);
      expect(content.distinction.length).toBeGreaterThan(80);
    }
  });
  it("video production explicitly separates paid promotion and media fees", () => {
    expect(serviceMarketing["ai-video-adverts"].distinction).toContain(
      "separate Ads & promotion",
    );
    expect(serviceMarketing["digital-advertising"].distinction).toContain(
      "media spend is separate",
    );
  });
});
