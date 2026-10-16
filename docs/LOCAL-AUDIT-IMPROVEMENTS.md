# Local audit improvements — 14 October 2026

## Current result

The requested WhatsApp correction and the remaining code-side resilience/privacy work described below are implemented locally. **This is not launch acceptance or a claim that every audit gate is closed.** Current delivery remains WhatsApp-first; no provider account, DNS, paid service, deployment, GitHub operation or lead-retention policy was changed. The owner skipped workflow/retention choices, so none were inferred.

### WhatsApp and existing UI

- Replaced the rejected dark inner circle/halo with the unchanged WhatsApp brand path from Simple Icons 16.35.0: white on **#25D366**, larger 38px mark, 56px stationary link target. The extra white outer ring has been removed. Source: [WHATSAPP-ICON-SOURCE.md](WHATSAPP-ICON-SOURCE.md).
- Mark bounces continuously in gentle **1.8-second cycles** after hydration. A separate 26px pause/resume button works by pointer and keyboard, stays beside (not over) the logo and moves with the contact control. Hover, keyboard focus, dragging and reduced motion disable movement. No-JavaScript visitors get a static mark and no unusable pause button. The hitbox never moves.
- Pointer/touch dragging, saved/clamped position, keyboard arrows/Home, accessible name/help, correct +2348129391626 link and admin exclusion remain intact.
- Business Website **Recommended**, approved ₦100k/₦200k/₦300k prices, first-year offers, sole StarXCO project, logo rendition and restrained general site motion are unchanged.

### Resilience and abuse controls (L10 code-side work)

- Existing inbound JSON caps, **15-second whole-upload deadline**, private/no-store errors, 400/408/413 and origin-before-read rules retained.
- New provider transport gives Supabase server clients, admin-cookie middleware and existing email delivery a **5-second per-fetch total deadline**, including response-body consumption; raw responses are capped at **2,000,000 bytes**. Caller cancellation, stalled/trickled bodies, late responses, never-settling cancellation and timer cleanup are tested. This is not an end-to-end route/SDK/hosting timeout guarantee.
- Local rate buckets have a **5,000-entry hard cap**. Active entries are not evicted to let attackers reset counters; new keys fail closed at capacity. Expired entries can be reclaimed.
- Forwarded IP/Host headers are ignored unless `TRUST_PROXY_HEADERS=true` is explicitly approved after actual host overwrite tests. IP strings must parse as IPv4/IPv6. Without trusted IP information the local limiter uses a shared `unknown` bucket; **do not enable online collection before reviewing its effect on legitimate users and configuring host/shared limits**. Origin/Fetch Metadata is CSRF protection, not bot authentication.
- Optional existing-Supabase atomic shared limiter and migration prepared. HMAC-hashed bucket keys (no raw IP persistence), private table/server-role-only RPC, 429 retry durations, bounded expired-entry cleanup and **503 fail-closed** behaviour on configuration/provider failure. No paid Redis/CAPTCHA or new service. Disabled by default.
- Online form now sends a stable UUID retry key for unchanged data; editing a submission creates a new key. Concurrent submits are guarded and fields stay disabled while a request is pending. Errors retain details; only confirmed success resets them.
- Optional database retry migration provides a unique submission reference and validated-payload fingerprint. Matching stored retries return success without another notification; changed-data reuse returns 409. Unknown database outcomes do not silently switch channels in approved idempotent database mode. Disabled until migration approval.
- Existing email path forwards the retry key to Resend. Provider acceptance still requires a nonempty receipt ID. Live provider idempotency lifetime/delivery and inbox receipt remain unverified; this is not permanent exactly-once delivery. Keys last for the mounted form session; reloads are not cross-session duplicate guarantees.

### Privacy, consent and local authorization (L09/L11)

- Corrected stale remote-project-image disclosure. Pending screenshot remains private/review-only; opening a live project link is separate. WhatsApp notice distinguishes preparing a brief, sharing it with WhatsApp by opening its link, and actually sending it to Growthly.
- Analytics requires explicit owner enablement **and** visitor consent. IDs alone do not activate it. Google Ads scripts/config/conversions are not loaded or enabled by “Allow analytics”; advertising consent remains denied.
- Consent works for the current page session when reads/writes/removal are blocked, including quota errors. Withdrawal clears optional campaign attribution. UTM capture/read now requires approved analytics and visitor opt-in.
- Manual events accept only known non-personal dimensions and configured public paths. URL queries, unknown/private path segments, form fields, arbitrary dimensions and external referrer paths are excluded. Admin manual events are suppressed; entering admin denies Google consent in an already-loaded session.
- Google SDK automatic/enhanced measurement and withdrawal-network behaviour **still require account-level review and actual network acceptance before enabling analytics**. This implementation does not assert that changing consent can unload a third-party SDK already loaded.
- Real isolated PostgreSQL-engine tests (PGlite, dev-only) exercise migrations and modeled Supabase JWT/roles: anonymous denial, ordinary-user denial, user_metadata escalation denial, authorized admin read/update, revoked-role denial, server retry read/unique constraint, limiter RPC permissions/counts/expiry and additive migration reapplication. No live Supabase project was queried; account-specific policies/session/MFA remain owner acceptance tasks.

### Performance and image reliability

- Added **private responsive review variants** at 480/768/1024px: **19,748 / 40,186 / 57,922 bytes**, versus the 76,444-byte original. Generated from the genuine owner-supplied PNG without EXIF; originals preserved. Mobile 390px/DPR1 selects the 480px asset, **74.2% fewer image bytes**. The importer now generates these variants for pending-review imports.
- All variants remain outside `public/`, require the exact same review/nonproduction/nonindexable permission gate and return private/no-store/noindex/no-referrer. Only fixed filenames are allowed. No public image-optimizer/cache path was enabled; permission remains false. Approved future publication still uses the normal responsive Next Image path.
- Explicit eager/high priority for hero media; lazy loading for other pending review images. Fixed failed-SSR-image detection when an error occurs before React can attach `onError`; project text/live links remain useful.
- Removed full content/image-validation imports from common client analytics/preview code. A lightweight public-identifier registry is tested against canonical content; responsive widths use a small shared JSON configuration. Homepage unused-JS lab estimate fell from roughly 50KB to 28KB, without dropping validation from the quote form or changing stack.

Four fresh local review-build Lighthouse lab runs:

| Route / device | Performance | Accessibility | Best practices | LCP | CLS |
|---|---:|---:|---:|---:|---:|
| Home mobile | 97 | 100 | 100 | 2.33s | 0 |
| Home desktop | 93 | 100 | 100 | 0.51s | 0.00009 |
| Website development mobile | 99 | 100 | 100 | 2.01s | 0 |
| Quote mobile | 98 | 100 | 100 | 2.38s | 0 |

These are single synthetic runs, not production/field guarantees. Prior runs varied; the earlier full-source mobile-home review run scored 89 with 3.39s LCP. Desktop TBT remains 218ms and Lighthouse still estimates some framework JS/image savings; continue monitoring rather than claiming perfect performance. No client rights/cache gate was weakened. Review SEO scores 66–69 reflect deliberate noindex/robots protection, not authorization to enable indexing. After permission approval or refusal, rebuild in the appropriate normal-public state and verify actual-domain/field performance.

## Validation evidence

- **169 unit/integration tests, 18 files**, including the isolated database engine and mocked providers.
- **69 browser checks**, including all 19 public-route axe + label-name scans, larger ring-free icon/ongoing bounce/pointer and keyboard pause/resume/reduced motion/no-script static contact, 320px/no-JS safety, service context, real stalled/chunked HTTP rejection, drag/touch/keyboard, permission-gated responsive screenshot loading and pre-hydration error fallback, no tracking/attribution and actual forged-forwarded-host rejection.
- Lint, TypeScript, review production build and diff whitespace checks passed. Dependency audit: **0 reported vulnerabilities**.
- Ignored, regenerable evidence: `artifacts/latest-unit-run.log`, `latest-browser-run.log`, `browser-results.json`, `latest-build.log`, `latest-dependency-audit.json`, `performance-summary.json`, `lighthouse-*.json/html` and desktop/mobile screenshots.
- Browser test environment must match the server: use `PROJECT_IMAGE_REVIEW_MODE=true` for both build/start and browser suite when reviewing pending images. An interrupted run initially used mismatched image-mode expectations; another ran while the stopped server was absent. Neither is acceptance evidence. The final matching-mode suite passed in full.

## Activation only after approval (not performed)

1. Keep WhatsApp-only unless the owner approves online delivery, costs, provider privacy and retention/access operations.
2. Back up and inspect the real schema, existing grants/policies and migration history. Apply the base inquiry schema and then `202610140001_inquiry_retry_protection.sql`; verify real RLS/admin sessions and retry conflict/duplicate behaviour. Only then enable `INQUIRY_IDEMPOTENCY_ENABLED=true` in the appropriate server environment. Do not assume `IF NOT EXISTS` repairs unknown legacy schemas or policies.
3. If approved, apply `202610140002_shared_request_limits.sql` to the existing lead store. Verify actual host header overwriting before `TRUST_PROXY_HEADERS=true`; provide a server-only random `RATE_LIMIT_HASH_SECRET` of at least 32 characters. Only after cost/capacity review enable `DISTRIBUTED_RATE_LIMIT_ENABLED=true`. Verify real parallel/multi-instance 429/expiry, outage 503, maintenance and host WAF/body/slow-upload limits. Local database tests are not multi-instance hosted acceptance.
4. Adopt a real retention/deletion/backup/incident process for database, email and WhatsApp history; approve administrator/provider access and MFA. No 90/180-day policy or automatic lead deletion was invented.
5. Keep `NEXT_PUBLIC_ANALYTICS_ENABLED=false` until approved account/disclosure/automatic-measurement/network review. Ads is not reactivated by setting old Ads IDs; any future Ads workflow needs separately appropriate authorization/consent.
6. Obtain client screenshot permission and approve the original/rendition Growthly logo. Keep `permissionConfirmed=false` until actual approval; do not promote review assets.
7. Confirm commercially eligible hosting and first-year/renewal cost responsibility. Test real WhatsApp/online receipt and physical-device, screen-reader, keyboard and zoom flows.
8. Publication requires a **new coding session**. Fresh release build with review mode off; owner-approved production-only indexing, actual-domain/certificate/canonical/sitemap/robots checks, rollback and monitoring. This closed session did not push or deploy.
