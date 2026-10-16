import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import images from "@/config/project-images.json";
import {
  REVIEW_IMAGE_WIDTHS,
  readProjectImage,
  isProjectImageReviewEnabled,
} from "@/lib/project-images";

export const runtime = "nodejs";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const image = readProjectImage(
    (images as Record<string, unknown>).starxco,
    "starxco",
    isProjectImageReviewEnabled(),
  );
  if (!image || image.permissionConfirmed)
    return new NextResponse(null, { status: 404, headers });
  const allowed =
    filename === "starxco.webp" ||
    REVIEW_IMAGE_WIDTHS.some(
      (width) => width < image.width && filename === `starxco-${width}.webp`,
    );
  if (!allowed) return new NextResponse(null, { status: 404, headers });
  try {
    const bytes = await readFile(
      path.join(process.cwd(), `project-assets/${filename}`),
    );
    return new NextResponse(bytes, {
      headers: { ...headers, "Content-Type": "image/webp" },
    });
  } catch {
    return new NextResponse(null, { status: 404, headers });
  }
}
