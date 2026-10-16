# Growthly — complete next coding session handover

> **Owner answers received — 15 October 2026:** read [OWNER-DECISIONS-2026-10-15.md](OWNER-DECISIONS-2026-10-15.md) before older pending-decision notes. Owner confirms StarXCO portfolio use, primary WhatsApp 08129391626 and alternative 09162994183, current starting prices, owner-handled replies for now and launch go-ahead. Account setup needs step-by-step teaching; no cost/account/media-specific permission or unmentioned commercial/privacy terms are invented. Reply ownership is no longer undecided; VA access remains off. Approval does not mean deployment, and this closed session still cannot perform remote GitHub operations.

> **Latest launch preparation — 15 October 2026:** [owner's six approvals/checks](LAUNCH-OWNER-CHECKLIST.md), [technical execution handover](LAUNCH-EXECUTION.md), and [fresh evidence/limits](LAUNCH-PREPARATION-2026-10-15.md). Added redacted, non-activating `npm run launch:check` and an `audit:seo` command. Current checks: **291 unit/integration tests across 33 files; 95 default-mode browser checks; CMS editor/runtime browser tests 12+7 using isolated mocks; normal build, types/lint, 19-page SEO with zero findings and dependency audit with zero known vulnerabilities**. The four `project-assets/starxco*.webp` entries in the supplied patch were binary placeholders, not image data, and were excluded. No usable StarXCO image is present in this checkout; keep screenshot publication and `PROJECT_IMAGE_REVIEW_MODE` disabled. Earlier private-image reports in this handover are historical and do not describe this tree. CMS browser cases are mocked fixtures, not live-provider acceptance. Owner/account/deployment gates remain; use a new session for approved remote work. The normal CMS-off local preview is on port 3000; earlier process IDs/counts below are historical.

> **Latest authority — owner content editor (15 October 2026):** projects/images, contacts, key introductions, FAQs and three website starting prices are now editable at `/admin/content`, with private drafts, explicit publication/pricing approval, conflict protection and draft-only history restoration. Read the [setup/owner guide](CONTENT-MANAGEMENT.md) and [implementation evidence](CMS-IMPLEMENTATION-2026-10-15.md) **before older sections below**. Implementation is local; no real Auth account/migration/Storage/host activation or deployment was performed. `SITE_CMS_ENABLED=false` and **`ONLINE_INQUIRIES_ENABLED=false`** remain the safe defaults; CMS credentials do not activate lead collection. The admin role is broad owner-only access, never a VA assignment. Pending StarXCO media is not auto-approved. This session cannot perform remote GitHub operations; use a new coding session for approved one-time setup/deployment, then routine edits use the editor. Earlier project-in-code instructions, validation counts, process IDs and “no new admin features” statements are historical and superseded for this feature. Preserve the WhatsApp control without pause/play buttons.

**Earlier CMS implementation evidence (historical baseline):** 260 unit/integration tests across 32 files; 19 mocked CMS browser cases and 95 whole-site browser regressions passed; types/lint/CMS-on and CMS-off builds passed; 19-page SEO audit had zero findings. Isolated default-mode lab scores were Home 96 mobile/98 desktop, website 94, quote 98; accessibility/best practices 100. These are not live Supabase/field/deployment proof and are superseded for current test counts by the reconciliation summary above. See the implementation report for scope, limits and remaining live gates.

> **Latest owner correction:** remove the WhatsApp pause/play control. The control, state and CSS are removed; bounce is now two 1.8s cycles (3.6s), then stops. Drag/link/keyboard/reduced-motion/no-script behavior remains. Fresh types/lint/build/218 unit tests and 16 targeted browser regressions passed; the earlier full 95-check run predates this small change. Preview port3000 uses the rebuilt normal version. Do not restore the playback control from historical notes.

## Latest audit remediation and VA clarification — 15 October 2026

Read [AUDIT-FIXES-AND-OWNER-ACTIONS.md](AUDIT-FIXES-AND-OWNER-ACTIONS.md) and [VA-ONBOARDING-AND-PRIVACY.md](VA-ONBOARDING-AND-PRIVACY.md). Latest **218 unit/integration tests (25 files), 95 browser checks**, lint/types/normal production build passed. SEO:19canonical pages/zero findings. Internal crawl:109targets/zero errors. Dependency audit:zero known vulnerabilities. New Contact context journeys work at320/390/768/1440px and with scripts disabled. Main Contact actions now y371/y431 at390×900. AI casing/quote articles fixed; initial query/Suspense wrapper approach removed to preserve widget/no-script stability. One server-contextual widget renders on Contact/Quote, with layout widget suppressed there. Production-host frame protection remains, plus global object/base/form restrictions; preview still embeds.

**Owner's answers:** the owner handles enquiries/follow-ups for now. The VA has no access; any future VA workflow remains unapproved and requires a separate decision. NO assistant role/account/provider activated; existing admin is broad-access and must NOT be given to a VA. Negative auth tests enforce the existing admin-only boundary. Prepared meeting agenda/templates/access matrix/offboarding remain future proposals. No arbitrary retention period inferred. Customer-facing privacy copy is clearer; live governance still owner work.

Fresh normal-mode lab: Home mobile97/desktop98, development96, default quote97, Contact99, supporting pages96–98; A11y/BP100 all, mobileCLS0. Not field or public-deployment proof; no 10/10 claim. No actual receipt/deployment/remote/provider/DNS/email/campaign change. Screenshot permission still pending; normal build remains text-only. Current server port3000, normal build, process `growthly-improved-contact-previe-eb8988e0`. Closed-session remote restrictions unchanged. Owner still supplies approved proof/logo, live receipt, host/bundle/retention/VA decisions and new-session publication approval.


## Latest full audit — 15 October 2026

Read [FULL-WEBSITE-AUDIT-2026-10-15.md](FULL-WEBSITE-AUDIT-2026-10-15.md). Audit only, no application fixes/deployment/provider activation. Overall **8.0/10**, operational/paid-traffic launch readiness **5.5/10**. Fresh normal-mode build: **201 unit tests / 22 files, 87 browser checks**, lint/types/build passed; 19-page SEO zero findings; 96 internal link/anchor targets zero findings; both full and production-only dependency audits zero known vulnerabilities. Latest fresh normal-mode Lighthouse: Home mobile97/desktop98, website97, quote98; supporting ad pages98–99; A11y/BP100 all. Intentional noindex SEO66. These differ from earlier review-mode evidence and do not prove live/field performance. Normal preview runs on port3000; pending screenshot correctly unavailable.

**New unresolved findings:** AI page → global Contact loses service context, switching WhatsApp/quote links back to websites; Contact main WhatsApp y1116px/phone y1414px at390×900 (floating control is visible); AI helper/quote metadata blindly lowercase AI and can use an incorrect article. Also prioritise permission-cleared creative proof, real receipt/responder, retention/hosting/proxy acceptance and verified public release. Preserve full service sections and website-first hierarchy. See report for reproduction, priorities and acceptance. This audit did not fix these issues and is not a penetration test/legal/field/production certification. Closed-session remote restrictions remain.


## Latest visibility follow-up — supporting services appear early

The owner clarified via the follow-up question that the supporting services needed stronger Home/Services visibility. `components/ServiceGateway.tsx` now presents six clearly named canonical destinations immediately after the website hero on Home and near the top of Services. The website option is first, highlighted and labelled “Our main focus”; other services are explicitly standalone. A secondary native hero link jumps straight to this chooser. Full supporting-service sections remain below, and dedicated ad landings do not receive the mixed-service chooser.

No service prices, packages or campaigns changed. Each card links to the correct canonical page, not a generic website quote. The gateway is server-rendered with native links; no new tracking, widget or client framework.

**Latest QA:** 201 unit/integration tests across 22 files; 87 browser checks; lint/types/review build/diff passed; actual 19-page SEO audit zero findings; production dependency audit 0 vulnerabilities. New coverage verifies early section order, six destinations, one website-primary choice and the hero-to-chooser-to-AI-video journey at 320/390/768/1440px. Mobile/desktop chooser screenshots were inspected. Latest main-page synthetic performance: Home mobile 88/desktop 89, website development mobile 99, quote mobile 97; accessibility/best practices 100 on all four. Home LCP 2.463s, CLS 0, TBT 406ms; remaining blocking time stays a performance consideration. The standalone ad-page code is unchanged from its previous 97–99 lab checks; no fresh ad-page performance run is claimed for this follow-up.

The preview is rebuilt/running on port 3000. Public growthly.com.ng is not updated; do not send paid traffic to unpublished paths. Closed-session remote/publication limits and all permission, hosting, delivery/provider/retention, analytics and device/AT gates remain unchanged.


## Latest authority — website-first, not website-only; separate ad destinations

Owner requested full separate sections for the other services and direct URLs for service-specific ads. Read [SERVICE-AD-LANDING-PAGES.md](SERVICE-AD-LANDING-PAGES.md) first for the current route map, contact flow, validation and advertising cautions.

Canonical destinations: website `/website-development`; design `/graphic-design`; AI video `/aiads`; social `/social-media`; campaigns `/ads-promotion`; automation `/ai-automation`. Old `/services/<slug>` URLs permanently redirect. Five canonical URLs replace the old five, so the sitemap still has 19 unique public routes. Home/Services now have five full separate supporting-service sections. Website development remains the primary homepage offer; other services can be commissioned independently.

Header/hero/scope/closing CTAs and WhatsApp messages match the advertised service. `StartProjectLink` now honors labels and derives appropriate defaults from the lightweight service map. On the quote page, the header links to the existing brief rather than reset to website work. An explicitly labelled footer website link still allows a deliberate service change. Video production and paid campaign support are clearly distinguished, with media spend separate. No secondary-service prices or fixed turnaround were invented. Website prices/offer remain unchanged; navigation says Website Pricing.

Core changes: `config/service-pages.ts`, `config/service-marketing.ts`, `components/ServiceLandingPage.tsx`, `components/SupportingServiceSections.tsx`, allowlisted `app/[servicePage]/page.tsx`, legacy redirect route and aligned sitemap/client public identifiers. Existing opt-in analytics can identify new service pages only after approval/consent; no tag/campaign activation. Native offscreen rendering hints reduce Home/Services painting without removing HTML or accessibility. The floating-contact observer only watches relevant direct body-child changes, preserving the consent-banner protections.

**Current verification:** 199 unit/integration tests (21 files), 86 browser checks, lint/types/review build/diff passed; real 19-page SEO audit zero findings; production dependency audit 0 vulnerabilities. Tests cover all canonical destinations, context through every contact/form path, 320/768/1161/1440px reflow, legacy 308 redirects, no-script native disclosures/anchors, accessibility and all prior privacy/permission/WhatsApp safeguards. Full browser reruns need a fresh local server because deliberate abuse tests can exhaust the persistent in-process limiter; do not disable or weaken it.

Latest ad-landing mobile Lighthouse: AI video 98, design 99, social 97, promotion 98, automation 98; A11y/BP 100, CLS 0 all. Latest Home mobile 89/desktop 88, main website service/quote mobile 98; home blocking time remains a tuning consideration. These are synthetic review runs, not field or conversion guarantees. Review SEO 66–69 remains intentionally noindex. Evidence is in ignored `artifacts/service-landings-*`, actual SEO audit and inspected landing screenshots.

**Not public yet:** the preview is rebuilt/running on port 3000. Do not send paid traffic to the public short URLs until an actual approved deployment/contact acceptance. No GitHub, deployment, DNS, paid provider, campaign or live enquiry receipt operation occurred. Publishing requires a new coding session. All existing permission, hosting, provider/retention/security and manual device/AT launch gates remain. New real projects are still for the owner to supply.


## Latest follow-up — deeper buying information, owner clarified the new preview still lacked depth

The owner selected “The new preview still needs more depth”. The response adds concrete capability/task/scope explanations (four on Home; six main, five business and six e-commerce on the dedicated pages), handover/account/renewal/support responsibilities, shared project roles on About, a clearly labelled adaptable first-contact message, full supporting-service deliverables/best-fit/working-style/boundary details, a seven-point written-proposal checklist and guidance for using independent references. No new client project, scope/price increase, provider activation or conversion promise.

New reusable content: `config/website-capabilities.ts` and `components/WebsiteCapabilities.tsx`. Longer descriptive links wrap instead of widening mobile grids; intrinsic grid sizing was repaired rather than hiding overflow. Tests exercise the expanded information at 320/768/1440px and retain all accessibility/privacy/permission protections.

**Latest QA supersedes prior totals:** 187 unit/integration tests across 20 files; 77 browser checks passed; lint/typecheck/review build/diff checks passed; actual 19-page SEO audit has zero findings; production dependency audit 0 vulnerabilities. Preview is rebuilt/running on port 3000. Not deployed to growthly.com.ng.

**Performance caveat:** do not reuse the previous home 98 score as the score for this deeper version. Two new local runs gave home mobile 89–92, desktop 86–90; main service mobile 97–98 and quote mobile 98. Accessibility/best practices stayed 100; home mobile CLS stayed 0 and LCP ranged 2.463–2.533s. Extra home blocking time is a follow-up performance consideration; these lab runs do not establish the cause or field impact. Preserve the newly requested substance rather than cutting it back to meet a score. Detailed evidence is in ignored `artifacts/deeper-content-*`, fresh screenshots, social audit and Lighthouse reports.

The saved research principles remain applicable: useful tasks, truthful company information, transparent scope and native disclosure, not arbitrary features. External references remain clearly independent and new real projects are still for the owner to supply tomorrow. All launch gates/default-off integrations remain unchanged.


## Latest direction — fuller professional website (14 October 2026)

**The owner explicitly reversed the compact-site direction.** Preserve the fuller redesigned homepage, substantive About/Contact/Services/Our Work/Industries pages, stronger headings and spacing, full package/process/FAQ detail, native section navigation and no-script package-fit guide. Read [FULLER-WEBSITE-RESEARCH.md](FULLER-WEBSITE-RESEARCH.md) for the research/decisions and [ADDING-REAL-PROJECTS.md](ADDING-REAL-PROJECTS.md) for tomorrow’s genuine additions. This takes precedence over historical instructions below to keep the site short or avoid an authorised redesign.

StarXCO remains the sole Growthly project. Paystack, IKEA and Lagos Business School are explicitly **independent inspiration, not Growthly clients or affiliations**; no copied assets/embeds, results or enterprise-scope promises. Cards and case studies use actual configured project fields. Keep approved Starter ₦100,000 / Business ₦200,000 Recommended / E-commerce ₦300,000, multi-page Starter, first-year .com.ng/hosting offer and separate-cost disclosures unchanged.

SEO: unique metadata, visible/matching structured breadcrumbs, correct H1/H2/H3 hierarchy, explicit shared Open Graph/Twitter brand image, deduplicated canonical sitemap paths from real content and one shared indexing gate for robots/meta/HTTP headers. `scripts/audit-public-seo.mjs` checks actual responses. Pending review imagery and all preview/development builds remain non-indexable, even with an inherited launch flag. No fake address/reviews/FAQ-rich-result claim.

**Final validation:** typecheck, lint, review build, **182 unit/integration tests (19 files), 76 browser tests**, actual 19-page SEO audit with 19 unique titles/descriptions and zero findings; brand sharing image HTTP 200; production-dependency audit 0 vulnerabilities; diff check passed. Browser coverage includes all public-route accessibility scans, mobile/tablet/desktop reflow, keyboard/no-script guide, package/type quote prefills, external-reference separation and prior privacy/image/WhatsApp safeguards. An initial Pricing heading-order issue and child-page social-image omission were found and fixed, then rechecked.

Final local Lighthouse: home mobile **98**, home desktop **96**, website-development mobile **98**, quote mobile **98**; accessibility/best practices **100** on all four. Mobile-home LCP **2.457s**, CLS **0**, TBT **25ms**. These are synthetic review runs, not field performance/conversion guarantees. SEO 66–69 is expected while this private review is blocked from indexing. Regenerable evidence lives in ignored `artifacts/redesign-*`, `public-seo-audit.json`, performance reports and screenshots.

Meaningful research/implementation/validation ran from the recorded **16:39:35 UTC** checkpoint through **17:13:38 UTC** and subsequent visual/handover review—more than 34 minutes, with no idle timer. Preview updated locally on port 3000 with private image-review mode. **Not deployed to growthly.com.ng.** No remote GitHub, paid provider, DNS change, live enquiry delivery or production indexing was performed. Previous launch/permission/provider/retention/hosting/device-AT gates remain; preserve all default-off safeguards and the authentic pausable WhatsApp icon. New publication work requires a new coding session.

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

## Current screenshot status — this checkout

The supplied patch contained four `project-assets/starxco*.webp` entries identified as binary placeholders, not image data. Those entries were excluded from both compatibility checking and application. No usable StarXCO image bytes are present in this checkout, and no screenshot has been published. The image manifest keeps `permissionConfirmed: false`; keep `PROJECT_IMAGE_REVIEW_MODE=false`, with normal and preview outputs text-only. The owner has approved presenting StarXCO as portfolio work, but that approval does not confirm screenshot-specific rights. Do not treat earlier reports of a 76,444-byte private WebP or successful review-mode image loading as evidence for this tree.

The guarded `/review-media/` route and its no-store/noindex controls remain in the code, but with no real image the route returns 404. Do not turn on review mode or import/publish a screenshot until a valid image asset is supplied and screenshot-specific permission is clear. At that point, follow the approved handoff process, test actual bytes and visual fit, and obtain a separate visual approval before any release. Original Growthly-logo approval remains a separate gate.


Updated 14 October 2026. Repository: `kayodeoluwadarasimijoshua-prog/Growthly`.

## 1. Read this first: preserve the latest work

**Launch-gating audit:** read [PRE-LAUNCH-AUDIT.md](PRE-LAUNCH-AUDIT.md) first. **L01 was subsequently fixed/tested locally on 14 October 2026**, following owner approval to address that first finding only. Preserve the explicit native POST safety action, hydration-gated hidden/disabled controls, plain WhatsApp/phone fallback, body-ignoring fixed 303 redirect and truthful not-sent feedback. The stricter no-referrer rule must remain after the global Next.js header rule. Latest QA: lint/typecheck/build, **38 unit/integration and 39 browser tests passed**; no-JavaScript layout checked at 320/390/1440px. Tests cover disabled/blocked/delayed scripts and forced native submissions; no live receipt or deployment. **L06/L08 have now also been remediated locally:** accessible supporting-hero links/focus, correct headings, natural project-link names and named WhatsApp landmark; service-specific quote copy/metadata and validated context through every contextual CTA, WhatsApp, API and provider mocks. Supporting services use empty website_type/custom package without website-only questions; website enquiries still require a type and retain package prefill. Unknown/duplicate service links show a notice/Services link. Latest QA is **63 unit/integration and 56 browser tests passing**, with default axe plus targeted label-name checks on all 19 sitemap routes. Preserve these changes/tests. Real screen-reader/browser-zoom/phone acceptance, retention/hosting/delivery and older public deployment/crawl blocking remain unresolved. Passing tests is not full launch acceptance; audit Lighthouse results are historical local measurements, not new post-fix or production field results.

**Latest image override (14 October):** owner authorized the agent’s reliable-image work and asked for their own responsibilities. External hotlink/failure panel removed; project is deliberately text-only until a genuine permitted image is supplied. Strict local manifest + `prepare:starxco-image` tooling and responsive local loading are ready. Do not restore the hotlink or fill the portfolio with a synthetic fixture. Read [PROJECT-IMAGE-HANDOFF.md](PROJECT-IMAGE-HANDOFF.md): owner supplies image/permission/kind; agent imports/tests actual loading and seeks visual approval. Latest QA is **74 unit/integration and 56 browser tests passing**, plus lint/typecheck/build. Asset loading after actual upload and original-logo approval still remain.

**Latest owner override:** remove all demos and Daily Life Review. StarXCO is now the only public project and appears once on the homepage, alongside the hero. Homepage has four intent-led sections and compact packages, with three steps/FAQs. Mobile-menu quote text is white; spacing and excessive padding are corrected. See [complete short-site update](SHORT-SITE-UPDATE.md). This decision supersedes older “preserve concepts/Daily Life Review” instructions. The earlier front-image hotlink has now been removed (see image override above); original photo/screenshot bytes still need the owner’s upload. Do not claim an installed/captured image.

The current coding session is **closed for remote GitHub operations**. The latest project/logo/CTA and pricing/SEO changes exist locally; this session has not pushed them, opened a new PR, or deployed them. Start a new coding session using Arena’s secure GitHub connection. Do not paste GitHub/Vercel tokens, passwords or service keys into chat.

This workspace is `/home/user/Growthly`, on `arena/c8310713-growthly`. It contains substantial modified **and untracked** source files. Do not reset, clean, overwrite the checkout, or discard files. Before moving into another session, confirm that the complete local state (including new routes, components, config, tests, docs and brand assets) is carried over. If it is not, import the changes securely before coding. A remote clone alone may not contain this work. Use the branch assigned by the new session, not an arbitrary branch or direct push to main.

Inspect `git status --short`, `git diff --stat`, and source files first. Review and stage intended changes explicitly; avoid blindly staging secrets, browser artifacts, or generated output. An older PR/deployment is historical evidence, **not** proof that current work is published. Check its actual current status in the new session rather than assuming it is still open.

**Priority:** preserve work → verify owner details/logo → validate enquiry mode/security → review hosting and preview → production approval → publish and verify → indexing/Search Console → ongoing SEO. Work incrementally, one focused change at a time. No broad redesign.

## 2. Approved business decisions — do not undo

- Primary offer: website development for Nigerian businesses. AI video, graphic design, social media and digital ads remain secondary.
- Keep the existing Next.js App Router / React / TypeScript stack, useful existing admin, custom CSS and optional Supabase/Resend integrations. Do not add a CRM/authentication system or rewrite the framework without approval.
- Colours: green `#0F9D6B`, charcoal `#101820`, white, pale green `#DDF5E9`, neutral `#F3F5F4`. No return to blue/navy/gold, excessive gradients, glassmorphism, fake dashboards or excessive animation.
- Homepage headline: **YOUR BUSINESS DESERVES MORE THAN JUST SOCIAL MEDIA.** Supporting copy: “Get a professional website that helps customers discover your business, explore your products or services, and contact you with confidence.”
- Closing headline: **READY TO GIVE YOUR BUSINESS A STRONGER ONLINE PRESENCE?**
- One consistent marketing action: **Get a Website Quote**, centrally configured at `business.primaryCTA`. Repeated quote buttons are permitted; do not reintroduce competing sales CTAs. Ordinary navigation, project links and essential form operations remain functional. The owner subsequently approved a **draggable floating WhatsApp contact icon** as an explicit exception/additional contact shortcut. They selected **WhatsApp button only**; do not add an AI/FAQ chat widget without a new request.
- Primary WhatsApp: **08129391626**, international link `https://wa.me/2348129391626`. Alternative telephone: **09162994183**. Do not invent email/social addresses.
- Never invent client counts, years, reviews, awards, guaranteed leads/rankings, or project results.

### Owner-approved starting prices

| Website package | Starting design/development price |
|---|---:|
| Starter Website | **₦100,000** |
| Business Website | **₦200,000** |
| E-commerce Website | **₦300,000** |

The owner revised and explicitly approved these lower starting amounts. Starter is a **multi-page website**, not a single-page package; the page list is agreed in writing. **All three packages include one free .com.ng domain and free hosting for the first year**, confirmed via the follow-up questions. Domain availability, hosting limits and account ownership are confirmed in the proposal. Domain and hosting renewals after year one are charged separately, with prices and responsibility confirmed in writing before commitment. No renewal amount, hosting provider, unlimited hosting or lifetime-free service has been promised. They are not fixed final quotes, approved page counts, turnaround promises or revision allowances. Final scope, applicable taxes, availability, deposit/payment schedule and cost must be confirmed in writing. **Content creation, maintenance, business email, paid tools/payment-provider charges and other third-party costs are separate unless the proposal includes them.** The first-year .com.ng domain/hosting bundle is included; later renewals are separate. No payment is taken on the site.

Prices are centralized in `config/business.ts` (`priceValue`, derived `price`, `websitePriceSummary`, `websiteHostingOffer`). Homepage, development, business, e-commerce and pricing pages use the shared PackageGrid. Website/service FAQs and pricing metadata use central values. Package cards also show **NGN** explicitly so currency remains clear on devices without the naira glyph. Visitor budget preferences are not price quotations. Future price edits must update the central values and tests, not several copies of text.

## 3. Already implemented locally

- Website-first homepage; development, business and e-commerce sales pages; industries, portfolio, pricing, about, contact, quote, privacy policy and terms pages; genuine 404.
- Legacy redirects for work, old case-study paths, privacy, start-project and website-development service route; start-project preserves query parameters.
- **Only StarXCO remains public** (`/portfolio/starxco`, external `https://starxco.com.ng/`). Daily Life Review and all three demo records/artworks are removed, with genuine 404s and sitemap removal. Portfolio has one card; homepage uses it once in the hero, not again in a work section.
- The real homepage-photo URL is configured centrally: `https://starxco.com.ng/assets/img/hero.jpg`. This is a photo, not a full website screenshot. Sandbox network blocks it, so local screenshots show the honest fallback. Capture/download an authorized real screenshot/photo in a permitted next session or obtain a supplied file, then optimize/store it locally for reliable availability. Do not fabricate one. Public StarXCO copy was fetched; external enquiry delivery/results were not tested.
- Supplied chart/arrow logo reference rendered as scalable SVG, with dark/light versions, favicon and social artwork. **The original PNG/PDF files were unavailable. This is a disclosed rendition, not the exact uploaded artwork.** The owner subsequently supplied visible white/dark versions named `Untitled design (2).png` and `Untitled design (1).png`; their reported `/home/user/uploads/` files were still absent. The SVG proportions, bar shapes, arrow and corner radii were updated from those references, including favicon/social artwork. Check whether the originals become accessible before asking for another upload; then replace only the relevant assets with correctly licensed optimized versions. Preserve shape and appropriate contrast; no invented logo redesign.
- Honest quote validation and WhatsApp handoff; optional server-side storage/email; server-side validation, origin/body limits, consent, honeypot and basic rate limiting; consent-gated analytics disabled without configuration.
- SEO metadata, canonical URLs, sitemap, robots, social previews, truthful Organization/WebSite/Service/Breadcrumb schemas and preview noindex controls. Core page titles are now absolute to avoid duplicated brand suffixes.

## 4. SEO work and important keyword map

These are **proposed search-intent targets**, not measured search volumes, keyword difficulty findings, or ranking promises. `config/seo.ts` holds core-page metadata and target phrases. Phrases are used naturally in metadata, relevant headings and helpful copy, not stuffed into every paragraph. No obsolete meta-keywords tag has been added.

| Page | Primary intent/keyword | Supporting phrases |
|---|---|---|
| `/` | website design in Nigeria | website development in Nigeria; website design for small businesses |
| `/website-development` | website development in Nigeria | web development services Nigeria; website redesign Nigeria |
| `/business-websites` | business website design Nigeria | website development for small businesses; small business website design Nigeria |
| `/ecommerce-websites` | e-commerce website development Nigeria | online store website design Nigeria; ecommerce website design Nigeria |
| `/pricing` | website design prices Nigeria | cost of a website in Nigeria; website development packages Nigeria |
| `/industries` | industry-specific website design | website design for schools; real estate website development; retail website design |
| `/portfolio` and real case studies | Growthly projects and relevant project names | StarXCO website project |

### What has improved in this update

Core titles and descriptions are unique and Nigeria-focused. Service eyebrows and development H1 reflect page intent. Industry headings are more specific. Pricing has real starting prices, consistent cost FAQs and a helpful **“What affects the cost of a website in Nigeria?”** section, with one-time versus recurring charges separated. Organization and WebSite schema use stable IDs, publisher linkage and the actual brand asset. Pricing/industry/portfolio/case-study breadcrumbs describe real routes. Existing Service and breadcrumb data remain on development pages.

`SITE_INDEXING_ENABLED=true` alone cannot enable Vercel **Preview** or **Development** indexing: metadata, robots.txt and X-Robots-Tag also check `VERCEL_ENV`. Default/local builds remain intentionally noindex. This is a search-safety measure, **not** access control; authentication and database permissions must still protect private data.

### Next SEO actions, in order

1. Confirm `https://growthly.com.ng` is the approved final canonical origin, existing Vercel project, production branch and www/apex policy. Preserve current host/mail/DNS. Set `NEXT_PUBLIC_SITE_URL` to the approved origin, not a temporary preview URL.
2. After production approval, set **Production only** `SITE_INDEXING_ENABLED=true` and rebuild. Keep Preview false; verify all three indexing controls on actual production responses. Do not launch with accidental public-page noindex/disallow-all.
3. Verify actual-domain canonical tags, distinct titles/descriptions, one H1, final redirect destinations, status codes, rendered content, sitemap URLs and social image. Exclude private/API/admin routes from sitemap and indexing. Validate schemas with external validators; no fake Product/review/FAQ rich-result claims.
4. Through owner-authorized Search Console/Bing access, verify the correct property and submit `/sitemap.xml`. Existing HTML settings: `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`. DNS verification needs explicit approval and must preserve mail records. Use URL Inspection and indexing reports; submission does not guarantee immediate indexing.
5. Research actual search demand with authorized Keyword Planner/Search Console or another approved tool. Check query intent, competing results and real commercial fit before changing the map. Differentiate general services, SME sites, stores and price comparison; avoid multiple near-identical pages competing for one phrase.
6. Confirm business location/service area before targeting “website design in Ibadan” or “web developer in Oyo State”. The owner’s approximate chat location is **not** proof of a public office/address. Do not invent local listings, addresses, maps or doorway city pages. If eligible and authorized, complete a truthful Google Business Profile separately.
7. Plan useful owner-approved content: website cost breakdown; business website versus social media; online-store requirements; domain/hosting ownership and recurring fees. Use genuine expertise/examples, relevant internal links and original illustrations; do not bulk publish thin AI location posts. No blog route or automatic article generator has been added.
8. Obtain permission for actual screenshots and fuller real case studies: brief, scope, design decisions and tested functionality. Add only verified outcomes. Request real reviews with consent; do not fabricate them or buy backlinks.
9. Measure indexed pages, impressions, useful queries, organic visits, qualified enquiries and sales. Refine content from real data over time; no page-one guarantee or promised timeline.

## 5. Enquiries, privacy and security — launch-critical

**Latest contact shortcut:** floating WhatsApp icon uses the central approved number, on public pages only (hidden on `/admin*`). Pointer/touch dragging stays within viewport bounds and does not open WhatsApp; ordinary click/Enter opens the prefilled WhatsApp link in a separate tab. It saves only `{x,y}` locally under `growthly_whatsapp_position`, works without storage, reclamps on resize and stays above the analytics consent banner. Focus + arrow keys move it; Shift increases the step; Home resets it. Its position never enters analytics, and actual contact-click events still require analytics consent. Privacy text discloses this local preference. Five added browser checks cover drag/persistence, keyboard/reset/resize, mocked-link activation, blocked storage/admin exclusion, and touch/consent avoidance. Browser link tests mock the external handoff, not phone/message receipt. Mobile/desktop screenshots were inspected. No AI service, chat widget, secret or paid integration was added. The owner selected WhatsApp-only.


**No configured provider:** validation prepares a WhatsApp brief. The visitor must open WhatsApp and press Send; the site says **not yet sent**. This is a usable fallback, not automatic online delivery. Before launch, owner must test actual receipt from a real phone and approve this mode. Do not call a click a delivered lead.

**Online delivery option:** use owner-approved Supabase and/or Resend settings from `.env.example` and `docs/INTEGRATIONS.md`. Admin login additionally requires Supabase public/anon settings. Keep `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and other secrets server-only in secure provider environment settings, never Git/chat or `NEXT_PUBLIC_*` fields. Distinguish Preview and Production configuration. Do not change email services or sender DNS without permission.

Acceptance tests must submit an authorized test enquiry, confirm private database/inbox receipt, verify error/retry behaviour, notification fallback and authorized admin access, then delete test data. Provider acceptance alone does not prove inbox delivery. Existing provider tests use mocks; no live receipt/RLS acceptance has been performed here. Check database schema, RLS and unauthorized access, retention/deletion rules and privacy text against the actual selected workflow.

In-memory rate limiting is per instance and resets; it is not distributed protection for a Vercel campaign. Evaluate host WAF or approved shared limits, validate trusted proxy/IP behaviour and watch abuse without logging private briefs. Ask approval before paid services or CAPTCHA/shared-store integrations. Keep legitimate quote users and fallback working. Review admin session cookies, origin checks, headers and noindex/authentication separately.

Optional GA4/Ads load only after consent. Keep form names, emails, phone numbers, free-text briefs and query strings out of analytics. Verify network payloads before enabling tags; disable automatic form/outbound enhanced measurement where needed. `generate_lead` represents confirmed online acceptance, not an unsent WhatsApp brief. Declining analytics must not break navigation/forms. No analytics account or revenue claim is currently verified.

## 6. Hosting, publication and rollback

Retain the existing Vercel Git integration unless the owner approves a change. Next.js server endpoints mean static export/GitHub Pages is not equivalent. Verify current commercial-plan eligibility and billing: historical Vercel research found Hobby non-commercial and Pro starting at $20/month USD; **recheck current terms/prices** before decisions. No purchase/plan change has been made. Never assume free unlimited hosting or convert costs to fixed naira promises.

In the new session, inspect actual GitHub PR/checks and Vercel project state using authorized tools. Review the complete preserved patch, run QA and create the authorized preview/PR using that session’s assigned branch. A historical protected Vercel preview for `55db631` does not contain all current updates; deployment success is not runtime verification. If protected, the authorized owner must test while signed in; do not bypass protection.

Promote only after owner approval and delivery/security/QA checks. Preserve nameservers, MX/SPF/DKIM/DMARC and unrelated subdomains. No DNS/email migration is authorized. If changes are necessary, record current records and get approval for precise changes. Check HTTPS and apex/www redirects on production.

Before publishing, record the last good deployment and rollback instructions. Prefer Vercel’s previous successful deployment if rollback is needed; preserve compatible database changes and never revert DNS casually. Immediately repeat real-domain route, quote, phone, indexing and security checks after publication/rollback.

## 7. Files to read/edit

| Area | Main files |
|---|---|
| Business, phones, CTA, approved prices | `config/business.ts` |
| Keyword map/core metadata | `config/seo.ts`, `lib/seo.ts` |
| FAQs, industries, website types | `config/websites.ts`, `config/content.ts` |
| Shared packages/service pages | `components/PackageGrid.tsx`, `components/WebsiteSalesPage.tsx`, `components/WebsiteSections.tsx` |
| Main pages and the genuine StarXCO project | `app/`, `components/ProjectPreview.tsx`, `components/ProjectCard.tsx` |
| Brand rendition | `components/GrowthlyMark.tsx`, `components/Brand.tsx`, `public/brand/`, `app/icon.svg`, `app/opengraph-image.tsx` |
| SEO/indexing | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `next.config.ts`, `components/BreadcrumbSchema.tsx` |
| Form/delivery/security | `components/FloatingWhatsApp.tsx`, `lib/floating-contact.ts`, `components/InquiryForm.tsx`, `app/api/inquiries/route.ts`, `lib/inquiries.ts`, `lib/leads.ts`, `lib/request-security.ts`, `lib/rate-limit.ts`, `lib/supabase/` |
| Analytics | `lib/analytics.ts`, `lib/attribution.ts`, `components/AnalyticsConsent.tsx` |
| Configuration/QA | `.env.example`, `tests/`, `playwright.config.ts`, `scripts/` |

Read README, `docs/INTEGRATIONS.md`, `docs/DEPLOYMENT.md`, and `docs/PROJECTS-LOGO-CTA-UPDATE.md` for detail. **This document supersedes** older handover quote-only prices, original-logo claims, QA totals and remote-status assumptions. Historical reports are not current deployment/performance evidence.

## 8. Validation and exact current limitations

Latest local validation after image preparation: **lint passed; typecheck passed; 74 unit/integration tests passed; production build passed; 56 browser checks passed.** Eleven image/tooling tests use synthetic/check-only fixtures, not portfolio assets. Regression cases cover native-form privacy/hydration/contact/headers, each supporting-service CTA and generated brief, mocked storage/email service identity, image-loaded/failed link names, keyboard/focus/hover contrast, invalid/duplicate queries and same-document context reset. Browser suite includes prices on five sales routes, navigation/form/API/redirects/SEO checks, 390/768/1440px routes and overflow, 19 public-page default axe checks plus the explicit experimental label-name rule and open mobile-menu check, sole-project/removal/404 checks, four-section hierarchy, CTA spacing and mobile-menu colour, expandable pricing terms, logo and image success/failure states. Photo success uses mocked bytes; actual remote photo loading is blocked in this sandbox. Home/pricing desktop/mobile and menu screenshots were visually inspected; artifacts are ignored and should be regenerated, not committed.

Dependencies were initially absent after sandbox resume; `npm ci` resolved the missing-eslint failure. No source lint failure remains. Automated checks are not manual screen-reader or real-device certification. The subsequent pre-launch audit has fresh local Lighthouse evidence (see PRE-LAUNCH-AUDIT.md); it is not production field data. Earlier historical scores predate the changes. Re-run independently after the audit fixes and production launch.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
# Start the production server on 0.0.0.0 (process tool for long-lived preview):
npm start
# Separate command with server running:
npm run test:browser
node scripts/measure-performance.mjs
```

Node 22 recommended. The included browser preparation uses npm-packaged Chromium for restricted environments; adapt executable paths on other operating systems. Browser/artifact outputs and node_modules are ignored. Do not run Lighthouse concurrently with browser tests when comparing lab performance. Test public preview URLs through the actual browser; browser API calls must stay same-origin, never sandbox localhost URLs. Add manual keyboard, focus, screen-reader, 200% zoom, slow-network and real Android/iPhone checks, including naira/currency display, menu, WhatsApp and all quote states.

### Publication acceptance checklist

- [ ] Entire local patch and untracked source carried forward; owner changes preserved.
- [ ] Owner confirms phone, approved starting prices/exclusions, written scope policy and logo-original availability.
- [ ] First-year domain/hosting provider, commercial eligibility, limits, domain ownership and renewal policy approved; no actual domain registration/hosting purchase has occurred here.
- [ ] Chosen delivery mode approved and tested by actual receipt; failure mode remains honest.
- [ ] Server secrets/admin/database permissions/retention/abuse controls reviewed.
- [ ] Correct existing host/project, eligible plan and costs approved; no unauthorized DNS/mail change.
- [ ] Lint/typecheck/unit/build/browser plus fresh visual/manual/performance checks pass; limitations recorded.
- [ ] Approved preview/PR contains newest work; owner authorizes production release; rollback recorded.
- [ ] Production pages, project links, redirects, images, quote and contact tested on actual HTTPS domain.
- [ ] Production canonical/sitemap/robots/meta/header indexing agree; preview/admin remain excluded.
- [ ] Search Console/Bing verification and sitemap submission completed through authorized access.
- [ ] Optional analytics checked for consent and no personal-data leakage.
- [ ] Final report lists actual commit/deployment URL, tests, delivery evidence, costs, blockers and what remains undone; no unsupported “live” claim.

## 9. Follow-up after launch

Weekly initially: test receipt, check crawl/indexing errors, broken links and genuine enquiry quality. Monthly: dependency audit/patches, domain/hosting renewals, backups, deletion policy, real portfolio updates and Search Console query review. Make small approved content improvements from actual customer/search questions. Seek owner approval before articles, location pages, paid SEO tools, hosting upgrades, advertising or new integrations.

Use [NEXT-SESSION-PROMPT.md](NEXT-SESSION-PROMPT.md) for a short copy/paste starting instruction.
