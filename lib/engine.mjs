import {roles,catalog,writingStages,displayName} from './game-data.mjs';
import {story} from './story.mjs';
export const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status})};
export const token=()=>crypto.randomUUID()+crypto.randomUUID();
export function createRoom(code){return {code,dm:token(),created:Date.now(),closed:false,stage:0,pairingVersion:2,players:{},posts:[],likes:{},balances:[100000,100000,100000],round:0,answers:{},settlements:[],shopping:{},shopStart:null,log:[],version:0};}
export function actor(room,key){if(key===room.dm)return 'dm';return Object.keys(room.players).find(r=>room.players[r].token===key)||null;}
export function view(room,key){
 const who=actor(room,key);if(!who)fail('Phiên đăng nhập không hợp lệ. Hãy vào lại phòng.',401);
 const {dm,...r}=room;delete r.likes;
 r.players=Object.fromEntries(Object.entries(room.players).map(([id,p])=>[id,{name:p.name,joined:p.joined}]));
 r.posts=[...story.filter(p=>p.unlock<=room.stage),...room.posts].map(p=>({...p,author:p.role?displayName(roles.find(x=>x.id===p.role),room.stage):p.author,likes:(room.likes[p.id]||[]).length,liked:(room.likes[p.id]||[]).includes(who)}));
 r.who=who;r.serverNow=Date.now();
 if(who!=='dm'){
  r.answers=Object.fromEntries(Object.entries(room.answers).map(([round,ans])=>[round,{submitted:!!ans[who],mine:ans[who]||null,count:Object.keys(ans).length}]));
  r.shopping={mine:room.shopping[who]||null,count:Object.keys(room.shopping).length};r.log=[];
 }
 return r;
}
function log(r,text){r.log.unshift({at:Date.now(),text});r.log=r.log.slice(0,150);}
export function rank(balances){return balances.map((balance,pair)=>({pair,balance})).sort((a,b)=>{const av=a.balance>0,bv=b.balance>0;if(av!==bv)return av?-1:1;return av?a.balance-b.balance:b.balance-a.balance;});}
export function upgradePairings(room){if(room.pairingVersion>=2)return false;const settlements=[...(room.settlements||[])].sort((a,b)=>a.round-b.round);if(settlements.some(s=>Object.keys(room.answers?.[s.round]||{}).length!==6))return false;const balances=[100000,100000,100000];for(const s of settlements){const answers=room.answers[s.round];const details=[];for(let pair=0;pair<3;pair++){const ids=roles.filter(p=>p.pair===pair).map(p=>p.id);if(ids.length!==2)return false;const a=answers[ids[0]],b=answers[ids[1]],common=a.filter(x=>b.includes(x)),charged=[...a.filter(x=>!b.includes(x)),...b.filter(x=>!a.includes(x))],cost=charged.reduce((sum,i)=>sum+(catalog[s.round]?.[i]?.[1]||0),0);balances[pair]-=cost;details.push({pair,common,charged,cost,balance:balances[pair],choices:[a,b]});}s.details=details;}for(const entry of room.log||[]){const m=String(entry.text||'').match(/^Điều chỉnh cặp ([1-3]): (-?\d+)\./);if(m)balances[Number(m[1])-1]+=Number(m[2]);}room.balances=balances;room.pairingVersion=2;room.version=(room.version||0)+1;return true;}
export function settlement(r){
 if(r.stage!==3)fail('Chưa mở Hành trình chân ái.');if(r.settlements.some(s=>s.round===r.round))fail('Vòng này đã tính chi phí.');
 const ans=r.answers[r.round]||{};if(Object.keys(ans).length!==6)fail('Cần đủ 6/6 người nộp lựa chọn.');
 const details=[];
 for(let pair=0;pair<3;pair++){
  const ids=roles.filter(p=>p.pair===pair).map(p=>p.id),a=ans[ids[0]],b=ans[ids[1]];
  const common=a.filter(x=>b.includes(x)),charged=[...a.filter(x=>!b.includes(x)),...b.filter(x=>!a.includes(x))];
  const cost=charged.reduce((s,i)=>s+catalog[r.round][i][1],0);r.balances[pair]-=cost;
  details.push({pair,common,charged,cost,balance:r.balances[pair],choices:[a,b]});
 }
 r.settlements.push({round:r.round,details});log(r,'Tính chi phí vòng '+(r.round+1));
}
export function mutate(r,key,action,data={}){
 const who=actor(r,key);if(!who)fail('Phiên đăng nhập không hợp lệ.',401);if(r.closed)fail('Phòng đã kết thúc. Bạn vẫn có thể xem kỷ niệm.');
 const dm=()=>{if(who!=='dm')fail('Chỉ DM được thực hiện thao tác này.',403)},player=()=>{if(who==='dm')fail('Thao tác dành cho người chơi.')};
 switch(action){
 case 'stage':{dm();const next=Number(data.stage);if(!Number.isInteger(next)||next<0||next>8)fail('Mốc không hợp lệ.');if(next<r.stage)fail('Nội dung đã mở không thể khóa lại. Hãy tạo phòng mới để chạy lại.');if(next>r.stage+1)fail('Hãy mở lần lượt theo kịch bản.');if(next>r.stage&&Object.keys(r.players).length!==6)fail('Cần đủ sáu người nhận vai trước khi mở mốc.');if(next>r.stage&&writingStages[r.stage]&&r.posts.filter(p=>p.slot===writingStages[r.stage]).length!==6)fail('Hãy đợi đủ sáu bài cảm nghĩ cho lượt này.');if(r.stage===3&&next===4&&r.settlements.length!==5)fail('Cần hoàn thành đủ năm vòng trước khi kết thúc hành trình.');r.stage=next;log(r,'Mở mốc '+next);break;}
 case 'post':{player();const slot=writingStages[r.stage];if(!slot)fail('DM chưa mở lượt viết cảm nghĩ.');if(r.posts.some(p=>p.role===who&&p.slot===slot))fail('Bạn đã gửi bài trong lượt này.');const text=String(data.text||'').trim();if(!text||text.length>1200)fail('Bài viết cần từ 1 đến 1.200 ký tự.');r.posts.push({id:crypto.randomUUID(),author:displayName(roles.find(p=>p.id===who),r.stage),role:who,text,slot,at:Date.now()});break;}
 case 'official':{dm();if(r.stage<4)fail('Ảnh chương trình mở sau lễ cưới thử.');const image=String(data.image||'');if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)||image.length>600000)fail('Ảnh cần là JPEG, PNG hoặc WebP dưới 450 KB.');r.posts=r.posts.filter(p=>p.id!=='official');r.posts.push({id:'official',author:'Ê-kíp Muvie',text:'Một lễ cưới, ba cặp đôi, và một tấm hình để nhớ. Cảm ơn các bạn đã cùng ghi hình.',image,at:Date.now()});break;}
 case 'like':{if(!story.filter(p=>p.unlock<=r.stage).concat(r.posts).some(p=>p.id===data.id))fail('Không tìm thấy bài viết.');const a=r.likes[data.id]||[];r.likes[data.id]=a.includes(who)?a.filter(x=>x!==who):[...a,who];break;}
 case 'choose':{player();if(r.stage!==3)fail('Chưa mở hành trình.');if(Number(data.round)!==r.round)fail('Vòng chơi đã thay đổi.');if(r.settlements.some(s=>s.round===r.round))fail('Vòng đã chốt chi phí.');if(r.answers[r.round]?.[who])fail('Đã nộp lựa chọn.');const choices=[...new Set(data.choices||[])];if(!choices.every(i=>Number.isInteger(i)&&catalog[r.round][i]))fail('Lựa chọn không hợp lệ.');if(r.round<3&&choices.length!==1)fail('Hãy chọn đúng một phương án.');if(r.round===3&&(choices.length<1||choices.length>9))fail('Chọn từ một đến chín hoạt động.');if(r.round===4)fail('Hãy dùng thao tác mua nhanh.');r.answers[r.round]||={};r.answers[r.round][who]=choices;break;}
 case 'shop-start':dm();if(r.stage!==3||r.round!==4)fail('Chưa đến vòng mua sắm.');if(r.shopStart)fail('Đếm ngược đã bắt đầu.');r.shopStart=Date.now();log(r,'Bắt đầu mua nhanh');break;
 case 'shop-open':{player();if(r.stage!==3||r.round!==4||!r.shopStart)fail('DM chưa bắt đầu mua nhanh.');if(!r.shopping[who])r.shopping[who]={started:Date.now(),choices:[],done:false};break;}
 case 'buy':{player();const s=r.shopping[who];if(r.stage!==3||r.round!==4||!s||s.done||Date.now()>s.started+10000)fail('Thời gian mua nhanh đã kết thúc.');const item=Number(data.item);if(!Number.isInteger(item)||!catalog[4][item])fail('Món hàng không hợp lệ.');if(s.choices.includes(item))fail('Bạn đã chọn món hàng này.');s.choices.push(item);break;}
 case 'shop-done':{player();const s=r.shopping[who];if(!s||r.round!==4)fail('Chưa bắt đầu mua nhanh.');s.done=true;r.answers[4]||={};r.answers[4][who]=[...s.choices];break;}
 case 'settle':dm();settlement(r);break;
 case 'round':{dm();if(r.stage!==3||r.round>=4)fail('Không thể chuyển vòng.');if(!r.settlements.some(s=>s.round===r.round))fail('Phải tính chi phí trước khi chuyển vòng.');r.round++;log(r,'Mở vòng '+(r.round+1));break;}
 case 'adjust':{dm();const pair=Number(data.pair),amount=Number(data.amount),reason=String(data.reason||'').trim();if(!Number.isInteger(pair)||pair<0||pair>2||!Number.isInteger(amount)||Math.abs(amount)>1000000||!reason)fail('Nhập số tiền nguyên và lý do điều chỉnh.');r.balances[pair]+=amount;log(r,`Điều chỉnh cặp ${pair+1}: ${amount}. ${reason}`);break;}
 case 'kick':{dm();if(r.stage!==0)fail('Chỉ đổi vai trước khi khai máy để bảo toàn lựa chọn.');delete r.players[data.role];break;}
 case 'close':dm();r.closed=true;log(r,'Kết thúc phòng');break;
 default:fail('Thao tác không hợp lệ.');
 }r.version++;return r;
}
export function join(r,role,name){if(Date.now()-r.created>24*3600000)fail('Phòng đã quá 24 giờ.');if(!roles.some(p=>p.id===role))fail('Hãy chọn nhân vật.');const clean=String(name||'').normalize('NFKC').trim().replace(/\s+/g,' ');if(!clean||clean.length>40)fail('Nhập tên từ 1 đến 40 ký tự.');const existing=r.players[role];if(existing){const oldName=existing.name.normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('vi');if(oldName!==clean.toLocaleLowerCase('vi'))fail('Nhân vật này đã có người nhận. Hãy nhập đúng tên đã dùng để vào lại.');return existing.token;}if(r.closed)fail('Phòng đã kết thúc. Người đã nhận vai có thể vào lại bằng đúng tên và nhân vật đã dùng.');const key=token();r.players[role]={name:clean,token:key,joined:Date.now()};r.version++;return key;}
