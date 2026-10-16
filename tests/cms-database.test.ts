import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
const db = new PGlite();
beforeAll(async () => {
  await db.exec(
    `create role anon; create role authenticated; create role service_role bypassrls;create schema auth;create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$; grant usage on schema public,auth to anon,authenticated,service_role;`,
  );
  await db.exec(
    await readFile(
      "supabase/migrations/202610100001_create_inquiries.sql",
      "utf8",
    ),
  );
  await db.exec(
    await readFile("supabase/migrations/202610150001_site_content.sql", "utf8"),
  );
  // Minimal Storage SQL fixture, not a claim about live Storage HTTP behaviour.
  await db.exec(
    `create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text references storage.buckets(id),name text);alter table storage.objects enable row level security;grant usage on schema storage to anon,authenticated;grant select on storage.objects to anon;grant select,insert,delete on storage.objects to authenticated;`,
  );
  await db.exec(
    await readFile(
      "supabase/migrations/202610150002_private_project_storage.sql",
      "utf8",
    ),
  );
});
afterAll(() => db.close());
async function role(role: string, admin = false) {
  await db.exec(
    `reset role;set role ${role};select set_config('request.jwt.claims','${JSON.stringify({ sub: "11111111-1111-4111-8111-111111111111", app_metadata: { role: admin ? "admin" : "assistant" }, user_metadata: { role: "admin" } })}',false);`,
  );
}
describe("real isolated PostgreSQL CMS roles and atomic revisions (not a live Supabase account)", () => {
  it("denies anonymous content/history/media reads", async () => {
    await role("anon");
    for (const table of [
      "growthly_site_content",
      "growthly_content_history",
      "growthly_content_media",
    ])
      await expect(db.query(`select * from public.${table}`)).rejects.toThrow();
  });
  it("does not give an assistant role records or commit rights through editable metadata", async () => {
    await role("authenticated");
    expect(
      (await db.query("select * from public.growthly_site_content")).rows,
    ).toHaveLength(0);
    await expect(
      db.query(`select public.commit_growthly_content(0,'{}',false)`),
    ).rejects.toThrow();
  });
  it("saves a private draft without replacing published data", async () => {
    await role("authenticated", true);
    const r = await db.query(
      `select public.commit_growthly_content(0,'{"synthetic":"draft-one"}',false) as revision`,
    );
    expect(Number((r.rows[0] as { revision: number }).revision)).toBe(1);
    const state = (await db.query("select * from public.growthly_site_content"))
      .rows[0] as { published: unknown; draft: unknown };
    expect(state.published).toBeNull();
    expect(state.draft).toEqual({ synthetic: "draft-one" });
  });
  it("rejects stale and null revisions atomically", async () => {
    await role("authenticated", true);
    await expect(
      db.query(
        `select public.commit_growthly_content(0,'{"synthetic":"stale"}',true)`,
      ),
    ).rejects.toThrow();
    await expect(
      db.query(`select public.commit_growthly_content(null,'{}',true)`),
    ).rejects.toThrow();
    await expect(
      db.query(`select public.commit_growthly_content(-1,'{}',false)`),
    ).rejects.toThrow();
    await expect(
      db.query(`select public.commit_growthly_content(1,'{}',null)`),
    ).rejects.toThrow();
    expect(
      (await db.query("select * from public.growthly_content_history")).rows,
    ).toHaveLength(1);
  });
  it("publishes once and records a private owner revision", async () => {
    await role("authenticated", true);
    await db.query(
      `select public.commit_growthly_content(1,'{"synthetic":"public-two"}',true)`,
    );
    const state = (
      await db.query(
        "select published,revision from public.growthly_site_content",
      )
    ).rows[0] as { published: unknown; revision: number };
    expect(state.published).toEqual({ synthetic: "public-two" });
    expect(Number(state.revision)).toBe(2);
  });
  it("cannot bypass commit/CAS by updating tables directly", async () => {
    await role("authenticated", true);
    await expect(
      db.query(`update public.growthly_site_content set draft='{}'`),
    ).rejects.toThrow();
    await expect(
      db.query(
        `insert into public.growthly_content_history(revision,document,published)values(500,'{}',true)`,
      ),
    ).rejects.toThrow();
  });
  it("allows only the server reader and owner to inspect content/media", async () => {
    await role("service_role");
    expect(
      (await db.query("select published from public.growthly_site_content"))
        .rows,
    ).toHaveLength(1);
    await role("authenticated");
    expect(
      (await db.query("select * from public.growthly_content_history")).rows,
    ).toHaveLength(0);
    expect(
      (await db.query("select * from public.growthly_content_media")).rows,
    ).toHaveLength(0);
  });
});

it("keeps the project bucket private and enforces owner-only SQL Storage object access", async () => {
  await role("authenticated", true);
  await db.query(
    `insert into storage.objects(bucket_id,name)values('growthly-project-media','synthetic.webp')`,
  );
  expect((await db.query("select * from storage.objects")).rows).toHaveLength(
    1,
  );
  await role("authenticated");
  expect((await db.query("select * from storage.objects")).rows).toHaveLength(
    0,
  );
  await expect(
    db.query(
      `insert into storage.objects(bucket_id,name)values('growthly-project-media','assistant.webp')`,
    ),
  ).rejects.toThrow();
  await role("anon");
  expect((await db.query("select * from storage.objects")).rows).toHaveLength(
    0,
  );
  await db.exec("reset role");
  expect(
    (
      await db.query(
        `select public from storage.buckets where id='growthly-project-media'`,
      )
    ).rows,
  ).toEqual([{ public: false }]);
});
