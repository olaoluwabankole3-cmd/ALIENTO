-- ALIENTO test-only clinical operations.
-- Staff membership is provisioned only through trusted SQL operations; no self-enrolment.
-- Metadata-only coordinator queue, assignment-controlled clinician queue, and audit events.
create table care_private.coordinators (
  partner_id uuid not null references care_private.partners(id),
  user_id uuid not null references auth.users(id),
  active boolean not null default false,
  primary key (partner_id, user_id)
);
revoke all on care_private.coordinators from public, anon, authenticated;

-- Defense in depth on internal tables already inaccessible by direct Data API grants.
alter table care_private.partners enable row level security;
alter table care_private.clinicians enable row level security;
alter table care_private.assignments enable row level security;
alter table care_private.consent_receipts enable row level security;
alter table care_private.audit_events enable row level security;
alter table care_private.coordinators enable row level security;
-- No direct private-table RLS policies: only explicitly authorized functions access these.

create function public.care_staff_roles()
returns table (partner_id uuid, staff_role text)
language sql stable security definer set search_path = '' as $$
  select p.id, 'clinician'::text
  from care_private.partners p
  join care_private.clinicians c on c.partner_id = p.id
  where p.approved and c.user_id = (select auth.uid()) and c.active and c.verified
  union all
  select p.id, 'coordinator'::text
  from care_private.partners p
  join care_private.coordinators c on c.partner_id = p.id
  where p.approved and c.user_id = (select auth.uid()) and c.active;
$$;

create function public.clinician_inbox()
returns table(case_id uuid, created_at timestamptz, case_status text, brief jsonb, reply text)
language sql stable security definer set search_path = '' as $$
  select r.id, r.created_at, r.status, pr.brief, co.response
  from care_private.assignments a
  join care_private.clinicians c on (c.partner_id, c.user_id) = (a.partner_id, a.clinician_id)
  join care_private.partners p on p.id = a.partner_id
  join public.care_requests r on r.id = a.case_id and r.partner_id = a.partner_id
  join public.patient_reports pr on pr.case_id = r.id
  left join public.clinical_outcomes co on co.case_id = r.id
  where a.clinician_id = (select auth.uid())
    and c.active and c.verified and p.approved
  order by r.created_at desc, r.id
  limit 100;
$$;

create function public.coordination_queue()
returns table(case_id uuid, partner_id uuid, created_at timestamptz, case_status text, assigned_to uuid)
language sql stable security definer set search_path = '' as $$
  select r.id, r.partner_id, r.created_at, r.status, a.clinician_id
  from public.care_requests r
  join care_private.coordinators c on c.partner_id = r.partner_id
  join care_private.partners p on p.id = r.partner_id
  left join care_private.assignments a on a.case_id = r.id
  where c.user_id = (select auth.uid()) and c.active and p.approved
  order by (a.clinician_id is null) desc, r.created_at desc, r.id
  limit 100;
$$;

create function public.eligible_clinicians()
returns table(partner_id uuid, clinician_id uuid)
language sql stable security definer set search_path = '' as $$
  select c.partner_id, c.user_id
  from care_private.clinicians c
  join care_private.coordinators o on o.partner_id = c.partner_id
  join care_private.partners p on p.id = c.partner_id
  where o.user_id = (select auth.uid()) and o.active
    and c.active and c.verified and p.approved
  order by c.partner_id, c.user_id;
$$;

create function public.assign_care_request(target uuid, clinician uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  associated_partner uuid;
  current_status text;
  existing uuid;
begin
  if actor is null or target is null or clinician is null then
    raise exception 'Authorized coordinator and case required' using errcode='42501';
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
  from care_private.assignments a where a.case_id = target;
  if found then
    if existing = clinician then return; end if;
    raise exception 'Case already assigned to another clinician' using errcode='22023';
  end if;

  insert into care_private.assignments(case_id,partner_id,clinician_id)
    values(target,associated_partner,clinician);
  insert into care_private.audit_events(case_id,actor_id,event)
    values(target,actor,'assigned');
end;
$$;

-- Privileged functions remain restricted to signed-in users; each checks
-- role membership and partner approval at query time (never user_metadata).
revoke all on function public.care_staff_roles(),
  public.clinician_inbox(), public.coordination_queue(),
  public.eligible_clinicians(), public.assign_care_request(uuid,uuid)
  from public, anon, authenticated;
grant execute on function public.care_staff_roles(),
  public.clinician_inbox(), public.coordination_queue(),
  public.eligible_clinicians(), public.assign_care_request(uuid,uuid)
  to authenticated;
