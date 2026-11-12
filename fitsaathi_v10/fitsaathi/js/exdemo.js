/* Demo for EVERY exercise. FSDemo.open("Plank") plays videos/<exercise-name>.mp4 if you added it, otherwise an animated demo. */
(()=>{
const q=s=>document.querySelector(s);
const NAMES=["Bodyweight squat","Goblet squat","Glute bridge","Reverse lunge","Step-ups on a sturdy step","Leg press","Hamstring curl machine","Dumbbell Romanian deadlift","Incline push-ups (hands on a table)","Chair triceps dips","Dumbbell chest press","Dumbbell lateral raise","Dumbbell shoulder press","Chest press machine","Wall angels","Superman hold","One-arm dumbbell row","Dumbbell rear-delt fly","Lat pulldown","Seated cable row","Dead bug","Bird dog","Plank","Mountain climbers","Warm-up: marching, arm and hip circles","Cool-down stretching","Brisk walk or cycling finisher"];
const S=h=>[[150,12],[150,30],[150,80],[150,125],[150,170],h];
const PL=[[48,114],[70,120],[150,138],[200,152],[250,166],[70,166]],RO=[[183,75],[160,80],[110,85],[135,125],[150,170],[162,125]];
const R=h=>RO.map((p,i)=>i==5?h:p);
// pose = [head, shoulder, hip, knee, ankle, hand]; animation goes pose A -> B -> A
const T={
sq:[S([175,40]),[[160,62],[155,80],[125,128],[185,128],[150,170],[190,82]]],
lu:[S([160,80]),[[150,50],[150,68],[150,112],[190,132],[185,170],[160,100]]],
br:[[[40,160],[70,160],[130,160],[175,115],[205,160],[100,162]],[[40,160],[70,158],[130,122],[175,110],[205,160],[100,162]]],
pl:[PL,[[48,112],[70,118],[150,135],[200,151],[250,166],[70,166]]],
pu:[PL,[[48,140],[70,146],[150,150],[200,158],[250,166],[70,166]]],
an:[S([168,72]),S([168,-8])],
hi:[S([155,78]),[[178,82],[155,85],[105,88],[135,125],[150,170],[160,125]]],
ro:[RO,R([140,92])],rf:[RO,R([160,84])],
pr:[S([165,40]),S([215,36])],oh:[S([165,35]),S([158,-8])],lt:[S([152,82]),S([198,34])],la:[S([152,-8]),S([162,48])],
di:[[[130,52],[130,70],[130,120],[175,124],[200,168],[120,125]],[[130,77],[130,95],[130,145],[175,148],[200,168],[120,125]]],
de:[[[40,160],[70,160],[130,160],[170,115],[215,115],[70,105]],[[40,160],[70,160],[130,160],[185,150],[235,158],[35,150]]],
bd:[[[60,92],[80,100],[170,100],[170,150],[140,166],[80,160]],[[60,92],[80,100],[170,100],[215,98],[262,98],[30,96]]],
su:[[[50,160],[75,160],[150,160],[200,160],[250,160],[40,160]],[[45,140],[75,150],[150,160],[200,150],[250,138],[35,138]]],
mc:[PL,[[48,114],[70,120],[150,138],[135,150],[175,160],[70,166]]],
lp:[[[40,125],[60,135],[100,150],[120,108],[140,150],[90,140]],[[40,125],[60,135],[100,150],[145,125],[190,115],[90,140]]],
hc:[[[52,152],[75,158],[150,160],[200,160],[250,160],[60,160]],[[52,152],[75,158],[150,160],[200,160],[200,115],[60,160]]],
ma:[S([165,60]),[[150,12],[150,30],[150,80],[185,105],[185,150],[140,60]]],
st:[S([168,70]),S([152,-8])]};
const C={
sq:[["Feet shoulder-width apart","Push hips back, then bend your knees","Chest up, heels flat, push the floor away to stand"],"knees caving in, heels lifting, rounded back."],
lu:[["Stand tall, step with control","Lower until the front knee is near 90 degrees","Knee over ankle, torso upright, push through the front heel"],"front knee drifting inward, leaning forward."],
br:[["Lie on your back, knees bent","Press through your heels and lift your hips","Squeeze at the top for 2 seconds"],"arching the lower back, pushing through toes."],
pl:[["Elbows under shoulders","Body in one straight line","Breathe steadily, do not hold your breath"],"hips sagging or piking, holding your breath."],
pu:[["Hands under shoulders, body in a straight line","Lower your chest, elbows about 45 degrees from the body","Press back up without sagging your hips"],"hips sagging, elbows flaring wide."],
an:[["Back and head against the wall","Slide arms up and down slowly","Keep your lower back touching the wall"],"lower back lifting off the wall, shrugging shoulders."],
hi:[["Soft knees, feet hip-width apart","Push hips back with a flat back","Squeeze glutes to stand tall"],"rounding the back, squatting instead of hinging."],
ro:[["Hinge forward with a flat back","Pull the elbow toward your hip","Squeeze the shoulder blade, lower slowly"],"rounding the back, jerking the weight."],
rf:[["Hinge forward, soft elbows","Open your arms out to the sides","Squeeze the shoulder blades together"],"shrugging, using too much weight."],
pr:[["Weights at chest level","Press forward until arms are straight","Lower slowly, do not lock your elbows"],"flared elbows, arching the back."],
oh:[["Weights at shoulder height","Press straight overhead, ribs down","Lower slowly with control"],"arching the lower back, shrugging."],
lt:[["Slight bend in the elbows","Raise arms out to shoulder height","Lower slowly, do not swing"],"swinging the body, shrugging."],
la:[["Sit tall, grip slightly wider than shoulders","Pull the bar to your upper chest","Squeeze shoulder blades, return slowly"],"leaning far back, pulling behind the neck."],
di:[["Hands on the chair edge, hips close to it","Bend elbows to about 90 degrees","Press up, keep shoulders down"],"hunched shoulders, hips drifting far from the chair."],
de:[["Lie on your back, arms up, knees at 90 degrees","Lower the opposite arm and leg slowly","Keep your lower back pressed to the floor"],"arching the lower back, moving too fast."],
bd:[["Hands under shoulders, knees under hips","Extend the opposite arm and leg","Hold 2 seconds, keep hips level"],"twisting the hips, arching the back."],
su:[["Lie face down, arms forward","Lift arms, chest and legs slightly","Hold 2 seconds, keep your neck neutral"],"lifting too high, straining the neck."],
mc:[["Start in a strong plank","Drive knees toward your chest, one at a time","Keep hips low and keep breathing"],"hips piking up, bouncing."],
lp:[["Feet shoulder-width on the platform","Lower until knees are about 90 degrees","Press up without locking your knees"],"lifting hips off the seat, locking knees."],
hc:[["Lie face down, legs straight","Curl your heels toward your hips","Lower slowly, keep hips down"],"lifting hips, rushing the rep."],
ma:[["Stand tall, shoulders relaxed","Lift your knees and swing your arms","Keep a steady, comfortable pace"],"hunching, going too fast."],
st:[["Stand tall and breathe slowly","Reach or stretch gently, no bouncing","Hold 20 to 30 seconds, breathe out as you ease deeper"],"bouncing, holding your breath."]};
const tk=n=>(([[/mountain/i,"mc"],[/dead bug/i,"de"],[/bird dog/i,"bd"],[/superman/i,"su"],[/jump lunge|burpee/i,"sq"],[/squat/i,"sq"],[/lunge|step-up/i,"lu"],[/push-up/i,"pu"],[/bridge/i,"br"],[/plank/i,"pl"],[/wall angel|posture|chin/i,"an"],[/rear-delt/i,"rf"],[/deadlift|hinge/i,"hi"],[/leg press/i,"lp"],[/hamstring/i,"hc"],[/pulldown/i,"la"],[/row/i,"ro"],[/dip/i,"di"],[/lateral/i,"lt"],[/shoulder press|overhead/i,"oh"],[/press/i,"pr"],[/warm|walk|cycling|march/i,"ma"]].find(r=>r[0].test(n))||[])[1]||"st");
const slug=n=>n.toLowerCase().replace(/\(.*?\)/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function anim(box,k){
  const [A,B]=T[k];
  box.innerHTML=`<svg viewBox="0 -15 300 200" style="width:100%;height:100%"><line x1="10" y1="176" x2="290" y2="176" stroke="var(--line)" stroke-width="4"/><path fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path fill="none" stroke="var(--brand)" stroke-width="7" stroke-linecap="round"/><circle r="14" fill="var(--ink)"/></svg>`;
  const s=box.firstChild,[a,b]=s.querySelectorAll("path"),h=s.querySelector("circle"),t0=performance.now();
  (function f(t){if(!s.isConnected)return;const p=(1-Math.cos((t-t0)/500))/2,Q=A.map((u,i)=>[u[0]+(B[i][0]-u[0])*p,u[1]+(B[i][1]-u[1])*p]);
    a.setAttribute("d",`M${Q[4]}L${Q[3]}L${Q[2]}L${Q[1]}`);b.setAttribute("d",`M${Q[1]}L${Q[5]}`);h.setAttribute("cx",Q[0][0]);h.setAttribute("cy",Q[0][1]);requestAnimationFrame(f)})(t0);
}
function ui(){if(q("#demoDlg"))return;
  document.body.insertAdjacentHTML("beforeend",`<dialog id="demoDlg"><div class="aiH"><strong id="xT"></strong><button id="xX" type="button" aria-label="Close">×</button></div><div class="vid" id="xV"></div><p class="xm" id="xM"></p><ol id="xC"></ol><div class="exb"><a class="camb" id="xY" target="_blank" rel="noopener">▶ Watch on YouTube</a><button type="button" class="camb" id="xCam">📷 Try with camera</button></div></dialog>`);
  const d=q("#demoDlg");q("#xX").onclick=()=>d.close();d.onclose=()=>{q("#xV").innerHTML=""};d.onclick=e=>{if(e.target===d)d.close()}}
function open(name){
  ui();const k=tk(name),box=q("#xV"),v=document.createElement("video");
  q("#xT").textContent=name;q("#xC").innerHTML=C[k][0].map(x=>`<li>${x}</li>`).join("");q("#xM").textContent="Common mistakes: "+C[k][1];
  q("#xY").href="https://www.youtube.com/results?search_query="+encodeURIComponent(name.replace(/\(.*?\)/g,"")+" exercise proper form");
  q("#xCam").onclick=()=>{q("#demoDlg").close();window.FSCoach&&FSCoach.open(name)};
  v.src="videos/"+slug(name)+".mp4";v.autoplay=v.loop=v.muted=v.controls=true;v.playsInline=true;
  v.onerror=()=>{if(v.isConnected)anim(box,k)};
  const m=String((window.FS_YT||{})[name]||"").match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})|^([\w-]{11})$/),id=m&&(m[1]||m[2]);
  box.innerHTML="";
  if(id)box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1" title="${name}" allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowfullscreen loading="lazy"></iframe>`;else box.append(v);q("#demoDlg").showModal();
}
window.FSDemo={open,names:NAMES,slug,tk};
const g=q("#demos");
if(g){g.innerHTML=NAMES.map(n=>`<button class="card demo" data-n="${n}"><div class="poster"><span class="play"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span></div><div class="meta"><h3>${n}</h3><p>Video + camera</p></div></button>`).join("");
  g.onclick=e=>{const b=e.target.closest(".demo");if(b)open(b.dataset.n)}}
})();
