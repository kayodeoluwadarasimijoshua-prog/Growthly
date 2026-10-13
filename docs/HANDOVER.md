# GROWTHLY handover

13 October 2026 · session branch `arena/c8310713-growthly`

## 1. Website and implementation

**Completed and verified locally:** website-first homepage, development sales page, business/e-commerce pages, industries, concept portfolio and three case studies, quotation packages, About, Contact, quote form, privacy policy, terms and a genuine 404. Supporting service routes retained. Original logo, green identity and artwork preserved. No testimonials, awards, client counts or business outcomes fabricated. Concepts are clearly fictional, not live customer stores.

**Stack:** existing Next.js 16 App Router, React 19, TypeScript, custom CSS, Zod, Lucide and optional Supabase/Resend. Mostly server-rendered content with client JavaScript for navigation, forms and optional analytics. No unnecessary framework rewrite; existing admin preserved without adding a new dashboard.

**References:** CKDIGITAL (service-first/case-study presentation), DPX (scope-based package/enquiry pathways), DIGITO WEBS (inclusions/exclusions), Website Designer Nigeria (website-preview and WhatsApp pathways), DientWeb (business problems and staged delivery). See [full audit, source links and limits](AUDIT-AND-RESEARCH.md). Competitor visual/mobile/performance scores were not independently tested.

## 2. Enquiries and contact

**Completed and verified:** owner selected **08129391626** as primary website-enquiry number. Links encode `2348129391626` and a prefilled message. Alternative telephone: 09162994183. Configuration lives in `config/business.ts`.

Without provider credentials, validated form data prepares a WhatsApp brief. The visitor is explicitly told to open WhatsApp and press Send; no fake receipt, database record or successful-lead analytics event is created. Browser test verifies the encoded number, message and required-field validation. Actual message delivery to the business phone was **not** tested.

**Implemented but live delivery not yet verified:** optional secure online storage/email notification. Tests use mocked Supabase insert/Resend acceptance, including failed storage, missing consent and absent delivery configuration. No credentials exist in this workspace. Configure a real approved provider and verify inbox/database receipt before relying on online submission.

**Requires owner action:** confirm WhatsApp account availability from a real phone; configure database/email if desired, account permissions, privacy retention and lawful policies. No public email/social addresses invented. Package prices remain “Request a quote”; budget ranges are visitor preferences, not approved fees.

## 3. QA results

**Completed and verified against the local production build:**

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | 20 passed |
| `npm run build` | Passed |
| `npm run test:browser` | 23 passed |
| Viewports | 390 × 900, 768 × 900, 1440 × 900; screenshots also at 390 × 844 and 1440 × 1000 |
| Public routes | 15 required pages/case-study pages load; one H1, unique titles, descriptions and canonicals |
| Internal links/images | Crawled links return valid responses; all tested images decode; no detected horizontal overflow |
| Browser errors | No page errors observed in tested journeys |
| Menu/form | Menu toggles/closes on navigation; quote validation, focus and WhatsApp handoff passed |
| API | Invalid/untrusted requests refused; no configuration returns honest 503, not receipt |
| Legacy routes/404 | Redirect checks and actual HTTP 404 passed |
| Accessibility | axe WCAG 2 A/AA + WCAG 2.1 AA: no detected violations on 15 required pages, desktop automated run |
| Structured data | JSON parsing and schema context checks passed; Organization/WebSite/Service/Breadcrumb contents implemented. External Rich Results/schema validators not run |
| Dependency audit | `npm audit --omit=dev`: zero known vulnerabilities at test time |

Automated accessibility is not proof of universal accessibility. Manual screen-reader/device testing, live database RLS checks and production delivery remain owner acceptance tasks. Desktop, mobile, portfolio and quote screenshots were inspected. QA outputs are in ignored `artifacts/` and can be regenerated.

### Measured Lighthouse results

Latest **isolated** run, local `next start`, default Lighthouse simulated mobile throttling or desktop configuration, no analytics tags enabled:

| Page / mode | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home / mobile | 97 | 100 | 100 | 69 | 2.31s | 0 | 142ms |
| Home / desktop | 100 | 100 | 100 | 69 | 0.54s | 0 | 58ms |
| Website development / mobile | 98 | 100 | 100 | 69 | 2.32s | 0 | 65ms |
| Quote / mobile | 98 | 100 | 100 | 66 | 2.39s | 0 | 55ms |

SEO score reduction is from deliberately blocked preview indexing. It is **not a claimed production SEO score**. Enable indexing only after approval and repeat the actual-domain audit. A concurrent run alongside browser tests produced lower performance scores (home mobile 78), illustrating sandbox CPU contention; final isolated results above are not a promise of real-user performance.

Lab LCP/CLS meet the requested targets in this run. **Field INP was not measured**; TBT is a lab diagnostic, not an INP replacement. Nigerian-device/network Core Web Vitals need production field data. Remaining lab opportunities include framework JavaScript/polyfills and render-blocking CSS; no numerical score is guaranteed.

## 4. SEO and measurement

**Completed and verified locally:** unique metadata, production-origin canonicals, sitemap and robots; legacy route redirects; production indexing flag and noindex previews; structured data and generated social artwork. No private enquiries in public URLs or analytics labels.

**Implemented but account verification not completed:** Google/Bing HTML verification settings, consent-gated GA4/Ads, quote/WhatsApp/portfolio/pricing/service events. No live analytics token is configured and no fabricated results shown. Cloudflare analytics assessed, not installed. See [measurement instructions](DEPLOYMENT.md).

## 5. Deployment, domain and costs

**Completed and verified:** local production-server Arena Live Preview on **port 3000**. Open the conversation’s “Growthly website preview”. Browser tests use local access to that same build.

**Hosting selected:** retain existing Vercel setup identified in GitHub deployment records. No DNS/nameserver/email changes, production promotion or subscription purchase made.

**Production status:** the pre-existing `https://growthly.com.ng` responded to HTTPS content retrieval during audit. This revised build has **not been verified on the production domain**. Production publishing, current domain/certificate details and dashboard permissions require owner action.

**Costs require approval:** Vercel Hobby is restricted to non-commercial personal use; owner must confirm an eligible commercial plan. Pro documentation lists $20/month platform fee with usage credit; taxes, extra usage/seats/add-ons may apply. No account plan or limits can be verified from GitHub records. Domain renewals, database/email plans and payment-provider fees for future client stores are separate. No paid services were purchased.

## 6. Outstanding work and next actions

1. **Requires owner action:** review/publish the branch preview through the existing Vercel project; confirm commercial plan eligibility. Production promotion is not automatic handover acceptance.
2. **Requires owner action:** approve public policies, retention, package defaults and final business details; test WhatsApp reception on a real phone.
3. **Requires owner action:** optionally configure Supabase/Resend and verify end-to-end live delivery and private access; add host-level abuse protection for campaigns. Existing in-memory rate limits are not distributed.
4. **Requires owner action:** set Production `SITE_INDEXING_ENABLED=true` before building, retain Preview `false`, confirm live routes/canonicals/HTTPS/redirects, then verify Google/Bing and submit sitemap.
5. **Implemented but not yet verified:** analytics configuration with actual account IDs and consent/network-payload checks. Measure delivered qualified leads, proposals and paid projects—not WhatsApp clicks alone.
6. **Not implemented:** automatic WhatsApp delivery/receipt tracking, new CRM/CMS/payment checkout, standalone transactional demo stores and field INP monitoring. These are unnecessary for the current sales-site scope or require additional services.
7. Publish genuine case studies with permission as projects finish. Start with industry-specific social posts/ads pointing to the relevant sales page, an approved offer and a source code. Review qualified-enquiry cost and quote-to-sale conversion before increasing advertising spend.

Detailed launch, rollback and maintenance steps: [DEPLOYMENT.md](DEPLOYMENT.md). Integration setup: [INTEGRATIONS.md](INTEGRATIONS.md).
