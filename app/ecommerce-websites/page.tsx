import { WebsiteSalesPage } from "@/components/WebsiteSalesPage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "E-commerce website development in Nigeria",
  "Plan a practical online store with product listings, ordering and payment integration. Explore scope, separate costs and request a quote.",
  "/ecommerce-websites",
);
export default function Page() {
  return <WebsiteSalesPage kind="ecommerce" />;
}
