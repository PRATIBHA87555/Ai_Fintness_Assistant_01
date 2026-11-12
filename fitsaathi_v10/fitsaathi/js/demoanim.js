/* Animated side-view demos, so every exercise has a demo even without MP4 videos.
   Pose = [head, shoulder, hip, knee, ankle, hand]. Animation goes pose A -> B -> A. */
const FS_ANIM={
"Bodyweight squat":[[[150,12],[150,30],[150,80],[150,125],[150,170],[175,40]],[[160,62],[155,80],[125,128],[185,128],[150,170],[190,82]]],
"Glute bridge":[[[40,160],[70,160],[130,160],[175,115],[205,160],[100,162]],[[40,160],[70,158],[130,122],[175,110],[205,160],[100,162]]],
"Plank":[[[48,114],[70,120],[150,138],[200,152],[250,166],[70,166]],[[48,112],[70,118],[150,135],[200,151],[250,166],[70,166]]],
"Wall angels":[[[150,12],[150,30],[150,80],[150,125],[150,170],[168,72]],[[150,12],[150,30],[150,80],[150,125],[150,170],[168,-8]]]};
const FS_MISTAKES={"Bodyweight squat":"Common mistakes: knees caving in, heels lifting, rounded back.","Glute bridge":"Common mistakes: arching the lower back, pushing through toes.","Plank":"Common mistakes: hips sagging or piking, holding your breath.","Wall angels":"Common mistakes: lower back lifting off the wall, shrugging shoulders."};
function fsAnim(name,box){
  const d=FS_ANIM[name];if(!d)return "Demo video coming soon.";
  box.style.display="block";
  setTimeout(()=>run(d,box),0);
  return `<svg viewBox="0 -15 300 200" style="width:100%;height:100%"><path id="da" fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path id="db" fill="none" stroke="var(--brand)" stroke-width="7" stroke-linecap="round"/><circle id="dh" r="14" fill="var(--ink)"/><line x1="10" y1="176" x2="290" y2="176" stroke="var(--line)" stroke-width="4"/></svg><p style="margin-top:6px;font-size:.8rem">${FS_MISTAKES[name]||""}</p>`;
}
function run(d,box){
  const s=box.querySelector("svg"),t0=performance.now();
  (function f(t){if(!s.isConnected)return;const p=(1-Math.cos((t-t0)/1100))/2,q=d[0].map((a,i)=>[a[0]+(d[1][i][0]-a[0])*p,a[1]+(d[1][i][1]-a[1])*p]);
    box.querySelector("#da").setAttribute("d",`M${q[4]}L${q[3]}L${q[2]}L${q[1]}`);box.querySelector("#db").setAttribute("d",`M${q[1]}L${q[5]}`);
    const h=box.querySelector("#dh");h.setAttribute("cx",q[0][0]);h.setAttribute("cy",q[0][1]);requestAnimationFrame(f)})(t0);
}
