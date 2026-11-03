import {env} from 'cloudflare:workers';
import {createRoom,view,mutate,join,fail} from '../../../lib/engine.mjs';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req:Request){try{
 const u=new URL(req.url),code=u.searchParams.get('code');
 const row=await env.DB.prepare('SELECT data FROM rooms WHERE code=?').bind(code).first<{data:string}>();
 if(!row)fail('Không tìm thấy phòng. Kiểm tra lại mã.',404);
 return json(view(JSON.parse(row!.data),req.headers.get('Authorization')?.replace('Bearer ','')||''));
}catch(e:any){return json({error:e.message},e.status||500)}}
export async function POST(req:Request){try{
 if(Number(req.headers.get('content-length')||0)>700000)fail('Dữ liệu quá lớn.',413);
 const b:any=await req.json();
 if(b.action==='create'){
  for(let i=0;i<8;i++){
   const a=new Uint32Array(1);crypto.getRandomValues(a);const code=String(10000000+a[0]%90000000),room=createRoom(code);
   const result=await env.DB.prepare('INSERT OR IGNORE INTO rooms (code,data,version) VALUES (?,?,0)').bind(code,JSON.stringify(room)).run();
   if(result.meta.changes)return json({code,token:room.dm,room:view(room,room.dm)});
  }fail('Chưa tạo được phòng. Hãy thử lại.');
 }
 for(let i=0;i<8;i++){
  const row=await env.DB.prepare('SELECT data,version FROM rooms WHERE code=?').bind(String(b.code)).first<{data:string,version:number}>();
  if(!row)fail('Không tìm thấy phòng. Kiểm tra mã gồm tám chữ số.',404);
  const room=JSON.parse(row!.data);let key=req.headers.get('Authorization')?.replace('Bearer ','')||'';
  if(b.action==='join')key=join(room,b.role,b.name);else mutate(room,key,b.action,b.data);
  const result=await env.DB.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=? AND version=?').bind(JSON.stringify(room),String(b.code),row!.version).run();
  if(result.meta.changes)return json({code:room.code,token:key,room:view(room,key)});
 }return json({error:'Phòng đang bận. Hãy thử lại.'},409);
}catch(e:any){return json({error:e.message||'Không thể xử lý yêu cầu.'},e.status||500)}}
