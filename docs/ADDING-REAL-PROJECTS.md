# Add the owner’s real projects tomorrow

> **Current image caveat — 15 October 2026:** the four supplied `project-assets/starxco*.webp` entries were binary placeholders and were excluded. No image bytes are present; keep `PROJECT_IMAGE_REVIEW_MODE=false` and screenshot publication disabled. Owner approval to present StarXCO as a project does not approve its screenshot.
>
> **Preferred current workflow:** after the one-time setup in [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md), the owner adds projects, images, accurate copy and permissions through `/admin/content` → Save draft → Publish. No project-by-project coding or client analytics-list update is needed. The coding/configuration steps below are legacy fallback instructions while CMS is disabled; editing those files does not replace a CMS-on publication. Only genuine, permission-cleared work should be published. No new project has been fabricated.

The redesigned website deliberately keeps **only StarXCO** as Growthly client work. No new client, demo, result or placeholder project has been invented. Independent references live separately in `config/customer-journey.ts` and must never become client cards.

## Information to supply for each real project

- Client/project name and a unique lowercase, hyphenated slug.
- Verified public live URL, or discuss how to represent work that is not public—do not manufacture one.
- Business category and the Growthly service actually supplied.
- Short accurate summary and a useful overview.
- The customer task/design purpose, actual design/content decisions and actual delivered scope.
- A limitations note: for example, live-site changes or functionality that has not been independently tested. Only include measured outcomes with permission, a defensible source and an accurate measurement context.
- Permission to name/show the work and, separately, rights/permission for any screenshot, logo or photo. An owner supplying an image does not automatically establish client publication permission.

## Where the content goes

1. Add the real entry to `projects` in `config/content.ts`, following the `ClientProject` type. Keep StarXCO first unless the owner explicitly chooses a different homepage spotlight. Cards and case-study categories, summaries, purpose, decisions and scope now read the entry’s fields.
2. The existing case-study route, generated static parameters and canonical sitemap will pick up the entry automatically. Do not create a fake manual case-study page.
3. Update `publicProjectSlugs` in `config/public-route-ids.ts`; this intentionally lightweight client list avoids shipping image schemas and full portfolio content in analytics bundles.
4. Images are optional. A truthful text-only card is preferable to a fictional screenshot. Approved images need a local optimised file, actual dimensions, contextual alt text, source credit and a correctly registered manifest entry. Do not hotlink client assets.
5. `scripts/prepare-starxco-image.mjs` and the private review-route filename allowlist are **StarXCO-specific**. Do not blindly use them for another client or loosen private access gates. Either keep a new entry text-only until approval or implement and test its explicit local importer/review handling separately.
6. Never flip `permissionConfirmed` merely to make a picture appear. The current StarXCO manifest remains unapproved, but this checkout contains no real original/variant bytes. Keep them hidden and review mode off; only after a genuine image and specific rights are confirmed may a separate review be considered.

## Recheck before release

Run standard checks with screenshot review disabled. The review-mode commands below apply only after a genuine asset is present and screenshot-specific permission is confirmed; they are **not** for the current checkout.

```sh
npm run lint
npm run typecheck
npm test
npm run build
# Only after a valid, permission-cleared image is supplied:
PROJECT_IMAGE_REVIEW_MODE=true npm run build
PROJECT_IMAGE_REVIEW_MODE=true npm start
# In a separate shell, against that review server:
PROJECT_IMAGE_REVIEW_MODE=true npm run test:browser
node scripts/audit-public-seo.mjs
node scripts/measure-performance.mjs
```

Current tests intentionally assert one real project and 19 public routes. When the owner supplies a genuine addition, update those expected inventories deliberately, keep all permission/no-demo/metadata/accessibility protections, and verify the actual new case study, image, link and sitemap destination. Do not weaken assertions to hide a broken new entry.

A review build is not a production release. Rebuild with review mode off only after all launch approvals and permissions. Remote GitHub operations are unavailable in this closed session; publication work requires a new coding session, with the saved local changes preserved.
