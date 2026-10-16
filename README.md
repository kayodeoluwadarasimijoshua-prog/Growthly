# GROWTHLY — website-development business website

> **Latest launch preparation — 15 October 2026:** [owner's six approvals/checks](docs/LAUNCH-OWNER-CHECKLIST.md), [technical execution handover](docs/LAUNCH-EXECUTION.md), and [fresh evidence/limits](docs/LAUNCH-PREPARATION-2026-10-15.md). Added redacted, non-activating `npm run launch:check` and an `audit:seo` command. Fresh **291 tests/33 files, 95 public browser checks, normal build, types/lint, 19-page SEO zero findings and dependency audit zero known vulnerabilities**. The four `project-assets/starxco*.webp` entries in the supplied patch were binary placeholders, not image data, and were excluded. No usable StarXCO image is present in this checkout; keep screenshot publication and `PROJECT_IMAGE_REVIEW_MODE` disabled. Earlier private-image reports below are historical and do not describe this tree. This reconciliation also reran all 19 CMS-specific browser cases against isolated mocked fixtures (12 editor + 7 runtime); they are not live Supabase/provider acceptance. Owner/account/deployment gates remain; use a new session for approved remote work. The normal CMS-off local preview is available on port 3000 in this session; earlier process IDs/counts below are historical.

> **Latest authority — owner content editor (15 October 2026):** projects/images, contacts, key introductions, FAQs and three website starting prices are now editable at `/admin/content`, with private drafts, explicit publication/pricing approval, conflict protection and draft-only history restoration. Read the [setup/owner guide](docs/CONTENT-MANAGEMENT.md) and [implementation evidence](docs/CMS-IMPLEMENTATION-2026-10-15.md) **before older sections below**. Implementation is local; no real Auth account/migration/Storage/host activation or deployment was performed. `SITE_CMS_ENABLED=false` and **`ONLINE_INQUIRIES_ENABLED=false`** remain the safe defaults; CMS credentials do not activate lead collection. The admin role is broad owner-only access, never a VA assignment. Pending StarXCO media is not auto-approved. This session cannot perform remote GitHub operations; use a new coding session for approved one-time setup/deployment, then routine edits use the editor. Earlier project-in-code instructions, validation counts, process IDs and “no new admin features” statements are historical and superseded for this feature. Preserve the WhatsApp control without pause/play buttons.

**Earlier CMS implementation evidence (historical baseline):** 260 unit/integration tests across 32 files; 19 mocked CMS browser cases and 95 whole-site browser regressions passed; types/lint/CMS-on and CMS-off builds passed; 19-page SEO audit had zero findings. Isolated default-mode lab scores were Home 96 mobile/98 desktop, website 94, quote 98; accessibility/best practices 100. These are not live Supabase/field/deployment proof and are superseded for current test counts by the reconciliation summary above. See the implementation report for scope, limits and remaining live gates.

> **Latest implementation:** [audit fixes and owner checklist](docs/AUDIT-FIXES-AND-OWNER-ACTIONS.md): 218 unit tests / 95 browser checks, service-preserving Contact paths, first-screen contact actions, copy/privacy/header improvements. [VA onboarding plan](docs/VA-ONBOARDING-AND-PRIVACY.md) is ready for the owner’s discussion; no assistant access was activated. Full-audit scores below are the pre-remediation baseline, not a new 10/10 claim.

> **Latest full audit (15 October 2026):** [scorecard, verified checks, issues and launch gates](docs/FULL-WEBSITE-AUDIT-2026-10-15.md). Overall **8/10** for the latest local website; production readiness is not established. New findings include service-context loss through Contact and delayed main contact actions. Fresh normal-mode and historical review-mode measurements are distinguished in the report.

## Website-first, with dedicated service advertising pages

Growthly offers more than website development. The homepage still leads with websites. A six-service chooser appears immediately after the hero, with websites first/highlighted and the other services explicitly standalone. Each supporting offer also has a full separate section and a dedicated landing page with matching headline, deliverables, process, FAQs, quote form and WhatsApp context.

| Service | Canonical path |
| --- | --- |
| Website development | `/website-development` |
| Graphic design | `/graphic-design` |
| AI video adverts | `/aiads` |
| Social media management | `/social-media` |
| Ads & promotion | `/ads-promotion` |
| AI & automation | `/ai-automation` |

Old `/services/<slug>` links redirect. AI-video creative and paid-campaign support are separate scopes. Website prices remain unchanged; other service quotes do not inherit website package prices. See [service/ad landing handover](docs/SERVICE-AD-LANDING-PAGES.md).

**Current checks:** 201 unit/integration tests, 87 browser checks, lint/types/review build, actual 19-page SEO audit zero findings, production dependency audit 0 vulnerabilities. Ad-landing mobile lab performance 97–99 with accessibility/best practices 100; Home mobile 88/desktop 89, with further blocking-time tuning still relevant. These are local synthetic checks. Pages are ready in the preview, **not deployed to growthly.com.ng**. Deploy and verify the real destinations before running ads; no paid campaign, tracking provider or DNS change was activated.


## Current website — fuller professional redesign

The owner reversed the short-site direction. Home now restores useful solutions, proof, packages, full process/FAQs and industry applications; About, Contact, Services and Projects are substantive and clearly structured. Native jump navigation and a no-script website-fit guide help visitors find a suitable next step. The owner’s follow-up adds concrete feature/task/scope explanations, shared project roles, full supporting-service scope detail, a first-message example, proposal checks and handover/account/support responsibilities. Only StarXCO is client work; independent examples are labelled separately. Approved prices, permissions and privacy protections are unchanged.

See [redesign research and evidence](docs/FULLER-WEBSITE-RESEARCH.md), [tomorrow’s real-project instructions](docs/ADDING-REAL-PROJECTS.md) and the [latest handover](docs/NEXT-SESSION-HANDOVER.md). Latest verification: **187 unit/integration tests, 77 browser checks**, lint/types/review build, 19-page actual SEO audit with zero findings, production dependency audit 0 vulnerabilities. Two deeper-content local Lighthouse runs: home mobile 89–92, desktop 86–90, development mobile 97–98, quote mobile 98; accessibility and best practices 100. Home blocking time needs further performance review; do not reuse the earlier 98-home score for this version. This is a private review, **not a public deployment**; its noindex is intentional.


A website-first sales site for Nigerian businesses, built on the existing **Next.js 16 App Router / React 19 / TypeScript** application. The green design tokens and optional delivery integrations are preserved. Demo artwork and Daily Life Review have been removed; StarXCO is the sole public project. The leaf mark has been replaced by a scalable rendition of the supplied Growthly chart-and-arrow logo. Custom CSS remains the design system; a Tailwind rewrite was unnecessary.

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
node scripts/audit-public-seo.mjs
node scripts/measure-performance.mjs
```

Node 22 recommended. Server binds to `0.0.0.0:3000` and accepts Arena preview hosts. Browser testing uses npm-packaged Chromium because the sandbox restricts browser-download hosts. Browser binaries and QA outputs are ignored, not committed. On a different operating system, adapt the executable path in `playwright.config.ts` to your installed Chromium.

## Public routes

`/`, `/website-development`, `/business-websites`, `/ecommerce-websites`, `/industries`, `/portfolio`, `/portfolio/[slug]`, `/pricing`, `/about`, `/contact`, `/request-a-quote`, `/privacy-policy`, `/terms` and a genuine 404.

The service overview remains at `/services`; dedicated canonical service destinations are listed above. Old `/work`, `/work/[slug]`, `/privacy`, `/start-project` and `/services/website-development` routes redirect to their replacements. `/start-project` preserves query parameters. Portfolio contains **one real StarXCO project**. Daily Life Review and all demo case studies have been removed from pages/sitemap and now return 404. The front-image component uses the owner-supplied genuine local StarXCO screenshot only in gated review mode while publication permission is pending; normal builds remain text-only until approval.

## Structure and content editing

- `app/`: pages, metadata routes and server API; existing admin preserved.
- `components/`: navigation, form, sales sections, cards and reusable layout components.
- `config/business.ts`: business identity, confirmed phone numbers, editable website packages and budget preferences.
- `config/websites.ts`: website solutions, industry use cases, website types and FAQs.
- `config/content.ts`: the approved StarXCO project and existing supporting services.
- `config/service-pages.ts` and `config/service-marketing.ts`: canonical advertising paths, contextual CTAs and dedicated service-page content.
- `lib/inquiries.ts`: shared client/server validation; form details never enter analytics events.
- `lib/analytics.ts`, `components/AnalyticsConsent.tsx`: optional consent-gated measurement.
- `lib/supabase/`, `app/api/`: existing secure storage, notification and admin integration.
- Project screenshot: the metadata remains approval-pending, but this checkout has no usable StarXCO image bytes; the four binary placeholder entries were excluded. Keep `PROJECT_IMAGE_REVIEW_MODE=false`; normal and preview output must remain text-only. Do not run image-review/import steps until a valid image asset and screenshot-specific permission are provided. All old demo SVGs remain removed. See the project-image handoff for the safe next steps.
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

Optional GA4 requires owner approval (`NEXT_PUBLIC_ANALYTICS_ENABLED=true`), an account ID and visitor consent. Ads tags/conversions remain disabled; old Ads IDs do not activate them. Events include quote CTA, WhatsApp, portfolio/pricing/service visits and confirmed online submissions, with whitelisted public paths/dimensions and origin-only external referrers. Optional UTM attribution requires approved analytics and visitor opt-in; do not use personal data in campaign codes. See deployment docs for measuring lead qualification and sales.

## Deployment and documentation

- [Audit and five reference reviews](docs/AUDIT-AND-RESEARCH.md)
- [Deployment, launch checklist, cost and maintenance](docs/DEPLOYMENT.md)
- [Preserved Supabase/Resend integration setup](docs/INTEGRATIONS.md)
- [Handover and measured test results](docs/HANDOVER.md)

No DNS changes, new subscriptions or production promotion are required to inspect the Arena Live Preview. Do not treat a preview, a passing build or provider-mock tests as proof of production deployment or live email delivery.

## Latest focused update: projects, logo and one sales action

- Homepage features the two owner-supplied real projects: StarXCO and Daily Life Review. Portfolio concepts remain separate.
- Daily Life Review is described from its public login/signup introduction. Authenticated journaling, Google sign-in and AI insight delivery were not tested or claimed verified.
- `components/GrowthlyMark.tsx` provides a scalable rendering of the supplied chart-and-arrow reference. Header uses dark artwork, footer white; favicon, social artwork and SVG exports match. The original attachments were visible in chat but missing from the stated workspace path. Re-upload the original PNG/PDF to use the exact original rather than this rendition.
- One **consistent marketing action**, as confirmed by the owner: `Get a Website Quote`. Labels/destination live in `business.primaryCTA`. Competing hero/work/WhatsApp sales buttons were removed; project navigation, contact details and necessary form operations remain functional.
- Local checks: lint/typecheck/production build, 24 unit/integration tests and 27 browser checks passed.
- Remote publishing is not available in this closed coding session. Start a new coding session to push/deploy the local update.

## Latest update: approved prices, SEO and next-session handover

Owner-approved starting design-and-development prices: **Starter Website ₦100,000; Business Website ₦200,000; E-commerce Website ₦300,000**. Final scope/fees are quoted in writing; Starter is multi-page. All three packages include a **free .com.ng domain and free hosting for the first year**; later domain/hosting renewals are separate. Content creation, maintenance, business email and third-party charges are separate unless agreed. Numeric/display prices and FAQs derive from `config/business.ts`. Intent keywords and core-page metadata live in `config/seo.ts`; no keyword-volume or ranking claims are made.

Unique titles/canonicals/social metadata, relevant on-page headings, pricing/cost copy, Organization/WebSite/Service/Breadcrumb data and Vercel preview noindex protections are implemented locally. Production indexing and Search Console submission require launch approval and actual-domain verification.

Latest validation: lint, typecheck and production build passed; **34 unit/integration tests and 34 browser checks passed**, including displayed prices across five routes, 13 remaining public-page axe checks plus the open mobile menu, and 390/768/1440px route/overflow checks. Delivery-provider checks use mocks; no live delivery/deployment or new Lighthouse scores are claimed.

**Start here:** [complete next-session handover](docs/NEXT-SESSION-HANDOVER.md), with priority tasks, keywords, file map, blockers and publication acceptance checklist. [Copy/paste next-session prompt](docs/NEXT-SESSION-PROMPT.md). This session is closed for remote GitHub operations; all newest changes are local and must be preserved when opening the next session. No tokens should be pasted into chat.

### Latest logo reference update

Updated header dark-symbol and footer white-symbol logo renditions to match the newly supplied visual references more closely (aspect ratio, chart bars, arrow and corner radii); favicon and generated social artwork use the updated mark. The reported uploaded PNG paths were unavailable, so originals have **not** been embedded. Lint/typecheck/build, 29 unit/integration and all 28 browser checks passed after this update. Local preview only; no remote publication.

### Latest package revision — owner approved

Starter now starts at **₦100,000** and is multi-page; Business starts at **₦200,000**; E-commerce starts at **₦300,000**. Every package includes a **free .com.ng domain and free hosting for the first year**. The owner confirmed the 12-month hosting duration and the same bundle for E-commerce. Domain availability, hosting limits, ownership and renewal prices are agreed in writing; subsequent renewals, email, maintenance and third-party fees are not automatically free. No actual hosting purchase/domain registration occurred. FAQs, terms, pricing/cost copy, SEO and next-session instructions have been synchronized. Lint/typecheck/build, **30 unit/integration tests and 28 browser checks** passed after this revision.

### Latest update — draggable floating WhatsApp

Owner selected **WhatsApp button only**, not AI chat. `components/FloatingWhatsApp.tsx` adds the approved contact shortcut on public pages using the configured business number. Drag using mouse/touch; focus and use arrows to move, Shift for larger steps, Home to reset. Only coordinates are remembered locally (`growthly_whatsapp_position`), with a safe fallback if storage is blocked. The button stays on-screen after resize and above analytics consent controls; hidden on admin routes. Dragging does not open WhatsApp or count as a contact click. Activation opens a prefilled message in a new tab; visitors must send it themselves. Privacy copy is updated; consent-gated analytics are unchanged. This floating contact icon is the owner-approved exception to the earlier single-sales-action restriction; the main CTA stays “Get a Website Quote”. No AI/FAQ chatbot or new paid service was added.

Latest verification: lint/typecheck/build passed; **34 unit/integration tests and 33 browser checks passed** (including pointer/touch dragging, persistence, keyboard/reset/resize, mocked WhatsApp activation, storage failure/admin exclusion and consent-banner avoidance). Mobile/desktop screenshots inspected. This remains local-only; no live WhatsApp receipt or production deployment is claimed.

## Latest owner-directed simplification — read this before older reports

Homepage now has **four sections**: offer + single StarXCO proof card → compact packages → three-step process + three key FAQs → final quote action. The initial price and first-year domain/hosting offer are visible in the hero. Removed repeated benefits/services/industries/why-us/work blocks, all fictional portfolio entries/artwork, and Daily Life Review. Pricing navigation is prominent, detailed package terms expand on demand, mobile-menu quote text stays white, and benefits/CTA spacing is fixed. The main service, pricing, About and quote layouts are tighter. Approved prices/free-year terms and draggable WhatsApp remain unchanged.

Local measured homepage height fell from 14,011 to 4,499px at 390px width (about 68%) and from 8,662 to 2,472px at 1440px (about 71%). These are page-length observations, not performance or conversion claims. Latest QA: lint/typecheck/build, **34 unit/integration and 34 browser checks passed**. Desktop/mobile/menu screenshots inspected. Remote StarXCO image loading is blocked in the sandbox; the actual homepage-photo URL is configured but local screenshots show the honest fallback. Image success tests use mocked bytes. No full-page screenshot, live enquiry receipt or deployment is claimed.

[Full change summary, professional references and image limitation](docs/SHORT-SITE-UPDATE.md). This update supersedes earlier instructions/reports about retaining Daily Life Review and demos. Do not restore removed work. All current changes remain local until a new authorized publishing session.

## Current launch status — audit findings, not launch acceptance

Read [the full pre-launch audit](docs/PRE-LAUNCH-AUDIT.md) before publishing. **L01 is fixed and regression-tested locally (14 October 2026):** the quote form has an explicit native POST action; controls stay hidden/disabled until hydration, with plain WhatsApp/phone fallback links. A defensive native POST endpoint ignores the body and returns a fixed 303 redirect with truthful “not sent” feedback, no-store and no-referrer headers. Personal fields do not enter first-party submission URLs in the tested JavaScript-disabled/blocked/delayed/native cases. The normal JavaScript quote flow remains intact.

Latest L01 validation: **lint, typecheck, production build, 38 unit/integration tests and 39 browser checks passed**. No-JavaScript screenshots/overflow were checked at 320/390/1440px; the WhatsApp navigation test mocks the external destination, not receipt. L06/L08 were subsequently addressed below; operational/publication gates and manual real-device/accessibility acceptance remain unresolved. This is not unrestricted launch acceptance.

The public domain fetched during this audit serves an older demo/quotation-only version and robots.txt disallows crawling. Actual production receipt, provider/admin/RLS configuration, commercial hosting eligibility, free-year renewal economics and retention policy need owner acceptance. Fresh isolated Lighthouse results: homepage mobile performance 97, accessibility 98, best practices 96, SEO 66 (local noindex); see the audit for all results and limitations. No production field metrics or live delivery are claimed. The original audit did not change application code; the subsequent L01 remediation above is local only. No remote deployment was made.


### Accessibility and service routing — completed locally, 14 October 2026

- **L06:** light, readable supporting-hero links/focus rings; correct project/industry headings without changing their appearance; natural image-link names in loaded/error states; a named WhatsApp contact landmark.
- **L08:** all five supporting services retain their identity through contextual CTAs, quote-page copy/metadata, form, WhatsApp message and API/provider mocks. Website-only questions are removed for these enquiries; website packages and website-type requirements remain intact for website work. Unknown/duplicate service links show a clear fallback notice rather than pretending the service was accepted.
- **Latest QA:** lint/typecheck/build, **63 unit/integration tests and 56 browser tests passed**. Expanded default axe + targeted label-name rule reports no violations on all **19 public sitemap routes**. Keyboard/hover/focus and loaded/failed image states are covered. All-19 route/overflow checks at 390/768/1440px; extra 320px and text-enlargement probes plus mobile service/quote visual review.

The L01 privacy protections still pass. Provider receipt uses mocks, not live delivery. Automated accessibility is not certification; real screen-reader/browser-zoom/phone review remains. No new Lighthouse results or deployment. Other launch gates remain open; see the audit.


### Reliable project image — technical work ready; owner upload pending

The StarXCO hotlink has been removed. Until a genuine permitted image is supplied, the project is intentionally text-only—not a broken preview or fabricated screenshot. The empty `config/project-images.json` manifest can enable only a registered local image; `npm run prepare:starxco-image` validates/optimises an approved raster to WebP and records dimensions, alt, source kind and credit. Next.js handles responsive local loading; no external image server is needed.

**Owner:** upload one genuine landscape StarXCO homepage screenshot/photo and confirm permission/source kind. **Agent:** inspect, compress/import, test actual loading/mobile readability/performance and request your visual approval. You do not need to do the technical editing. [Full image handoff](docs/PROJECT-IMAGE-HANDOFF.md).

Latest QA: **74 unit/integration tests, 56 browser tests**, lint/typecheck/build and whitespace checks passed. All-19 accessibility checks still pass; 320px project-route probes have no overflow or external image request. Tooling tests use synthetic fixtures/check-only mode; no actual image is installed or deployed. Original-logo approval and other operational/release gates remain unresolved.


### StarXCO screenshot — unavailable in this checkout; publication disabled

The supplied change file contained four `project-assets/starxco*.webp` entries identified as binary placeholders, not image data. They were excluded from reconciliation; no usable StarXCO image bytes are present here. The portfolio entry remains text-only, `permissionConfirmed` remains `false`, and `PROJECT_IMAGE_REVIEW_MODE` stays `false`. Do not enable a review build, publish an image, or claim that screenshot loading/visual checks were completed for this checkout. The review route returns 404 when the source asset is absent.

The owner approved presenting StarXCO as portfolio work, but that does not grant screenshot-specific publication rights. Once a real image and explicit image permission are available, follow [the project-image handoff](docs/PROJECT-IMAGE-HANDOFF.md), then separately review and approve its presentation. Earlier reports below describing a locally installed private WebP or review-mode image checks are historical and are superseded for the current tree.


### API hardening — bounded uploads/no-store done locally (L10 partial)

Enquiry/login/lead-update JSON bodies are now byte-counted during streaming, not fully buffered before checking. Existing 24,000/4,096/12,000-byte limits remain. Missing/understated lengths cannot bypass them; rejected uploads are cancelled without processing/echoing the private body. Auth/origin/rate gates remain first. Sensitive enquiry/admin responses—including failures—are private/no-store; a Next.js API header rule covers framework errors too. No provider is enabled and no new paid protection was added.

Latest QA: **109 unit/integration and 58 browser tests passed**, plus lint/typecheck/review production build and whitespace check. Includes real HTTP chunked oversize/413 and runtime cache-header checks; successful delivery/admin tests are mocked. The screenshot stays review-only with client permission pending.

**L10 remains open in part:** host/proxy buffering and time limits, trusted forwarded-IP verification, distributed rate enforcement, delivery idempotency and live timeout/retry/alerting acceptance. No live receipt or deployment. Application stream bounds are not proof that the host has never buffered the upload.


### Latest WhatsApp correction and audit hardening

The rejected dark inner disc/halo is removed: sourced **WhatsApp brand mark**, white on **#25D366**, with an ongoing gentle bounce, separate pause/resume control and stable 56px link target. The extra white outer ring has been removed and the mark increased to 38px. Reduced motion, hover/focus/drag, remembered position and keyboard reset remain supported. Business Website **Recommended**, pricing and first-year scope are unchanged.

Further local improvements cover provider response timeouts/bounds, memory-capped rate buckets, explicit forwarded-header trust, optional private shared-rate SQL/transport and inquiry retry protection, corrected local-image/WhatsApp privacy, storage-blocked consent and opt-in-only attribution. Analytics now also needs owner enablement; the analytics prompt cannot activate Ads. No providers, migrations, paid services or retention schedule were activated.

Latest checks: **169 unit/integration tests / 18 files and 69 browser checks passed**, lint/types/review build/diff check, dependency audit **0 vulnerabilities**. Four local review Lighthouse runs: performance **97/93/99/98** (home mobile/desktop, development mobile, quote mobile), accessibility and best practices **100**; review is deliberately noindex. Mobile-home lab LCP is now **2.33s** after private responsive variants and removal of unnecessary common client schema imports; field/production acceptance remains pending. No production/field score or deployment claim.

Read [LOCAL-AUDIT-IMPROVEMENTS.md](docs/LOCAL-AUDIT-IMPROVEMENTS.md) for exact implementation, activation instructions and remaining launch blockers. Client permission is still pending, screenshot remains review-only, WhatsApp-first is preserved, and real hosting/provider/retention/device/production acceptance cannot be marked complete from local tests.
