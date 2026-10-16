/** A launch approval flag is not enough for a private review or preview build. */
export function isPublicIndexingEnabled(
  env: Record<string, string | undefined> = process.env,
) {
  return (
    env.SITE_INDEXING_ENABLED === "true" &&
    env.VERCEL_ENV !== "preview" &&
    env.VERCEL_ENV !== "development" &&
    env.NODE_ENV !== "development" &&
    env.PROJECT_IMAGE_REVIEW_MODE !== "true"
  );
}
