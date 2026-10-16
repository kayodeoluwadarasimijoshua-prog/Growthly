# Growthly — full website audit and scorecard

> **Subsequent implementation:** see [audit fixes and remaining owner actions](AUDIT-FIXES-AND-OWNER-ACTIONS.md). The scores and findings below describe the audit baseline; Contact/context/copy/header fixes have since been implemented/tested (218 units, 95 browser checks). Owner/live/permission gates remain, and no 10/10/publication claim is made.

**Date:** 15 October 2026
**Overall grade: 8.0/10.** A professionally structured website with strong service separation and local engineering evidence, but unfinished commercial proof and launch acceptance. **Paid-traffic launch readiness: 5.5/10.** This second score reflects unverified release, receipt and operational gates, not a claim that the public site is broken.

## Scope and limits

This audit covers the latest saved Growthly source, a fresh **normal-mode production build**, local HTTP responses, automated browser tests, nine fresh Lighthouse measurements and targeted screenshot/journey inspection. It is not a fresh public-domain audit of growthly.com.ng. External destinations, public deployment, production hosting accounts, inboxes, WhatsApp receipt, live database permissions and search performance were not independently verified. No real customer data, real enquiry or external message was submitted.

The normal build intentionally excludes the permission-pending StarXCO screenshot. It is appropriate for assessing the current release-default behavior, not evidence that a media-rich future release will perform identically. Previous review-mode performance numbers are historical/different-build evidence. This audit changes documentation only; it does not remediate the issues below or activate deployment, providers, analytics, campaigns or paid services. Existing uncommitted work is preserved.

Scores are an editorial assessment, not a certification or measured conversion result. Weighted areas total 100%; the weighted grade is exactly 8.0/10.

## Scorecard

| Area | Grade /10 | Weight | Assessment |
| --- | ---: | ---: | --- |
| Visual identity and design | 8.5 | 10% | Consistent green/charcoal palette, clear typography, restrained components. Text-only production hero lacks approved visual proof. |
| Service clarity and ad-page architecture | 9 | 10% | Websites remain primary; all five other services have full sections and canonical destinations. AI production and campaign support are distinguished. |
| Content and scanability | 7.5 | 10% | Substantial and honest scope guidance; repeated explanations and long mobile pages increase reading effort. |
| Enquiry and conversion journey | 8 | 10% | Correct primary service-specific CTAs and form context; Contact detour loses that context and main contact actions appear too late. |
| Trust and portfolio evidence | 6.5 | 15% | One genuine website project; limited approved visual evidence for the additional advertised services. No invented testimonials or results. |
| Responsive usability | 9 | 10% | Tested narrow/wide layouts and service selection; no overflow in the targeted fresh inspection. Real iOS/Android acceptance remains. |
| Accessibility | 9 | 5% | Automated all-page checks, labels, keyboard/no-script and reduced-motion safeguards; manual assistive-technology testing still required. |
| Technical/on-page SEO | 8.5 | 10% | Unique metadata, canonical paths, sitemap and internal links validated. Indexing and organic competitiveness are not verified. |
| Performance | 8.5 | 10% | Fresh normal-build lab performance is strong; no field INP/Core Web Vitals evidence and no future-media guarantee. |
| Application security and privacy | 8 | 5% | Strong local validation/privacy safeguards; live host/proxy/account controls and retention remain unaccepted. |
| Operational launch readiness | 5.5 | 5% | Release parity, actual receipt, hosting terms and operational ownership still need acceptance. |

## Fresh verification results

- `npm ci`: succeeded from the existing lockfile.
- ESLint and TypeScript: passed.
- Unit/integration tests: **201 passed across 22 files**.
- Normal production build: passed.
- Browser checks: **87 passed**, including the all-19-page accessibility scan, service routes/redirects, contextual forms, keyboard/navigation, no-JavaScript behavior, consent and input-abuse protections.
- SEO script: **19 canonical pages, 19 unique titles, 19 unique descriptions, zero reported findings**, sharing-image endpoint HTTP 200.
- Additional crawl: **96 distinct internal link/anchor targets across 19 sitemap pages**, zero bad HTTP statuses, missing known-page anchors or redirect destinations among those targets. External links were not fetched.
- `npm audit --omit=dev` and full `npm audit`: **zero reported known vulnerabilities**. This is not a penetration test or a guarantee of security.
- Targeted live-browser inspection: Home, Services, AI video, design, promotion, About, Contact, Pricing and AI-specific quote page at **390px and 1440px**; no horizontal overflow in these samples. Existing service-chooser regression coverage includes 320/390/768/1440px, with other browser coverage including 1161px.
- Screenshots were generated for these samples; Home desktop, AI-video mobile, Contact mobile and the early service chooser were visually reviewed.
- HTTP checks confirmed legacy AI service redirect **308 → /aiads**, API GET **405 with private/no-store**, `nosniff`, the intentional review noindex/robots block, and **404 for pending screenshot URLs in normal mode**.
- `git diff --check`: passed before this report.

## Fresh performance measurements

Normal-mode local production server; single synthetic runs using the repository's Lighthouse harness. Main-page and service measurements are saved separately so the service-only run does not replace the main-page evidence.

| Page | Mode | Performance /100 | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: |
| Home | Mobile | 97 | 2.379s | 103ms | 0 |
| Home | Desktop | 98 | 0.555s | 136ms | 0.000091 |
| Website development | Mobile | 97 | 2.418s | 121ms | 0 |
| Request a quote, default website context | Mobile | 98 | 2.336s | 107ms | 0 |
| AI video adverts | Mobile | 99 | 2.165s | 40ms | 0 |
| Graphic design | Mobile | 98 | 1.818s | 140ms | 0 |
| Social media | Mobile | 99 | 2.029s | 52ms | 0 |
| Ads & promotion | Mobile | 99 | 2.073s | 91ms | 0 |
| AI & automation | Mobile | 98 | 2.080s | 106ms | 0 |

Accessibility and Best Practices were **100 in all nine Lighthouse runs**. SEO was **66** because this local build intentionally prevents indexing. Do not remove preview protections to improve this number. Review-mode historical Home scores were lower (latest previous mobile 88); build content and lab variability differ, so do not treat this as a proven like-for-like speed improvement or cherry-pick it as production evidence. All measured mobile LCP values are below 2.5s in these runs, but field percentile Core Web Vitals and INP remain unknown. Test again after approved media and public deployment, preferably with repeated runs and real-user data.

## Findings and recommended actions

### A01 — P0 launch gate: actual production parity and indexing are unverified

The current preview is intentionally noindex/nofollow and robots disallows crawling. That is correct for local review. This audit did not publish or verify the new revision at the public domain. Local route availability is not proof that an advert destination works publicly.

**Before spending:** deploy only an approved release through a new coding session; verify HTTPS, canonical origin, www/apex behavior, every advertised route, redirects, actual contact journeys and production-only indexing. Keep admin/API/review media excluded. Check the production response itself rather than relying on a deployment badge. Search Console verification and sitemap submission come after actual-domain acceptance; indexing/rankings are never guaranteed.

### A02 — P1 confirmed: the Contact detour resets an AI visitor to website messaging

**Reproduction:** `/aiads` → header `Contact` → `/contact` → main WhatsApp action. Actual message: “Hello GROWTHLY, I’d like to discuss a website for my business.” The floating shortcut on Contact also becomes the default website message, and the structured quote links drop the AI service parameter.

**Evidence:** `components/SiteHeader.tsx:15–38` uses a static `/contact` navigation destination; `app/contact/page.tsx:48–56,88–94` uses website-specific wording and a generic quote path. Runtime reproduction is saved in `artifacts/full-audit-page-inspection.json`.

**Impact:** the main AI quote buttons work, but a reasonable secondary journey can confuse a visitor or produce a miscategorised enquiry. The existing 87 browser checks do not cover this newly identified detour.

**Recommended correction:** preserve an allowlisted service query when navigating to Contact from a service page; make the contact description, main/floating WhatsApp messages and structured brief follow it. A truly generic contact entry may instead use neutral language. Keep the canonical Contact URL query-free; do not add customer information or cross-session tracking.

**Acceptance:** browser tests for all five supporting services through header Contact → quote/WhatsApp, plus direct/generic Contact, invalid service values and no-script links. The explicit footer “Website Quote” can remain a deliberate switch.

### A03 — P1 commercial weakness: proof does not yet cover the breadth of the offers

The site currently has one owner-confirmed client website, StarXCO. Its screenshot is permission-pending and correctly unavailable in the normal build. The design and AI-video landing pages explain deliverables but have no equivalent approved creative gallery or playable sample demonstrating those offers.

**Impact:** visitors can understand the service without being able to judge its output. For AI-video advertising, showing an example is likely more decision-useful than adding another process paragraph; this is a hypothesis, not measured conversion lift.

**Recommended correction:** add genuine, publishable work as it becomes available. Clearly label self-initiated demonstrations as demos—not client commissions or results. Use captions explaining the brief and the delivered work, with no invented performance numbers. Do not publish the pending screenshot, fake testimonials, fictional team members or client logos. Obtain approval for the Growthly logo rendition/original asset separately if still unresolved.

**Acceptance:** permission/source recorded for every asset; real playable video/poster and suitable mobile loading; accessible descriptions/captions where relevant; truthful project ownership and any outcome evidence. Re-measure performance after adding media.

### A04 — P1 launch gate: a functioning handoff is not proven enquiry receipt

The current unconfigured build honestly prepares a WhatsApp message; it does not claim an online submission. Links and form preparation pass locally, but this audit did not send a real message or confirm the business phone received one. Supabase/email delivery and admin access are not validated in live provider accounts.

**Recommended correction:** explicitly approve WhatsApp-only operation or approved online delivery. Test actual receipt on the selected path, document who responds, and test failure/retry behavior. Opening WhatsApp, provider API acceptance and a completed sale are different events.

**Acceptance:** authorised synthetic receipt on real devices, correct service in the message, a named responder and lead register, safe cleanup of test data. No new email/CRM/provider purchase or secret sharing is implied.

### A05 — P1 operational gate: hosting, first-year bundle and online abuse controls need acceptance

The site correctly presents approved website starting prices and scopes, first-year .com.ng/hosting and separately agreed renewals. Actual commercial-host eligibility, costs, ownership and bundle delivery have not been verified here.

For future online collection, the default limiter is in-process; without approved proxy-header trust, connections share the `unknown` bucket. Shared limiting/idempotency support is prepared but activation/migrations are not proven live. This can mean false rate limits for real visitors or inconsistent multi-instance protection.

**Recommended correction:** confirm the chosen commercial hosting arrangement and sustainable bundle terms. Before enabling online delivery, verify trusted proxy behavior, WAF/body/time limits, shared throttling/deduplication and live account permissions/MFA. Keep prepared flags off until approved and tested; do not weaken the limiter to make tests pass.

**Acceptance:** written host/bundle ownership and renewal terms; agreed costs; live configuration and concurrent/multi-instance tests where applicable. This is not an instruction to change DNS, nameservers or email services.

### A06 — P1 privacy governance: retention remains an owner task, not an adopted policy

`app/privacy-policy/page.tsx:155–164` transparently says there is no automatic deletion schedule and that the owner must choose a retention period. This is honest but reads as an unfinished operational instruction. WhatsApp-held conversations also need responsible handling even if the site stores nothing online.

**Recommended correction:** owner approves purpose, retention/deletion schedule, access, backups and a process for correction/removal requests. Then reflect actual practice in customer-facing language. Do not invent a retention period or claim Nigerian/privacy-law compliance based on a code audit; obtain appropriate professional advice where needed.

**Acceptance:** the stated policy is implementable and followed in all enabled storage/contact channels; actual provider behavior matches the notice.

### A07 — P2 confirmed: Contact actions should appear sooner

At **390 × 900px**, the main non-floating WhatsApp link starts at approximately **y=1116px**, and the phone link at **y=1414px**. The floating WhatsApp control is visible around y=824px, so contact is not inaccessible; however, people explicitly visiting Contact should not have to rely on that widget or scroll through a long introduction to find the main choices.

**Recommended correction:** place concise WhatsApp/call/brief actions in the Contact hero, with the right service context. Retain useful preparation and process content below.

**Acceptance:** at least the primary contact choices are visible in the initial practical mobile viewport, keyboard reachable and correctly labelled; do not add an obstructive overlay or duplicate competing primary actions.

### A08 — P2: long pages need tighter decision hierarchy, not removal of full services

With all supporting sections painted, the 390px inspection measured Home at approximately **23,538px / 2,639 visible-text words**, Services **13,221px**, Contact **7,025px**, and AI video **7,270px**. These are measurements in this viewport, not universal page lengths. Length alone is not a defect; substantial separate sections were explicitly requested and remain valuable.

**Recommended correction:** retain every full service section and direct ad page. Improve section spacing selectively, remove genuinely repeated generic wording, and ensure proof/offer/action precede optional detail. Keep native jumps/disclosures and the early chooser. Test completion rather than assuming short pages convert better.

**Acceptance:** visitors can identify the right service, see evidence, understand exclusions and reach an enquiry without reading the whole site; no inaccessible hidden content or removed deliverables.

### A09 — P2 copy polish: preserve acronyms and improve quote grammar

The AI landing visibly renders “See the ai video adverts scope”; related quote copy/metadata lowercases service short titles and can produce awkward phrasing such as “Get a ai … quote.”

**Recommended correction:** use service-specific sentence labels and grammatical articles instead of blindly lowercasing all service names. Keep “AI” uppercase. This is small but visible on the exact paid-traffic journey.

**Acceptance:** titles, helper links, quote headings, metadata and prepared messages read naturally for all six services without changing their scopes or prices.

### A10 — P2 defense-in-depth and measurement follow-up

Application controls include bounded request reads, input validation, origin checks, private API caching, provider timeouts and privacy-aware consent gating. The Next config defines production-host frame protection, but the CSP is limited to `frame-ancestors`; a broader resource policy is not implemented. Local iframe preview intentionally differs from production protections.

**Recommended correction:** on the chosen host, verify actual HTTPS/HSTS/frame protections; consider a staged Report-Only CSP compatible with Next and any approved analytics, then enforce only after testing. This is defense in depth, not proof of an exploitable vulnerability. Complete live RLS/role/MFA/backup checks and manual security review before private online lead collection.

Analytics/Ads remain off unless explicitly approved and consented. Before evaluating paid traffic, choose a privacy-appropriate way to distinguish visits, delivered enquiries, qualified leads and won projects. No tag activation is authorised by this audit. Check account settings and network payloads if analytics is later approved. A WhatsApp click is not a conversion in the business-revenue sense.

## Page-by-page assessment

| Page/area | Assessment | Next useful improvement |
| --- | --- | --- |
| Home | Clear website-first positioning; correct approved starting offer and early six-service chooser. | Approved visual proof; tighten repeated explanation while preserving full service sections. |
| Services | Strong separation, canonical destinations and clear independent commissioning. | Add service-specific evidence rather than more generic copy. |
| Website development/pricing | Scope, first-year bundle, Recommended Business package and separate fees remain coherent. | Verify operational delivery/renewal terms; add approved relevant case evidence. |
| AI video | Focused promise, correct video quote path, useful scope and separation from paid promotion. | Real playable sample; acronym/grammar polish; fix Contact detour. |
| Graphic design | Clear deliverables and its own enquiry path. | Approved representative design work with context. |
| Ads & promotion | Campaign support is distinct from creative production and media costs. | Add documented work/process evidence without invented results or guarantees. |
| Social media / automation | Independent service pages avoid imposing website packages. | Genuine scope examples and approval-based proof of capability; do not imply unapproved provider activation. |
| About | Substantive, business-focused and free of invented team/history claims. | Concise, owner-approved real business identity and service-area information where appropriate. |
| Contact | Correct contact numbers and useful guidance, but website-centric detour and delayed main actions. | Preserve service context and put direct actions in hero. |
| Quote | Service-aware fields, privacy-safe no-script behavior and honest WhatsApp handoff. | Real receipt acceptance and natural service-specific wording; retain optional-details disclosure. |
| Portfolio | Genuine sole project and clearly non-client independent references. | Approved visuals and additional authentic work when owner supplies it; maintain separation from inspiration. |
| Privacy / terms | Clear no-payment/proposal boundary and honest provider/analytics explanations. | Final owner-adopted retention and operating practices, then appropriate legal review. |

## Priority order

1. Fix the service-context loss on Contact; add regression tests.
2. Put primary Contact actions near the top.
3. Add permission-cleared examples—particularly a playable AI-video sample and real design work—when available.
4. Confirm WhatsApp/live receipt, responder and lead handling.
5. Approve commercial hosting, first-year bundle delivery and retention; verify online controls only if enabling that workflow.
6. Publish the approved normal-mode release in a new coding session and verify the actual domain, indexing and every ad destination.
7. Run a small approved campaign only after those checks, measure qualified enquiries and improve from real evidence rather than a promised conversion/ranking result.

**Bottom line:** the website is already professional enough to continue toward launch. Its biggest remaining gains come from proof, consistent secondary journeys and real operational acceptance—not another redesign or more generic copy. A defensible next target is 9/10 after the fixes and verified release; no score guarantees enquiries or sales.

## Regenerable evidence

Ignored artifacts: `full-audit-{lint,types,unit,build,browser,seo}.log`, `full-audit-{dependencies,all-dependencies,main-performance,ad-performance,http,links,page-inspection,contact-positions}.json`, `audit-*.png`, Lighthouse HTML/JSON and existing browser output. Source findings reference existing paths above; generated evidence can be recreated from the repository scripts. Current server: normal production preview, port 3000. Pending screenshot remains private/unavailable. No GitHub or deployment operation occurred.
