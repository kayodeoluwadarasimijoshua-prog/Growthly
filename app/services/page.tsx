import { getSiteSettings } from "@/lib/cms/public";
import { packagesFor } from "@/lib/cms/format";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ServiceGateway } from "@/components/ServiceGateway";
import { SupportingServiceSections } from "@/components/SupportingServiceSections";
import { servicePages } from "@/config/service-pages";
import { seoPages } from "@/config/seo";
import { pageMetadata } from "@/lib/seo";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { Solutions } from "@/components/WebsiteSections";
import { ProjectPreparation } from "@/components/CustomerJourney";
export const metadata = pageMetadata(
  seoPages.services.title,
  seoPages.services.description,
  "/services",
);
export default async function ServicesPage() {
  const packages = packagesFor(await getSiteSettings());
  return (
    <div className="professional-sales-page">
      <PageIntro
        label="Services"
        path="/services"
        eyebrow="Website development comes first"
        title="Website development is our focus. It’s not our only service."
        description="Choose the service your business needs: website development, graphic design, AI video adverts, social media, ads and promotion, or scoped automation. Each has its own page, brief and written scope."
        aside={
          <>
            <strong>Start with the business goal.</strong>We recommend useful
            services for your needs—not a bundle of tools you have not asked
            for. Every additional service has a separately agreed scope.
          </>
        }
      />
      <ServiceGateway />
      <nav className="journey-nav" aria-label="Choose a Growthly service">
        <div className="container">
          <span>Find your service</span>
          {servicePages.map((page) => (
            <a
              href={
                page.slug === "website-development"
                  ? "#website-development"
                  : `#support-${page.slug}`
              }
              key={page.slug}
            >
              {page.label}
            </a>
          ))}
        </div>
      </nav>
      <section className="section" id="website-development">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">Our primary service</span>
            <h2>
              Website development that makes your business easier to understand.
            </h2>
            <p className="mt-24">
              From a first multi-page business website to an online store, we
              organise the offer and make important actions easy to find.
            </p>
            <Link
              className="button button--primary mt-24"
              href="/website-development"
            >
              Explore website development{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="service-focus-panel">
            <h3>A useful foundation</h3>
            <ul className="check-list">
              {[
                "Business, service and product information",
                "Responsive pages for mobile and desktop",
                "Clear contact and enquiry routes",
                "Search-friendly page structure and metadata",
                "Testing, review and agreed handover",
              ].map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="form-fineprint mt-24">
              Exact pages, features, integrations and ongoing costs are
              confirmed in your proposal. Search visibility and sales are not
              guaranteed.
            </p>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Choose the direction"
            title="What does your website need to do?"
            description="Introduce your business, explain services, display products or support ordering. Start with the purpose; we help shape the right scope."
          />
          <Solutions />
          <div className="section-footer">
            <p>
              Starting packages:{" "}
              {packages
                .map((p) => `${p.name}: ${p.price.toLowerCase()}`)
                .join("; ")}
              .
            </p>
            <Link className="text-link" href="/pricing">
              Compare website packages{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Separately scoped supporting services"
            title="Complement the website when it makes sense."
            description="Keep your business presentation consistent across the touchpoints you choose. These services are not included automatically in a website package."
          />
          <SupportingServiceSections />
        </div>
      </section>
      <section className="section section--mint">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">
              Useful scope, not unnecessary complexity
            </span>
            <h2>Agree the work and the costs before adding anything.</h2>
          </div>
          <div className="prose">
            <p>
              Advertising spend, subscriptions, licences, provider charges,
              content production and ongoing management are separate unless your
              proposal explicitly includes them.
            </p>
            <p>
              We discuss any required accounts, permissions and third-party
              services before activation. We do not promise traffic, rankings,
              sales or approval from an advertising platform.
            </p>
            <Link className="text-link mt-24" href="/pricing">
              Understand package inclusions & separate costs{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProjectPreparation />
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            title="Let’s choose the right next step for your business."
            description="Share your goals and requirements. We’ll discuss the website first, then any supporting work that has a clear purpose."
          />
        </div>
      </section>
    </div>
  );
}
