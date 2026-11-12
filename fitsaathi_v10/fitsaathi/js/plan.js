const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const val=o=>Array.isArray(o)?o[0]:o, lab=o=>Array.isArray(o)?o[1]:o;
const app=document.getElementById("app");

const S=[
{t:"About you",f:[
 {k:"name",l:"Your name",type:"text"},
 {k:"age",l:"Age (years)",type:"num",min:14,max:80},
 {k:"gender",l:"Gender",type:"one",o:["Male","Female","Other"]},
 {k:"height",l:"Height (cm)",type:"num",min:120,max:230},
 {k:"weight",l:"Weight (kg)",type:"num",min:30,max:250}]},
{t:"Your goal",f:[{k:"goal",l:"What do you want most?",type:"one",o:["Lose weight","Build muscle","Stay fit","Fix posture"]}]},
{t:"Your training",f:[
 {k:"level",l:"Experience",type:"one",o:["Beginner","Intermediate"]},
 {k:"days",l:"Workout days per week",type:"one",o:["3","4","5","6"]},
 {k:"mins",l:"Time per session",type:"one",o:["20 min","30 min","45 min","60 min"]},
 {k:"place",l:"Where will you train?",type:"one",o:["Home, no equipment","Home, with dumbbells","Gym"]},
 {k:"activity",l:"Your day outside workouts",type:"one",o:["Mostly sitting","Light movement","On my feet a lot"]}]},
{t:"Your health",f:[
 {k:"cond",l:"Do any of these apply? Pick all that fit.",type:"many",o:[["knee","Knee pain"],["back","Back pain"],["shoulder","Shoulder injury"],["bp","High blood pressure"],["diabetes","Diabetes"],["thyroid","Thyroid"],["asthma","Asthma"],["dr","Heart condition, pregnancy or recent surgery"],["none","None of these"]]},
 {k:"notes",l:"Other injuries or medicines (optional)",type:"text"}]},
{t:"Your food",f:[
 {k:"diet",l:"What do you eat?",type:"one",o:["Vegetarian","Eggetarian","Non-vegetarian","Vegan"]},
 {k:"allergy",l:"Allergies or foods to avoid",type:"many",o:[["l","Milk or lactose"],["g","Gluten"],["n","Nuts"],["x","None"]]}]}
];
let A={},i=0;
try{A=JSON.parse(localStorage.getItem("fs")||"{}")}catch(e){}

function field(f){
  let h=`<div class="fld"><div class="lb" id="l_${f.k}">${f.l}</div>`;
  if(f.type=="text")h+=`<input type="text" id="${f.k}" value="${esc(A[f.k]||"")}" aria-labelledby="l_${f.k}">`;
  else if(f.type=="num")h+=`<input type="number" inputmode="decimal" id="${f.k}" value="${esc(A[f.k]||"")}" aria-labelledby="l_${f.k}">`;
  else h+=`<div class="chips" role="group" aria-labelledby="l_${f.k}">`+f.o.map(o=>{const v=val(o),m=f.type=="many";return `<button type="button" class="chip" data-k="${f.k}" data-v="${v}" data-m="${m?1:0}" aria-pressed="${m?(A[f.k]||[]).includes(v):A[f.k]==v}">${lab(o)}</button>`}).join("")+"</div>";
  return h+"</div>";
}
function step(){
  const s=S[i],p=Math.round(i/S.length*100);
  app.innerHTML=`<div class="bar" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p+8}%"></i></div><p class="sm">Step ${i+1} of ${S.length}</p><h2>${s.t}</h2>${s.f.map(field).join("")}<p class="err" id="err" role="alert"></p><div class="nav2">${i?'<button type="button" class="btn ghost" id="bk">Back</button>':"<span></span>"}<button type="button" class="btn" id="nx">${i==S.length-1?"Make my plan":"Next"}</button></div>`;
  window.scrollTo(0,0);
}
function save(){
  S[i].f.forEach(f=>{if(f.type=="text"||f.type=="num")A[f.k]=$("#"+f.k).value.trim()});
  try{localStorage.setItem("fs",JSON.stringify(A))}catch(e){}
}
function check(){
  for(const f of S[i].f){
    if(f.type=="num"){const v=+A[f.k];if(!(v>=f.min&&v<=f.max))return `${f.l}: enter a number from ${f.min} to ${f.max}.`}
    if(f.type=="one"&&!A[f.k])return `Please choose: ${f.l}`;
    if(f.type=="many"&&!(A[f.k]||[]).length)return "Please pick at least one option.";
  }
  return "";
}

/* ---------- plan engine ---------- */
const POOL=[
["Bodyweight squat","legs",0,["knee","back"]],["Glute bridge","legs",0,[]],["Reverse lunge","legs",0,["knee"]],["Step-ups on a sturdy step","legs",0,["knee"]],
["Goblet squat","legs",1,["knee","back"]],["Dumbbell Romanian deadlift","legs",1,["back","bp"]],["Leg press","legs",2,["knee"]],["Hamstring curl machine","legs",2,[]],
["Incline push-ups (hands on a table)","push",0,["shoulder"]],["Chair triceps dips","push",0,["shoulder"]],["Dumbbell chest press","push",1,["shoulder"]],["Dumbbell lateral raise","push",1,["shoulder"]],["Dumbbell shoulder press","push",1,["bp","shoulder"]],["Chest press machine","push",2,["shoulder"]],
["Wall angels","pull",0,[]],["Superman hold","pull",0,["back"],"3 x 20 sec"],["One-arm dumbbell row","pull",1,["back"]],["Dumbbell rear-delt fly","pull",1,["shoulder"]],["Lat pulldown","pull",2,["shoulder"]],["Seated cable row","pull",2,["back"]],
["Dead bug","core",0,[]],["Bird dog","core",0,[]],["Plank","core",0,[],"3 x 30 sec"],["Mountain climbers","core",0,["knee","bp","shoulder"],"3 x 20 sec"]
];
const F={n:"Full body A",g:["legs","push","pull","core","legs"]},F2={n:"Full body B",g:["legs","pull","push","core","legs"]},
U={n:"Upper body",g:["push","pull","push","pull","core"]},L={n:"Lower body and core",g:["legs","legs","legs","legs","core"]},
PS={n:"Push",g:["push","push","push","core","push"]},PL={n:"Pull and core",g:["pull","pull","pull","core","pull"]};
const TPL={3:[F,F2,F],4:[U,L,U,L],5:[PS,PL,L,U,L],6:[PS,PL,L,PS,PL,L]};
const DAYS={3:["Mon","Wed","Fri"],4:["Mon","Tue","Thu","Fri"],5:["Mon","Tue","Wed","Fri","Sat"],6:["Mon","Tue","Wed","Thu","Fri","Sat"]};
const MEALS=[
["Breakfast","Vegetable poha with peanuts",0,"nh"],["Breakfast","Moong dal chilla with mint chutney",0,""],["Breakfast","Idli with sambar (3 to 4 idli)",0,""],["Breakfast","Paneer paratha (whole wheat) with curd",1,"lg"],["Breakfast","2-egg bhurji with 2 multigrain roti",2,"g"],
["Mid-morning","Sprouts salad with lemon",0,""],["Mid-morning","Apple or papaya bowl",0,""],["Mid-morning","Handful of almonds and walnuts",0,"n"],["Mid-morning","Roasted chana with buttermilk",1,"l"],["Mid-morning","2 boiled eggs",2,""],
["Lunch","Rajma or chole, 1 cup brown rice, salad",0,""],["Lunch","Soya chunk curry, 2 roti, salad",0,"g"],["Lunch","2 roti, dal, sabzi, salad, curd",1,"gl"],["Lunch","Paneer bhurji, 2 roti, salad",1,"gl"],["Lunch","Egg curry, 2 roti, salad",2,"g"],["Lunch","Light chicken curry, 2 roti, salad",3,"g"],["Lunch","Fish curry, rice, sauteed veggies",3,""],
["Evening snack","Roasted makhana with green tea",0,""],["Evening snack","Chana chaat",0,""],["Evening snack","Sattu drink (no sugar)",0,""],
["Dinner","Dal, lauki or tori sabzi, 1 to 2 roti",0,"g"],["Dinner","Tofu stir-fry with brown rice",0,""],["Dinner","Vegetable soup with moong cheela",0,""],["Dinner","Grilled paneer tikka with sauteed veggies",1,"l"],["Dinner","Egg-white omelette with salad",2,""],["Dinner","Grilled chicken with veggies",3,""],["Dinner","Fish tikka with salad",3,""]
];
const SHARE={"Breakfast":.25,"Mid-morning":.1,"Lunch":.3,"Evening snack":.1,"Dinner":.25};
const NOTES={knee:"Knee-friendly: no jumping or deep lunges in your plan.",back:"Back-friendly: no heavy hinging or loaded twists. Stop and rest if pain spreads down a leg.",shoulder:"Shoulder-friendly: no overhead pressing or deep dips.",bp:"Blood pressure: breathe out on effort, never hold your breath, skip heavy overhead lifts, keep salt low and check your BP regularly.",diabetes:"Diabetes: high-GI foods are left out. Eat at regular times, check sugar before and after hard sessions and keep a quick sugar source with you.",thyroid:"Thyroid: keep meal and sleep timing steady and avoid crash dieting.",asthma:"Asthma: keep your inhaler nearby, warm up longer and avoid hard cardio in cold or dusty air.",dr:"Please get your doctor’s approval before exercising. Until then your plan is limited to easy walking and stretching."};

function build(A){
  const C=new Set(A.cond||[]),w=+A.weight,h=+A.height,a=+A.age,beg=A.level=="Beginner",goal=A.goal,bmi=w/((h/100)**2);
  const bmr=10*w+6.25*h-5*a+(A.gender=="Male"?5:A.gender=="Female"?-161:-78);
  const act={"Mostly sitting":1.2,"Light movement":1.375,"On my feet a lot":1.55}[A.activity]||1.2;
  let kcal=bmr*act+(+A.days)*40+(bmi<18.5?300:goal=="Lose weight"?-450:goal=="Build muscle"?300:0);
  kcal=Math.round(Math.max(kcal,A.gender=="Male"?1500:1200)/10)*10;
  const pro=Math.round(w*(goal=="Stay fit"||goal=="Fix posture"?1.2:1.6)),fat=Math.round(kcal*.25/9),carb=Math.round((kcal-pro*4-fat*9)/4);
  const cat=bmi<18.5?"Underweight":bmi<23?"Healthy range":bmi<25?"Overweight":"Obese",lo=Math.ceil(18.5*(h/100)**2),hi=Math.floor(22.9*(h/100)**2),d=Math.round(bmi<18.5?lo-w:bmi>=23?w-hi:0),
  ws={cat,lo,hi,d,msg:{"Underweight":`You are underweight. Gaining about ${d} kg slowly (0.25 to 0.5 kg a week) with extra calories, protein and strength training will help. Your calories are set a little above maintenance.`,"Healthy range":`Good news: your weight is in the healthy range (${lo} to ${hi} kg for your height). Keep your habits steady.`,"Overweight":`You are in the overweight range. Losing about ${d} kg at 0.25 to 0.5 kg a week would bring you to a healthy weight (${lo} to ${hi} kg).`,"Obese":`You are in the obese range. Aim to lose about ${d} kg slowly, 0.5 kg a week at most, and check blood sugar, BP and cholesterol with your doctor.`}[cat]};
  const dr=C.has("dr"),loc=["Home, no equipment","Home, with dumbbells","Gym"].indexOf(A.place),n={"20 min":3,"30 min":4,"45 min":5,"60 min":6}[A.mins]||4;
  const safe=POOL.filter(e=>e[2]<=loc&&!e[3].some(c=>C.has(c)));
  const rx=goal=="Build muscle"?(beg?"3 x 10–12":"4 x 8–10"):goal=="Lose weight"?(beg?"2 x 15":"3 x 15"):(beg?"2 x 12":"3 x 12");
  const days=+A.days;let wk=[];
  if(dr)wk=[{d:"Daily",n:"Gentle plan until your doctor approves",x:[["Easy walk","15 to 20 min"],["Neck and shoulder stretches","5 min"],["Deep breathing","5 min"]]}];
  else wk=TPL[days].map((t,j)=>{const used=new Set(),x=[];
    for(let q=0;q<n;q++){const g=t.g[q%t.g.length],l=safe.filter(e=>e[1]==g&&!used.has(e[0]));if(!l.length)continue;const e=l[(j+q)%l.length];used.add(e[0]);x.push([e[0],e[4]||rx])}
    if(goal=="Lose weight")x.push(["Brisk walk or cycling finisher","10 min"]);
    if(goal=="Fix posture"||A.activity=="Mostly sitting")x.push(["Posture reset: chin tucks, wall angels, hip flexor stretch","5 min"]);
    return {d:DAYS[days][j],n:t.n,x:[["Warm-up: marching, arm and hip circles","5 min"],...x,["Cool-down stretching","5 min"]]}});
  const lv={"Vegan":0,"Vegetarian":1,"Eggetarian":2,"Non-vegetarian":3}[A.diet],al=A.allergy||[];
  const ok=m=>m[2]<=lv&&![...m[3]].some(f=>al.includes(f)||(f=="h"&&C.has("diabetes")));
  const meals=Object.keys(SHARE).map(s=>{const o=MEALS.filter(m=>m[0]==s&&ok(m)).slice(0,/snack|Mid/.test(s)?2:3).map(m=>m[1]);return {s,k:Math.round(kcal*SHARE[s]/10)*10,o}});
  const notes=[...C].filter(c=>NOTES[c]).map(c=>NOTES[c]);
  if(A.notes)notes.push("You also mentioned: "+esc(A.notes)+". Please check these with your doctor.");
  return {kcal,pro,fat,carb,bmi:bmi.toFixed(1),cat,ws,wk,meals,notes,dr};
}
function result(){
  const r=build(A);
  try{localStorage.setItem("fs_plan",JSON.stringify({kcal:r.kcal,pro:r.pro,carb:r.carb,fat:r.fat,bmi:r.bmi,ws:r.ws,wk:r.wk.map(d=>({d:d.d,n:d.n,x:d.x.map(e=>e[0])}))}))}catch(e){}
  const tabs=r.wk.map((d,j)=>`<button type="button" class="chip" data-day="${j}" aria-pressed="${j==0}">${d.d}</button>`).join("");
  app.innerHTML=`<div class="res"><h2>${esc(A.name||"Your")}${A.name?"’s":""} plan is ready</h2><p class="lead" style="margin-top:8px">Built for your goal: ${A.goal.toLowerCase()}. ${A.diet}, ${A.days} days a week.</p>
  ${r.dr?`<div class="note stop">${NOTES.dr}</div>`:""}
  <div class="stats"><div class="stat"><b>${r.kcal}</b>calories a day</div><div class="stat"><b>${r.pro} g</b>protein</div><div class="stat"><b>${r.carb} g</b>carbs</div><div class="stat"><b>${r.fat} g</b>fats</div><div class="stat"><b>${r.bmi}</b>BMI, ${r.cat}</div></div>
  <div class="note"><strong>Weight status: ${r.cat} (BMI ${r.bmi})</strong><br>${r.ws.msg}<br><small>Asian BMI ranges used. BMI can mislead if you have a lot of muscle.</small></div>
  ${r.notes.length&&!r.dr?`<h3>Health notes</h3>${r.notes.map(n=>`<div class="note">${n}</div>`).join("")}`:""}
  <h3>Workout plan</h3><div class="chips" role="group" aria-label="Choose a day">${tabs}</div><div id="day"></div>
  <h3>Meal plan</h3><p class="lead" style="font-size:.95rem">Pick one option per meal. Portion size should match the calories shown.</p>
  ${r.meals.map(m=>`<div class="meal"><strong>${m.s}</strong> <span class="tag">about ${m.k} kcal</span><ul>${m.o.map(x=>`<li>${x}</li>`).join("")}</ul></div>`).join("")}
  <p class="lead" style="font-size:.9rem;margin-top:14px">Drink 2.5 to 3 litres of water a day. BMI is only a rough guide.</p>
  <div class="acts"><button type="button" class="btn" id="pr">Print or save as PDF</button><button type="button" class="btn ghost" id="ed">Change my answers</button></div></div>`;
  const show=j=>{app._j=j;const d=r.wk[j],T=window.FSTrack;$("#day").innerHTML=`<p style="margin:14px 0 4px"><strong>${d.n}</strong></p>`+d.x.map(e=>{const dn=T&&T.has(e[0]);return `<div class="ex"><div>${e[0]}<div class="exb"><button type="button" class="camb" data-vid="${esc(e[0])}">▶ Video</button><button type="button" class="camb" data-cam="${esc(e[0])}">📷 Camera</button>${T?`<button type="button" class="camb done" data-done="${esc(e[0])}" data-rx="${esc(e[1])}" aria-pressed="${dn}">${dn?"✓ Done":"Mark done"}</button>`:""}</div></div><span>${e[1]}${T?`<small class="kc">about ${T.kcal(e[0],e[1])} kcal</small>`:""}</span></div>`}).join("")+`<div class="note" id="daySum"></div>`;if(T)T.sum("#daySum")};
  show(0);app._show=show;window.scrollTo(0,0);
}
document.addEventListener("fs-log",()=>{if(app._show)app._show(app._j||0)});
app.onclick=e=>{
  const db=e.target.closest("[data-done]");if(db&&window.FSTrack){FSTrack.toggle(db.dataset.done,db.dataset.rx);const on=FSTrack.has(db.dataset.done);db.setAttribute("aria-pressed",on);db.textContent=on?"✓ Done":"Mark done";FSTrack.sum("#daySum");return}
  const vb=e.target.closest("[data-vid]");if(vb&&window.FSDemo){FSDemo.open(vb.dataset.vid);return}
  const cb=e.target.closest("[data-cam]");if(cb&&window.FSCoach){FSCoach.open(cb.dataset.cam);return}
  const c=e.target.closest(".chip");
  if(c){
    if(c.dataset.day!==undefined){app.querySelectorAll("[data-day]").forEach(b=>b.setAttribute("aria-pressed",b===c));app._show(+c.dataset.day);return}
    const k=c.dataset.k,v=c.dataset.v;
    if(c.dataset.m=="1"){let a=A[k]||[];const ex=v=="none"||v=="x";a=a.includes(v)?a.filter(x=>x!=v):(ex?[v]:[...a.filter(x=>x!="none"&&x!="x"),v]);A[k]=a}else A[k]=v;
    save();const t=window.scrollY;step();window.scrollTo(0,t);return;
  }
  if(e.target.id=="nx"){save();const m=check();if(m){$("#err").textContent=m;return}i<S.length-1?(i++,step()):result()}
  if(e.target.id=="bk"){save();i--;step()}
  if(e.target.id=="pr")window.print();
  if(e.target.id=="ed"){i=0;step()}
};
if(typeof module!=="undefined")module.exports={build};
step();
