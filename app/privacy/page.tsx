import type { Metadata } from "next";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy notice",
  "How GROWTHLY handles project enquiries, optional analytics, direct contact links and administrative lead records.",
  "/privacy",
);

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Privacy</span>
            <h1>A clear note about the information you share.</h1>
            <p>This notice explains how information submitted through this website is intended to be used.</p>
          </div>
          <div className="page-hero__aside"><strong>Last updated</strong>10 October 2026</div>
        </div>
      </section>
      <section className="section">
        <div className="container legal-content">
          <aside className="legal-content__aside">
            <strong>Before launch</strong>
            The site owner should confirm the final retention period and hosting/provider details before publishing this notice. This page is operational guidance, not legal advice.
          </aside>
          <div className="legal-content__body">
            <section>
              <h2>Who is responsible?</h2>
              <p>GROWTHLY is responsible for handling enquiries sent through this website. Contact the business using WhatsApp at {business.contact.whatsapp} or phone at {business.contact.alternativePhone} if you have a privacy question.</p>
            </section>
            <section>
              <h2>Information you may provide</h2>
              <p>The project form asks for your name, business name, contact details, preferred contact method, service, package choice, budget range, timing and project description. It also stores optional campaign-source values (UTM parameters) when present in the page URL.</p>
              <p>Please do not submit passwords, financial account credentials, special-category data or other sensitive information in a project description.</p>
            </section>
            <section>
              <h2>How it is used</h2>
              <ul>
                <li>To review your request and respond using the contact method you choose.</li>
                <li>To prepare a relevant scope, quote and project follow-up.</li>
                <li>To understand which campaign brought an enquiry, using the limited UTM values stored with that enquiry.</li>
                <li>For administration of an active lead or project, including status, follow-up date and internal notes visible only to an authorised GROWTHLY administrator.</li>
              </ul>
              <p>Personal details and free-text project descriptions are not sent to Google Analytics or advertising platforms by this website.</p>
            </section>
            <section>
              <h2>Where enquiry data goes</h2>
              <p>The inquiry endpoint saves a lead to Supabase when that storage is configured and can also send an owner notification through Resend. If a database save is unavailable but Resend accepts the message, the enquiry may be delivered by email only and will not appear in the private dashboard; the owner must add it to their CRM. In an email-only setup, no Supabase record is created. The form confirms receipt only after one of these delivery routes succeeds; otherwise it displays an error.</p>
              <p>When you choose to contact GROWTHLY through WhatsApp, you leave this site and WhatsApp’s own privacy terms apply. Your telephone provider may process calls made through the phone link.</p>
            </section>
            <section>
              <h2>Optional analytics</h2>
              <p>Google Analytics 4 or Google Ads tags load only when the site owner has configured an integration and you choose “Allow analytics” in the optional analytics prompt. You can decline without affecting the project form or site content. If enabled, the site records page views, service calls to action, WhatsApp or phone clicks and successful form submissions. No names, contact details, budget details or project descriptions are attached to those analytics events.</p>
              <p>Your analytics choice is stored in this browser’s local storage. Use “Privacy preferences” in the footer to change or withdraw that choice.</p>
            </section>
            <section>
              <h2>Retention and your choices</h2>
              <p>The website does not currently apply an automatic deletion schedule to lead records. The business owner must set and follow a retention period, remove records that are no longer needed and keep database backups secure. You may ask GROWTHLY to correct or remove enquiry details by contacting the numbers above, subject to applicable record-keeping requirements.</p>
            </section>
            <section>
              <h2>Security</h2>
              <p>Administrative lead access is designed to require authenticated Supabase users with an administrator role, with database row-level security enabled. Server credentials must remain in the hosting platform’s environment settings and must never be placed in browser code. The site owner is responsible for account access, backups, provider configuration and responding to security incidents.</p>
            </section>
            <section>
              <h2>Updates</h2>
              <p>This notice may change when the website’s data providers or business processes change. Review it before launch and whenever a service integration is added or replaced.</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
