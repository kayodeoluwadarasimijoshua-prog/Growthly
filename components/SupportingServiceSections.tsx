import { sentenceServiceName } from "@/config/service-pages";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { services } from "@/config/content";
import { servicePages } from "@/config/service-pages";
import { serviceMarketing } from "@/config/service-marketing";

/** Full, separate overview sections. Each has one specific destination, not a mixed offer. */
export function SupportingServiceSections() {
  return (
    <div className="supporting-service-sections">
      {servicePages
        .filter((page) => page.slug !== "website-development")
        .map((page) => {
          const service = services.find((item) => item.slug === page.slug)!;
          return (
            <section
              className="supporting-service-section"
              id={`support-${page.slug}`}
              aria-labelledby={`support-title-${page.slug}`}
              key={page.slug}
            >
              <div>
                <span className="eyebrow">{page.label}</span>
                <h3 id={`support-title-${page.slug}`}>
                  {serviceMarketing[page.slug].headline}
                </h3>
                <p>{service.introduction}</p>
                <p className="supporting-service-section__distinction">
                  {serviceMarketing[page.slug].distinction}
                </p>
                <Link className="text-link mt-24" href={page.path}>
                  Explore {sentenceServiceName(page.label)}{" "}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <div className="supporting-service-section__scope">
                <h4>What we can scope</h4>
                <ul className="check-list">
                  {service.deliverables.map((item) => (
                    <li key={item}>
                      <Check size={16} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <details className="service-working-details">
                  <summary>How this service is scoped</summary>
                  <p>{service.workingStyle}</p>
                  <ul>
                    {service.boundaries.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
                <p className="form-fineprint mt-24">
                  Deliverables, costs and review rounds are agreed for this
                  service. Nothing is added to a website package automatically.
                </p>
              </div>
            </section>
          );
        })}
    </div>
  );
}
