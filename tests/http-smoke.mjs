import assert from 'node:assert/strict';
import {roles} from '../lib/game-data.mjs';
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
async function call(action,data={},s){const res=await fetch(base+'/api/game',{method:'POST',headers:{'Content-Type':'application/json',...(s?{Authorization:'Bearer '+s.token}:{})},body:JSON.stringify({action,code:s?.code,...(action==='join'?data:{data})})});const out=await res.json();if(!res.ok)throw new Error(out.error);return out;}
const dm=await call('create'),people=[];assert.equal(dm.room.who,'dm');
for(const p of roles)people.push(await call('join',{code:dm.code,role:p.id,name:'Kiểm thử '+p.name}));
await assert.rejects(()=>call('join',{code:dm.code,role:roles[0].id,name:'Trùng vai'}));
await assert.rejects(()=>call('stage',{stage:1},people[0]));
await call('stage',{stage:1},dm);let r=await call('stage',{stage:2},dm);assert.equal(r.room.posts.length,9);
await Promise.all(people.map(p=>call('post',{text:'Kỷ niệm 1 · <script>không thực thi</script>'},p)));
await call('stage',{stage:3},dm);
for(let round=0;round<5;round++){
 if(round<4)await Promise.all(people.map((p,i)=>call('choose',{round,choices:round===3?[0,1,i%2?2:3]:[i%2]},p)));
 else{await call('shop-start',{},dm);await Promise.all(people.map(async(p,i)=>{await call('shop-open',{},p);await call('buy',{item:i%2},p);await call('shop-done',{},p)}));}
 r=await call('settle',{},dm);assert.equal(r.room.settlements.length,round+1);await assert.rejects(()=>call('settle',{},dm));if(round<4)await call('round',{},dm);
}
await call('stage',{stage:4},dm);await Promise.all(people.map(p=>call('post',{text:'Kỷ niệm 2'},p)));await call('stage',{stage:5},dm);await Promise.all(people.map(p=>call('post',{text:'Kỷ niệm 3'},p)));await call('stage',{stage:6},dm);await call('stage',{stage:7},dm);r=await call('stage',{stage:8},dm);
assert.equal(r.room.posts.filter(p=>p.slot).length,18);assert.equal(r.room.posts.filter(p=>p.number).length,21);assert.equal(r.room.settlements.length,5);
const get=await fetch(base+'/api/game?code='+dm.code,{headers:{Authorization:'Bearer '+people[0].token}});const visible=await get.json();assert.ok(!JSON.stringify(visible).includes(dm.token));assert.ok(!JSON.stringify(visible).includes(people[1].token));
const invalid=await fetch(base+'/api/game?code='+dm.code,{headers:{Authorization:'Bearer sai'}});assert.equal(invalid.status,401);
await call('close',{},dm);await assert.rejects(()=>call('post',{text:'Sau đóng'},people[0]));
console.log('PASS HTTP: 1 DM + 6 người, ghi đồng thời, 5 vòng, 21 bản tin, 18 bài tự viết, quyền truy cập, đóng phòng.');
console.log('Phòng kiểm thử đã đóng:',dm.code);
