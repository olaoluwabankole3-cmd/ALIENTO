-- Run on a reset local Supabase database with psql -v ON_ERROR_STOP=1.
begin;
insert into auth.users(id) select ('00000000-0000-0000-0000-'||lpad(n::text,12,'0'))::uuid from generate_series(1,4) n;
insert into care_private.partners values ('10000000-0000-0000-0000-000000000001',true);
insert into care_private.clinicians select p.id,u.id,true,true from care_private.partners p cross join auth.users u
where u.id in ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000004');

set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';
do $$
declare partner uuid:='10000000-0000-0000-0000-000000000001'; key uuid:=gen_random_uuid(); report jsonb:='{"concern":"Fictional example"}'; ref uuid;
begin
  begin perform public.submit_care_request(partner,key,report,null); raise exception 'missing consent accepted';
  exception when insufficient_privilege then null; end;
  begin perform public.submit_care_request(gen_random_uuid(),key,report,'local-care-review-v1'); raise exception 'unknown partner accepted';
  exception when insufficient_privilege then null; end;
  ref:=public.submit_care_request(partner,key,report,'local-care-review-v1');
  if public.submit_care_request(partner,key,report,'local-care-review-v1')<>ref then raise exception 'duplicate case'; end if;
  begin perform public.submit_care_request(partner,key,'{"concern":"Changed"}','local-care-review-v1'); raise exception 'changed retry accepted';
  exception when invalid_parameter_value then null; end;
  if (select count(*) from public.patient_reports)<>1 then raise exception 'own report unavailable'; end if;
  begin update public.care_requests set status='reviewed'; raise exception 'direct status mutation allowed';
  exception when insufficient_privilege then null; end;
  begin insert into care_private.assignments values(ref,partner,auth.uid()); raise exception 'self-assignment allowed';
  exception when insufficient_privilege then null; end;
  perform set_config('test.case',ref::text,true);
end;
$$;
reset role;
insert into care_private.assignments select id,partner_id,'00000000-0000-0000-0000-000000000003' from public.care_requests;
set local role authenticated;
do $$
declare actor text;
begin
  foreach actor in array array['00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004'] loop
    perform set_config('request.jwt.claim.sub',actor,true);
    if exists(select from public.care_requests) or exists(select from public.patient_reports) then raise exception 'case exposed'; end if;
    begin perform public.respond_to_care_request(current_setting('test.case')::uuid,'Unauthorized'); raise exception 'unauthorized response';
    exception when insufficient_privilege then null; end;
  end loop;
end;
$$;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000003';
do $$ begin
  if (select count(*) from public.patient_reports)<>1 then raise exception 'assigned clinician cannot read'; end if;
end; $$;
select public.respond_to_care_request(current_setting('test.case')::uuid,'Fictional next step');
select public.respond_to_care_request(current_setting('test.case')::uuid,'Fictional next step');
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000002';
do $$ begin if exists(select from public.clinical_outcomes) then raise exception 'outcome exposed'; end if; end; $$;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000001';
do $$ begin
  if not exists(select from public.care_requests where status='reviewed') or
     not exists(select from public.clinical_outcomes where response='Fictional next step') then raise exception 'patient outcome missing'; end if;
end; $$;
reset role;
update care_private.clinicians set active=false;
set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-0000-0000-000000000003';
do $$ begin if exists(select from public.patient_reports) or exists(select from public.clinical_outcomes) then raise exception 'suspended clinician retained access'; end if; end; $$;
reset role;
do $$ begin
  if (select count(*) from care_private.consent_receipts)<>1 or (select count(*) from care_private.audit_events)<>2 then raise exception 'receipt or audit count incorrect'; end if;
  if has_function_privilege('anon','public.submit_care_request(uuid,uuid,jsonb,text)','execute') then raise exception 'anonymous submission granted'; end if;
end; $$;
rollback;
