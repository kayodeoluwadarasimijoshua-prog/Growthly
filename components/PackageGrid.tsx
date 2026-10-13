import { ArrowRight, Check } from "lucide-react";
import { websitePackages } from "@/config/business";
import { TrackedLink } from "@/components/TrackedLink";

export function PackageGrid({ heading = false }: { heading?: boolean }) {
  return (
    <>
      {heading ? (
        <div className="package-intro">
          <div className="package-intro__copy">
            <span className="eyebrow">Clear starting points</span>
            <h2>A starting point. Not a one-size-fits-all price.</h2>
            <p>
              Choose a direction and we’ll confirm the page list, features and
              cost in a written proposal. Custom requirements are welcome.
            </p>
          </div>
        </div>
      ) : null}
      <div className="package-grid">
        {websitePackages.map((item, index) => (
          <article
            className={`package-card${index === 1 ? " package-card--featured" : ""}`}
            key={item.id}
          >
            <span className="package-card__name">{item.name}</span>
            <p className="package-card__price">{item.price}</p>
            <p className="package-card__positioning">{item.positioning}</p>
            <ul
              className="package-card__includes"
              aria-label={`${item.name} inclusions`}
            >
              {item.includes.map((feature) => (
                <li key={feature}>
                  <Check size={15} aria-hidden="true" /> <span>{feature}</span>
                </li>
              ))}
            </ul>
            <dl className="package-card__details">
              <div>
                <dt>Availability</dt>
                <dd>{item.availability}</dd>
              </div>
              <div>
                <dt>Delivery timing</dt>
                <dd>{item.timeframe}</dd>
              </div>
              <div>
                <dt>Revisions</dt>
                <dd>{item.revisions}</dd>
              </div>
              <div>
                <dt>Separate costs</dt>
                <dd>{item.separateFees}</dd>
              </div>
              <div>
                <dt>Next step</dt>
                <dd>{item.nextStep}</dd>
              </div>
            </dl>
            <p className="package-exclusions">
              <strong>Not included:</strong> {item.excludes.join(" ")}
            </p>
            <TrackedLink
              className="button button--outline button--small"
              href={`/request-a-quote?service=website-development&package=${item.id}`}
              eventName="quote_cta_click"
              eventParams={{ service: "website-development", package: item.id }}
            >
              Get a Website Quote <ArrowRight size={15} aria-hidden="true" />
            </TrackedLink>
          </article>
        ))}
      </div>
      <p className="form-fineprint mt-24">
        Package scope and availability are confirmed in a written proposal. No
        payment is taken on this website; domain, hosting and third-party fees
        are separate unless specifically included in writing.
      </p>
    </>
  );
}
