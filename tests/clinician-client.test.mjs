import test from "node:test";
import assert from "node:assert/strict";
import { createClinicianClient } from "../src/clinician/client.ts";
const config = {url:"https://test.invalid",key:"sb_publishable_fake"};
const session={access_token:"test-token",user:{id:"test-clinician"}};
test("staff role lookup uses bearer token and expected RPC",async()=>{
  const calls=[];
  const api=createClinicianClient(config,async(url,opt)=>{calls.push({url,opt});return {ok:true,status:200,json:async()=>[{partner_id:"p",staff_role:"clinician"}]};});
  assert.equal((await api.roles(session))[0].staff_role,"clinician");
  assert.equal(calls[0].url,"https://test.invalid/rest/v1/rpc/care_staff_roles");
  assert.equal(calls[0].opt.headers.Authorization,"Bearer test-token");
  assert.equal(calls[0].opt.headers.apikey,config.key);
});
test("clinician inbox and coordinator queue are separate endpoints",async()=>{
 const urls=[];
 const api=createClinicianClient(config,async(url)=>{urls.push(url);return {ok:true,status:200,json:async()=>[]};});
 await api.clinicianInbox(session);await api.coordinationQueue(session);await api.clinicians(session);
 assert.deepEqual(urls.map(x=>x.split("/").at(-1)),["clinician_inbox","coordination_queue","eligible_clinicians"]);
});
test("only case id and target clinician are sent for assignment",async()=>{
 const calls=[];
 const api=createClinicianClient(config,async(url,opt)=>{calls.push({url,opt});return {ok:true,status:204,json:async()=>{throw new Error("204 no body");}};});
 await api.assign(session,"case-id","clinician-id");
 assert.deepEqual(JSON.parse(calls[0].opt.body),{target:"case-id",clinician:"clinician-id"});
 assert.equal(calls[0].url.split("/").at(-1),"assign_care_request");
});
test("response RPC does not embed patient or role identifiers",async()=>{
 const calls=[];
 const api=createClinicianClient(config,async(url,opt)=>{calls.push({url,opt});return {ok:true,status:204};});
 await api.respond(session,"case-id","Test-only follow-up");
 assert.deepEqual(JSON.parse(calls[0].opt.body),{target:"case-id",message:"Test-only follow-up"});
});
test("expired token and malformed role responses fail closed",async()=>{
 const unauthorised=createClinicianClient(config,async()=>({ok:false,status:401}));
 await assert.rejects(unauthorised.roles(session),/Session expired/);
 const malformed=createClinicianClient(config,async()=>({ok:true,status:200,json:async()=>({role:"admin"})}));
 await assert.rejects(malformed.roles(session),/Unexpected/);
});
