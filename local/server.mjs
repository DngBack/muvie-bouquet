import http from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {readFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import os from 'node:os';
import {createRoom,view,join,mutate,fail} from '../lib/engine.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
await mkdir(path.join(root,'data'),{recursive:true});
const db=new DatabaseSync(path.join(root,'data','muvie.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS rooms (code TEXT PRIMARY KEY,data TEXT NOT NULL,version INTEGER NOT NULL DEFAULT 0)');
const port=Number(process.env.PORT||4173),host=process.env.HOST||'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.mp3':'audio/mpeg','.woff2':'font/woff2','.ttf':'font/ttf','.jpg':'image/jpeg','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
 const reply=(o,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(o))};
 try{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/api/game'){
   const key=(req.headers.authorization||'').replace('Bearer ','');
   if(req.method==='GET'){const row=db.prepare('SELECT data FROM rooms WHERE code=?').get(u.searchParams.get('code'));if(!row)fail('Không tìm thấy phòng. Kiểm tra lại mã.',404);return reply(view(JSON.parse(row.data),key))}
   if(req.method!=='POST')return reply({error:'Phương thức không hợp lệ.'},405);
   if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)fail('Nguồn yêu cầu không hợp lệ.',403);
   let body='';for await(const chunk of req){body+=chunk;if(body.length>700000)fail('Dữ liệu quá lớn.',413)}
   const b=JSON.parse(body||'{}');
   if(b.action==='create'){
    let room;do{const a=new Uint32Array(1);crypto.getRandomValues(a);room=createRoom(String(10000000+a[0]%90000000))}while(db.prepare('SELECT code FROM rooms WHERE code=?').get(room.code));
    db.prepare('INSERT INTO rooms(code,data,version) VALUES(?,?,0)').run(room.code,JSON.stringify(room));return reply({code:room.code,token:room.dm,room:view(room,room.dm)});
   }
   const row=db.prepare('SELECT data FROM rooms WHERE code=?').get(String(b.code));if(!row)fail('Không tìm thấy phòng. Kiểm tra mã gồm tám chữ số.',404);
   const room=JSON.parse(row.data);const currentKey=b.action==='join'?join(room,b.role,b.name):key;if(b.action!=='join')mutate(room,key,b.action,b.data);
   db.prepare('UPDATE rooms SET data=?,version=version+1 WHERE code=?').run(JSON.stringify(room),String(b.code));return reply({code:room.code,token:currentKey,room:view(room,currentKey)});
  }
  let relative=decodeURIComponent(u.pathname);if(relative==='/'||relative==='/index.html')relative='/local/index.html';
  const base=path.join(root,'dist-local'),file=path.resolve(base,'.'+relative);
  if(!file.startsWith(base+path.sep))fail('Không tìm thấy tệp.',404);
  const buf=await readFile(file),type=mime[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':type,'Content-Length':buf.length,'X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')res.end();else res.end(buf);
 }catch(e){reply({error:e.code==='ENOENT'?'Không tìm thấy trang.':e.message},e.status||(e.code==='ENOENT'?404:500))}
});
server.listen(port,host,()=>{console.log(`Muvie đang chạy: http://127.0.0.1:${port}`);if(host==='0.0.0.0'){for(const list of Object.values(os.networkInterfaces()))for(const net of list||[])if(net.family==='IPv4'&&!net.internal)console.log(`Điện thoại cùng Wi-Fi: http://${net.address}:${port}`)}console.log('Giữ cửa sổ này mở trong suốt lượt chơi. Ctrl+C để dừng. Dữ liệu: data/muvie.sqlite')});
