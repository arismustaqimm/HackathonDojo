import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,readdir,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('static export is repeatable, contains all referenced assets and preserves the local public configuration',async()=>{
 const script=fileURLToPath(new URL('../scripts/export.mjs',import.meta.url));
 execFileSync(process.execPath,[script],{cwd:root});execFileSync(process.execPath,[script],{cwd:root});
 const files=await readdir(root+'/dist');for(const forbidden of ['database','tests','node_modules','server.mjs'])assert(!files.includes(forbidden));
 for(const html of ['index.html','auth-callback.html']){const text=await readFile(root+'/dist/'+html,'utf8');for(const match of text.matchAll(/(?:src|href)="([^"#]+)"/g)){if(match[1].startsWith('http'))continue;assert((await stat(root+'/dist/'+match[1])).isFile())}}
 assert((await readFile(root+'/config.js')).equals(await readFile(root+'/dist/config.js')));
});
