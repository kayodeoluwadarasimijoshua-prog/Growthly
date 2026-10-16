import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import {
  createSupabaseLeadWriter,
  hasSupabaseLeadStoreConfig,
} from "@/lib/supabase/server";
import {
  projects as originalProjects,
  type PortfolioProject,
} from "@/config/content";
import { getServicePage } from "@/config/service-pages";
import { defaultCmsDocument } from "./defaults";
import {
  cmsDocumentSchema,
  publicationIssues,
  type CmsDocument,
} from "./schema";

export const cmsEnabled = () => process.env.SITE_CMS_ENABLED === "true";
/** Per-request memoization, never a cross-user mutable/global content cache. */
export const getContentState = cache(
  async (): Promise<{
    document: CmsDocument | null;
    available: boolean;
    enabled: boolean;
  }> => {
    if (!cmsEnabled())
      return {
        document: defaultCmsDocument(),
        available: true,
        enabled: false,
      };
    await connection();
    if (!hasSupabaseLeadStoreConfig())
      return { document: null, available: false, enabled: true };
    try {
      const { data, error } = await createSupabaseLeadWriter()
        .from("growthly_site_content")
        .select("published")
        .eq("id", "main")
        .single();
      const parsed = cmsDocumentSchema.safeParse(data?.published);
      if (
        error ||
        !parsed.success ||
        publicationIssues(parsed.data, null).length
      )
        return { document: null, available: false, enabled: true };
      return { document: parsed.data, available: true, enabled: true };
    } catch {
      return { document: null, available: false, enabled: true };
    }
  },
);
export async function requireContent() {
  const state = await getContentState();
  if (!state.available || !state.document)
    throw new Error("Published website content is temporarily unavailable.");
  return state.document;
}
export async function getSiteSettings() {
  return (await requireContent()).settings;
}
export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  const state = await getContentState();
  if (!state.available || !state.document)
    throw new Error("Project content is temporarily unavailable.");
  if (!state.enabled) return originalProjects;
  return state.document.projects
    .filter((p) => p.published && p.publicationConfirmed)
    .map((p) => ({
      kind: p.kind,
      slug: p.slug,
      name: p.name,
      category: p.category,
      liveUrl: p.liveUrl,
      videoUrl: p.videoUrl,
      service: p.service,
      featured: p.featured,
      previewSummary: p.summary,
      services: [getServicePage(p.service)!.label],
      summary: p.summary,
      overview: p.overview,
      creativeIntent: p.creativeIntent,
      designChoices: p.designChoices,
      scope: p.scope,
      note: p.note,
      ...(p.image?.permissionConfirmed
        ? {
            image: {
              src: `/media/projects/${p.image.assetId}`,
              width: p.image.width,
              height: p.image.height,
              alt: p.image.alt,
              credit: p.image.credit,
              permissionConfirmed: true,
              kind:
                p.service === "website-development"
                  ? ("screenshot" as const)
                  : ("artwork" as const),
            },
          }
        : {}),
    }));
}
export async function getFeaturedProject() {
  const state = await getContentState();
  const projects = await getPublishedProjects();
  return (
    projects.find((p) => p.featured === true) ??
    (state.enabled
      ? undefined
      : projects.find(
          (p) =>
            (p.service ?? "website-development") === "website-development" &&
            p.kind === "client",
        ))
  );
}
