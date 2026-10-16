import { getSiteUrl } from "@/lib/site";
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const base = getSiteUrl();
  if (!base) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${base}${item.path}`,
      }),
    ),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
