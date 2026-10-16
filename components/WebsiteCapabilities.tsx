import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  websiteCapabilities,
  handoverDecisions,
} from "@/config/website-capabilities";
import { SectionHeading } from "@/components/SectionHeading";

export function WebsiteCapabilities({
  kind = "main",
  preview = false,
}: {
  kind?: "main" | "business" | "ecommerce";
  preview?: boolean;
}) {
  const titles = {
    main: "Understand the features—not just the word ‘website’.",
    business: "Give a potential customer the information they need to decide.",
    ecommerce: "Plan the whole shopping journey, not just the storefront.",
  };
  return (
    <div className="capabilities-content">
      <SectionHeading
        eyebrow="What your website can include"
        title={titles[kind]}
        description="Start with the customer’s task. We then agree the pages, functionality and responsibilities needed to support it. These are possible scope directions, not a promise that every package includes every feature."
      />
      <div className="capability-rows">
        {websiteCapabilities[kind]
          .slice(0, preview ? 4 : undefined)
          .map((item, index) => (
            <article className="capability-row" key={item.title}>
              <div>
                <span className="editorial-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{item.title}</h3>
              </div>
              <div>
                <span className="capability-label">The customer’s task</span>
                <p>{item.customerTask}</p>
              </div>
              <div>
                <span className="capability-label">
                  What we agree in the scope
                </span>
                <p>{item.scope}</p>
              </div>
            </article>
          ))}
      </div>
      {preview && (
        <div className="section-footer">
          <p>
            Editing, ordering, payments and other integrations need a specific
            conversation—not an assumption about a starting price.
          </p>
          <Link
            className="text-link"
            href="/website-development#website-capabilities"
          >
            See the website feature & scope guide{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}

export function HandoverDecisions() {
  return (
    <div className="handover-decisions">
      <SectionHeading
        eyebrow="Think beyond launch day"
        title="A clear handover matters as much as a good first impression."
        description="Before you commit, understand the accounts, access and ongoing responsibilities behind the website. These arrangements are confirmed in your proposal."
      />
      <div className="handover-grid">
        {handoverDecisions.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
