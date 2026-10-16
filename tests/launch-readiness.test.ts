import { describe, expect, it } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { checkLaunchConfig } from "../scripts/launch-readiness.mjs";
import { isPublicIndexingEnabled } from "@/lib/indexing";
const production = {
  NEXT_PUBLIC_SITE_URL: "https://growthly.com.ng",
  SITE_INDEXING_ENABLED: "true",
  NODE_ENV: "production",
  VERCEL_ENV: "production",
} as const;
const cms = {
  SITE_CMS_ENABLED: "true",
  NEXT_PUBLIC_SUPABASE_URL: "https://approved-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_not-a-real-credential",
  SUPABASE_SERVICE_ROLE_KEY: "sb_secret_not-a-real-credential",
};
const blocked = (
  env: Record<string, string | undefined>,
  id: string,
  prod = true,
) =>
  checkLaunchConfig(env, { production: prod }).checks.find((c) => c.id === id)
    ?.status === "blocked";
describe("non-activating, redacted launch checks", () => {
  it("keeps safe private defaults distinct from production or owner approval", () => {
    const r = checkLaunchConfig();
    expect(r.configurationOK).toBe(true);
    expect(r.launchApproved).toBe(false);
    expect(r.checks.find((c) => c.id === "cms-config")?.status).toBe("manual");
    expect(checkLaunchConfig({}, { production: true }).configurationOK).toBe(
      false,
    );
  });
  it("accepts eligible environment configuration without certifying a live account or deployment", () => {
    const r = checkLaunchConfig(
      { ...production, ...cms },
      { production: true },
    );
    expect(r.configurationOK).toBe(true);
    expect(r.launchApproved).toBe(false);
    expect(r.checks.find((c) => c.id === "cms-acceptance")?.status).toBe(
      "manual",
    );
  });
  it.each([
    "http://growthly.com.ng",
    "https://growthly.com.ng/path",
    "https://growthly.com.ng?token=private",
    "https://person:password@growthly.com.ng",
    "https://localhost",
    "https://127.0.0.1",
    "https://a.local",
    "https://[::1]",
  ])("rejects an unsuitable canonical without printing it: %s", (url) => {
    expect(
      blocked({ ...production, NEXT_PUBLIC_SITE_URL: url }, "canonical"),
    ).toBe(true);
    expect(
      JSON.stringify(checkLaunchConfig({ NEXT_PUBLIC_SITE_URL: url })),
    ).not.toContain(url);
  });
  it.each([
    "https://sample.vercel.app",
    "https://3000-example.e2b.app",
    "https://example.arena.ai",
  ])("rejects a temporary production origin: %s", (origin) => {
    expect(
      blocked(
        { ...production, NEXT_PUBLIC_SITE_URL: origin },
        "preview-origin",
      ),
    ).toBe(true);
  });
  it.each([
    { PROJECT_IMAGE_REVIEW_MODE: "true" },
    { VERCEL_ENV: "preview" },
    { VERCEL_ENV: "development" },
    { NODE_ENV: "development" },
    { SITE_INDEXING_ENABLED: "false" },
  ])("matches the real indexing overrides: %j", (override) => {
    const env = { ...production, ...override };
    expect(isPublicIndexingEnabled(env)).toBe(false);
    expect(blocked(env, "indexing")).toBe(true);
  });
  it("blocks accidentally indexable private previews", () => {
    expect(blocked(production, "indexing", false)).toBe(true);
  });
  it("requires an exact flag spelling without echoing invalid contents", () => {
    const secret = "secret-flag-value-not-to-print";
    const r = checkLaunchConfig({ SITE_CMS_ENABLED: secret });
    expect(r.configurationOK).toBe(false);
    expect(JSON.stringify(r)).not.toContain(secret);
  });
  it.each([
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ])("requires each CMS configuration item: %s", (key) => {
    expect(blocked({ ...production, ...cms, [key]: "" }, "cms-config")).toBe(
      true,
    );
  });
  it("rejects synthetic provider placeholders and a localhost CMS fixture", () => {
    expect(
      blocked(
        {
          ...production,
          ...cms,
          SUPABASE_SERVICE_ROLE_KEY: "synthetic-test-key",
        },
        "cms-config",
      ),
    ).toBe(true);
    expect(
      blocked(
        {
          ...production,
          ...cms,
          NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:3001",
        },
        "cms-origin",
      ),
    ).toBe(true);
  });
  it("does not enable online collection because CMS settings are present", () => {
    expect(blocked({ ...production, ...cms }, "enquiry-mode")).toBe(false);
    expect(
      blocked(
        { ...production, ...cms, ONLINE_INQUIRIES_ENABLED: "true" },
        "enquiry-mode",
      ),
    ).toBe(true);
  });
  it("finds mistakenly public server credentials without printing names or values", () => {
    const key = "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
      value = "DO-NOT-PRINT-THIS-CREDENTIAL";
    const r = checkLaunchConfig({ ...production, [key]: value });
    expect(r.configurationOK).toBe(false);
    expect(r.checks.find((c) => c.id === "secret-boundary")?.status).toBe(
      "blocked",
    );
    expect(JSON.stringify(r)).not.toContain(value);
    expect(JSON.stringify(r)).not.toContain(key);
  });
  it("treats analytics validity, host trust and real distributed limits as unverified", () => {
    const r = checkLaunchConfig(
      {
        ...production,
        NEXT_PUBLIC_ANALYTICS_ENABLED: "true",
        TRUST_PROXY_HEADERS: "true",
        DISTRIBUTED_RATE_LIMIT_ENABLED: "true",
      },
      { production: true },
    );
    expect(r.configurationOK).toBe(false);
    expect(r.checks.find((c) => c.id === "proxy-trust")?.status).toBe("manual");
    expect(r.checks.find((c) => c.id === "analytics-approval")?.status).toBe(
      "manual",
    );
  });
  it("requires a strong private limiter secret but never treats it as proof of migration", () => {
    const r = checkLaunchConfig(
      {
        ...production,
        ...cms,
        DISTRIBUTED_RATE_LIMIT_ENABLED: "true",
        RATE_LIMIT_HASH_SECRET: "x".repeat(32),
      },
      { production: true },
    );
    expect(r.configurationOK).toBe(true);
    expect(
      r.checks.find((c) => c.id === "shared-limit-acceptance")?.status,
    ).toBe("manual");
    expect(JSON.stringify(r)).not.toContain("x".repeat(32));
  });
  it("does not mutate flags or environment", () => {
    const env = Object.freeze({ ...production, ...cms });
    expect(() => checkLaunchConfig(env, { production: true })).not.toThrow();
    expect(env.SITE_CMS_ENABLED).toBe("true");
    expect(env).not.toHaveProperty("ONLINE_INQUIRIES_ENABLED");
  });
  it("runs the real CLI without printing environment secrets", () => {
    const secret = "DO-NOT-LOG-CLI-TEST-SECRET";
    const out = execFileSync(
      process.execPath,
      ["scripts/check-launch-config.mjs", "--production", "--json"],
      {
        encoding: "utf8",
        env: {
          PATH: process.env.PATH,
          ...production,
          ...cms,
          SUPABASE_SERVICE_ROLE_KEY: secret,
        },
      },
    );
    const r = JSON.parse(out);
    expect(r.configurationOK).toBe(true);
    expect(r.launchApproved).toBe(false);
    expect(out).not.toContain(secret);
  });
  it("returns a nonzero status when production configuration or CLI arguments are invalid", () => {
    expect(
      spawnSync(
        process.execPath,
        ["scripts/check-launch-config.mjs", "--production"],
        { env: { PATH: process.env.PATH, NODE_ENV: "test" }, encoding: "utf8" },
      ).status,
    ).toBe(1);
    expect(
      spawnSync(
        process.execPath,
        ["scripts/check-launch-config.mjs", "--unknown"],
        { env: { PATH: process.env.PATH, NODE_ENV: "test" }, encoding: "utf8" },
      ).status,
    ).toBe(2);
  });
});
