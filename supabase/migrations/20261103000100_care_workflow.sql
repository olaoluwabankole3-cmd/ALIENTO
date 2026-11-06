-- First local care workflow. Only narrowly scoped functions can mutate cases.
create schema care_private;
revoke all on schema care_private from public, anon, authenticated;

create table care_private.partners (
  id uuid primary key,
  approved boolean not null default false
);
create table care_private.clinicians (
  partner_id uuid references care_private.partners,
  user_id uuid references auth.users,
  active boolean not null default false,
  verified boolean not null default false,
  primary key (partner_id, user_id)
);
create table public.care_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users,
  partner_id uuid not null references care_private.partners,
  submission_key uuid not null,
  status text not null default 'pending' check (status in ('pending','reviewed')),
  created_at timestamptz not null default now(),
  unique (patient_id, submission_key),
  unique (id, partner_id)
);
create table care_private.assignments (
  case_id uuid primary key,
  partner_id uuid not null,
  clinician_id uuid not null,
  foreign key (case_id, partner_id) references public.care_requests (id, partner_id),
  foreign key (partner_id, clinician_id) references care_private.clinicians (partner_id, user_id)
);
create table public.patient_reports (
  case_id uuid primary key references public.care_requests,
  brief jsonb not null
);
create table care_private.consent_receipts (
  case_id uuid primary key references public.care_requests,
  patient_id uuid not null references auth.users,
  wording_version text not null,
  granted_at timestamptz not null default now()
);
create table public.clinical_outcomes (
  case_id uuid primary key references public.care_requests,
  clinician_id uuid not null references auth.users,
  response text not null,
  created_at timestamptz not null default now()
);
create table care_private.audit_events (
  case_id uuid not null references public.care_requests,
  actor_id uuid not null references auth.users,
  event text not null,
  created_at timestamptz not null default now()
);

create function care_private.is_assigned(target uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from care_private.assignments a
    join care_private.clinicians c on (c.partner_id,c.user_id)=(a.partner_id,a.clinician_id)
    join care_private.partners p on p.id=a.partner_id
    where a.case_id=target and c.user_id=auth.uid() and c.active and c.verified and p.approved
  );
$$;
revoke all on function care_private.is_assigned(uuid) from public, anon, authenticated;
grant usage on schema care_private to authenticated;
revoke all on all tables in schema care_private from public, anon, authenticated;
grant execute on function care_private.is_assigned(uuid) to authenticated;

alter table public.care_requests enable row level security;
alter table public.patient_reports enable row level security;
alter table public.clinical_outcomes enable row level security;
revoke all on public.care_requests, public.patient_reports, public.clinical_outcomes from public, anon, authenticated;
grant select on public.care_requests, public.patient_reports, public.clinical_outcomes to authenticated;
create policy read_cases on public.care_requests for select to authenticated
using (patient_id=(select auth.uid()) or care_private.is_assigned(id));
create policy read_reports on public.patient_reports for select to authenticated
using (exists (select from public.care_requests r where r.id=case_id));
create policy read_outcomes on public.clinical_outcomes for select to authenticated
using (exists (select from public.care_requests r where r.id=case_id));

create function public.submit_care_request(partner uuid, retry_key uuid, report jsonb, consent_version text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare actor uuid := auth.uid(); case_ref uuid;
begin
  if actor is null or consent_version is distinct from 'local-care-review-v1' then
    raise exception 'Authenticated sharing consent required' using errcode='42501';
  end if;
  if retry_key is null or report is null or jsonb_typeof(report) <> 'object'
    or jsonb_typeof(report->'concern') is distinct from 'string'
    or length(trim(report->>'concern'))=0 or octet_length(report::text)>16000 then
    raise exception 'Invalid patient brief or submission key' using errcode='22023';
  end if;
  perform 1 from care_private.partners where id=partner and approved for share;
  if not found then raise exception 'Partner unavailable' using errcode='42501'; end if;
  insert into public.care_requests(patient_id,partner_id,submission_key)
    values(actor,partner,retry_key) on conflict(patient_id,submission_key) do nothing returning id into case_ref;
  if case_ref is null then
    select r.id into case_ref from public.care_requests r join public.patient_reports b on b.case_id=r.id
      where r.patient_id=actor and r.submission_key=retry_key and r.partner_id=partner and b.brief=report;
    if not found then raise exception 'Submission key already used for different content' using errcode='22023'; end if;
    return case_ref;
  end if;
  insert into public.patient_reports values(case_ref,report);
  insert into care_private.consent_receipts(case_id,patient_id,wording_version) values(case_ref,actor,consent_version);
  insert into care_private.audit_events(case_id,actor_id,event) values(case_ref,actor,'submitted');
  return case_ref;
end;
$$;

create function public.respond_to_care_request(target uuid, message text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Hold the authorization rows until the outcome and audit event commit.
  perform 1 from care_private.assignments a
    join care_private.clinicians c on (c.partner_id,c.user_id)=(a.partner_id,a.clinician_id)
    join care_private.partners p on p.id=a.partner_id
    where a.case_id=target and c.user_id=auth.uid() and c.active and c.verified and p.approved for share;
  if not found then raise exception 'Assignment required' using errcode='42501'; end if;
  if message is null or length(trim(message)) not between 1 and 4000 then
    raise exception 'Invalid patient-facing response' using errcode='22023';
  end if;
  update public.care_requests set status='reviewed' where id=target and status='pending';
  if not found then
    if exists(select from public.clinical_outcomes where case_id=target and clinician_id=auth.uid() and response=trim(message)) then return; end if;
    raise exception 'Case already reviewed' using errcode='22023';
  end if;
  insert into public.clinical_outcomes(case_id,clinician_id,response) values(target,auth.uid(),trim(message));
  insert into care_private.audit_events(case_id,actor_id,event) values(target,auth.uid(),'reviewed');
end;
$$;
revoke all on function public.submit_care_request(uuid,uuid,jsonb,text), public.respond_to_care_request(uuid,text) from public, anon, authenticated;
grant execute on function public.submit_care_request(uuid,uuid,jsonb,text), public.respond_to_care_request(uuid,text) to authenticated;
