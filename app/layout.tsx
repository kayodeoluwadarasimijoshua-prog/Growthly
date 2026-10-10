import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { business } from "@/config/business";
import { getSiteUrl, toInternationalPhoneNumber } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
  title: {
    default: `${business.name} — ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  category: "business",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    siteName: business.name,
    title: `${business.name} — ${business.tagline}`,
    description: business.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.name} — ${business.tagline}`,
    description: business.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfcfa",
  colorScheme: "light",
};

function OrganizationSchema() {
  if (!siteUrl) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    url: siteUrl,
    description: business.description,
    areaServed: { "@type": "Country", name: "Nigeria" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: toInternationalPhoneNumber(business.contact.whatsapp),
      contactType: "sales enquiries",
      areaServed: "NG",
      availableLanguage: "English",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <AnalyticsConsent />
        <OrganizationSchema />
      </body>
    </html>
  );
}
