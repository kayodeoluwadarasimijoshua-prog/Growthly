# Growthly studio redesign — 10 November 2026

The uploaded Stitch system supplied the visual direction. Growthly now leads with website development, graphic design and AI-assisted adverts, explaining scope, showing approved work and taking visitors to a relevant service enquiry. Social-media advertising remains a separate offered service; no completed campaign examples or results were invented.

## What changed

- Deep green/mint and warm neutral visual system, self-hosted Hanken Grotesk/Inter fonts, clearer navigation, genuine project previews and service-specific enquiry actions.
- Website, graphic-design and AI-advert portfolio galleries. Empty galleries say when no approved projects have been published. AutoVault remains explicitly a self-initiated demo; StarXCO remains client work with text until a genuine permitted image is available to this checkout/CMS.
- Gentle entrance motion, reduced-motion support, native disclosures and useful content without JavaScript. The site guide answers from published FAQs even without an AI provider.
- A restricted creative-editor workspace for graphic-design and AI-advert drafts, private images, factual notes, video links and submissions. The owner imports a copy into an unsaved CMS draft, reviews it and uses the existing publication process. Creative editors cannot publish, change prices, read enquiries or invite users.
- Owner-only creative invitations and a password setup flow, plus optional AI description suggestions and public questions. These require deliberate deployment configuration; no account, invitation, migration or paid AI request was performed here.

Existing published CMS content remains authoritative. The redesign does not silently replace a stored introduction or re-feature withdrawn projects. In **Page text**, **Use studio introduction** copies four reviewed introductions into the unsaved draft while preserving contacts, prices and projects. Review, save and publish through the existing editor.

## Claims and activation

Read [the complete removed-claims table](STITCH-CLAIMS-REMOVED.md) for unsupported metrics, credentials, guarantees, invented contact/office information and inflated project descriptions omitted from the export.

Read [the creative workspace setup guide](CREATIVE-WORKSPACE-SETUP.md) for migration prerequisites, server-controlled roles, the invite template, private uploads, owner review and optional AI configuration. The owner and friend identities are entered privately; email text alone never grants access. The corrected owner identity retains `admin`; the friend must receive only `creative_editor`.

AI, invitations, public CMS, online enquiries and analytics remain independently controlled. No production flag is silently enabled. Cloud configuration drafts do not configure Vercel automatically.

## Verification

- ESLint, TypeScript, normal and CMS-enabled production builds.
- 321 unit/integration tests across 40 files, including isolated PostgreSQL/RLS checks, cross-author restrictions, media ownership, stale revisions, Auth metadata boundaries, invite/password routes and AI failure/claim bounds.
- 8 CMS-enabled production runtime browser checks against the isolated provider: request-time edits, prices/contact consistency, public URLs/sitemap, private drafts, withdrawn media, provider outages and no-JavaScript output.
- 17 isolated component browser checks: 16 owner-editor checks and the creative-to-owner private submission workflow, including AI suggestion review. These use synthetic identities and mocked providers, not live Supabase accounts or mail.
- 105 public browser checks passed; the 25 private CMS/creative cases are intentionally gated in the public run and passed separately as the 17+8 checks above. Coverage includes service-specific journeys, enquiry privacy/failure modes, mobile/tablet/desktop layouts, accessible menus/forms, no-JavaScript content, reduced motion and automated accessibility scans.
- SEO audit: 23 public pages, 23 unique titles, 23 unique descriptions, no audit errors and a working Open Graph image.
- Final visual review identified the missing naira glyph in the Latin font subset; a licensed, self-hosted currency fallback was added. The small typography/arrow correction received a production rebuild and targeted visual/accessibility recheck after the full public suite.

Browser screenshots and machine-readable reports are local generated artifacts under `artifacts/stitch-redesign/`, excluded from Git.

## Limits

Real Supabase Auth/Storage/RLS deployment, invitation delivery, actual owner/friend login and model-provider acceptance still require verification on the configured services. No genuine StarXCO image bytes were available in this checkout; an approved public gallery must not use a placeholder as proof. Automated accessibility checks cover the tested routes, viewports and states and do not establish universal accessibility certification. Local measurements do not establish customer conversion or production performance guarantees.
