> **Current asset status — 15 October 2026:** the supplied patch contained four `project-assets/starxco*.webp` entries identified as binary placeholders, not image data. They were excluded from checking and application. This checkout contains no usable StarXCO screenshot/image bytes; `permissionConfirmed` remains `false`, `PROJECT_IMAGE_REVIEW_MODE` must remain `false`, and normal/preview output stays text-only. The owner's approval to present StarXCO as a portfolio project does not confirm screenshot-specific rights. Do not treat the historical private-WebP or responsive-variant reports below as current evidence; do not enable image review until real bytes and explicit screenshot permission are available.

Historical image-review performance notes below describe a different saved workspace state. They are not a reason to enable review mode or publish a screenshot in this checkout.

# StarXCO image — current safe state and next steps

Updated 15 October 2026. No usable project image is present in this checkout. Screenshot publication and review mode remain disabled; the project stays text-only. Earlier claims below about an installed private WebP and responsive variants are historical records from another workspace state, not evidence for this tree.

## Current screenshot status — 15 October 2026

The four supplied `project-assets/starxco*.webp` patch entries were binary placeholders, not image data, and were excluded from compatibility checking and application. The image manifest still has `permissionConfirmed: false`; the safe defaults keep the screenshot hidden. The guarded `/review-media/` route returns 404 when the source asset is absent. Do not set `PROJECT_IMAGE_REVIEW_MODE=true`, build a screenshot-review preview, or publish an image from this checkout.

The owner approved presenting StarXCO as portfolio work, but screenshot-specific rights remain unconfirmed. Once a valid original image is supplied and the owner confirms its specific use, use the import workflow below, verify the actual image bytes and visual fit, and request a separate visual approval. Never use a placeholder or synthetic test fixture as portfolio artwork. Original Growthly-logo approval remains a separate gate.

## Owner’s part — image and permission, not technical editing

The prior handoff recorded an upload, but its image bytes are not present in this checkout; the supplied `.webp` patch entries are placeholders and were excluded. Please supply a genuine image again only when ready, using the secure workspace upload flow rather than pasting private material into chat. Original input guidance: one genuine StarXCO desktop-homepage first-screen screenshot (preferred), or an original homepage photo you are allowed to use. PNG/JPEG/WebP/AVIF is fine; ideally around 1200–1600 pixels wide, at least 640×360 and landscape. Avoid private/admin information, chats, passwords and browser toolbars.

1. Confirm that Growthly has permission to use this specific screenshot/photo in the public portfolio. State whether it is a **website screenshot** or a **homepage photo**, and provide source/credit or any licence restriction you know about. A photo must not be labelled a website screenshot. The owner's approval to present StarXCO as portfolio work is not a substitute for screenshot-specific rights.
2. Approve the resulting crop/readability once the actual image is installed. You do **not** need to compress, rename, write alt text, edit code or buy an image service; the coding agent will handle that with you.

The existing supplied-logo rendition is unchanged. Original logo-file/approval work is a separate remaining audit item; it is not required to upload the StarXCO image.

## Initial preparation — historical, before successful upload

- Checked saved assets: no genuine StarXCO raster/screenshot was present; only logo SVG renditions were available.
- Removed the external `starxco.com.ng/assets/img/hero.jpg` hotlink. No image fetch depends on the client’s server.
- With no supplied asset, homepage/portfolio show a compact text-only project card; the case study has no empty figure, failure panel, fabricated screenshot or misleading photo credit. Project details/live links remain usable.
- Added a strict local manifest reader. Remote/traversal/wrong-project sources, absent permission, unusable dimensions and incomplete alt/credit metadata cannot enable an image.
- Prepared `npm run prepare:starxco-image`: local raster validation, EXIF orientation correction, non-upscaling resize, WebP compression with a 400 KB output ceiling, EXIF removal and manifest registration. It requires permission/kind/alt/credit; `--check-only` does not change the site, and existing assets require explicit `--replace` approval.
- Prepared responsive Next.js local-image optimisation, intrinsic aspect-ratio reservation, full-image display, truthful kind/credit and safe load-error handling.
- Regression QA: lint/typecheck/production build, **74 unit/integration tests (10 files) and 56 browser tests passed**. Default axe + explicit label-name checks still pass across all 19 sitemap routes. The 320px home/portfolio/case-study probes found no overflow or external project-image request. Desktop/mobile screenshots were inspected.

Tooling tests use synthetic rasters and check-only processing; they are not real portfolio assets. No image was imported during this initial preparation; the manifest was then empty. The current pending-review registration above supersedes that state. The currently exercised browser state is intentional text-only work; registered-image browser branches will run after a genuine asset is installed. No deployment, live receipt, licence certification or fresh Lighthouse score is claimed.

## Installation/release workflow — only after real image and screenshot-specific approval

1. Inspect the actual pixels/source and owner permission. Confirm screenshot versus photo; do not invent provenance.
2. Run the import with an accurate visual description and source credit, first using `--check-only` if needed:

```bash
npm run prepare:starxco-image -- "/path/to/approved-homepage.png" \
  --kind screenshot \
  --alt "Accurate description of the visible StarXCO homepage" \
  --credit "Actual owner-confirmed source and permission credit" \
  --permission-confirmed
```

Use `--kind homepage-photo` for an original photo, not screenshot. These are instructions, not a claim that the example source file exists. Do not run on a generated/dummy image to fill the portfolio.

3. The script writes `public/images/projects/starxco.webp` and the registration in `config/project-images.json`. Review both intended Git additions; do not commit original bulky/private input files or QA fixtures. Rebuild: image metadata is compiled into the site.
4. Run the full tests and verify actual local WebP and `/_next/image` responses, readable content/alt/credit, mobile/desktop fit and the error state. Browser tests support both manifest states; transport mocks are not a substitute for the real loading check.
5. Show the owner the finished preview for image approval. Recheck performance with the actual image. Publish only in a new authorized coding session, then verify the image on the real production domain. This closed session cannot push or deploy.
