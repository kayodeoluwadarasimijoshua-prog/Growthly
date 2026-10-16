-- Apply only to the approved private lead store, then enable the server flag.
-- Existing leads remain unchanged. The unique index is the concurrent retry arbiter.
alter table public.inquiries
  add column if not exists submission_id uuid,
  add column if not exists submission_hash text;
create unique index if not exists inquiries_submission_id_unique
  on public.inquiries (submission_id) where submission_id is not null;
-- No new public grants or RLS policies. This does not enable a provider or collection.

-- Retry verification needs read access for the server-only writer.
grant select on public.inquiries to service_role;
