import { seoPages } from "@/config/seo";
import { WebsiteSalesPage } from "@/components/WebsiteSalesPage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  seoPages.business.title,
  seoPages.business.description,
  seoPages.business.path,
);
export default function Page() {
  return <WebsiteSalesPage kind="business" />;
}
