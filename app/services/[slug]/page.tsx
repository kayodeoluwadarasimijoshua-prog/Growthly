import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/config/content";
import { PackageGrid } from "@/components/PackageGrid";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ClosingCTA } from "@/components/ClosingCTA";
import { StartProjectLink } from "@/components/ContactLinks";
import { pageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return pageMetadata(service.title, service.summary, `/services/${service.slug}`);
}

function ServiceSchema({ name, description }: { name: string; description: string }) {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: "GROWTHLY", url: siteUrl },
    areaServed: { "@type": "Country", name: "Nigeria" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <ServiceSchema name={service.title} description={service.summary} />
      <section className="page-hero page-hero--green">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">{service.eyebrow}</span>
            <h1>{service.title}</h1>
            <p>{service.introduction}</p>
            <div className="hero-actions">
              <StartProjectLink label="Discuss this service" service={service.slug} />
              <Link className="button button--outline" href="/services">All services <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <div className="page-hero__aside">
            <strong>A good fit for</strong>
            {service.bestFor}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container service-detail-grid">
          <div>
            <h2>What a project can include</h2>
            <ul className="check-list">
              {service.deliverables.map((item) => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}
            </ul>
            <h2>How we work</h2>
            <p>{service.workingStyle}</p>
            <div className="mt-32"><StartProjectLink label="Start a project brief" service={service.slug} /></div>
          </div>
          <aside className="service-aside">
            <h3>Scope and exclusions</h3>
            <p>Before any work starts, your written proposal will clarify what’s in and what needs a separate quote.</p>
            <ul>{service.boundaries.map((item) => <li key={item}>{item}</li>)}</ul>
          </aside>
        </div>
      </section>

      {service.slug === "website-development" ? (
        <section className="section section--soft" id="portfolio-packages">
          <div className="container"><PackageGrid heading /></div>
        </section>
      ) : null}

      <section className="section section--mint">
        <div className="container">
          <span className="eyebrow">A considered process</span>
          <h2 className="mt-24">The steps stay clear.</h2>
          <ProcessSteps />
        </div>
      </section>

      <section className="section section--compact">
        <div className="container"><ClosingCTA title={`Have a ${service.shortTitle.toLowerCase()} project in mind?`} description="Share the goal, not just a list of deliverables. We’ll review what you need and outline a practical next step." /></div>
      </section>
    </>
  );
}
