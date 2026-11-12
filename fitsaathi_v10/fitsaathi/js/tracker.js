/* Progress tracker: marks exercises done, estimates calories (MET x weight x time), fills the dashboard, adds nav tabs. Data stays on this device. */
(()=>{
const K="fs_log",$=s=>document.querySelector(s);
const ld=()=>{try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return{}}};
const sv=o=>{try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}};
const day=(d=new Date())=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const kg=()=>{try{const w=+JSON.parse(localStorage.getItem("fs")||"{}").weight;return w>=30&&w<=250?w:70}catch(e){return 70}};
const MET={sq:5,lu:4.5,br:3.5,pl:3.3,pu:4,an:2.5,hi:4.5,ro:4,rf:3.5,pr:4,oh:4,lt:3.5,la:4,di:4,de:3.3,bd:3.3,su:3,mc:8,lp:5,hc:3.5,ma:4,st:2.3};
function kcal(n,rx){
  let m=MET[window.FSDemo?FSDemo.tk(n):"st"]||3;const w=kg();
  if(/brisk|cycling/i.test(n))m=6;else if(/warm/i.test(n))m=3;else if(/breath/i.test(n))m=1.5;
  const t=String(rx).match(/(\d+)\s*[x×]\s*(\d+)(?:\s*[–-]\s*(\d+))?\s*(sec)?/i);
  if(t){const s=+t[1],r=t[3]?(+t[2]+ +t[3])/2:+t[2];return Math.round((m*s*(t[4]?r:r*4)+1.5*s*40)*w/3600)}
  const u=String(rx).match(/(\d+)(?:\s*(?:to|–|-)\s*(\d+))?\s*min/i);
  return Math.round(m*w*(u?(u[2]?(+u[1]+ +u[2])/2:+u[1]):5)/60);
}
const has=n=>{const e=ld()[day()];return !!(e&&e.x[n]!=null)};
const tot=d=>{const e=ld()[d];return e?Object.values(e.x).reduce((a,b)=>a+b,0):0};
function toggle(n,rx){const L=ld(),d=day();L[d]=L[d]||{x:{}};if(L[d].x[n]!=null){delete L[d].x[n];if(L[d].r)delete L[d].r[n]}else L[d].x[n]=kcal(n,rx);if(!Object.keys(L[d].x).length)delete L[d];sv(L)}
function logCam(n,rx,r){const L=ld(),d=day(),k=kcal(n,rx);L[d]=L[d]||{x:{}};L[d].r=L[d].r||{};L[d].x[n]=(L[d].r[n]!=null?L[d].x[n]:0)+k;L[d].r[n]=(L[d].r[n]||0)+r;sv(L);document.dispatchEvent(new Event("fs-log"));return k}
function sum(sel){const e=ld()[day()],c=e?Object.keys(e.x).length:0;$(sel).innerHTML=c?`<strong>Today: ${c} exercise${c>1?"s":""} done, about ${tot(day())} kcal burned.</strong><br><small>Estimate based on your weight (${kg()} kg). Real burn varies from person to person.</small>`:"Tap “Mark done” after each exercise to track calories burned and your streak."}
function dash(){
  const g=$("#dashLive");if(!g)return;
  const L=ld(),n=new Date(),mon=new Date(n);mon.setDate(n.getDate()-((n.getDay()+6)%7));
  const wk=[...Array(7)].map((_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);return day(d)}),kc=wk.map(tot),done=kc.filter(x=>x>0).length;
  const rp=wk.reduce((a,d)=>a+Object.values((L[d]||{}).r||{}).reduce((x,y)=>x+y,0),0);let goal=3;try{goal=JSON.parse(localStorage.getItem("fs_plan")).wk.length||3}catch(e){}
  let st=0;const c=new Date();if(!L[day(c)])c.setDate(c.getDate()-1);while(L[day(c)]){st++;c.setDate(c.getDate()-1)}
  const pct=Math.min(100,Math.round(done/goal*100)),mx=Math.max(...kc,1),C=2*Math.PI*54,ti=(n.getDay()+6)%7;
  g.innerHTML=`<div class="card" style="text-align:center"><svg class="ring" viewBox="0 0 130 130" role="img" aria-label="${pct} percent of weekly goal"><circle cx="65" cy="65" r="54" stroke="var(--mint)"/><circle cx="65" cy="65" r="54" stroke="var(--brand)" stroke-dasharray="${C*pct/100} ${C}" transform="rotate(-90 65 65)"/></svg><div class="big">${pct}%</div><p class="lead" style="font-size:.95rem;margin:4px auto 0">of weekly goal (${done} of ${goal} days)</p></div>
  <div class="card"><div class="big">${st}</div><p class="lead" style="font-size:.95rem">day streak</p><p style="margin-top:18px;font-weight:600">Calories burned</p><div class="big" style="color:var(--good)">${kc.reduce((a,b)=>a+b,0)}</div><p class="lead" style="font-size:.9rem">this week · ${kc[ti]} today${rp?` · ${rp} camera reps`:""}</p></div>
  <div class="card"><h3>Calories burned this week</h3><div class="bars" aria-hidden="true">${"MTWTFSS".split("").map((l,i)=>`<i style="height:${Math.max(kc[i]?14:4,kc[i]/mx*100)}%"${kc[i]?' class="on"':""}><span${i==ti?' style="color:var(--brand);font-weight:700"':""}>${l}</span></i>`).join("")}</div><div style="height:22px"></div>${Object.keys(L).length?"":'<p class="lead" style="font-size:.9rem">Nothing logged yet. Open your plan and tap “Mark done”.</p>'}</div>`;
}
function tabs(){
  const p=location.pathname.split("/").pop()||"index.html",A='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="',
  T=[["Home","index.html","M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"],["Exercises","index.html#demos","M6 4v16M18 4v16M3 8v8M21 8v8M6 12h12"],["Progress","index.html#dashLive","M4 20V10M10 20V4M16 20v-7M22 20H2"],["Plan","plan.html","M9 3h6l1 2h3v16H5V5h3zM9 12h6M9 16h4"]];
  document.body.insertAdjacentHTML("beforeend",`<div class="tabs" role="navigation" aria-label="Main">${T.map(t=>`<a href="${t[1]}"${t[1]==p?' aria-current="page"':""}>${A+t[2]}"/></svg>${t[0]}</a>`).join("")}</div>`);
  const b=$("nav .nav-r");if(b&&!b.querySelector('a[href*="#demos"]'))b.insertAdjacentHTML("afterbegin",'<a class="h" href="index.html#demos">Exercises</a><a class="h" href="index.html#dashLive">Progress</a>');
}
window.FSTrack={kcal,has,toggle,sum,tot,logCam};
addEventListener("DOMContentLoaded",()=>{dash();tabs()});
})();
