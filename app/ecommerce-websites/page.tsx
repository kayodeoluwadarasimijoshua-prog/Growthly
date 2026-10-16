import { seoPages } from "@/config/seo";
import { WebsiteSalesPage } from "@/components/WebsiteSalesPage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  seoPages.ecommerce.title,
  seoPages.ecommerce.description,
  seoPages.ecommerce.path,
);
export default function Page() {
  return <WebsiteSalesPage kind="ecommerce" />;
}
