import test from 'node:test';
import assert from 'node:assert/strict';
import { createCareClient } from '../src/care/client.ts';
const config = { url: 'https://test.invalid', key: 'sb_publishable_test', partner: 'partner' };
test('submission authenticates with user token and preserves retry key and consent', async () => {
  const calls = [];
  const client = createCareClient(config, async (url, options) => {
    calls.push({ url, options });
    return { ok: true, json: async () => 'case-id' };
  });
  const session = { access_token: 'user-token', user: { id: 'patient' } };
  for (let i=0;i<2;i++) assert.equal(await client.submit(session,'same-key',{concern:'Fictional'}),'case-id');
  assert.deepEqual(calls[0],calls[1]);
  assert.equal(calls[0].options.headers.Authorization,'Bearer user-token');
  assert.equal(calls[0].options.headers.apikey,config.key);
  const payload = JSON.parse(calls[0].options.body);
  assert.equal(payload.retry_key,'same-key');
  assert.equal(payload.consent_version,'local-care-review-v1');
  assert.equal(payload.patient_id,undefined);
});
test('failed and unconfirmed submissions do not return a success', async () => {
  const session={access_token:'token',user:{id:'patient'}};
  for(const response of [{ok:false,status:401},{ok:false,status:500},{ok:true,json:async()=>null}]) {
    const client=createCareClient(config,async()=>response);
    await assert.rejects(client.submit(session,'key',{concern:'Fictional'}));
  }
});
test('sign-in rejects a malformed session and case reads reject malformed data', async () => {
  const client=createCareClient(config,async()=>({ok:true,json:async()=>({})}));
  await assert.rejects(client.signIn('test@example.invalid','test'));
  await assert.rejects(client.cases({access_token:'token',user:{id:'patient'}}));
});
