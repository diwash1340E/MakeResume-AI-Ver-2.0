import test from 'node:test';
import assert from 'node:assert/strict';
import {latexToText} from './extract.mjs';
import {providerConfigs,publicProviders,buildRequest,readResponse,generateWith} from './providers.mjs';
import {createMasterStore} from './master-store.mjs';
test('local LaTeX reads visible text and warns for unsupported commands',()=>{const r=latexToText(String.raw`\begin{document}\section*{Education}
\textbf{Degree} 95\% \& Python
\input{private}
\end{document}`);assert.match(r.text,/Degree 95% & Python/);assert.ok(r.warnings.length)});
test('provider config omits credentials from health and uses fixed endpoints',()=>{const p=providerConfigs({GEMINI_API_KEY:'secret',OPENAI_API_KEY:'secret',OPENAI_MODEL:'model',ANTHROPIC_API_KEY:'secret',ANTHROPIC_MODEL:'model'});assert.ok(!JSON.stringify(publicProviders(p)).includes('secret'));assert.equal(buildRequest(p.ollama,'s','i').url,'http://127.0.0.1:11434/api/chat');assert.equal(buildRequest(p.openai,'s','i').headers.Authorization,'Bearer secret');assert.equal(buildRequest(p.anthropic,'s','i').headers['x-api-key'],'secret')});
test('provider adapters parse complete responses and reject truncated responses',()=>{assert.equal(readResponse('gemini',{candidates:[{finishReason:'STOP',content:{parts:[{text:'{}'}]}}]}),'{}');assert.equal(readResponse('openai',{choices:[{finish_reason:'stop',message:{content:'{}'}}]}),'{}');assert.equal(readResponse('anthropic',{stop_reason:'end_turn',content:[{type:'text',text:'{}'}]}),'{}');assert.equal(readResponse('ollama',{done:true,message:{content:'{}'}}),'{}');assert.throws(()=>readResponse('ollama',{done:true,done_reason:'length',message:{content:'{}'}}))});
test('provider transport can be mocked without live key',async()=>{const p=providerConfigs({}).ollama;const result=await generateWith(p,'JSON only','sample',async(url,options)=>{assert.equal(url,'http://127.0.0.1:11434/api/chat');assert.equal(JSON.parse(options.body).stream,false);return {ok:true,json:async()=>({done:true,message:{content:'{}'}})}});assert.equal(result,'{}')});
test('SQLite master storage can save, replace and delete',()=>{const db=createMasterStore(':memory:');try{assert.equal(db.get(),null);db.set('First');db.set('Second');assert.equal(db.get().text,'Second');db.clear();assert.equal(db.get(),null)}finally{db.close()}});
