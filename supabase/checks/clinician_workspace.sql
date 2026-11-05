-- Clinician workflow regression checks on a freshly migrated local database.
-- All test patients, users and brief content are fictional; the transaction rolls back.
begin;
insert into auth.users(id)
select ('00000000-0000-0000-0000-' || lpad(n::text,12,'0'))::uuid
from generate_series(11,18) n;
insert into care_private.partners(id,approved)
values ('10000000-0000-0000-0000-000000000011',true),
       ('10000000-0000-0000-0000-000000000012',true);
insert into care_private.clinicians(partner_id,user_id,active,verified)
values
('10000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000013',true,true),
('10000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000014',true,false),
('10000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000018',true,true);
insert into care_private.coordinators(partner_id,user_id,active)
values
('10000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000015',true),
('10000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000016',true);

do $$begin
  if exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace
       where n.nspname='care_private' and c.relkind='r' and not c.relrowsecurity)
  then raise exception 'A private table has RLS disabled'; end if;
  if has_function_privilege('anon','public.assign_care_request(uuid,uuid)','execute')
  then raise exception 'Anonymous assignment exposed'; end if;
  if has_table_privilege('authenticated','care_private.coordinators','insert')
  then raise exception 'Coordinator membership write exposed'; end if;
end $$;

set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000011';
do $$
declare case_ref uuid;
begin
  case_ref:=public.submit_care_request(
    '10000000-0000-0000-0000-000000000011',gen_random_uuid(),
    '{"concern":"Fictional fever and weakness","duration":"Since yesterday"}','local-care-review-v1');
  perform set_config('test.clinician.case',case_ref::text,true);
  if exists(select from public.clinician_inbox()) or exists(select from public.coordination_queue())
    or exists(select from public.care_staff_roles()) then raise exception 'Patient sees staff data'; end if;
  begin
    perform public.assign_care_request(case_ref,'00000000-0000-0000-0000-000000000013');
    raise exception 'Patient assigned a case';
  exception when insufficient_privilege then null; end;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000016';
do $$begin
  if exists(select from public.coordination_queue()) then raise exception 'Cross-partner queue exposed'; end if;
  if exists(select from public.eligible_clinicians() where partner_id='10000000-0000-0000-0000-000000000011') then raise exception 'Cross-partner clinicians exposed'; end if;
  begin
    perform public.assign_care_request(current_setting('test.clinician.case')::uuid,'00000000-0000-0000-0000-000000000018');
    raise exception 'Cross-partner assignment accepted';
  exception when insufficient_privilege then null; end;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000015';
do $$declare cid uuid:=current_setting('test.clinician.case')::uuid;
begin
  if (select count(*) from public.coordination_queue() where case_id=cid and assigned_to is null)<>1
  then raise exception 'Coordinator did not see unassigned metadata'; end if;
  if (select count(*) from public.eligible_clinicians())<>1
  then raise exception 'Ineligible clinician listed'; end if;
  if exists(select from public.clinician_inbox()) then raise exception 'Coordinator accessed clinical brief'; end if;
  if exists(select from public.patient_reports) then raise exception 'Coordinator bypassed report RLS'; end if;
  begin
    perform public.assign_care_request(cid,'00000000-0000-0000-0000-000000000014');
    raise exception 'Unverified clinician accepted';
  exception when insufficient_privilege then null; end;
  perform public.assign_care_request(cid,'00000000-0000-0000-0000-000000000013');
  perform public.assign_care_request(cid,'00000000-0000-0000-0000-000000000013');
  if (select count(*) from public.coordination_queue() where case_id=cid and assigned_to='00000000-0000-0000-0000-000000000013')<>1
  then raise exception 'Assignment missing or duplicated'; end if;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000014';
do $$begin
  if exists(select from public.clinician_inbox()) then raise exception 'Unverified clinician accessed queue'; end if;
  begin
    perform public.respond_to_care_request(current_setting('test.clinician.case')::uuid,'Unauthorized');
    raise exception 'Unverified clinician responded';
  exception when insufficient_privilege then null; end;
end $$;

set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000013';
do $$begin
  if (select count(*) from public.clinician_inbox()
      where brief->>'concern'='Fictional fever and weakness') <> 1
  then raise exception 'Assigned clinician cannot read report'; end if;
end $$;
select public.respond_to_care_request(current_setting('test.clinician.case')::uuid,'Fictional instructions; not medical advice');
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000011';
do $$begin
  if (select count(*) from public.clinical_outcomes where response='Fictional instructions; not medical advice')<>1
  then raise exception 'Patient response unavailable'; end if;
  if (select count(*) from public.clinician_inbox())<>0
  then raise exception 'Patient unexpectedly sees clinician inbox'; end if;
end $$;
reset role;
do $$begin
  if (select count(*) from care_private.audit_events
      where case_id=current_setting('test.clinician.case')::uuid)<>3
  then raise exception 'Missing submission, assignment or review audit event'; end if;
end $$;
rollback;
