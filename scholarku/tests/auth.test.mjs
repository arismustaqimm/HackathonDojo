import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../supabase.js',import.meta.url),'utf8');
function adapter(){
 const values=new Map(),requests=[];
 const context={window:{SCHOLARKU_CONFIG:{SUPABASE_URL:'https://auth.example.test',SUPABASE_ANON_KEY:'public-test-key'}},localStorage:{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},location:{origin:'http://localhost:5173'},URLSearchParams,FormData,URL,Date,JSON,
 fetch:async(url,options)=>{requests.push({url,options});return{ok:true,status:200,text:async()=>JSON.stringify({access_token:'test-token',user:{id:'test-user'}})}}};
 vm.runInNewContext(source,context);
 return{api:context.window.API,values,requests};
}
test('Google callback exchanges only an existing, recent request and consumes its verifier',async()=>{
 const {api,values,requests}=adapter();values.set('scholarku.oauth.nonce',JSON.stringify({created:Date.now(),verifier:'test-verifier'}));
 await api.completeGoogleSignIn(new URL('http://localhost:5173/auth-callback.html?state=nonce&code=code-from-provider'));
 assert.equal(requests.length,1);assert.equal(requests[0].url,'https://auth.example.test/auth/v1/token?grant_type=pkce');assert.deepEqual(JSON.parse(requests[0].options.body),{auth_code:'code-from-provider',code_verifier:'test-verifier'});assert(values.has('scholarku.auth'));assert(!values.has('scholarku.oauth.nonce'));
 await assert.rejects(api.completeGoogleSignIn(new URL('http://localhost:5173/auth-callback.html?state=nonce&code=code-from-provider')));assert.equal(requests.length,1);
});
test('wrong origins, expired attempts, unknown state and provider errors cannot create a session',async()=>{
 for(const [url,created] of [
  ['https://other.example.test/auth-callback.html?state=nonce&code=code',Date.now()],
  ['http://localhost:5173/auth-callback.html?state=nonce&code=code',Date.now()-360000],
  ['http://localhost:5173/auth-callback.html?state=unknown&code=code',Date.now()],
  ['http://localhost:5173/auth-callback.html?state=nonce&error=access_denied',Date.now()]
 ]){const {api,values,requests}=adapter();values.set('scholarku.oauth.nonce',JSON.stringify({created,verifier:'test-verifier'}));await assert.rejects(api.completeGoogleSignIn(new URL(url)));assert.equal(requests.length,0);assert(!values.has('scholarku.auth'))}
});
test('provider error description is preserved for diagnosis without a token exchange',async()=>{
 const {api,values,requests}=adapter();values.set('scholarku.oauth.nonce',JSON.stringify({created:Date.now(),verifier:'test-verifier'}));
 await assert.rejects(api.completeGoogleSignIn(new URL('http://localhost:5173/auth-callback.html?state=nonce&error=access_denied&error_description=Google+provider+is+not+enabled')),/Google provider is not enabled/);
 assert.equal(requests.length,0);assert(!values.has('scholarku.auth'));
});
