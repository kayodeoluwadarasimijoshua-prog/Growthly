import type { Metadata } from "next";
import { Clock3, FileText, ShieldCheck } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { WhatsAppButton, PhoneLink } from "@/components/ContactLinks";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Start a project",
  "Tell GROWTHLY about your business, service needs, budget and preferred timing. Send a project enquiry for a clear, no-obligation next step.",
  "/start-project",
);

export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[]; package?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialService = Array.isArray(params.service) ? params.service[0] : params.service;
  const initialPackage = Array.isArray(params.package) ? params.package[0] : params.package;

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Start a project</span>
            <h1>Tell us where you want to go.</h1>
            <p>A few useful details help GROWTHLY understand the business, the request and what should happen next.</p>
          </div>
          <div className="page-hero__aside">
            <strong>No payment or commitment here.</strong>
            This is a project enquiry, not a checkout. If the work is a fit, you’ll receive a written scope and quote before deciding.
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container form-layout">
          <aside className="form-layout__aside">
            <span className="eyebrow">What happens next</span>
            <h2>Clear questions. Clear next steps.</h2>
            <p>Share the detail you already have. It’s okay if the brief is still taking shape—we can start with the main challenge.</p>
            <div className="concept-note"><FileText size={18} aria-hidden="true" /><span>We’ll review your enquiry and respond using your preferred contact method. Timing, scope and costs are confirmed in writing before work begins.</span></div>
            <div className="stack-md" style={{ marginTop: 22 }}>
              <div><Clock3 size={17} aria-hidden="true" style={{ display: "inline", marginRight: 8, verticalAlign: "-3px", color: "var(--green-dark)" }} /><span style={{ fontSize: 13 }}>A specific delivery date is confirmed after scope review.</span></div>
              <div><ShieldCheck size={17} aria-hidden="true" style={{ display: "inline", marginRight: 8, verticalAlign: "-3px", color: "var(--green-dark)" }} /><span style={{ fontSize: 13 }}>Please don’t send passwords or sensitive personal data.</span></div>
            </div>
            <div className="stack-md" style={{ marginTop: 27 }}>
              <WhatsAppButton label="Ask on WhatsApp" message="Hello GROWTHLY, I’d like to talk about a project." />
              <PhoneLink />
            </div>
          </aside>
          <InquiryForm initialService={initialService} initialPackage={initialPackage} />
        </div>
      </section>
    </>
  );
}
