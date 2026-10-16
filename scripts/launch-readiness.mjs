/** Offline environment checks only. Never activates a provider, edits flags or approves launch. */
const flags = [
  "SITE_CMS_ENABLED",
  "ONLINE_INQUIRIES_ENABLED",
  "SITE_INDEXING_ENABLED",
  "PROJECT_IMAGE_REVIEW_MODE",
  "NEXT_PUBLIC_ANALYTICS_ENABLED",
  "TRUST_PROXY_HEADERS",
  "DISTRIBUTED_RATE_LIMIT_ENABLED",
  "INQUIRY_IDEMPOTENCY_ENABLED",
];
const present = (v) => typeof v === "string" && v.trim().length > 0;
const placeholder = (v) =>
  /^(synthetic|example|replace[-_ ]|your[-_ ]|test[-_]|<)/i.test(v.trim());
function publicHttpsOrigin(value) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.search &&
      !u.hash &&
      u.pathname === "/" &&
      !u.port &&
      host.includes(".") &&
      !host.endsWith(".") &&
      !host.startsWith("[") &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(host) &&
      host !== "localhost" &&
      ![".localhost", ".local", ".internal", ".test", ".invalid"].some((s) =>
        host.endsWith(s),
      )
    );
  } catch {
    return false;
  }
}
export function checkLaunchConfig(env = {}, { production = false } = {}) {
  const checks = [];
  const add = (id, status, message) => checks.push({ id, status, message });
  for (const flag of flags)
    if (present(env[flag]) && !["true", "false"].includes(env[flag]))
      add(
        `flag:${flag}`,
        "blocked",
        `${flag} must be exactly true or false; no value was printed.`,
      );
  const canonical = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!canonical)
    add(
      "canonical",
      production ? "blocked" : "manual",
      production
        ? "Set the explicit final HTTPS site origin before the production build."
        : "The app uses its code-default origin. Verify the final origin before release.",
    );
  else
    add(
      "canonical",
      publicHttpsOrigin(canonical) ? "pass" : "blocked",
      "Canonical must be a public HTTPS origin without credentials, port, path, query or fragment. DNS/ownership are not checked here.",
    );
  if (
    production &&
    canonical &&
    /\.(e2b\.app|arena\.ai|vercel\.app)\/?$/i.test(canonical)
  )
    add(
      "preview-origin",
      "blocked",
      "A temporary preview URL must not replace the approved Growthly production canonical.",
    );
  const actualIndexing =
    env.SITE_INDEXING_ENABLED === "true" &&
    !["preview", "development"].includes(env.VERCEL_ENV) &&
    env.NODE_ENV !== "development" &&
    env.PROJECT_IMAGE_REVIEW_MODE !== "true";
  add(
    "indexing",
    actualIndexing === production ? "pass" : "blocked",
    production
      ? "Production must actually permit indexing; preview/development/review overrides still prevent it."
      : "A local/private review must remain noindex.",
  );
  add(
    "pending-images",
    env.PROJECT_IMAGE_REVIEW_MODE === "true"
      ? production
        ? "blocked"
        : "manual"
      : "pass",
    "Permission-pending image review must be off for release. A new upload is not publication permission.",
  );
  const supabase = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  if (env.SITE_CMS_ENABLED === "true") {
    const complete = supabase.every(
      (k) => present(env[k]) && !placeholder(env[k]),
    );
    add(
      "cms-config",
      complete ? "pass" : "blocked",
      "CMS-on requires the project URL, public Auth key and server-only service key, with no placeholder values. This does not test those credentials.",
    );
    if (present(env.NEXT_PUBLIC_SUPABASE_URL))
      add(
        "cms-origin",
        publicHttpsOrigin(env.NEXT_PUBLIC_SUPABASE_URL) ? "pass" : "blocked",
        "Use the real HTTPS Supabase origin for a deployable CMS, not a local test fixture.",
      );
    add(
      "cms-acceptance",
      "manual",
      "Verify real owner/non-admin/anonymous Auth and RLS, migrations, private bucket, initial publication, restore and withdrawal before enabling the CMS.",
    );
  } else
    add(
      "cms-config",
      "manual",
      "Public CMS is off. The owner editor still needs approved one-time account/database/storage setup and a build/runtime activation deployment.",
    );
  add(
    "enquiry-mode",
    env.ONLINE_INQUIRIES_ENABLED === "true" ? "blocked" : "pass",
    "The currently approved launch is WhatsApp-only. Online collection needs a separate owner decision and live delivery/privacy acceptance; this checker does not authorise it.",
  );
  const leaked = Object.keys(env).some(
    (k) =>
      k.startsWith("NEXT_PUBLIC_") &&
      present(env[k]) &&
      /(SERVICE_ROLE|RESEND_API_KEY|RATE_LIMIT_HASH_SECRET|PASSWORD|PRIVATE_KEY|SUPABASE_SECRET)/i.test(
        k,
      ),
  );
  add(
    "secret-boundary",
    leaked ? "blocked" : "pass",
    "Server-only credentials must never use NEXT_PUBLIC_. Neither values nor offending names are printed. This is not a built-bundle secret scan.",
  );
  if (env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") {
    add(
      "analytics-config",
      /^G-[A-Z0-9]+$/.test(env.NEXT_PUBLIC_GA4_ID ?? "") ? "pass" : "blocked",
      "Enabled analytics requires a GA4 measurement-ID format; actual account validity is unverified.",
    );
    add(
      "analytics-approval",
      "manual",
      "Confirm owner measurement/privacy approval and real visitor opt-in/withdrawal/network behaviour. Ads tags remain disabled by application policy.",
    );
  } else
    add(
      "analytics-config",
      "pass",
      "Optional analytics remains disabled. No analytics account is required for launch.",
    );
  if (env.TRUST_PROXY_HEADERS === "true")
    add(
      "proxy-trust",
      "manual",
      "Verify the actual host overwrites client-supplied forwarding headers before trusting them.",
    );
  if (env.DISTRIBUTED_RATE_LIMIT_ENABLED === "true") {
    add(
      "shared-limit-config",
      present(env.NEXT_PUBLIC_SUPABASE_URL) &&
        present(env.SUPABASE_SERVICE_ROLE_KEY) &&
        typeof env.RATE_LIMIT_HASH_SECRET === "string" &&
        env.RATE_LIMIT_HASH_SECRET.length >= 32
        ? "pass"
        : "blocked",
      "Shared limiting needs the existing database configuration and a server-only random hash secret of at least 32 characters.",
    );
    add(
      "shared-limit-acceptance",
      "manual",
      "Apply/verify the approved shared-limiter migration and test real multi-instance behaviour/cost.",
    );
  }
  if (env.INQUIRY_IDEMPOTENCY_ENABLED === "true")
    add(
      "retry-migration",
      "manual",
      "Verify the optional enquiry retry migration before relying on database deduplication; do not enable online collection implicitly.",
    );
  const manualGates = [
    "Client/project/media permission and logo approval.",
    "Owner handles enquiries for now; the owner must verify actual WhatsApp receipt and both phone routes before launch.",
    "Commercially eligible hosting, costs, backups and a restore rehearsal.",
    "Approve payment/scope/renewal terms and privacy/retention decisions; no duration is assumed.",
    "Owner-approved deployment in a new coding session, followed by actual-domain checks.",
    "Verify the deployed build/runtime flags, robots/meta/headers, sitemap, admin access and monitoring.",
  ];
  return {
    mode: production ? "production" : "private-review",
    configurationOK: !checks.some((c) => c.status === "blocked"),
    launchApproved: false,
    scope:
      "Offline environment only. No live credential, database, storage, permission, message-receipt or deployment verification.",
    checks,
    manualGates,
  };
}
