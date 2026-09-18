import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const template=()=>({content:{cloneNode(){return {}}},remove(){}});
const source=readFileSync(new URL('../public/assets/ads.js',import.meta.url),'utf8');
test('hidden ad slots wait for width and initialize once across repeated observer events',()=>{
 let width=0,intersect,resize;const slot={querySelector:template,append(){},classList:{add(){}},getBoundingClientRect:()=>({width}),getClientRects:()=>width?[{}]:[],closest:()=>({classList:{add(){}}})};
 const context={document:{querySelectorAll:()=>[slot]},window:{adsbygoogle:[]},IntersectionObserver:class{constructor(cb){intersect=cb}observe(){}unobserve(){}},ResizeObserver:class{constructor(cb){resize=cb}observe(){}}};
 context.window.IntersectionObserver=context.IntersectionObserver;context.window.ResizeObserver=context.ResizeObserver;
 vm.runInNewContext(source,context);intersect([{target:slot,isIntersecting:true}]);assert.equal(context.window.adsbygoogle.length,0);
 width=300;resize();resize();intersect([{target:slot,isIntersecting:true}]);assert.equal(context.window.adsbygoogle.length,1);
});
test('ad queue failure is contained instead of crashing the tool page',()=>{
 let hidden=false;const slot={querySelector:template,append(){},classList:{add(){hidden=true}},getBoundingClientRect:()=>({width:300}),getClientRects:()=>[{}],closest:()=>({classList:{add(){hidden=true}}})};
 assert.doesNotThrow(()=>vm.runInNewContext(source,{document:{querySelectorAll:()=>[slot]},window:{adsbygoogle:{push(){throw Error('blocked')}}}}));assert(hidden);
});
