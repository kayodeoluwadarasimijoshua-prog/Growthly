import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicePages } from "@/config/service-pages";
import { serviceLandingTitles } from "@/config/service-marketing";
import { services } from "@/config/content";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";
import { pageMetadata } from "@/lib/seo";

const landingPages = servicePages.filter(
  (page) => page.slug !== "website-development",
);
export function generateStaticParams() {
  return landingPages.map((page) => ({ servicePage: page.path.slice(1) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicePage: string }>;
}): Promise<Metadata> {
  const { servicePage } = await params;
  const page = landingPages.find((item) => item.path === `/${servicePage}`);
  if (!page) return {};
  const service = services.find((item) => item.slug === page.slug)!;
  return pageMetadata(
    serviceLandingTitles[page.slug],
    service.summary,
    page.path,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ servicePage: string }>;
}) {
  const { servicePage } = await params;
  const page = landingPages.find((item) => item.path === `/${servicePage}`);
  if (!page) notFound();
  return <ServiceLandingPage slug={page.slug} />;
}
