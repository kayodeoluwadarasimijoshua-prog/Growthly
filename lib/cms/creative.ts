import { cmsProjectSchema } from "./schema";
import { z } from "zod";
export const creativeProjectSchema = cmsProjectSchema.refine(
  (project) =>
    ["graphic-design", "ai-video-adverts"].includes(project.service) &&
    !project.published &&
    !project.publicationConfirmed &&
    !project.featured,
  "Creative submissions must be private graphic-design or AI-advert drafts.",
);
export const creativeSaveSchema = z
  .object({
    expectedRevision: z.number().int().min(0),
    status: z.enum(["draft", "submitted"]),
    project: creativeProjectSchema,
  })
  .strict();
export function blankCreativeProject(id: string) {
  return {
    id,
    slug: `creative-${id.slice(0, 8)}`,
    name: "",
    category: "",
    service: "ai-video-adverts",
    kind: "client" as const,
    liveUrl: "",
    videoUrl: "",
    summary: "",
    overview: "",
    creativeIntent: "",
    scope: [],
    designChoices: [],
    note: "",
    image: null,
    published: false,
    publicationConfirmed: false,
    featured: false,
  };
}
