-- Restricted drafts only. Does not create accounts, grant owner roles or publish content.
create table if not exists public.growthly_creative_projects (
  id uuid primary key,
  creator uuid not null,
  revision bigint not null default 1,
  project jsonb not null,
  status text not null check(status in ('draft','submitted')),
  updated_at timestamptz not null default now(),
  check(jsonb_typeof(project)='object' and octet_length(project::text)<=50000),
  check(project->>'id'=id::text),
  check(coalesce(project->>'service' in ('graphic-design','ai-video-adverts'),false)),
  check(coalesce(project->>'published'='false' and project->>'publicationConfirmed'='false' and project->>'featured'='false',false))
);
alter table public.growthly_creative_projects enable row level security;
revoke all on public.growthly_creative_projects from public,anon,authenticated;
grant select on public.growthly_creative_projects to authenticated;
create policy "Creative authors read own drafts; owners review" on public.growthly_creative_projects for select to authenticated using(
 public.is_growthly_admin() or ((auth.jwt()->'app_metadata'->>'role')='creative_editor' and creator=nullif(auth.jwt()->>'sub','')::uuid)
);
create or replace function public.save_growthly_creative(p_id uuid,p_expected bigint,p_project jsonb,p_status text)
returns bigint language plpgsql security definer set search_path='' as $$
declare actor uuid; previous public.growthly_creative_projects%rowtype; next_revision bigint;
begin
 if not coalesce((auth.jwt()->'app_metadata'->>'role') in ('admin','creative_editor'),false) then raise exception 'Not authorised' using errcode='42501'; end if;
 actor:=nullif(auth.jwt()->>'sub','')::uuid;
 if actor is null or p_expected is null or p_expected<0 or p_project is null or p_status is null then raise exception 'Invalid draft'; end if;
 if p_project->'image' is not null and jsonb_typeof(p_project->'image')<>'null' and not exists(
   select 1 from public.growthly_content_media m where m.id=(p_project->'image'->>'assetId')::uuid and m.created_by=actor
   and m.width=(p_project->'image'->>'width')::integer and m.height=(p_project->'image'->>'height')::integer
 ) then raise exception 'Use your own registered media' using errcode='42501'; end if;
 select * into previous from public.growthly_creative_projects where id=p_id for update;
 if found then
   if previous.creator<>actor then raise exception 'Not your draft' using errcode='42501'; end if;
   if previous.revision<>p_expected then raise exception 'Revision conflict' using errcode='40001'; end if;
   next_revision:=previous.revision+1;
   update public.growthly_creative_projects set revision=next_revision,project=p_project,status=p_status,updated_at=now() where id=p_id;
 else
   if p_expected<>0 then raise exception 'Revision conflict' using errcode='40001'; end if;
   next_revision:=1;
   insert into public.growthly_creative_projects(id,creator,revision,project,status) values(p_id,actor,1,p_project,p_status);
 end if;
 return next_revision;
end;$$;
revoke all on function public.save_growthly_creative(uuid,bigint,jsonb,text) from public,anon;
grant execute on function public.save_growthly_creative(uuid,bigint,jsonb,text) to authenticated;

-- Editors can upload/read their own assets, not any owner's or other editor's files.
create policy "Creative editor reads own media" on public.growthly_content_media for select to authenticated using(
 (auth.jwt()->'app_metadata'->>'role')='creative_editor' and created_by=nullif(auth.jwt()->>'sub','')::uuid
);
create policy "Creative editor registers own media" on public.growthly_content_media for insert to authenticated with check(
 (auth.jwt()->'app_metadata'->>'role')='creative_editor' and created_by=nullif(auth.jwt()->>'sub','')::uuid
 and storage_path=created_by::text||'/'||id::text||'.webp'
);
create policy "Creative editor uploads own objects" on storage.objects for insert to authenticated with check(
 bucket_id='growthly-project-media' and (auth.jwt()->'app_metadata'->>'role')='creative_editor'
 and name like (auth.jwt()->>'sub')||'/%' and name ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.webp$'
);
create policy "Creative editor reads own objects" on storage.objects for select to authenticated using(
 bucket_id='growthly-project-media' and (auth.jwt()->'app_metadata'->>'role')='creative_editor'
 and name like (auth.jwt()->>'sub')||'/%'
);
