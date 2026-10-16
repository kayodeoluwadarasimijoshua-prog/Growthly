import type { Metadata } from "next";
import { BreadcrumbTrail } from "@/components/PageIntro";
import { getSiteSettings } from "@/lib/cms/public";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy notice",
  "How GROWTHLY handles project enquiries, optional analytics, direct contact links and administrative lead records.",
  "/privacy-policy",
);

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <BreadcrumbTrail
            items={[{ name: "Privacy notice", path: "/privacy-policy" }]}
          />
        </div>
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Privacy</span>
            <h1>A clear note about the information you share.</h1>
            <p>
              This notice explains how information submitted through this
              website is intended to be used.
            </p>
          </div>
          <div className="page-hero__aside">
            <strong>Last updated</strong>15 October 2026
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container legal-content">
          <aside className="legal-content__aside">
            <strong>Your enquiry, your choice</strong>
            Share only what is needed to discuss your project. You can contact
            GROWTHLY to request correction or removal of your enquiry details.
          </aside>
          <div className="legal-content__body">
            <section>
              <h2>Who is responsible?</h2>
              <p>
                GROWTHLY is responsible for handling enquiries sent through this
                website. Contact the business using WhatsApp at{" "}
                {settings.whatsapp} or phone at {settings.alternativePhone} if
                you have a privacy question.
              </p>
            </section>
            <section>
              <h2>Project images</h2>
              <p>
                Project screenshots, when approved for publication, are served
                from this website rather than loaded from a client’s website.
                Permission-pending screenshots remain unavailable in the normal
                public build. Opening a project’s live-site link takes you to
                that site, where its own privacy terms apply.
              </p>
            </section>
            <section>
              <h2>Movable WhatsApp button</h2>
              <p>
                The floating WhatsApp button saves only its screen position in
                your browser’s local storage so it stays where you move it. This
                preference is not sent to Growthly or analytics and contains no
                enquiry details. Clear the site’s browser storage to remove it,
                or focus the button and press Home to reset its position.
                Opening the link takes you to WhatsApp; a message is not sent
                until you send it there.
              </p>
            </section>
            <section>
              <h2>Information you may provide</h2>
              <p>
                The project form asks for your name, business name, contact
                details, preferred contact method, service, package choice,
                budget range, timing and project description. It also stores
                optional campaign-source values (UTM parameters) only when
                analytics is enabled and you have opted in. In WhatsApp-only
                mode, details stay in your browser until you open the prepared
                WhatsApp link, which shares the message with WhatsApp. You must
                send it there to contact GROWTHLY; preparing it does not submit
                an online enquiry.
              </p>
              <p>
                Please do not submit passwords, financial account credentials,
                special-category data or other sensitive information in a
                project description.
              </p>
            </section>
            <section>
              <h2>How it is used</h2>
              <ul>
                <li>
                  To review your request and respond using the contact method
                  you choose.
                </li>
                <li>
                  To prepare a relevant scope, quote and project follow-up.
                </li>
                <li>
                  To understand which campaign brought an enquiry, using the
                  limited UTM values stored with that enquiry.
                </li>
                <li>
                  For administration of an active lead or project, including
                  status, follow-up date and internal notes visible only to an
                  authorised GROWTHLY administrator.
                </li>
              </ul>
              <p>
                Personal details and free-text project descriptions are not sent
                to Google Analytics or advertising platforms by this website.
              </p>
            </section>
            <section>
              <h2>Where enquiry data goes</h2>
              <p>
                The inquiry endpoint saves a lead to Supabase when that storage
                is configured and can also send an owner notification through
                Resend. If a database save is unavailable but Resend accepts the
                message, the enquiry may be delivered by email only and will not
                appear in the private dashboard; the owner must add it to their
                CRM. In an email-only setup, no Supabase record is created. The
                form confirms receipt only after one of these delivery routes
                succeeds; otherwise it displays an error.
              </p>
              <p>
                When you choose to contact GROWTHLY through WhatsApp, you leave
                this site and WhatsApp’s own privacy terms apply. Your telephone
                provider may process calls made through the phone link.
              </p>
            </section>
            <section>
              <h2>Optional analytics</h2>
              <p>
                Google Analytics 4 loads only after the site owner has reviewed
                and explicitly enabled analytics and you choose “Allow
                analytics” in the optional analytics prompt. You can decline
                without affecting the project form or site content. If enabled,
                the site records page views, service calls to action, WhatsApp
                or phone clicks and successful form submissions. No names,
                contact details, budget details or project descriptions are
                attached to the site’s manually recorded analytics events.
                Google Ads tags and advertising personalization are not enabled
                by this prompt. Provider automatic-measurement settings must be
                reviewed before analytics is enabled.
              </p>
              <p>
                Your analytics choice is stored in this browser’s local storage.
                If browser storage is blocked, the choice lasts for the current
                page session. Use “Privacy preferences” in the footer to change
                or withdraw that choice.
              </p>
            </section>
            <section>
              <h2>Retention and your choices</h2>
              <p>
                Enquiry records are not deleted automatically. Contact GROWTHLY
                using the numbers above to request a review, correction or
                removal of your details. Some information may need to be kept
                for an ongoing project or applicable record-keeping
                requirements. Avoid sending information that is not needed for
                your enquiry.
              </p>
            </section>
            <section>
              <h2>Assistance with enquiries</h2>
              <p>
                If GROWTHLY authorises an assistant to help with your enquiry,
                only information needed for the assigned task should be shared.
                Assistants must follow confidentiality instructions and must not
                use your details for their own marketing, upload them to
                personal AI tools or pass them to unrelated clients. You may ask
                to discuss sensitive matters directly with the business owner.
                This does not mean an assistant has access to all website
                records or accounts.
              </p>
            </section>
            <section>
              <h2>Security</h2>
              <p>
                The website is designed to keep private lead records behind
                authenticated administrator access, with server credentials kept
                out of browser code. An assistant must not be given the owner's
                administrator login just to help with enquiries. Account and
                provider settings require separate access checks; no website can
                guarantee that every device or external service is risk-free.
              </p>
            </section>
            <section>
              <h2>Updates</h2>
              <p>
                This notice may change when our enquiry workflow or providers
                change. The date above identifies this version. Contact GROWTHLY
                if you have a question about how your information is handled.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
