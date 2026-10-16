# Growthly service-specific pages and advertising links

14 October 2026. The owner clarified: Growthly offers more than websites, but website development should remain the main focus. Other services need full separate sections and dedicated destinations so each advert sends people to the relevant offer.

## Canonical destinations prepared

| Advert/service | Canonical path | Primary page action |
| --- | --- | --- |
| Website development | `/website-development` | Get a Website Quote |
| Graphic design | `/graphic-design` | Get a Design Quote |
| AI video adverts | `/aiads` | Get an AI Video Quote |
| Social media management | `/social-media` | Discuss Social Media Support |
| Ads & promotion | `/ads-promotion` | Discuss an Ad Campaign |
| AI integration & automation | `/ai-automation` | Discuss an Automation Project |

These are working local preview routes, **not a claim that the public growthly.com.ng URLs have been deployed**. After an approved production deployment, use the domain plus the relevant path, for example `https://growthly.com.ng/aiads`. Do not spend money sending traffic to a public route until its actual response and contact journey have been checked.

Existing `/services/<service-slug>` links permanently redirect to the equivalent canonical page; the website-development alias still redirects to `/website-development`. Sitemap and internal service/footer links use canonical destinations, not redirect aliases. There remain 19 unique public content routes: five old canonical service URLs were replaced, not duplicated.

## How the offers stay clear

- Home still leads with website development, approved website packages and the website quote action.
- Home and Services have **five full, separately headed supporting-service sections**, each with its own description, deliverables, native scope disclosure and destination. A website purchase is not a prerequisite for commissioning another service.
- The Services overview has a six-service jump navigation, with website development explicitly primary.
- Each dedicated supporting page has a specific headline, audience, three applications, scope, exclusions, its own four-step process, brief checklist, three FAQs and closing action. No website package grid is placed on these pages.
- Header, hero, scope and closing quote buttons carry the correct service. The quote page does not ask an AI-video/design enquiry for a website type or website package. Existing hidden empty/custom values preserve server validation.
- The quote-page header says “Complete your brief” and links within the current page, rather than silently switching an ad visitor to a website request. The explicitly labelled website link in the footer remains available if someone deliberately changes service.
- Floating WhatsApp and direct page contact messages identify the advertised service. Motion, drag, persistence, pause/resume, reduced-motion/no-script behavior and admin exclusion remain intact.
- **AI video is creative production; Ads & promotion is campaign support.** Both pages explain the difference and link to the other only as a relevant alternative. Media spend and campaign work are not implied to be part of a video-production price.
- Website prices and first-year hosting/domain offer are unchanged and do not become prices for unrelated creative/marketing services. Navigation now says **Website Pricing**.

## Matching an advert to a destination

Use one service/offer per advert and send visitors to that page—not to a generic list of everything Growthly offers. Match the advert’s actual promise to the page’s scope and quote action. Do not advertise invented turnaround times, discounts, testimonials, client counts or guaranteed sales.

A labelled example URL after deployment:

```text
https://growthly.com.ng/aiads?utm_source=meta&utm_medium=paid_social&utm_campaign=ai_video_intro
```

This is an example naming convention, **not an active campaign, account connection or performance claim**. Campaign labels must not contain personal information. Canonical URLs exclude query variants. The existing analytics/UTM system stays owner-approval and opt-in gated; without that approval and consent, this work does not capture campaign attribution or load a tag. Google Ads conversion tracking remains disabled. Visits, quote clicks, brief preparation and WhatsApp opening are not proof of received enquiries or won customers.

The new paths are included in the small public analytics allowlist. If approved analytics is later activated and consent granted, supporting-service visit events can identify the actual configured service without sending form details, query strings or full external referrers. Unit coverage checks consent denial/withdrawal and parameter minimisation. No paid service or advertising provider was activated by this change.

## Implementation map

- `config/service-pages.ts`: small shared path/label/CTA map, used by navigation, contact buttons, floating WhatsApp and public-route identifiers. No full content/image schemas are added to client bundles.
- `config/service-marketing.ts`: service-specific applications, distinctions, preparation, process, FAQs and SEO titles.
- `components/ServiceLandingPage.tsx`: server-rendered full landing-page layout and truthful Service/Breadcrumb schema.
- `app/[servicePage]/page.tsx`: allowlisted static destinations; unknown slugs remain 404.
- `app/services/[slug]/page.tsx`: permanent legacy redirects, preserving existing links.
- `components/SupportingServiceSections.tsx`: full separated Home/Services sections; explicit scoped details retained rather than removed.
- `lib/public-pages.ts` and `config/public-route-ids.ts`: canonical content/analytics inventories remain aligned.
- `scripts/measure-performance.mjs`: optional `PERFORMANCE_PATHS` for selected canonical paths without query/personal data.

## Validation

Final local checks:

- Lint, TypeScript, review production build and diff check passed.
- **199 unit/integration tests across 21 files passed.**
- **86 browser tests passed**, including new service routes, contextual buttons/forms/WhatsApp, legacy redirects, 320/768/1161/1440px reflow, all-19 accessibility scans, consent/privacy safeguards and native/no-script service navigation.
- Actual SEO audit: **19 pages, 19 unique titles, 19 unique descriptions, zero findings**, generated brand sharing image HTTP 200.
- Production dependency audit: **0 vulnerabilities**.
- Desktop/mobile landing-page screenshots inspected, including AI-video versus advertising presentation.

An initial browser run had stale header expectations and incorrectly expected the server-validation hidden website-type field to be absent; tests now check the intended contextual header and the empty hidden value while forbidding a website-type select. A subsequent repeated suite hit the real in-process abuse limiter; rerunning on a fresh local test server passed. No rate limit was disabled or weakened. Repeat the full browser suite against a fresh local server to avoid carrying deliberate abuse-test traffic between runs.

### Latest synthetic performance, not field guarantees

| Mobile landing | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| AI video adverts | 98 | 100 | 100 | 66 | 2.155s | 82ms | 0 |
| Graphic design | 99 | 100 | 100 | 66 | 1.765s | 77ms | 0 |
| Social media | 97 | 100 | 100 | 66 | 2.188s | 143ms | 0 |
| Ads & promotion | 98 | 100 | 100 | 66 | 2.157s | 84ms | 0 |
| AI & automation | 98 | 100 | 100 | 66 | 2.058s | 97ms | 0 |

The full homepage initially measured 77 after adding all full service sections. Native offscreen rendering hints preserve all content, links and accessibility while deferring offscreen paint; intrinsic sizes are based on measured section heights. Browsers without support show the full content normally. No-JavaScript anchor/disclosure navigation is tested. Full review screenshots explicitly paint all offscreen sections, rather than show skipped paint as missing content.

The WhatsApp mutation observer now watches direct body-child changes, where the consent banner actually appears, instead of forcing layout for mutations throughout every large page. All existing contact/banner-clamping regressions still pass.

Final main-page lab: home mobile **89**, desktop **88**, development mobile **98**, quote mobile **98**. Home-mobile LCP **2.539s**, TBT **354ms**, CLS **0**; remaining home blocking time is a tuning consideration, not concealed by quoting an old 98 score. Accessibility/best practices are 100 on all runs. Review SEO 66–69 is intentional noindex; no production indexing or Search Console acceptance is claimed. Evidence is regenerable under ignored `artifacts/service-landings-*`, `public-seo-audit.json` and screenshots.

## Launch gates remain

No deployment, GitHub operation, ad campaign, paid provider, DNS change or confirmed live enquiry delivery was performed. This closed coding session cannot publish to GitHub; use a new coding session for approved release work and preserve the saved local changes. Existing permission, hosting/commercial terms, delivery/retention/provider/security and real-device/assistive-technology gates remain. Client projects and assets need genuine information and permission; none were invented to decorate these service pages.

## Later visibility clarification

The owner asked to make supporting services easier to find on Home and Services. An early six-service chooser now sits immediately after the website hero and near the top of the Services overview. Website development is first, highlighted and explicitly the main focus. Other offers are clearly standalone, and the hero has a native shortcut to the chooser. The full separate sections remain below. Dedicated ad pages retain their focused service-only journeys.

New reusable module: `components/ServiceGateway.tsx`. Latest checks: **201 unit tests (22 files), 87 browser checks**, lint/types/build/diff passed, actual 19-page SEO audit zero findings and production dependency audit 0 vulnerabilities. The new route-selection flow was tested at 320/390/768/1440px and mobile/desktop gateway screenshots inspected. Latest main-page lab: Home mobile 88/desktop 89, development mobile 99, quote mobile 97; A11y/BP 100 all. Home-mobile LCP 2.463s, CLS 0, TBT 406ms. Older ad-page measurements above are unchanged code evidence, not a new performance measurement. Evidence: ignored `artifacts/service-visibility-*` and gateway screenshots. No deployment, campaign activation or new provider/permission decision.
