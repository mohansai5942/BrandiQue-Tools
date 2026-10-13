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
 if([...root.querySelectorAll('progress')].some(visible))return'working';
 const dl=[...root.querySelectorAll('a[download],button')].some(e=>visible(e)&&(e.matches('a[download][href]')||(/download|save|export/i.test(e.textContent)&&!e.disabled&&e.closest('.media-result,.ir-summary,.pdfw-actions,.result'))));
 if(dl)return'done';
 return'idle';
}
const MSG={
 file:{idle:'Waiting for a file — drop it on the upload area or choose one.',loaded:'File added — set your options, then run the tool.',working:'Working on it… keep this tab open.',done:'Done — check the preview and download your result.',error:'Something needs attention — see the message highlighted in red.'},
 text:{idle:'Start typing or paste your input.',loaded:'Results update as you type.',working:'Working…',done:'Result ready — copy or download it.',error:'Check the highlighted message to fix the input.'},
 calc:{idle:'Enter your values to see the result.',loaded:'Result and breakdown update as you type.',working:'Calculating…',done:'Result ready.',error:'Check the highlighted field.'}
};
function label(root){
 for(const[sel,step,text]of PANELS)root.querySelectorAll(sel).forEach(e=>{if(!e.dataset.tfStep){e.dataset.tfStep=step;e.dataset.tfLabel=text}});
 root.querySelectorAll('input[type=file]:not([data-tf-hint])').forEach(input=>{
  input.dataset.tfHint='1';if(!input.id)input.id='tf-file-'+Math.random().toString(36).slice(2,8);
  const p=document.createElement('p');p.className='tf-accept';p.id=input.id+'-hint';
  p.textContent=`Accepted: ${describeAccept(input.accept)}${input.multiple?' · several files at once':''} · processed on your device, never uploaded.`;
  input.setAttribute('aria-describedby',[input.getAttribute('aria-describedby'),p.id].filter(Boolean).join(' '));
  input.insertAdjacentElement('afterend',p);
 });
}
export function mountFlow(root){
 if(!root||root.dataset.tfReady)return;root.dataset.tfReady='1';
 const bar=document.createElement('nav');bar.className='tf-bar';bar.setAttribute('aria-label','How to use this tool');
 root.before(bar);
 let kind='text',loaded=false,current='';
 const render=()=>{
  const k=kindOf(root);if(k!==kind||!bar.firstChild){kind=k;const s=STEP_SETS[kind];
   bar.innerHTML=`<ol class="tf-steps">${s.map((t,i)=>`<li data-n="${i+1}"><span class="tf-num">${i+1}</span><span>${t}</span></li>`).join('')}</ol><p class="tf-help">${HELP[kind]}</p><div class="tf-status-row"><p class="tf-status" role="status" aria-live="polite"></p><button type="button" class="alt tf-reset" title="Clear everything and start again">Start over</button></div>`;
   bar.querySelector('.tf-reset').onclick=()=>location.reload();current=''}
  label(root);
  let state=detectState(root);if(state==='idle'&&loaded)state='loaded';
  if(state===current)return;current=state;
  const active=state==='done'?3:state==='idle'?1:state==='error'?(loaded?2:1):kind==='file'?(state==='working'?3:2):3;
  bar.dataset.state=state;
  bar.querySelectorAll('li').forEach(li=>{const n=+li.dataset.n;li.classList.toggle('is-active',n===active);li.classList.toggle('is-done',n<active||state==='done');if(n===active)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current')});
  bar.querySelector('.tf-status').textContent=MSG[kind][state];
 };
 let queued=false;const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;try{render()}catch{}})}};
 root.addEventListener('change',e=>{if(e.target.type==='file'&&e.target.files?.length)loaded=true;schedule()});
 root.addEventListener('input',e=>{if(e.target.type!=='file'&&e.target.value)loaded=true;schedule()});
 root.addEventListener('drop',()=>{loaded=true;setTimeout(schedule,50)});
 root.addEventListener('dragenter',e=>{const z=e.target.closest?.('[data-tf-step="1"]');if(z)z.classList.add('tf-dragover')});
 root.addEventListener('dragleave',e=>{const z=e.target.closest?.('[data-tf-step="1"]');if(z&&!z.contains(e.relatedTarget))z.classList.remove('tf-dragover')});
 root.addEventListener('drop',()=>root.querySelectorAll('.tf-dragover').forEach(z=>z.classList.remove('tf-dragover')));
 new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','disabled','href','class']});
 render();
}
if(typeof document!=='undefined'){const go=()=>document.querySelectorAll('[data-tool]').forEach(mountFlow);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go()}
