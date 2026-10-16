import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFile, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import {
  readProjectImage,
  isProjectImageReviewEnabled,
} from "@/lib/project-images";
import { ProjectPreview } from "@/components/ProjectPreview";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/config/content";

const image = {
  src: "/images/projects/starxco.webp",
  width: 1200,
  height: 700,
  alt: "Synthetic test photo description",
  credit: "Synthetic test credit only",
  kind: "homepage-photo" as const,
  permissionConfirmed: true as const,
};
describe("approved local project assets", () => {
  it("accepts a complete local image with truthful kind metadata", () => {
    expect(readProjectImage(image, "starxco")).toEqual(image);
    expect(
      readProjectImage({ ...image, kind: "screenshot" }, "starxco")?.kind,
    ).toBe("screenshot");
  });
  it("keeps client-pending assets out of the normal manifest view", () => {
    const pending = {
      ...image,
      src: "/review-media/starxco.webp",
      permissionConfirmed: false,
    };
    expect(readProjectImage(pending, "starxco")).toBeUndefined();
    expect(readProjectImage(pending, "starxco", true)).toEqual(pending);
  });
  it("allows review only with explicit opt-in outside production/indexable builds", () => {
    expect(isProjectImageReviewEnabled({})).toBe(false);
    expect(
      isProjectImageReviewEnabled({ PROJECT_IMAGE_REVIEW_MODE: "true" }),
    ).toBe(true);
    expect(
      isProjectImageReviewEnabled({
        PROJECT_IMAGE_REVIEW_MODE: "true",
        VERCEL_ENV: "production",
      }),
    ).toBe(false);
    expect(
      isProjectImageReviewEnabled({
        PROJECT_IMAGE_REVIEW_MODE: "true",
        SITE_INDEXING_ENABLED: "true",
      }),
    ).toBe(false);
  });
  it("omits absent/incomplete registrations", () => {
    for (const value of [undefined, null, {}, { src: image.src }])
      expect(readProjectImage(value, "starxco")).toBeUndefined();
  });
  it("never admits remote, traversal, query-string or wrong-project sources", () => {
    for (const src of [
      "https://starxco.com.ng/assets/img/hero.jpg",
      "//example.com/test.webp",
      "/images/projects/../test.webp",
      image.src + "?url=https://example.com",
      "/images/projects/other.webp",
    ])
      expect(readProjectImage({ ...image, src }, "starxco")).toBeUndefined();
    expect(readProjectImage(image, "../starxco")).toBeUndefined();
  });
  it("requires permission, usable dimensions, alt text and source credit", () => {
    for (const patch of [
      { permissionConfirmed: false },
      { width: 0 },
      { height: 2000 },
      { alt: "" },
      { credit: "" },
      { kind: "generated-mockup" },
    ])
      expect(
        readProjectImage({ ...image, ...patch }, "starxco"),
      ).toBeUndefined();
  });
  it("renders no fake image or failure panel when no asset was supplied", () => {
    const project = { ...projects[0], image: undefined };
    expect(
      renderToStaticMarkup(createElement(ProjectPreview, { project })),
    ).toBe("");
    const html = renderToStaticMarkup(createElement(ProjectCard, { project }));
    expect(html).not.toContain("<img");
    expect(html).not.toContain("unavailable");
    expect(html).not.toContain("Image source");
    expect(html).toContain("View project details");
    expect(html).toContain("https://starxco.com.ng/");
  });
  it("uses responsive Next image optimisation for a registered local asset", () => {
    const html = renderToStaticMarkup(
      createElement(ProjectPreview, { project: { ...projects[0], image } }),
    );
    expect(html).toContain(
      "/_next/image?url=%2Fimages%2Fprojects%2Fstarxco.webp",
    );
    expect(html).toContain('width="1200"');
    expect(html).toContain('height="700"');
    expect(html).toContain('alt="Synthetic test photo description"');
    expect(html).toContain("srcSet=");
    expect(html).not.toContain("https://starxco.com.ng/assets");
  });
});

describe("local image preparation CLI (synthetic fixture, no production image registered)", () => {
  let dir: string;
  let source: string;
  const run = (args: string[]) =>
    spawnSync(
      process.execPath,
      ["scripts/prepare-starxco-image.mjs", ...args],
      { encoding: "utf8" },
    );
  const options = [
    "--kind",
    "homepage-photo",
    "--alt",
    "Synthetic fixture for image tooling tests",
    "--credit",
    "Synthetic fixture only, not a real project asset",
  ];
  beforeAll(async () => {
    await mkdir("artifacts", { recursive: true });
    dir = await mkdtemp(path.resolve("artifacts/project-image-test-"));
    source = path.join(dir, "synthetic.png");
    await sharp({
      create: { width: 1600, height: 900, channels: 3, background: "#DDF5E9" },
    })
      .png()
      .toFile(source);
  });
  afterAll(async () => {
    if (dir) await rm(dir, { recursive: true });
  });
  it("requires owner permission before processing", () => {
    const result = run([source, ...options, "--check-only"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("confirm permission");
  });
  it("requires accurate asset kind, alt and source credit", () => {
    expect(run([source, "--permission-confirmed", "--check-only"]).status).toBe(
      1,
    );
    expect(
      run([
        source,
        ...options,
        "--kind",
        "fake-screenshot",
        "--permission-confirmed",
        "--check-only",
      ]).status,
    ).toBe(1);
  });
  it("optimises a wide raster to WebP without upscaling or modifying registration in check-only mode", async () => {
    const before = await readFile("config/project-images.json", "utf8");
    const result = run([
      source,
      ...options,
      "--permission-confirmed",
      "--check-only",
    ]);
    expect(result.status, result.stderr).toBe(0);
    const output = JSON.parse(result.stdout);
    expect(output).toMatchObject({
      checkOnly: true,
      width: 1440,
      height: 810,
      src: image.src,
      kind: "homepage-photo",
    });
    expect(output.bytes).toBeGreaterThan(0);
    expect(output.bytes).toBeLessThanOrEqual(400_000);
    expect(await readFile("config/project-images.json", "utf8")).toBe(before);
  });
  it("records pending client approval honestly and uses non-public storage routing", () => {
    const result = run([
      source,
      ...options,
      "--approval-pending",
      "--check-only",
    ]);
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toMatchObject({
      permissionConfirmed: false,
      src: "/review-media/starxco.webp",
    });
  });
  it("rejects SVG/animated or misleading image formats", async () => {
    const source = path.join(dir, "test.svg");
    await writeFile(
      source,
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700"></svg>',
    );
    const result = run([
      source,
      ...options,
      "--permission-confirmed",
      "--check-only",
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("still PNG");
  });
  it("rejects images too small for a readable front preview", async () => {
    const source = path.join(dir, "small.png");
    await sharp({
      create: { width: 320, height: 180, channels: 3, background: "white" },
    })
      .png()
      .toFile(source);
    const result = run([
      source,
      ...options,
      "--permission-confirmed",
      "--check-only",
    ]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("at least 640×360");
  });
});
