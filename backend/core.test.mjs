import test from "node:test";
import assert from "node:assert/strict";
import {applyEdits,makeLatex,latexEscape,scoreRequirements,normalizePackage} from "./core.mjs";
test("source-grounded changes preserve unedited text and offsets",()=>{
 const source="Name\nBuilt a tool for 3 users.\nEducation";
 const result=applyEdits(source,[{before:"Built a tool for 3 users.",after:"Developed a tool for 3 users.",reason:"Rephrase"},{before:"Education",after:"Education GPA 4.0"}]);
 assert.equal(result.resume,"Name\nDeveloped a tool for 3 users.\nEducation");
 assert.equal(result.changes.length,1);assert.equal(result.resume.slice(result.changes[0].start,result.changes[0].end),result.changes[0].after);
});
test("ambiguous, overlapping and missing source edits are rejected",()=>{assert.equal(applyEdits("a a",[{before:"a",after:"b"},{before:"x",after:"y"}]).changes.length,0);assert.equal(applyEdits("abcdef",[{before:"abc",after:"xyz"},{before:"cde",after:"uvw"}]).changes.length,1)});
test("LaTeX escapes text and provides complete document",()=>{assert.equal(latexEscape("5% & \\input{x}"),"5\\% \\& \\textbackslash{}input\\{x\\}");assert.match(makeLatex("Name\nSKILLS\nPython & C++"),/\\end\{document\}/)});
test("score only counts present evidence and reweights absent categories",()=>{const m=scoreRequirements("Python", {keywords:[{label:"Python",evidence:"Python"},{label:"Docker",evidence:"Docker"}],skills:[{label:"Coding",evidence:"Python"}],experience:[]});assert.equal(m.score,71);assert.equal(m.breakdown.experience,null)});
test("selected documents only and missing documents reject",()=>{const requirements={keywords:[],skills:[],experience:[]};assert.deepEqual(Object.keys(normalizePackage("Resume",["coverLetter"],{requirements,coverLetter:"Dear team"}).documents),["coverLetter"]);assert.throws(()=>normalizePackage("Resume",["recommendation"],{requirements}));assert.throws(()=>normalizePackage("Resume",["resume"],{requirements}))});
