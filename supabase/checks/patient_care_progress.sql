-- Full fictional patient -> coordinator -> clinician -> patient round-trip.
-- Run after migrations on reset local database. No test rows survive: ROLLBACK.
begin;
insert into auth.users(id)
select ('00000000-0000-0000-0000-'||lpad(n::text,12,'0'))::uuid
from generate_series(21,26) n;
insert into care_private.partners (id,approved)
values ('10000000-0000-0000-0000-000000000021',true);
insert into care_private.clinicians(partner_id,user_id,active,verified)
values ('10000000-0000-0000-0000-000000000021',
        '00000000-0000-0000-0000-000000000023',true,true);
insert into care_private.coordinators(partner_id,user_id,active)
values ('10000000-0000-0000-0000-000000000021',
        '00000000-0000-0000-0000-000000000024',true);

-- Patient 21 submits and can read ONLY own submitted stage.
set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000021';
do $$
declare ref uuid;
begin
  ref := public.submit_care_request(
    '10000000-0000-0000-0000-000000000021',gen_random_uuid(),
    '{"concern":"Fictional symptom report","duration":"Today","vomiting":"No"}',
    'local-care-review-v1'
  );
  perform set_config('test.progress.case',ref::text,true);
  if (select count(*) from public.patient_case_progress()) <> 1
     or (select stage from public.patient_case_progress()) <> 'submitted'
  then raise exception 'Own newly submitted case not visible'; end if;
  if (select outcome from public.patient_case_progress()) is not null
  then raise exception 'Response appeared prematurely'; end if;
end $$;

-- Another patient must not see anyone else's progress or responses.
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000022';
do $$begin
  if exists(select from public.patient_case_progress())
  then raise exception 'Cross-patient progress exposed'; end if;
  if exists(select from public.care_requests)
  then raise exception 'Cross-patient case exposed'; end if;
end $$;

-- Coordinator receives metadata, cannot read symptoms, and assigns verified clinician.
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000024';
do $$begin
  if (select count(*) from public.coordination_queue()) <> 1
  then raise exception 'Coordinator cannot see pending metadata'; end if;
  if exists(select from public.patient_reports) or exists(select from public.patient_case_progress())
  then raise exception 'Coordinator accessed patient details'; end if;
  perform public.assign_care_request(
    current_setting('test.progress.case')::uuid,
    '00000000-0000-0000-0000-000000000023'
  );
end $$;

-- Patient can now see an assignment but NOT clinician identity.
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000021';
do $$begin
  if (select stage from public.patient_case_progress()) <> 'assigned'
  then raise exception 'Patient not informed case assigned'; end if;
  if (select outcome from public.patient_case_progress()) is not null
  then raise exception 'Unexpected outcome before review'; end if;
end $$;

-- Assigned clinician sees their case, responds, and may retry identical response.
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000023';
do $$begin
  if (select count(*) from public.clinician_inbox()) <> 1
  then raise exception 'Clinician inbox missing assignment'; end if;
  perform public.respond_to_care_request(
    current_setting('test.progress.case')::uuid,
    'Fictional response from authorised reviewer.'
  );
  perform public.respond_to_care_request(
    current_setting('test.progress.case')::uuid,
    'Fictional response from authorised reviewer.'
  );
end $$;

-- Patient receives response; another patient remains isolated.
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000021';
do $$begin
  if (select stage from public.patient_case_progress()) <> 'reviewed'
     or (select outcome from public.patient_case_progress())
        <> 'Fictional response from authorised reviewer.'
  then raise exception 'Patient did not receive review'; end if;
end $$;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000022';
do $$begin
  if exists(select from public.patient_case_progress())
  then raise exception 'Other patient read clinician response'; end if;
end $$;

-- An anonymous token cannot execute the patient RPC.
reset role;
do $$begin
  if has_function_privilege('anon','public.patient_case_progress()','execute')
  then raise exception 'Anonymous patient progress RPC exposed'; end if;
  if (select count(*) from care_private.audit_events
      where case_id=current_setting('test.progress.case')::uuid) <> 3
  then raise exception 'Submission, assignment, response audit chain incomplete'; end if;
end $$;
rollback;
