import { z } from "zod";
import reviewWidths from "@/config/review-image-widths.json";
export const REVIEW_IMAGE_WIDTHS: readonly number[] = reviewWidths;

const imageSchema = z
  .object({
    src: z.string(),
    width: z.number().int().min(320).max(1440),
    height: z.number().int().min(180).max(1600),
    alt: z.string().trim().min(5).max(300),
    credit: z.string().trim().min(5).max(300),
    kind: z.enum(["screenshot", "homepage-photo"]),
    permissionConfirmed: z.boolean(),
  })
  .strict();
export type ProjectImage = z.infer<typeof imageSchema>;

/** Missing/unapproved/remote assets deliberately produce the text-only project.
 * Importing the manifest never triggers a remote fetch. */
export function readProjectImage(
  value: unknown,
  slug: string,
  allowPendingReview = false,
): ProjectImage | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  const result = imageSchema.safeParse(value);
  if (!result.success) return undefined;
  const expected = result.data.permissionConfirmed
    ? `/images/projects/${slug}.webp`
    : `/review-media/${slug}.webp`;
  if (
    result.data.src !== expected ||
    (!result.data.permissionConfirmed && !allowPendingReview)
  )
    return undefined;
  return result.data;
}

/** Explicit local/review opt-in only; never in production or indexable builds. */
export function isProjectImageReviewEnabled(
  env: Record<string, string | undefined> = process.env,
) {
  return (
    env.PROJECT_IMAGE_REVIEW_MODE === "true" &&
    env.VERCEL_ENV !== "production" &&
    env.SITE_INDEXING_ENABLED !== "true"
  );
}
