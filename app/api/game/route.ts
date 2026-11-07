import {createRoom,view,mutate,join,fail} from '../../../lib/engine.mjs';

export const dynamic='force-dynamic';
const ROOM_TTL_MS=24*60*60*1000;
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});

function supabaseConfig(){
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw new Error('Thiếu cấu hình Supabase. Hãy đặt SUPABASE_URL và SUPABASE_SECRET_KEY.');
 const headers:Record<string,string>={apikey:key,'Content-Type':'application/json'};
 // New sb_secret keys are API keys, not JWT bearer tokens. The legacy service_role key is a JWT.
 if(!key.startsWith('sb_secret_'))headers.Authorization=`Bearer ${key}`;
 return {url:`${url.replace(/\/$/,'')}/rest/v1/rooms`,headers};
}

async function roomsRequest<T>(path:string,init:RequestInit={}):Promise<T>{
 const {url,headers}=supabaseConfig();
 const response=await fetch(`${url}${path}`,{...init,headers:{...headers,...init.headers},cache:'no-store'});
 const body=await response.text();
 const result=body?JSON.parse(body):null;
 if(!response.ok){
  const error=new Error(result?.message||'Không thể truy cập Supabase.') as Error&{status?:number;code?:string};
  error.status=response.status===409&&result?.code==='23505'?409:response.status;
  error.code=result?.code;
  throw error;
 }
 return result as T;
}

const expiry=()=>new Date(Date.now()+ROOM_TTL_MS).toISOString();
const activeRoomFilter=(code:string)=>`code=eq.${encodeURIComponent(code)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}`;

export async function GET(req:Request){try{
 const code=new URL(req.url).searchParams.get('code');
 if(!code)fail('Thiếu mã phòng.',400);
 const rows=await roomsRequest<{data:any;version:number}[]>(`?select=data,version&${activeRoomFilter(code)}&limit=1`);
 const row=rows[0];
 if(!row)fail('Phòng đã hết hạn hoặc không còn hoạt động. Hãy nhờ DM tạo phòng mới.',404);
 return json(view(row.data,req.headers.get('Authorization')?.replace('Bearer ','')||''));
}catch(e:any){return json({error:e.message},e.status||500)}}

export async function POST(req:Request){try{
 if(Number(req.headers.get('content-length')||0)>700000)fail('Dữ liệu quá lớn.',413);
 const b:any=await req.json();
 if(b.action==='create'){
  for(let i=0;i<8;i++){
   const a=new Uint32Array(1);crypto.getRandomValues(a);const code=String(10000000+a[0]%90000000),room=createRoom(code);
   try{
    await roomsRequest('',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({code,data:room,version:0,expires_at:expiry()})});
    return json({code,token:room.dm,room:view(room,room.dm)});
   }catch(error:any){if(error.code!=='23505')throw error;}
  }
  fail('Chưa tạo được phòng. Hãy thử lại.');
 }
 for(let i=0;i<8;i++){
  const code=String(b.code||'');
  if(!/^\d{8}$/.test(code))fail('Mã phòng cần gồm tám chữ số.');
  const filter=activeRoomFilter(code);
  const rows=await roomsRequest<{data:any;version:number}[]>(`?select=data,version&${filter}&limit=1`);
  const row=rows[0];
  if(!row)fail('Phòng đã hết hạn hoặc không còn hoạt động. Hãy nhờ DM tạo phòng mới.',404);
  const room=row.data;let key=req.headers.get('Authorization')?.replace('Bearer ','')||'';
  if(b.action==='join')key=join(room,b.role,b.name);else mutate(room,key,b.action,b.data);
  const updated=await roomsRequest<{code:string}[]>(`?${filter}&version=eq.${row.version}&select=code`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({data:room,version:row.version+1,expires_at:expiry()})});
  if(updated.length)return json({code:room.code,token:key,room:view(room,key)});
 }
 return json({error:'Phòng đang bận. Hãy thử lại.'},409);
}catch(e:any){return json({error:e.message||'Không thể xử lý yêu cầu.'},e.status||500)}}
