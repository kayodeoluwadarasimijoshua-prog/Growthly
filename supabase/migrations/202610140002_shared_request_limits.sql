-- Optional; do not apply/enable until the owner approves using the existing database.
create table if not exists public.growthly_request_limits (
  bucket_key text primary key check (length(bucket_key) = 64),
  attempts integer not null,
  expires_at timestamptz not null
);
create index if not exists growthly_request_limits_expiry on public.growthly_request_limits (expires_at);
alter table public.growthly_request_limits enable row level security;
revoke all on public.growthly_request_limits from public, anon, authenticated;
grant select, insert, update, delete on public.growthly_request_limits to service_role;

create or replace function public.consume_growthly_rate_limit(p_bucket_key text, p_request_limit integer, p_window_seconds integer)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare row_state public.growthly_request_limits%rowtype;
        checked_at timestamptz := clock_timestamp();
begin
  if length(p_bucket_key) <> 64 or p_request_limit < 1 or p_request_limit > 1000 or p_window_seconds < 1 or p_window_seconds > 3600 then
    raise exception 'Invalid limiter bounds';
  end if;
  -- Bounded expired-only cleanup; no private lead deletion or adopted lead-retention policy.
  -- Only one caller cleans up at a time; other callers lock only their own bucket.
  if pg_try_advisory_xact_lock(71414002) then
  delete from public.growthly_request_limits where growthly_request_limits.bucket_key in (
    select r.bucket_key from public.growthly_request_limits r where r.expires_at <= checked_at
    order by r.expires_at, r.bucket_key limit 100 for update skip locked
  );
  end if;
  insert into public.growthly_request_limits as r (bucket_key, attempts, expires_at)
  values (p_bucket_key, 1, checked_at + make_interval(secs => p_window_seconds))
  on conflict on constraint growthly_request_limits_pkey do update set
    attempts = case when r.expires_at <= checked_at then 1 else least(r.attempts + 1, p_request_limit + 1) end,
    expires_at = case when r.expires_at <= checked_at then checked_at + make_interval(secs => p_window_seconds) else r.expires_at end
  returning * into row_state;
  return jsonb_build_object('allowed', row_state.attempts <= p_request_limit,
    'retry_after', case when row_state.attempts <= p_request_limit then 0
      else greatest(1, ceil(extract(epoch from row_state.expires_at - checked_at))::integer) end);
end;
$$;
revoke all on function public.consume_growthly_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_growthly_rate_limit(text, integer, integer) to service_role;
