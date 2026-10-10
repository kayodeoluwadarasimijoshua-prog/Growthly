-- GROWTHLY inquiry storage and admin-only lead access.
-- Public form submissions are inserted by a server-only service-role client.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  business_name text,
  email text,
  phone text,
  preferred_contact text not null check (preferred_contact in ('whatsapp', 'email', 'phone')),
  service text not null,
  package_id text not null default 'custom',
  brief text not null check (char_length(brief) between 20 and 4000),
  budget_range text not null,
  preferred_deadline text not null,
  attribution jsonb not null default '{}'::jsonb check (jsonb_typeof(attribution) = 'object'),
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  assigned_to text,
  internal_notes text not null default '',
  quoted_amount numeric(14, 2) check (quoted_amount is null or quoted_amount >= 0),
  deposit_status text not null default 'not-discussed' check (deposit_status in ('not-discussed', 'not-requested', 'awaiting', 'partial', 'paid')),
  follow_up_date date,
  constraint inquiries_has_contact check (
    coalesce(nullif(trim(email), ''), null) is not null
    or coalesce(nullif(trim(phone), ''), null) is not null
  )
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_created_at_idx on public.inquiries (status, created_at desc);
create index if not exists inquiries_follow_up_date_idx on public.inquiries (follow_up_date) where follow_up_date is not null;

create or replace function public.set_inquiries_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_inquiries_updated_at();

-- Supabase app_metadata is controlled by a trusted administrator, not by a user
-- editing their own profile. Only users with role=admin pass this function.
create or replace function public.is_growthly_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_growthly_admin() from public, anon;
grant execute on function public.is_growthly_admin() to authenticated;

alter table public.inquiries enable row level security;
revoke all on table public.inquiries from anon, authenticated;
grant select, update on table public.inquiries to authenticated;
grant insert on table public.inquiries to service_role;

drop policy if exists "Growthly admins can read inquiries" on public.inquiries;
create policy "Growthly admins can read inquiries"
  on public.inquiries for select to authenticated
  using (public.is_growthly_admin());

drop policy if exists "Growthly admins can update inquiries" on public.inquiries;
create policy "Growthly admins can update inquiries"
  on public.inquiries for update to authenticated
  using (public.is_growthly_admin())
  with check (public.is_growthly_admin());

comment on table public.inquiries is 'Private GROWTHLY project enquiry and lead-management records.';
comment on column public.inquiries.attribution is 'Whitelisted UTM campaign values only; do not put contact or form data here.';
comment on column public.inquiries.internal_notes is 'Private administrator notes. Never return this field to public pages or analytics.';
