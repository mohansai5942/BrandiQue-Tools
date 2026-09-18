import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {tools,legal} from '../src/tools.mjs';
import {extraPaths} from '../src/seo-content.mjs';
for(const route of ['/','/tools/',...extraPaths,...tools.map(t=>`/tools/${t.slug}/`),...legal.map(([s])=>`/${s}/`)]){
 const html=await readFile(`dist${route}index.html`,'utf8');
 assert.equal((html.match(/<script async src="https:\/\/pagead2.googlesyndication.com/g)||[]).length,1,route);
 assert(!/Advertisement space/.test(html));
 assert(html.includes('ca-pub-9587188804206049'));
 const slots=[...html.matchAll(/data-ad-slot="(\d+)"/g)].map(m=>m[1]);assert(slots.length>0&&slots.length<=4,route);
 assert(slots.every(s=>['1781948278','2366860495','9328856681','2426738115'].includes(s)));
 for(const body of html.matchAll(/<article class="tool"[^>]*>([\s\S]*?)<\/article>/g))assert(!body[1].includes('adsbygoogle'),'Ad inside interactive tool');
}
assert((await readFile('dist/tools/index.html','utf8')).includes('data-ad-layout-key="-ef+6k-30-ac+ty"'));
assert.equal((await readFile('dist/ads.txt','utf8')).trim(),'google.com, pub-9587188804206049, DIRECT, f08c47fec0942fa0');
console.log('Ad QA passed: one loader per page, real slot IDs, ads.txt and separation from tool controls');
