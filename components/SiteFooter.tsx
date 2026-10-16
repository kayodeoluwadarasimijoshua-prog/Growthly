import { getContentState } from "@/lib/cms/public";
import { defaultCmsDocument } from "@/lib/cms/defaults";
import Link from "next/link";
import { servicePages } from "@/config/service-pages";
import { Brand } from "@/components/Brand";
import { business } from "@/config/business";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/site";
import { TrackedAnchor } from "@/components/TrackedLink";
import { AnalyticsPreferencesButton } from "@/components/AnalyticsConsent";

export async function SiteFooter() {
  const state = await getContentState();
  const settings = state.document?.settings ?? defaultCmsDocument().settings;
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand footer />
            <p>
              {settings.tagline} Professional websites and practical digital
              support for Nigerian businesses.
            </p>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h2>Explore</h2>
              <ul>
                <li>
                  <Link href="/website-development">Website development</Link>
                </li>
                <li>
                  <Link href="/portfolio">Our work</Link>
                </li>
                <li>
                  <Link href="/about">About GROWTHLY</Link>
                </li>
                <li>
                  <Link href={business.primaryCTA.href}>
                    {business.primaryCTA.label}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h2>Websites & services</h2>
              <ul>
                <li>
                  <Link href="/services">All services</Link>
                </li>
                <li>
                  <Link href="/business-websites">Business websites</Link>
                </li>
                <li>
                  <Link href="/ecommerce-websites">Online stores</Link>
                </li>
                <li>
                  <Link href="/pricing">Packages & pricing</Link>
                </li>
                <li>
                  <Link href="/industries">Industries</Link>
                </li>
                {servicePages
                  .filter((page) => page.slug !== "website-development")
                  .map((page) => (
                    <li key={page.slug}>
                      <Link href={page.path}>{page.label}</Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="footer-column">
              <h2>Get in touch</h2>
              <ul>
                <li>
                  {state.available && (
                    <TrackedAnchor
                      eventName="whatsapp_click"
                      href={getWhatsAppUrl(
                        "Hello GROWTHLY, I have a question about your services.",
                        settings.whatsapp,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp {settings.whatsapp}
                    </TrackedAnchor>
                  )}
                </li>
                <li>
                  {state.available && (
                    <TrackedAnchor
                      eventName="phone_click"
                      eventParams={{ contact_type: "alternative_phone" }}
                      href={getPhoneHref(settings.alternativePhone)}
                    >
                      Call {settings.alternativePhone}
                    </TrackedAnchor>
                  )}
                </li>
                <li>
                  <Link href="/contact">Contact options</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} GROWTHLY. {settings.tagline}
          </span>
          <div className="footer-bottom__links">
            <Link href="/privacy-policy">Privacy notice</Link>
            <Link href="/terms">Terms of service</Link>
            <AnalyticsPreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
