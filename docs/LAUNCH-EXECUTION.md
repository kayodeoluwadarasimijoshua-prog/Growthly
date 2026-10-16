# Technical launch execution handover

## Authority and boundaries

Use [LAUNCH-OWNER-CHECKLIST.md](LAUNCH-OWNER-CHECKLIST.md) for the owner's remaining approvals. This is an execution plan, not a log of remote actions. Work remains local; do not push/open a PR from this closed session. Preserve the local changes and continue in a new coding session on that session's assigned branch.

Keep `ONLINE_INQUIRIES_ENABLED=false`, optional analytics/shared-limit/retry flags off and VA access unchanged unless separately approved. Never infer image permission from upload or broad permission from an admin sign-in. Do not change DNS/nameservers/mail, buy plans, enable campaigns or invent terms. Keep review deployments noindex and pending media nonpublic.

## 1. Capture decisions, inspect existing configuration and back up

- Confirm the owner checklist; identify the existing approved host/project and authorised operator. Review current commercial eligibility, capacity/limits and costs in the real account. Do not copy historical plan pricing as a current quote.
- Preserve existing domain/mail records and inspect the actual deployment/migration state before altering anything. Existing migrations/policies must not be blindly rerun.
- Before any data change, take an authorised backup through existing provider tools. Include the content singleton, complete history, media registry, private storage objects and the information needed to recover their references/access policies. A database backup alone may not contain Storage object bytes.
- Keep backups and credentials out of Git, public assets, chat and unapproved workspaces. The owner must approve backup/history/media retention; do not infer a duration.
- Perform a restore rehearsal only in an owner-approved isolated environment, with online collection/tracking off. Verify content revisions, draft/public separation, media references and private access; record the result without customer data. No backup or restore has been performed here.

## 2. Configure the owner CMS safely

Follow [CONTENT-MANAGEMENT.md](CONTENT-MANAGEMENT.md) and [INTEGRATIONS.md](INTEGRATIONS.md). Technical operator applies/verifies the base administrator helper if absent, then the content and private-storage migrations, sets trusted owner `app_metadata`, configures secrets in provider dashboards, and verifies the private bucket.

Prepare the first snapshot while `SITE_CMS_ENABLED=false`. The seed remains StarXCO text-only; import/publish its image only after actual permission. Test a synthetic private draft/upload, save/publish, pricing confirmation, conflicts, history restoration and withdrawal using real owner/non-admin/anonymous sessions. Remove synthetic test content appropriately. Existing mock/PGlite tests are not real provider acceptance.

Record the verified backup and initial publication. Enable `SITE_CMS_ENABLED=true` in the approved deployment's **build and runtime**, then rebuild/deploy once. Later supported owner publications need no coding/rebuild. Review fresh page requests and reload old browser sessions to avoid cached settings.

## 3. Run reproducible checks in the intended environment

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run launch:check
npm run build
# Start the built app in a separate terminal, with the same intended environment:
npm start
# Against the running local app:
npm run test:browser
npm run audit:seo
```

`launch:check` reads **process environment only**, does not load `.env.local` implicitly and prints no credential values. If using a local environment file, use Node's existing env-file support:

```sh
node --env-file=.env.local scripts/check-launch-config.mjs
```

For the approved **production build environment**, use `npm run launch:check -- --production` (or append `--production` to the env-file command). It exits1 for blocking configuration, 2 for invalid CLI usage and 0 for configuration passing in that mode. `--json` is available. Do not paste keys into shell history/chat to run a check; use the host's secret environment or a protected ignored local env file.

**A passing configuration check is never launch approval.** It does not contact providers, validate credentials/DNS, inspect an already-built bundle, check migrations/permissions or confirm real receipt. JSON always returns `launchApproved: false` and lists manual gates. CMS-off is reported as pending setup, not a claim of a working editor. Current WhatsApp-only policy intentionally blocks an online-enquiries-enabled configuration. Change that policy/check only after a separately approved workflow—not by bypassing a failure.

The whole-site browser command skips explicitly gated CMS fixtures unless the documented harness variables are supplied. Use the isolated CMS reproduction steps in the content guide for mocked CMS regression; keep test endpoints outside the Next app and stop those servers afterwards. Do not deploy the QA harness.

Run Lighthouse **after** other browser workloads have stopped; concurrent test CPU makes scores misleading. Do not reuse CMS-off lab scores as proof of real CMS-provider latency or field Core Web Vitals.

## 4. Host-side acceptance before public release

- Test actual host body/slow-request limits, origin/cookie/session handling and anti-abuse controls. Enable forwarded-header trust only after spoofing tests prove the host overwrites untrusted headers. Optional shared limiting requires its approved migration, configuration, cost and real multi-instance acceptance.
- Verify actual owner login/editor access, anonymous/non-admin denial, draft/history/image privacy and server-key isolation. The existing admin is broad owner access; it is not a restricted VA portal. Provider-console MFA protection is separate from the application's existing password login; no application MFA challenge was implemented.
- The owner will handle enquiries for now, as confirmed. Test the owner-approved WhatsApp receipt on real devices; do not mark the prepared brief as sent merely because a visitor clicked. Online collection stays off.
- Verify the real host's current error logs and existing availability/error-alert options; configure an owner-approved recipient/monitor only with permission/cost acceptance. Never log request bodies, private briefs, signed URLs or secrets. No external monitoring/alert channel has been activated here.
- Agree who monitors the first release and owns rollback; the owner is the current enquiry responder. Test mobile/desktop links and a real-device keyboard/zoom/screen-reader journey where possible; automated axe is not assistive-technology certification.

## 5. Explicit release and actual-domain verification

Only after owner approval, build the public production deployment with the final HTTPS canonical, `SITE_INDEXING_ENABLED=true` and `PROJECT_IMAGE_REVIEW_MODE=false`. Keep Preview/development noindex. Check **actual** response headers/meta/robots allow indexing; setting a flag is insufficient when environment overrides still prevent it.

Verify the real homepage, all six canonical service destinations including `/aiads`, quote/contact context, new project URLs/sitemap, prices/offer, HTTPS/www redirect, legacy308s, genuine404s and private admin/media behaviour. Confirm no synthetic test content remains. Verify search-console ownership and submit the final sitemap only after release; never claim submission or indexing without performing/checking it.

Monitor errors and owner receipt immediately after release and use the agreed ongoing cadence. Re-run real provider/host performance checks; use actual data rather than promise rankings, conversions or perfect security.

## 6. Rollback and incident response

- Preserve the previous approved deployment and backup reference; no destructive cleanup of local changes or history.
- For an unwanted publication, use reviewed history restoration **as a draft**, reapprove permissions and publish. For an image withdrawal, remove its public reference and publish, then confirm new proxy requests refuse it. Already downloaded copies cannot be recalled.
- Do not blindly switch CMS off to withdraw content: old code defaults can reappear. If privacy/security is at risk, pause exposure using an authorised host response while the operator verifies a safe publication/rollback.
- Revoke compromised credentials/sessions through authorised provider controls and inspect relevant access. Notify the owner; privacy/legal notification decisions require appropriate review. Never paste incident secrets/customer records into chat.
- Keep history/media needed for recovery. Remove orphans only after checking draft, publication **and all history**, following an owner-approved cleanup/backup-retention policy.
