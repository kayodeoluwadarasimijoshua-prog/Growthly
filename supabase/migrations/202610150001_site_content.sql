-- One-time owner-approved setup. Does not enable SITE_CMS_ENABLED or lead delivery.
create table if not exists public.growthly_site_content (
  id text primary key check(id='main'),
  revision bigint not null default 0,
  draft jsonb,
  published jsonb,
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
insert into public.growthly_site_content(id) values('main') on conflict do nothing;
create table if not exists public.growthly_content_history (
  revision bigint primary key,
  document jsonb not null,
  published boolean not null,
  actor uuid,
  created_at timestamptz not null default now()
);
create table if not exists public.growthly_content_media (
  id uuid primary key,
  storage_path text unique not null,
  width integer not null check(width between 1 and 1600),
  height integer not null check(height between 1 and 1600),
  created_by uuid,
  created_at timestamptz not null default now()
);
alter table public.growthly_site_content enable row level security;
alter table public.growthly_content_history enable row level security;
alter table public.growthly_content_media enable row level security;
revoke all on public.growthly_site_content,public.growthly_content_history,public.growthly_content_media from public,anon,authenticated;
grant select on public.growthly_site_content,public.growthly_content_history to authenticated;
grant select,insert,delete on public.growthly_content_media to authenticated;
grant select on public.growthly_site_content,public.growthly_content_media to service_role;
create policy "Content owners read state" on public.growthly_site_content for select to authenticated using(public.is_growthly_admin());
create policy "Content owners read history" on public.growthly_content_history for select to authenticated using(public.is_growthly_admin());
create policy "Content owners read media" on public.growthly_content_media for select to authenticated using(public.is_growthly_admin());
create policy "Content owners insert media" on public.growthly_content_media for insert to authenticated with check(public.is_growthly_admin());
create policy "Content owners remove orphan media" on public.growthly_content_media for delete to authenticated using(public.is_growthly_admin());

-- All changes compare a revision under a row lock; two tabs cannot silently overwrite.
create or replace function public.commit_growthly_content(p_expected bigint,p_document jsonb,p_publish boolean)
returns bigint language plpgsql security definer set search_path='' as $$
declare current_row public.growthly_site_content%rowtype; next_revision bigint;
begin
  if not coalesce((auth.jwt()->'app_metadata'->>'role')='admin',false) then raise exception 'Not authorised' using errcode='42501'; end if;
  if p_expected is null or p_expected<0 or p_publish is null then raise exception 'Invalid revision or action'; end if;
  if p_document is null or jsonb_typeof(p_document)<>'object' or octet_length(p_document::text)>500000 then raise exception 'Invalid content size'; end if;
  select * into current_row from public.growthly_site_content where id='main' for update;
  if current_row.revision<>p_expected then raise exception 'Content revision conflict' using errcode='40001'; end if;
  next_revision:=current_row.revision+1;
  update public.growthly_site_content set revision=next_revision,draft=p_document,
    published=case when p_publish then p_document else published end,
    published_at=case when p_publish then now() else published_at end,updated_at=now() where id='main';
  insert into public.growthly_content_history(revision,document,published,actor)
    values(next_revision,p_document,p_publish,nullif(auth.jwt()->>'sub','')::uuid);
  return next_revision;
end;$$;
revoke all on function public.commit_growthly_content(bigint,jsonb,boolean) from public,anon;
grant execute on function public.commit_growthly_content(bigint,jsonb,boolean) to authenticated;
-- History stays private. No arbitrary public table or storage grants.
