import test from 'node:test';
import assert from 'node:assert/strict';
import {offerDownloads} from '../public/assets/live-core.js';
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.attributes={}}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=children}
 setAttribute(k,v){this.attributes[k]=v}
 querySelectorAll(selector){return this.children.flatMap(c=>[...(selector==='a'&&c.tag==='a'?[c]:[]),...c.querySelectorAll(selector)])}
 querySelector(){return this.children.find(c=>'liveOutput' in c.dataset)||null}
}
test('multiple downloads retain original file formats and revoke obsolete links',t=>{
 const made=[],revoked=[];
 t.mock.method(URL,'createObjectURL',blob=>{made.push(blob);return `blob:test-${made.length}`});
 t.mock.method(URL,'revokeObjectURL',url=>revoked.push(url));
 const before=globalThis.document;globalThis.document={createElement:tag=>new Element(tag)};t.after(()=>{globalThis.document=before});
 const root=new Element('div'),pdf=new Blob(['%PDF-test'],{type:'application/pdf'}),png=new Blob(['png-test'],{type:'image/png'});
 offerDownloads(root,[{name:'part-1.pdf',blob:pdf},{name:'page-2.png',blob:png}]);
 const links=root.querySelectorAll('a');assert.deepEqual(links.map(a=>a.download),['part-1.pdf','page-2.png']);
 assert(links.every(a=>a.textContent==='Download'));assert.deepEqual(made.map(b=>b.type),['application/pdf','image/png']);
 offerDownloads(root,[{name:'new.pdf',blob:pdf}]);assert.deepEqual(revoked,['blob:test-1','blob:test-2']);assert.equal(root.querySelectorAll('a').length,1);
});
