# Growthly — full pre-launch audit

> **Current checkout image caveat — 15 October 2026:** the supplied patch's four `project-assets/starxco*.webp` entries were binary placeholders, not image data, and were excluded. No usable project image is present here. Keep `PROJECT_IMAGE_REVIEW_MODE=false`; screenshot publication/review is disabled and current builds stay text-only. Owner approval to present StarXCO does not establish screenshot-specific rights. This current-state note supersedes historical private-WebP/review-image claims below.

## Latest correction — larger logo, ongoing pausable bounce and audit/performance work (14 October 2026)

**Current authority:** [LOCAL-AUDIT-IMPROVEMENTS.md](LOCAL-AUDIT-IMPROVEMENTS.md). The owner rejected the previous WhatsApp dark inner disc/halo. It is now the unchanged **Simple Icons WhatsApp brand mark**, white on **#25D366**, with a **ongoing gentle bounce of the larger mark with a separate pause/resume control**, not the hitbox. Hover/focus/drag and reduced motion disable it. Business Website Recommended, approved prices/offers and existing drag/touch/keyboard behaviour remain unchanged.

Implemented further local audit work: 5-second bounded provider transport including response bodies (Supabase/server/admin middleware/email); hard-capped local rate cache; explicit forwarding-header trust with valid IP parsing; optional private atomic Supabase shared-limiter migration/fail-closed transport; stable online form retry keys/concurrent-submit protection and optional database deduplication migration; corrected local-image/WhatsApp privacy text; owner-enabled opt-in analytics with Ads disabled, storage-blocked consent fallback, consent-gated attribution and restricted non-personal events. Private responsive review images, failed-SSR-image fallback repair, lightweight client imports and fresh lab performance checks are included. The extra outer ring was removed, the brand mark enlarged to 38px and no-script contact stays static. **Provider flags/migrations remain disabled/unapplied pending approval.** No workflow or retention decision was inferred from skipped questions.

**Validation:** lint/typecheck/review build, **169 unit/integration tests (18 files), 69 browser checks**, 0 reported dependency vulnerabilities and diff check. Includes real isolated PostgreSQL-engine migration/role/RLS/uniqueness/limiter tests (modeled JWT, not live Supabase), provider mocks, actual private HTTP upload/error checks and all-19 accessibility scans. Fresh local Lighthouse performance: home mobile **97**, desktop **93**, development mobile **99**, quote mobile **98**; accessibility/best practices **100** on all four. Mobile-home review LCP is now **2.33s** in the latest lab run. Private responsive image variants and lightweight client imports improve delivery without making the pending screenshot public. Review SEO 66–69 is intentionally noindex, not production acceptance.

**Still blocked:** client image/original-logo approval; approved delivery/retention/providers; live receipt, account RLS/session/MFA and parallel/multi-instance rates; actual trusted proxy/host WAF/timeouts; commercially eligible hosting/costs; real-device/AT/zoom and production release/indexing. Preserve WhatsApp-first, pending-image gate and no paid services/DNS changes. No deployment/GitHub operation; publication requires a new coding session. **Do not label the entire audit complete.**

## Latest API hardening — 14 October 2026 (L10 partial)

Owner authorized the next focused item. **Bounded JSON reads and private response caching are fixed locally; L10 is not fully closed.** `lib/bounded-json.ts` counts raw UTF-8 bytes while reading, stops/cancels on oversize, releases the reader and never aggregates beyond the configured byte cap. Content-Length is an early rejection hint, not the enforcement mechanism: absent, invalid or understated lengths cannot bypass the stream limit. Invalid JSON/UTF-8 maps to generic 400 feedback; oversize maps to 413 without body echo/delivery. Existing limits are preserved: enquiry **24,000 bytes**, admin login **4,096**, lead update **12,000**. Origin, rate-limit and admin authorisation gates remain before body consumption.

`lib/api-response.ts` applies **Cache-Control: private, no-store** to enquiry/login/update/logout handler responses, including failures and 429s (Retry-After preserved). A scoped Next.js API header rule also covers framework-generated errors such as 405. Native-form redirect privacy and pending-screenshot review rules remain intact. Successful provider/admin flows are unchanged and tested with mocks.

**Validation:** lint/typecheck/review production build, **109 unit/integration tests (13 files) and 58 browser tests passed**. Unit tests cover exact boundaries, multi-byte UTF-8 across chunks, missing/false length headers, malformed data, cancellation/unread tail and provider non-invocation after rejection. Browser suite includes real HTTP chunked/declared oversize 413 responses and actual private/no-store error/405 headers, alongside all earlier accessibility/service/form/image regressions. No provider account, deployment, paid service, DNS or live receipt change.

**Still required for L10:** host/proxy body and slow-request/time limits, verified trusted IP/header handling on the chosen host, shared/distributed rate enforcement, delivery idempotency/duplicate policy and real timeout/retry/alerting acceptance. A framework/proxy may have buffered bytes before this reader runs; this is an application-level bound, not a claim of end-to-end transport protection. In-process rate buckets remain non-distributed. Do not call L10 complete or turn on a new provider on the strength of these tests.

## Current screenshot status — 15 October 2026

The supplied patch contained four `project-assets/starxco*.webp` entries identified as binary placeholders, not image data. They were excluded from compatibility checking and application. No usable StarXCO image bytes are present in this checkout; no screenshot has been published. The manifest keeps `permissionConfirmed: false`, and `PROJECT_IMAGE_REVIEW_MODE` must remain `false`. The guarded review route returns 404 without an actual registered file, so this checkout remains text-only in normal and preview builds.

The owner approved presenting StarXCO as portfolio work, but screenshot-specific rights remain unconfirmed. Do not treat prior reports of local 76,444-byte image data, responsive private variants, successful screenshot review, or image-loaded browser checks as evidence for this tree. Once a valid image and explicit permission are supplied, follow [PROJECT-IMAGE-HANDOFF.md](PROJECT-IMAGE-HANDOFF.md), verify the real bytes/visual fit, and obtain separate approval before any release. Original Growthly-logo approval remains a separate gate.


**Audit date:** 13 October 2026
**Scope:** current local source and a fresh local production build; public page reads from growthly.com.ng; dependency scan; automated browser/accessibility checks; four fresh Lighthouse runs; enquiry/admin/security/SEO/hosting/privacy review.
**Decision:** **not ready for an unrestricted public launch of the latest version yet.** L01, L06 and L08 have since been remediated/tested locally; delivery/hosting acceptance, real-device/screen-reader review and production release/indexing work remain. A private review preview is appropriate.

The original assessment below is an audit baseline, not an implementation pass. No application code, providers, production settings, DNS, paid plans or remote GitHub state were changed. Test data was synthetic and local. No enquiry was submitted to the public site. All fixes below are recommendations and have **not** been applied by this audit.


## Latest image remediation — shared responsibility, 14 October 2026

**L07 technical preparation completed locally; genuine image/permission still required from owner.** No real StarXCO image exists in the saved assets. The external image hotlink and its large failure panel have been removed; the project now works as a compact text-only card/case study with functional details/live links and no fabricated screenshot/credit. A guarded local-image manifest/import tool is ready: permission/source-kind/alt/credit requirements, raster validation, orientation/metadata handling, non-upscaling WebP compression, responsive local loading and a stable frame/error state. No actual project image has been installed.

Owner uploads one genuine permitted desktop first-screen screenshot or original homepage photo and confirms its source/kind/permission. Agent then optimises/imports it, verifies actual bytes/loading/readability/performance and requests visual approval. See [PROJECT-IMAGE-HANDOFF.md](PROJECT-IMAGE-HANDOFF.md) for the precise split and command. Current manifest is empty; synthetic tooling tests are not portfolio evidence. The original-logo approval gate remains separate and unresolved.

Latest QA: lint/typecheck/build, **74 unit/integration tests (10 files) and 56 browser tests passed**; all-19 default axe + label-name checks still pass. Home/portfolio/case study at 320px have no overflow/external project-image requests, and mobile/desktop screenshots were inspected. Current browser checks exercise the text-only state; real registered-image loading/visual/performance acceptance remains pending upload. No new Lighthouse scores, public deployment or rights certification claimed.

## Latest remediation — accessibility and service routing, 14 October 2026

**L06 code findings and L08 routing fixed locally; not deployed.** Owner authorized these next, without a redesign, price change or changes to providers/DNS.

**Accessibility (L06):** “All services” is now pale green on the dark supporting-service hero in default/hover/focus states; keyboard focus rings are light too. StarXCO and industry cards use correct top-level H2s, while nested project cards retain H3 semantics and the previous visual sizes. Project image links derive their name from natural visible/alt text, with project identification included; unavailable-image text is no longer masked by an overriding image role/label. Floating WhatsApp and its help text are inside a named complementary landmark.

**Service context (L08):** all three contextual CTAs on each of the five supporting-service pages carry the service, including the closing CTA. The quote page validates the slug against configured services and uses appropriate heading, metadata, brief wording and optional date/feature prompts. Supporting-service forms omit website type/package questions, use `website_type: ""` and `package_id: "custom"`, and preserve the actual service in WhatsApp/API/storage/email. Website enquiries still require a website type; website packages cannot be attached to supporting services. Unknown/duplicate service query values show an explicit primary-offer fallback notice with a Services link; unknown services are still rejected by API validation. Client navigation back to the generic quote CTA resets service/form context. Safe no-script contact links retain known service context without personal fields.

**Validation:** lint, typecheck, production build, **63 unit/integration tests (9 files), and 56 browser tests passed**. Full default axe checks (including best-practice heading/landmark rules), plus explicitly enabled experimental `label-content-name-mismatch`, report zero violations on **all 19 sitemap routes**. Additional checks cover both loaded/failed project images, supporting-service quote/handoff states, real Tab navigation to hero links, focus/hover contrast, all service CTAs and native-form privacy. Database/email delivery is tested with provider mocks; WhatsApp message generation is intercepted, not delivered.

Route/overflow checks cover all 19 routes at 390/768/1440px. Additional 320/390/1440px probes covered graphic design, its quote form, industries and portfolio; mobile service/quote screenshots were visually inspected. A 200% root-text probe at 780px found no overflow on the service/quote pages; this is **not actual browser-zoom certification**. Manual screen-reader announcements, browser zoom, real phones/Safari and production receipt remain acceptance tasks. No new Lighthouse scores, live receipt, indexing change or deployment are claimed. Other audit gates remain open.

## Remediation update — 14 October 2026

**L01 completed locally; not deployed.** Following owner authorization to address the first finding only:

- Added an explicit native `method="post"` and `/api/inquiries/fallback` action. Until hydration completes, all inputs/buttons are hidden and disabled, with plain direct WhatsApp/phone links available if JavaScript is disabled, blocked or delayed.
- The native POST safety endpoint does not read/log/store/forward/echo the body. It rejects cross-origin requests and redirects same-origin requests with **303** to the fixed `/request-a-quote?form=fallback`, dropping incoming query data. Feedback says **“Your request was not sent”**, not a delivery confirmation. This endpoint is not a no-JavaScript enquiry delivery service.
- Verified actual browser response headers: **no-store**, **no-referrer**, **noindex, nofollow**. A path-specific Next.js header rule prevents the global referrer default overriding the safety endpoint.
- Normal JavaScript validation/WhatsApp flow still passes. Regression tests cover no scripts, blocked scripts, delayed hydration and forced native submission with JavaScript both off/on, using synthetic data only.
- **Lint, typecheck, production build, 38 unit/integration tests (8 files) and all 39 browser tests passed.** Direct-contact layout/overflow checked at 320/390/1440px. External WhatsApp navigation is mocked; real receipt is not verified. No fresh Lighthouse/production measurements are claimed for this fix.

At the end of the L01-only pass, other findings remained open; L06/L08 have now been addressed in the update above. Historical evidence and the 34/34 baseline below are retained to show what the audit found before remediation. No provider configuration, paid plan, DNS, deployment or production indexing change was performed.

## 1. Executive summary

### What is already sound

- Four-section, website-first local homepage with early pricing, one StarXCO project, concise process/FAQ and quote action.
- Approved starting prices: **Starter ₦100,000; Business ₦200,000; E-commerce ₦300,000**. Starter is multi-page. All three include .com.ng domain and hosting for year one; later renewals are separate.
- Clear green identity, mobile-menu quote text, benefit/CTA spacing, legal/contact navigation and movable WhatsApp shortcut.
- Local quote validation, honest unsent WhatsApp handoff, server-side input checks and failure states; no invented receipt in the no-provider mode.
- Unique metadata/canonicals, sitemap, legacy redirects, genuine removed-project 404s and preview noindex safeguards.
- Server-only database writer, server-side admin role checks and an admin-only RLS migration are present.
- Fresh lint, typecheck, build, **34 unit/integration tests and 34 browser checks passed**. npm audit reported **zero known vulnerabilities**.

### The most important launch work

1. **L01 fixed/tested locally:** the native GET privacy issue is remediated; carry this fix into the approved release and verify it on production.
2. **Publish the correct approved version:** the public domain still serves an older, longer site with demos and quotation-only pricing.
3. **Verify actual lead receipt:** decide between WhatsApp-only and online storage/email, then test delivery from real devices/accounts.
4. **Approve commercially eligible hosting and the free-year economics:** the Vercel account/plan and paid costs have not been verified.
5. **L06 code findings remediated locally:** complete manual real-device/screen-reader/zoom review and verify production after release.
6. **Replace the unreliable external project image with an authorized local asset**, or deliberately remove that image block for a lean launch.
7. **Set a real retention/renewal/payment policy and verify production indexing** before marketing the site.

**You do not need six portfolio projects to launch.** One genuine, well-presented project and a working contact journey are enough for an initial launch. Three to six polished demos are a later credibility improvement; label them as self-initiated work, never paid-client results.

## 2. Local versus public site: an important mismatch

Public pages fetched during this audit:

- [Homepage](https://growthly.com.ng/): still contains the Kora Botanics hero, three fictional portfolio entries, the older long section hierarchy and a competing “View Our Work” hero action.
- [Pricing](https://growthly.com.ng/pricing): still says “Request a quote” instead of the approved prices; Starter still mentions a one-page website; the first-year bundle is not presented as approved locally.
- [robots.txt](https://growthly.com.ng/robots.txt): currently returns **`User-Agent: *` / `Disallow: /`**.
- [Quote page](https://growthly.com.ng/request-a-quote): publicly displays **“Send quote request”**. That is evidence of the rendered UI, **not** proof that its production provider receives enquiries. No live submission or provider account check was made.

These are public page-text observations, not a production browser/security-header audit. Hosting controls, GitHub PR status, public server credentials, Search Console and live RLS permissions remain unverified.

The current session is closed for remote GitHub operations. The newest local work includes many modified/untracked files. Start a new coding session for publication, preserve the whole intended patch and use secure platform connections. Do not assume a fresh remote clone contains the current work. Do not paste tokens into chat or reset/clean the repository.

## 3. Priority findings and acceptance criteria

**P0 = launch gate. P1 = fix/verify before broad public promotion or before enabling the affected feature. P2 = follow-up improvement.** Unknown account configuration is identified as unknown, not represented as a proven failure.

### L01 — P0 — Native GET personal-data exposure (remediated locally)

**Status:** fixed/tested locally on 14 October 2026; not deployed. See the remediation update above. The following is the original pre-fix evidence/acceptance requirement.

**Evidence:** `components/InquiryForm.tsx:149` has an `onSubmit` handler but no native form `method` or safe no-JavaScript action. With JavaScript disabled, the default browser submission is GET. A local synthetic test confirmed `full_name`, `business_name`, `phone` and `brief` appear in the `/request-a-quote` URL query string.

**Why it matters:** JavaScript failure, disabled scripts or incomplete hydration can put private enquiry data into browser history, copied URLs and URL logs/referrers. The normal JavaScript POST flow is not the problem; the native fallback is.

**Required fix:** explicitly prevent native GET from carrying private data. Provide a safe progressive-enhancement POST path with matching server validation, or make the JS-dependent form unavailable until ready and provide an accessible no-script direct WhatsApp/phone alternative. Merely pointing a URL-encoded native form at the current JSON-only API will not produce a working no-script quote flow.

**Acceptance:** automated tests with JavaScript enabled, disabled and failed/late hydration; no name, phone, email or brief ever appears in a submitted URL. Direct contact remains usable without JavaScript. Do not use real personal data in regression tests.

### L02 — P0 — Latest approved site is not the public site

**Evidence:** public homepage/pricing observations above conflict with local source and tests.

**Required fix:** preserve local changes, review the complete patch in a new session, produce the correct preview, obtain approval and promote through the existing Git/Vercel workflow. Record the deployed revision and rollback target.

**Acceptance:** actual production domain shows four homepage sections, approved prices/free-year offer, one StarXCO project, no current demos/Daily Life Review, correct logo/WhatsApp and the latest form fixes. Verify actual pages after promotion, not just a successful build/deployment badge.

### L03 — P0 — Lead delivery has no completed live acceptance test

**Status:** local build uses the explicit WhatsApp-only handoff; online provider tests use mocks. Production quote UI indicates an online-send mode but actual receipt is unknown.

**Required decision:**

- **WhatsApp-only launch:** owner has approved this mode and will handle enquiries for now; test a prepared brief and the floating shortcut on real Android/iPhone/desktop. The business phone must actually receive the message after the visitor presses Send. Agree how the owner will record/follow up on enquiries; do not activate VA access.
- **Online form launch:** securely configure approved Supabase and/or Resend; test database/inbox receipt and owner notifications. The API can confirm a saved database record even if email notification fails, so ensure somebody monitors stored leads. Email-only fallback does not create a dashboard record; provider acceptance is not guaranteed inbox delivery.

**Acceptance:** authorized test receipt documented, failure/retry/WhatsApp fallback tested, test data deleted, and a named owner checks/responds to enquiries. No false “sent” state. No API keys in browser variables, Git or chat.

### L04 — P0 — Hosting eligibility, billing and first-year bundle require owner approval

**Status:** existing Vercel project/plan/billing were not accessible in this audit. Fresh [Vercel Hobby documentation](https://vercel.com/docs/plans/hobby) explicitly restricts Hobby to non-commercial personal use. Growthly’s commercial sales site must use an eligible arrangement; a `.vercel.app` URL is not evidence of commercial-plan eligibility.

**Required decisions:** confirm the existing host/project, plan, total costs, limits, renewal responsibility and owner approval. No host migration or purchase is authorized by this audit.

For the advertised free-year client bundle, define the actual registrar/provider, one eligible available .com.ng domain, when the 12 months begin, account ownership, hosting limits, email/support exclusions and year-two renewal charges. Calculate delivery margin after domain, hosting, provider fees and labour. Do not promise unlimited/lifetime hosting or rely on a prohibited free commercial plan. Decide whether intended demo/portfolio use is eligible under the chosen plan too.

**Acceptance:** written, sustainable bundle and eligible plan approved; no surprise renewals, invented renewal amount or unauthorized purchase/DNS change.

### L05 — P0 for search-ready release — Public crawling is blocked

**Evidence:** current public robots file disallows all crawling. Local noindex is intentional and correct for a review preview.

**Required fix at approved release only:** set `NEXT_PUBLIC_SITE_URL` to the correct HTTPS canonical origin and **Production-only** `SITE_INDEXING_ENABLED=true`, then rebuild. Keep Preview/Development protected by their environment checks. Do not enable crawling on an unfinished preview to improve a lab score.

**Acceptance:** production public pages have indexable meta robots, no `X-Robots-Tag: noindex`, sensible `robots.txt` allowing public pages, valid sitemap/canonical URLs and correct apex/www redirects. Admin stays noindex/authenticated and API/admin routes stay out of the sitemap. Search Console/Bing verification and sitemap submission follow actual-domain checks. Submission does not guarantee indexing or rankings.

### L06 — P1 — Accessibility findings (code findings remediated locally)

**Status:** code corrections and expanded automated/keyboard checks completed locally on 14 October 2026. Manual screen-reader, actual browser zoom and real-device acceptance remain. The following describes original pre-fix findings.

The existing 13-page WCAG-tagged axe checks and mobile-menu check pass. Broader scans of all **19 sitemap pages**, targeted experimental label checks and Lighthouse found:

| Finding | Confirmed scope | Recommended correction |
|---|---|---|
| Low-contrast “All services” link | Five secondary-service pages: graphic design, AI video, social media, AI integration/automation, digital advertising | Link is `#08714d` on `#0f362b`, about **2.19:1** versus the **4.5:1** requirement for this text. Use an accessible light colour on the dark hero, including hover/focus. |
| Skipped heading level | Homepage and portfolio StarXCO card; industries page | H1 jumps to H3. Give top-level cards H2 semantics or insert a real meaningful H2; preserve visual styling rather than adding bulky text. |
| Visible link text does not match accessible name | Project image link on homepage and portfolio | Overriding `aria-label` excludes visible image/fallback/tag text. Let the natural name be derived correctly or align the label with visible text, testing image-loaded and error states. Lighthouse/explicit experimental axe rule confirmed this. |
| Floating contact outside landmarks | All 19 public sitemap pages | Wrap the WhatsApp shortcut/help in a named complementary/contact landmark without adding visible clutter. This is a best-practice finding, not a claim of a proven auth/security fault. |

Heading/landmark rules are largely best-practice rules and the label rule is experimental in axe; that explains why “existing tests passed” did not mean “no accessibility issues.” The link-contrast failure is a concrete AA issue on pages outside the existing 13-page coverage.

**Acceptance:** fix contrast/name issues, extend coverage to all 19 public routes, explicitly test the relevant best-practice/experimental rules, and check keyboard, focus, screen-reader announcements, actual browser zoom and real phones. Automated results are not accessibility certification.

### L07 — P1 — StarXCO image (technical preparation done; owner asset pending)

**Current status:** no hotlink or failed-image panel in local source; local import/loading pipeline ready. Genuine permitted asset and final image review are still required. The following is original pre-fix evidence.

**Evidence:** shared preview loads `https://starxco.com.ng/assets/img/hero.jpg` directly with `unoptimized`. The local environment blocks the request with `ERR_CONNECTION_CLOSED`; the safe fallback displays. Lighthouse reports the network error. Public photo bytes, weight and licensing were not verified by this audit.

**Required fix:** obtain an authorized genuine homepage screenshot/photo, optimize to a suitable local WebP/AVIF/PNG asset and verify dimensions/alt text/loading. Keep the stable aspect ratio and error handling. Do not generate a fake screenshot. If an asset cannot be supplied for an initial launch, deliberately remove the unavailable-image block while retaining truthful project text/live link rather than presenting a large failure panel.

**Acceptance:** actual real asset loads on the target domain and mobile/desktop; consent/licensing and source description are correct. A homepage photo must not be described as a full-page website screenshot. Current successful-image tests use mocked bytes, not public asset verification.

The logo is still a disclosed SVG rendition of the visible owner references, not the original PNGs. Obtain accessible originals or explicitly approve the rendition; verify header/footer/favicon/share image. Do not falsely call it the original upload.

### L08 — P1 — Secondary-service quote context (remediated locally)

**Status:** fixed/tested locally on 14 October 2026; no live provider receipt or deployment. The following is original pre-fix evidence.

**Evidence:** service CTA builds `?service=graphic-design` and similar URLs; `app/request-a-quote/page.tsx` does not pass that service into the form. `components/InquiryForm.tsx:51` hardcodes `service: "website-development"`. The quote page still asks for website requirements when reached from graphic-design support.

**Required fix:** either validate and preserve the intended service throughout the page/form/WhatsApp/API, or deliberately send secondary-service visitors to a suitable contact path. Do not silently mislabel their enquiries. Keep website development the primary offer.

**Acceptance:** test each service CTA through to its generated brief/provider payload; the owner can identify what the visitor actually requested. Existing package-prefill still works.

### L09 — P1 before online lead collection — Privacy retention and admin acceptance are incomplete

**Evidence:** public privacy text says the owner must set a retention period; it does not state an actual adopted period/process. SQL and role gates are present but have not been tested against the real database. Existing admin implements password sign-in; no MFA challenge flow is present.

**Required work:** owner adopts retention/deletion and backup handling, verifies service providers and privacy notice against the chosen workflow, approves account access and backup/incident responsibilities. Have appropriate professional privacy/legal review; this report is not legal certification.

Apply/verify the actual table schema/RLS migration; do not assume `create table if not exists` upgrades a pre-existing table or removes unknown old policies. Test anonymous and ordinary-user denial, authorized admin read/update, session logout/expiry and revoked access. Use secure provider-account MFA; do not claim app-level MFA until implemented/tested. If launching WhatsApp-only, verify database/admin remain unavailable rather than turning on unused providers.

**Acceptance:** an actual retention policy and working deletion process; no public enquiry access; real role/RLS/permissions/session tests. No service-role key in frontend bundles. Document who can access WhatsApp/email lead history too.

### L10 — P1 — Abuse/resilience hardening (body limits/no-store fixed; remaining gates open)

**Current status:** bounded streamed JSON reads and sensitive response no-store completed locally. Trusted proxy/distributed limits/idempotency/host timeout acceptance remain open. The following is original pre-fix evidence.

**Evidence:** rate buckets are in-process, keyed from raw `x-forwarded-for`/`x-real-ip`; the origin guard accepts same-origin Fetch Metadata or forwarded host. Platform rewriting/trust has not been verified. Request body size is checked after `request.text()` has already buffered it. No enquiry idempotency key is used.

**Required work:** verify trusted proxy headers on the actual host; apply approved host WAF/distributed request and login limits; enforce a real bounded read/platform body limit rather than relying only on declared Content-Length; consider idempotent delivery so retries/timeouts do not create duplicate leads or messages. Check alerting when storage/email fails. Do not treat Origin/Fetch Metadata as bot authentication—raw HTTP clients can forge headers. This is hardening work, **not** proof that an attacker can bypass authenticated admin access.

**Acceptance:** real 429/retry behaviour across instances, oversized/chunked requests rejected safely, login abuse limits, timeout/retry cases and duplicate handling tested without exposing private records. Ask approval before paid stores/CAPTCHA/provider changes. Add explicit no-store protection to sensitive API responses as defence in depth; admin pages already returned private/no-store locally.

### L11 — P1 only if analytics/Ads are enabled — Consent needs configuration-specific review

**Evidence:** tags are off without account IDs. Code strips query strings/referrer queries from manual events and requires opt-in. However, “Allow analytics” also grants Google advertising user-data/personalization storage settings; the UI does not separately explain advertising consent. External GA enhanced-measurement defaults were not tested.

**Required work:** keep optional tracking off for the initial launch unless approved. Before enabling it, configure disclosure/consent to match the actual analytics/Ads purposes, disable automatic form/outbound data capture where needed and inspect payloads for personal data. Test consent rejection/withdrawal and storage-unavailable behaviour; do not assume configuration alone makes it private. A WhatsApp click is not a delivered enquiry or sale.

**Acceptance:** approved consent wording/settings and verified network events, with no names/phones/free-text/brief URLs. Declining tracking must not impair contact. No analytics account or production collection was verified here.

## 4. UX, offer clarity and portfolio recommendations

These are improvements, not reasons to invent more sections or postpone launch indefinitely:

- Keep the four-section homepage and early prices; do not restore the long demo-heavy layout.
- Differentiate Starter and Business more clearly in the agreed scope: both currently say multi-page. Owner must approve any page limits/CMS/revision/timing promises; do not invent them. Explain what the extra Business investment buys.
- Clarify the baseline E-commerce offer: catalogue-only versus cart/payment/merchant setup, product limits and recurring/provider charges. Do not imply every advanced store feature is included automatically at ₦300,000.
- Have a written proposal template for inclusions, content responsibilities, deposit, revisions, acceptance, cancellation/refund, handover, renewals and support. Site copy defers these to a contract; make sure the actual contract exists.
- Confirm the two phone numbers and who handles response/follow-up. A professional email is useful but optional for WhatsApp-first launch; do not create a fake address or change mailbox DNS without permission.
- Verify business/trading identity and any required disclosures. Do not invent an office address or claim a local branch from chat location alone.
- Keep one genuine StarXCO project. Add future 3–6 demos only when complete, clearly labelled, with actual screenshots, useful scope notes and tested features. Demo checkout must use test mode/dummy data, not accidentally take payments or store real sensitive records.
- Confirm testimonial/client-image permission before adding anything. No years, awards, client totals, rankings or results without evidence.

## 5. Fresh performance evidence

Isolated local production-server runs, default Lighthouse simulated mobile/desktop configuration, no enabled analytics tags. Browser tests were not running concurrently. These results apply to the current local site, **not** the old public deployment.

| Page / mode | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home / mobile | 97 | 98 | 96 | 66 | **2.504s** | 0 | 96ms |
| Home / desktop | 100 | 98 | 96 | 66 | 0.501s | 0.00009 | 0ms |
| Website development / mobile | 98 | 100 | 100 | 66 | 2.157s | 0 | 120ms |
| Quote / mobile | 97 | 100 | 100 | 66 | 2.416s | 0 | 85ms |

- Homepage mobile LCP is borderline/slightly above a 2.5s target in this single run. Recheck after the real image is installed; unoptimized external image weight is currently unknown.
- Home accessibility deductions map to heading/name issues; best-practice deductions include the blocked image request.
- SEO 66 reflects intentional local indexing exclusion, not a measured production ranking score. The actual public robots block is independently confirmed.
- Opportunities include unused/legacy JavaScript (roughly 27–52KiB unused by page), CSS/render blocking and forced reflow. Prioritize the real asset/contact issues before framework rewrites or chasing a perfect score.
- **Field INP was not measured.** TBT is a lab diagnostic, not INP. Production Core Web Vitals need real-device/field data, particularly Nigerian mobile networks.

A 320px-width homepage probe found no horizontal overflow. A 200% root-font-size probe at 780px also found no horizontal overflow, but produced a very tall narrow headline; improve reflow if manual testing confirms this is problematic. This probe is **not** actual browser-zoom/screen-reader certification. Real Safari/iOS/Android, keyboard/screen-reader, zoom, slow network and WhatsApp receipt remain manual acceptance checks. Verify the naira glyph on real devices; explicit NGN currently preserves currency clarity where the glyph is unavailable.

## 6. Original audit validation and coverage gaps (before L01 remediation)

| Check | Audit result |
|---|---|
| Fresh `npm ci` | Completed; dependencies restored |
| Lint / typecheck / production build | Passed |
| Unit/integration suite | 34 passed; provider checks mocked |
| Existing browser suite | 34 passed in 32.2s |
| Broader route/link audit | 19 sitemap pages: 200, one H1, unique titles/canonicals; 27 internal link URLs checked, no failures |
| Broader default axe audit | 19 pages checked; findings in L06 remain, so **not an all-rules pass** |
| Explicit experimental name rule | Confirmed project-link mismatch on home/portfolio |
| Native no-JavaScript form probe | **Failed privacy expectation:** synthetic fields entered URL |
| npm audit (all installed dependency types) | Zero info/low/moderate/high/critical advisories reported |
| Local headers | Nosniff, referrer/permissions policies and noindex present; admin pages private/no-store |
| Public production headers / TLS / DNS / account plan | Not independently audited through authenticated provider controls |
| Live receipt / live admin/RLS / provider billing | Not verified |
| Git whitespace check | Passed |

Security header configuration for HSTS and custom-host frame protection depends on a correctly configured HTTPS public origin. The current local default has no configured custom-host header scope; that is not proof of missing headers on production. Verify actual production responses, and review `includeSubDomains` implications before enforcement. Existing CSP is frame-ancestor protection, not a comprehensive script/content policy; additional CSP requires a tested design compatible with Next.js and any approved tracking.

Tests passing is not evidence that every rule, fallback, supporting page, production account or security control has been covered. No penetration-test or legal-compliance certification is claimed. No exhaustive credential-history inspection or production secret scan was performed.

## 7. Launch order and sign-off checklist

### Development — next focused fixes

- [x] L01: safe native/no-script form behaviour plus privacy regression tests — local only; production verification remains required.
- [x] L06 code findings: contrast, heading semantics, natural link names and contact landmark; expanded to all 19 routes/default axe plus targeted label rule.
- [ ] L06 manual acceptance: real screen-reader, actual browser zoom and real-device review; production verification.
- [x] L07 technical mitigation: intentional image-block removal while absent; guarded local import/responsive loading ready.
- [ ] L07 asset acceptance: owner supplies genuine permitted image; agent imports/checks actual local asset and owner approves visual result. Original-logo approval also remains.
- [x] L08: secondary-service intent carried through contextual CTA/page/form/WhatsApp/API/provider mocks — local only.
- [x] L10 local subset: bounded JSON reads for enquiry/login/update and no-store across sensitive API responses/framework errors.
- [ ] L10 remaining: verified proxy/host limits, distributed rate enforcement, duplicate/idempotent delivery and real timeout/retry/alerting acceptance.

### Owner / operations — before accepting enquiries

- [ ] Approve WhatsApp-only or online-delivery mode; actual receipt on a real phone/inbox/database and named responder.
- [ ] Approve eligible host plan/costs and the 12-month client domain/hosting offer, ownership/limits/renewals.
- [ ] Approve proposal/payment/support terms and actual privacy retention/deletion policy.
- [ ] If using online storage/admin: verify migration/RLS/non-admin denial/session handling, backups and provider account access.
- [ ] Keep analytics/Ads off unless their consent/data flow is verified.

### Publication — new authorized session

- [ ] Carry all modified/untracked work into the new session without reset/clean/data loss.
- [ ] Recheck existing GitHub/Vercel project/PR/current production branch through secure connections; no tokens in chat.
- [ ] Run tests, broadened accessibility and fresh image/performance/manual QA; review approved preview.
- [ ] Record release revision and previous working deployment for rollback.
- [ ] Set correct canonical origin and Production-only indexing flag, rebuild and approve promotion.
- [ ] Preserve DNS/nameservers/MX/SPF/DKIM/DMARC and unrelated subdomains; exact DNS/email changes need owner authorization.
- [ ] Verify actual-domain content, prices, image, WhatsApp/form receipt, redirects/404s, metadata/social image, robots/sitemap, HTTPS and admin exclusion.
- [ ] Verify Search Console/Bing through authorized accounts and submit the correct sitemap.
- [ ] Report exact deployed URL/revision, acceptance evidence and unresolved limitations. No “live” claim based solely on build success.

### After launch

Check delivered enquiries and indexing regularly, not just click counts. Monitor uptime/errors, renewals, backups, dependency advisories and privacy deletions. Add approved real/demo projects incrementally on the portfolio page. Record qualified leads, quotes and won work privately; do not call impressions or WhatsApp clicks sales.

## 8. Evidence and related files

Source pointers: `components/InquiryForm.tsx`, `ProjectCard.tsx`, `ProjectPreview.tsx`, `FloatingWhatsApp.tsx`, `AnalyticsConsent.tsx`; `app/services/[slug]/page.tsx`, `app/request-a-quote/page.tsx`, `app/api/`, `app/privacy-policy/page.tsx`; `lib/request-security.ts`, `lib/rate-limit.ts`, `lib/supabase/`; `config/business.ts`; `next.config.ts`; `supabase/migrations/202610100001_create_inquiries.sql`.

Regenerable ignored evidence: `artifacts/launch-dependency-audit.json`, `launch-extended-accessibility.json`, `launch-route-audit.json`, `performance-summary.json`, `lighthouse-*.json/html`, browser results/screenshots and `launch-home-200-percent-font.png`. The no-JavaScript probe reported field names only; no real lead data was collected.

See [short-site update](SHORT-SITE-UPDATE.md), [next-session handover](NEXT-SESSION-HANDOVER.md), [integration guide](INTEGRATIONS.md), and [deployment guide](DEPLOYMENT.md). This audit adds new findings and supersedes earlier assumptions that the narrower test suite meant launch acceptance was complete.
