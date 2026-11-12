/* FitSaathi assistant: works offline from your saved profile. Set window.FS_AI_URL to use a real LLM backend. */
(()=>{
let A={};try{A=JSON.parse(localStorage.getItem("fs")||"{}")}catch(e){}
let P=null;try{P=JSON.parse(localStorage.getItem("fs_plan")||"null")}catch(e){}
const w=+A.weight||0,C=A.cond||[],nm=A.name?A.name+", ":"";
const hiRe=/[\u0900-\u097F]|\b(kya|kaise|kaisa|mujhe|mera|meri|hai|hoga|karu|karna|dard|khana|kitna|kitni|vajan|wazan|patla|moti|chahiye|batao|bataiye)\b/i;
const pro=P?`${P.pro} g a day (your plan target)`:w?`about ${Math.round(w*1.2)} to ${Math.round(w*1.6)} g a day`:"about 1.2 to 1.6 g per kg of body weight";
const proH=P?`roz ${P.pro} gram (aapke plan ka target)`:w?`roz lagbhag ${Math.round(w*1.2)} se ${Math.round(w*1.6)} gram`:"body weight ke hisaab se 1.2 se 1.6 gram per kg";
const tn=new Date().toLocaleDateString("en-US",{weekday:"short"}),W=P?P.wk:[],td=W.find(x=>x.d==tn)||W.find(x=>x.d=="Daily"),nx=W[0],NP="Please build your plan first (tap Build my plan) so I can answer from your own data.",NPh="Pehle apna plan banayein (Build my plan) taaki main aapke apne data se jawab de sakoon.";
const tw=P?(td?`Today (${td.d}) is ${td.n}: ${td.x.filter(e=>!/Warm|Cool/.test(e)).slice(0,6).join(", ")}.`:`Today is a rest day. Your next session is ${nx.d}: ${nx.n}.`):NP,twh=P?(td?`Aaj (${td.d}) ${td.n} hai: ${td.x.filter(e=>!/Warm|Cool/.test(e)).slice(0,6).join(", ")}.`:`Aaj rest day hai. Agla session ${nx.d} ko hai: ${nx.n}.`):NPh;
const KB=[
[/chest pain|seene|dizz|chakkar|faint|behosh|saans|breathless|heart/i,"Please stop exercising and see a doctor now. Chest pain, dizziness or breathlessness should not be ignored.","Kripya exercise rok dijiye aur abhi doctor se milein. Seene mein dard, chakkar ya saans phoolna ignore nahi karna chahiye."],
[/bmi|overweight|underweight|obese|weight status|mota|patla|healthy weight|weight kaisa/i,P?`${nm}your BMI is ${P.bmi} (${P.ws.cat}). ${P.ws.msg}`:NP,P?`${nm}aapka BMI ${P.bmi} hai (${P.ws.cat}). Healthy weight aapki height ke liye ${P.ws.lo} se ${P.ws.hi} kg hai, ${P.ws.d?`aur ${P.ws.d} kg badlav ka target hai. `:"aap sahi range mein hain. "}Dhire dhire badlav karein.`:NPh],
[/calorie|kcal|macro|carb|fat\b/i,P?`Your daily target: ${P.kcal} kcal, ${P.pro} g protein, ${P.carb} g carbs, ${P.fat} g fat.`:NP,P?`Aapka roz ka target: ${P.kcal} kcal, ${P.pro} g protein, ${P.carb} g carbs, ${P.fat} g fat.`:NPh],
[/today|aaj|workout|exercise|plan|schedule|kasrat/i,tw,twh],
[/protein/i,`Protein target for you: ${pro}. Good Indian sources: dal, paneer, curd, soya chunks, sprouts, eggs, chicken or fish.`,`Aapka protein target: ${proH}. Achhe sources: dal, paneer, dahi, soya chunks, sprouts, ande, chicken ya machhli.`],
[/water|paani|pani/i,"Aim for 2.5 to 3 litres a day. Drink more on workout days and in summer.","Din mein 2.5 se 3 litre paani piyein. Workout wale din aur garmi mein aur zyada."],
[/knee|ghutn/i,"For knee pain: avoid jumping and deep lunges. Try glute bridges, step-ups and wall sits. If pain is sharp or swelling appears, see a doctor.","Ghutne ke dard mein jump aur deep lunges avoid karein. Glute bridge, step-ups aur wall sit karein. Tez dard ya sujan ho to doctor ko dikhayein."],
[/back|kamar|spine/i,"For back pain: skip heavy hinging and twists. Try bird dog, dead bug and glute bridge. Pain going down a leg means stop and see a doctor.","Kamar dard mein heavy hinge aur twist na karein. Bird dog, dead bug aur glute bridge karein. Dard pair tak jaye to rukein aur doctor se milein."],
[/squat/i,"Squat cues: feet shoulder-width, hips back then down, chest up, heels flat, knees follow toes. Use the camera coach above to check yourself.","Squat tips: pair kandhe jitne door, pehle hips peeche phir neeche, chhati upar, edi zameen par. Upar camera coach se check karein."],
[/lose|fat|weight loss|patla|vajan kam|motapa|belly|pet/i,"Fat loss: a small calorie deficit (about 300 to 450 kcal), enough protein, 7 to 8k steps or more daily and strength training 3 to 4 days. Aim for 0.25 to 0.5 kg loss per week.","Fat loss ke liye: halka calorie deficit (300 se 450 kcal), protein, roz 7 se 8 hazaar steps aur hafte mein 3 se 4 din strength training. Hafte mein 0.25 se 0.5 kg kam karna theek hai."],
[/muscle|bulk|gain|moti|mass/i,"Muscle gain: eat slightly above maintenance, get enough protein, increase weights or reps slowly and sleep 7 to 8 hours.","Muscle gain ke liye: maintenance se thoda zyada khayein, protein lein, weight ya reps dheere badhayein aur 7 se 8 ghante soyein."],
[/posture|desk|neck|gardan|sitting|baith/i,"For desk posture: every 45 minutes stand up, do chin tucks and wall angels, and raise your screen to eye level. Hip flexor stretches help too.","Desk posture ke liye: har 45 minute mein uthein, chin tucks aur wall angels karein, screen aankh ke level par rakhein. Hip flexor stretch bhi karein."],
[/sore|dukh|body pain|dard.*workout/i,"Mild soreness for 1 to 2 days is normal. Walk, stretch, drink water and sleep well. Sharp or joint pain is not normal, so stop.","1 se 2 din halka dukhna normal hai. Walk, stretching, paani aur neend lein. Tez ya jodon ka dard normal nahi hai, rukein."],
[/diet|meal|khana|food|eat/i,`${A.diet?`Your plan uses ${A.diet} Indian meals. `:""}Build each plate with protein, a roti or rice portion, sabzi and salad. Open "Build my plan" for exact options.`,`${A.diet?`Aapka plan ${A.diet} Indian khane par hai. `:""}Har plate mein protein, roti ya chawal, sabzi aur salad rakhein. Exact options ke liye "Build my plan" kholein.`],
[/hi\b|hello|namaste|hey/i,`Hi ${A.name||""}! I'm FitSaathi. Ask me about workouts, food, posture, pain or your plan.`,`Namaste ${A.name||""}! Main FitSaathi hoon. Workout, khana, posture, dard ya plan ke baare mein poochhein.`]
];
const safety={en:C.some(c=>c!="none")?"Note: you listed health conditions, so please confirm with your doctor.":"",hi:C.some(c=>c!="none")?"Dhyan rahe: aapne health conditions bataayi hain, doctor se zaroor poochhein.":""};
const hist=[];
const ctx=()=>{let L={};try{L=JSON.parse(localStorage.getItem("fs_log")||"{}")}catch(e){}return {goal:A.goal,level:A.level,age:A.age,gender:A.gender,height:A.height,weight:A.weight,daysPerWeek:A.days,place:A.place,activity:A.activity,conditions:C,diet:A.diet,plan:P?{kcal:P.kcal,protein:P.pro,week:P.wk}:null,recentWorkouts:Object.keys(L).sort().slice(-7).map(k=>({date:k,done:Object.keys(L[k].x),kcal:Object.values(L[k].x).reduce((a,b)=>a+b,0)}))}};
async function reply(q){
  const hi=hiRe.test(q);
  try{const c=new AbortController(),t=setTimeout(()=>c.abort(),25000);const r=await fetch(window.FS_AI_URL||"/.netlify/functions/coach",{method:"POST",headers:{"Content-Type":"application/json"},signal:c.signal,body:JSON.stringify({message:q,history:hist.slice(-8),profile:ctx()})});clearTimeout(t);if(r.ok){const j=await r.json();if(j.reply){hist.push({role:"user",content:q},{role:"assistant",content:j.reply});return j.reply}}}catch(e){}
  const k=KB.find(x=>x[0].test(q));
  if(!k)return hi?`${nm}main workout, khana, protein, paani, posture aur dard ke sawaalon mein madad kar sakta hoon. Thoda aur detail mein poochhein.`:`${nm}I can help with workouts, food, protein, water, posture and pain. Could you ask in a bit more detail?`;
  return (hi?k[2]:k[1])+(k[0].source.startsWith("chest")?"":" "+(hi?safety.hi:safety.en));
}
document.body.insertAdjacentHTML("beforeend",`<button id="aiB" class="aiB" aria-label="Open FitSaathi assistant" type="button">Ask AI</button><div id="aiP" class="aiP" hidden role="dialog" aria-label="FitSaathi assistant"><div class="aiH"><strong>FitSaathi Assistant</strong><button id="aiX" type="button" aria-label="Close">×</button></div><div id="aiM" class="aiM" aria-live="polite"></div><div class="aiQ" id="aiQ"></div><form id="aiF"><input id="aiI" type="text" placeholder="Ask in English or Hinglish" autocomplete="off"><button class="btn" type="submit">Send</button></form></div>`);
const $=s=>document.querySelector(s),M=$("#aiM");
const add=(t,c)=>{const d=document.createElement("div");d.className="aiMsg "+c;d.textContent=t;M.appendChild(d);M.scrollTop=M.scrollHeight};
$("#aiQ").innerHTML=["How much protein?","Knee pain kya karu?","Desk posture tips","Fat loss kaise karu?"].map(q=>`<button type="button" class="chip">${q}</button>`).join("");
async function ask(q){if(!q.trim())return;add(q,"u");add("...","b");const r=await reply(q);M.lastChild.textContent=r}
$("#aiB").onclick=()=>{$("#aiP").hidden=false;if(!M.children.length)add(`Hi ${A.name||"there"}! Ask me anything about your workout, food or posture. You can write in Hinglish too. I am an AI coach, not a doctor. Please do not share private medical details.`,"b");$("#aiI").focus()};
$("#aiX").onclick=()=>$("#aiP").hidden=true;
$("#aiQ").onclick=e=>{if(e.target.classList.contains("chip"))ask(e.target.textContent)};
$("#aiF").onsubmit=e=>{e.preventDefault();const i=$("#aiI");ask(i.value);i.value=""};
})();
