import { describe, expect, it } from "vitest";
import { isProjectImageReviewEnabled } from "@/lib/project-images";
import { projects } from "@/config/content";
import sitemap from "@/app/sitemap";
describe("owner-approved public work", () => {
  it("publishes StarXCO client work and the approved AutoVault demo separately", () => {
    expect(projects.map((p) => p.slug)).toEqual([
      "starxco",
      "autovault-motors",
    ]);
    expect(projects[0].liveUrl).toBe("https://starxco.com.ng/");
    expect(projects[0].kind).toBe("client");
    expect(projects[1].kind).toBe("demonstration");
    expect(projects[1].featured).toBe(false);
  });
  it("does not enable an unapproved external image or pretend it is a screenshot", () => {
    if (projects[0].image) {
      expect(projects[0].image.src).toBe(
        projects[0].image.permissionConfirmed
          ? "/images/projects/starxco.webp"
          : "/review-media/starxco.webp",
      );
      if (!projects[0].image.permissionConfirmed)
        expect(isProjectImageReviewEnabled()).toBe(true);
    } else expect(projects[0].image).toBeUndefined();
  });
  it("keeps retired and unapproved work out of the sitemap", async () => {
    const paths = (await sitemap()).map((p) => p.url);
    for (const slug of [
      "daily-life-review",
      "kora-botanics",
      "abeni-stay",
      "ayo-studio",
    ])
      expect(paths.some((path) => path.includes(slug))).toBe(false);
  });
  it("includes both approved project case studies", async () => {
    expect(
      (await sitemap())
        .filter((p) => p.url.includes("/portfolio/") && !p.url.includes("/portfolio/services/"))
        .map((p) => p.url),
    ).toEqual([
      "https://growthly.com.ng/portfolio/starxco",
      "https://growthly.com.ng/portfolio/autovault-motors",
    ]);
  });
});
