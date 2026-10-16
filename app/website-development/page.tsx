import { seoPages } from "@/config/seo";
import { WebsiteSalesPage } from "@/components/WebsiteSalesPage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  seoPages.development.title,
  seoPages.development.description,
  seoPages.development.path,
);
export default function Page() {
  return <WebsiteSalesPage kind="main" />;
}
