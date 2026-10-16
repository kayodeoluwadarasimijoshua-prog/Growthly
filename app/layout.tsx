import { PublicSiteSettings } from "@/components/PublicSiteSettings";
import { getContentState } from "@/lib/cms/public";
import { defaultCmsDocument } from "@/lib/cms/defaults";
import type { Metadata, Viewport } from "next";
import { isPublicIndexingEnabled } from "@/lib/indexing";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
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
    ? {
        google: process.env.GOOGLE_SITE_VERIFICATION,
        other: process.env.BING_SITE_VERIFICATION
          ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
          : undefined,
      }
    : process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
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
  robots: {
    index: isPublicIndexingEnabled(),
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfcfa",
  colorScheme: "light",
};

function OrganizationSchema({ phone }: { phone?: string }) {
  if (!siteUrl) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: business.name,
    url: siteUrl,
    logo: `${siteUrl}/brand/growthly-mark-dark.svg`,
    description: business.description,
    areaServed: { "@type": "Country", name: "Nigeria" },
    contactPoint: phone
      ? {
          "@type": "ContactPoint",
          telephone: toInternationalPhoneNumber(phone),
          contactType: "sales enquiries",
          areaServed: "NG",
          availableLanguage: "English",
        }
      : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            schema,
            {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              publisher: { "@id": `${siteUrl}/#organization` },
              name: business.name,
              url: siteUrl,
              description: business.description,
            },
          ],
        }).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const state = await getContentState();
  const settings = state.document?.settings ?? defaultCmsDocument().settings;
  const publicSettings = {
    whatsapp: settings.whatsapp,
    alternativePhone: settings.alternativePhone,
    tagline: settings.tagline,
    prices: settings.prices,
  };
  return (
    <html lang="en">
      <body>
        <PublicSiteSettings
          settings={publicSettings}
          available={state.available}
          projectServices={Object.fromEntries(
            (state.document?.projects ?? [])
              .filter((p) => p.published && p.publicationConfirmed)
              .map((p) => [`/portfolio/${p.slug}`, p.service]),
          )}
        >
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <FloatingWhatsApp />
          <AnalyticsConsent />
          <OrganizationSchema
            phone={state.available ? settings.whatsapp : undefined}
          />
        </PublicSiteSettings>
      </body>
    </html>
  );
}
