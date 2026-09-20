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

// Progressive Web App (PWA) Install & Service Worker Management
(()=>{
 const win = typeof window !== 'undefined' ? window : null;
 const navObj = typeof navigator !== 'undefined' ? navigator : null;
 const doc = typeof document !== 'undefined' ? document : null;
 if (!doc) return;

 const ua = (navObj?.userAgent || '').toLowerCase();
 function isMobileEnv() {
  const w = (win && typeof win.innerWidth === 'number') ? win.innerWidth : 1024;
  return w <= 820 || /android|iphone|ipad|ipod|mobile/i.test(ua);
 }
 const isIOS = /iphone|ipad|ipod/i.test(ua);

 function syncDevice() {
  if (doc.body && typeof doc.body.setAttribute === 'function') {
   doc.body.setAttribute('data-device', isMobileEnv() ? 'mobile' : 'desktop');
  }
 }
 syncDevice();
 if (win && typeof win.addEventListener === 'function') {
  win.addEventListener('resize', syncDevice);
 }

 if (win && 'serviceWorker' in (navObj || {})) {
  win.addEventListener('load', () => {
   navObj.serviceWorker.register('/sw.js').catch(() => {});
  });
 }

 let deferredPWA = null;
 const banner = doc.querySelector?.('[data-pwa-banner]');
 const dismissBtn = doc.querySelector?.('[data-pwa-dismiss]');

 const isStandalone = (win && (
  win.matchMedia?.('(display-mode: standalone)')?.matches ||
  navObj?.standalone === true
 ));

 if (isStandalone && banner) {
  banner.hidden = true;
 }

 try {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('brandique_pwa_dismissed') === '1') {
   if (banner) banner.hidden = true;
  }
 } catch {}

 dismissBtn?.addEventListener?.('click', () => {
  if (banner) banner.hidden = true;
  try {
   if (typeof localStorage !== 'undefined') {
    localStorage.setItem('brandique_pwa_dismissed', '1');
   }
  } catch {}
 });

 if (win) {
  win.addEventListener('beforeinstallprompt', e => {
   e.preventDefault();
   deferredPWA = e;
  });

  win.addEventListener('appinstalled', () => {
   deferredPWA = null;
   if (banner) banner.hidden = true;
   doc.querySelectorAll?.('[data-pwa-install]')?.forEach?.(btn => {
    btn.setAttribute?.('data-installed', 'true');
   });
  });
 }

 doc.addEventListener('click', async event => {
  const installBtn = event.target?.closest?.('[data-pwa-install]');
  if (!installBtn) return;
  if (typeof event.preventDefault === 'function') event.preventDefault();
  if (typeof closeMenu === 'function') closeMenu();

  const platform = installBtn.getAttribute?.('data-platform') || installBtn.dataset?.platform;

  if (deferredPWA) {
   try {
    await deferredPWA.prompt();
    const choice = await deferredPWA.userChoice;
    if (choice?.outcome === 'accepted') {
     deferredPWA = null;
     if (banner) banner.hidden = true;
     return;
    }
   } catch {}
  }

  showInstallGuide(platform);
 });

 function downloadAppLauncher(type = 'desktop') {
  try {
   const isDesk = type === 'desktop';
   const appTitle = isDesk ? 'BrandiQue Desktop App' : 'BrandiQue Mobile App';
   const appDesc = isDesk
    ? 'Double-click to launch BrandiQue Desktop App or pin it to your desktop / taskbar for instant offline access.'
    : 'Tap below to launch BrandiQue Mobile App. Add to your phone home screen for instant offline tools.';
   const actionText = isDesk ? 'Launch Desktop App' : 'Launch Mobile App';
   const fileName = isDesk ? 'brandique-desktop-app.html' : 'brandique-mobile-app.html';

   const launcherHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${appTitle}</title>
<meta name="theme-color" content="#111111">
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f0f0f;color:#ecece5;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:24px}
.app-box{background:#181818;border:1px solid #333;border-radius:18px;padding:32px 24px;max-width:380px;box-shadow:0 20px 60px rgba(0,0,0,.7)}
.app-icon{width:68px;height:68px;border-radius:16px;background:#f5df32;color:#111;font-size:36px;font-weight:900;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
h1{font-size:22px;margin:0 0 8px;color:#fff}
p{color:#aaa;font-size:13px;line-height:1.6;margin:0 0 24px}
a{display:block;padding:14px;background:#f5df32;color:#111;text-decoration:none;font-weight:800;font-size:14px;border-radius:9px}
</style>
</head>
<body>
<div class="app-box">
<div class="app-icon">B</div>
<h1>${appTitle}</h1>
<p>${appDesc}</p>
<a href="https://tools.brandique.in/">${actionText}</a>
</div>
<script>
location.href = "https://tools.brandique.in/";
</script>
</body>
</html>`;
   if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    const blob = new Blob([launcherHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = doc.createElement('a');
    a.href = url;
    a.download = fileName;
    doc.body.appendChild(a);
    a.click();
    setTimeout(() => {
     a.remove?.();
     URL.revokeObjectURL?.(url);
    }, 1000);
   }
  } catch {}
 }

 function showInstallGuide(preferredPlatform) {
  if (!doc.body || typeof doc.createElement !== 'function') return;

  const old = doc.getElementById?.('pwa-modal');
  if (old?.remove) old.remove();

  const modal = doc.createElement('div');
  modal.id = 'pwa-modal';
  modal.className = 'pwa-modal-backdrop';

  const modalType = (preferredPlatform === 'desktop')
   ? 'desktop'
   : (preferredPlatform === 'mobile'
      ? (isIOS ? 'ios' : 'mobile')
      : (isIOS ? 'ios' : (isMobileEnv() ? 'mobile' : 'desktop')));
  let title = 'Download BrandiQue Desktop App';
  let sub = 'Install BrandiQue Desktop App on your PC or Mac for instant offline access:';
  let steps = '';
  let btnLabel = 'Download Desktop App';

  if (modalType === 'ios') {
   title = 'Download BrandiQue Mobile App';
   sub = 'Install BrandiQue Mobile App directly on your iPhone / iPad:';
   steps = `
    <li class="pwa-modal-step">
      <span class="pwa-step-num">1</span>
      <div>Tap the <strong>Share</strong> button <svg style="display:inline;vertical-align:-2px" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> in Safari toolbar.</div>
    </li>
    <li class="pwa-modal-step">
      <span class="pwa-step-num">2</span>
      <div>Scroll down and tap <strong>Add to Home Screen</strong>.</div>
    </li>
    <li class="pwa-modal-step">
      <span class="pwa-step-num">3</span>
      <div>Tap <strong>Add</strong>. Launch BrandiQue Mobile App anytime right from your home screen!</div>
    </li>`;
   btnLabel = 'Download Mobile App';
  } else if (modalType === 'mobile') {
   title = 'Download BrandiQue Mobile App';
   sub = 'Install BrandiQue Mobile App directly on your mobile device:';
   steps = `
    <li class="pwa-modal-step">
      <span class="pwa-step-num">1</span>
      <div>Tap <strong>Download Mobile App</strong> below or browser menu (⋮ 3 dots).</div>
    </li>
    <li class="pwa-modal-step">
      <span class="pwa-step-num">2</span>
      <div>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</div>
    </li>
    <li class="pwa-modal-step">
      <span class="pwa-step-num">3</span>
      <div>Confirm <strong>Install</strong>. BrandiQue Mobile App will appear right in your app drawer!</div>
    </li>`;
   btnLabel = 'Download Mobile App';
  } else {
   title = 'Download BrandiQue Desktop App';
   sub = 'Install BrandiQue Desktop App on your PC or Mac:';
   steps = `
    <li class="pwa-modal-step">
      <span class="pwa-step-num">1</span>
      <div>Click <strong>Download Desktop App</strong> below or look for the <strong>Install</strong> icon in your browser address bar.</div>
    </li>
    <li class="pwa-modal-step">
      <span class="pwa-step-num">2</span>
      <div>Confirm <strong>Install</strong> to add BrandiQue Tools to your computer applications.</div>
    </li>
    <li class="pwa-modal-step">
      <span class="pwa-step-num">3</span>
      <div>Launch anytime right from your Desktop, Taskbar, or Applications dock!</div>
    </li>`;
   btnLabel = 'Download Desktop App';
  }

  const iconSvg = modalType === 'desktop'
   ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
   : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';

  modal.innerHTML = `
   <div class="pwa-modal-card" role="dialog" aria-modal="true" aria-labelledby="pwa-modal-title">
     <button type="button" class="pwa-modal-close-x" aria-label="Close dialog">✕</button>
     <div class="pwa-modal-header">
       <div class="pwa-modal-icon" aria-hidden="true">${iconSvg}</div>
       <div>
         <h3 id="pwa-modal-title" class="pwa-modal-title">${title}</h3>
         <p class="pwa-modal-sub">${sub}</p>
       </div>
     </div>
     <ol class="pwa-modal-steps">${steps}</ol>
     <div class="pwa-modal-actions">
       <button type="button" class="pwa-modal-btn" data-pwa-action="download-install">${btnLabel}</button>
       <button type="button" class="pwa-modal-btn pwa-modal-btn-secondary" data-pwa-modal-close>Close</button>
     </div>
   </div>`;

  const close = () => {
   modal.remove?.();
   doc.removeEventListener?.('keydown', onKey);
  };
  const onKey = e => {
   if (e.key === 'Escape') close();
  };
  modal.addEventListener?.('click', async e => {
   const actionBtn = e.target?.closest?.('[data-pwa-action="download-install"]');
   if (actionBtn) {
    if (deferredPWA) {
     try {
      await deferredPWA.prompt();
      const choice = await deferredPWA.userChoice;
      if (choice?.outcome === 'accepted') {
       deferredPWA = null;
       if (banner) banner.hidden = true;
       close();
       return;
      }
     } catch {}
    }
    const isDesk = modalType === 'desktop';
    downloadAppLauncher(isDesk ? 'desktop' : 'mobile');
    actionBtn.classList?.add?.('pwa-modal-btn-success');
    actionBtn.textContent = isDesk ? '✓ Desktop App Ready!' : '✓ Mobile App Ready!';
    return;
   }
   if (e.target === modal || e.target.closest?.('.pwa-modal-close-x') || e.target.closest?.('[data-pwa-modal-close]')) {
    close();
   }
  });
  doc.addEventListener?.('keydown', onKey);
  doc.body.appendChild(modal);
 }
})();
