import { describe, expect, it } from "vitest";
import { cmsDocumentSchema, publicationIssues } from "@/lib/cms/schema";
import { defaultCmsDocument } from "@/lib/cms/defaults";
import { teamRoleTemplates } from "@/config/team";

describe("team content publication boundaries", () => {
  it("accepts older stored documents without inventing published team members", () => {
    const legacy: Record<string, unknown> = { ...defaultCmsDocument() };
    delete legacy.team;
    expect(cmsDocumentSchema.parse(legacy).team).toEqual([]);
  });
  it("publishes only the names and responsibilities supplied by the owner", () => {
    const doc = defaultCmsDocument();
    expect(doc.team.map((member) => member.name)).toEqual([
      "Kayode Oluwadarasimi",
      "Kenny",
      "Sodiq",
      "Omo Wunmi",
    ]);
    expect(
      doc.team.filter((member) => member.role.startsWith("Co-founder")),
    ).toHaveLength(2);
    expect(publicationIssues(doc, null)).toEqual([]);
    expect(doc.team.every((member) => member.image === null)).toBe(true);
    doc.team[0].bio = teamRoleTemplates[0].bio;
    expect(publicationIssues(doc, null).join(" ")).toContain("replace the template guidance");
  });
  it("allows incomplete private drafts but requires accurate approved public profiles", () => {
    const doc = defaultCmsDocument();
    const member = doc.team[0];
    Object.assign(member, {
      name: "",
      role: "",
      bio: "",
      published: false,
      publicationConfirmed: false,
    });
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(true);
    expect(publicationIssues(doc, null)).toEqual([]);
    member.published = true;
    expect(publicationIssues(doc, null).join(" ")).toContain(
      "complete the name",
    );
    expect(publicationIssues(doc, null).join(" ")).toContain(
      "permission to publish this profile",
    );
  });
  it("requires separate photo permission, descriptions and source information", () => {
    const doc = defaultCmsDocument();
    const member = doc.team[0];
    member.image = {
      assetId: "22222222-2222-4222-8222-222222222222",
      width: 200,
      height: 200,
      alt: "",
      credit: "",
      permissionConfirmed: false,
    };
    expect(publicationIssues(doc, null).join(" ")).toContain("photo alt text");
    Object.assign(member.image, {
      alt: "Synthetic portrait of test owner",
      credit: "Synthetic fixture only",
      permissionConfirmed: true,
    });
    expect(publicationIssues(doc, null)).toEqual([]);
  });
  it("rejects duplicate ids, markup, oversized teams and privilege fields", () => {
    const doc = defaultCmsDocument();
    doc.team.push({ ...doc.team[0] });
    expect(cmsDocumentSchema.safeParse(doc).success).toBe(false);
    const bad = defaultCmsDocument();
    bad.team[0].bio = "<script>invalid</script>";
    expect(cmsDocumentSchema.safeParse(bad).success).toBe(false);
    const roles = defaultCmsDocument();
    expect(
      cmsDocumentSchema.safeParse({
        ...roles,
        team: [{ ...roles.team[0], admin: true }],
      }).success,
    ).toBe(false);
    expect(
      cmsDocumentSchema.safeParse({
        ...roles,
        team: Array.from({ length: 13 }, (_, i) => ({
          ...roles.team[0],
          id: `member-${i}`,
        })),
      }).success,
    ).toBe(false);
  });
});
