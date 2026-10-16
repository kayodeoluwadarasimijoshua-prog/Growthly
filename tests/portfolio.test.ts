import { describe, expect, it } from "vitest";
import { isProjectImageReviewEnabled } from "@/lib/project-images";
import { projects } from "@/config/content";
import sitemap from "@/app/sitemap";
describe("owner-approved public work", () => {
  it("publishes exactly one StarXCO project", () => {
    expect(projects.map((p) => p.slug)).toEqual(["starxco"]);
    expect(projects[0].liveUrl).toBe("https://starxco.com.ng/");
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
  it("removes Daily Life Review and all demo routes from the sitemap", async () => {
    const paths = (await sitemap()).map((p) => p.url);
    for (const slug of [
      "daily-life-review",
      "kora-botanics",
      "abeni-stay",
      "ayo-studio",
    ])
      expect(paths.some((path) => path.includes(slug))).toBe(false);
  });
  it("includes only the approved project case study", async () => {
    expect(
      (await sitemap())
        .filter((p) => p.url.includes("/portfolio/"))
        .map((p) => p.url),
    ).toEqual(["https://growthly.com.ng/portfolio/starxco"]);
  });
});
