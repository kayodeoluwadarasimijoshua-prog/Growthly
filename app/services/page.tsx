import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/config/content";
import { SectionHeading } from "@/components/SectionHeading";
import { ClosingCTA } from "@/components/ClosingCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Services",
  "Explore GROWTHLY’s graphic design, website development, AI-assisted video, social media, automation and digital advertising support.",
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero page-hero--green">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">What we do</span>
            <h1>Practical digital support, shaped around your business.</h1>
            <p>Start with the challenge you have. We’ll agree the right scope, what it takes and what can wait.</p>
          </div>
          <div className="page-hero__aside">
            <strong>No one-size-fits-all bundle.</strong>
            Every project begins with a short brief. The proposal confirms deliverables, timing, revision rounds and any third-party costs before work starts.
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Explore our services"
            title="Choose the support that moves you forward."
            description="Each service page explains who it is for, what a project can include and what is scoped separately."
          />
          <div className="service-catalogue">
            {services.map((service, index) => (
              <article className="service-catalogue__item" key={service.slug}>
                <span className="service-catalogue__number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{service.title}</h2>
                  <p>{service.summary}</p>
                </div>
                <span aria-hidden="true" />
                <Link className="text-link" href={`/services/${service.slug}`}>
                  Service details <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft section--compact">
        <div className="container"><ClosingCTA title="Not sure which service fits?" description="Tell us what feels stuck. We’ll review the brief and help you identify a sensible next step." /></div>
      </section>
    </>
  );
}
