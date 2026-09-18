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
