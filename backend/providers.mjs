export function providerConfigs(env=process.env){return {
 gemini:{id:'gemini',label:'Google Gemini',cloud:true,model:env.GEMINI_MODEL||'gemini-3.8-flash',key:env.GEMINI_API_KEY},
 openai:{id:'openai',label:'OpenAI',cloud:true,model:env.OPENAI_MODEL||'',key:env.OPENAI_API_KEY},
 anthropic:{id:'anthropic',label:'Anthropic Claude',cloud:true,model:env.ANTHROPIC_MODEL||'',key:env.ANTHROPIC_API_KEY},
 ollama:{id:'ollama',label:'Ollama (local)',cloud:false,model:env.OLLAMA_MODEL||'qwen2.5:7b'}
};}
export const isConfigured=p=>!!p?.model&&(!p.cloud||(typeof p.key==='string'&&!!p.key.trim()&&!/^(your_key_here|MY_GEMINI_API_KEY|replace_me)$/i.test(p.key.trim())));
export function publicProviders(configs){return Object.values(configs).map(({id,label,cloud,model,key})=>({id,label,cloud,model,configured:isConfigured({cloud,model,key})}));}
export class ProviderError extends Error{constructor(status,message){super(message);this.status=status;}}
export function buildRequest(p,system,input){
 const headers={'Content-Type':'application/json'};let url,body;
 if(p.id==='gemini'){if(!/^[a-zA-Z0-9._-]+$/.test(p.model))throw new ProviderError(400,'Invalid Gemini model ID.');
 url='https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(p.model)+':generateContent';headers['x-goog-api-key']=p.key;
 body={systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:input}]}],generationConfig:{temperature:0.2,maxOutputTokens:16384,responseMimeType:'application/json'}};
 }else if(p.id==='openai'){url='https://api.openai.com/v1/chat/completions';headers.Authorization='Bearer '+p.key;body={model:p.model,messages:[{role:'system',content:system},{role:'user',content:input}],response_format:{type:'json_object'},max_completion_tokens:16384};
 }else if(p.id==='anthropic'){url='https://api.anthropic.com/v1/messages';headers['x-api-key']=p.key;headers['anthropic-version']='2023-06-01';body={model:p.model,system,messages:[{role:'user',content:input}],max_tokens:8192,temperature:0.2};
 }else if(p.id==='ollama'){url='http://127.0.0.1:11434/api/chat';body={model:p.model,messages:[{role:'system',content:system},{role:'user',content:input}],format:'json',stream:false,options:{temperature:0.2,num_predict:8192}};
 }else throw new ProviderError(400,'Unknown AI provider.');return {url,headers,body};
}
export function readResponse(id,data){let text='',complete=false;
 if(id==='gemini'){const c=data.candidates?.[0];complete=c?.finishReason==='STOP';text=c?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('')||'';}
 else if(id==='openai'){const c=data.choices?.[0];complete=c?.finish_reason==='stop';text=c?.message?.content||'';}
 else if(id==='anthropic'){complete=data.stop_reason==='end_turn'||data.stop_reason==='stop_sequence';text=(data.content||[]).filter(p=>p.type==='text').map(p=>p.text).join('');}
 else if(id==='ollama'){complete=data.done===true&&data.done_reason!=='length';text=data.message?.content||'';}
 if(!complete||typeof text!=='string'||!text.trim())throw new ProviderError(502,'AI response incomplete or empty. Try a shorter input.');
 return text.trim().replace(/^\x60{3}(?:json)?\s*/i,'').replace(/\s*\x60{3}$/,'').trim();
}
export async function generateWith(p,system,input,fetcher=fetch){
 if(!isConfigured(p))throw new ProviderError(503,'Configure the selected provider key and model in .env.local, then restart ResuMeow.');
 const req=buildRequest(p,system,input);let response;
 try{response=await fetcher(req.url,{method:'POST',headers:req.headers,body:JSON.stringify(req.body),signal:AbortSignal.timeout(90000),redirect:'error'});}
 catch{throw new ProviderError(502,p.id==='ollama'?'Cannot reach Ollama. Start Ollama and check the installed model.':'Could not reach the selected AI provider, or request timed out.');}
 if(!response.ok){if(response.status===429)throw new ProviderError(429,'AI provider quota or rate limit reached.');if([401,403].includes(response.status))throw new ProviderError(502,'AI provider rejected credentials. Check .env.local.');if(response.status===404)throw new ProviderError(502,'Model unavailable. Check the provider model in .env.local.');throw new ProviderError(502,'AI provider could not complete the request. Check model compatibility.');}
 let data;try{data=await response.json()}catch{throw new ProviderError(502,'Provider returned invalid JSON.');}return readResponse(p.id,data);
}
