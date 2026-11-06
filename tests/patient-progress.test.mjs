import test from 'node:test';
import assert from 'node:assert/strict';
import { createCareClient } from '../src/care/client.ts';

const session = { access_token: 'patient-token', user: { id: 'patient' } };
const cfg = { url:'https://api.invalid',key:'sb_publishable_fake',partner:'fictional' };

test('My Care queries patient-only progress RPC with bearer token and no patient identifier',async()=>{
 const calls=[];
 const rows=[{case_id:'fictional-id',submitted_at:'2026-11-06T12:00:00Z',stage:'assigned',outcome:null}];
 const client=createCareClient(cfg,async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>rows};});
 assert.deepEqual(await client.cases(session),rows);
 assert.equal(calls[0].url,'https://api.invalid/rest/v1/rpc/patient_case_progress');
 assert.equal(calls[0].options.headers.Authorization,'Bearer patient-token');
 assert.deepEqual(JSON.parse(calls[0].options.body),{});
 assert.ok(!calls[0].options.body.includes('patient'));
});
test('My Care accepts all three stages and patient-visible review response',async()=>{
 const stages=['submitted','assigned','reviewed'];
 const rows=stages.map((stage,i)=>({case_id:'case-'+i,submitted_at:'2026-11-06T12:00:00Z',stage,outcome:stage==='reviewed'?'Fictional clinician response':null}));
 const c=createCareClient(cfg,async()=>({ok:true,json:async()=>rows}));
 assert.deepEqual(await c.cases(session),rows);
});
test('My Care rejects malformed, unauthorized, or inconsistent results',async()=>{
 for(const data of [[{case_id:'id',submitted_at:'date',stage:'approved',outcome:null}],
 [{case_id:'id',submitted_at:'date',stage:'reviewed',outcome:{private:'leak'}}],
 {case_id:'id',submitted_at:'date',stage:'submitted',outcome:null}]) {
   const c=createCareClient(cfg,async()=>({ok:true,json:async()=>data}));
   await assert.rejects(c.cases(session));
 }
 const forbidden=createCareClient(cfg,async()=>({ok:false,status:401}));
 await assert.rejects(forbidden.cases(session),/sign out and sign in/);
});
