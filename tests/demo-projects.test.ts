import { describe, expect, it } from "vitest";
import { autoVaultDraft } from "@/config/demo-projects";
import { defaultCmsDocument } from "@/lib/cms/defaults";
import { cmsDocumentSchema, publicationIssues } from "@/lib/cms/schema";

describe("AutoVault portfolio preparation", () => {
  it("adds a valid private demonstration without replacing approved work", () => {
    const doc = defaultCmsDocument();
    const original = structuredClone(doc.projects);
    doc.projects.push(autoVaultDraft("autovault-draft"));
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(true);
    expect(doc.projects.slice(0, -1)).toEqual(original);
    expect(doc.projects.at(-1)).toMatchObject({
      kind: "demonstration",
      published: false,
      publicationConfirmed: false,
      featured: false,
      image: null,
    });
    expect(publicationIssues(doc, null)).toEqual([]);
    doc.projects.at(-1)!.published = true;
    expect(publicationIssues(doc, null).join(" ")).toContain(
      "confirm permission",
    );
    doc.projects.at(-1)!.publicationConfirmed = true;
    expect(publicationIssues(doc, null)).toEqual([]);
  });
});
