import { WebsiteSalesPage } from "@/components/WebsiteSalesPage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Business websites for small and growing companies",
  "Business website design for Nigerian small businesses: clear services, useful contact options and a professional online presence.",
  "/business-websites",
);
export default function Page() {
  return <WebsiteSalesPage kind="business" />;
}
