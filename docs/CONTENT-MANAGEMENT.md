# Owner content management

**Status — 15 October 2026:** implemented locally, not activated on a remote account or deployed. Real Supabase Auth, migrations, Storage and hosting still need owner-approved setup and acceptance. This coding session is closed for remote GitHub operations; start a new coding session for the one-time publication/setup. Ordinary supported content updates after that use the website editor, not coding sessions.

## What the owner can update

Sign in at **`/admin/login`**, then open **`/admin/content`** (also linked from the lead dashboard).

| Section | Editable information |
| --- | --- |
| Projects | Add/edit/remove/order work; name, URL slug, service, real client versus self-initiated demonstration, category, optional public website/video link, summary, delivered scope, purpose, design decisions, limitations, one image, permissions and Home spotlight |
| Contact & pricing | WhatsApp number, alternative phone, footer tagline and the three website starting prices |
| Page text | Home headline/emphasis/introduction, About introduction and Contact introduction |
| FAQs | Website FAQs shared by Home/website pages and separate FAQs for each supporting service |
| History | Last 20 saved revision summaries; restore a selected revision **as a draft** |

This is the existing **broad administrator role**, not a restricted VA workspace. It includes access to the lead dashboard. **Do not share the owner account, grant the VA `admin`, or give anyone a service-role key.** No VA account/access has been enabled. The deferred VA workflow remains a separate decision.

Package inclusions, first-year domain/hosting offer, contract terms, service definitions, logo and page structure are not freely editable here. Changes outside these forms may still need development. Prices are starting guidance for new enquiries, not automatic changes to signed proposals.

## Normal updates: draft → review → publish

1. Choose a section and edit its labelled fields. Content is plain text, not HTML or executable code.
2. **Save draft** stores a private database revision. It does not change the public site. Use **Go to save / publish** to jump to the actions on long mobile forms.
3. Review the changes. Projects have a private text preview; images use the authenticated preview route. FAQ answers have a token-expanded text preview. This is not a complete unpublished clone of the public website.
4. For a project, complete the required public copy, select **Include this project on the next publication**, and confirm truthful description/publication permission. Confirm image rights separately if an image is present.
5. If any starting price differs from the current publication, review all three and check the additional pricing confirmation. This is still required after saving/reloading an unpublished price draft.
6. **Publish changes** publishes the whole current snapshot, including all included projects and settings. Once the CMS is activated, new public page requests use it without a code change, rebuild or redeployment. Reload an already-open public page; a browser may still have its previous content.
7. Open the public site and check the affected page, contact links and prices. Nothing has been sent to a customer simply by publishing.

Until **Save draft** succeeds, edits exist only in the open page's memory. There is no autosave or localStorage content database. The browser warns about leaving with unsaved changes; keep the page open if a save cannot be confirmed. If another tab saved first, the editor rejects the stale revision instead of overwriting it: copy your unsaved text, reload and reconcile deliberately. If the network fails after a save/publish, inspect the latest revision/public site before retrying; the server operation might already have completed.

**Discard unsaved edits** returns to the last loaded draft, not necessarily the published version. It also clears any pricing approval. **History → Restore as draft** does not change the public version and clears project/image publication confirmations. Recheck permissions, included projects, all settings and prices before publishing a restored snapshot. Older history remains in the private database; only 20 summaries are displayed, not automatically deleted.

## Adding a project without code

- Click **Add project**. A URL slug is suggested from the name until you customise it. Use clear lowercase words and hyphens. Public URLs are locked while a project is listed; avoid retiring/reusing them casually because no automatic redirect is created.
- Select the service actually provided. Mark self-initiated work as **demonstration**, never as a paid client. Do not invent clients, testimonials, results, functionality or live URLs.
- Enter the accurate summary, actual deliverables, purpose and decisions. Deliverables/decisions use one item per line. Incomplete **project** copy can be saved privately; included work must be complete before publication.
- An image is optional. Upload JPEG/PNG/WebP up to **2,000,000 bytes / 16 megapixels**. The server checks actual raster format, rejects animation/SVG, strips metadata and converts to WebP at a maximum 1600px dimension. Supply meaningful alt text, source credit and genuine permission before publishing. Ticking a box records the owner's assertion; it does not obtain or prove legal permission.
- Video uses an optional external HTTPS sample link, not an uploaded/automatically embedded player. Use genuinely public links, not signed temporary URLs, private/admin pages or credentials.
- **Feature this website on Home** allows one included genuine client website. Demos/other services cannot replace the website-first Home spotlight. Unchecking every feature uses honest general website guidance instead; it does not silently re-feature StarXCO.
- Removing a project/image from the draft affects the public site only after publication. Removing the reference does **not** erase its private stored file or history.

**First seed:** sole existing project StarXCO, text only, with `image: null`. The permission-pending screenshot is not automatically imported or approved. No new projects were fabricated. Naming/project description and image permission remain separate responsibilities.

## Contacts, introductions and FAQ prices

Use a Nigerian number such as `08129391626` or `+2348129391626`, without spaces. Published contacts update WhatsApp/phone links, contextual brief destinations and organization contact data. Keep the Contact introduction's **`{{service}}`** token to name the visitor's selected service. Ad-specific CTAs and `/aiads` continue to use their correct service context.

Starting prices remain **₦100,000 / ₦200,000 / ₦300,000** until the owner explicitly edits and publishes them. Business Website stays Recommended; the domain/hosting year-one offer and written-scope caveats do not change with a price edit. The forms require positive whole-naira amounts in ascending package order.

Use these tokens in editable FAQ answers so future price changes remain consistent:

| Token | Default display |
| --- | --- |
| `{{starter_price}}` | From ₦100,000 |
| `{{business_price}}` | From ₦200,000 |
| `{{ecommerce_price}}` | From ₦300,000 |
| `{{starter_amount}}` | ₦100,000 |
| `{{business_amount}}` | ₦200,000 |
| `{{ecommerce_amount}}` | ₦300,000 |

Existing trusted FAQ defaults are seeded with amount tokens. **Arbitrary manually typed amounts in custom answers are not automatically rewritten**: an advertising budget must not change because a website price changed. Use tokens for website fees and review custom copy when repricing. Budget-preference bands are visitor preferences, not package price claims. Contacts/settings/FAQ fields must be valid before saving; incomplete FAQ questions/answers must be finished or removed, unlike incomplete private project copy.

## One-time setup — authorised operator only

Do not run these remotely until the owner approves the provider/account/cost and deployment work. Prefer the existing approved Supabase project; no new account, paid plan, DNS or email change is required by this implementation.

1. Back up and inspect existing migration state. The CMS uses the existing `public.is_growthly_admin()` helper from `202610100001_create_inquiries.sql`. Apply that base migration only if not already applied; it creates the existing private enquiry schema but **does not activate lead collection**. Do not blindly rerun existing migrations/policies.
2. Apply `202610150001_site_content.sql`, then `202610150002_private_project_storage.sql`. The latter requires Supabase's real Storage schema. Verify the `growthly-project-media` bucket is **private**, with WebP/2MB limits and administrator-only policies. Content/history are private; publication is read through the server, not an anonymous database grant. Optional enquiry-idempotency/shared-limiter migrations are separate, not prerequisites for CMS editing.
3. Create/verify the owner's Auth account using the trusted provider console. Grant `app_metadata.role = "admin"` to the exact authorised user, following [INTEGRATIONS.md](INTEGRATIONS.md). Never rely on editable `user_metadata`. Sign out/in to refresh claims. This application uses the existing password login; it does not implement an application MFA challenge. Protect the provider console and owner credentials appropriately.
4. Store `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and server-only `SUPABASE_SERVICE_ROLE_KEY` in the host's secret/environment dashboard. Never put the service key in a `NEXT_PUBLIC_` variable, browser storage, repository or chat. All required auth/server values must exist for the editor. Keep `SITE_CMS_ENABLED=false` and **`ONLINE_INQUIRIES_ENABLED=false`** during preparation.
5. Deploy the prepared application to an owner-approved preview. Sign in, verify owner-only editor access, save drafts/upload a permission-cleared test image and publish the reviewed initial snapshot to the content store while the public CMS switch remains off. Opening the editor alone creates no CMS revision or publication.
6. Verify live Auth/RLS/Storage/private routes using owner, non-admin and anonymous requests. Check CAS conflicts, draft privacy, permissions, current-publication image withdrawal, price confirmation, publication/restore and new project URLs/sitemap. Use synthetic test data and remove it appropriately. Local mock/PGlite checks below do not replace this acceptance.
7. Set **`SITE_CMS_ENABLED=true` in the chosen deployment's build and runtime environment**, then make the one-time fresh build/deployment. The enabled build changes public pages/sitemap to request-time rendering. Merely changing a runtime variable on an old static build is not sufficient. After activation, routine supported publications need no further deployment.
8. Verify the actual hosted routes, new publication, contact receipts and media withdrawal, backups, request limits and hosting/provider capacity/cost. CMS-on rendering makes the database part of public-page availability and uses server/database reads. Review hosting commercial terms and free-plan limits; no free/unlimited service is promised. Keep preview indexing off; indexing/public release is a separate owner approval.

**Independent opt-ins:** CMS credentials and `SITE_CMS_ENABLED` do not opt into collecting website enquiries. Keep `ONLINE_INQUIRIES_ENABLED=false` for WhatsApp-only operation. Enabling online submissions additionally requires explicit approval, live delivery/privacy acceptance and the existing configured provider. No Resend sender, DNS/email integration, analytics tag, campaign, VA role or retention period was activated by this work.

## Safety, availability and cleanup limits

- Existing server-verified owner role, administrator RLS and private APIs protect drafts/history/media. Writes are same-origin, body/time/rate bounded and use an atomic revision comparison/row lock. Strict schemas reject HTML, extra fields, invalid prices and unregistered image dimensions/references. This is local hardening, not an independent penetration test or legal certification.
- Public reads select the **published** snapshot only and filter hidden projects. Client settings contain public contacts/prices/tagline and a published-project path/service map for matching navigation/WhatsApp context, not draft text/history/credentials. New approved project routes and sitemap entries are runtime-driven. Public pages still render without JavaScript; the editor requires it.
- If the CMS is enabled but published content/provider is missing, invalid or unavailable, content pages fail closed with a generic unavailable/retry view and contact actions are suppressed. They do not silently restore withdrawn default projects/contact links. Next streaming can commit HTTP headers before an error; do not treat the error view as a guaranteed custom 503 on every page. Media outages return 503. A repaired valid publication is read on new requests. Turning the CMS off is a deployment rollback to old code defaults, **not** a safe instant content withdrawal; review the old content first.
- Image sources stay in private Storage. Public proxy requests check current publication/permission, use `private, no-store`, `nosniff`, `noindex` and `no-referrer`; CMS/review/API paths are also blocked from Next's shared image optimizer. This stops new app-served requests after withdrawal, not copies/screenshots already downloaded elsewhere.
- Successful uploads can be orphaned by abandoning/removing a draft. History may still refer to them. No automatic retention period, deletion scheduler or file-manager cleanup UI is adopted. An authorised operator must check the current draft, publication **and all history** before removing an unreferenced registry row and private object, and manage backup retention separately. Never clear the whole bucket as routine cleanup. A failed registry insertion attempts to remove its just-uploaded object; provider failures can still leave an orphan.
- Do not put customer enquiries, passwords, bank/payment details or private permissions evidence into public-copy fields. There is no assigned-only VA portal or automatic regulatory compliance guarantee.

## Local verification and reproduction

`npm run typecheck`, `npm run lint`, `npm test` and `npm run build` are the baseline. CMS unit coverage includes real isolated PGlite RLS/CAS tests, a **minimal simulated Storage SQL schema**, mocked API/provider boundaries and actual sharp image parsing/re-encoding. They are not tests against a real Supabase project.

The browser harness is deliberately outside Next's `app/` tree. It exposes **synthetic/mock** endpoints only when explicitly started, has no real sign-in, and must never be deployed or connected to real data:

```sh
# Terminal 1: QA fixture only
npm run test:cms:harness
# Terminal 2: build and serve a CMS-on app against the local mocked provider
SITE_CMS_ENABLED=true NEXT_PUBLIC_SITE_URL=https://growthly.com.ng \
 NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:3001 \
 NEXT_PUBLIC_SUPABASE_ANON_KEY=synthetic-anon-key \
 SUPABASE_SERVICE_ROLE_KEY=synthetic-service-key npm run build
SITE_CMS_ENABLED=true NEXT_PUBLIC_SITE_URL=https://growthly.com.ng \
 NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:3001 \
 NEXT_PUBLIC_SUPABASE_ANON_KEY=synthetic-anon-key \
 SUPABASE_SERVICE_ROLE_KEY=synthetic-service-key npm start -- --port 3002
# Terminal 3: separately gated tests
CMS_TEST_URL=http://127.0.0.1:3001 CMS_RUNTIME_URL=http://127.0.0.1:3002 \
 npm run test:cms:browser
```

Stop the test servers and rebuild the normal configuration before leaving a general preview. These localhost URLs are **test/server-side only**, never browser-facing deployed backend URLs. CMS browser specs skip when the explicit harness variables are absent. See [CMS-IMPLEMENTATION-2026-10-15.md](CMS-IMPLEMENTATION-2026-10-15.md) for the final measured results and remaining live gates.
