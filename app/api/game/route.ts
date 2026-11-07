import {createRoom,view,mutate,join,fail} from '../../../lib/engine.mjs';

export const dynamic='force-dynamic';
const ROOM_TTL_SECONDS=24*60*60;
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const roomKey=(code:string)=>`muvie:room:${code}`;

async function redisCommand<T>(...command:(string|number)[]):Promise<T>{
 const url=process.env.UPSTASH_REDIS_REST_URL,key=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(!url||!key)throw new Error('Thiếu cấu hình kho phòng tạm. Hãy đặt UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN.');
 const response=await fetch(url,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(command),cache:'no-store'});
 const result=await response.json();
 if(!response.ok||result.error)throw new Error(result.error||'Không thể kết nối kho phòng tạm.');
 return result.result as T;
}

async function loadRoom(code:string){
 const script="local v=redis.call('GET',KEYS[1]); if not v then return false end; local r=cjson.decode(v); if not r.closed then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return v";
 const raw=await redisCommand<string|null>('EVAL',script,1,roomKey(code),ROOM_TTL_SECONDS);
 return raw?JSON.parse(raw):null;
}

async function saveRoom(code:string,expectedVersion:number,room:any){
 const script="local v=redis.call('GET',KEYS[1]); if not v then return -1 end; local r=cjson.decode(v); if tonumber(r.version)~=tonumber(ARGV[1]) then return 0 end; redis.call('SET',KEYS[1],ARGV[2],'EX',ARGV[3]); return 1";
 return redisCommand<number>('EVAL',script,1,roomKey(code),expectedVersion,JSON.stringify(room),ROOM_TTL_SECONDS);
}

export async function GET(req:Request){try{
 const code=new URL(req.url).searchParams.get('code');
 if(!code)fail('Thiếu mã phòng.',400);
 const room=await loadRoom(code);
 if(!room)fail('Phòng đã hết hạn hoặc không còn hoạt động. Hãy nhờ DM tạo phòng mới.',404);
 return json(view(room,req.headers.get('Authorization')?.replace('Bearer ','')||''));
}catch(e:any){return json({error:e.message},e.status||500)}}

export async function POST(req:Request){try{
 if(Number(req.headers.get('content-length')||0)>700000)fail('Dữ liệu quá lớn.',413);
 const b:any=await req.json();
 if(b.action==='create'){
  for(let i=0;i<8;i++){
   const a=new Uint32Array(1);crypto.getRandomValues(a);const code=String(10000000+a[0]%90000000),room=createRoom(code);
   const created=await redisCommand<string|null>('SET',roomKey(code),JSON.stringify(room),'EX',ROOM_TTL_SECONDS,'NX');
   if(created==='OK')return json({code,token:room.dm,room:view(room,room.dm)});
  }
  fail('Chưa tạo được phòng. Hãy thử lại.');
 }
 for(let i=0;i<8;i++){
  const code=String(b.code||'');
  if(!/^\d{8}$/.test(code))fail('Mã phòng cần gồm tám chữ số.');
  const room=await loadRoom(code);
  if(!room)fail('Phòng đã hết hạn hoặc không còn hoạt động. Hãy nhờ DM tạo phòng mới.',404);
  const expectedVersion=room.version;let key=req.headers.get('Authorization')?.replace('Bearer ','')||'';
  if(b.action==='join')key=join(room,b.role,b.name);else mutate(room,key,b.action,b.data);
  const saved=await saveRoom(code,expectedVersion,room);
  if(saved===1)return json({code:room.code,token:key,room:view(room,key)});
  if(saved===-1)fail('Phòng đã hết hạn hoặc không còn hoạt động. Hãy nhờ DM tạo phòng mới.',404);
 }
 return json({error:'Phòng đang bận. Hãy thử lại.'},409);
}catch(e:any){return json({error:e.message||'Không thể xử lý yêu cầu.'},e.status||500)}}
