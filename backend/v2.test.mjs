import test from 'node:test';
import assert from 'node:assert/strict';
import {latexToText} from './extract.mjs';
import {geminiConfig,publicConfig,buildRequest,readResponse,generateWith,testConnection} from './providers.mjs';
import {createMasterStore} from './master-store.mjs';
test('local LaTeX reads visible text and warns for unsupported commands',()=>{const r=latexToText(String.raw`\begin{document}\section*{Education}
\textbf{Degree} 95\% \& Python
\input{private}
\end{document}`);assert.match(r.text,/Degree 95% & Python/);assert.ok(r.warnings.length)});
test('Gemini credentials never enter public configuration or URL',()=>{const p=geminiConfig({GEMINI_API_KEY:'secret'});assert.ok(!JSON.stringify(publicConfig(p)).includes('secret'));const req=buildRequest(p,'s','i');assert.ok(!req.url.includes('secret'));assert.equal(req.headers['x-goog-api-key'],'secret');assert.equal(req.body.generationConfig.responseMimeType,'application/json');assert.ok(req.body.generationConfig.responseJsonSchema.required.includes('requirements'))});
test('Gemini rejects incomplete output and ignores thought text',()=>{assert.equal(readResponse({candidates:[{finishReason:'STOP',content:{parts:[{thought:true,text:'ignore'},{text:'{}'}]}}]}),'{}');assert.throws(()=>readResponse({candidates:[{finishReason:'MAX_TOKENS',content:{parts:[{text:'{}'}]}}]}))});
test('connection check uses a synthetic request with no resume',async()=>{const p=geminiConfig({GEMINI_API_KEY:'secret'});const out=await testConnection(p,async(url,opts)=>{assert.ok(url.endsWith(':generateContent'));assert.match(opts.body,/Connection test; no personal data/);assert.ok(!opts.body.includes('resumeText'));return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:'{"ok":true}'}]}}]})}});assert.equal(out.ok,true)});
test('missing key fails before network request',async()=>{let called=false;try{await generateWith(geminiConfig({}),'s','i',async()=>{called=true;throw Error('network')});throw Error('unexpected success')}catch(e){assert.equal(e.status,503)}assert.equal(called,false)});
test('SQLite master storage can save, replace and delete',()=>{const db=createMasterStore(':memory:');try{assert.equal(db.get(),null);db.set('First');db.set('Second');assert.equal(db.get().text,'Second');db.clear();assert.equal(db.get(),null)}finally{db.close()}});
