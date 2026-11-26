import { makeLatex } from '../backend/core.mjs';
export async function requestApi(route,body){
 let response;try{response=await fetch('/api/'+route,{method:body===undefined?'GET':'POST',headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(110000)})}catch{throw Error('Cannot reach the local server or request timed out. Restart npm run dev and retry.')}
 let data;try{data=await response.json()}catch{throw Error('Invalid server response. Open ResuMeow through npm run dev.')}if(!response.ok)throw Error(data.error||'Request failed.');return data;
}
export function fileToBase64(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]);r.onerror=()=>reject(Error('Cannot read file.'));r.readAsDataURL(file)})}
export function mapPackage(data,original,selected){
 if(!data?.documents||!data.match?.breakdown||!Array.isArray(data.changes)||!Array.isArray(data.recommendations)||!Array.isArray(data.match.items))throw Error('Incomplete server response.');
 for(const k of selected)if(typeof data.documents[k]?.text!=='string')throw Error('Selected document missing.');
 const changes=[];let cursor=0,modified='';
 for(const c of data.changes){if(!c.before||typeof c.after!=='string'||typeof c.id!=='string')throw Error('Invalid change.');
 const at=original.indexOf(c.before,cursor);if(at<0)throw Error('Could not align change to original resume.');
 modified+=original.slice(cursor,at);if(modified.length!==c.start||c.end!==c.start+c.after.length)throw Error('Invalid change offsets.');
 modified+=c.after;changes.push({...c,originalStart:at,originalEnd:at+c.before.length,original:c.before,modified:c.after,markId:c.id,section:'Resume edit',rationale:c.reason});cursor=at+c.before.length;}
 modified+=original.slice(cursor);if(data.documents.resume&&(modified!==data.documents.resume.text||typeof data.documents.resume.latex!=='string'))throw Error('Edited resume does not match change report.');
 return {...data,original,changes};
}
export function reviewResume(pkg,revertedIds){
 if(!pkg?.documents?.resume)return {text:'',latex:'',segments:[]};
 const segments=[];let cursor=0;
 for(const c of pkg.changes){if(c.originalStart>cursor)segments.push({text:pkg.original.slice(cursor,c.originalStart)});segments.push(revertedIds.includes(c.id)?{text:c.before}:{text:c.after,markId:c.id});cursor=c.originalEnd}
 segments.push({text:pkg.original.slice(cursor)});const text=segments.map(s=>s.text).join('');
 return {text,segments,latex:text===pkg.documents.resume.text?pkg.documents.resume.latex:makeLatex(text)};
}
export function displayModel(pkg){
 const items=pkg?.match?.items||[],unique=a=>[...new Set(a.map(x=>x.label))];
 return {company:'Target company',position:'Target role',appliedChanges:pkg?.changes||[],suggestions:(pkg?.recommendations||[]).map((title,i)=>({id:'suggestion-'+i,title,detail:'Add only verified facts to your master resume.'})),missingSkills:unique(items.filter(x=>!x.matched)),matchedSkills:unique(items.filter(x=>x.matched))};
}
export function scoreModel(pkg){const m=pkg?.match,b=m?.breakdown||{};return {keywords:b.keywords??null,skills:b.skills??null,experience:b.experience??null,total:m?.score??null,verdict:m?.score==null?'Not enough identified requirements to estimate a match.':'Original resume evidence match. Review missing requirements; this is not an ATS score or hiring probability.'}}
export function splitEmail(text,company,position){const m=(text||'').match(/^Subject:\s*([^\r\n]+)\r?\n\s*/i);return {subject:m?m[1]:'Recommendation request — '+[company,position].filter(Boolean).join(' · '),body:m?text.slice(m[0].length):text||''}}
export function latexReadingView(tex){let t=tex.includes('\\begin{document}')?tex.split('\\begin{document}').slice(1).join('\\begin{document}'):tex;return t.split('\\end{document}')[0].replace(/\\begin\{center\}|\\end\{center\}|\\begin\{itemize\}(?:\[[^\]]*\])?|\\end\{itemize\}/g,'').replace(/\\(?:section|subsection)\*?\{([^{}]*)\}/g,'\n$1\n').replace(/\\(?:textbf|textit|emph)\{([^{}]*)\}/g,'$1').replace(/\\(?:Large|large|noindent|par)\b/g,'').replace(/\\item\b/g,'• ').replace(/\\([%&#_$])/g,'$1').replace(/\\\\/g,'\n').replace(/\\hfill/g,' — ').trim()}
