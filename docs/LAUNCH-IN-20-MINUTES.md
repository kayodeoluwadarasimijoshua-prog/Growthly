# Growthly: a 20-minute launch target

**15 October 2026. A target, not a guarantee.** This is for publishing the website with **WhatsApp-only enquiries, CMS off and permission-pending images hidden**. This checkout has no usable StarXCO image bytes: the four `.webp` patch entries were binary placeholders and were excluded. Keep `PROJECT_IMAGE_REVIEW_MODE=false`; screenshot publication remains disabled. Owner approval to present StarXCO does not grant screenshot-specific rights. Real CMS login/database/storage setup is a separate phase. Do not rush permission, hosting-cost, privacy or failed-test gates to meet the clock.

## Before you begin — preserve the actual new website

This session is closed for remote changes. The latest source is saved locally, but it is **not all committed/pushed to GitHub**. Vercel's Redeploy button only rebuilds code it already has; it does not collect Arena's local edits.

Transfer files prepared in this workspace:

- `artifacts/growthly-launch-transfer.patch` — cumulative tracked edits and nonignored new files, including source, migrations, approved/default content and private review assets. It does not contain `.git`, ignored environment files, node_modules, builds or QA outputs. Treat source/private review assets as business material; do not publish the patch on a public webpage.
- `artifacts/growthly-launch-transfer-manifest.json` — base commit, file list and patch checksum. No provider credentials are intentionally included; this is not a complete secret audit.

Download/save these before leaving the session, then attach them to the new coding session if the saved changes are not automatically carried forward. Use Arena's available file download/export controls; if unavailable, do not assume a new clone includes this work. Keep the present session accessible until transfer is verified.

The patch base is **`5f82cee41ecea0283d213acb8ea442e58d947e33`**. The new agent must inspect its current files and run a compatibility check before applying it. If changes are already present, do not apply them twice. If the base has diverged, reconcile carefully: **no reset/clean/discard of existing work**, no blind patch forcing and no switching away from the new session's assigned branch.

## Minutes 0–4 — start the new session and verify the source

Open a new coding session for the existing `kayodeoluwadarasimijoshua-prog/Growthly` repository. Attach the transfer files if necessary and paste this:

> Continue Growthly's approved deployment using this session's assigned branch. First preserve existing work and verify that the saved changes from the previous closed session are actually present. I attached a cumulative transfer patch based on 5f82cee41ecea0283d213acb8ea442e58d947e33; inspect it and use git apply --check before applying anything. If the work is already present, do not apply twice. If it conflicts, reconcile without resetting or discarding work. Do not deploy an older GitHub revision.
>
> Read docs/OWNER-DECISIONS-2026-10-15.md, docs/LAUNCH-IN-20-MINUTES.md, docs/LAUNCH-EXECUTION.md and docs/CONTENT-MANAGEMENT.md. I approve proceeding toward launch with the current starting prices and existing contact numbers; I will handle enquiries. Use the existing Vercel project and its existing Production Branch. Do not activate CMS, online lead collection, analytics, VA access, paid services or new providers for this first release. Keep pending screenshots hidden. Do not change DNS/nameservers or email. Do not invent business terms or retention periods.
>
> Verify commercial-hosting eligibility/cost with me before accepting any purchase. Run the available technical checks, push only the assigned session branch and use the existing PR/production workflow. Keep Preview noindex. After preview acceptance, arrange a fresh Production build with the intended Production environment, then verify the real domain, deployed commit, robots/meta/headers, sitemap, contact/quote service context and private routes. Stop if source transfer, account access, cost approval, privacy/terms or checks are unresolved. Report actual results; never claim a deployment or receipt that was not verified.

Ask the new agent to confirm that `components/AdminContentManager.tsx`, `lib/cms/schema.ts`, `scripts/check-launch-config.mjs` and the latest handover documents exist and that the app source matches the transferred work. Those filenames alone are not sufficient proof; inspect the diff/manifest too.

## Minutes 4–7 — open the existing Vercel project

1. Open **https://vercel.com/dashboard** and sign in to the account already used for Growthly.
2. Open the existing Growthly project. **Do not create a second project.**
3. Under project settings, inspect its connected GitHub repository and **Production Branch**. It must be the intended Growthly repository. Note the configured branch; do not assume it is named `main` or change it to an Arena working branch.
4. Confirm the current plan is eligible for this commercial website and review its costs/limits. Do not upgrade or purchase anything unless you explicitly accept the displayed cost.
5. Keep the existing domain/email configuration. If the domain is missing or invalid, stop for a targeted inspection instead of changing nameservers.

Vercel labels can vary. If you cannot sign in, find the project or verify the account/plan, the 20-minute target is blocked. Do not create replacement accounts to get around that.

## Minutes 7–10 — choose the safe first-release settings

In the project's **Settings → Environment Variables**, configure the following for **Production**. Add/update only the intended settings; do not delete unrelated existing secrets or integrations.

| Variable | Production first release |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://growthly.com.ng` — only if this is the existing intended production domain |
| `SITE_INDEXING_ENABLED` | `true` for the approved public release |
| `SITE_CMS_ENABLED` | `false` |
| `ONLINE_INQUIRIES_ENABLED` | `false` |
| `PROJECT_IMAGE_REVIEW_MODE` | `false` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `false` |
| `DISTRIBUTED_RATE_LIMIT_ENABLED` | `false` unless an existing approved setup has already been verified |
| `INQUIRY_IDEMPOTENCY_ENABLED` | `false` unless an existing approved setup has already been verified |
| `TRUST_PROXY_HEADERS` | `false` unless that host trust was explicitly tested/approved |

For **Preview**, keep `SITE_INDEXING_ENABLED=false`; the other safe first-release flags stay off. Do not set `VERCEL_ENV` manually; Vercel supplies it. Do not add Supabase keys or Resend settings just to make this WhatsApp-only first release work, and do not paste secrets into chat. Existing credentials can remain; their presence must not activate collection.

Inspect build settings rather than replacing working overrides blindly: Next.js framework, supported Node22, repository root containing `package.json`, install `npm ci`, build `npm run build`, default Next output. **Do not use a static export.**

Save environment changes before the fresh Production build. They do not retroactively fix an already-built deployment.

## Minutes 10–15 — checks, new source and preview

The new agent should use the transferred source on its assigned branch and run:

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Use `npm run launch:check -- --production` with the **intended Production process environment**. It does not read `.env.local` automatically; see its help/env-file instructions. A pass is configuration-only, never proof of deployment, DNS, permissions or receipt. Never change safe defaults just to silence a check.

Push the assigned session branch and open/review its PR through the repository's existing workflow. Vercel should build a Preview if the existing integration is configured. Inspect the new deployment's source commit and build result. If integration/build fails or the preview requires account authentication, use authorised account access; do not bypass protection or promote without checking it.

Preview checks: Home, Website Development, Services, `/aiads`, Portfolio, Pricing, Contact, the WhatsApp quote brief, Privacy/Terms and a genuine404. No fake projects, pending image, unapproved terms, online receipt claims or test fixture content should appear. Owner accepts the preview before public release.

## Minutes 15–18 — fresh Production deployment

1. Use the existing approved PR/Production Branch workflow. The agent must not push directly to another branch just to bypass it.
2. Merging the reviewed PR normally triggers Vercel's configured Production build. Verify this in Deployments; do not assume the integration ran.
3. If a manual redeploy is necessary, select the deployment/source revision that **already contains the new code**, and confirm Production environment and current environment variables.
4. Wait for **Ready**, verify its deployed source commit matches the approved new revision, and confirm the intended domain points to that deployment.

**Do not simply promote a noindex Preview build and assume it now has Production settings.** The production build must use the intended Production environment. Never redeploy an old successful commit merely because it is marked green.

## Minutes 18–20 — test the actual public website

Use your phone and a private/incognito browser window on **https://growthly.com.ng**, not localhost or only the Preview URL.

- Confirm the new homepage/logo, mobile layout, intended HTTPS domain and no redirect loop.
- Confirm starting prices **₦100,000 / ₦200,000 / ₦300,000**, Business Recommended and the scoped first-year domain/hosting wording.
- Open **`/aiads`**, follow its contact/quote path and confirm it stays about AI video rather than switching to website development.
- Send a real test WhatsApp message to **08129391626**, press **Send**, and confirm it arrives. Verify **09162994183** remains the intended alternative. A prepared brief/click is not a received enquiry.
- Confirm no pending screenshot or synthetic project is public. `/admin/content` should remain setup-gated or require authorised access; do not advertise a working CMS account in this first release.
- Have the agent verify `/robots.txt` allows public crawling, `/sitemap.xml` lists the correct canonical pages, public pages have no `noindex` in HTML or response headers, and admin/API/review media remain nonindexable/private. Confirm redirects and an unknown URL's404.
- Check the deployment's initial error logs without copying customer data into chat. If a critical problem appears, use the previous approved deployment/authorised rollback rather than rush more changes.

If the time expires before these checks pass, stop at a protected/noindex preview or preserve the last safe production version. Do not call the site launched just because Vercel says Ready.

## After this first release

- Configure and test the real owner CMS properly: Auth claim, content/history tables, private Storage, initial publication and real permission checks. Only then enable `SITE_CMS_ENABLED` in a fresh build/runtime deployment. Until then, the admin content editor is not usable for real updates.
- Obtain clear screenshot-specific permission before publishing the supplied image. Owner approval to show a project is not independently verified media rights.
- Complete the approved privacy/retention, backup/restore and monitoring arrangements. No invented duration, payment percentage or response guarantee.
- Verify search-console ownership and submit the sitemap after the actual public release. Search indexing is not immediate or guaranteed.
- Routine supported edits through the CMS will not need coding after its one-time setup; its proper activation may take longer than this 20-minute website release target.
