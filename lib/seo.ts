import type { Metadata } from "next";
import { business } from "@/config/business";
import { getSiteUrl } from "@/lib/site";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const base = getSiteUrl();
  const canonical = base ? `${base}${path}` : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${title} | ${business.name}`,
      description,
      type: "website",
      url: canonical,
      siteName: business.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${business.name}`,
      description,
    },
  };
}
