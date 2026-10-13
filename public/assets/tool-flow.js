// Shared tool flow for every tool page: a three-step guide (input → options → result),
// step labels on each tool panel, accepted-file hints on drop zones and one clear
// status line for the empty, working, done and error states. It only reads and
// labels the tool DOM; each tool keeps its own logic.
const STEP_SETS={
 file:['Upload','Choose options','Preview & download'],
 text:['Enter or paste','Pick options','Copy or download'],
 calc:['Enter details','Adjust values','Read the breakdown']
};
const HELP={
 file:'Add a file, adjust the options, then check the before/after preview and download. Files stay on your device.',
 text:'Type or paste your input; results update as you go. Nothing is uploaded.',
 calc:'Fill in the values; the result and its breakdown update instantly.'
};
// [selector, step, label]. Labels are attributes, so they survive tools that re-render their panels.
const PANELS=[
 ['.ir-drop,.pdfw-drop,.pm-drop,.dropzone,.drop-target,.ats-drop',1,'Step 1 · Upload'],
 ['.ir-settings,.pdfw-settings,.media-fields,.split-options,.format-options,.toolbox',2,'Step 2 · Options'],
 ['.ir-layout>main.ir-pane,.pdfw-layout>section,.media-grid>aside.media-card',3,'Step 3 · Preview & result'],
 ['.calc-grid>.calc-card:first-child,.uw-grid>.uw-card:first-child',1,'Step 1 · Input & options'],
 ['.calc-output,.uw-grid>.uw-card:nth-child(2)',3,'Step 3 · Result']
];
const ACCEPT={'image/*':'Images (JPG, PNG, WebP, GIF, HEIC…)','video/*':'Videos (MP4, WebM, MOV…)','audio/*':'Audio files','application/pdf':'PDF'};
export function describeAccept(accept=''){
 const parts=[...new Set(String(accept).split(',').map(s=>s.trim()).filter(Boolean).map(s=>ACCEPT[s]||(s.startsWith('.')?s.slice(1).toUpperCase():s.includes('/')?s.split('/')[1].toUpperCase():s)))];
 return parts.length?parts.join(', '):'Any file your browser can open';
}
export function kindOf(root){if(root.querySelector('input[type=file]'))return'file';if(root.querySelector('.calc-shell,.uc'))return'calc';return'text'}
const visible=e=>!!e&&!e.hidden&&!e.closest('[hidden]')&&e.getClientRects().length>0;
export function detectState(root){
 const err=[...root.querySelectorAll('[data-tone=error],.status.error,.calc-error,.media-status.error,.size-verdict[data-ok="false"],[role=alert]')].find(e=>visible(e)&&e.textContent.trim());
 if(err)return'error';
 if(root.getAttribute('aria-busy')==='true'||[...root.querySelectorAll('progress,[aria-busy=true],[role=progressbar]')].some(visible))return'working';
 const dl=[...root.querySelectorAll('a[download],button')].some(e=>visible(e)&&(e.matches('a[download][href]')||(/download|save|export/i.test(e.textContent)&&!e.disabled&&e.closest('.media-result,.ir-summary,.ir-actions,.pdfw-actions,.pm-actions,.result,.tf-r'))));
 if(dl)return'done';
 return'idle';
}
const MSG={
 file:{idle:'Waiting for a file — drop it on the upload area or choose one.',loaded:'File added — set your options, then run the tool.',working:'Working on it… keep this tab open.',done:'Done — check the preview and download your result.',error:'Something needs attention — see the message highlighted in red.'},
 text:{idle:'Start typing or paste your input.',loaded:'Results update as you type.',working:'Working…',done:'Result ready — copy or download it.',error:'Check the highlighted message to fix the input.'},
 calc:{idle:'Enter your values to see the result.',loaded:'Result and breakdown update as you type.',working:'Calculating…',done:'Result ready.',error:'Check the highlighted field.'}
};
function label(root){
 for(const[sel,step,text]of PANELS)root.querySelectorAll(sel).forEach(e=>{if(!e.dataset.tfStep&&!e.closest('.tf-ws')){e.dataset.tfStep=step;e.dataset.tfLabel=text}});
 root.querySelectorAll('input[type=file]:not([data-tf-hint])').forEach(input=>{
  input.dataset.tfHint='1';if(!input.id)input.id='tf-file-'+Math.random().toString(36).slice(2,8);
  const p=document.createElement('p');p.className='tf-accept';p.id=input.id+'-hint';
  p.textContent=`Accepted: ${describeAccept(input.accept)}${input.multiple?' · several files at once':''} · processed on your device, never uploaded.`;
  input.setAttribute('aria-describedby',[input.getAttribute('aria-describedby'),p.id].filter(Boolean).join(' '));
  input.insertAdjacentElement('afterend',p);
 });
}

// Workspace layout (desktop ≥1024px): compact upload strip, then LEFT = main options (+ queue),
// MIDDLE = secondary options, RIGHT = sticky preview & result panel where processing is shown.
// Elements are moved, never cloned, so every tool keeps its own references and handlers.
const one=(root,sel)=>root.querySelector(sel);
const all=(root,sels)=>[...new Set((sels||[]).flatMap(s=>[...root.querySelectorAll(s)]))];
export const RECIPES=[
 {id:'ir',match:'.ir-layout',upload:'.ir-drop',a:['.ir-layout>aside.ir-pane:not(.ir-settings)','.ir-settings'],split:'.ir-settings',splitAt:'.ir-advanced',r:['.ir-layout>main.ir-pane','.ir-actions'],prog:['.ir-queue-progress','[data-status]']},
 {id:'media',match:'.media-grid .dropzone',upload:'.dropzone',a:['.media-grid>section.media-card>div:not(.dropzone)'],split:'.media-fields',r:['.media-grid>aside.media-card'],prog:['.media-progress','.media-status']},
 {id:'pdfw',match:'.pdfw-layout',upload:'.pdfw-drop',a:['.pdfw-layout>section:has(.pdfw-list)','.pdfw-settings'],split:'.pdfw-settings',r:['.pdfw-stats','.pdfw-layout>section:not(:has(.pdfw-list))','.pdfw>.result'],prog:['.pdfw-meter','[data-status]']},
 {id:'pm',match:'.pm-layout',upload:'.pm-drop',a:['.pm-bar','.pm-layout>section'],b:['.pm-settings','.pm-summary'],r:['.pm>.result','.pm-actions'],prog:['.pm-progress','[data-status]']},
 {id:'split',match:'.split-grid',upload:'.pm-drop',a:['.split-options'],split:'.split-options',r:['.split-plan','.split-workspace>section:has(.split-pages)'],prog:['.pdfw-meter','[data-status]']},
 {id:'format',match:'.format-grid',upload:'.pm-drop',a:['.format-options'],r:['.format-result'],prog:['.pdfw-meter','[data-status]']}
];
// Where a long options panel is split: at its second heading, else at the first fieldset/details, else in half.
export function splitIndex(children){
 const hs=children.map((c,i)=>/^H[2-4]$/.test(c.tagName)?i:-1).filter(i=>i>=0);
 if(hs.length>=2)return hs[1];
 const f=children.findIndex(c=>c.matches?.('fieldset,details,.size-target'));
 if(f>0)return f;
 return children.length>6?Math.ceil(children.length/2):-1;
}
function col(cls,label){const c=document.createElement('div');c.className='tf-col '+cls;const h=document.createElement('p');h.className='tf-col-h';h.textContent=label;c.append(h);return c}
export function arrange(root){
 if(one(root,'.tf-ws'))return one(root,'.tf-ws');
 const rec=RECIPES.find(r=>one(root,r.match));if(!rec)return null;
 const upload=one(root,rec.upload);
 const ws=document.createElement('div');ws.className='tf-ws';ws.dataset.recipe=rec.id;
 const A=col('tf-a','Step 2 · Options'),B=col('tf-b','More options'),R=col('tf-r','Step 3 · Preview & result');
 const proc=document.createElement('div');proc.className='tf-proc';proc.hidden=true;proc.setAttribute('aria-live','polite');
 proc.innerHTML='<div class="tf-proc-head"><span class="tf-spin" aria-hidden="true"></span><p class="tf-proc-text">Working…</p><b class="tf-proc-pct"></b></div><div class="tf-proc-bar"><span></span></div>';
 R.append(proc);ws.append(A,B,R);
 // "More options" is collapsed by default; on desktop it then sits under the options column.
 B.classList.add('tf-closed');B.firstChild.innerHTML='<button type="button" class="tf-more" aria-expanded="false">More options <span aria-hidden="true">▾</span></button>';
 B.firstChild.firstChild.onclick=()=>{const shut=B.classList.toggle('tf-closed');B.firstChild.firstChild.setAttribute('aria-expanded',String(!shut))};
 const anchor=one(root,rec.match.split(' ')[0]);
 const parents=new Set();const move=(el,to)=>{if(!el||el===ws||el.contains(ws))return;parents.add(el.parentElement);to.append(el)};
 anchor.before(ws);
 if(upload){parents.add(upload.parentElement);upload.classList.add('tf-upload');ws.before(upload)}
 all(root,rec.a).filter(e=>!e.closest('.tf-ws')).forEach(e=>move(e,A));
 all(root,rec.b).filter(e=>!e.closest('.tf-ws')).forEach(e=>move(e,B));
 const wide=root.dataset.tfLayout==='wide';if(wide)ws.classList.add('tf-wide');
 // Wide tools keep every main option visible; only the advanced block (if any) goes to More options.
 const adv=rec.splitAt&&one(A,rec.splitAt);
 if(adv){const twin=document.createElement('div');twin.className=(adv.closest(rec.split)?.className||'')+' tf-twin';[...adv.children].filter(k=>k.tagName!=='SUMMARY').forEach(k=>twin.append(k));adv.remove();B.append(twin)}
 else if(rec.split&&!wide){const src=one(A,rec.split);if(src){const kids=[...src.children],i=splitIndex(kids);if(i>0){const twin=document.createElement(src.tagName);twin.className=src.className+' tf-twin';kids.slice(i).forEach(k=>twin.append(k));B.append(twin)}}}
 const box=document.createElement('div');box.className='tf-proc-tools';
 all(root,rec.prog).filter(e=>!e.closest('.tf-r')&&!e.closest('.tf-bar')).forEach(e=>move(e,box));
 proc.after(box);
 all(root,rec.r).filter(e=>!e.closest('.tf-ws')).forEach(e=>move(e,R));
 if(B.children.length<2)ws.classList.add('tf-two');
 ws.querySelectorAll('[data-tf-step]').forEach(e=>{delete e.dataset.tfStep;delete e.dataset.tfLabel});
 for(const p of parents)if(p&&p!==root&&!p.contains(ws)&&[...p.children].every(c=>/^H[1-4]$/.test(c.tagName)))p.hidden=true;
 return ws;
}
// Live-output boxes and the live status line are appended to the tool root by shared code; keep them in the result panel.
function adopt(root,ws){
 const R=ws.querySelector('.tf-r');if(!R)return;
 root.querySelectorAll(':scope>[data-live-output],:scope>.live-state,:scope>*>[data-live-output]').forEach(e=>{if(!e.closest('.tf-r'))R.append(e)});
 const live=root.querySelector('.live-state');if(live&&!live.closest('.tf-r'))R.querySelector('.tf-proc').before(live);
}
export function percentOf(root){
 const pr=[...root.querySelectorAll('progress')].find(visible);
 if(pr&&pr.max)return Math.round(pr.value/pr.max*100);
 const pb=[...root.querySelectorAll('[role=progressbar][aria-valuenow]')].find(visible);if(pb)return Math.round(+pb.getAttribute('aria-valuenow'));
 const pt=root.querySelector('[data-progress-percent]');if(pt&&visible(pt)&&/\d/.test(pt.textContent))return parseInt(pt.textContent,10);
 const m=[...root.querySelectorAll('[data-meter],[data-progress]')].map(e=>parseFloat(e.style?.width)).find(w=>w>0&&w<100);
 return m?Math.round(m):null;
}
function statusText(root){
 const s=[...root.querySelectorAll('[data-progress-label],.media-status,[data-status],.live-state')].find(e=>visible(e)&&e.textContent.trim());
 return s?s.textContent.trim():'';
}
function chip(root,upload,names){
 let c=upload.querySelector(':scope>.tf-chip');
 if(!names.length){if(upload.classList.contains('tf-has-file'))upload.classList.remove('tf-has-file');c?.remove();return}
 const input=upload.querySelector('input[type=file]')||root.querySelector('input[type=file]');
 if(!c){c=document.createElement('div');c.className='tf-chip';c.innerHTML='<span class="tf-chip-ico" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg></span><span class="tf-chip-name"></span><button type="button" class="alt tf-chip-btn"></button>';upload.prepend(c);c.querySelector('button').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();input?.click()})}
 const nm=names[0]+(names.length>1?` + ${names.length-1} more`:'');if(c.querySelector('.tf-chip-name').textContent===nm)return;c.querySelector('.tf-chip-name').textContent=names[0]+(names.length>1?` + ${names.length-1} more`:'');
 c.querySelector('.tf-chip-name').title=names.join(', ');
 c.querySelector('button').textContent=input?.multiple?'Add / change files':'Change file';
 if(!upload.classList.contains('tf-has-file'))upload.classList.add('tf-has-file');
}
export function mountFlow(root){
 if(!root||root.dataset.tfReady)return;root.dataset.tfReady='1';
 const bar=document.createElement('nav');bar.className='tf-bar';bar.setAttribute('aria-label','How to use this tool');
 root.before(bar);
 let kind='text',loaded=false,current='',names=[],poll=0;
 const render=()=>{
  const k=kindOf(root);if(k!==kind||!bar.firstChild){kind=k;const s=STEP_SETS[kind];
   bar.innerHTML=`<ol class="tf-steps">${s.map((t,i)=>`<li data-n="${i+1}"><span class="tf-num">${i+1}</span><span>${t}</span></li>`).join('')}</ol><p class="tf-help">${HELP[kind]}</p><div class="tf-status-row"><p class="tf-status" role="status" aria-live="polite"></p><button type="button" class="alt tf-reset" title="Clear everything and start again">Start over</button></div>`;
   bar.querySelector('.tf-reset').onclick=()=>location.reload();current=''}
  label(root);
  const ws=arrange(root);if(ws&&!ws.dataset.own)adopt(root,ws);
  const up=root.querySelector('.tf-upload');if(up)chip(root,up,names);
  let state=detectState(root);if(state==='idle'&&loaded)state='loaded';
  root.dataset.tfState=state;
  if(ws&&!ws.dataset.own){const proc=ws.querySelector('.tf-proc'),pct=state==='working'?percentOf(root):null;proc.hidden=state!=='working';
   if(state==='working'){proc.querySelector('.tf-proc-text').textContent=statusText(root)||MSG[kind].working;proc.querySelector('.tf-proc-pct').textContent=pct==null?'':pct+'%';proc.querySelector('.tf-proc-bar').classList.toggle('is-indeterminate',pct==null);proc.querySelector('.tf-proc-bar span').style.width=pct==null?'':pct+'%';if(!poll)poll=setInterval(schedule,300)}
   else if(poll){clearInterval(poll);poll=0}}
  if(state===current)return;const prev=current;current=state;
  if(kind==='file'&&state==='done'&&prev&&prev!=='done')toResult();
  const active=state==='done'?3:state==='idle'?1:state==='error'?(loaded?2:1):kind==='file'?(state==='working'?3:2):3;
  bar.dataset.state=state;
  bar.querySelectorAll('li').forEach(li=>{const n=+li.dataset.n;li.classList.toggle('is-active',n===active);li.classList.toggle('is-done',n<active||state==='done');if(n===active)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});
  bar.querySelector('.tf-status').textContent=MSG[kind][state];
 };
 // Mobile/tablet only: bring the preview into view after a file is added, and the download once done.
 let userAt=0;['touchmove','wheel'].forEach(t=>addEventListener(t,()=>{userAt=Date.now()},{passive:true}));
 const jump=(pick,delay)=>setTimeout(()=>{try{if(!matchMedia('(max-width:1023px)').matches||Date.now()-userAt<900)return;const el=pick();if(!el)return;const r=el.getBoundingClientRect();if(r.top>=56&&r.bottom<=innerHeight)return;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'})}catch{}},delay);
 const toPreview=()=>jump(()=>{const R=root.querySelector('.tf-ws .tf-r');return R&&R.offsetParent?R:root.querySelector('.tf-ws')},450);
 const toResult=()=>jump(()=>{const R=root.querySelector('.tf-ws .tf-r')||root;return [...R.querySelectorAll('.iv-dl,a[download][href],.iv,.media-result,.result')].find(e=>e.offsetParent)||null},300);
 let queued=false;const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;try{render()}catch{}})}};
 root.addEventListener('change',e=>{if(e.target.type==='file'&&e.target.files?.length){loaded=true;names=[...e.target.files].map(f=>f.name);toPreview()}schedule()});
 root.addEventListener('click',e=>{const b=e.target.closest?.('button');if(b&&/^(clear( all| queue)?|start over|reset|remove all)$/i.test(b.textContent.trim())){names=[];setTimeout(schedule,50)}});
 root.addEventListener('input',e=>{if(e.target.type!=='file'&&e.target.value)loaded=true;schedule()});
 root.addEventListener('drop',e=>{loaded=true;const f=[...(e.dataTransfer?.files||[])].map(f=>f.name);if(f.length){names=f;toPreview()}setTimeout(schedule,50)});
 root.addEventListener('dragenter',e=>{const z=e.target.closest?.('[data-tf-step="1"]');if(z)z.classList.add('tf-dragover')});
 root.addEventListener('dragleave',e=>{const z=e.target.closest?.('[data-tf-step="1"]');if(z&&!z.contains(e.relatedTarget))z.classList.remove('tf-dragover')});
 root.addEventListener('drop',()=>root.querySelectorAll('.tf-dragover').forEach(z=>z.classList.remove('tf-dragover')));
 new MutationObserver(list=>{if(list.some(m=>!(m.target.closest?.('.tf-proc,.tf-chip,.iv-stage'))))schedule()}).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','disabled','href','class','aria-busy','style','aria-valuenow']});
 render();
}
if(typeof document!=='undefined'){const go=()=>document.querySelectorAll('[data-tool]').forEach(mountFlow);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()}
