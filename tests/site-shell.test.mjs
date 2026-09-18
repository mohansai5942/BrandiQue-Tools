import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../public/assets/site-shell.js',import.meta.url),'utf8');
class Element{
 constructor(dataset={},textContent=''){this.dataset=dataset;this.textContent=textContent;this.events={};this.attributes={};this.hidden=false;this.value='';this.focused=false;const classes=new Set();this.classList={toggle(c){if(classes.has(c)){classes.delete(c);return false}classes.add(c);return true},remove:c=>classes.delete(c),add:c=>classes.add(c),contains:c=>classes.has(c)}}
 addEventListener(type,fn){(this.events[type]||=[]).push(fn)}
 setAttribute(name,value){this.attributes[name]=value}
 fire(type,event={}){return Promise.all((this.events[type]||[]).map(fn=>fn(event)))}
 focus(){this.focused=true}
}
function fixture(url='https://tools.brandique.in/tools/'){
 const menu=new Element(),nav=new Element(),search=new Element(),empty=new Element(),reset=new Element(),title=new Element(),count=new Element();
 const cards=[new Element({category:'Image Tools'},'Image Resizer JPG PNG'),new Element({category:'PDF Tools'},'PDF Merger'),new Element({category:'PDF Tools'},'PDF Splitter')];
 const filters=['','Image Tools','PDF Tools'].map(categoryFilter=>new Element({categoryFilter}));
 const map={'[data-menu]':menu,'[data-nav]':nav,'[data-catalog-search]':search,'.catalog-empty':empty,'[data-reset-catalog]':reset,'[data-category-title]':title,'[data-catalog-count]':count};
 const document=new Element();document.querySelector=s=>map[s]||null;document.querySelectorAll=s=>s==='[data-catalog-card]'?cards:filters;nav.querySelectorAll=()=>[];
 const location=new URL(url),history={replaceState(_state,_title,next){location.href=next.href}};
 vm.runInNewContext(source,{document,location,history,URL,URLSearchParams});
 return{menu,nav,search,empty,reset,title,count,cards,filters,document,location};
}
test('category deep links and combined search show only matching tools',()=>{
 const f=fixture('https://tools.brandique.in/tools/?category=PDF%20Tools');
 assert.deepEqual(f.cards.map(c=>c.hidden),[true,false,false]);
 f.search.value='split';f.search.fire('input');
 assert.deepEqual(f.cards.map(c=>c.hidden),[true,true,false]);assert.equal(f.count.textContent,'1 tool');
 assert.equal(f.location.searchParams.get('q'),'split');
});
test('no results can be cleared and unknown categories recover',()=>{
 const f=fixture('https://tools.brandique.in/tools/?category=unknown&q=missing');
 assert.equal(f.empty.hidden,false);f.reset.fire('click');
 assert.equal(f.empty.hidden,true);assert.ok(f.cards.every(c=>!c.hidden));assert.equal(f.search.focused,true);assert.equal(f.location.search,'');
 f.filters[1].fire('click');assert.equal(f.title.textContent,'Image Tools');assert.equal(f.filters[1].attributes['aria-pressed'],'true');
});
test('navigation handles one toggle and closes on Escape and outside click',()=>{
 const f=fixture();let stopped=false;
 f.menu.fire('click',{stopImmediatePropagation(){stopped=true}});
 assert.equal(stopped,true);assert.equal(f.nav.classList.contains('open'),true);assert.equal(f.menu.attributes['aria-expanded'],'true');
 f.document.fire('keydown',{key:'Escape'});assert.equal(f.nav.classList.contains('open'),false);
 f.menu.fire('click',{stopImmediatePropagation(){}});f.document.fire('click',{target:{closest:()=>null}});assert.equal(f.menu.attributes['aria-expanded'],'false');
});
test('share button invokes Web Share API with tool metadata and indicates shared state',async()=>{
 const shareBtn=new Element();
 shareBtn.innerHTML='<span class="share-btn-text">Share</span>';
 const closestTarget=s=>s==='[data-share-tool]'?shareBtn:null;
 let sharedData=null;
 const navigator={
  share:async data=>{sharedData=data;return true},
  canShare:()=>true
 };
 const map={
  'meta[name="description"]':{getAttribute:()=>'Test description for tool'},
  'link[rel="canonical"]':{getAttribute:()=>'https://tools.brandique.in/tools/test-tool/'}
 };
 const document=new Element();
 document.title='Test Tool - BrandiQue';
 document.querySelector=s=>map[s]||null;
 document.querySelectorAll=()=>[];
 const location=new URL('https://tools.brandique.in/tools/test-tool/');
 vm.runInNewContext(source,{document,location,navigator,setTimeout,clearTimeout});
 await document.fire('click',{target:{closest:closestTarget},preventDefault(){}});
 assert.equal(sharedData.title,'Test Tool - BrandiQue');
 assert.equal(sharedData.text,'Test description for tool');
 assert.equal(sharedData.url,'https://tools.brandique.in/tools/test-tool/');
 assert.ok(shareBtn.innerHTML.includes('Shared!'));
 assert.equal(shareBtn.classList.contains('copied'),true);
});
test('share button falls back to clipboard when Web Share API is absent',async()=>{
 const shareBtn=new Element();
 shareBtn.innerHTML='<span class="share-btn-text">Share</span>';
 const closestTarget=s=>s==='[data-share-tool]'?shareBtn:null;
 let copiedText='';
 const navigator={
  clipboard:{
   writeText:async text=>{copiedText=text}
  }
 };
 const map={
  'meta[name="description"]':{getAttribute:()=>'Desc'},
  'link[rel="canonical"]':{getAttribute:()=>'https://tools.brandique.in/tools/image-resizer/'}
 };
 const document=new Element();
 document.title='Image Resizer';
 document.querySelector=s=>map[s]||null;
 document.querySelectorAll=()=>[];
 const location=new URL('https://tools.brandique.in/tools/image-resizer/');
 vm.runInNewContext(source,{document,location,navigator,setTimeout,clearTimeout});
 await document.fire('click',{target:{closest:closestTarget},preventDefault(){}});
 assert.equal(copiedText,'https://tools.brandique.in/tools/image-resizer/');
 assert.ok(shareBtn.innerHTML.includes('Link copied!'));
 assert.equal(shareBtn.classList.contains('copied'),true);
});

