import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {tools,legal} from '../src/tools.mjs';
import {siteOrigin,previousOrigin,futureOrigin} from '../src/site.mjs';
const origin=siteOrigin(),paths=['/','/tools/',...tools.map(t=>`/tools/${t.slug}/`),...legal.map(([s])=>`/${s}/`)];
const sitemap=await readFile('dist/sitemap.xml','utf8'),titles=new Set();
assert.equal([...sitemap.matchAll(/<loc>/g)].length,paths.length);
for(const path of paths){
 const html=await readFile(`dist${path}index.html`,'utf8');
 for(const regex of [/<title>/g,/<meta name="description"/g,/<link rel="canonical"/g,/<meta property="og:url"/g,/<script type="application\/ld\+json"/g,/<h1\b/g])assert.equal([...html.matchAll(regex)].length,1,`${path}: ${regex}`);
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert(!titles.has(title),`Duplicate title ${title}`);titles.add(title);
 assert(html.includes(`rel="canonical" href="${origin}${path}"`));assert(sitemap.includes(`<loc>${origin}${path}</loc>`));
 assert(!/noindex/i.test(html));
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert(schema['@graph'].some(x=>x['@type']==='WebSite'));
 if(path.startsWith('/tools/')&&path!=='/tools/')assert(schema['@graph'].some(x=>x['@type']==='WebApplication'));
 const image=html.match(/property="og:image" content="([^"]+)"/)[1];await readFile('dist'+new URL(image).pathname);
 assert(!html.includes(origin===previousOrigin?futureOrigin:previousOrigin),`Mixed origins in ${path}`);
}
assert((await readFile('dist/robots.txt','utf8')).includes(`${origin}/sitemap.xml`));
const redirects=await readFile('dist/_redirects','utf8');
assert(redirects.includes('/tools/pdf-to-word/ /tools/document-format-converter/ 301'));
if(origin===futureOrigin)assert(redirects.includes(`${previousOrigin}/* ${futureOrigin}/:splat 301`));
console.log(`SEO QA passed: ${paths.length} unique titles, descriptions, canonicals, JSON-LD, social images and sitemap entries`);
