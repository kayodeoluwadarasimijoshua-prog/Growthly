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
            <p>{business.tagline} Practical design, websites and marketing support for growing businesses.</p>
          </div>
          <div className="footer-columns">
            <div className="footer-column">
              <h2>Explore</h2>
              <ul>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/work">Our work</Link></li>
                <li><Link href="/about">About GROWTHLY</Link></li>
                <li><Link href="/start-project">Start a project</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h2>Services</h2>
              <ul>
                <li><Link href="/services/graphic-design">Graphic design</Link></li>
                <li><Link href="/services/website-development">Websites</Link></li>
                <li><Link href="/services/ai-video-adverts">AI video adverts</Link></li>
                <li><Link href="/services/social-media-management">Social media</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h2>Get in touch</h2>
              <ul>
                <li>
                  <TrackedAnchor eventName="whatsapp_click" href={getWhatsAppUrl("Hello GROWTHLY, I have a question about your services.")} target="_blank" rel="noreferrer">
                    WhatsApp {business.contact.whatsapp}
                  </TrackedAnchor>
                </li>
                <li><TrackedAnchor eventName="phone_click" eventParams={{ contact_type: "alternative_phone" }} href={getPhoneHref(business.contact.alternativePhone)}>Call {business.contact.alternativePhone}</TrackedAnchor></li>
                <li><Link href="/contact">Contact options</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GROWTHLY. {business.tagline}</span>
          <div className="footer-bottom__links">
            <Link href="/privacy">Privacy notice</Link>
            <Link href="/contact">Contact</Link>
            <AnalyticsPreferencesButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
