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
    title: { absolute: `${title} | ${business.name}` },
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${title} | ${business.name}`,
      description,
      type: "website",
      url: canonical,
      siteName: business.name,
      images: base
        ? [
            {
              url: `${base}/opengraph-image`,
              width: 1200,
              height: 630,
              alt: "Growthly — professional websites for Nigerian businesses",
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: base ? [`${base}/opengraph-image`] : undefined,
      title: `${title} | ${business.name}`,
      description,
    },
  };
}
