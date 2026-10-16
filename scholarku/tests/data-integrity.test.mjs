import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const context={window:{}};
for(const name of ['career-data.js','career-guidance.js','funding-data.js','mentor-data.js'])vm.runInNewContext(await readFile(new URL('../'+name,import.meta.url),'utf8'),context);
test('20 distinct public profiles have traceable sources and no invented participation',()=>{
 const people=context.window.SCHOLARKU_MENTORS;
 assert.equal(people.length,20);assert.equal(new Set(people.map(p=>p.id)).size,20);
 for(const p of people){assert.equal(new URL(p.source_url).hostname,'github.com');assert.equal(p.profile_status,'public_reference');assert.equal(p.linked_user_id,null);assert(p.role_title&&p.role_ms&&p.bio&&p.bio_ms);assert(p.source_note.includes('unconfirmed'));assert(!('email' in p));assert(!('rating' in p))}
 for(const field of ['Finance','Cybersecurity','Data & AI','Engineering leadership'])assert(people.some(p=>p.discipline===field));
});
test('funding details distinguish user-supplied information from verified dates and avoid the broken Doha URL',()=>{
 const rows=context.window.SCHOLARKU_FUNDING;assert.equal(rows.length,4);assert.equal(context.window.SCHOLARKU_PROVIDER_SCHOLARSHIPS.length,7);
 for(const row of rows){assert.equal(row.sourceStatus,'user_supplied_unverified');assert.equal(new URL(row.url).protocol,'https:');assert(!row.url.includes('PageNotFoundError'));for(const key of ['summary','benefits','opening','closing','destination','bond','level','qualifications','fields','eligibility','tips']){assert.equal(row[key].length,2);assert(row[key].every(x=>typeof x==='string'&&x.length>10))}assert(row.steps.length>=3)}
 assert.match(rows.find(x=>x.id==='flysiswa').kind[0],/Travel aid/);
 assert.match(rows.find(x=>x.id==='doha-graduate').closing[0],/not yet independently confirmed/);
});
test('all 80 career portals have domain-specific preparation and role guidance',()=>{
 const {sectors,sectorFor}=context.window.SCHOLARKU_CAREER_GUIDANCE;
 for(const row of Object.values(context.window.SCHOLARKU_CAREERS).flat()){const guidance=sectors[sectorFor(row.org)];assert(guidance.roles[0].length>50);assert(guidance.prepare[0].length>80);assert(guidance.roles[1]&&guidance.prepare[1])}
});
