# Growthly — short, real-work-only website update

> Later image update, 14 October 2026: the external StarXCO image described below has been removed. Current project is intentionally text-only until the owner supplies a genuine permitted image. Local import/loading preparation is complete; see [PROJECT-IMAGE-HANDOFF.md](PROJECT-IMAGE-HANDOFF.md). This historical summary is not proof that an image is installed.

13 October 2026. Implemented locally in `/home/user/Growthly`. No remote push, PR or production deployment was attempted; this coding session remains closed for remote GitHub operations.

## Owner request and decisions

Remove all demo work, remove Daily Life Review, keep one StarXCO project with a front image, fix spacing around the quote action, make mobile-menu quote text white, and make the website as short and meaningful as practical. Visitor intent takes priority: understand the offer, see the price, check actual work, request a quote.

This request overrides earlier instructions to display Daily Life Review and separately labelled fictional concepts. Do not restore those entries from old handovers.

## 1. New homepage section hierarchy

The homepage now has **four main sections**, down from nine:

1. **Offer + project proof.** Required headline/supporting message preserved; multi-page websites from ₦100,000 and the first-year domain/hosting offer are visible immediately. Three brief benefits are followed by a clearly spaced quote action. One StarXCO project sits alongside the offer, replacing the fictional hero mockup. No second project section repeats it below.
2. **Packages and prices.** Starter from ₦100,000, Business from ₦200,000, E-commerce from ₦300,000. Compact cards show core inclusions and each package’s free .com.ng domain/hosting for year one. A plain link leads to full pricing/renewal details. Removed redundant positioning paragraphs from compact cards; quote buttons align along the bottom on desktop.
3. **Process + key questions.** Three concise steps—share brief, approve scope, build/review/launch—sit beside three collapsed questions on price, timing and domains. They stack naturally on mobile. No separate long process section or full eleven-question FAQ list on the homepage.
4. **Final quote action.** Required closing headline retained, with breathing room before the button. The existing footer follows; phone, legal and secondary-route access remain available.

Removed homepage-only standards strip, large solutions grid, secondary-services promotion block, duplicated project section, separate Why Growthly section, four-step process section, industry grid and lengthy FAQ block. Useful dedicated routes remain accessible rather than forcing every visitor to scroll through all information.

Added **Pricing** to primary navigation, including mobile, so cost-led visitors can go directly to packages.

## 2. Real work only

- `projects` now contains **exactly one entry: StarXCO**.
- Daily Life Review removed from portfolio data, homepage, portfolio listing, About copy, metadata and sitemap.
- Kora Botanics, Abeni Stay and Ayo Studio removed from portfolio data and public pages; their three unused demo SVG files were removed as requested.
- Fictional Kora hero illustration replaced with the single real-project component.
- `/portfolio` now lists one project. There is no demonstration-work section, mock client history, duplicated project entry or fictional case-study copy.
- `/portfolio/starxco` is now a concise real case study: overview, image, visible scope and live-site link. Repeated explanations and long disclaimer blocks were removed while a truthful short results/delivery disclaimer remains.
- Removed project paths `/portfolio/daily-life-review`, `/portfolio/kora-botanics`, `/portfolio/abeni-stay`, `/portfolio/ayo-studio` return genuine **404** responses. They are not disguised as other projects or left indexed in the sitemap.
- Legacy `/work` and approved project redirect behaviour remain functional.
- Terms no longer discuss fictional portfolio demonstrations. About copy reflects StarXCO only; its redundant process section was removed.

StarXCO is one portfolio record. Its listing, homepage proof card and linked case study refer to that same project; those normal navigation destinations are not additional projects.

## 3. Front-image work — exact limitation

The StarXCO public homepage was read successfully through the page-fetch tool. It identifies its actual hero photo:

`https://starxco.com.ng/assets/img/hero.jpg`

Description: container terminal at dusk with gantry cranes, containers and a cargo ship. That **real homepage photo URL** is configured in the project data and used by the shared front-image component. It is not AI-generated, copied competitor imagery, a fictional mockup, or a browser screenshot.

**This sandbox could not download or browser-load the photo:** direct HTTPS access failed with an SSL/network error under the restricted network environment. Image search also found no matching result. Therefore local screenshots show an honest “Homepage image unavailable” fallback with the live-site link intact. No claim is made that original photo bytes or a complete front-page screenshot were captured, cached locally or verified.

The image uses a stable aspect ratio, meaningful alt text, no-referrer request policy and error handling. It loads directly from StarXCO when reachable in a visitor’s browser. Privacy copy now explains the third-party image request. Tests verify both successful rendering **with mocked image bytes** and explicit network-error fallback; these tests do not verify public image availability or image licensing.

**Next action for a guaranteed local image:** obtain an owner-authorized homepage screenshot/photo file or, in a session with permitted network access, capture/download the genuine asset, confirm reuse permission and optimize it into `public/images/`. Update the central project image path, then rerun mobile/desktop rendering checks. Do not generate a fake screenshot to fill the gap. If the owner wants a complete website-front screenshot rather than its photo, capture the real homepage or ask for an authorized screenshot.

## 4. Spacing, colour and layout corrections

- Hero benefits now appear before the quote button, separated by **28px**. Automated checks assert at least 24px on mobile and desktop.
- Mobile navigation’s quote text is explicitly **white**, including hover and current-page states; keyboard focus was checked too.
- Mobile menu accessibility was tested while open, not just on the closed desktop page.
- Added spacing around the closing quote action and the quote-page safety note.
- Reduced oversized marketing section padding, tightened card/header spacing and shortened the footer’s padding without shrinking text into unreadability.
- Compact package cards no longer show five repeated scope/timing/renewal rows. The detailed pricing page retains those details behind native accessible **“Scope, timing & separate costs”** disclosure controls.
- Renewal charges and separate content/email/maintenance/provider fees remain visible in shared pricing guidance; the free offer is never presented as lifetime hosting.
- Aligned package quote buttons; compact inclusion text remains readable and wraps naturally.
- Website development, business and e-commerce pages no longer repeat the large solutions/project/process blocks. Core service information, compact packages, key FAQ and quote action remain. A simple real-project link replaces repeated project cards on those pages.
- Pricing and About pages were shortened; quote-page spacing was reduced while validation, consent and safety guidance remain.
- Logo renditions and draggable WhatsApp functionality were preserved. No AI/FAQ chatbot was introduced.

## 5. Professional reference review

Public page content was fetched on this update:

- [CKDIGITAL](https://ckdigital.com/): clear website-design positioning, prominent consultation action, actual project/case-study links and website imagery. Adopted the principle of putting real work beside a clear service proposition—not their testimonials, client logos, years or results.
- [DPX](https://dpx.com.ng/en-us/): prominent entry-price guidance, scannable website packages, project links and service-specific navigation. Adopted price visibility and easy package comparison—not its claims, calculator, animations, awards, media or backlink offers.

This was a review of extracted public page structure/copy, not a new visual/mobile/performance audit of those companies. No competitor branding, code, imagery or unsupported business claims were copied. The goal is a shorter Growthly journey, not to reproduce every competitor section.

## 6. Measured reduction in page height

Measured in the same local Chromium/production-server environment, viewport height 900px, default closed FAQs/disclosures, before and after this update. Heights include header/footer. These are page-length measurements, **not Lighthouse scores, field performance or conversion-rate results**. The local StarXCO image fallback retains the image layout’s aspect ratio.

| Page | Width | Before | After | Reduction |
|---|---:|---:|---:|---:|
| Homepage | 390px | 14,011px | 4,499px | about **68%** |
| Homepage | 1440px | 8,662px | 2,472px | about **71%** |
| Website development | 390px | 12,458px | 5,178px | about **58%** |
| Website development | 1440px | 7,615px | 3,137px | about **59%** |
| Pricing | 390px | 7,134px | 4,758px | about **33%** |
| Pricing | 1440px | 4,032px | 2,679px | about **34%** |

Actual length varies with device, text rendering and opened details. More information remains available on demand rather than being forced into the initial sales journey.

## 7. Validation

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: **34 unit/integration tests passed**.
- `npm run build`: passed; only `/portfolio/starxco` remains generated under the portfolio route.
- `npm run test:browser`: **34 browser checks passed** (final full run 40.3s).
- `git diff --check`: passed.
- Route/metadata/link/image-state/overflow checks at **390, 768 and 1440px**.
- Automated axe checks on **13 remaining public pages**, plus a mobile-menu-open check.
- Explicit single-project, removed-route 404, four-section hierarchy, three-step process, three FAQ, CTA-spacing, white menu text, pricing-disclosure and image-error checks.
- Existing quote validation, honest WhatsApp handoff, API security, logo, redirects and draggable WhatsApp tests still pass.
- Desktop/mobile full homepage and mobile-menu screenshots inspected; pricing screenshots regenerated.

QA artifacts stay ignored under `artifacts/`, not committed as site content. Automated checks are not screen-reader certification. External WhatsApp activation/photo-success checks use mocks; no message receipt or live provider delivery is claimed. No new Lighthouse/production field metrics or ranking guarantees.

## 8. Files and handover

Main changes: `app/page.tsx`, `app/portfolio/`, `app/pricing/page.tsx`, `app/about/page.tsx`, `app/request-a-quote/page.tsx`, `app/terms/page.tsx`, `app/privacy-policy/page.tsx`, `app/globals.css`, `config/content.ts`, `components/HeroArtwork.tsx`, `ProjectPreview.tsx`, `ProjectCard.tsx`, `PackageGrid.tsx`, `WebsiteSalesPage.tsx`, `WebsiteSections.tsx`, `ProcessSteps.tsx`, `SiteHeader.tsx`, portfolio/browser tests and removed demo SVG assets.

README and next-session handover/prompt now reflect the removal decision. Earlier project/demo reports are historical and must not be used to restore removed work. Preserve all intended modified/untracked files when opening a new coding session. No DNS, nameserver, mailbox, hosting plan, paid provider, production branch or live deployment changes were made.
