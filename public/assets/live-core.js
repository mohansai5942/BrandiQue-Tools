export const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function readStorage(key,fallback){try{const x=JSON.parse(localStorage.getItem(key));return x===null?fallback:Array.isArray(fallback)?(Array.isArray(x)?x:fallback):typeof x===typeof fallback?x:fallback}catch{return fallback}}
export function writeStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Processing works even when persistence is unavailable. */}}
export function offerDownload(root,blob,name){let box=root.querySelector('[data-live-output]');if(!box){box=document.createElement('div');box.dataset.liveOutput='';box.className='live-download';root.append(box)}for(const a of box.querySelectorAll('a'))URL.revokeObjectURL(a.href);const link=document.createElement('a');link.className='btn';link.href=URL.createObjectURL(blob);link.download=name;link.textContent=`Download ${name}`;box.replaceChildren(link);box.hidden=false;return link}
// Serialize expensive work. Invalidate stale downloads immediately and debounce edits.
export function live(root,run,{ready=()=>true,delay=350,ignore='[readonly],[data-search],[data-filter]',cancel,initial=false}={}){
 let timer,busy=false,revision=0,stopped=false;
 const status=document.createElement('p');status.className='live-state';status.setAttribute('role','status');status.textContent='Live updates · changes apply automatically';root.prepend(status);
 const invalidate=()=>{root.querySelectorAll('[data-live-output], [data-result] a[download]').forEach(x=>{for(const a of x.matches('a')?[x]:x.querySelectorAll('a'))URL.revokeObjectURL(a.href);x.remove()})};
 async function flush(){if(busy||stopped||!ready())return;const token=revision;busy=true;status.textContent='Updating…';root.setAttribute('aria-busy','true');try{await run();if(token===revision&&!stopped){status.textContent='Live updates on · latest changes processed';root.querySelectorAll('[data-live-output], [data-result] a[download]').forEach(x=>x.hidden=false)}}catch(e){status.textContent=e?.message||'Unable to process this input. Try another file.';status.classList.add('error')}finally{busy=false;root.removeAttribute('aria-busy');if(token!==revision||stopped){invalidate();if(!stopped){clearTimeout(timer);timer=setTimeout(flush,delay)}}}}
 function schedule(){stopped=false;revision++;clearTimeout(timer);invalidate();status.classList.remove('error');if(busy)cancel?.();timer=setTimeout(flush,delay)}
 root.addEventListener('input',e=>{if(!e.target.matches(ignore))schedule()});root.addEventListener('change',e=>{if(!e.target.matches(ignore))schedule()});
 
 if(initial)schedule();window.addEventListener('pagehide',()=>{stopped=true;clearTimeout(timer);cancel?.();root.querySelectorAll('a[download][href^="blob:"]').forEach(a=>URL.revokeObjectURL(a.href))},{once:true});
 return{schedule,stop(){stopped=true;clearTimeout(timer);cancel?.();invalidate();status.textContent='Paused. Change a setting to resume.'},get busy(){return busy}};
}
