import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {landings} from '../src/landing-pages.mjs';
import {tools} from '../src/tools.mjs';
import {siteOrigin} from '../src/site.mjs';
const origin=siteOrigin(),esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const today=new Date().toISOString().slice(0,10);
for(const l of landings){
 const base=await readFile(`dist/tools/${l.tool}/index.html`,'utf8'),url=`${origin}/${l.slug}/`,title=`${l.title} | BrandiQue`,toolName=tools.find(t=>t.slug===l.tool)?.name||l.h1;
 let h=base.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(title)}</title>`)
  .replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${esc(l.desc)}">`)
  .replace(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${url}">`)
  .replace(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${url}">`)
  .replace(/<meta (property="og:title"|name="twitter:title") content="[^"]*">/g,(_,a)=>`<meta ${a} content="${esc(title)}">`)
  .replace(/<meta (property="og:description"|name="twitter:description") content="[^"]*">/g,(_,a)=>`<meta ${a} content="${esc(l.desc)}">`)
  .replace(/<h1>[\s\S]*?<\/h1>(<p class="lead">)[\s\S]*?(<\/p>)/,`<h1>${esc(l.h1)}</h1>$1${esc(l.desc)}$2`);
 if(l.size)h=h.replace(/<body\b/,`<body data-preset-size="${l.size[0]}" data-preset-unit="${l.size[1]}"`);
 if(l.fields)h=h.replace(/<body\b/,`<body data-preset-fields="${esc(JSON.stringify(l.fields))}"`);
 // IMG-02: the guide heading names the landing page, not the generic tool.
 h=h.replace(/(<h2 id="guide-[^"]+">)How to use [^<]*(<\/h2>)/,`$1How to use ${esc(l.h1)}$2`);
 h=h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,(_,j)=>{const d=JSON.parse(j);d['@graph']=d['@graph'].filter(x=>!['FAQPage','HowTo'].includes(x['@type'])).map(x=>{const s=JSON.stringify(x).split(`${origin}/tools/${l.tool}/`).join(url);const o=JSON.parse(s);if(o['@type']==='WebPage')Object.assign(o,{name:title,description:l.desc});if(o['@type']==='WebApplication')Object.assign(o,{name:l.h1,description:l.desc});if(o['@type']==='BreadcrumbList')o.itemListElement=[{name:'Home',item:origin+'/'},{name:toolName,item:`${origin}/tools/${l.tool}/`},{name:l.h1,item:url}].map((x,i)=>({'@type':'ListItem',position:i+1,...x}));return o});d['@graph'].push({'@type':'FAQPage','@id':url+'#faq',mainEntity:l.q.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});return `<script type="application/ld+json">${JSON.stringify(d).replace(/</g,'\\u003c')}</script>`});
 const faq=`<section class="section wrap landing-faq"><h2>${esc(l.h1)}: questions</h2>${l.q.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<p>More options: <a href="/tools/${l.tool}/">${esc(toolName)}</a>.</p></section>`;
 h=h.replace('</main>',faq+'</main>');
 await mkdir(`dist/${l.slug}`,{recursive:true});await writeFile(`dist/${l.slug}/index.html`,h);
}
// Internal links: each tool page lists its popular searches.
for(const slug of [...new Set(landings.map(l=>l.tool))]){const f=`dist/tools/${slug}/index.html`;let h=await readFile(f,'utf8');const ls=landings.filter(l=>l.tool===slug);h=h.replace('</main>',`<section class="section wrap popular-searches"><h2>Popular searches</h2><p>${ls.map(l=>`<a href="/${l.slug}/">${esc(l.h1)}</a>`).join(' · ')}</p></section></main>`);await writeFile(f,h)}
{const f='dist/index.html';let h=await readFile(f,'utf8');h=h.replace('</main>',`<section class="section wrap popular-searches"><h2>Popular searches</h2><p>${landings.map(l=>`<a href="/${l.slug}/">${esc(l.h1)}</a>`).join(' · ')}</p></section></main>`);await writeFile(f,h)}
let xml=await readFile('dist/sitemap.xml','utf8');xml=xml.replace('</urlset>',landings.map(l=>`  <url><loc>${origin}/${l.slug}/</loc><lastmod>${today}</lastmod></url>`).join('\n')+'\n</urlset>');await writeFile('dist/sitemap.xml',xml);
let txt=await readFile('dist/sitemap.txt','utf8');txt=txt.trimEnd()+'\n'+landings.map(l=>`${origin}/${l.slug}/`).join('\n')+'\n';await writeFile('dist/sitemap.txt',txt);
console.log(`Landing pages: ${landings.length}`);
