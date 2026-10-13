import { InquiryForm } from "@/components/InquiryForm";
import { PhoneLink, WhatsAppButton } from "@/components/ContactLinks";
import { pageMetadata } from "@/lib/seo";
import { hasSupabaseLeadStoreConfig } from "@/lib/supabase/server";
export const metadata = pageMetadata(
  "Get a website quote",
  "Tell Growthly about your business, website requirements and budget preference. Get a written scope and quote before committing.",
  "/request-a-quote",
);
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const deliveryEnabled =
    hasSupabaseLeadStoreConfig() ||
    Boolean(
      process.env.RESEND_API_KEY &&
        process.env.RESEND_FROM_EMAIL &&
        process.env.LEADS_EMAIL,
    );
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Let’s understand what you need</span>
            <h1>Your next website starts here.</h1>
            <p>
              Tell us about your business. We’ll help you find a practical
              website solution and agree the details before you commit.
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
              follow up. We discuss the website’s purpose, agree a suitable
              scope and confirm the cost and payment milestones.
            </p>
            <div className="concept-note mt-24">
              Please don’t include passwords, financial credentials or sensitive
              personal data. Use a business contact number you are comfortable
              sharing.
            </div>
            <div className="stack-md mt-32">
              <WhatsAppButton label="Ask on WhatsApp" />
              <PhoneLink />
            </div>
          </aside>
          <InquiryForm
            initialPackage={
              typeof query.package === "string" ? query.package : ""
            }
            initialType={typeof query.type === "string" ? query.type : ""}
            deliveryEnabled={deliveryEnabled}
          />
        </div>
      </section>
    </>
  );
}
