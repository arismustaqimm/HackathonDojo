import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const dataScript=await readFile(new URL('../career-data.js',import.meta.url),'utf8');
const context={window:{}};vm.runInNewContext(dataScript,context);
const data=context.window.SCHOLARKU_CAREERS;
test('both directories preserve unique employers and contain four ten-entry pages',()=>{for(const rows of Object.values(data)){assert.equal(rows.length,40);assert.equal(new Set(rows.map(x=>x.org)).size,rows.length);for(let i=0;i<4;i++)assert.equal(rows.slice(i*10,i*10+10).length,10)}});
test('every external destination is a direct HTTPS provider URL',()=>{for(const row of Object.values(data).flat()){const url=new URL(row.url);assert.equal(url.protocol,'https:');assert(!url.hostname.includes('google.com'));assert(!url.username&&!url.password);assert.equal(row.opening,null);assert.equal(row.closing,null)}});
test('original internship providers and supplied specialist employers are retained',()=>{const names=data.internships.map(x=>x.org);for(const n of ['Maybank','Cisco','Bank Negara Malaysia','AIA Malaysia','CIMB','Jane Street','JPMorgan Chase','BAT'])assert(names.includes(n));assert.equal(data.graduates.filter(x=>x.org==='ExxonMobil').length,1)});
const localeScript=await readFile(new URL('../localization.js',import.meta.url),'utf8');
const locale={window:{},localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:()=>null}};vm.runInNewContext(localeScript,locale);
const i18n=locale.window.ScholarkuI18n;

test('switching locale translates static and interpolated UI while preserving English and names',()=>{assert.equal(i18n.text('Graduate programmes'),'Graduate programmes');i18n.toggle();assert.equal(i18n.text('Graduate programmes'),'Program graduan');assert.equal(i18n.text('Section 2 of 3'),'Bahagian 2 daripada 3');assert.equal(i18n.text('Alya Rahman'),'Alya Rahman');assert.equal(i18n.text('1.2k demo members'),'1.2k ahli demo');i18n.toggle();assert.equal(i18n.text('Section 2 of 3'),'Section 2 of 3')});
