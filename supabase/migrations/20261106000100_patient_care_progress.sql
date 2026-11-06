-- Patient-visible status of a fictional care case.
-- No staff identity, assignment details or other patients' data is returned.
-- Kept separate from clinician/coordinator RPCs: patients see their own journey only.
create function public.patient_case_progress()
returns table (
  case_id uuid,
  submitted_at timestamptz,
  stage text,
  outcome text
)
language sql stable security definer set search_path = '' as $$
  select r.id, r.created_at,
    case when r.status = 'reviewed' then 'reviewed'::text
         when a.case_id is not null then 'assigned'::text
         else 'submitted'::text end as stage,
    co.response as outcome
  from public.care_requests r
  left join care_private.assignments a on a.case_id = r.id
  left join public.clinical_outcomes co on co.case_id = r.id
  where r.patient_id = (select auth.uid())
  order by r.created_at desc, r.id
  limit 100;
$$;
revoke all on function public.patient_case_progress()
  from public, anon, authenticated;
grant execute on function public.patient_case_progress() to authenticated;
