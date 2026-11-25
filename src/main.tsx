import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {FileText, Mail, GraduationCap, UploadCloud, Sparkles, ArrowRight, Check, Copy, Download, Code2, GitCompare, Lightbulb, Menu, X, PawPrint, ShieldCheck} from 'lucide-react';
import './styles.css';

const tools = [
  {name:'Resume builder', short:'Resume', icon:FileText, desc:'Tailor your experience to the role.', color:'lilac'},
  {name:'Cover letter', short:'Cover letter', icon:Mail, desc:'Tell your story with confidence.', color:'peach'},
  {name:'Recommendation request', short:'Recommendation', icon:GraduationCap, desc:'Ask a mentor for a strong reference.', color:'mint'}
] as const;
const demoText = [
  'TAILORED RESUME — SAMPLE\n\nYour Name\nSoftware Engineering Intern\n\nEDUCATION\nYour university | Computer Science\n\nEXPERIENCE\nYour existing experience will appear here after AI integration.\n\nPROJECTS\nYour relevant projects will appear here.',
  'Dear Hiring Team,\n\nI am excited to apply for the position at your organization.\n\nThis is a placeholder for a personalized letter based on your real qualifications.\n\nBest regards,\nYour Name',
  'Subject: Request for a letter of recommendation\n\nDear Professor,\n\nI hope you are doing well. I am applying for an opportunity and would appreciate your consideration in writing a recommendation.\n\nThank you for your time.\nYour Name'
];
function Cat({busy=false}:{busy?:boolean}) {
  return <svg className={'cat '+(busy?'busy':'')} viewBox="0 0 240 160" role="img" aria-label="A friendly orange cat working at a laptop">
    <defs><linearGradient id="fur" x2="0.8" y2="1"><stop stopColor="#ffd8a1"/><stop offset="1" stopColor="#f2a45d"/></linearGradient><linearGradient id="screen" x2="1" y2="1"><stop stopColor="#9c91ef"/><stop offset="1" stopColor="#6255ca"/></linearGradient></defs>
    <ellipse cx="122" cy="144" rx="91" ry="8" fill="#dfd9f4"/>
    <path d="M158 126 Q207 121 196 90 Q190 78 182 91" fill="none" stroke="#edac72" strokeWidth="12" strokeLinecap="round"/>
    <ellipse cx="116" cy="111" rx="51" ry="31" fill="url(#fur)"/>
    <g className="cat-head"><path d="M67 59 L62 19 Q62 13 70 17 L98 35 Q116 29 135 35 L162 17 Q169 14 169 22 L166 61 Q178 81 164 99 Q148 117 116 116 Q81 116 67 97 Q56 80 67 59Z" fill="url(#fur)" stroke="#e9a364" strokeWidth="2"/>
    <path d="M71 29 L76 52 L94 39Z M159 29 L154 52 L137 39Z" fill="#e99191"/>
    <path d="M108 38 L112 52 M122 38 L119 51" stroke="#dc8c51" strokeWidth="4" strokeLinecap="round"/>
    <ellipse cx="92" cy="73" rx="5" ry="7" fill="#352e43" className="eye"/><ellipse cx="141" cy="73" rx="5" ry="7" fill="#352e43" className="eye"/>
    <ellipse cx="116" cy="89" rx="25" ry="18" fill="#fff1dc"/><path d="M111 84 Q116 80 121 84 L116 89Z" fill="#be777f"/><path d="M116 89 Q110 96 105 91 M116 89 Q122 96 127 91" stroke="#76545a" fill="none" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M76 85 L54 81 M76 91 L55 94 M156 85 L178 81 M156 91 L177 94" stroke="#ad805b" strokeWidth="1.5" strokeLinecap="round"/></g>
    <ellipse className="paw left-paw" cx="76" cy="125" rx="17" ry="9" fill="#ffcf99"/><ellipse className="paw right-paw" cx="154" cy="125" rx="17" ry="9" fill="#ffcf99"/>
    <path d="M91 100 H172 Q177 100 176 106 L169 139 H85 L87 105 Q87 100 91 100Z" fill="url(#screen)"/><path d="M79 139 H176 Q182 139 181 143 H78Z" fill="#574ab8"/>
    <path d="M128 123 q-8 -8 -12 0 q0 8 12 8 q12 0 12 -8 q-4 -8 -12 0Z" fill="#e4dfff"/><circle cx="122" cy="117" r="3" fill="#e4dfff"/><circle cx="134" cy="117" r="3" fill="#e4dfff"/>
  </svg>
}
function App(){
  const [selected,setSelected]=useState<number[]>([0]);
  const [active,setActive]=useState(0);
  const [page,setPage]=useState<'workspace'|'review'>('workspace');
  const [resume,setResume]=useState('');
  const [job,setJob]=useState('');
  const [company,setCompany]=useState('');
  const [role,setRole]=useState('');
  const [mentor,setMentor]=useState('');
  const [notes,setNotes]=useState('');
  const [file,setFile]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [generated,setGenerated]=useState<number[]>([]);
  const [tab,setTab]=useState('Preview');
  const [mobile,setMobile]=useState(false);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [copied,setCopied]=useState(false);
  const toggle=(i:number)=>{setSelected(old=>old.includes(i)?old.filter(x=>x!==i):[...old,i]);setError('')};
  const generate=()=>{if(!selected.length){setError('Choose at least one document.');return}if(!resume.trim()&&!file){setError('Add a resume or select a file first.');return}if(!job.trim()){setError('Paste a job description first.');return}setError('');setBusy(true);setNotice('');setTimeout(()=>{setGenerated([...selected]);setActive(selected[0]);setTab('Preview');setPage('review');setBusy(false)},1100)};
  const latex=String.raw`\documentclass[11pt]{article}
\usepackage[margin=0.75in]{geometry}
\begin{document}
\section*{Your Name}
\section*{Education}
Your verified education goes here.
\section*{Experience}
Your verified experience goes here.
\end{document}`;
  const content=tab==='LaTeX'?latex:demoText[active];
  const copy=async()=>{try{await navigator.clipboard.writeText(content);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{setNotice('Clipboard unavailable. Select and copy the sample text manually.')}};
  const download=()=>{const ext=tab==='LaTeX'?'tex':'txt';const url=URL.createObjectURL(new Blob([content],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='resumeow-sample.'+ext;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  function navigate(p:'workspace'|'review'){setPage(p);setMobile(false);setNotice('')}
  return <div className="shell">
    <aside className={'sidebar '+(mobile?'open':'')}>
      <div className="brand"><span className="brandmark"><PawPrint size={22}/></span><div>Resu<span>Meow</span><small>YOUR CAREER COMPANION</small></div></div>
      <div className="side-label">WORKSPACE</div>
      <button className={'nav '+(page==='workspace'?'current':'')} onClick={()=>navigate('workspace')}><FileText size={18}/> Create documents</button>
      <button className={'nav '+(page==='review'?'current':'')} onClick={()=>navigate('review')}><GitCompare size={18}/> Review & export</button>
      <div className="side-label">YOUR TOOLKIT</div>
      {tools.map((t,i)=><button key={t.name} className="nav" onClick={()=>{setSelected([i]);navigate('workspace')}}><t.icon size={18}/>{t.name}</button>)}
      <div className="sidebottom"><ShieldCheck size={18}/><div><b>Your data stays here</b><small>UI preview · No AI requests</small></div></div>
    </aside>
    <main><header><button className="mobile-menu" aria-label="Toggle navigation" onClick={()=>setMobile(!mobile)}>{mobile?<X/>:<Menu/>}</button><div className="crumb">Workspace <span>/</span> {page==='workspace'?'Create documents':'Review & export'}</div><span className="demo">Frontend preview</span></header>
      <div className="main-content">
      {page==='workspace'?<>
        <section className="hero"><div><div className="eyebrow"><Sparkles size={15}/> YOUR AI CAREER COMPANION</div><h1>Make your next move.</h1><p>Less rewriting, more applying. Create an application package that feels like you.</p><span className="hero-note"><span/> {busy?'Meow is preparing a sample…':'Meow is ready to help.'}</span></div><Cat busy={busy}/></section>
        <section className="section"><div className="section-head"><div><h2>What are we making today?</h2><p>Choose one or more documents for your application.</p></div><span className="count">{selected.length} selected</span></div><div className="tool-grid">{tools.map((t,i)=><button key={t.name} aria-pressed={selected.includes(i)} className={'tool '+(selected.includes(i)?'chosen':'')} onClick={()=>toggle(i)}><span className={'tool-icon '+t.color}><t.icon size={23}/></span><span className="tick">{selected.includes(i)&&<Check size={14}/>}</span><b>{t.name}</b><small>{t.desc}</small></button>)}</div></section>
        <div className="form-grid"><section className="panel"><div className="panel-title"><span>01</span><div><h2>Your master resume</h2><p>Start with your real experience.</p></div></div><label className="upload" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&/\.(pdf|tex|txt|md)$/i.test(f.name)){setFile(f);setError('')}else setError('Choose a PDF, TEX, TXT, or MD file.')}}><UploadCloud size={25}/><b>{file?file.name:'Click to upload or drop a file'}</b><small>PDF, LaTeX or text · File selection only in this demo</small><input type="file" accept=".pdf,.tex,.txt,.md" onChange={e=>{setFile(e.target.files?.[0]||null);setError('')}}/></label>{file&&<button className="text-button" onClick={()=>setFile(null)}>Remove file</button>}<label className="field">Or paste your resume<textarea value={resume} onChange={e=>setResume(e.target.value)} placeholder="Paste your resume or LaTeX source here…" rows={5}/></label></section>
        <section className="panel"><div className="panel-title"><span>02</span><div><h2>Target opportunity</h2><p>Tell Meow what you're applying for.</p></div></div><div className="two"><label className="field">Company<input value={company} onChange={e=>setCompany(e.target.value)} placeholder="e.g. Company name"/></label><label className="field">Position<input value={role} onChange={e=>setRole(e.target.value)} placeholder="e.g. Software intern"/></label></div><label className="field">Job description<textarea value={job} onChange={e=>setJob(e.target.value)} placeholder="Paste the full job description…" rows={6}/></label>{selected.includes(2)&&<label className="field">Recommender (optional)<input value={mentor} onChange={e=>setMentor(e.target.value)} placeholder="Professor or supervisor"/></label>}</section></div>
        <section className="panel extra"><label className="field">Additional instructions <span className="optional">Optional</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Keep it to one page, emphasize projects, use a formal tone…"/></label></section>
        {error&&<p role="alert" className="error">{error}</p>}<div className="actionbar"><span><ShieldCheck size={17}/> Real qualifications only · Demo uses sample outputs</span><button className="primary" onClick={generate} disabled={busy}><Sparkles size={18}/>{busy?'Preparing sample…':'Preview application package'}<ArrowRight size={17}/></button></div>
      </>:<><section className="hero compact"><div><div className="eyebrow">REVIEW & EXPORT</div><h1>Your application package.</h1><p>Review the layout, changes and suggestions before you export.</p></div><Cat/></section>
        {!generated.length?<section className="panel empty"><FileText size={35}/><h2>No sample documents yet</h2><p>Choose your documents in the workspace to preview the review experience.</p><button className="primary" onClick={()=>navigate('workspace')}>Back to workspace <ArrowRight size={16}/></button></section>:<>
        <div className="review-tools">{generated.map(i=><button key={i} className={active===i?'on':''} onClick={()=>{setActive(i);setTab('Preview')}}>{tools[i].short}</button>)}</div>
        <div className="review-grid"><section className="panel output"><div className="section-head"><div><h2>{tools[active].name}</h2><p>Sample output · Not generated from your data</p></div></div><div className="tabs">{(active===0?['Preview','LaTeX']:['Preview']).map(t=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t==='LaTeX'&&<Code2 size={15}/>} {t}</button>)}</div><pre>{content}</pre><div className="output-actions"><button className="secondary" onClick={copy}><Copy size={16}/>{copied?'Copied':'Copy sample'}</button><button className="primary" onClick={download}><Download size={16}/>Download sample</button></div></section><div className="review-side"><section className="panel"><div className="panel-title"><span><GitCompare size={18}/></span><div><h2>What changed</h2><p>Change report</p></div></div><p className="muted">Actual before-and-after changes will appear when AI is connected. No changes have been made to your resume.</p></section><section className="panel"><div className="panel-title"><span><Lightbulb size={18}/></span><div><h2>Recommendations</h2><p>Suggestions for your review</p></div></div><p className="muted">Skill gaps, missing keywords and suggested improvements will appear here. No match score is calculated in this preview.</p></section></div></div></>}
        <button className="text-button" onClick={()=>navigate('workspace')}>← Back to workspace</button>{notice&&<p role="status">{notice}</p>}
      </>}
      <footer>Made for your next opportunity. <PawPrint size={14}/> ResuMeow</footer></div>
    </main></div>
}
createRoot(document.getElementById('root')!).render(<App/>);
document.title='ResuMeow — Your career companion';
