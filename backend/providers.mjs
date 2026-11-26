// Gemini-only server adapter. Never import this file into frontend code.
export function geminiConfig(env=process.env){
 return {id:'gemini',label:'Google Gemini',cloud:true,model:(env.GEMINI_MODEL||'gemini-3.8-flash').trim(),key:(env.GEMINI_API_KEY||'').trim()};
}
export const isConfigured=p=>!!p?.model&&!!p?.key&&!/^(your_key_here|MY_GEMINI_API_KEY|replace_me)$/i.test(p.key);
export function publicConfig(p){return {id:p.id,label:p.label,cloud:true,model:p.model,configured:isConfigured(p)};}
export class ProviderError extends Error{constructor(status,message){super(message);this.status=status;}}
const string={type:'string'};
const evidence={type:'array',items:{type:'object',properties:{label:string,evidence:string},required:['label','evidence']}};
export const PACKAGE_SCHEMA={type:'object',properties:{
 edits:{type:'array',items:{type:'object',properties:{before:string,after:string,reason:string},required:['before','after','reason']}},
 coverLetter:string,recommendation:string,recommendations:{type:'array',items:string},
 requirements:{type:'object',properties:{keywords:evidence,skills:evidence,experience:evidence},required:['keywords','skills','experience']}
},required:['edits','coverLetter','recommendation','recommendations','requirements']};
export function buildRequest(p,system,input,schema=PACKAGE_SCHEMA){
 if(!/^[a-zA-Z0-9._-]+$/.test(p.model))throw new ProviderError(400,'Invalid GEMINI_MODEL. Use a model ID from Google AI Studio.');
 return {url:'https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(p.model)+':generateContent',
 headers:{'Content-Type':'application/json','x-goog-api-key':p.key},
 body:{systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:input}]}],generationConfig:{temperature:0.2,maxOutputTokens:16384,responseMimeType:'application/json',responseJsonSchema:schema}}};
}
export function readResponse(data){
 const c=data.candidates?.[0],text=c?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('')||'';
 if(c?.finishReason!=='STOP'||!text.trim())throw new ProviderError(502,'Gemini response incomplete or blocked. Try shorter input or check model settings.');
 return text.trim().replace(/^\x60{3}(?:json)?\s*/i,'').replace(/\s*\x60{3}$/,'').trim();
}
export async function generateWith(p,system,input,fetcher=fetch,schema=PACKAGE_SCHEMA){
 if(!isConfigured(p))throw new ProviderError(503,'Add GEMINI_API_KEY to your private .env.local and restart ResuMeow.');
 const req=buildRequest(p,system,input,schema);let response;
 try{response=await fetcher(req.url,{method:'POST',headers:req.headers,body:JSON.stringify(req.body),signal:AbortSignal.timeout(90000),redirect:'error'});}
 catch{throw new ProviderError(502,'Could not reach Gemini, or the request timed out.');}
 if(!response.ok){
 if(response.status===429)throw new ProviderError(429,'Gemini quota or rate limit reached. Check AI Studio usage and billing.');
 if([401,403].includes(response.status))throw new ProviderError(502,'Gemini rejected credentials or access. Check the API key and project.');
 if(response.status===404)throw new ProviderError(502,'Gemini model unavailable. Set GEMINI_MODEL to a model available to your project.');
 if(response.status===400)throw new ProviderError(502,'Gemini rejected the request. Check the API key, model availability and structured-output compatibility.');
 throw new ProviderError(502,'Gemini could not complete the request. Try again.');}
 let data;try{data=await response.json()}catch{throw new ProviderError(502,'Gemini returned an invalid response.');}
 return readResponse(data);
}
export async function testConnection(p,fetcher=fetch){
 const schema={type:'object',properties:{ok:{type:'boolean'}},required:['ok']};
 const output=await generateWith(p,'Return a JSON object with ok set to true.','Connection test; no personal data.',fetcher,schema);
 let data;try{data=JSON.parse(output)}catch{throw new ProviderError(502,'Gemini returned invalid test JSON.');}
 if(data.ok!==true)throw new ProviderError(502,'Gemini returned an unexpected test response.');
 return {ok:true,model:p.model};
}
