// Large before/after image viewer shared by Image Resizer and Image Compressor.
// Modes: Compare (slider), Side by side, Before, After. Zoom: Fit, 100 % (actual pixels), −/+,
// mouse wheel, pinch, double-click; drag to pan when the image is bigger than the panel.
// Result stats (dimensions, size, % saved, format) and a Download link sit under the image.
const FMT={'image/jpeg':'JPG','image/png':'PNG','image/webp':'WebP','image/avif':'AVIF','image/gif':'GIF'};
export const fmtName=t=>FMT[t]||(t?String(t).split('/').pop().toUpperCase():'—');
export const bytes=n=>!Number.isFinite(n)?'—':n<1024?`${n} B`:n<1048576?`${(n/1024).toFixed(1)} KB`:`${(n/1048576).toFixed(2)} MB`;
export function savedText(a,b){if(!a||!Number.isFinite(b))return'';const d=(1-b/a)*100;return Math.abs(d)<.05?'Same size':d>0?`${d.toFixed(1)}% smaller`:`${Math.abs(d).toFixed(1)}% larger`}
export const clampZoom=s=>Math.min(16,Math.max(.02,s));
export function fitScale(pw,ph,w,h){if(!(pw>0&&ph>0&&w>0&&h>0))return 1;return Math.min(pw/w,ph/h,32)}
// Keep the frame inside the pane: centred when smaller, edge-limited when larger.
export function clampPan(t,frame,pane){const m=Math.max(0,(frame-pane)/2);return Math.max(-m,Math.min(m,t))}
let cssDone=false;
function css(){if(cssDone||typeof document==='undefined')return;cssDone=true;const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/image-viewer.css';document.head.append(l)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createViewer(host,{onDownload}={}){
 css();
 const el=document.createElement('div');el.className='iv';el.innerHTML=`<div class="iv-bar"><div class="iv-seg" role="group" aria-label="Preview mode"><button type="button" data-iv-mode="compare">Split</button><button type="button" data-iv-mode="side">Side by side</button><button type="button" data-iv-mode="before">Before</button><button type="button" data-iv-mode="after">After</button></div><div class="iv-zoom" role="group" aria-label="Zoom"><button type="button" data-iv-z="out" aria-label="Zoom out">−</button><span class="iv-zl" data-iv-zl aria-live="polite">Fit</span><button type="button" data-iv-z="in" aria-label="Zoom in">+</button><button type="button" data-iv-z="fit" title="Fit the whole image in the panel">Fit</button><button type="button" data-iv-z="full" title="Full size: actual pixels (100%)">100%</button><button type="button" data-iv-z="bg" title="Change preview background (checker, dark, light)" aria-label="Change preview background">◩</button></div></div><div class="iv-stage" data-bg="checker" tabindex="0" aria-label="Image preview. Drag to pan or compare, scroll or pinch to zoom, double-click for 100%."></div><div class="iv-stats" data-iv-stats></div><div class="iv-actions"><a class="btn iv-dl" data-iv-dl hidden>Download</a><span class="iv-hint">Scroll / pinch to zoom · drag to pan · double-click for 100%</span></div>`;
 host.replaceChildren(el);
 const stage=el.querySelector('.iv-stage');
 let d=null,mode='compare',s=1,fit=true,tx=0,ty=0,pos=50,bgI=0;const ptrs=new Map();let drag=null;
 const ref=()=>mode==='before'||!d?.after?d?.before:d.after;
 const panes=()=>[...stage.querySelectorAll('.iv-pane')];
 function build(){
  stage.dataset.mode=mode;if(!d){stage.innerHTML='<p class="iv-empty">Add an image to see a large preview here.</p>';return}
  const b=d.before,a=d.after;
  const img=(x,cls,alt)=>`<img class="${cls}" src="${esc(x.url)}" alt="${alt}" draggable="false">`;
  if(mode==='side'&&a)stage.innerHTML=`<div class="iv-pane"><div class="iv-frame">${img(b,'iv-img','Original image')}</div><span class="iv-tag">Before · ${b.w}×${b.h}</span></div><div class="iv-pane"><div class="iv-frame">${img(a,'iv-img','Result image')}</div><span class="iv-tag">After · ${a.w}×${a.h}</span></div>`;
  else if(mode==='compare'&&a)stage.innerHTML=`<div class="iv-pane"><div class="iv-frame">${img(b,'iv-img','Original image')}<div class="iv-clip">${img(a,'iv-img','Result image')}</div><div class="iv-handle" role="slider" tabindex="0" aria-label="Compare before and after" aria-valuemin="0" aria-valuemax="100"><span></span></div></div><span class="iv-tag">Before</span><span class="iv-tag iv-tag-r">After</span></div>`;
  else{const x=mode==='after'&&a?a:b;stage.innerHTML=`<div class="iv-pane"><div class="iv-frame">${img(x,'iv-img',x===a?'Result image':'Original image')}</div><span class="iv-tag">${x===a?'After':'Before'} · ${x.w}×${x.h}</span></div>`}
  layout()}
 function layout(){
  const r=ref();if(!r)return;const ps=panes();if(!ps.length)return;const pw=ps[0].clientWidth,ph=ps[0].clientHeight;
  if(fit)s=fitScale(pw,ph,r.w,r.h);
  const fw=r.w*s,fh=r.h*s;tx=clampPan(tx,fw,pw);ty=clampPan(ty,fh,ph);
  for(const p of ps){const f=p.querySelector('.iv-frame');f.style.width=fw+'px';f.style.height=fh+'px';f.style.transform=`translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px))`;f.classList.toggle('iv-px',s>=3)}
  stage.style.setProperty('--pos',pos+'%');const h=stage.querySelector('.iv-handle');if(h)h.setAttribute('aria-valuenow',String(Math.round(pos)));
  stage.classList.toggle('iv-pannable',fw>pw+1||fh>ph+1);
  el.querySelector('[data-iv-zl]').textContent=(fit?'Fit · ':'')+Math.round(s*100)+'%';
  el.querySelector('[data-iv-z="fit"]').setAttribute('aria-pressed',String(fit));
  el.querySelector('[data-iv-z="full"]').setAttribute('aria-pressed',String(!fit&&Math.abs(s-1)<1e-6))}
 function zoomTo(ns,cx=0,cy=0){ns=clampZoom(ns);const k=ns/s;tx=cx-(cx-tx)*k;ty=cy-(cy-ty)*k;s=ns;fit=false;layout()}
 const center=e=>{const p=(e.target.closest?.('.iv-pane')||panes()[0]).getBoundingClientRect();return[e.clientX-p.left-p.width/2,e.clientY-p.top-p.height/2]};
 function setPos(e){const f=stage.querySelector('.iv-frame');if(!f)return;const r=f.getBoundingClientRect();pos=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100));layout()}
 function stats(){const box=el.querySelector('[data-iv-stats]'),dl=el.querySelector('[data-iv-dl]');if(!d){box.innerHTML='';dl.hidden=true;return}
  const b=d.before,a=d.after,cell=(k,v,x='')=>`<div class="iv-stat ${x}"><small>${k}</small><b>${v}</b></div>`,arrow=(p,q)=>a?`${esc(p)} <i>→</i> ${esc(q)}`:esc(p);
  const sv=a?savedText(b.size,a.size):'';
  box.innerHTML=cell('Dimensions',arrow(`${b.w}×${b.h}`,a?`${a.w}×${a.h}`:''))+cell('File size',arrow(bytes(b.size),a?bytes(a.size):''))+cell('Saved',a?sv:'—',a?(a.size<=b.size?'iv-good':'iv-bad'):'')+cell('Format',arrow(fmtName(b.type),a?fmtName(a.type):''));
  if(a&&(d.download||onDownload)){dl.hidden=false;dl.textContent=`Download ${d.name||''}${d.name?' · ':''}${bytes(a.size)}`;if(d.download){dl.href=d.download;dl.download=d.name||'image'}else{dl.removeAttribute('href');dl.removeAttribute('download')}}else{dl.hidden=true;dl.removeAttribute('href')}
  el.querySelectorAll('[data-iv-mode]').forEach(x=>{const need=x.dataset.ivMode!=='before';x.disabled=need&&!a;x.setAttribute('aria-pressed',String(x.dataset.ivMode===(a?mode:'before')))})}
 el.querySelector('[data-iv-dl]').addEventListener('click',e=>{if(!e.currentTarget.getAttribute('href')){e.preventDefault();onDownload?.()}});
 el.querySelectorAll('[data-iv-mode]').forEach(x=>x.onclick=()=>{mode=x.dataset.ivMode;fit=true;tx=ty=0;stats();build()});
 el.querySelectorAll('[data-iv-z]').forEach(x=>x.onclick=()=>{const z=x.dataset.ivZ;if(z==='in')zoomTo(s*1.25);else if(z==='out')zoomTo(s/1.25);else if(z==='fit'){fit=true;tx=ty=0;layout()}else if(z==='full'){s=1;fit=false;tx=ty=0;layout()}else{bgI=(bgI+1)%3;stage.dataset.bg=['checker','dark','light'][bgI]}});
 stage.addEventListener('wheel',e=>{if(!d)return;e.preventDefault();const[cx,cy]=center(e);zoomTo(s*Math.exp(-Math.max(-60,Math.min(60,e.deltaY))*.004),cx,cy)},{passive:false});
 stage.addEventListener('dblclick',e=>{if(!d)return;const[cx,cy]=center(e);if(fit||Math.abs(s-1)>1e-6)zoomTo(1,cx,cy);else{fit=true;tx=ty=0;layout()}});
 stage.addEventListener('pointerdown',e=>{if(!d||e.button>0)return;stage.setPointerCapture?.(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){const[p,q]=[...ptrs.values()];drag={pinch:Math.hypot(p[0]-q[0],p[1]-q[1]),s0:s};return}
  const slide=mode==='compare'&&d.after&&(e.target.closest('.iv-handle')||!stage.classList.contains('iv-pannable'));
  drag={slide,x:e.clientX,y:e.clientY,tx,ty};if(slide)setPos(e)});
 stage.addEventListener('pointermove',e=>{if(!drag||!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(drag.pinch&&ptrs.size===2){const[p,q]=[...ptrs.values()],dist=Math.hypot(p[0]-q[0],p[1]-q[1]);const r=stage.getBoundingClientRect();zoomTo(drag.s0*dist/drag.pinch,(p[0]+q[0])/2-r.left-r.width/2,(p[1]+q[1])/2-r.top-r.height/2);return}
  if(drag.slide)return setPos(e);tx=drag.tx+e.clientX-drag.x;ty=drag.ty+e.clientY-drag.y;layout()});
 const up=e=>{ptrs.delete(e.pointerId);if(!ptrs.size)drag=null};stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
 stage.addEventListener('keydown',e=>{if(!d)return;const k=e.key;if(e.target.closest('.iv-handle')&&(k==='ArrowLeft'||k==='ArrowRight')){pos=Math.max(0,Math.min(100,pos+(k==='ArrowLeft'?-5:5)));layout();e.preventDefault()}else if(k==='+'||k==='='){zoomTo(s*1.25);e.preventDefault()}else if(k==='-'){zoomTo(s/1.25);e.preventDefault()}else if(k==='0'){fit=true;tx=ty=0;layout()}else if(k==='1'){s=1;fit=false;tx=ty=0;layout()}});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>layout()).observe(stage);
 stage.addEventListener('load',()=>layout(),true);
 const api={el,
  // data: {before:{url,w,h,size,type}, after:{...}|null, name, download:url|undefined}
  set(next,{keepView=true}={}){const same=d&&next&&d.before.url===next.before.url;d=next;if(!same||!keepView){fit=true;tx=ty=0}if(!d?.after&&mode!=='before')mode=d?'compare':mode;stats();build()},
  clear(){d=null;stats();build()},
  get mode(){return mode},get zoom(){return s},get fitted(){return fit}};
 api.set(null);return api}
