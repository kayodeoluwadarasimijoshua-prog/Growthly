import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicePages } from "@/config/service-pages";

const summaries: Record<string, string> = {
  "website-development":
    "Business websites, online stores and clearer enquiry journeys.",
  "graphic-design": "Promotional graphics, flyers and campaign artwork.",
  "ai-video-adverts": "Focused video creative for a product, service or offer.",
  "social-media-management":
    "Content planning, creative and agreed account support.",
  "digital-advertising":
    "Campaign planning and setup; media spend scoped separately.",
  "ai-integration-automation":
    "Workflow discovery and appropriately scoped automation.",
};

/** A clear early choice, without changing the website-first hero or mixing service scopes. */
export function ServiceGateway() {
  return (
    <section
      className="service-gateway section--soft"
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
            Website development is our main focus. You can also commission the
            other services independently—choose the offer that matches your
            goal.
          </p>
        </div>
        <div className="service-gateway__grid">
          {servicePages.map((page) => (
            <Link
              className={`service-gateway__card${page.slug === "website-development" ? " service-gateway__card--primary" : ""}`}
              href={page.path}
              key={page.slug}
            >
              <div className="service-gateway__card-top">
                {page.slug === "website-development" ? (
                  <span className="service-gateway__focus">Our main focus</span>
                ) : (
                  <span className="service-gateway__focus">
                    Standalone service
                  </span>
                )}
                <ArrowUpRight size={18} aria-hidden="true" />
              </div>
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
