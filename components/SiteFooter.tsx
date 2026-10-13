import Link from "next/link";
import { Brand } from "@/components/Brand";
import { business } from "@/config/business";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/site";
import { TrackedAnchor } from "@/components/TrackedLink";
import { AnalyticsPreferencesButton } from "@/components/AnalyticsConsent";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand footer />
            <p>
              {business.tagline} Professional websites and practical digital
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
                  <Link href="/request-a-quote">Start a project</Link>
                </li>
              </ul>
            </div>
            <div className="footer-column">
              <h2>Services</h2>
              <ul>
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
              </ul>
            </div>
            <div className="footer-column">
              <h2>Get in touch</h2>
              <ul>
                <li>
                  <TrackedAnchor
                    eventName="whatsapp_click"
                    href={getWhatsAppUrl(
                      "Hello GROWTHLY, I have a question about your services.",
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp {business.contact.whatsapp}
                  </TrackedAnchor>
                </li>
                <li>
                  <TrackedAnchor
                    eventName="phone_click"
                    eventParams={{ contact_type: "alternative_phone" }}
                    href={getPhoneHref(business.contact.alternativePhone)}
                  >
                    Call {business.contact.alternativePhone}
                  </TrackedAnchor>
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
            © {new Date().getFullYear()} GROWTHLY. {business.tagline}
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
