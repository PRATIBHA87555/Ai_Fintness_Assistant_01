/* Home page posture card: pick an exercise and open the camera coach (see coach.js) */
(()=>{const lab=document.querySelector(".lab");if(!lab)return;
const L=["Bodyweight squat","Reverse lunge","Incline push-ups","Plank","Glute bridge","Posture check"];
lab.insertAdjacentHTML("afterbegin",`<div class="camtools"><select id="exSel" aria-label="Exercise">${L.map(x=>`<option>${x}</option>`).join("")}</select><button class="btn" id="camBtn" type="button">Open camera coach</button></div>`);
document.getElementById("camBtn").onclick=()=>FSCoach.open(document.getElementById("exSel").value)})();
