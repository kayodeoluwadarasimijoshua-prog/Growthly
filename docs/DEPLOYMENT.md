# Deployment and maintenance

## Hosting decision

**Implemented, provider account configuration requires owner action:** retain the existing Vercel Git integration. GitHub deployment records already identify Vercel; Next.js requires no framework migration. The server API means static export/GitHub Pages is not an equivalent full-feature deployment.

Vercel’s [Hobby documentation](https://vercel.com/docs/plans/hobby) limits that plan to non-commercial personal use. The owner must confirm an eligible plan for this commercial site. The [Pro documentation](https://vercel.com/docs/plans/pro-plan) lists a $20/month platform fee with one deploying seat and $20 usage credit, plus possible tax, usage and add-on charges. Confirm current billing/limits in the account before accepting costs. No plan was purchased or changed. Supabase/Resend costs depend on the selected plan, usage and region; no accounts were provisioned. Domain, hosting email and domain renewals remain separate owner expenses.

## Actual preview deployment

The branch push triggered the existing Vercel integration. GitHub reported **success / Preview** for commit `55db63149239f5b05a959ee49be4892707bc367e`:

<https://growthly-7vztd7es0-joshuas-projects-94631af4.vercel.app>

This deployment is protected by Vercel login. Public homepage/quote/robots fetches redirect to the login page, so remote runtime acceptance remains an owner/team task. No protection bypass attempted. The Arena Live Preview on port 3000 is the tested local production build. The production domain was re-fetched and still showed the previous homepage.

## Preview and promotion

1. Import or retain `kayodeoluwadarasimijoshua-prog/Growthly` in the **existing** Vercel project. Use the Next.js preset, `npm ci`, `npm run build`, supported Node 22 and the normal `.next` output. No static export.
2. Review the session branch `arena/c8310713-growthly` in a Preview deployment. Do not change the production branch or move DNS just to inspect it.
3. Preview settings: `NEXT_PUBLIC_SITE_URL=https://growthly.com.ng`, `SITE_INDEXING_ENABLED=false`. The quote form works through the explicit WhatsApp handoff even without secret credentials.
4. For online form delivery, configure either Supabase project URL/service-role key or all three Resend values from `.env.example`. Admin authentication additionally needs the Supabase anon/public key. Follow [integration instructions](INTEGRATIONS.md). Keep all secrets in the provider dashboard; never in Git or browser variables.
5. Submit an authorised test lead; verify private record/inbox receipt, notification fallback, admin permissions and delete test data. Provider-mock tests are not substitutes for this.
6. Confirm primary WhatsApp receipt manually from a phone, public contact details, package scope, privacy retention policy and terms. Prices remain quotation-based until owner-approved.
7. Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, then `npm start` and `npm run test:browser`. Run Lighthouse with `node scripts/measure-performance.mjs`.
8. Set **Production only** `SITE_INDEXING_ENABLED=true` and correct canonical origin, then make a fresh production build. Confirm Vercel Preview still has `false`. Production indexing values are read at build time for static pages.
9. The authorised owner promotes the approved deployment or merges using the repository’s existing production workflow. This session does not alter another branch or production DNS.
10. Verify the actual production domain: homepage and all required routes; correct HTTPS certificate; www/apex redirect; legacy redirects; successful enquiry; canonical tags; sitemap; robots **Allow: /**; no `X-Robots-Tag: noindex` on public production pages. Confirm admin stays noindex.
11. Only after this, verify Google Search Console and Bing Webmaster Tools and submit the sitemap. Use `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` if using HTML verification.

## Domain and mail preservation

The existing HTTPS site was retrievable; the revised site must be separately verified after promotion. Do not change nameservers. First export/audit DNS records, especially MX, SPF, DKIM, DMARC and any existing subdomains. If Vercel already has the domain, no DNS migration should be necessary. Make only owner-approved records recommended for the existing project, and preserve mailbox services. Host-scoped production frame protection allows the Arena preview iframe while protecting the configured custom hostname.

## Security and operational checks

- Enquiry API checks origin, field types, lengths, consent, honeypot and request size. No private data is logged intentionally or returned in public listings.
- In-process rate limit resets with instances and does not coordinate between them. Add host WAF limits or an approved shared rate-limit store for a production campaign. Do not trust raw forwarding headers on arbitrary self-hosted proxies.
- Private storage uses server-only Supabase credentials. Existing admin uses user authentication and database RLS. No new admin features added.
- Use MFA/provider access controls, restrict team members, back up database data and set a retention/deletion policy. Live RLS permissions and retention are owner acceptance tasks.
- Supabase failure can fall back to an accepted Resend message. Email-only delivery creates no database record; keep an inbox/CRM workflow. Email provider acceptance does not guarantee inbox arrival.
- Dependency audit passed locally; rerun regularly. No guarantee against future advisories.

## Analytics and commercial measurement

The existing consent-gated GA4 setup was retained. Configure `NEXT_PUBLIC_GA4_ID` only after owner approval, disable GA4 enhanced measurement for automatic form interactions/outbound clicks and avoid URL/form-data capture, then inspect network payloads with a test account. Optional Ads conversion settings are in `.env.example`. No tags load by default; declined consent leaves forms and navigation working. Cloudflare Web Analytics was assessed but not added; it can be a future traffic/field-performance option rather than a second simultaneous tracker.

Events: `quote_cta_click`, `whatsapp_click`, `portfolio_visit`, `pricing_visit`, `service_visit`, `generate_lead` for **confirmed online** delivery. A WhatsApp click is not a delivered lead or sale. `page_view` uses pathname-only location/referrer, not quote contents or query strings.

Maintain a private lead register (or use the existing admin when configured): source/campaign, delivered enquiry date, qualified/unqualified, quote value, proposal sent, won/lost, deposit and final revenue. Calculate qualified-enquiry rate, quote-to-sale conversion and attributed revenue from actual records, not click totals. For WhatsApp campaigns use non-personal source codes and confirm the source in the follow-up conversation. Search Console measures impressions, queries and clicks independently of enquiries.

## Maintenance and rollback

Edit business settings/packages in `config/business.ts`, website FAQs/industries in `config/websites.ts`, concepts in `config/content.ts`. Publish only licensed client work and approved testimonials. Content, page count, revision allowance, delivery estimates and price can all be changed without editing several pages.

Monthly: check form delivery, WhatsApp, domain/hosting renewals, dependency audit, backups, privacy deletion tasks and campaign results. Before updates: run tests and use a Git preview. Roll back using the existing host’s previous successful deployment; keep the database migration compatible. Do not roll back DNS unnecessarily. Re-run actual-domain smoke tests after every production change.
