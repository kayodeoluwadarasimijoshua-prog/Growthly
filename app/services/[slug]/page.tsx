import { notFound, permanentRedirect } from "next/navigation";
import { services } from "@/config/content";
import { getServicePath } from "@/config/service-pages";

/** Keep existing links working, with one canonical page for each advertised service. */
export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}
export default async function LegacyServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!services.some((service) => service.slug === slug)) notFound();
  permanentRedirect(getServicePath(slug));
}
