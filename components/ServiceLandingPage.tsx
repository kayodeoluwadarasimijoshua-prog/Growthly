import { getSiteSettings, getPublishedProjects } from "@/lib/cms/public";
import { expandPriceTokens } from "@/lib/cms/format";
import { ProjectCard } from "@/components/ProjectCard";
import { sentenceServiceName } from "@/config/service-pages";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/config/content";
import { serviceMarketing } from "@/config/service-marketing";
import { getServicePage, getServicePath } from "@/config/service-pages";
import { BreadcrumbTrail } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { StartProjectLink, WhatsAppButton } from "@/components/ContactLinks";
import { ClosingCTA } from "@/components/ClosingCTA";
import { getSiteUrl } from "@/lib/site";

export async function ServiceLandingPage({ slug }: { slug: string }) {
  const settings = await getSiteSettings();
  const relatedProjects = (await getPublishedProjects()).filter(
    (p) => p.service === slug,
  );
  const service = services.find((item) => item.slug === slug)!;
  const page = getServicePage(slug)!;
  const marketing = serviceMarketing[slug];
  const base = getSiteUrl();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.summary,
    url: `${base}${page.path}`,
    provider: {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: "GROWTHLY",
      url: base,
    },
    areaServed: { "@type": "Country", name: "Nigeria" },
  };
  return (
    <div
      className="professional-sales-page service-landing"
      data-service={slug}
    >
      {base && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <section className="page-hero page-hero--green">
        <div className="container">
          <BreadcrumbTrail
            items={[
              { name: "Services", path: "/services" },
              { name: page.label, path: page.path },
            ]}
          />
        </div>
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">{page.label} · Growthly</span>
            <h1>{marketing.headline}</h1>
            <p>{service.introduction}</p>
            <div className="hero-actions">
              <StartProjectLink service={slug} />
              <Link className="text-link" href="#service-deliverables">
                See the {sentenceServiceName(page.label)} scope{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <aside className="page-hero__aside">
            <strong>A good fit for</strong>
            {service.bestFor}
          </aside>
        </div>
      </section>
      <nav className="journey-nav" aria-label={`${page.label} page sections`}>
        <div className="container">
          <span>This service</span>
          {[
            ["Applications", "service-applications"],
            ["Deliverables", "service-deliverables"],
            ["Process", "service-process"],
            ["Your brief", "service-brief"],
            ["Questions", "service-questions"],
          ].map(([label, id]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </div>
      </nav>
      {relatedProjects.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Published work"
              title={`${page.label}: work you can explore`}
              description="Client work and demonstrations are labelled separately."
            />
            <div className="project-grid">
              {relatedProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  headingLevel={3}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section section--compact service-distinction">
        <div className="container">
          <div className="service-distinction__box">
            <h2>What this service covers—and what it doesn’t.</h2>
            <p>{marketing.distinction}</p>
            {slug === "ai-video-adverts" && (
              <Link
                className="text-link mt-24"
                href={getServicePath("digital-advertising")}
              >
                Looking for campaign setup? Explore Ads & promotion{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
            {slug === "digital-advertising" && (
              <Link
                className="text-link mt-24"
                href={getServicePath("ai-video-adverts")}
              >
                Need video creative? Explore AI video adverts{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="section" id="service-applications">
        <div className="container">
          <SectionHeading
            eyebrow="Start with the purpose"
            title={`Where ${sentenceServiceName(page.label)} can support your business.`}
            description="These are suitable applications to discuss—not client case studies or guaranteed outcomes. We choose the work around your actual requirements."
          />
          <div className="outcome-grid">
            {marketing.useCases.map((item, index) => (
              <article className="outcome-card" key={item.title}>
                <span className="editorial-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft" id="service-deliverables">
        <div className="container service-detail-grid">
          <div>
            <span className="eyebrow">The work, agreed in writing</span>
            <h2>What a project can include</h2>
            <ul className="check-list">
              {service.deliverables.map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h2>How we work</h2>
            <p>{service.workingStyle}</p>
            <div className="mt-32">
              <StartProjectLink service={slug} />
            </div>
          </div>
          <aside className="service-aside">
            <h3>Scope and exclusions</h3>
            <p>
              The proposal confirms deliverables, price, review rounds,
              permissions and separate costs. No payment is taken on this
              website.
            </p>
            <ul>
              {service.boundaries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
      <section className="section section--mint" id="service-process">
        <div className="container">
          <SectionHeading
            eyebrow="A process for this service"
            title={`From ${sentenceServiceName(page.label)} brief to agreed delivery.`}
            description="We review your requirements before confirming cost and timing. Scope and content readiness determine the plan—not a promised universal turnaround."
          />
          <div className="process-grid service-landing-process">
            {marketing.steps.map((step, index) => (
              <article className="process-step" key={step.name}>
                <span className="process-step__number">0{index + 1}</span>
                <h3>{step.name}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="service-brief">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">Make the first conversation useful</span>
            <h2>Bring the goal. We’ll help define the work.</h2>
            <p className="mt-24">
              You do not need a technical specification. A focused brief helps
              us discuss the right deliverables without mixing this service with
              work you have not asked for.
            </p>
          </div>
          <div>
            <ul className="proposal-checklist">
              {marketing.preparation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="form-fineprint mt-24">
              Share public business information and approved examples, not
              passwords, financial credentials or sensitive personal data.
            </p>
            <div className="hero-actions">
              <WhatsAppButton
                message={`Hello GROWTHLY, I’d like to discuss ${sentenceServiceName(page.label)} for my business.`}
                label={`Ask about ${sentenceServiceName(page.label)}`}
              />
            </div>
            <p className="form-fineprint mt-24">
              Opening WhatsApp prepares a conversation; you must send the
              message there. No enquiry is confirmed by a link click.
            </p>
          </div>
        </div>
      </section>
      <section className="section section--soft" id="service-questions">
        <div className="container faq-layout">
          <SectionHeading
            eyebrow="Before you commission the work"
            title={`${page.label}: the important questions.`}
            description="Understand what is included, what stays separate and how we agree your project."
          />
          <div className="faq-list">
            {settings.serviceFaqs[slug].map(({ question, answer }) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{expandPriceTokens(answer, settings)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            service={slug}
            title={`Let’s discuss your ${sentenceServiceName(page.label)} project.`}
            description="Share your offer and the outcome you want to support. We’ll review the requirements and agree a service-specific scope and quote."
          />
        </div>
      </section>
    </div>
  );
}
