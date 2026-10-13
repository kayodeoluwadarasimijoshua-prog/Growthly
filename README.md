# GROWTHLY — website-development business website

A website-first sales site for Nigerian businesses, built on the existing **Next.js 16 App Router / React 19 / TypeScript** application. The existing logo, green design tokens, original fictional concept artwork and optional delivery integrations are preserved. Custom CSS remains the design system; a Tailwind rewrite was unnecessary.

## Run and verify

```sh
npm ci
cp .env.example .env.local
npm run dev
# Production build and preview:
npm run lint
npm run typecheck
npm test
npm run build
npm start
# With the production server running, in another shell:
npm run test:browser
node scripts/measure-performance.mjs
```

Node 22 recommended. Server binds to `0.0.0.0:3000` and accepts Arena preview hosts. Browser testing uses npm-packaged Chromium because the sandbox restricts browser-download hosts. Browser binaries and QA outputs are ignored, not committed. On a different operating system, adapt the executable path in `playwright.config.ts` to your installed Chromium.

## Public routes

`/`, `/website-development`, `/business-websites`, `/ecommerce-websites`, `/industries`, `/portfolio`, `/portfolio/[slug]`, `/pricing`, `/about`, `/contact`, `/request-a-quote`, `/privacy-policy`, `/terms` and a genuine 404.

Supporting digital-service pages remain at `/services`. Old `/work`, `/work/[slug]`, `/privacy`, `/start-project` and `/services/website-development` routes redirect to their replacements. `/start-project` preserves query parameters. Portfolio entries are fictional **concept case studies**, not live stores or paid-client histories.

## Structure and content editing

- `app/`: pages, metadata routes and server API; existing admin preserved.
- `components/`: navigation, form, sales sections, cards and reusable layout components.
- `config/business.ts`: business identity, confirmed phone numbers, editable website packages and budget preferences.
- `config/websites.ts`: website solutions, industry use cases, website types and FAQs.
- `config/content.ts`: original concepts and existing supporting services.
- `lib/inquiries.ts`: shared client/server validation; form details never enter analytics events.
- `lib/analytics.ts`, `components/AnalyticsConsent.tsx`: optional consent-gated measurement.
- `lib/supabase/`, `app/api/`: existing secure storage, notification and admin integration.
- `public/images/`: small original SVG concept previews. An invalid XML ampersand in the existing Ayo artwork was repaired.
- `tests/`: validation, delivery-provider mocks, security and Chromium/axe browser checks.
- `docs/`: audit, implementation research, deployment and handover.

## Quote flow — honest by design

**Without provider credentials:** the form validates a name, business, phone, website type, description and privacy consent, then prepares an encoded WhatsApp brief to **+2348129391626** (owner confirmed on 13 October 2026). The visitor must open WhatsApp, review the message and press Send. The site explicitly says **not yet sent** and cannot confirm WhatsApp delivery. It does not save the brief, collect an online lead or fire a successful-submission event in this mode. Phone contact is also available.

**With Supabase and/or Resend configured:** server-side validation, same-origin checks, body limits, honeypot and in-process rate limiting protect the API. Success follows a confirmed database insert or a Resend email receipt ID, not a button click. Database storage and email acceptance were tested with provider mocks; actual inbox/database delivery still requires owner configuration and a live acceptance test. No public enquiry listing exists.

Required phone, business name and consent are also enforced server-side. Optional budget, launch preference, existing URL, industry and features are validated. The brief is capped at 2,400 characters so appended requirements fit the existing 4,000-character database constraint. Requirements and consent are stored within the private brief; no schema migration is needed.

A transient provider failure keeps the form values and offers the prepared WhatsApp brief. In serverless deployment, the in-process rate limiter is **not a global distributed limit**: configure host-level WAF/rate rules before advertising at scale.

## SEO, analytics and launch control

Canonical origin defaults to `https://growthly.com.ng`; override with `NEXT_PUBLIC_SITE_URL`. Generated sitemap, robots, Open Graph image, Organization/WebSite, Service and breadcrumb JSON-LD are included. Metadata is unique across required routes.

**Previews are noindex by default.** Set `SITE_INDEXING_ENABLED=true` **only in Production**, before the production build. Preview environments must retain `false`. If this step is missed, the production site will remain blocked from indexing. Google and Bing verification tokens are optional environment settings; neither account is verified by this implementation.

Optional GA4/Ads settings remain disabled without account IDs and consent. Events include quote CTA, WhatsApp, portfolio/pricing/service visits and confirmed online submissions. Website analytics explicitly strip query strings and fragments from page-location/referrer values. Do not use personal data in campaign codes; UTM values are private enquiry attribution, not analytics event labels. See deployment docs for measuring lead qualification and sales.

## Deployment and documentation

- [Audit and five reference reviews](docs/AUDIT-AND-RESEARCH.md)
- [Deployment, launch checklist, cost and maintenance](docs/DEPLOYMENT.md)
- [Preserved Supabase/Resend integration setup](docs/INTEGRATIONS.md)
- [Handover and measured test results](docs/HANDOVER.md)

No DNS changes, new subscriptions or production promotion are required to inspect the Arena Live Preview. Do not treat a preview, a passing build or provider-mock tests as proof of production deployment or live email delivery.
