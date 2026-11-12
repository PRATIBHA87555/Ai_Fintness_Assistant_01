const $=s=>document.querySelector(s),R=Math.PI/180;
const col=k=>({g:"var(--good)",w:"var(--warn)",b:"var(--bad)"}[k]);
function upd(){
  const d=+$("#depth").value,l=+$("#lean").value;
  const a=(5+d*.3)*R,th=(85-d*.95)*R,p=l*R;
  const A=[150,338],K=[A[0]+85*Math.sin(a),A[1]-85*Math.cos(a)];
  const H=[K[0]-90*Math.cos(th),K[1]-90*Math.sin(th)];
  const S=[H[0]+100*Math.sin(p),H[1]-100*Math.cos(p)];
  const Hd=[S[0]+26*Math.sin(p),S[1]-26*Math.cos(p)];
  const f=n=>n.map(v=>v.toFixed(1)).join(" ");
  const kn=Math.acos(((A[0]-K[0])*(H[0]-K[0])+(A[1]-K[1])*(H[1]-K[1]))/(85*90))/R;
  let dk=d<30?"w":d>90?"w":"g",lk=l>45?"b":l>35?"w":"g";
  $("#shin").setAttribute("d",`M${f(A)}L${f(K)}`);
  $("#thigh").setAttribute("d",`M${f(K)}L${f(H)}`);$("#thigh").style.stroke=col(dk);
  $("#torso").setAttribute("d",`M${f(H)}L${f(S)}`);$("#torso").style.stroke=col(lk);
  $("#arm").setAttribute("d",`M${f(S)}L${S[0]+48} ${S[1]+10}`);
  $("#head").setAttribute("cx",Hd[0]);$("#head").setAttribute("cy",Hd[1]);
  $("#kj").setAttribute("cx",K[0]);$("#kj").setAttribute("cy",K[1]);
  $("#ang").setAttribute("x",K[0]+16);$("#ang").setAttribute("y",K[1]+5);$("#ang").textContent=Math.round(kn)+"°";
  $("#dv").textContent=d+"%";$("#lv").textContent=l+"°";
  const fb=[];
  fb.push(dk=="g"?["g","Depth looks good. Thighs near parallel."]:d<30?["w","Go a little lower for a full squat."]:["w","Very deep. Ease up if your knees feel strain."]);
  fb.push(lk=="g"?["g","Back is upright. Nice and stable."]:lk=="w"?["w","Chest is leaning. Lift it slightly."]:["b","Too much forward lean. Keep your chest up."]);
  $("#fb").innerHTML=fb.map(x=>`<li style="--c:${col(x[0])}">${x[1]}</li>`).join("");
  const sc=100-(dk=="w"?15:0)-(lk=="b"?35:lk=="w"?12:0);
  const pill=$("#pill");pill.textContent=sc;pill.style.background=col(sc>=85?"g":sc>=65?"w":"b");
}
$("#depth").oninput=$("#lean").oninput=upd;upd();

const conds=[["knee","Knee pain"],["back","Lower back pain"],["bp","High BP"],["shoulder","Shoulder injury"],["diabetes","Diabetes"],["dr","Heart or pregnancy"]];
const ex=[["Bodyweight squat",["knee","back"],"Glute bridge"],["Jump lunges",["knee","bp","dr"],"Low step-ups"],["Barbell deadlift",["back","bp","dr"],"Hip hinge with band"],["Overhead press",["bp","shoulder"],"Seated lateral raise"],["Burpees",["knee","bp","dr"],"Brisk walking intervals"],["Plank",[],"Incline plank"]];
const on=new Set();
$("#chips").innerHTML=conds.map(c=>`<button class="chip" aria-pressed="false" data-k="${c[0]}">${c[1]}</button>`).join("");
$("#chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;const k=b.dataset.k;on.has(k)?on.delete(k):on.add(k);b.setAttribute("aria-pressed",on.has(k));draw()};
function draw(){
  $("#plan").innerHTML="<h3>Today’s workout</h3>"+ex.map(e=>{const bad=e[1].some(x=>on.has(x));return `<div class="row"><div>${bad?`<s>${e[0]}</s><br><strong>${e[2]}</strong>`:`<strong>${e[0]}</strong>`}</div><span class="tag ${bad?"sw":""}">${bad?"Swapped":"Safe for you"}</span></div>`}).join("");
  let n="";
  if(on.has("dr"))n=`<div class="note stop">Please get your doctor’s approval first. We keep the plan gentle until then.</div>`;
  else if(on.has("diabetes"))n=`<div class="note">Meals will use low-GI Indian options like dal, roti and sabzi. Check your sugar before hard sessions.</div>`;
  else if(on.size)n=`<div class="note">We swapped ${ex.filter(e=>e[1].some(x=>on.has(x))).length} exercise(s) to protect you.</div>`;
  $("#note").innerHTML=n;
}
draw();

// Last value in each demo = video path, e.g. "videos/squat.mp4". Leave "" to show a placeholder.
const demos=[["Bodyweight squat","Legs and hips",["Feet shoulder-width apart","Push hips back, then down","Keep your chest up and heels flat"],""],["Glute bridge","Knee-friendly",["Lie on your back, knees bent","Press through your heels","Squeeze at the top for 2 seconds"],""],["Plank","Core",["Elbows under shoulders","Body in one straight line","Breathe steadily, do not hold your breath"],""],["Wall angels","Posture fix",["Back and head against the wall","Slide arms up and down slowly","Keep your lower back touching the wall"],""]];
$("#demos").innerHTML=demos.map((d,i)=>`<button class="card demo" data-i="${i}"><div class="poster"><span class="play"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span></div><div class="meta"><h3>${d[0]}</h3><p>${d[1]}</p></div></button>`).join("");
$("#demos").onclick=e=>{const b=e.target.closest(".demo");if(!b)return;const d=demos[b.dataset.i];$("#dt").textContent=d[0];$("#dv2").innerHTML=d[3]?`<video src="${d[3]}" autoplay loop muted playsinline controls style="width:100%;height:100%;border-radius:14px"></video>`:(window.fsAnim?fsAnim(d[0],$("#dv2")):"Demo video coming soon.");$("#ds").innerHTML=d[2].map(s=>`<li>${s}</li>`).join("");$("#dlg").showModal()};
$("#dlg").onclose=()=>{$("#dv2").innerHTML=""};
$("#dc").onclick=()=>$("#dlg").close();
$("#dlg").onclick=e=>{if(e.target.id==="dlg")e.target.close()};
