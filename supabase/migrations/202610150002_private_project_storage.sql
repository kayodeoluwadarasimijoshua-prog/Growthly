-- Requires the existing Supabase Storage schema. Owner applies after account/cost approval.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('growthly-project-media','growthly-project-media',false,2000000,array['image/webp'])
on conflict(id) do update set public=false,file_size_limit=2000000,allowed_mime_types=array['image/webp'];
create policy "Growthly content admin media read" on storage.objects for select to authenticated
  using(bucket_id='growthly-project-media' and public.is_growthly_admin());
create policy "Growthly content admin media create" on storage.objects for insert to authenticated
  with check(bucket_id='growthly-project-media' and public.is_growthly_admin());
create policy "Growthly content admin media delete" on storage.objects for delete to authenticated
  using(bucket_id='growthly-project-media' and public.is_growthly_admin());
-- Public media is served only through the app after a current-publication check.
