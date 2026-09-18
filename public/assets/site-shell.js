// Own navigation at the shell level; legacy tool menu listeners are left intact.
const menu=document.querySelector('[data-menu]'),nav=document.querySelector('[data-nav]');
const closeMenu=()=>{nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')};
menu?.addEventListener('click',event=>{event.stopImmediatePropagation();const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))},true);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();if(document.activeElement?.closest('[data-nav]'))menu?.focus()}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu()});
nav?.querySelectorAll('a').forEach(a=>{if(new URL(a.href).pathname===location.pathname&&!a.hash)a.setAttribute('aria-current','page')});
const search=document.querySelector('[data-catalog-search]');
if(search){
 const cards=[...document.querySelectorAll('[data-catalog-card]')],filters=[...document.querySelectorAll('[data-category-filter]')];
 const params=new URLSearchParams(location.search);let category=params.get('category')||'';
 if(!filters.some(b=>b.dataset.categoryFilter===category))category='';
 search.value=params.get('q')||'';
 const update=()=>{
  const query=search.value.trim().toLowerCase();let count=0;
  for(const card of cards){const match=(!category||card.dataset.category===category)&&card.textContent.toLowerCase().includes(query);card.hidden=!match;if(match)count++}
  filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.categoryFilter===category)));
  document.querySelector('[data-category-title]').textContent=category||'All tools';
  document.querySelector('[data-catalog-count]').textContent=`${count} ${count===1?'tool':'tools'}`;
  document.querySelector('.catalog-empty').hidden=count>0;
  const next=new URL(location.href);next.search='';if(category)next.searchParams.set('category',category);if(query)next.searchParams.set('q',search.value.trim());history.replaceState(null,'',next);
 };
 search.addEventListener('input',update);filters.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.categoryFilter;update()}));
 document.querySelector('[data-reset-catalog]').addEventListener('click',()=>{category='';search.value='';update();search.focus()});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.target.matches('input,textarea,select,[contenteditable]')){e.preventDefault();search.focus()}});update();
}

// Share button handler using Web Share API with clipboard fallback
document.addEventListener('click',async event=>{
 const shareBtn=event.target?.closest?.('[data-share-tool]');
 if(!shareBtn)return;
 if(typeof event.preventDefault==='function')event.preventDefault();

 const title=(typeof document!=='undefined'&&document.title)||'BrandiQue Tools';
 const metaDesc=document.querySelector?.('meta[name="description"]')?.getAttribute?.('content')||'';
 const canonical=document.querySelector?.('link[rel="canonical"]')?.getAttribute?.('href');
 const url=canonical||(typeof location!=='undefined'?location.href:'');
 const text=metaDesc||title;

 const originalHtml=shareBtn._origHtml||shareBtn.innerHTML;
 shareBtn._origHtml=originalHtml;

 const resetState=(delay=2200)=>{
  clearTimeout(shareBtn._timer);
  shareBtn._timer=setTimeout(()=>{
   shareBtn.classList?.remove('shared','copied','failed');
   if(typeof shareBtn.innerHTML!=='undefined')shareBtn.innerHTML=originalHtml;
   shareBtn.removeAttribute?.('aria-busy');
  },delay);
 };

 const showSuccess=msg=>{
  shareBtn.classList?.remove('failed');
  shareBtn.classList?.add('copied');
  if(typeof shareBtn.innerHTML!=='undefined'){
   shareBtn.innerHTML=`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg><span class="share-btn-text">${msg}</span>`;
  }
  resetState();
 };

 const showFallback=async()=>{
  try{
   if(typeof navigator!=='undefined'&&navigator.clipboard?.writeText){
    await navigator.clipboard.writeText(url);
    showSuccess('Link copied!');
   }else if(typeof document!=='undefined'&&typeof document.createElement==='function'){
    const input=document.createElement('input');
    input.value=url;
    input.style.position='fixed';
    input.style.opacity='0';
    input.style.pointerEvents='none';
    document.body?.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showSuccess('Link copied!');
   }else{
    showSuccess('Link copied!');
   }
  }catch{
   shareBtn.classList?.add('failed');
   if(typeof shareBtn.innerHTML!=='undefined'){
    shareBtn.innerHTML='<span class="share-btn-text">Copy failed</span>';
   }
   resetState(1800);
  }
 };

 if(typeof navigator!=='undefined'&&typeof navigator.share==='function'){
  const data={title,text,url};
  try{
   if(!navigator.canShare||navigator.canShare(data)){
    shareBtn.setAttribute?.('aria-busy','true');
    await navigator.share(data);
    showSuccess('Shared!');
    return;
   }
  }catch(err){
   if(err&&(err.name==='AbortError'||err.name==='CancelError')){
    shareBtn.removeAttribute?.('aria-busy');
    return;
   }
   await showFallback();
   return;
  }
 }

 await showFallback();
});
