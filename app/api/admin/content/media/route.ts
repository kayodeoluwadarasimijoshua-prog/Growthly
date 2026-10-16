import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { z } from "zod";
import type { NextRequest } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";
import { privateJson } from "@/lib/api-response";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import { checkRateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
const uploadSchema = z
  .object({
    type: z.enum(["image/jpeg", "image/png", "image/webp"]),
    data: z
      .string()
      .max(2_800_000)
      .regex(
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      ),
  })
  .strict();
export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return privateJson({ message: "Request not accepted." }, { status: 403 });
  const auth = await getAdminContext();
  if (!auth.ok)
    return privateJson(
      { message: "Administrator access is required." },
      {
        status:
          auth.reason === "not-configured"
            ? 503
            : auth.reason === "forbidden"
              ? 403
              : 401,
      },
    );
  const limit = checkRateLimit(`content-media:${auth.user.id}`, 10, 60000);
  if (!limit.allowed)
    return privateJson(
      { message: "Please wait before uploading more images." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  let input: unknown;
  try {
    input = await readBoundedJson(request, 2_900_000);
  } catch (e) {
    return privateJson(
      { message: "Upload must be under 2 MB and complete in time." },
      {
        status:
          e instanceof BodyTooLargeError
            ? 413
            : e instanceof BodyReadTimeoutError
              ? 408
              : 400,
      },
    );
  }
  const parsed = uploadSchema.safeParse(input);
  if (!parsed.success)
    return privateJson(
      {
        message:
          "Choose a JPEG, PNG or WebP image under 2 MB. SVG and animated images are not accepted.",
      },
      { status: 400 },
    );
  const buffer = Buffer.from(parsed.data.data, "base64");
  if (buffer.length > 2_000_000 || !buffer.length)
    return privateJson(
      { message: "Choose an image under 2 MB." },
      { status: 413 },
    );
  let image: Buffer, width: number, height: number;
  try {
    const metadata = await sharp(buffer, {
      limitInputPixels: 16_000_000,
    }).metadata();
    const expected = {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "image/webp": "webp",
    }[parsed.data.type];
    if (metadata.format !== expected || (metadata.pages ?? 1) !== 1)
      throw new Error("Invalid raster");
    const converted = await sharp(buffer, { limitInputPixels: 16_000_000 })
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    image = converted.data;
    width = converted.info.width;
    height = converted.info.height;
    if (image.length > 2_000_000) throw new Error("Too large");
  } catch {
    return privateJson(
      {
        message:
          "The image could not be safely processed. Use a non-animated JPEG, PNG or WebP up to 16 megapixels.",
      },
      { status: 400 },
    );
  }
  const id = randomUUID();
  const path = `${id}.webp`;
  const bucket = auth.supabase.storage.from("growthly-project-media");
  try {
    const { error } = await bucket.upload(path, image, {
      contentType: "image/webp",
      upsert: false,
    });
    if (error) throw error;
    const saved = await auth.supabase
      .from("growthly_content_media")
      .insert({
        id,
        storage_path: path,
        width,
        height,
        created_by: auth.user.id,
      });
    if (saved.error) {
      await bucket.remove([path]);
      throw saved.error;
    }
    return privateJson({
      assetId: id,
      width,
      height,
      previewUrl: `/api/admin/content/media/${id}`,
    });
  } catch {
    return privateJson(
      {
        message:
          "The private image could not be saved. Check storage setup; nothing has been published.",
      },
      { status: 503 },
    );
  }
}
