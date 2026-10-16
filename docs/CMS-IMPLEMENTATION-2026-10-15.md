# Owner CMS implementation and verification — 15 October 2026

## Delivery status

Implemented locally on `arena/c8310713-growthly`. **Not connected to a real Supabase account, remotely migrated, publicly activated or deployed.** The current coding session is closed for remote GitHub operations. Preserve these local changes and use a new coding session for approved one-time setup/publication. See [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) for owner instructions, configuration and live acceptance.

Owner-confirmed scope includes projects/images, public contact numbers, Home/About/Contact introductions, tagline, website/service FAQs and the three website starting prices. The editor is `/admin/content`, linked from admin, protected by the existing server-verified broad administrator role. No VA role/account/access was created.

## Implemented

- Project forms with stable URL suggestions, service and client/demo classification, optional public website/video link, accurate delivered scope/purpose/decisions, private image upload/preview, alt/credit and separate publication permissions; order/removal, inclusion and one website-first Home spotlight.
- Save draft, private text/FAQ previews, explicit whole-snapshot publication, unsaved-change warning/discard, revision history and restore **to draft only**, clearing all publication permissions. Atomic SQL revision comparison protects against stale tabs. No browser-storage substitute for persistence.
- Shared runtime published-only consumers: Home, website packages/metadata, Services summary, contact links/briefs, FAQs, portfolio/detail/service projects, sitemap and new project paths. A small published path/service map preserves matching header/contact/WhatsApp context on creative case studies without shipping hidden draft text.
- Prices stay at the approved ₦100k/₦200k/₦300k defaults unless explicitly changed and published. Additional price confirmation, positive ordered whole-naira values and shared formatting keep package guidance consistent. Editable FAQ tokens avoid rewriting unrelated manually typed campaign budgets. Package scope and first-year hosting/.com.ng terms are unchanged.
- Strict plain-text schemas and bounded private APIs; authenticated image registry/private bucket; real sharp raster validation, metadata removal, WebP conversion and dimension bounds. Public media requires current publication/permission, with no-store/nosniff/noindex/no-referrer headers. Next image optimization is allowlisted to approved static project assets, preventing manually constructed optimizer URLs from caching revocable CMS/review/private routes.
- Separate opt-ins: `SITE_CMS_ENABLED=false` and `ONLINE_INQUIRIES_ENABLED=false` remain safe defaults. CMS credentials alone cannot activate online enquiry collection; the existing WhatsApp-only handoff remains available. No email/DNS/account/analytics/campaign activation.
- StarXCO remains the sole default client project; the first CMS seed is text-only, not automatic approval/import of its pending screenshot. Portfolio headings do not mislabel demonstrations or other services as client websites. Generic project-discovery links no longer leave a hardcoded StarXCO link after withdrawal.
- CMS-on builds use request-time content/sitemap rendering; approved later publications need no code edit/rebuild. Provider/publication failure does not resurrect withdrawn default project/contact actions. SDK PostgREST retries are disabled so bounded server transport does not hide additional retry/backoff delays.

## Final local validation

| Check | Measured result |
| --- | --- |
| TypeScript / ESLint / `git diff --check` | Passed |
| Unit/integration suite | **260 passed, 32 files**, 12.97s in latest run |
| CMS-specific suite coverage | 40 tests across seven CMS test files, plus separate analytics-path and lead-opt-in regression coverage |
| CMS browser tests | **19 passed, 26.6s**: 12 isolated component/mock-backend tests and 7 CMS-enabled production-server tests against a local mocked provider |
| Whole-site browser regression | **95 passed, 3.2min**; 19 explicitly gated CMS cases skipped in this default-mode invocation, having passed separately above |
| Builds | Both CMS-on dynamic and CMS-off normal production builds passed |
| Default public SEO audit | **19 pages, 19 unique titles/descriptions, zero findings**; shared Open Graph image HTTP200 |
| Dependency audit | **0 known vulnerabilities** reported by `npm audit` |
| Private editor setup fallback | `/admin/content` HTTP200, clearly requiring one-time setup when provider configuration is absent |

Browser coverage includes stale edits, draft versus publish, saved price drafts needing confirmation after reload, discard invalidating approval, history restoration, upload permissions, published URL locking, FAQ token preview, ordering/removal and responsive editor sections at 375/768/1440px with zero automated axe findings across all five sections. Runtime coverage includes newly published URLs, metadata, sitemap withdrawal, no hidden draft serialization, contact/pricing/FAQ/quote consistency, creative-project CTAs and WhatsApp context, no-JavaScript public rendering, image withdrawal/optimizer denial, provider outage and deliberate Home un-featuring. Existing 95 checks preserve ad-specific journeys, no-script privacy, legacy redirects, public accessibility/layout/links and draggable WhatsApp behaviour **without pause/play controls**.

PGlite tests exercise real isolated PostgreSQL RLS/role/CAS/history behaviour, including null/negative/stale revisions and direct-write denial. Storage-policy SQL uses a deliberately minimal fixture, not a running Supabase Storage service. Upload tests run actual sharp image parsing, EXIF stripping, output format and the 16MP compressed-image limit. Authentication/API/provider interactions in these tests are mocked. **These do not verify real Supabase Auth/Storage HTTP behaviour, multi-instance concurrency, live hosting or actual message receipt.**

### Fresh default-mode Lighthouse lab

Measured after the final browser suite finished, without running another browser workload in parallel:

| Page | Mode | Performance | Accessibility | Best practices | LCP | CLS | TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile | 96 | 100 | 100 | 2.301s | 0 | 162ms |
| Home | Desktop | 98 | 100 | 100 | 0.544s | 0.000091 | 124ms |
| Website development | Mobile | 94 | 100 | 100 | 2.278s | 0 | 236ms |
| Quote | Mobile | 98 | 100 | 100 | 1.781s | 0 | 140ms |

SEO score66 is expected under intentional review noindex; it is not a public release. An earlier simultaneous Lighthouse/Playwright run showed contention-sensitive scores72/78/94/84 and is retained separately, not presented as an isolated benchmark. Development-page blocking time and unused/legacy JavaScript remain improvement opportunities. These are local synthetic measurements of the **CMS-off build**, not field Core Web Vitals, device/assistive-technology certification or real CMS-provider performance. No conversion/ranking/zero-risk guarantee is made.

## Evidence and running preview

Regenerable, ignored evidence is in `artifacts/cms-unit.log`, `cms-enabled-build.log`, `cms-default-build.log`, `cms-browser.log`, `cms-browser-results.json`, `cms-public-browser.log`, `cms-seo.log`, `cms-dependency-audit.log`, `cms-performance.log` and `cms-performance-contention.log`; screenshots include `cms-editor-projects-375.png` and `cms-editor-projects-1440.png`. They are local QA artefacts, not published client work. Normal public browser outputs and Lighthouse reports are also in `artifacts/`.

The final preview is the **normal, CMS-off/WhatsApp-only build on port3000**, process `growthly-website-337333cb`. It shows the setup explanation, not a real signed-in editor account. Mock fixture/runtime servers on3001/3002 were stopped. Do not represent this as a working live provider connection or deployment of growthly.com.ng.

## Live gates still required

1. Owner-approved existing provider/hosting/account/cost inspection, migrations, private Storage and owner Auth claim; no VA admin access.
2. Real owner/non-admin/anonymous RLS, API and Storage acceptance; draft/publish/CAS/restore/withdrawal checks with synthetic data; backups and orphan-media/history retention decisions.
3. Initial reviewed publication, then owner-approved build **and runtime** CMS flag and deployment. Check real database latency, hosting capacity/cost, request limits, dynamic sitemap and publication updates. Existing browser caches need a reload for current settings.
4. Separate online-enquiry/privacy/delivery acceptance only if requested; otherwise keep WhatsApp-only. Manually verify actual phone receipt and operational response ownership.
5. Client/media permissions, commercial host terms, indexing/public release and all existing launch gates. No retention duration or VA workflow was silently adopted.
