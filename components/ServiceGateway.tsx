import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Code2, Palette, Clapperboard } from "lucide-react";
import { servicePages } from "@/config/service-pages";

const summaries: Record<string, string> = {
  "website-development":
    "Business websites, online stores and clearer enquiry journeys.",
  "graphic-design": "Promotional graphics, flyers and campaign artwork.",
  "ai-video-adverts": "Focused video creative for a product, service or offer.",
  "social-media-management":
    "Content planning, creative and agreed account support.",
  "digital-advertising":
    "Facebook and Instagram ad planning, setup and creative; media spend is separate.",
  "ai-integration-automation":
    "Workflow discovery and appropriately scoped automation.",
};

/** A clear early choice, without changing the website-first hero or mixing service scopes. */
export function ServiceGateway({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`service-gateway section--soft${compact ? " service-gateway--compact" : ""}`}
      id="choose-your-service"
      aria-labelledby="service-gateway-title"
    >
      <div className="container">
        <div className="service-gateway__intro">
          <div>
            <span className="eyebrow">Find the right Growthly service</span>
            <h2 id="service-gateway-title">
              What does your business need next?
            </h2>
          </div>
          <p>
            Websites, graphic design and AI adverts are our core services.
            Choose one or combine them around a clear brief. Facebook and
            Instagram advertising can be scoped separately.
          </p>
        </div>
        <div className="service-gateway__grid">
          {servicePages.map((page) => (
            <Link
              className={`service-gateway__card${["website-development", "graphic-design", "ai-video-adverts"].includes(page.slug) ? " service-gateway__card--primary" : ""}`}
              href={page.path}
              key={page.slug}
            >
              <div className="service-gateway__card-top">
                {[
                  "website-development",
                  "graphic-design",
                  "ai-video-adverts",
                ].includes(page.slug) ? (
                  <span className="service-gateway__focus">Core service</span>
                ) : (
                  <span className="service-gateway__focus">
                    Standalone service
                  </span>
                )}
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
              {page.slug === "website-development" ? (
                <Code2
                  className="studio-service-icon"
                  size={26}
                  aria-hidden="true"
                />
              ) : page.slug === "graphic-design" ? (
                <Palette
                  className="studio-service-icon"
                  size={26}
                  aria-hidden="true"
                />
              ) : page.slug === "ai-video-adverts" ? (
                <Clapperboard
                  className="studio-service-icon"
                  size={26}
                  aria-hidden="true"
                />
              ) : null}
              <h3>{page.label}</h3>
              <p>{summaries[page.slug]}</p>
              <span className="service-gateway__destination">
                View this service{" "}
                <span className="sr-only">— {page.label}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
