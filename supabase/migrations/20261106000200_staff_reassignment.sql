-- Controlled recovery from clinician deactivation. Fictional-data test project.
-- Applied after patient_case_progress. Retain immutable assignment-change evidence.
create table care_private.assignment_changes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.care_requests(id),
  actor_id uuid not null references auth.users(id),
  previous_clinician_id uuid not null references auth.users(id),
  new_clinician_id uuid not null references auth.users(id),
  reason text not null,
  changed_at timestamptz not null default now(),
  check (previous_clinician_id <> new_clinician_id)
);
alter table care_private.assignment_changes enable row level security;
revoke all on care_private.assignment_changes from public, anon, authenticated;

-- The published RPC interfaces are unchanged, except for safety behavior.
create or replace function public.coordination_queue()
returns table(case_id uuid, partner_id uuid, created_at timestamptz, case_status text, assigned_to uuid)
language sql stable security definer set search_path = '' as $$
  select r.id, r.partner_id, r.created_at, r.status,
    case when a.case_id is not null and (coalesce(ac.active, false) = false or coalesce(ac.verified, false) = false)
         then null::uuid else a.clinician_id end
  from public.care_requests r
  join care_private.coordinators c on c.partner_id = r.partner_id
  join care_private.partners p on p.id = r.partner_id
  left join care_private.assignments a on a.case_id = r.id
  left join care_private.clinicians ac on ac.partner_id=a.partner_id and ac.user_id=a.clinician_id
  where c.user_id = (select auth.uid()) and c.active and p.approved
  order by (a.clinician_id is null) desc, r.created_at desc, r.id
  limit 100;
$$;

create or replace function public.eligible_clinicians()
returns table(partner_id uuid, clinician_id uuid)
language sql stable security definer set search_path = '' as $$
  select c.partner_id, c.user_id
  from care_private.clinicians c
  join care_private.coordinators o on o.partner_id = c.partner_id
  join care_private.partners p on p.id = c.partner_id
  where o.user_id = (select auth.uid()) and o.active
    and c.active and c.verified and p.approved and c.user_id <> (select auth.uid())
  order by c.partner_id, c.user_id;
$$;

create or replace function public.assign_care_request(target uuid, clinician uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  associated_partner uuid;
  current_status text;
  existing uuid;
  old_active boolean;
begin
  if actor is null or target is null or clinician is null then
    raise exception 'Authorized coordinator and case required' using errcode='42501';
  end if;
  -- A coordinator who is also a clinician must never allocate work to themselves.
  if actor = clinician then
    raise exception 'Independent coordinator assignment is required' using errcode='42501';
  end if;

  -- Lock a case so two coordinators cannot assign it concurrently.
  select r.partner_id, r.status into associated_partner, current_status
  from public.care_requests r where r.id = target for update;
  if not found then
    raise exception 'Case unavailable' using errcode='42501';
  end if;

  perform 1 from care_private.coordinators o
    join care_private.partners p on p.id = o.partner_id
    where o.partner_id = associated_partner and o.user_id = actor
      and o.active and p.approved for share;
  if not found then
    raise exception 'Active coordinator membership required' using errcode='42501';
  end if;
  if current_status <> 'pending' then
    raise exception 'Only pending cases may be assigned' using errcode='22023';
  end if;

  perform 1 from care_private.clinicians c
    where c.partner_id = associated_partner and c.user_id = clinician
      and c.active and c.verified for share;
  if not found then
    raise exception 'Verified, active clinician required' using errcode='42501';
  end if;

  select a.clinician_id into existing
  from care_private.assignments a where a.case_id = target for update;
  if found then
    if existing = clinician then return; end if;
    select (c.active and c.verified) into old_active
    from care_private.clinicians c
    where c.partner_id = associated_partner and c.user_id = existing;
    if coalesce(old_active, false) then
      raise exception 'Active clinician assignment cannot be replaced' using errcode='22023';
    end if;
    -- Recovery is permitted only if the previously assigned clinician has lost
    -- active or verified membership. Both the before and after IDs are retained.
    update care_private.assignments set clinician_id = clinician where case_id = target;
    insert into care_private.assignment_changes
      (case_id, actor_id, previous_clinician_id, new_clinician_id, reason)
      values (target, actor, existing, clinician, 'Previous clinician inactive or unverified');
    insert into care_private.audit_events(case_id,actor_id,event)
      values(target,actor,'reassigned');
    return;
  end if;

  insert into care_private.assignments(case_id,partner_id,clinician_id)
    values(target,associated_partner,clinician);
  insert into care_private.audit_events(case_id,actor_id,event)
    values(target,actor,'assigned');
end;
$$;

create or replace function public.respond_to_care_request(target uuid, message text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  -- Match the coordinator's lock order: case first, assignment second.
  -- This avoids a cross-lock deadlock during concurrent review/reassignment.
  perform 1 from public.care_requests where id = target for update;
  if not found then raise exception 'Case unavailable' using errcode='42501'; end if;
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
-- Patient-visible status of a fictional care case.
-- No staff identity, assignment details or other patients' data is returned.
-- Kept separate from clinician/coordinator RPCs: patients see their own journey only.
create or replace function public.patient_case_progress()
returns table (
  case_id uuid,
  submitted_at timestamptz,
  stage text,
  outcome text
)
language sql stable security definer set search_path = '' as $$
  select r.id, r.created_at,
    case when r.status = 'reviewed' then 'reviewed'::text
         when a.case_id is not null and coalesce(ac.active,false) and coalesce(ac.verified,false)
              and coalesce(p.approved,false) then 'assigned'::text
         else 'submitted'::text end as stage,
    co.response as outcome
  from public.care_requests r
  left join care_private.assignments a on a.case_id = r.id
  left join care_private.clinicians ac on ac.partner_id=a.partner_id and ac.user_id=a.clinician_id
  left join care_private.partners p on p.id=r.partner_id
  left join public.clinical_outcomes co on co.case_id = r.id
  where r.patient_id = (select auth.uid())
  order by r.created_at desc, r.id
  limit 100;
$$;
revoke all on function public.patient_case_progress()
  from public, anon, authenticated;
grant execute on function public.patient_case_progress() to authenticated;

-- Reassert least-privilege RPC grants after replacing definitions.
revoke all on function public.coordination_queue(), public.eligible_clinicians(),
  public.assign_care_request(uuid,uuid), public.respond_to_care_request(uuid,text),
  public.patient_case_progress() from public, anon, authenticated;
grant execute on function public.coordination_queue(), public.eligible_clinicians(),
  public.assign_care_request(uuid,uuid), public.respond_to_care_request(uuid,text),
  public.patient_case_progress() to authenticated;
