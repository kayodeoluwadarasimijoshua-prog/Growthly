# Growthly — audit fixes, remaining gates and owner actions

**15 October 2026.** This implements the locally addressable findings from [the full audit](FULL-WEBSITE-AUDIT-2026-10-15.md). It is not a claim of 10/10, a public deployment, live receipt, legal compliance or activated assistant access.

## Owner clarification

The hired VA will help with enquiries and follow-ups, has no access yet, and the owner will decide the workflow after today's job discussion. Therefore this implementation **does not provision accounts, widen admin permissions or activate a shared inbox/provider**. Read [the VA onboarding/privacy plan](VA-ONBOARDING-AND-PRIVACY.md) for the meeting agenda, permitted/prohibited tasks, proposed staged access, templates and offboarding.

## Findings disposition

| Audit finding | Status now | Remaining requirement |
| --- | --- | --- |
| A01 public release/indexing parity | Not deployable in this closed session. Preview intentionally remains noindex. | Owner-approved release in a new coding session, actual-domain smoke checks and production-only indexing. |
| A02 service context through Contact | **Fixed/tested locally.** Header Contact links carry the allowlisted service. Server-rendered Contact hero/cards/brief/floating links follow it; generic/invalid entries stay neutral. Header on Contact jumps to its contact choices rather than resetting to websites. Quote header Contact jumps to a service-specific helper link. | Public-domain verification after release. |
| A03 service proof | No fabricated work, testimonials or results added. Pending screenshot remains unavailable in normal mode. | Owner supplies permission-cleared creative/video work and genuine project information; approve original/rendition logo. |
| A04 live receipt | Existing honest WhatsApp-only handoff retained; no provider or delivery-mode change. | Authorised real-device receipt test and responder/lead workflow decision. |
| A05 host/bundle/online controls | Existing prepared shared limiter/idempotency safeguards retained; no migrations/flags activated. | Commercial hosting/cost/ownership/renewal acceptance; live proxy/RLS/MFA/shared controls if online collection is approved. |
| A06 privacy and retention | Customer-facing copy polished, conditional assistance safeguards added, no automatic deletion falsely promised. | Owner-approved retention/deletion rules, contracts, tools and actual enforcement. No retention period inferred. |
| A07 delayed contact actions | **Fixed/tested locally.** WhatsApp and call actions are in the hero. | Real-device acceptance. |
| A08 reading hierarchy | Contact copy shortened and made service-aware; section index added. Home spacing trimmed without removing any full service section or deliverable. | Observe genuine customer completion/feedback; do not assume shorter automatically converts better. |
| A09 acronym/article grammar | **Fixed/tested locally.** Shared sentence-case helper preserves AI; quote metadata avoids incorrect articles; messages use canonical service wording. | Normal content review as offers change. |
| A10 security/measurement | Added enforced object/base/form CSP restrictions, retained host-scoped production frame protection and preview embedding. Added explicit negative tests for assistant/support/customer/self-edited-role admin access. | Actual host/account controls and optional stricter script/resource policy need separate compatibility review. No analytics/Ads activation or assistant portal claimed. |

## Implementation details

- `config/service-pages.ts`: small shared validated context/contact URL/message helpers; AI-preserving sentence casing. No tracking, cookies or arbitrary destination support.
- `app/contact/page.tsx`: dynamic server-rendered allowlisted query context; query-free canonical; invalid/duplicate service notice without echoing the input; first-screen actions, service-specific brief, neutral generic entry and all substantive contact topics retained.
- `components/SiteHeader.tsx`: supporting-page Contact links identify the service; Contact header actions stay within current context; quote header Contact links to a service-specific contact helper.
- `app/request-a-quote/page.tsx` / `components/InquiryForm.tsx`: natural service copy, scoped floating/direct contact and quote-to-contact helper. Existing validation, no-JS privacy and delivery behavior preserved.
- `components/FloatingWhatsApp.tsx`: a single normal widget on general pages; Contact/Quote render one server-contextual widget while suppressing the layout instance. No new query-hydration wrapper, duplicate no-JS controls or dropped drag state on general pages. All existing drag, touch, keyboard, pause, consent avoidance, storage, reduced-motion and admin-exclusion tests pass.
- `next.config.ts`: `object-src 'none'; base-uri 'self'; form-action 'self';` in the global CSP. Production-host CSP combines these with `frame-ancestors 'none'`; preview does not get a frame block. No reporting endpoint or new external data transmission. This is not a full script-src/nonce policy or a penetration-test result.
- Privacy copy addresses conditional authorised assistance and no credential/OTP/personal-AI-tool sharing; actual access remains unchanged.

An initial query/Suspense approach remounted the widget and left duplicate hidden streaming markup without scripts. It was removed, not shipped as the solution. Server-provided page context avoids the issue. Other initial failures were stale lowercase expectations or a mismatch between short and full service names; canonical message helpers and corrected expectations now cover the intended behavior. The final entire browser run passed against a freshly restarted server without weakening abuse controls.

## Fresh final validation

- **218 unit/integration tests, 25 files passed.** Includes context validation, negative administrator-access boundaries and CSP configuration tests.
- **95 browser checks passed**, including all earlier 87 plus five supporting-service Contact detours at 320/390/768/1440px, generic/invalid/duplicate inputs, no storage of query input, all-five-service no-JavaScript handoffs, preview/production-host CSP and automated accessibility.
- TypeScript, ESLint, normal production build and diff checks passed.
- Actual SEO audit: **19 canonical pages, 19 unique titles/descriptions, zero reported findings; OG endpoint 200**.
- Internal crawl: **109 distinct internal link/anchor targets across 19 pages; zero errors/redirects**. External destinations were not fetched.
- Full dependency audit: **zero reported known vulnerabilities**.
- Mobile/desktop screenshots generated; updated Contact mobile (AI context) and desktop were inspected. Actual mobile Contact actions at390×900: WhatsApp **y371–419**, phone **y431–479** versus previous y1116/y1414. Contact total height reduced from approximately7025px to5559px and visible-text words742→567 in the same inspection setup. Home all full content remains; mobile height23538→23370px, no claim of dramatic shortening.

### Latest normal-mode synthetic performance

| Page | Mode | Performance | A11y | BP | LCP | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile |97|100|100|2.350s|108ms|
| Home | Desktop |98|100|100|0.462s|138ms|
| Website development | Mobile |96|100|100|2.317s|165ms|
| Default website quote | Mobile |97|100|100|1.899s|190ms|
| Contact, generic | Mobile |99|100|100|2.180s|37ms|
| AI video | Mobile |96|100|100|2.267s|162ms|
| Graphic design | Mobile |96|100|100|2.244s|173ms|
| Social media | Mobile |97|100|100|2.241s|127ms|
| Ads & promotion | Mobile |98|100|100|2.244s|74ms|
| AI & automation | Mobile |98|100|100|2.122s|108ms|

Mobile CLS0 across these runs; desktop CLS approximately0.000091. Preview SEO66 is intentional noindex. Single-run lab variation explains changes from the earlier audit; do not claim all pages got faster or that field INP/Core Web Vitals are established. Normal mode omits permission-pending project imagery. Re-measure after approved media and production deployment. No new ranking/conversion promise.

## What the owner should do next

### At today's VA discussion

Approve the duties/hours, who sees enquiries first, draft-vs-send authority, escalation rules, follow-up cadence and approved work tools. Keep credentials/private customer data out of chat. Start rehearsal with synthetic enquiries, not real customer exports. No access should be granted merely because this guide exists. The current website admin role is not a restricted VA role.

### Before delegating real enquiries

Approve confidentiality/data-processing instructions and an appropriate agreement; choose retention/deletion rules; use individual accounts/MFA where available and test actual access limits. Do not link personal WhatsApp or share owner/admin/hosting/banking credentials. Ordinary linked messaging devices may expose broad history and cannot be treated as per-lead access controls. Decide the workflow before selecting/activating tools or paid services.

### Before public promotion/paid traffic

Supply approved work/media and logo confirmation; confirm host eligibility and bundle terms; perform an authorised real receipt and device/AT test; review live account controls for enabled features. Start a new coding session to deploy the approved normal build, then verify each actual public destination, contact flow, robots/canonical/sitemap and rollback target. Keep analytics/Ads default-off until separately approved and consented.

## Evidence and running preview

Normal build and server on port3000; process `growthly-improved-contact-previe-eb8988e0` at verification. Regenerable ignored evidence uses `artifacts/launch-fixes-*`, browser output and Lighthouse reports. Dependencies/build/artifacts may need regeneration after workspace reset; source/docs persist. No GitHub push/PR, deployment, DNS/email change, real message, account provisioning, paid service or campaign activation took place.
