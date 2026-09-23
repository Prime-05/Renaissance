const events=[
 {name:"The Glitch Room",tagline:"Debugging under pressure.",type:"Tech · Debugging",category:"tech",desc:"A debugging showdown where participants race to identify, understand and fix glitches under pressure.",members:"TBA",place:"TBA",time:"DAY 01 · 11:30 AM — 04:00 PM",fee:"TBA",m1:"Debugging",m2:"Showdown"},
 {name:"Tech Campus Feud",tagline:"Think fast. Answer faster.",type:"Tech · Quiz",category:"tech",desc:"The crowd-favorite tech quiz battle — fast questions, campus rivalry and technical knowledge under pressure.",members:"TBA",place:"TBA",time:"DAY 01 · 11:30 AM — 04:00 PM",fee:"TBA",m1:"Tech Quiz",m2:"Battle"},
 {name:"Project Defuse",tagline:"A countdown, a circuit, and modules that only unlock in order.",type:"Tech · Circuit Puzzle",category:"tech",desc:"A circuit puzzle challenge that puts technical reasoning, troubleshooting and problem-solving skills to the test.",members:"TBA",place:"TBA",time:"DAY 02 · 10:00 AM — 05:00 PM",fee:"TBA",m1:"Circuits",m2:"Puzzle"},
 {name:"Stitch It Up",tagline:"Design. Adapt. Deliver.",type:"Tech · UI Design",category:"tech",desc:"An AI-powered UI design sprint focused on turning ideas into a polished interface within a limited time.",members:"TBA",place:"TBA",time:"DAY 02 · 10:00 AM — 05:00 PM",fee:"TBA",m1:"AI + UI",m2:"Design Sprint"},
 {name:"Tech Jenga",tagline:"One block. One question. One wrong move.",type:"Non-Tech · Trivia",category:"nontech",desc:"A tower-toppling trivia challenge where every move tests your knowledge, judgement and nerve.",members:"TBA",place:"TBA",time:"DAY 02 · 02:00 PM — 06:00 PM",fee:"TBA",m1:"Trivia",m2:"Jenga"},
 {name:"Tech Charades",tagline:"Act it out. Decode the tech.",type:"Non-Tech · Charades",category:"nontech",desc:"Silent tech charades where teams communicate technical concepts without saying a word.",members:"TBA",place:"TBA",time:"DAY 02 · 02:00 PM — 06:00 PM",fee:"TBA",m1:"Charades",m2:"Tech Fun"}
];

const cardsWrap=document.getElementById("eventCards");
const cards=events.map((e,i)=>{
 const el=document.createElement("article");el.className="event-card";
 el.dataset.category=e.category;
 el.dataset.index=i;
 el.setAttribute("role","button");
 el.setAttribute("tabindex","0");
 el.innerHTML=`<div class="event-number">0${i+1}</div><div class="event-copy"><div class="event-type">${e.type}</div><div class="event-name">${e.name}</div></div><div class="event-hint">↗</div>`;
 el.addEventListener("click",()=>openEvent(i));
 el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openEvent(i)}});
 cardsWrap.appendChild(el);return el;
});
let offset=0, targetOffset=0, lastTime=performance.now(), dragging=false, dragStart=0, dragOrigin=0, pointerDownCard=null;
function mod(n,m){return ((n%m)+m)%m}
function renderCards(){
 const n=cards.length;
 cards.forEach((el,i)=>{
   let d=mod(i-offset,n); if(d>n/2)d-=n;
   const x=d*235;
   const y=38 + Math.abs(d)*34 + d*d*7;
   const scale=d===0?1.08:Math.max(.72,1-Math.abs(d)*.075);
   const rot=d*3.1;
   const opacity=Math.abs(d)>2.6?.12:Math.max(.35,1-Math.abs(d)*.2);
   el.style.transform=`translate3d(calc(-50% + ${x}px),${y}px,0) rotate(${rot}deg) scale(${scale})`;
   el.style.zIndex=100-Math.round(Math.abs(d)*10);
   el.style.opacity=opacity;
 });
}
function tick(now){
 const dt=Math.min(40,now-lastTime);lastTime=now;
 if(!dragging) targetOffset += dt*.00016; // continuous travel, not a straight line
 offset += (targetOffset-offset)*.12;
 renderCards();requestAnimationFrame(tick);
}
function snap(dir){targetOffset=Math.round(targetOffset)+dir}
document.getElementById("next").onclick=()=>snap(1);
document.getElementById("prev").onclick=()=>snap(-1);
const stage=document.getElementById("eventsStage");
let movedDuringDrag=false;
stage.addEventListener("pointerdown",e=>{
  pointerDownCard=e.target.closest?.(".event-card") || null;
  dragging=true;
  movedDuringDrag=false;
  dragStart=e.clientX;
  dragOrigin=targetOffset;
  // Do not capture the pointer: pointer capture can retarget the desktop click
  // to the stage instead of the card, preventing the detail overlay from opening.
});
stage.addEventListener("pointermove",e=>{
  if(dragging){
    if(Math.abs(e.clientX-dragStart)>6)movedDuringDrag=true;
    targetOffset=dragOrigin-(e.clientX-dragStart)/235;
  }
});
stage.addEventListener("pointerup",e=>{
  const card=pointerDownCard;
  const wasClick=!movedDuringDrag && card;
  dragging=false;
  targetOffset=Math.round(targetOffset);
  if(wasClick){
    e.preventDefault();
    openEvent(Number(card.dataset.index));
  }
  pointerDownCard=null;
  movedDuringDrag=false;
});
stage.addEventListener("click",e=>{
  if(movedDuringDrag){
    e.preventDefault();
    e.stopPropagation();
    movedDuringDrag=false;
  }
},true);
stage.addEventListener("pointercancel",()=>{dragging=false;pointerDownCard=null;movedDuringDrag=false});
renderCards();requestAnimationFrame(tick);


const filterButtons=document.querySelectorAll(".filter-btn");
let activeFilter="all";
filterButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    activeFilter=btn.dataset.filter;
    filterButtons.forEach(b=>{
      const active=b===btn;
      b.classList.toggle("active",active);
      b.setAttribute("aria-selected",active?"true":"false");
    });
    cards.forEach(card=>{
      const show=activeFilter==="all" || card.dataset.category===activeFilter;
      card.classList.toggle("is-hidden",!show);
    });
    // Re-center the filtered set instead of leaving the carousel at an arbitrary offset.
    targetOffset=Math.round(targetOffset);
  });
});

const panel=document.getElementById("eventPanel");
function openEvent(i){
 const e=events[i];
 if(!e) return;
 document.getElementById("panelType").textContent=e.type;
 document.getElementById("panelName").textContent=e.name;
 document.getElementById("panelDesc").textContent=e.desc;
 document.getElementById("panelTagline").textContent=e.tagline||"";
 document.getElementById("panelMembers").textContent=e.members;
 document.getElementById("panelPlace").textContent=e.place;
 document.getElementById("panelTime").textContent=e.time;
 document.getElementById("panelFee").textContent=e.fee;
 panel.classList.add("open");panel.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeEvent(){panel.classList.remove("open");panel.setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.getElementById("closePanel").onclick=closeEvent;
panel.addEventListener("click",e=>{if(e.target===panel)closeEvent()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeEvent()});

const schedule=[
 ["09:00", "Opening Ceremony & Tech Kickoff", "DAY 01", "Inauguration, keynote, and the first wave of technical competitions begin."],
 ["11:30", "The Glitch Room & Tech Campus Feud", "DAY 01", "Debugging showdown and the crowd-favorite tech quiz battle."],
 ["10:00", "Project Defuse & Stitch It Up", "DAY 02", "Circuit puzzle challenge and the AI-powered UI design sprint."],
 ["14:00", "Tech Jenga & Tech Charades", "DAY 02", "The non-tech reel begins — tower-toppling trivia and silent tech charades."],
 ["10:00", "Finals, Showcase & Closing Ceremony", "DAY 03", "Final rounds, project showcase, prize distribution and farewell."]
];
const timeline=document.getElementById("timeline");
schedule.forEach(s=>{
 const row=document.createElement("div");row.className="time-row";
 row.innerHTML=`<div class="time">${s[0]}</div><div class="dot"></div><div class="time-content"><small>${s[2]}</small><h3>${s[1]}</h3><p>${s[3]}</p></div>`;
 timeline.appendChild(row);
});

const sponsors=["YOUR SPONSOR","YOUR SPONSOR","YOUR SPONSOR","YOUR SPONSOR","YOUR SPONSOR","YOUR SPONSOR"];
const sponsorTrack=document.getElementById("sponsorTrack");
[...sponsors,...sponsors].forEach(s=>{const d=document.createElement("div");d.className="sponsor-box";d.innerHTML=`<span>${s}</span>`;sponsorTrack.appendChild(d)});

// HERO: RENAISSANCE is physically drawn by the horizontal line field.
// The title is a mask: only the bright segments that fall inside the letterforms
// are emphasized, so the word itself is made from the moving contour lines.
const canvas=document.getElementById("heroCanvas");
const ctx=canvas.getContext("2d");
const mask=document.createElement("canvas");
const mctx=mask.getContext("2d");
let W=0,H=0,DPR=1,px=.5,py=.5,mx=.5,my=.5,time=0,maskAlpha=null,maskW=0,maskH=0;

function resize(){
  DPR=Math.min(window.devicePixelRatio||1,2);
  W=window.innerWidth; H=window.innerHeight;

  canvas.width=W*DPR;
  canvas.height=H*DPR;
  canvas.style.width=W+"px";
  canvas.style.height=H+"px";

  mask.width=W*DPR;
  mask.height=H*DPR;

  ctx.setTransform(DPR,0,0,DPR,0,0);
  mctx.setTransform(DPR,0,0,DPR,0,0);
  makeMask();
}

function makeMask(){
  mctx.clearRect(0,0,W,H);
  mctx.fillStyle="#fff";
  mctx.textAlign="center";
  mctx.textBaseline="middle";

  // The title is formed by the SAME holographic contour lines — never a separate text layer.
  // A slightly bolder mask on phones gives the moving line segments enough surface area
  // to form readable letterforms.
  const size=Math.min(W*.145,168);
  mctx.font=`700 ${size}px Georgia, "Times New Roman", serif`;
  mctx.lineWidth=W<760?1.8:1.2;
  mctx.strokeStyle="#fff";
  mctx.fillStyle="#fff";
  mctx.strokeText("RENAISSANCE",W*.5,H*.465);
  mctx.fillText("RENAISSANCE",W*.5,H*.465);

  // Cache the mask once per resize. Reading a pixel from the canvas for every
  // line segment on every animation frame was the main source of card stutter.
  const data=mctx.getImageData(0,0,Math.max(1,Math.ceil(W*DPR)),Math.max(1,Math.ceil(H*DPR))).data;
  maskAlpha=data; maskW=Math.max(1,Math.ceil(W*DPR)); maskH=Math.max(1,Math.ceil(H*DPR));
}

window.addEventListener("resize",resize);
window.addEventListener("pointermove",e=>{
  mx=e.clientX/W;
  my=e.clientY/H;
});
resize();

function maskAt(x,y){
  if(!maskAlpha) return false;
  const ix=Math.max(0,Math.min(maskW-1,Math.floor(x*DPR)));
  const iy=Math.max(0,Math.min(maskH-1,Math.floor(y*DPR)));
  return maskAlpha[(iy*maskW+ix)*4+3]>30;
}

function drawSegmentedTextLine(y, lineIndex){
  // The highlight follows the exact same contour path as the background line.
  const step=Math.max(4,Math.ceil(W/300));
  let inText=false,segStart=0,segStartY=0;
  for(let x=0;x<=W+step;x+=step){
    const nx=Math.min(1,x/W),dx=nx-.5;
    const broad=10*Math.sin(dx*5.5+time*.55)*(1-Math.min(1,Math.abs(dx)*1.25));
    const pointer=(py-.5)*22*Math.sin(nx*6+time*.35)+(px-.5)*12*Math.cos(nx*9-time*.25);
    const localWave=3.5*Math.sin(nx*17+lineIndex*.12+time*1.15);
    const yy=y+broad+pointer+localWave;
    const hit=x<=W&&maskAt(x,yy);
    if(hit&&!inText){inText=true;segStart=x;segStartY=yy;}
    if((!hit||x>=W)&&inText){
      const segEnd=Math.min(x,W),nx2=segEnd/W,dx2=nx2-.5;
      const endY=y+10*Math.sin(dx2*5.5+time*.55)*(1-Math.min(1,Math.abs(dx2)*1.25))
        +(py-.5)*22*Math.sin(nx2*6+time*.35)+(px-.5)*12*Math.cos(nx2*9-time*.25)
        +3.5*Math.sin(nx2*17+lineIndex*.12+time*1.15);
      ctx.beginPath();ctx.moveTo(segStart,segStartY);ctx.lineTo(segEnd,endY);
      ctx.strokeStyle=`rgba(220,242,255,${.80+.15*Math.sin(lineIndex*.2+time)})`;
      ctx.lineWidth=W<760?1.55:1.35;ctx.stroke();
      ctx.beginPath();ctx.moveTo(segStart,segStartY+2);ctx.lineTo(segEnd,endY+2);
      ctx.strokeStyle="rgba(55,105,255,.48)";ctx.lineWidth=W<760?.8:.7;ctx.stroke();
      inText=false;
    }
  }
}

function drawHero(){
  time+=.008;
  px+=(mx-px)*.035;
  py+=(my-py)*.035;

  ctx.clearRect(0,0,W,H);

  // Very subtle vertical construction grid.
  ctx.strokeStyle="rgba(75,110,255,.045)";
  ctx.lineWidth=1;
  const gridStep=Math.max(105,W/12);
  for(let x=0;x<=W;x+=gridStep){
    ctx.beginPath();
    ctx.moveTo(x,76);
    ctx.lineTo(x,H-62);
    ctx.stroke();
  }

  const lines=W<760?Math.max(44,Math.floor(H/13)):Math.max(30,Math.floor(H/16));
  const top=H*.12;
  const span=H*.69;

  for(let i=0;i<lines;i++){
    const y=top+i*(span/(lines-1));

    // Wide, gentle contour movement.
    ctx.beginPath();
    for(let x=0;x<=W;x+=5){
      const nx=x/W;
      const dx=nx-.5;

      const broad =
        10*Math.sin(dx*5.5 + time*.55) *
        (1-Math.min(1,Math.abs(dx)*1.25));

      const pointer =
        (py-.5)*22*Math.sin(nx*6.0 + time*.35) +
        (px-.5)*12*Math.cos(nx*9.0 - time*.25);

      const localWave =
        3.5*Math.sin(nx*17 + i*.12 + time*1.15);

      const yy=y+broad+pointer+localWave;

      if(x===0) ctx.moveTo(x,yy);
      else ctx.lineTo(x,yy);
    }

    // The background field remains quiet so the title dominates.
    ctx.strokeStyle=`rgba(38,82,235,${.09 + .045*Math.sin(i*.13+time)})`;
    ctx.lineWidth=.72;
    ctx.stroke();

    // Only the parts inside the letters become bright.
    // The title therefore emerges from the exact same line system.
    if(i>=Math.floor(lines*.30) && i<=Math.floor(lines*.72)){
      drawSegmentedTextLine(y,i);
    }
  }

  // Two brighter "guide" contours frame the title.
  for(const offset of [-1,1]){
    const y=H*.31 + offset*H*.145;
    ctx.beginPath();
    for(let x=0;x<=W;x+=6){
      const nx=x/W;
      const yy=y
        + 13*Math.sin(nx*5.3+time*.5)
        + 5*Math.sin(nx*12-time*.25);
      if(x===0)ctx.moveTo(x,yy);else ctx.lineTo(x,yy);
    }
    ctx.strokeStyle="rgba(93,231,255,.32)";
    ctx.lineWidth=1;
    ctx.stroke();
  }

  // Tiny floating particles concentrated around the title.
  for(let i=0;i<36;i++){
    const x=(i*137.7 + time*9) % W;
    const y=H*.27 + ((i*61.3)% (H*.39));
    const a=.035 + .025*Math.sin(time+i);
    ctx.fillStyle=`rgba(114,231,255,${a})`;
    ctx.fillRect(x,y,1,1);
  }

  requestAnimationFrame(drawHero);
}
drawHero();
