import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { pageMetadata } from "@/lib/seo";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/site";
import { ClosingCTA } from "@/components/ClosingCTA";
import { TrackedAnchor } from "@/components/TrackedLink";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Contact GROWTHLY by WhatsApp or phone, or send a project enquiry for graphic design, websites, video and marketing support.",
  "/contact",
);

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Contact GROWTHLY</span>
            <h1>Let’s start with a conversation.</h1>
            <p>Tell us what you’re working on or ask a quick question. Choose the contact method that suits you.</p>
          </div>
          <div className="page-hero__aside">
            <strong>Have a detailed brief?</strong>
            The project form helps us understand your service, budget range and timing before we get back to you.
            <Link className="text-link mt-24" href="/start-project">Start a project brief <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container contact-cards">
          <article className="contact-card">
            <span className="contact-card__icon"><MessageCircle size={20} aria-hidden="true" /></span>
            <h2>WhatsApp</h2>
            <p>Send a message to GROWTHLY with a question or project idea.</p>
            <TrackedAnchor className="text-link" eventName="whatsapp_click" href={getWhatsAppUrl("Hello GROWTHLY, I’d like to discuss a project.")} target="_blank" rel="noreferrer">
              Message {business.contact.whatsapp} <ArrowRight size={16} aria-hidden="true" />
            </TrackedAnchor>
          </article>
          <article className="contact-card">
            <span className="contact-card__icon"><Phone size={20} aria-hidden="true" /></span>
            <h2>Phone</h2>
            <p>Prefer a call? Use the alternative contact number.</p>
            <TrackedAnchor className="text-link" eventName="phone_click" eventParams={{ contact_type: "alternative_phone" }} href={getPhoneHref(business.contact.alternativePhone)}>
              Call {business.contact.alternativePhone} <ArrowRight size={16} aria-hidden="true" />
            </TrackedAnchor>
          </article>
        </div>
        <div className="container mt-32">
          <div className="concept-note">
            <MessageCircle size={17} aria-hidden="true" />
            <span>For a project request, the form is the easiest way to share a brief. No public email address was supplied for this launch, so we haven’t invented one.</span>
          </div>
        </div>
      </section>
      <section className="section section--soft section--compact">
        <div className="container"><ClosingCTA title="Ready to turn an idea into a clear brief?" description="Share your service, budget range and preferred timing. We’ll follow up using the contact method you choose." /></div>
      </section>
    </>
  );
}
