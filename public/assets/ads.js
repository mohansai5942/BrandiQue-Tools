// Queue a slot once, only when it is visible and has a measurable width.
// Tool input events never refresh ads. Ad failures must not affect tool operation.
const slots=[...document.querySelectorAll('.ad-placement')];
const queued=new WeakSet();
const pending=new Set();
function queue(slot){
 if(queued.has(slot)||slot.getBoundingClientRect().width<100||!slot.getClientRects().length)return;
 const template=slot.querySelector('template[data-ad-template]');
 if(!template)return;
 slot.append(template.content.cloneNode(true));template.remove();
 queued.add(slot);pending.delete(slot);
 try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch{slot.classList.add('ad-unavailable')}
}
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
 for(const entry of entries)if(entry.isIntersecting){pending.add(entry.target);queue(entry.target);if(queued.has(entry.target))observer.unobserve(entry.target)}
},{rootMargin:'200px 0px'}):null;
for(const slot of slots){if(observer)observer.observe(slot);else{pending.add(slot);queue(slot)}}
if('ResizeObserver' in window){const resize=new ResizeObserver(()=>{for(const slot of pending)queue(slot)});for(const slot of slots)resize.observe(slot)}
// Tool pages: links added after load (search results, download buttons) also opt out of vignettes.
if(document.body?.hasAttribute('data-tool-page')&&'MutationObserver' in window){const stamp=root=>{for(const a of root.querySelectorAll?.('a:not([data-google-vignette])')||[])a.setAttribute('data-google-vignette','false');if(root.matches?.('a:not([data-google-vignette])'))root.setAttribute('data-google-vignette','false')};stamp(document);new MutationObserver(list=>{for(const m of list)for(const n of m.addedNodes)if(n.nodeType===1)stamp(n)}).observe(document.body,{childList:true,subtree:true})}
