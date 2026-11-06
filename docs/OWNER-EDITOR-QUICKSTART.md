# Growthly owner editor — team, text and images

## What is available

The existing owner workspace at `/admin/content` now has a **Team** section alongside Projects, Contact & pricing, Page text, FAQs and History. The About page starts with the four names and responsibilities supplied by the owner. Photos are optional; initials are used until a permitted photo is published.

Once real content storage is configured and the public CMS is activated, supported edits appear on new page requests without another code change or rebuild. The editor remains an owner/admin workspace. Adding Omo Wunmi or another person to the website does not give that person an account or access to customer enquiries.

## One-time setup still required for real saving

The local mocked test harness demonstrates interactions but is not a real owner account or persistent production database. No real provider was provisioned by this change.

1. Use the actual Growthly Supabase project. Follow [Content Management](CONTENT-MANAGEMENT.md) for the existing base inquiry/admin, content and private Storage migrations and their order. Team data is additive JSON inside the existing content document; no new team table or team-specific database migration is required.
2. Create or identify the real owner in Supabase Auth. Use the existing server-verified `app_metadata.role = admin` boundary; do not grant that broad role to assistants merely to publish a staff profile. Set passwords and account details securely in the provider, never in chat or source files.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, the appropriate `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the server-only `SUPABASE_SERVICE_ROLE_KEY` through secure environment/host settings. Keep the service key server-only. The project hostname must be allowed by the environment network policy. The existing platform may use destination-scoped proxy bindings, so confirm actual supported authentication rather than copying credentials into a file.
4. Keep `SITE_CMS_ENABLED=false` and `ONLINE_INQUIRIES_ENABLED=false` during preparation. Sign in through `/admin/login`, open `/admin/content`, review the initial document and save a draft. On an older stored document, Team may be empty: **Load Growthly starter profiles** adds the supplied names as drafts for review; it does not publish them automatically.
5. Confirm real Auth, RLS, Storage and owner-only access. Test with synthetic information, including draft privacy, save conflicts, valid photo upload and withdrawal. Publish the reviewed initial document to storage while public CMS is still off.
6. Enable `SITE_CMS_ENABLED=true` in the intended build and runtime settings for one approved deployment, then build and verify that publication. This does not enable online enquiry collection. Keep preview indexing disabled. Deployment itself requires approval.

Do not turn the public CMS on before a valid publication and provider connection exist: the application fails closed rather than silently serving withdrawn defaults.

## Editing a team profile

1. Select **Team**, then a person, or **Add team member**.
2. Enter the public name, role and short factual biography. A role template replaces role/bio with starter guidance; replace the guidance with accurate text before publication.
3. Optionally upload a genuine JPEG, PNG or WebP below 2 MB. Add a meaningful description, source credit and confirm photo publication rights. The server checks the image and strips metadata during WebP conversion. Uploaded photos are private until included in a valid publication.
4. Confirm profile permission and choose **Include this team member on the next publication**. Use Move earlier/later to change the order. Uncheck inclusion to hide a person; remove only if you intend to remove the draft entry.
5. **Save draft** stores private work. **Publish changes** publishes the whole reviewed snapshot, including other pending edits. Check all sections and any price-change confirmation first.
6. Reload About and inspect the actual result on a phone. A previously downloaded photo cannot be recalled, but the app stops serving new requests for a withdrawn, unreferenced image.

History restoration creates a draft and clears project/profile/photo permissions for re-review. Do not assume restoring history immediately changes the public site. If save confirmation fails, retain your unsaved text and inspect the current revision before retrying.

## Images and remaining owner inputs

- **Team photos:** upload real permitted files when available; the site can work with initials meanwhile.
- **StarXCO:** screenshot publication permission is recorded from this conversation, but valid image bytes are still needed. Apply the saved network access settings to allow a genuine site capture, or supply a real screenshot. Do not publish fabricated imagery or enable the old pending-image review flag merely to fill the space.
- **Identity:** confirm public spellings and role wording in Team before the real first publication.
- **Live checks:** verify the public release and actual WhatsApp/phone receipt before advertising. Button tests do not prove delivery.

The saved environment network draft includes Growthly, the six audit reference sites and StarXCO (with `www` variants). Applying it is separate from publishing the environment or deploying the website. The actual Supabase project domain can be added once known; do not invent it.

## Validation commands

From the repository root: `npm run lint`, `npm run typecheck`, `npm test -- --maxWorkers=4`, `npm run build`. With a normal production server running, run `npm run test:browser` and `npm run audit:seo`.

For isolated CMS editor/runtime validation, follow the mock-harness commands in [Content Management](CONTENT-MANAGEMENT.md). These tests are explicitly not live Supabase acceptance. Keep the harness out of deployment.
