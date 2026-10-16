# Growthly: fuller professional website redesign

14 October 2026. This document supersedes the earlier compact-homepage direction, not the pricing, privacy or permission safeguards.

## Brief and approach

The owner wants a substantive, professional website that makes business owners interested, restores useful content from the former growthly.com.ng homepage and gives Home, About, Contact, Services and Projects a clear hierarchy. New client projects are for the owner to supply tomorrow. External references are permitted only as explicitly independent inspiration.

Research and implementation were underway by the recorded **16:39:35 UTC** checkpoint. Subsequent build/browser/SEO checks were still running at **17:08:43 UTC**, followed by final copy review, maintainability work and documentation. This is active research, implementation and validation, not a timer or idle loop. See the final validation section for the finished work window.

We cannot guarantee that every visitor becomes a customer. The achievable design objective is to help suitable visitors understand the offer, evaluate it, find trustworthy information and take an appropriate next step. No invented conversion lift, search volume, rankings, testimonials, years, team members or client count was added.

## Research reviewed and resulting decisions

### 1. Homepage clarity is not the same as extreme shortening

Source: Nielsen Norman Group, [Homepage Design: 5 Fundamental Principles](https://www.nngroup.com/articles/homepage-design-principles/), 15 March 2024. Reviewed the identity/offer, representative content, task/navigation and visual-priority guidance, including descriptive links and excessive-motion cautions.

Implementation: retain the agreed social-media headline, explain the business offer, show a genuine project, restore the seven website solutions, why-us principles, four-step process, packages, industry applications and eleven FAQs. Use descriptive destinations and a seven-link native section navigation. Separate major buying questions into clearly headed sections rather than place everything in one compressed grid.

The former [Growthly homepage](https://growthly.com.ng/) was inspected in both returned chunks. Its useful fuller section structure informed this restoration. Its obsolete package assumptions and fictional project concepts were NOT adopted; current owner-approved prices and the sole StarXCO project remain authoritative.

### 2. Company credibility should be concrete and truthful

Source: Nielsen Norman Group, [About Us Information on Websites](https://www.nngroup.com/articles/about-us-information-on-websites/), 26 May 2019. Reviewed plain-language purpose, easy contact, consistency and transparency findings. This is general qualitative usability research, not Nigerian lead-conversion data.

Implementation: About explains the website-first focus, how Growthly works, who the solutions can suit, responsibilities, written scope and the process. Contact provides actual WhatsApp/phone details, useful first-message guidance and the steps before a proposal. No fabricated team photo, award, review, address or claim of experience was used to fill the page.

### 3. Reduce avoidable enquiry uncertainty

Source: Baymard Institute, [Explain the Phone Number Field](https://baymard.com/research-articles/explain-phone-number-field), updated 29 July 2025. Research concerns ecommerce checkout; it is not evidence of a measured Growthly enquiry lift.

Implementation: a direct question can go to WhatsApp or phone without a duplicate form. The canonical brief keeps email optional, explains the reason for the contact number, accepts an unsure budget and preserves labels, autocomplete, validation and error descriptions. No account creation, payment checkout, forced newsletter, chatbot or pop-up was added.

The native three-choice website-fit guide is a low-complexity aid for uncertain visitors: choose a goal, read a starting direction, then carry the actual approved package and website type into the quote. It collects no data and works without JavaScript. It is evidence-informed, NOT individually conversion-validated.

### 4. SEO needs useful content and reliable technical foundations

Sources: Google Search Central [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and [Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). Reviewed guidance on people-first content, descriptive titles/headings/links, snippets, contextual image alternatives and canonical sitemap destinations.

Implementation: unique page titles/descriptions and canonical URLs; substantial visible page content; crawlable internal navigation; one H1 and meaningful H2/H3 hierarchy; visible breadcrumbs with matching BreadcrumbList data; truthful Organization/WebSite/Service data; real contact numbers; brand social-sharing metadata. No keyword meta tag, fake LocalBusiness address, rating schema, search-ranking promise or FAQ rich-result promise.

A fresh HTTP/browser audit found that child-page Open Graph overrides dropped the inherited image. The shared metadata helper now explicitly supplies the real generated 1200×630 Growthly brand image to Open Graph and Twitter. This was fixed and checked across all 19 canonical public pages.

Robots, root metadata and global HTTP headers now share `isPublicIndexingEnabled`: approval alone cannot index a Vercel preview/development build, a development server or a private image-review build. Production robots also excludes admin, APIs and review-media paths. These directives do not secure private data; authentication and the guarded review route still do that.

Sitemap routes derive from actual service/project configuration, exclude redirects/private routes/query variants and are deduplicated. No invented build-time `lastModified` values are used. A new genuine project will get its case-study sitemap destination automatically. The small client analytics route identifiers must still be updated and alignment-tested when adding content.

### 5. A fuller page need not become a heavier app

Source: Google [Web Vitals](https://web.dev/articles/vitals), updated 31 October 2024. Loading, interactivity and visual stability need real-user validation, with lab tests useful for local regression checks.

Implementation: server-rendered editorial content, native links/details, no external example screenshots/embeds, no new client framework, no paid integrations and no large decorative asset. Existing private responsive images, image-error fallback, consent controls and reduced-motion support remain. The only ongoing animation is the already approved pausable WhatsApp glyph; its stable hitbox/drag behavior is unchanged.

## Independent references: learn a detail, do not copy a platform

- [Paystack](https://paystack.com/): direct offer, feature explanation and different customer routes; useful service-led information structure. Its customer numbers, testimonials and platform capabilities are not Growthly evidence.
- [IKEA USA](https://www.ikea.com/us/en/): product-category and shopping routes. Both the global homepage and the actual USA shopping page were retrieved; do not mistake the global editorial gateway for the store.
- [Lagos Business School](https://www.lbs.edu.ng/): public programme and faculty information shows different education audience needs. This is a selected content-organisation reference, not endorsement of every design choice; duplicate content/carousel patterns seen in retrieval are not copied.

The portfolio section explicitly says Growthly did not build these websites and is not affiliated with them. They use ordinary external links with safe new-tab labels. No copied logos, screenshots, trackers, awards or claims are loaded. Their enterprise functionality is not promised within a starter package.

## What changed

- Homepage: fuller offer-to-enquiry journey, native jump navigation, customer outcomes, seven solutions, differentiators, real-work discussion, full packages, native fit guide, four-step process, seven industry applications, smaller supporting services, eleven FAQs and closing CTA.
- About: concrete business purpose, principles, suitable project needs, responsibilities and process.
- Contact: three useful contact routes, preparation checklist, expectation-setting and practical questions.
- Services: clear website-first focus, solutions, detailed smaller support services and cost/permission boundaries. Existing full service detail pages retained and given breadcrumbs.
- Projects: real client work and independent inspiration visibly separated; case-study purpose and design choices restored; cards/case categories use project configuration rather than hardcoded StarXCO sector text.
- Main website service pages: full packages, process, fit guide and FAQ rather than compact summaries.
- Industries: useful applications plus customer-task and integration-scope guidance, not claimed vertical expertise.
- Pricing: existing approved details preserved, fuller spacing, visible breadcrumb and correct H2 → package H3 structure.
- Header: Services restored; a header-only tablet breakpoint avoids changing the whole page layout. Escape/focus handling retained. No-script navigation remains visible.

## Validation and interpretation

Latest evidence is in ignored, regenerable `artifacts/redesign-unit.log`, `redesign-browser.log`, `redesign-build.log`, `public-seo-audit.json`, `redesign-performance.log` and page screenshots. `scripts/audit-public-seo.mjs` audits actual HTTP metadata, headings, sitemap targets, social fields and private noindex, not a mock SEO checklist.

The initial full browser run caught one Pricing heading-order regression; fixed by adding the package-section H2, not by weakening accessibility tests. Later complete runs pass. New tests cover guide-prefill validity, native/no-script behavior, desktop/tablet navigation, truthful external examples, real-data cards and shared indexing safeguards.

Launch remains separate: client screenshot permission, original-logo approval, hosting/commercial terms, owner delivery/retention choices, provider/account/security/real-receipt acceptance, real-device/assistive-technology checks and production deployment/indexing are still gates. No DNS, paid provider, remote GitHub operation, live enquiry or public deployment was performed.

## After launch: measure real customer acquisition

If analytics is approved and correctly configured, distinguish quote clicks, brief preparation and WhatsApp opening from an enquiry actually received. Use owner-confirmed qualified enquiries and won projects to assess acquisition; a click is not a customer. Compare like-for-like periods and traffic sources, investigate drop-offs and improve one meaningful friction point at a time. Do not claim a causal lift from a single lab score or a small uncontrolled change. No new analytics/provider activation is part of this redesign.

## Final verification record

Final recorded build/test work window: **16:39:35–17:13:38 UTC, 14 October 2026** (34m03s from a research checkpoint), followed by visual inspection and handover updates. All final code was rebuilt and the preview restarted.

- Typecheck, lint and review production build: passed.
- Unit/integration: **182 tests, 19 files passed**.
- Browser: **76 passed, no failed/skipped/flaky results**; final run about 2.1 minutes.
- Actual SEO audit: **19 public pages, 19 unique titles, 19 unique descriptions, zero findings**; generated sharing image HTTP 200.
- `npm audit --omit=dev`: **0 vulnerabilities**; `git diff --check` passed.
- Visual review: desktop/mobile home and expanded About, Contact, Services and Projects, including package and goal-guide layouts.

| Final review lab | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home mobile | 98 | 100 | 100 | 69 | 2.457s | 0 | 25ms |
| Home desktop | 96 | 100 | 100 | 69 | 0.541s | 0.0000913 | 173ms |
| Website development mobile | 98 | 100 | 100 | 66 | 2.354s | 0 | 74ms |
| Quote mobile | 98 | 100 | 100 | 66 | 1.959s | 0 | 124ms |

Intentional private-review noindex lowers the SEO category. Production crawling is unit-tested/configured but not enabled, deployed or Search Console-accepted. Lab results vary and are not a field Core Web Vitals or acquisition guarantee.

## Owner’s follow-up: more depth in the rebuilt preview

The owner clarified via the version question that the new preview still needed more depth. Further work expanded concrete buying information rather than adding fictional proof or generic promotional filler. Home now has a capability/task/scope section with a dedicated jump link; the main/business/e-commerce pages explain different real customer tasks and separately agreed functionality. About explains shared roles. Contact includes an explicitly adaptable starting message. Services exposes all existing deliverables and native working-style/exclusion detail. Pricing includes seven proposal checks. Handover content explains domain/hosting ownership, access, walkthrough and separately scoped support. Portfolio explains how to use the independent references without copying a whole platform.

A full browser run detected 320px Services and 390px Contact overflow caused by longer nowrap descriptive links and intrinsic grid sizing. Scoped wrapping and `min-width: 0` repaired the actual issue; no overflow-hiding rule or weakened test was used. New modules remain server-rendered with no data collection, API, paid tool or additional client component.

Latest verification: **187 unit tests (20 files), 77 browser checks**, lint/types/build/diff passed, actual **19-page SEO audit with zero findings**, production dependency audit **0 vulnerabilities**. Desktop and narrow-screen feature/message/service-scope screenshots were visually inspected.

Two local deeper-content Lighthouse runs: home mobile **89 and 92**, desktop **90 and 86**; development mobile **97 and 98**; quote mobile **98 both times**. Accessibility/best practices **100** in every run. Home-mobile LCP **2.533s and 2.463s**, CLS **0**, TBT **366ms and 278ms**. These supersede the older homepage score for the latest content. The larger blocking time is disclosed as a performance follow-up, not concealed or attributed to a proven cause. Current script savings remain ~28KiB of framework JS; no new client framework or external asset was added. Production/device field performance and acquisition outcomes remain unverified.

## Subsequent service/advertising clarification

The owner clarified that Growthly is website-first, not website-only. Full separate supporting-service sections and dedicated canonical ad pages are implemented. Read [SERVICE-AD-LANDING-PAGES.md](SERVICE-AD-LANDING-PAGES.md) for current routes, contact context, deployment cautions and the latest evidence. Its **199 unit/86 browser** results and per-route performance supersede earlier totals here. All prior research/permission/privacy safeguards remain; no new external performance, conversion or client claims were introduced.
