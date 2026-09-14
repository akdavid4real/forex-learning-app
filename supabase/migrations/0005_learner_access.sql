-- Add an explicit learner-access entitlement so authentication alone does not
-- bypass manual enrollment/payment approval.
alter table public.profiles
  add column if not exists access_status text not null default 'pending'
  check (access_status in ('pending', 'active', 'suspended'));

-- Preserve access for profiles created before this entitlement existed.
update public.profiles
set access_status = 'active'
where access_status = 'pending'
  and created_at < now();

create index if not exists profiles_access_status_idx
  on public.profiles (access_status);
