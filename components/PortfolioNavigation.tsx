import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolioServices, galleryPath } from "@/config/portfolio-services";
export function PortfolioNavigation({ active }: { active?: string }) {
  return <nav className="portfolio-filters" aria-label="Browse projects by service">
    <Link href="/portfolio" aria-current={!active ? "page" : undefined}>All work</Link>
    {portfolioServices.map((service) => <Link key={service.slug} href={galleryPath(service.slug)} aria-current={active === service.slug ? "page" : undefined}>{service.label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}
  </nav>;
}
