import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import {
  getServicePage,
  getServiceContactHref,
  sentenceServiceName,
} from "@/config/service-pages";
import Link from "next/link";
import { BreadcrumbTrail } from "@/components/PageIntro";
import { resolveInquiryService } from "@/lib/inquiry-context";
import { InquiryForm } from "@/components/InquiryForm";

import { pageMetadata } from "@/lib/seo";
import { hasSupabaseLeadStoreConfig } from "@/lib/supabase/server";
type QuoteQuery = Promise<Record<string, string | string[] | undefined>>;
export async function generateMetadata({
  searchParams,
}: {
  searchParams: QuoteQuery;
}) {
  const service = resolveInquiryService((await searchParams).service);
  const isWebsite = service.slug === "website-development";
  return pageMetadata(
    isWebsite
      ? "Get a website quote"
      : `Discuss ${sentenceServiceName(service.shortTitle)} with Growthly`,
    isWebsite
      ? "Tell Growthly about your business, website requirements and budget preference. Get a written scope and quote before committing."
      : `Discuss ${sentenceServiceName(service.shortTitle)} with Growthly. Share your requirements and agree a written scope and quote before committing.`,
    "/request-a-quote",
  );
}
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: QuoteQuery;
}) {
  const query = await searchParams;
  const service = resolveInquiryService(query.service);
  const isWebsite = service.slug === "website-development";
  const invalidService =
    query.service !== undefined && query.service !== service.slug;
  const deliveryEnabled =
    process.env.ONLINE_INQUIRIES_ENABLED === "true" &&
    (hasSupabaseLeadStoreConfig() ||
      Boolean(
        process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL &&
        process.env.LEADS_EMAIL,
      ));
  return (
    <div className="short-sales-page">
      <FloatingWhatsApp
        contextualService={getServicePage(service.slug)}
        pageScoped
      />
      <section className="page-hero">
        <div className="container">
          <BreadcrumbTrail
            items={[{ name: "Request a quote", path: "/request-a-quote" }]}
          />
        </div>
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Let’s understand what you need</span>
            <h1>
              {isWebsite
                ? "Your next website starts here."
                : `Let’s discuss your ${sentenceServiceName(service.shortTitle)} project.`}
            </h1>
            <p>
              {isWebsite
                ? "Tell us about your business. We’ll help you find a practical website solution and agree the details before you commit."
                : `Share what you need from ${sentenceServiceName(service.shortTitle)}. We’ll review your goals and agree a written scope before you commit.`}
            </p>
          </div>
          <div className="page-hero__aside">
            <strong>A conversation, not a checkout.</strong>No payment is
            collected here. Final scope, pricing, revisions and delivery timing
            are agreed in your written proposal.
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container form-layout">
          <aside className="form-layout__aside">
            <span className="eyebrow">What happens next</span>
            <h2>A brief. A conversation. A clear proposal.</h2>
            <p>
              Once your brief is delivered, we review your requirements and
              follow up. We discuss{" "}
              {isWebsite ? "the website’s purpose" : "your project goals"},
              agree a suitable scope and confirm the cost and payment
              milestones.
            </p>
            <div className="concept-note mt-24">
              Please don’t include passwords, financial credentials or sensitive
              personal data. Use a business contact number you are comfortable
              sharing.
            </div>
          </aside>
          <div className="quote-form-column">
            <p className="quote-contact-options" id="quote-contact-options">
              Questions before your brief?{" "}
              <Link
                className="text-link"
                href={getServiceContactHref(service.slug)}
              >
                Contact us about {sentenceServiceName(service.shortTitle)}
                <span className="sr-only"> before preparing your brief</span>
              </Link>
            </p>
            {invalidService && (
              <div
                className="delivery-note quote-fallback-status"
                role="status"
              >
                That service link was not recognized. This form is for website
                development. Use the{" "}
                <Link className="text-link" href="/services">
                  Services page
                </Link>{" "}
                to choose another service.
              </div>
            )}
            {query.form === "fallback" && (
              <div
                className="delivery-note quote-fallback-status"
                role="status"
              >
                <strong>Your request was not sent.</strong>
                <p>
                  The native form submission was not processed. Use the form
                  once it is ready, or contact us directly on WhatsApp or phone.
                </p>
              </div>
            )}
            <InquiryForm
              key={service.slug}
              initialService={service.slug}
              initialPackage={
                typeof query.package === "string" ? query.package : ""
              }
              initialType={typeof query.type === "string" ? query.type : ""}
              deliveryEnabled={deliveryEnabled}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
