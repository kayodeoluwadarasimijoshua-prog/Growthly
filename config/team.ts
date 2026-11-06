import type { CmsTeamMember } from "@/lib/cms/schema";

/** Names and responsibilities supplied by the owner; no invented biographies. */
export const initialTeam: CmsTeamMember[] = [
  {
    id: "kayode-oluwadarasimi",
    name: "Kayode Oluwadarasimi",
    role: "Co-founder · Website Development",
    bio: "Kayode is a Growthly co-founder and works on website development.",
    image: null,
    published: true,
    publicationConfirmed: true,
  },
  {
    id: "kenny",
    name: "Kenny",
    role: "Co-founder · AI Video Adverts",
    bio: "Kenny is a Growthly co-founder and works on AI-assisted video adverts.",
    image: null,
    published: true,
    publicationConfirmed: true,
  },
  {
    id: "sodiq",
    name: "Sodiq",
    role: "AI Video Adverts & Graphic Design",
    bio: "Sodiq works on AI-assisted video adverts and graphic design.",
    image: null,
    published: true,
    publicationConfirmed: true,
  },
  {
    id: "omo-wunmi",
    name: "Omo Wunmi",
    role: "Administrative Support",
    bio: "Omo Wunmi supports Growthly with administrative tasks.",
    image: null,
    published: true,
    publicationConfirmed: true,
  },
];

export const teamRoleTemplates = [
  {
    role: "Website Development",
    bio: "Works on website development. Add the person's actual responsibilities before publishing.",
  },
  {
    role: "AI Video Adverts",
    bio: "Works on AI-assisted video adverts. Add the person's actual responsibilities before publishing.",
  },
  {
    role: "Graphic Design",
    bio: "Works on graphic design. Add the person's actual responsibilities before publishing.",
  },
  {
    role: "Administrative Support",
    bio: "Supports the team with administrative tasks. Add the person's actual responsibilities before publishing.",
  },
] as const;
