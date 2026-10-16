> **Latest separation of concerns (15 October 2026):** Supabase credentials may support the [owner CMS](CONTENT-MANAGEMENT.md) without enabling enquiry collection. `ONLINE_INQUIRIES_ENABLED=false` is the default; enable it only after explicit delivery/privacy approval and live acceptance. `SITE_CMS_ENABLED` separately controls public content. No live migration, Auth account, bucket, delivery provider or VA access was activated. Prefer an existing approved project; do not create/buy a new provider account or change DNS/mail merely to follow historical examples below.

> **Current activation authority (14 October 2026):** [LOCAL-AUDIT-IMPROVEMENTS.md](LOCAL-AUDIT-IMPROVEMENTS.md). Keep WhatsApp-first; no workflow/retention selection was adopted. Optional shared-limit and retry migrations are prepared but not applied/enabled. Forwarded headers require explicit, verified host trust. GA4 also requires owner enablement (`NEXT_PUBLIC_ANALYTICS_ENABLED=true`) plus visitor opt-in; **Google Ads tags/conversions are disabled**, and historical Ads ID placeholders below do not activate them. Real provider/RLS/multi-instance/session/measurement/cost checks remain required before activation.

# Existing Supabase and Resend setup

Preserved integrations; no live provider credentials were available in this workspace. Optional website requirements are stored in the private brief, so the existing migration remains compatible.

## Supabase setup: lead storage and secure admin

1. Reuse the existing owner-approved Supabase project if available. Create a new project only after explicit account/cost approval, choosing a suitable region. Keep the project URL, public key and service-role key out of source control.
2. In the Supabase SQL Editor, run `supabase/migrations/202610100001_create_inquiries.sql`. It creates the private `inquiries` table, indexes, update timestamp trigger, row-level security and admin-only read/update policies. Public users cannot select or insert rows through the anon key; the public form inserts from the server with the service-role key.
3. In **Authentication → Users**, create an administrator with a unique, strong password and confirm the account email. Restrict who can sign in to the project; this dashboard implements email/password sign-in and does not include an MFA challenge flow.
4. From the trusted Supabase SQL Editor, grant that user the admin claim. Replace the example address with the exact account email:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
     || '{"role":"admin"}'::jsonb
   where email = 'owner@example.com';
   ```

   Do **not** put the admin claim in user-editable `user_metadata`. Only a trusted project administrator should run this SQL. Sign out and back in after changing the claim so the refreshed token contains it.
5. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to the hosting environment, then redeploy.
6. For CMS-only use, follow the CMS guide and leave online submissions off. For separately approved online delivery, set `ONLINE_INQUIRIES_ENABLED=true`, sign in at `/admin/login`, send a synthetic test inquiry, and verify it appears at `/admin`. Check that a non-admin Supabase user is denied and that a public/anonymous request cannot read the table.

The dashboard checks the user with Supabase Auth on the server and also queries/updates through the user-scoped Supabase client, subject to the database RLS policies. The service-role key is never used for admin reads or updates. The dashboard currently loads the newest 1,000 records; implement pagination before lead volume approaches that limit.

## Resend setup (optional)

1. Verify a sending domain with Resend and configure its required DNS records at the domain provider.
2. Create a restricted API key and add it as `RESEND_API_KEY` in the hosting secret settings.
3. Add the verified sender to `RESEND_FROM_EMAIL` and the owner/team inbox to `LEADS_EMAIL`.
4. Submit a test inquiry and verify the message arrives. If Supabase is also configured, verify the record exists even if notification email is delayed.

The message is plain text to avoid rendering untrusted form content as HTML. Do not enable a sender/domain until its owner authorizes use.

