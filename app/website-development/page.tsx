import { WebsiteSalesPage } from "@/components/WebsiteSalesPage";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Website development in Nigeria",
  "Professional, mobile-first website development for Nigerian businesses. Explore website types, deliverables, process and quotation options.",
  "/website-development",
);
export default function Page() {
  return <WebsiteSalesPage kind="main" />;
}
