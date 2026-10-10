# GROWTHLY business website

A responsive, conversion-focused website and lead-management starter for GROWTHLY, a Nigerian digital-services business. Built with Next.js App Router, TypeScript and a server-side inquiry API.

## What is included

- Home, service directory, six detailed service pages, portfolio, three individual concept case studies, About, Start a Project, Contact, Privacy and a custom 404 page.
- Original locally hosted vector mockups for three **self-initiated fictional concepts**. The site does not present invented client histories, testimonials or results as real work.
- Service-specific project brief form with server-side validation, same-origin checks, a honeypot, request-size limits, in-process rate limiting and UTM-only campaign attribution.
- Inquiry delivery to Supabase (private lead store) and/or Resend (email delivery). The site reports success only after a database insert succeeds or Resend accepts the email. Without a configured delivery option, the form returns an error and offers direct contact instead.
- Optional Supabase-authenticated admin dashboard with server-side identity checks, database row-level security, lead status, assignment, internal notes, follow-up date, quote/deposit tracking, filtering and CSV export.
- Three configurable portfolio-website packages for **graphic designers only**. Their price, availability wording, features, exclusions, delivery timing, revision allowance, separate costs and next step live in one file: `config/business.ts`. Other services are custom-quoted.
- Page metadata, canonical URLs when a production URL is configured, generated Open Graph artwork, Organization/Service structured data, `robots.txt`, `sitemap.xml`, descriptive image text and no-index rules for admin routes.
- Consent-gated GA4 and Google Ads tags. Form data is not attached to analytics events; UTM values are retained in first-party session storage and attached only to the project enquiry.
- Keyboard focus states, skip link, responsive mobile navigation/layout, semantic form labels, reduced-motion support and optimized local SVGs.

## Stack and requirements

- Node.js 22 LTS (Node 20.9+ is required by Next.js 16; use the hosting platform’s supported current LTS).
- npm 10+.
- Next.js 16, React 19, TypeScript, Zod, Supabase JS/SSR and Lucide icons.
- No external font, stock-image, analytics or form-service request is made by default.

## Run locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. With no delivery environment variables, the public pages work, but a valid project submission deliberately returns **503** rather than showing a false success. Configure Supabase or Resend before accepting real inquiries.

## Quality checks and production build

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm start` listens on `0.0.0.0:3000`. Do not use static export: the inquiry and admin routes require a server runtime.

## Environment variables

Copy `.env.example` to `.env.local` locally, then set production values in the hosting provider’s encrypted environment-variable settings. Do not commit `.env.local`, API keys, database URLs or service-role credentials.

| Variable | Required for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production SEO and canonical host | Required before the production build. Set the final HTTPS origin, e.g. `https://www.your-domain.ng`, with no trailing slash. Drives canonical URLs, the sitemap, robots sitemap URL, Open Graph image base and the configured `www`/apex redirect. Without it, the image base falls back to localhost and the sitemap intentionally contains no production URLs. |
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML verification | Optional token supplied by Google Search Console. The token is output in page metadata. DNS verification can be used instead. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase inquiry storage and admin | Public project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase admin sign-in | Supabase anon/public key (or supported publishable API key). RLS remains the security boundary. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side lead insertion and admin availability | **Secret.** Used only in the Node.js inquiry route. Never add a `NEXT_PUBLIC_` prefix. Rotate immediately if exposed. |
| `RESEND_API_KEY` | Optional owner email notification/fallback | **Secret.** Keep server-side only. |
| `RESEND_FROM_EMAIL` | Resend delivery | Sender address/domain verified with Resend. |
| `LEADS_EMAIL` | Resend delivery | Owner/team inbox for new lead notifications. No owner email was supplied in the brief; configure the real address here. |
| `NEXT_PUBLIC_GA4_ID` | Optional GA4 events | Example format `G-…`; no ID is included in this repository. The tag loads only after visitor consent. |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Optional Ads conversion tracking | Example format `AW-…`; no ID is included. Loaded only after visitor consent. |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Optional Ads conversion event | Use the label for the conversion action that should count a successful project request. |

### Inquiry delivery choices

**Recommended: Supabase storage, with optional Resend notification.** A successful Supabase insert is the durable form-delivery confirmation. Resend is then used only as an additional notification; if that notification fails, the saved inquiry still receives a success confirmation. If the database is unavailable, a configured Resend delivery is attempted as a fallback.

**Email-only fallback:** Configure all three Resend variables. The form confirms only after Resend accepts the message. This does not create the admin dashboard or a searchable lead database, so set up an existing CRM or complete the Supabase setup before relying on email-only operation for ongoing lead management.

## Supabase setup: lead storage and secure admin

1. Create a Supabase project in a region suitable for the business and its customers. Keep the project URL, public key and service-role key out of source control.
2. In the Supabase SQL Editor, run `supabase/migrations/202610100001_create_inquiries.sql`. It creates the private `inquiries` table, indexes, update timestamp trigger, row-level security and admin-only read/update policies. Public users cannot select or insert rows through the anon key; the public form inserts from the server with the service-role key.
3. In **Authentication → Users**, create an administrator with a unique, strong password and confirm the account email. Restrict who can sign in to the project; this dashboard implements email/password sign-in and does not include an MFA challenge flow.
4. From the trusted Supabase SQL Editor, grant that user the admin claim. Replace the example address with the exact account email:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
     || '{"role":"admin"}'::jsonb
   where email = 'owner@example.com';
   ```

   Do **not** put the admin claim in user-editable `user_metadata`. Only a trusted project administrator should run this SQL. Sign out and back in after changing the claim so the refreshed token contains it.
5. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to the hosting environment, then redeploy.
6. Sign in at `/admin/login`, send a test inquiry, and verify it appears at `/admin`. Check that a non-admin Supabase user is denied and that a public/anonymous request cannot read the table.

The dashboard checks the user with Supabase Auth on the server and also queries/updates through the user-scoped Supabase client, subject to the database RLS policies. The service-role key is never used for admin reads or updates. The dashboard currently loads the newest 1,000 records; implement pagination before lead volume approaches that limit.

## Resend setup (optional)

1. Verify a sending domain with Resend and configure its required DNS records at the domain provider.
2. Create a restricted API key and add it as `RESEND_API_KEY` in the hosting secret settings.
3. Add the verified sender to `RESEND_FROM_EMAIL` and the owner/team inbox to `LEADS_EMAIL`.
4. Submit a test inquiry and verify the message arrives. If Supabase is also configured, verify the record exists even if notification email is delayed.

The message is plain text to avoid rendering untrusted form content as HTML. Do not enable a sender/domain until its owner authorizes use.

## Packages and content maintenance

- Edit contact numbers, brand copy, budgets and the three designer-portfolio packages in `config/business.ts`.
- Edit service content, original concept case studies, FAQs and process steps in `config/content.ts`.
- Keep the package scope clear: current fixed prices are `₦50,000`, `₦100,000` and `₦180,000+` for graphic-designer portfolio websites only. All other work is custom quoted.
- Replace concept work only with approved real work and accurate client permission/context. Never add an unverified testimonial or performance metric.
- No automatic deposit/payment is collected. Payment schedule and deposit are agreed in the written proposal.
- Review `app/privacy/page.tsx` before launch. The owner still needs to choose and follow a retention/deletion schedule for inquiries, verify the applicable privacy obligations and confirm the live data-provider details.

## Analytics and conversion setup

1. Create the actual GA4 property and/or Google Ads conversion action; add only the owner’s real IDs and, for Ads, the conversion label to the hosting environment.
2. Deploy and accept analytics in a fresh browser session. Confirm the optional analytics choice appears only when an integration ID is configured.
3. Verify `page_view`, `service_cta_click`, `whatsapp_click`, `phone_click`, `generate_lead` and—when both Ads values are set—a `conversion` event in the relevant platform’s testing tools.
4. Qualified leads are tracked as the `qualified` status in the private admin dashboard and can be filtered/exported. Qualification status, contact details, budgets and brief text are **not** sent to analytics. No GA client ID, customer match list or Measurement Protocol identity is collected by this implementation.
5. Campaign parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) are stored in first-party session storage and copied to the lead record only on form submission. Do not put names, email addresses, phone numbers or other personal information in a UTM value.

Tags do not load until the visitor explicitly allows optional analytics. No Google/Ads IDs are present by default. Verify your consent and privacy requirements for the final deployment and jurisdictions served.

## SEO and launch steps

1. Choose the final domain and set `NEXT_PUBLIC_SITE_URL` to the preferred HTTPS version before the production build.
2. Deploy and add the domain in the hosting platform. At the registrar, create the apex and `www` A/ALIAS/CNAME records exactly as shown by that host; DNS targets vary by provider, so do not copy generic placeholder records. Configure the platform’s primary-domain redirect. The Next.js config also redirects the `www`/apex alias to the host in `NEXT_PUBLIC_SITE_URL`.
3. Enable automatic HTTPS and HTTP-to-HTTPS redirection in the host/CDN, wait for the certificate, then test both hostnames and HTTP/HTTPS variants. Confirm the preferred version returns 200 and alternatives return a 301/308 to it.
4. In Google Search Console, add a Domain property and complete DNS verification (recommended), or set `GOOGLE_SITE_VERIFICATION` with the supplied HTML token and use the URL-prefix property.
5. Submit `https://your-final-domain/sitemap.xml`, inspect the homepage and representative service pages, and request indexing after verifying canonical URLs. Check `/robots.txt` and confirm `/admin` is not indexed.
6. Test internal links, custom 404, mobile navigation, form error/success modes, WhatsApp/phone links, and admin permissions on the deployed HTTPS site.
7. Run Lighthouse or PageSpeed Insights against the deployed domain. Record the actual mobile and desktop scores and Core Web Vitals after deployment; this repository does not claim unmeasured results.

## Deployment

### Vercel (recommended for this Next.js app)

- Import the repository/branch into a Vercel project, use the repository root, and set the environment variables above for Preview/Production as appropriate.
- Framework preset: Next.js. Build command: `npm run build`; install command: `npm ci`; output: managed by Next.js/Vercel. Do not set a static output directory.
- Add the custom domain in Vercel, apply the DNS values Vercel displays, choose the primary domain, and enable HTTPS. Redeploy after changing any build-time `NEXT_PUBLIC_` value.

### Any Node.js host

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Run the app with Node.js 22, expose port `3000`, bind to `0.0.0.0`, and use the host’s TLS-terminating reverse proxy with secure HTTP-to-HTTPS and primary-domain redirects. The host must support Next.js App Router server routes and the Node.js runtime; static-only hosting is not sufficient.

## Backup, recovery and operations

- Enable the database backup/PITR option offered by the selected Supabase plan and verify its retention/restore point before launch; plan features vary.
- Keep an encrypted off-platform backup on a regular schedule, store it outside Git, and periodically rehearse restoring it to a separate Supabase project. With the PostgreSQL connection string kept in a secure shell secret (not in chat or source control), a custom-format backup can be made with:

  ```bash
  pg_dump --format=custom --no-owner --no-privileges "$SUPABASE_DB_URL" --file "growthly-$(date +%F).dump"
  ```

  A controlled restore into a prepared recovery project can use:

  ```bash
  pg_restore --clean --if-exists --no-owner --no-privileges --dbname "$SUPABASE_DB_URL" growthly-YYYY-MM-DD.dump
  ```

  Verify the target project and backup file before restoring; a clean restore overwrites matching objects. Keep backups encrypted and restrict access because they contain personal inquiry data.
- Limit Supabase admin accounts, use MFA where available, rotate credentials after staff changes, and remove access promptly.
- Request deletion/correction of a lead through an authorised administrator; automatic retention deletion and in-dashboard delete controls are not implemented.
- The in-process rate limiter is best-effort and resets across serverless instances/redeploys. It complements validation, same-origin checks and the honeypot; for higher traffic, add a durable rate-limit/WAF rule at the hosting/CDN layer.

## Remaining manual launch tasks

- Configure the owner’s actual domain, Supabase project and service-role secret, and either Resend or Supabase-based delivery.
- Create and test the admin user/RLS role. No admin credentials or production secrets are included in this repository.
- Add the owner’s real Search Console/GA4/Ads IDs only if those services are selected.
- Confirm package availability, scope, contact numbers, privacy retention policy and final legal/privacy review with the business owner.
- Replace clearly labelled concept portfolio entries with approved commissioned work when available.
- Perform the final deployed-site delivery test, DNS/HTTPS checks, accessibility review and real mobile/desktop Lighthouse measurement.
