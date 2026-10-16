import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { beforeAll, afterAll, describe, expect, it } from "vitest";

// Real isolated PostgreSQL engine; models Supabase JWT/roles, not a live account.
const db = new PGlite();
beforeAll(async () => {
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth;
    create function auth.jwt() returns jsonb language sql stable as $$
      select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb;
    $$;
    grant usage on schema public, auth to anon, authenticated, service_role;
  `);
  for (const file of [
    "202610100001_create_inquiries.sql",
    "202610140001_inquiry_retry_protection.sql",
    "202610140002_shared_request_limits.sql",
  ]) {
    await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
  }
  await db.exec(`set role service_role;
    insert into public.inquiries(full_name, phone, preferred_contact, service, brief, budget_range, preferred_deadline, submission_id, submission_hash)
    values ('Synthetic Owner', '08012345678', 'whatsapp', 'website-development', 'Synthetic private lead for isolated database tests.', 'not-sure', 'flexible',
      '11111111-1111-4111-8111-111111111111', repeat('a',64)); reset role;`);
}, 30000);
afterAll(async () => {
  await db.close();
});
async function asRole(role: string, claims: object, query: string) {
  await db.exec(
    `set role ${role}; set request.jwt.claims = '${JSON.stringify(claims)}';`,
  );
  try {
    return await db.query<Record<string, unknown>>(query);
  } finally {
    await db.exec("reset role; reset request.jwt.claims;");
  }
}
describe("local PostgreSQL migration and authorization acceptance", () => {
  it("denies anonymous enquiry reads", async () => {
    await expect(
      asRole("anon", {}, "select * from public.inquiries"),
    ).rejects.toThrow(/permission denied/);
  });
  it("ordinary authenticated users cannot read or update leads", async () => {
    expect(
      (await asRole("authenticated", {}, "select * from public.inquiries"))
        .rows,
    ).toHaveLength(0);
    expect(
      (
        await asRole(
          "authenticated",
          {},
          "update public.inquiries set status='won' returning id",
        )
      ).rows,
    ).toHaveLength(0);
  });
  it("self-edited user_metadata does not grant administrator access", async () => {
    expect(
      (
        await asRole(
          "authenticated",
          { user_metadata: { role: "admin" } },
          "select * from public.inquiries",
        )
      ).rows,
    ).toHaveLength(0);
  });
  it("authorized app_metadata administrators can read and update", async () => {
    expect(
      (
        await asRole(
          "authenticated",
          { app_metadata: { role: "admin" } },
          "select * from public.inquiries",
        )
      ).rows,
    ).toHaveLength(1);
    expect(
      (
        await asRole(
          "authenticated",
          { app_metadata: { role: "admin" } },
          "update public.inquiries set status='contacted' returning id",
        )
      ).rows,
    ).toHaveLength(1);
  });
  it("revoked admin privileges deny the next read", async () => {
    expect(
      (
        await asRole(
          "authenticated",
          { app_metadata: {} },
          "select * from public.inquiries",
        )
      ).rows,
    ).toHaveLength(0);
  });
  it("authenticated administrators cannot insert or delete private leads", async () => {
    await expect(
      asRole(
        "authenticated",
        { app_metadata: { role: "admin" } },
        "delete from public.inquiries",
      ),
    ).rejects.toThrow(/permission denied/);
  });
  it("server-only retry lookups are allowed and duplicate references cannot create another row", async () => {
    expect(
      (
        await asRole(
          "service_role",
          {},
          "select submission_hash from public.inquiries",
        )
      ).rows,
    ).toHaveLength(1);
    await expect(
      asRole(
        "service_role",
        {},
        `insert into public.inquiries(full_name, phone, preferred_contact, service, brief, budget_range, preferred_deadline, submission_id)
      values ('Synthetic Owner', '08012345678', 'whatsapp', 'website-development', 'Another synthetic private lead.', 'not-sure', 'flexible', '11111111-1111-4111-8111-111111111111')`,
      ),
    ).rejects.toThrow(/unique constraint/);
  });
  it("only the server role can execute the shared limiter", async () => {
    for (const role of ["anon", "authenticated"]) {
      await expect(
        asRole(
          role,
          {},
          `select public.consume_growthly_rate_limit(repeat('a',64), 2, 60)`,
        ),
      ).rejects.toThrow(/permission denied/);
      await expect(
        asRole(role, {}, "select * from public.growthly_request_limits"),
      ).rejects.toThrow(/permission denied/);
    }
  });
  it("the atomic bucket returns the limit and retry duration across repeated calls", async () => {
    const result: { allowed: boolean; retry_after: number }[] = [];
    for (let i = 0; i < 3; i++) {
      const row = await asRole(
        "service_role",
        {},
        `select public.consume_growthly_rate_limit(repeat('b',64), 2, 60) as result`,
      );
      result.push(
        row.rows[0].result as { allowed: boolean; retry_after: number },
      );
    }
    expect(result.map((r) => r.allowed)).toEqual([true, true, false]);
    expect(result[2].retry_after).toBeGreaterThan(0);
    expect(result[2].retry_after).toBeLessThanOrEqual(60);
  });
  it("expired rate entries reset and are cleaned without deleting enquiries", async () => {
    await db.exec(
      "update public.growthly_request_limits set expires_at = now() - interval '1 second'",
    );
    const row = await asRole(
      "service_role",
      {},
      `select public.consume_growthly_rate_limit(repeat('b',64), 2, 60) as result`,
    );
    expect(row.rows[0].result).toEqual({ allowed: true, retry_after: 0 });
    expect(
      (await db.query("select * from public.inquiries")).rows,
    ).toHaveLength(1);
  });
  it("applying the additive retry and limiter migrations again preserves existing leads", async () => {
    for (const file of [
      "202610140001_inquiry_retry_protection.sql",
      "202610140002_shared_request_limits.sql",
    ]) {
      await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
    }
    expect(
      (await db.query("select * from public.inquiries")).rows,
    ).toHaveLength(1);
  });
});
