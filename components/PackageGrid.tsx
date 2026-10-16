import { getSiteSettings } from "@/lib/cms/public";
import { packagesFor } from "@/lib/cms/format";
import { ArrowRight, Check } from "lucide-react";
import { business, websiteHostingOffer } from "@/config/business";
import { TrackedLink } from "@/components/TrackedLink";

export async function PackageGrid({
  heading = false,
  compact = false,
}: {
  heading?: boolean;
  compact?: boolean;
}) {
  const websitePackages = packagesFor(await getSiteSettings());
  return (
    <>
      {heading ? (
        <div className="package-intro">
          <div className="package-intro__copy">
            <span className="eyebrow">Clear starting points</span>
            <h2>Choose your website package.</h2>
            <p>
              Business websites and online stores. Final scope and cost
              confirmed in writing.
            </p>
          </div>
        </div>
      ) : null}
      <div className={`package-grid${compact ? " package-grid--compact" : ""}`}>
        {websitePackages.map((item) => (
          <article
            className={`package-card${item.id === "business-website" ? " package-card--featured" : ""}`}
            key={item.id}
          >
            <div className="package-card__heading">
              <h3 className="package-card__name">{item.name}</h3>
              {item.id === "business-website" && (
                <span className="package-card__recommendation">
                  Recommended
                </span>
              )}
            </div>
            <p className="package-card__price">
              {item.price} <span className="package-card__currency">NGN</span>
            </p>
            {!compact && (
              <p className="package-card__positioning">{item.positioning}</p>
            )}
            <ul
              className="package-card__includes"
              aria-label={`${item.name} inclusions`}
            >
              {(compact
                ? [
                    ...item.includes.slice(0, 2),
                    websiteHostingOffer.domainLabel,
                    websiteHostingOffer.hostingLabel,
                  ]
                : item.includes
              ).map((feature) => (
                <li key={feature}>
                  <Check size={15} aria-hidden="true" /> <span>{feature}</span>
                </li>
              ))}
            </ul>
            {!compact && (
              <details className="package-scope">
                <summary>Scope, timing & separate costs</summary>
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
              </details>
            )}
            <TrackedLink
              className="button button--primary button--small"
              href={`/request-a-quote?service=website-development&package=${item.id}`}
              eventName="quote_cta_click"
              eventParams={{ service: "website-development", package: item.id }}
            >
              {business.primaryCTA.label}{" "}
              <ArrowRight size={15} aria-hidden="true" />
            </TrackedLink>
          </article>
        ))}
      </div>
      <p className="form-fineprint mt-24">
        Prices are starting design-and-development charges; final scope and fees
        are agreed in writing. Free .com.ng domain and hosting cover year one
        only. Domain and hosting renewals after year one, content, email,
        maintenance and third-party fees are separate unless agreed. No payment
        is taken here.
      </p>
    </>
  );
}
