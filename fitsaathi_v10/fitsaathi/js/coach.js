/* Camera posture coach for many exercises (MediaPipe Pose). FSCoach.open("Plank") / FSCoach.kind(name) */
(()=>{
const CDN="https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/",$=s=>document.querySelector(s);
const ang=(a,b,c)=>{let d=Math.abs((Math.atan2(c.y-b.y,c.x-b.x)-Math.atan2(a.y-b.y,a.x-b.x))*180/Math.PI);return d>180?360-d:d};
const lean=(s,h)=>Math.atan2(Math.abs(s.x-h.x),Math.abs(h.y-s.y))*180/Math.PI,OK=["Good rep.",0];
const E={
squat:{n:"Squat",lb:["reps","knee angle","back lean","avg score"],need:"hka",v:P=>ang(P.h,P.k,P.a),a:P=>lean(P.s,P.h),lo:110,hi:160,chk:(mn,mx,ax)=>mn>120?["Go lower.",35]:mn>100?["Go a little lower.",15]:ax>60?["Chest up, back straighter.",40]:ax>45?["Chest up.",25]:OK},
lunge:{n:"Lunge / step-up",lb:["reps","front knee","torso lean","avg score"],need:"hka",v:(P,Q)=>Math.min(ang(P.h,P.k,P.a),Q?ang(Q.h,Q.k,Q.a):999),a:P=>lean(P.s,P.h),lo:115,hi:160,chk:(mn,mx,ax)=>mn>115?["Go lower, front knee near 90 degrees.",25]:ax>30?["Keep your torso upright.",25]:OK},
pushup:{n:"Push-up",lb:["reps","elbow angle","hip sag/pike","avg score"],need:"sewha",v:P=>ang(P.s,P.e,P.w),a:P=>Math.abs(180-ang(P.s,P.h,P.a)),lo:110,hi:150,chk:(mn,mx,ax)=>mn>100?["Lower your chest more.",30]:ax>25?["Keep hips in line with shoulders and heels.",30]:OK},
bridge:{n:"Glute bridge",lb:["reps","hip angle","","avg score"],need:"shk",v:P=>ang(P.s,P.h,P.k),a:()=>0,lo:145,hi:165,chk:(mn,mx)=>mx<172?["Squeeze your glutes and lift hips a bit higher.",15]:OK},
plank:{n:"Plank",lb:["hold (sec)","body line","",""],need:"sha",hold:1},
posture:{n:"Posture check",lb:["view","head forward","shoulder tilt","score"],need:"",stat:1},
hinge:{n:"Hip hinge",lb:["reps","hip angle","","avg score"],need:"shk",v:P=>ang(P.s,P.h,P.k),a:()=>0,lo:140,hi:165,chk:mn=>mn>125?["Push hips back more, keep back flat.",20]:OK},
knee:{n:"Leg exercise",lb:["reps","knee angle","","avg score"],need:"hka",v:P=>ang(P.h,P.k,P.a),a:()=>0,lo:130,hi:160,chk:mn=>mn>110?["Bend your knee a bit more.",15]:OK},
elbow:{n:"Pull / dip",lb:["reps","elbow angle","","avg score"],need:"sew",v:P=>ang(P.s,P.e,P.w),a:()=>0,lo:120,hi:155,chk:mn=>mn>105?["Bend your elbow more for a full rep.",20]:OK},
raise:{n:"Arm raise / press",lb:["reps","arm lift","","avg score"],need:"seh",v:P=>180-ang(P.e,P.s,P.h),a:()=>0,lo:110,hi:150,chk:mn=>mn>95?["Raise your arms higher.",20]:OK},
free:{n:"Exercise",lb:["mode","","",""],need:"",free:1}};
const kind=n=>/mountain|dead bug|bird dog|superman|chest press|rear-delt|fly/i.test(n)?"free":/squat/i.test(n)?"squat":/lunge|step-up/i.test(n)?"lunge":/push-up/i.test(n)?"pushup":/bridge/i.test(n)?"bridge":/plank/i.test(n)?"plank":/wall angel|posture|chin/i.test(n)?"posture":/deadlift|hinge/i.test(n)?"hinge":/leg press|hamstring/i.test(n)?"knee":/row|pulldown|dip/i.test(n)?"elbow":/lateral|shoulder press|overhead/i.test(n)?"raise":"free";
let pose,stream,on=false,cfg,st,last=0,badNow=false,cur="";
const HI={"Go lower.":"Aur neeche jaiye.","Go a little lower.":"Thoda aur neeche.","Chest up, back straighter.":"Seena upar, peeth seedhi rakhiye.","Chest up.":"Seena upar.","Go lower, front knee near 90 degrees.":"Aur neeche, aage ka ghutna 90 degree par.","Keep your torso upright.":"Upar ka sharir seedha rakhiye.","Lower your chest more.":"Seena aur neeche laiye.","Keep hips in line with shoulders and heels.":"Kulhe kandhe aur edi ke seedh mein rakhiye.","Squeeze your glutes and lift hips a bit higher.":"Glutes kasiye aur kulhe thoda upar uthaiye.","Push hips back more, keep back flat.":"Kulhe peeche bhejiye, peeth seedhi rakhiye.","Bend your knee a bit more.":"Ghutna thoda aur modiye.","Bend your elbow more for a full rep.":"Poore rep ke liye kohni aur modiye.","Raise your arms higher.":"Haath aur upar uthaiye.","Lift your hips":"Kulhe upar uthaiye","Lower your hips":"Kulhe neeche kijiye","Camera is on. Get ready.":"Camera chalu hai. Taiyar ho jaiye."};
HI[OK[0]]="Bahut badhiya rep.";
const hi=()=>$("#vlang")&&$("#vlang").value=="hi",tr=t=>hi()&&HI[t]||t;
const say=(t,force)=>{if(!$("#voice").checked||!window.speechSynthesis||(!force&&Date.now()-last<3000))return;last=Date.now();speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(tr(t));u.lang="en-IN";speechSynthesis.speak(u)};
function finish(){if(!st||st.done||!cfg||cfg.stat||cfg.free)return;st.done=1;const n=cfg.hold?Math.round(st.sec):st.reps;if(n<1)return;
  const k=window.FSTrack?FSTrack.logCam(cur,"1 x "+n+(cfg.hold?" sec":""),cfg.hold?0:n):0,a=st.sc.length?Math.round(st.sc.reduce((x,y)=>x+y,0)/st.sc.length):0;
  say(hi()?`Session poora. ${n} ${cfg.hold?"second":"rep"}${a?", average score "+a:""}. Lagbhag ${k} calorie jali.`:`Session done. ${n} ${cfg.hold?"seconds":"reps"}${a?", average score "+a:""}. About ${k} calories burned.`,1)}
const tip=(t,c)=>{const e=$("#ct");e.textContent=t;e.style.color=c?`var(--${c})`:"";badNow=c=="bad"};
const setS=(a,b,c,d)=>[a,b,c,d].forEach((x,i)=>$("#c"+(i+1)).textContent=x);
const avg=()=>st.sc.length?Math.round(st.sc.reduce((a,b)=>a+b)/st.sc.length):"-";
function ui(){if($("#coachDlg"))return;
  document.body.insertAdjacentHTML("beforeend",`<dialog id="coachDlg"><div class="aiH"><strong id="cTitle"></strong><button id="cX" type="button" aria-label="Close">×</button></div><div class="camwrap"><video id="cv" playsinline muted></video><canvas id="cc"></canvas></div><div class="camstats">${[1,2,3,4].map(i=>`<div><b id="c${i}">-</b><span id="cl${i}"></span></div>`).join("")}</div><p class="camtip" id="ct"></p><label class="vo"><input type="checkbox" id="voice" checked> Voice tips</label></dialog>`);
  $("#cX").onclick=()=>$("#coachDlg").close();$("#coachDlg").onclose=stop}
function load(){return new Promise((ok,no)=>{if(window.Pose)return ok();const s=document.createElement("script");s.src=CDN+"pose.js";s.onload=ok;s.onerror=()=>no(new Error("Could not load the pose model. Check your internet."));document.head.appendChild(s)})}
function frame(r){
  const v=$("#cv"),c=$("#cc"),x=c.getContext("2d");c.width=v.videoWidth;c.height=v.videoHeight;x.clearRect(0,0,c.width,c.height);
  const L=r.poseLandmarks;if(!L){tip("Step back so your whole body is visible.","warn");return}
  const vi=i=>L[i].visibility,rt=vi(24)+vi(26)+vi(28)>vi(23)+vi(25)+vi(27),M={s:rt?12:11,e:rt?14:13,w:rt?16:15,h:rt?24:23,k:rt?26:25,a:rt?28:27},O={s:rt?11:12,h:rt?23:24,k:rt?25:26,a:rt?27:28},P={},Q={};
  for(const k in M)P[k]=L[M[k]];for(const k in O)Q[k]=L[O[k]];
  if(!cfg.stat&&[...cfg.need].some(k=>vi(M[k])<.5)){tip("I can't see your whole body. Stand side-on, a bit further away.","warn");return}
  let pts=[P.s,P.h,P.k,P.a];
  if(cfg.stat){
    const wide=Math.abs(L[11].x-L[12].x)>.12;let sc=100,msg;
    if(wide){const t=Math.abs(Math.atan2(L[11].y-L[12].y,L[11].x-L[12].x)*180/Math.PI),d=t>90?180-t:t;sc-=d>4?Math.min(40,d*4):0;msg=d>4?"One shoulder is higher. Relax and level them.":"Shoulders look level.";setS("front","-",d.toFixed(1)+"°",Math.round(sc))}
    else{const ear=L[rt?8:7],fh=Math.abs(ear.x-P.s.x)/Math.max(.01,Math.abs(P.s.y-P.h.y)),ln=lean(P.s,P.h);sc-=(fh>.25?Math.min(40,(fh-.25)*150):0)+(ln>8?15:0);msg=fh>.25?"Head is forward. Tuck your chin and lift the crown of your head.":ln>8?"You are leaning. Stand tall.":"Nice neutral posture.";setS("side",Math.round(fh*100)+"%","-",Math.round(sc))}
    tip(msg,sc>=85?"good":sc>=65?"warn":"bad");pts=[L[rt?8:7],P.s,P.h,P.a]}
  else if(cfg.free){tip("Camera is on. Do the exercise and compare with the demo video. Keep your whole body in view.","good");setS("live","","","")}
  else if(cfg.hold){
    const l=ang(P.s,P.h,P.a),ok=l>=165,now=performance.now();if(ok&&st.t)st.sec+=(now-st.t)/1000;st.t=ok?now:0;const w=Math.floor(st.sec);if(ok&&w&&w%10==0&&w!=st.said){st.said=w;say(w+" seconds",1)}
    if(ok)tip("Perfect line. Keep breathing.","good");else{const t=(P.h.x-P.s.x)/(P.a.x-P.s.x),sag=P.h.y>P.s.y+t*(P.a.y-P.s.y);tip(sag?"Hips sagging. Squeeze your core and glutes.":"Hips too high. Lower them in line.","bad");say(sag?"Lift your hips":"Lower your hips")}
    setS(st.sec.toFixed(0),Math.round(l)+"°","","")}
  else{
    const v1=cfg.v(P,Q),a1=cfg.a(P);
    if(st.ph=="ext"){if(v1<cfg.lo){st.ph="flex";st.mn=st.mx=v1;st.ax=a1}}
    else{st.mn=Math.min(st.mn,v1);st.mx=Math.max(st.mx,v1);st.ax=Math.max(st.ax,a1);
      if(v1>cfg.hi){st.ph="ext";st.reps++;const[m,p]=cfg.chk(st.mn,st.mx,st.ax),sc=100-p;st.sc.push(sc);tip(`Rep ${st.reps}: ${m} Score ${sc}`,sc>=85?"good":sc>=65?"warn":"bad");say("Rep "+st.reps+". "+tr(m),1)}}
    setS(st.reps,Math.round(v1)+"°",cfg.lb[2]?Math.round(a1)+"°":"",avg());if(cfg.v==ang&&0)0}
  x.lineWidth=6;x.lineCap="round";x.lineJoin="round";x.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue(badNow?"--bad":"--good");
  x.beginPath();pts.forEach((q,j)=>j?x.lineTo(q.x*c.width,q.y*c.height):x.moveTo(q.x*c.width,q.y*c.height));x.stroke();
}
async function open(name){
  const k=kind(name);if(!k)return;ui();cur=name;cfg=E[k];if(!$("#vlang")){const vc=$("#voice");vc.checked=true;(vc.closest("label")||vc.parentNode).insertAdjacentHTML("afterend",'<select id="vlang" aria-label="Voice language"><option value="en">English voice</option><option value="hi">Hinglish voice</option></select>');const ct=$(".camtools");if(ct){ct.insertAdjacentHTML("beforeend",'<button type="button" class="camb" id="cFit">Fit screen</button>');$("#cFit").onclick=e=>{const f=$(".camwrap").classList.toggle("fit");e.target.textContent=f?"Fill screen":"Fit screen"}}}st={reps:0,ph:"ext",mn:0,mx:0,ax:0,sc:[],sec:0,t:0};
  $("#cTitle").textContent=cfg.n+" posture check";cfg.lb.forEach((l,i)=>$("#cl"+(i+1)).textContent=l);setS("-","-","-","-");
  tip(cfg.stat?"Face the camera for shoulders, or stand side-on for head position. Whole upper body in view.":"Place your phone or laptop 2 metres away. Stand or lie side-on so your whole body is visible.");
  $("#coachDlg").showModal();{const dl=$("#coachDlg");dl.requestFullscreen&&dl.requestFullscreen().catch(()=>{})}
  try{await load();pose=pose||new Pose({locateFile:f=>CDN+f});pose.setOptions({modelComplexity:1,smoothLandmarks:true,minDetectionConfidence:.6,minTrackingConfidence:.6});pose.onResults(frame);
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:720}},audio:false});
    const v=$("#cv");v.srcObject=stream;await v.play();on=true;say("Camera is on. Get ready.",1);
    const loop=async()=>{if(!on)return;if(v.readyState>1)await pose.send({image:v});requestAnimationFrame(loop)};loop()}
  catch(e){tip(e.name=="NotAllowedError"?"Camera permission was denied. Allow it in your browser and try again.":(e.message||"Camera could not start. Use https or localhost."),"bad")}
}
function stop(){on=false;document.fullscreenElement&&document.exitFullscreen().catch(()=>{});stream&&stream.getTracks().forEach(t=>t.stop());stream=null;window.speechSynthesis&&speechSynthesis.cancel();finish()}
window.FSCoach={open,kind};
})();
