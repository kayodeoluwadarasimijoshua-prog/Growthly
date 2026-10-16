import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@/config/project-images.json", () => ({
  default: {
    starxco: {
      src: "/review-media/starxco.webp",
      width: 1293,
      height: 679,
      alt: "Test screenshot description",
      credit: "Test screenshot source credit",
      kind: "screenshot",
      permissionConfirmed: false,
    },
  },
}));
const read = vi.hoisted(() => vi.fn());
vi.mock("node:fs/promises", () => ({ readFile: read }));
import { GET } from "@/app/review-media/[filename]/route";
import { isProjectImageReviewEnabled } from "@/lib/project-images";
afterEach(() => {
  vi.unstubAllEnvs();
  read.mockReset();
});
const request = (filename = "starxco.webp") =>
  GET(new Request("https://example.com/review-media/" + filename), {
    params: Promise.resolve({ filename }),
  });
describe("non-public approval-pending screenshot", () => {
  it("is unavailable without review opt-in", async () => {
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "false");
    expect((await request()).status).toBe(404);
    expect(read).not.toHaveBeenCalled();
  });
  it("cannot be enabled on production or indexable sites", async () => {
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "production");
    expect((await request()).status).toBe(404);
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_INDEXING_ENABLED", "true");
    expect((await request()).status).toBe(404);
    expect(read).not.toHaveBeenCalled();
  });
  it("serves review bytes without public caching or indexing", async () => {
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_INDEXING_ENABLED", "false");
    read.mockResolvedValue(Buffer.from("RIFFtestWEBP"));
    const response = await request();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/webp");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(await response.text()).toBe("RIFFtestWEBP");
  });
  it("refuses arbitrary asset filenames before reading files", async () => {
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_INDEXING_ENABLED", "false");
    expect((await request("other.webp")).status).toBe(404);
    expect(read).not.toHaveBeenCalled();
  });
  it("fails safely if the registered file is missing", async () => {
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("SITE_INDEXING_ENABLED", "false");
    read.mockRejectedValue(new Error("missing"));
    expect((await request()).status).toBe(404);
  });
});

it("responsive variants are subject to the same review/production gate", async () => {
  for (const filename of [
    "starxco-480.webp",
    "starxco-768.webp",
    "starxco-1024.webp",
  ]) {
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "false");
    expect((await request(filename)).status).toBe(404);
    vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
    vi.stubEnv("VERCEL_ENV", "production");
    expect((await request(filename)).status).toBe(404);
  }
  expect(read).not.toHaveBeenCalled();
});
it("only fixed private variants can be requested with no-store/noindex protection", async () => {
  vi.stubEnv("PROJECT_IMAGE_REVIEW_MODE", "true");
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("SITE_INDEXING_ENABLED", "false");
  read.mockResolvedValue(Buffer.from("RIFFtestWEBP"));
  for (const filename of [
    "starxco-480.webp",
    "starxco-768.webp",
    "starxco-1024.webp",
  ]) {
    const r = await request(filename);
    expect(r.status).toBe(200);
    expect(r.headers.get("cache-control")).toBe("private, no-store");
    expect(r.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(read.mock.calls.at(-1)?.[0]).toMatch(new RegExp(`${filename}$`));
  }
  const calls = read.mock.calls.length;
  expect((await request("starxco-9999.webp")).status).toBe(404);
  expect(read.mock.calls.length).toBe(calls);
});
it("keeps the excluded placeholder files absent and the screenshot hidden", async () => {
  const fs =
    await vi.importActual<typeof import("node:fs/promises")>(
      "node:fs/promises",
    );
  for (const filename of [
    "starxco.webp",
    "starxco-480.webp",
    "starxco-768.webp",
    "starxco-1024.webp",
  ]) {
    await expect(fs.access(`project-assets/${filename}`)).rejects.toThrow();
  }
  const manifest = JSON.parse(
    await fs.readFile("config/project-images.json", "utf8"),
  );
  expect(manifest.starxco.permissionConfirmed).toBe(false);
  expect(isProjectImageReviewEnabled({})).toBe(false);
});
