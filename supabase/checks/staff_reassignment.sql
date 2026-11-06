-- Synthetic user IDs only; no actual auth accounts are created.
-- This exercise has no persistent rows: a single transaction rolls back.
begin;
insert into auth.users(id)
select ('00000000-0000-0000-0000-' || lpad(n::text,12,'0'))::uuid
from generate_series(71,79) n;
insert into care_private.partners (id, approved)
values ('10000000-0000-0000-0000-000000000071',true),
       ('10000000-0000-0000-0000-000000000072',true);
insert into care_private.clinicians(partner_id,user_id,active,verified)
values
 ('10000000-0000-0000-0000-000000000071','00000000-0000-0000-0000-000000000073',true,true),
 ('10000000-0000-0000-0000-000000000071','00000000-0000-0000-0000-000000000074',true,true),
 ('10000000-0000-0000-0000-000000000071','00000000-0000-0000-0000-000000000075',true,true),
 ('10000000-0000-0000-0000-000000000072','00000000-0000-0000-0000-000000000079',true,true);
insert into care_private.coordinators(partner_id,user_id,active)
values
 ('10000000-0000-0000-0000-000000000071','00000000-0000-0000-0000-000000000075',true),
 ('10000000-0000-0000-0000-000000000072','00000000-0000-0000-0000-000000000078',true);

set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000071';
do $$declare x uuid;
begin
  x:=public.submit_care_request('10000000-0000-0000-0000-000000000071',
     gen_random_uuid(), '{"concern":"Fictional review case","duration":"Today"}', 'local-care-review-v1');
  perform set_config('test.reassignment.case',x::text,true);
  if (select stage from public.patient_case_progress()) <> 'submitted'
    then raise exception 'Incorrect new case stage'; end if;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000075';
do $$declare x uuid:=current_setting('test.reassignment.case')::uuid;
begin
  if (select count(*) from public.eligible_clinicians()) <> 2 then
     raise exception 'Coordinator is listed as eligible for self-assignment'; end if;
  begin
     perform public.assign_care_request(x,'00000000-0000-0000-0000-000000000075');
     raise exception 'Self-assignment was allowed';
  exception when insufficient_privilege then null; end;
  perform public.assign_care_request(x,'00000000-0000-0000-0000-000000000073');
  begin
     perform public.assign_care_request(x,'00000000-0000-0000-0000-000000000074');
     raise exception 'Active clinician was silently replaced';
  exception when invalid_parameter_value then null; end;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000071';
do $$begin
  if (select stage from public.patient_case_progress()) <> 'assigned'
     then raise exception 'Patient did not see active assignment'; end if;
end $$;
reset role;
update care_private.clinicians set verified=false
  where partner_id='10000000-0000-0000-0000-000000000071'
    and user_id='00000000-0000-0000-0000-000000000073';

set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000073';
do $$begin
  if exists(select from public.clinician_inbox()) then
     raise exception 'De-verified clinician still sees patient brief'; end if;
  if exists(select from public.care_staff_roles()) then
     raise exception 'De-verified clinician still has staff role'; end if;
  begin
     perform public.respond_to_care_request(current_setting('test.reassignment.case')::uuid,'Unauthorized review');
     raise exception 'De-verified clinician responded';
  exception when insufficient_privilege then null; end;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000071';
do $$begin
  if (select stage from public.patient_case_progress()) <> 'submitted'
    then raise exception 'Patient is falsely told an unavailable clinician is assigned'; end if;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000078';
do $$begin
  if exists(select from public.coordination_queue())
    then raise exception 'Unrelated partner can see assignment metadata'; end if;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000075';
do $$declare x uuid:=current_setting('test.reassignment.case')::uuid;
begin
  if (select count(*) from public.coordination_queue()
      where case_id=x and assigned_to is null) <> 1
    then raise exception 'Revoked staff case not available for coordinator recovery'; end if;
  perform public.assign_care_request(x,'00000000-0000-0000-0000-000000000074');
  -- Same assignment retry is idempotent, not an extra history entry.
  perform public.assign_care_request(x,'00000000-0000-0000-0000-000000000074');
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000074';
do $$begin
  if (select count(*) from public.clinician_inbox()) <> 1
    then raise exception 'Replacement clinician cannot review'; end if;
  perform public.respond_to_care_request(current_setting('test.reassignment.case')::uuid,
    'Fictional reassigned clinician response.');
end $$;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000071';
do $$begin
  if (select stage from public.patient_case_progress()) <> 'reviewed'
  or (select outcome from public.patient_case_progress()) <> 'Fictional reassigned clinician response.'
    then raise exception 'Patient did not receive reassigned response'; end if;
end $$;
reset role;
do $$declare x uuid:=current_setting('test.reassignment.case')::uuid;
begin
  if (select count(*) from care_private.assignment_changes where case_id=x
      and actor_id='00000000-0000-0000-0000-000000000075'
      and previous_clinician_id='00000000-0000-0000-0000-000000000073'
      and new_clinician_id='00000000-0000-0000-0000-000000000074') <> 1
    then raise exception 'Immutable reassignment evidence missing or duplicated'; end if;
  if (select count(*) from care_private.audit_events where case_id=x) <> 4
    then raise exception 'Expected submission, assignment, reassignment and review events'; end if;
  if has_table_privilege('authenticated','care_private.assignment_changes','select')
    then raise exception 'Private history exposed to client'; end if;
end $$;
rollback;
