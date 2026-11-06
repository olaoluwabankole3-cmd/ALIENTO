import test from "node:test";
import assert from "node:assert/strict";
import { createCareClient } from "../src/care/client.ts";
const config = {url:"https://test.invalid",key:"sb_publishable_test",partner:"partner"};
const session={access_token:"patient-token",user:{id:"patient-one"}};
test("patient progress comes from authenticated patient-scoped RPC",async()=>{
 const calls=[];
 const transport=async(url,options)=>{
   calls.push({url,options});
   return {ok:true,status:200,json:async()=>[
     {case_id:"case-a",submitted_at:"2026-11-06T09:00:00Z",stage:"assigned",outcome:null},
     {case_id:"case-b",submitted_at:"2026-11-05T09:00:00Z",stage:"reviewed",outcome:"Fictional review"}
   ]};
 };
 const client=createCareClient(config,transport);
 const result=await client.cases(session);
 assert.equal(result[0].stage,"assigned");
 assert.equal(result[1].outcome,"Fictional review");
 assert.equal(calls[0].url,"https://test.invalid/rest/v1/rpc/patient_case_progress");
 assert.equal(calls[0].options.method,"POST");
 assert.equal(calls[0].options.headers.Authorization,"Bearer patient-token");
 assert.deepEqual(JSON.parse(calls[0].options.body),{});
 assert.equal(calls[0].options.body.includes("patient-one"),false);
});
test("malformed stage, response, or case IDs are rejected",async()=>{
 for (const bad of [
    [{case_id:"c",submitted_at:"date",stage:"assigned",outcome:{detail:"private"}}],
    [{case_id:"c",submitted_at:"date",stage:"unrecognised",outcome:null}],
    [{case_id:null,submitted_at:"date",stage:"submitted",outcome:null}],
 ]) {
   const client=createCareClient(config,async()=>({ok:true,status:200,json:async()=>bad}));
   await assert.rejects(client.cases(session),/Cases could not be loaded/);
 }
});
test("patient progress query requires a valid signed-in session",async()=>{
 const client=createCareClient(config,async()=>({ok:false,status:401}));
 await assert.rejects(client.cases(session),/sign out and sign in/);
});
