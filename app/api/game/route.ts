import {createRoom,view,mutate,join,fail} from '../../../lib/engine.mjs';

export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});

function supabaseRoomsUrl() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Thiếu cấu hình Supabase. Hãy đặt SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY.');
  return { url: `${url.replace(/\/$/, '')}/rest/v1/rooms`, key };
}

async function roomsRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = supabaseRoomsUrl();
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });
  const body = await response.text();
  const result = body ? JSON.parse(body) : null;
  if (!response.ok) {
    const error = new Error(result?.message || 'Không thể truy cập Supabase.') as Error & { status?: number };
    error.status = result?.code === '23505' ? 409 : response.status;
    throw error;
  }
  return result as T;
}

export async function GET(req:Request){try{
 const code=new URL(req.url).searchParams.get('code');
 if(!code)fail('Thiếu mã phòng.',400);
 const rows=await roomsRequest<{data:any}[]>(`?select=data&code=eq.${encodeURIComponent(code)}&limit=1`);
 const row=rows[0];
 if(!row)fail('Không tìm thấy phòng. Kiểm tra lại mã.',404);
 return json(view(row.data,req.headers.get('Authorization')?.replace('Bearer ','')||''));
}catch(e:any){return json({error:e.message},e.status||500)}}

export async function POST(req:Request){try{
 if(Number(req.headers.get('content-length')||0)>700000)fail('Dữ liệu quá lớn.',413);
 const b:any=await req.json();
 if(b.action==='create'){
  for(let i=0;i<8;i++){
   const a=new Uint32Array(1);crypto.getRandomValues(a);const code=String(10000000+a[0]%90000000),room=createRoom(code);
   try {
    await roomsRequest('/?select=code',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({code,data:room,version:0})});
    return json({code,token:room.dm,room:view(room,room.dm)});
   } catch(error:any) {
    if(error.status!==409)throw error;
   }
  }
  fail('Chưa tạo được phòng. Hãy thử lại.');
 }
 for(let i=0;i<8;i++){
  const code=String(b.code);
  const rows=await roomsRequest<{data:any;version:number}[]>(`?select=data,version&code=eq.${encodeURIComponent(code)}&limit=1`);
  const row=rows[0];
  if(!row)fail('Không tìm thấy phòng. Kiểm tra mã gồm tám chữ số.',404);
  const room=row.data;let key=req.headers.get('Authorization')?.replace('Bearer ','')||'';
  if(b.action==='join')key=join(room,b.role,b.name);else mutate(room,key,b.action,b.data);
  const updated=await roomsRequest<{code:string}[]>(`?code=eq.${encodeURIComponent(code)}&version=eq.${row.version}&select=code`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({data:room,version:row.version+1})});
  if(updated.length)return json({code:room.code,token:key,room:view(room,key)});
 }
 return json({error:'Phòng đang bận. Hãy thử lại.'},409);
}catch(e:any){return json({error:e.message||'Không thể xử lý yêu cầu.'},e.status||500)}}
