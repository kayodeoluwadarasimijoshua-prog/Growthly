import { StartProjectLink } from "@/components/ContactLinks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function ClosingCTA({
  service,
  chooseService = false,
  title = "Ready to give your business a stronger online presence?",
  description = "Tell us what your business needs. We’ll review your requirements and discuss a suitable website solution.",
}: {
  service?: string;
  chooseService?: boolean;
  title?: string;
  description?: string;
}) {
  return (
    <div className="closing-cta">
      <div>
        <span className="eyebrow">Let’s build your next step</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="stack-md">
        {chooseService ? (
          <Link className="button button--light" href="/services">
            Find your service <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <StartProjectLink
            service={service}
            className="button button--light"
          />
        )}
      </div>
    </div>
  );
}
