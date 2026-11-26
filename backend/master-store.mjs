import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {homedir} from 'node:os';
import {join} from 'node:path';
export function createMasterStore(filename){
 const db=new DatabaseSync(filename);db.exec("CREATE TABLE IF NOT EXISTS master_resume (id INTEGER PRIMARY KEY CHECK(id=1), text TEXT NOT NULL, updated_at TEXT NOT NULL)");
 return {get:()=>db.prepare('SELECT text, updated_at AS updatedAt FROM master_resume WHERE id=1').get()||null,
 set:(text)=>{const updatedAt=new Date().toISOString();db.prepare('INSERT INTO master_resume(id,text,updated_at) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET text=excluded.text,updated_at=excluded.updated_at').run(text,updatedAt);return {text,updatedAt};},
 clear:()=>{db.prepare('DELETE FROM master_resume WHERE id=1').run();db.exec('VACUUM');},close:()=>db.close()};
}
let store;
export function masterStore(){if(!store){const dir=join(homedir(),'.resumeow');mkdirSync(dir,{recursive:true,mode:0o700});store=createMasterStore(join(dir,'master.sqlite'));}return store;}
