/* Light / dark theme toggle. Remembers the choice; follows the device setting until you pick one. */
(()=>{const r=document.documentElement,k="fs_theme";let t;try{t=localStorage.getItem(k)}catch(e){}
if(t)r.dataset.theme=t;
const dark=()=>r.dataset.theme?r.dataset.theme=="dark":matchMedia("(prefers-color-scheme:dark)").matches;
const A='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
const ic=()=>dark()?A+'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>':A+'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
addEventListener("DOMContentLoaded",()=>{const nav=document.querySelector("nav");if(!nav)return;
  let box=nav.querySelector(".nav-r");if(!box){box=document.createElement("div");box.className="nav-r";box.append(...[...nav.children].slice(1));nav.append(box)}
  const b=document.createElement("button");b.className="tgl";b.type="button";b.setAttribute("aria-label","Toggle dark mode");
  const u=()=>{b.innerHTML=ic();b.title=dark()?"Switch to light mode":"Switch to dark mode"};u();
  b.onclick=()=>{const n=dark()?"light":"dark";r.dataset.theme=n;try{localStorage.setItem(k,n)}catch(e){}u()};
  box.append(b)})})();
