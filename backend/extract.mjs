// Extraction is local. Never execute LaTeX or PDF JavaScript.
export function latexToText(source) {
 let text=source.replace(/(^|[^\\])%[^\r\n]*/g,'$1'),warnings=[];
 if(text.includes('\\begin{document}'))text=text.slice(text.indexOf('\\begin{document}')+'\\begin{document}'.length);
 text=text.split('\\end{document}')[0];
 const literals=[];text=text.replace(/\\([%&#_$\{\}])/g,(_,c)=>{literals.push(c);return '\uE000'+(literals.length-1)+'\uE001'});
 text=text.replace(/\\(?:begin|end)\{[^{}]*\}(?:\[[^\]]*\])?/g,'\n')
 .replace(/\\(?:section|subsection|subsubsection)\*?\{([^{}]*)\}/g,'\n$1\n')
 .replace(/\\href\{[^{}]*\}\{([^{}]*)\}/g,'$1').replace(/\\(?:url|texttt|textbf|textit|emph|underline)\{([^{}]*)\}/g,'$1')
 .replace(/\\item(?:\[[^\]]*\])?/g,'\n- ').replace(/\\(?:hfill|quad|qquad)\b/g,'  ')
 .replace(/\\(?:par|newline|linebreak)\b|\\\\/g,'\n')
 .replace(/\\(?:noindent|centering|large|Large|small|normalsize|bfseries|itshape)\b/g,'')
 .replace(/\\(?:vspace|hspace|label|pagestyle)\*?\{[^{}]*\}/g,'').replace(/\$\\cdot\$/g,'·');
 if(/\\[A-Za-z@]+/.test(text))warnings.push('Unsupported commands or external references detected. Verify every line or paste the text from a compiled PDF; no commands were executed.');
 text=text.replace(/\\[A-Za-z@]+\*?(?:\[[^\]]*\])?/g,' ').replace(/[{}]/g,' ').replace(/\uE000(\d+)\uE001/g,(_,i)=>literals[Number(i)]??'')
 .split(/\r?\n/).map(l=>l.replace(/[ \t]+/g,' ').trim()).filter(Boolean).join('\n');
 return {text,warnings};
}
export async function pdfToText(bytes){
 const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
 const loading=getDocument({data:new Uint8Array(bytes),isEvalSupported:false,disableFontFace:true,useSystemFonts:false});
 try{const doc=await loading.promise;if(doc.numPages>25)throw Error('PDF exceeds the 25-page resume limit.');
 const pages=[];for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i),content=await page.getTextContent();let out='',lastY=null;
 for(const item of content.items){if(typeof item.str!=='string')continue;const y=item.transform?.[5];if(lastY!==null&&typeof y==='number'&&Math.abs(y-lastY)>3&&out&&!out.endsWith('\n'))out+='\n';if(item.str){if(out&&!/\s$/.test(out)&&!item.str.startsWith(' '))out+=' ';out+=item.str;}if(item.hasEOL)out+='\n';lastY=typeof y==='number'?y:lastY;}pages.push(out.trim());page.cleanup();}
 const text=pages.join('\n\n').trim();if(!text||text.replace(/\s/g,'').length<20)throw Error('No selectable resume text found. Scanned PDFs require OCR; paste the text or export a text-based PDF.');
 return {text,warnings:['Review extraction order and text, particularly for multi-column resumes. Scanned pages may be missing.']};
 }finally{await loading.destroy();}
}
