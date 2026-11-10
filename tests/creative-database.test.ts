import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import type { CmsProject } from "@/lib/cms/schema";
import { blankCreativeProject } from "@/lib/cms/creative";
const db = new PGlite();
const author = "11111111-1111-4111-8111-111111111111",
  other = "22222222-2222-4222-8222-222222222222",
  id = "33333333-3333-4333-8333-333333333333";
beforeAll(async () => {
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;grant usage on schema public,auth to anon,authenticated,service_role;`,
  );
  for (const file of [
    "202610100001_create_inquiries.sql",
    "202610150001_site_content.sql",
  ])
    await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
  await db.exec(
    `create schema storage;create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;grant usage on schema storage to authenticated;grant select,insert,delete on storage.objects to authenticated;`,
  );
  for (const file of [
    "202610150002_private_project_storage.sql",
    "202611100001_creative_workspace.sql",
  ])
    await db.exec(await readFile(`supabase/migrations/${file}`, "utf8"));
});
afterAll(() => db.close());
async function role(name: string, sub = author) {
  await db.exec("reset role;set role authenticated;");
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({
      sub,
      app_metadata: { role: name },
      user_metadata: { role: "admin" },
    }),
  ]);
}
async function save(
  project: CmsProject = blankCreativeProject(id),
  expected = 0,
) {
  return db.query(
    "select public.save_growthly_creative($1::uuid,$2,$3::jsonb,'submitted') as revision",
    [project.id, expected, JSON.stringify(project)],
  );
}
describe("isolated creative PostgreSQL RLS and revision controls, not live Supabase", () => {
  it("saves a private creative draft without touching CMS or enquiries", async () => {
    await role("creative_editor");
    expect((await save()).rows).toEqual([{ revision: 1 }]);
    expect(
      (await db.query("select * from public.growthly_site_content")).rows,
    ).toHaveLength(0);
    expect(
      (await db.query("select * from public.inquiries")).rows,
    ).toHaveLength(0);
    await expect(
      db.query("select public.commit_growthly_content(0,'{}',true)"),
    ).rejects.toThrow();
  });
  it("isolates drafts between authors and permits owner review", async () => {
    await role("creative_editor", other);
    expect(
      (await db.query("select * from public.growthly_creative_projects")).rows,
    ).toHaveLength(0);
    await expect(save(blankCreativeProject(id), 1)).rejects.toThrow();
    await role("admin", other);
    expect(
      (await db.query("select * from public.growthly_creative_projects")).rows,
    ).toHaveLength(1);
    await role("assistant");
    expect(
      (await db.query("select * from public.growthly_creative_projects")).rows,
    ).toHaveLength(0);
  });
  it("rejects stale saves, paid-ad scope and public-state escalation", async () => {
    await role("creative_editor");
    await expect(save(blankCreativeProject(id), 0)).rejects.toThrow();
    await expect(
      save({ ...blankCreativeProject(id), service: "digital-advertising" }, 1),
    ).rejects.toThrow();
    await expect(
      save({ ...blankCreativeProject(id), published: true }, 1),
    ).rejects.toThrow();
    const graphic = { ...blankCreativeProject(id), service: "graphic-design" };
    expect((await save(graphic, 1)).rows).toEqual([{ revision: 2 }]);
  });
  it("restricts image registration and object paths to the authenticated author", async () => {
    await role("creative_editor");
    const asset = "44444444-4444-4444-8444-444444444444";
    await expect(
      db.query(
        "insert into public.growthly_content_media(id,storage_path,width,height,created_by) values($1,$2,100,100,$3)",
        [asset, `${asset}.webp`, author],
      ),
    ).rejects.toThrow();
    await db.query(
      "insert into public.growthly_content_media(id,storage_path,width,height,created_by) values($1,$2,100,100,$3)",
      [asset, `${author}/${asset}.webp`, author],
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values('growthly-project-media',$1)",
      [`${author}/${asset}.webp`],
    );
    await expect(
      db.query(
        "insert into storage.objects(bucket_id,name) values('growthly-project-media',$1)",
        [`${other}/${asset}.webp`],
      ),
    ).rejects.toThrow();
    await role("creative_editor", other);
    expect(
      (await db.query("select * from public.growthly_content_media")).rows,
    ).toHaveLength(0);
    const stolen = {
      ...blankCreativeProject("55555555-5555-4555-8555-555555555555"),
      image: {
        assetId: asset,
        width: 100,
        height: 100,
        alt: "Synthetic private image",
        credit: "Synthetic credit",
        permissionConfirmed: false,
      },
    };
    await expect(save(stolen)).rejects.toThrow();
  });
});
