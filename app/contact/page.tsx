import { getSiteSettings } from "@/lib/cms/public";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import Link from "next/link";
import { ArrowRight, MessageCircle, Phone, ClipboardList } from "lucide-react";
import { seoPages } from "@/config/seo";
import {
  getRouteService,
  getServiceQuoteHref,
  sentenceServiceName,
  serviceContactMessage,
} from "@/config/service-pages";
import { pageMetadata } from "@/lib/seo";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/site";
import { PageIntro } from "@/components/PageIntro";
import { TrackedAnchor } from "@/components/TrackedLink";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata = pageMetadata(
  seoPages.contact.title,
  seoPages.contact.description,
  "/contact",
);
type ContactQuery = Promise<Record<string, string | string[] | undefined>>;
export const dynamic = "force-dynamic";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: ContactQuery;
}) {
  const settings = await getSiteSettings();
  const query = await searchParams;
  const service = getRouteService("/contact", query.service);
  const subject = service ? sentenceServiceName(service.label) : "your project";
  const whatsapp = getWhatsAppUrl(
    serviceContactMessage(service),
    settings.whatsapp,
  );
  const briefHref = service
    ? getServiceQuoteHref(service.slug)
    : "/services#choose-your-service";
  const briefLabel = service?.cta ?? "Choose your service";
  return (
    <div className="professional-sales-page contact-sales-page">
      <FloatingWhatsApp contextualService={service} pageScoped />
      <PageIntro
        label="Contact Growthly"
        path="/contact"
        eyebrow="A conversation is a good starting point"
        title={
          service
            ? `Let’s discuss ${subject}.`
            : "Let’s talk about your next project."
        }
        description={settings.contactIntro.replaceAll("{{service}}", subject)}
      >
        <div className="contact-hero__actions" id="contact-options">
          <TrackedAnchor
            className="button button--primary"
            eventName="whatsapp_click"
            eventParams={{
              placement: "contact_hero",
              ...(service ? { service: service.slug } : {}),
            }}
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={17} aria-hidden="true" />
            WhatsApp Growthly
            <span className="sr-only"> (opens in a new tab)</span>
          </TrackedAnchor>
          <TrackedAnchor
            className="button button--light"
            eventName="phone_click"
            eventParams={{ contact_type: "alternative_phone" }}
            href={getPhoneHref(settings.alternativePhone)}
          >
            <Phone size={17} aria-hidden="true" />
            Call Growthly
          </TrackedAnchor>
        </div>
        <Link className="text-link contact-hero__brief" href={briefHref}>
          {briefLabel}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <p className="contact-hero__note">
          Opening WhatsApp prepares a conversation. You still need to press Send
          there.
        </p>
      </PageIntro>
      {query.service !== undefined && !service && (
        <div className="container">
          <p className="delivery-note mt-24" role="status">
            That service link was not recognised. You can contact us about any
            service, or choose one below. No enquiry has been sent.
          </p>
        </div>
      )}
      <nav className="journey-nav" aria-label="Contact page sections">
        <div className="container">
          <span>Contact options</span>
          <a href="#contact-details">Numbers & brief</a>
          <a href="#first-message">What to share</a>
          <a href="#after-contact">What happens next</a>
          <a href="#contact-questions">Questions</a>
        </div>
      </nav>
      <section className="section" id="contact-details">
        <div className="container">
          <SectionHeading
            eyebrow="Choose the route that suits you"
            title="Direct contact. Clear next steps."
            description="A short question is enough to begin. Use a structured brief when you are ready to share more."
          />
          <div className="contact-cards contact-cards--three">
            <article className="contact-card">
              <span className="contact-card__icon">
                <MessageCircle size={22} aria-hidden="true" />
              </span>
              <h3>Message on WhatsApp</h3>
              <p>
                Discuss {subject}. Share your business goal and the help you
                need.
              </p>
              <TrackedAnchor
                className="text-link"
                eventName="whatsapp_click"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Message {settings.whatsapp}
                <ArrowRight size={16} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </TrackedAnchor>
            </article>
            <article className="contact-card">
              <span className="contact-card__icon">
                <Phone size={22} aria-hidden="true" />
              </span>
              <h3>Prefer a call?</h3>
              <p>
                Use our alternative number for a direct conversation about your
                requirements.
              </p>
              <TrackedAnchor
                className="text-link"
                eventName="phone_click"
                eventParams={{ contact_type: "alternative_phone" }}
                href={getPhoneHref(settings.alternativePhone)}
              >
                Call {settings.alternativePhone}
                <ArrowRight size={16} aria-hidden="true" />
              </TrackedAnchor>
            </article>
            <article className="contact-card">
              <span className="contact-card__icon">
                <ClipboardList size={22} aria-hidden="true" />
              </span>
              <h3>Prepare a project brief</h3>
              <p>
                {service
                  ? `Keep your enquiry focused on ${subject}.`
                  : "Choose the relevant service so your brief asks the right questions."}{" "}
                Budget and timing are preferences, not commitments.
              </p>
              <Link className="text-link" href={briefHref}>
                {briefLabel}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>
      <section className="section section--soft" id="first-message">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">Make the first message useful</span>
            <h2>You do not need a finished specification.</h2>
            <p className="mt-24">
              Tell us what your business does, who you want to reach and what
              you need help with. A public reference, the required formats or
              features, and your preferred timing can help us review the scope.
            </p>
            <p className="mt-24">
              Share only what is needed for the enquiry. Do not send passwords,
              OTPs, financial credentials or private customer lists.{" "}
              <Link className="text-link" href="/privacy-policy">
                Read our privacy notice.
              </Link>
            </p>
          </div>
          <div className="message-example">
            <span className="capability-label">
              A starting message you can adapt
            </span>
            <blockquote>
              Hello Growthly. I run [what your business does]. I’d like help
              with {service ? subject : "[the service you need]"} for [your
              audience or goal]. My priority is [what you want to achieve].
              Could we discuss a suitable scope and quote?
            </blockquote>
            <p>
              Replace the prompts with your details. Only send links and
              examples you are entitled to share.
            </p>
            <Link className="text-link mt-24" href={briefHref}>
              {service
                ? "Use the structured project brief"
                : "Choose the right brief"}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section" id="after-contact">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">After your first message</span>
            <h2>Understand the need. Then agree the scope.</h2>
            <p className="mt-24">
              No payment is collected on this website. A requested deadline or
              initial enquiry is not a confirmed booking.
            </p>
          </div>
          <ol className="conversation-steps">
            <li>
              <h3>Discuss your business and goals</h3>
              <p>
                Explain the audience, intended use and outcome you want to work
                towards.
              </p>
            </li>
            <li>
              <h3>Clarify the deliverables</h3>
              <p>
                We identify the content, formats, features and responsibilities
                relevant to the selected service.
              </p>
            </li>
            <li>
              <h3>Confirm a written proposal</h3>
              <p>
                Scope, cost, timing, review rounds and payment milestones are
                agreed before work begins.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section className="section section--soft" id="contact-questions">
        <div className="container faq-layout">
          <SectionHeading
            eyebrow="Before your first message"
            title="Start with what you know."
            description="You can ask a question before preparing a full brief."
          />
          <div className="faq-list">
            {[
              [
                "Do I need a full specification?",
                "No. Explain your business and the help you need. We can discuss a suitable direction and turn it into a written scope.",
              ],
              [
                "Can I ask about a service other than websites?",
                "Yes. Graphic design, AI video adverts, social media, ads and promotion, and scoped automation can be commissioned independently. Choose your service to keep the enquiry focused.",
              ],
              [
                "What should I avoid sharing?",
                "Do not send passwords, verification codes, payment credentials or sensitive personal information. Approved business information and your preferred contact details are enough to begin.",
              ],
            ].map(([question, answer]) => (
              <details className="faq-item" key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <div className="closing-cta">
            <div>
              <span className="eyebrow">Let’s plan the next step</span>
              <h2>A useful conversation starts with your goal.</h2>
              <p>
                Choose the service you need and share a short brief. We agree
                the scope before you commit.
              </p>
            </div>
            <Link className="button button--light" href={briefHref}>
              {briefLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
