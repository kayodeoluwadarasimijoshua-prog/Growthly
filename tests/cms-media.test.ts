import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import sharp from "sharp";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  upload: vi.fn(),
  insert: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({ getAdminContext: mocks.auth }));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: () => ({ allowed: true }),
}));
import { POST } from "@/app/api/admin/content/media/route";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.upload.mockResolvedValue({ error: null });
  mocks.insert.mockResolvedValue({ error: null });
  mocks.remove.mockResolvedValue({ error: null });
  mocks.auth.mockResolvedValue({
    ok: true,
    user: { id: "synthetic-owner" },
    supabase: {
      storage: { from: () => ({ upload: mocks.upload, remove: mocks.remove }) },
      from: () => ({ insert: mocks.insert }),
    },
  });
});
const req = (data: unknown) =>
  new NextRequest("https://growthly.com.ng/api/admin/content/media", {
    method: "POST",
    headers: { origin: "https://growthly.com.ng", host: "growthly.com.ng" },
    body: JSON.stringify(data),
  });
describe("private image upload validation and sanitisation", () => {
  it("refuses non-admin access before processing image bytes", async () => {
    mocks.auth.mockResolvedValue({ ok: false, reason: "forbidden" });
    expect((await POST(req({}))).status).toBe(403);
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("re-encodes valid raster input as metadata-free private WebP", async () => {
    const png = await sharp({
      create: { width: 40, height: 20, channels: 3, background: "#0f9d6b" },
    })
      .withMetadata({
        exif: { IFD0: { Artist: "Synthetic metadata to remove" } },
      })
      .png()
      .toBuffer();
    expect((await sharp(png).metadata()).exif).toBeDefined();
    const r = await POST(
      req({ type: "image/png", data: png.toString("base64") }),
    );
    expect(r.status).toBe(200);
    const result = await r.json();
    expect(result.previewUrl).toMatch(/^\/api\/admin\/content\/media\//);
    expect(result).not.toHaveProperty("permissionConfirmed");
    const [path, bytes] = mocks.upload.mock.calls[0];
    expect(path).toMatch(/^[0-9a-f-]+\.webp$/);
    const metadata = await sharp(bytes).metadata();
    expect(metadata.format).toBe("webp");
    expect(metadata.exif).toBeUndefined();
  });
  it("rejects SVG, spoofed MIME, invalid bytes and oversized input", async () => {
    expect(
      (
        await POST(
          req({
            type: "image/svg+xml",
            data: Buffer.from("<svg/>").toString("base64"),
          }),
        )
      ).status,
    ).toBe(400);
    expect(
      (
        await POST(
          req({
            type: "image/png",
            data: Buffer.from("invalid").toString("base64"),
          }),
        )
      ).status,
    ).toBe(400);
    const png = await sharp({
      create: { width: 10, height: 10, channels: 3, background: "#fff" },
    })
      .png()
      .toBuffer();
    expect(
      (await POST(req({ type: "image/jpeg", data: png.toString("base64") })))
        .status,
    ).toBe(400);
    expect(
      (await POST(req({ type: "image/png", data: "a".repeat(2_950_000) })))
        .status,
    ).toBe(413);
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("attempts removal if metadata registration fails and never publishes the upload", async () => {
    mocks.insert.mockResolvedValue({ error: { message: "synthetic failure" } });
    const png = await sharp({
      create: { width: 10, height: 10, channels: 3, background: "#fff" },
    })
      .png()
      .toBuffer();
    expect(
      (await POST(req({ type: "image/png", data: png.toString("base64") })))
        .status,
    ).toBe(503);
    expect(mocks.remove).toHaveBeenCalledOnce();
  });
});

it("rejects compressed raster dimensions above 16 megapixels without uploading", async () => {
  const png = await sharp({
    create: { width: 5000, height: 4000, channels: 3, background: "#fff" },
  })
    .png()
    .toBuffer();
  expect(png.byteLength).toBeLessThan(2_000_000);
  expect(
    (await POST(req({ type: "image/png", data: png.toString("base64") })))
      .status,
  ).toBe(400);
  expect(mocks.upload).not.toHaveBeenCalled();
});
