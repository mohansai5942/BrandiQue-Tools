import {readFile,writeFile,readdir,rm,mkdir} from 'node:fs/promises';
import {card} from './design.mjs';
import {collections,extraPaths} from '../src/seo-content.mjs';
import {tools,legal} from '../src/tools.mjs';
import {siteOrigin,previousOrigin} from '../src/site.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin=siteOrigin();
const canonicalPaths=[...extraPaths,'/','/tools/',...tools.map(t=>`/tools/${t.slug}/`),...legal.map(([s])=>`/${s}/`)];
const titles={
 'image-resizer':'Free Image Resizer Online – JPG, PNG & WebP',
 'image-compressor':'Free Image Compressor – Reduce Image File Size',
 'document-format-converter':'Document Format Converter – PDF, Word & Excel',
 'pdf-merger':'Merge PDF Files Online Free – PDF Merger',
 'pdf-splitter':'Split PDF Online – Extract Pages & Page Ranges',
 'pdf-compressor':'PDF Optimizer – Optimize PDF Files Locally',
 'resume-ats-checker':'Free Resume ATS Score Checker – PDF & DOCX',
 'file-converter':'Free File Converter – Supported Images & Text',
 'word-counter':'Free Word Counter – Words, Characters & Reading Time',
 'emi-calculator':'EMI Calculator – Monthly Loan Payments & Interest'
};
const org={'@type':'Organization','@id':`${origin}/#organization`,name:'BrandiQue Web Solutions',url:'https://www.brandique.in'};
const website={'@type':'WebSite','@id':`${origin}/#website`,url:origin+'/',name:'BrandiQue Tools',alternateName:'BrandiQue',publisher:{'@id':org['@id']},inLanguage:'en'};
const redirects=new Map((await readFile('public/_redirects','utf8')).trim().split('\n').map(l=>{const [a,b]=l.split(/\s+/);return[a,b]}));
// Generate crawlable category hubs and a human-readable sitemap from the live registry.
const shell=await readFile('dist/tools/index.html','utf8');
const links=items=>`<ul>${items.map(t=>`<li><a href="/tools/${t.slug}/">${esc(t.name)}</a> — ${esc(t.description)}</li>`).join('')}</ul>`;
for(const path of extraPaths){
 const c=collections.find(([slug])=>path===`/collections/${slug}/`);
 const body=c?`<section class="section wrap"><p><a href="/">Home</a> / <a href="/tools/">Tools</a> / ${esc(c[1])}</p><h1>${esc(c[2])}</h1><p class="lead">${esc(c[3])}</p><div class="catalog-meta"><h2>${esc(c[1])}</h2><span>${tools.filter(t=>t.category===c[1]).length} tools</span></div><div class="grid">${tools.filter(t=>t.category===c[1]).map(card).join('')}</div></section>`:`<section class="section wrap"><h1>BrandiQue Tools Sitemap</h1><p>Browse every tool by category. All tools are free to use without an account.</p>${collections.map(([slug,name])=>`<h2><a href="/collections/${slug}/">${name}</a></h2>${links(tools.filter(t=>t.category===name))}`).join('')}<h2>Website information</h2><ul>${legal.map(([slug,title])=>`<li><a href="/${slug}/">${title}</a></li>`).join('')}</ul><p><a href="/sitemap.xml">XML sitemap for search engines</a> · <a href="/sitemap.txt">Plain-text sitemap</a></p></section>`;
 await mkdir('dist'+path,{recursive:true});
 await writeFile('dist'+path+'index.html',shell.replace(/<main\b[^>]*>[\s\S]*?<\/main>/,`<main id="main">${body}</main>`).replace(/(<link rel="canonical" href=")[^"]+/,`$1${origin}${path}`));
}
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=`${dir}/${entry.name}`;if(entry.isDirectory()){await walk(file);continue}if(!file.endsWith('.html'))continue;
 if(entry.name==='converter-template.html'){await rm(file);continue}
 let html=await readFile(file,'utf8');
 const old=html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/)?.[1];
 if(!old)throw Error(`Missing canonical in ${file}`);
 let path=new URL(old).pathname;
 if(path==='/screenshot-editor.html')path='/tools/screenshot-editor/';
 if(!canonicalPaths.includes(path))throw Error(`Unknown canonical ${path}`);
 const collection=collections.find(([slug])=>path===`/collections/${slug}/`);
 const url=origin+path,tool=tools.find(t=>path===`/tools/${t.slug}/`);
 const title=(collection?collection[2]:path==='/sitemap/'?'Website Sitemap':tool?(titles[tool.slug]||`${tool.name} Online Free`):path==='/'?'Free Online Tools for Images, PDFs & Everyday Work':path==='/tools/'?'All Free Online Tools – Images, PDF & Calculators':legal.find(([s])=>path===`/${s}/`)?.[1])+' | BrandiQue';
 const description=collection?.[3]||(path==='/sitemap/'?'Browse every free BrandiQue tool by category, including images, PDF, documents, video, calculators and developer utilities.':null)||tool?.description||(path==='/'?'Free online image, PDF, document, video and calculator tools. Process files locally in your browser, with no login. Built by BrandiQue Web Solutions.':path==='/tools/'?`Browse ${tools.length} free tools for resizing images, merging PDFs, checking resumes, converting files and calculating. No login; local browser processing.`:html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
 const name=collection?.[1]||(path==='/sitemap/'?'Sitemap':null)||tool?.name||(path==='/'?'BrandiQue Tools':path==='/tools/'?'All tools':legal.find(([s])=>path===`/${s}/`)?.[1]);
 const graph=[org,website,{'@type':(path==='/tools/'||collection||path==='/sitemap/')?'CollectionPage':'WebPage','@id':url+'#page',url,name:title,description,isPartOf:{'@id':website['@id']},inLanguage:'en',publisher:{'@id':org['@id']}}];
 if(path!=='/')graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{name:'Home',item:origin+'/'},...(tool?[{name:'Tools',item:origin+'/tools/'}]:[]),{name,item:url}].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))});
 if(tool){graph[2].mainEntity={'@id':url+'#app'};graph.push({'@type':'WebApplication','@id':url+'#app',name:tool.name,url,description,applicationCategory:['Image Tools','Video Tools'].includes(tool.category)?'MultimediaApplication':tool.category==='Calculators'?'UtilitiesApplication':'BusinessApplication',operatingSystem:'Web browser',browserRequirements:'Requires JavaScript and a current web browser.',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':org['@id']}})}
 if(path==='/tools/'||collection)graph.push({'@type':'ItemList',name:'BrandiQue tool directory',numberOfItems:(collection?tools.filter(t=>t.category===collection[1]):tools).length,itemListElement:(collection?tools.filter(t=>t.category===collection[1]):tools).map((t,i)=>({'@type':'ListItem',position:i+1,name:t.name,url:origin+`/tools/${t.slug}/`}))});
 html=html.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name="(?:description|robots|twitter:[^"]+|google-site-verification|msvalidate.01)"|property="og:[^"]+")[^>]*>/gi,'').replace(/<link\b[^>]*rel="canonical"[^>]*>/gi,'').replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,'');
 const tags=`<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="BrandiQue Tools"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/brandique-social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="BrandiQue Tools — free tools, local processing, no login"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/assets/brandique-social.png"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>`;
 const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || 'yabpCgv5BOpOpfkzwsekwwHq1DGyhdGIsjG_UHh5Wb4';
 const verification = googleVerification ? `<meta name="google-site-verification" content="${esc(googleVerification)}">` : '';
 html=html.replace('</head>',tags+verification+'</head>');
 // Retain readable HTML and working tools; consolidate historical duplicate URLs.
 const actual='/'+file.slice('dist/'.length);
 if(!actual.endsWith('/index.html')&&actual!=='/index.html'){
 redirects.set(actual,path);redirects.set(actual.replace(/\.html$/,''),path);
 }else if(actual!==path+'index.html')redirects.set(actual.replace(/index\.html$/,''),path);
 if(tool){const c=collections.find(x=>x[1]===tool.category);html=html.replace('</main>',`<section class="section wrap"><p>Explore more <a href="/collections/${c[0]}/">${esc(c[1].toLowerCase())}</a>, or browse the <a href="/sitemap/">complete tool sitemap</a>.</p></section></main>`)}
 html=html.replace('<a href="/privacy/">Privacy policy</a>','<a href="/sitemap/">Sitemap</a><a href="/privacy/">Privacy policy</a>');
 await writeFile(file,html);
 }}
await walk('dist');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalPaths.map(p=>`  <url><loc>${esc(origin+p)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/sitemap.txt',canonicalPaths.map(p=>origin+p).join('\n')+'\n');
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
// Workers static-asset redirect sources must be relative paths.
// Configure old-host migration separately on the old hosting account.
await writeFile('dist/_redirects',[...redirects].filter(([a,b])=>a!==b).map(([a,b])=>`${a} ${b} 301`).join('\n')+'\n');
console.log(`SEO: ${canonicalPaths.length} canonical pages at ${origin}; ${redirects.size} legacy redirects`);
