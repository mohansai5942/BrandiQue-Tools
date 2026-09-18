import {readFile,writeFile,readdir,rm} from 'node:fs/promises';
import {tools,legal} from '../src/tools.mjs';
import {siteOrigin,previousOrigin} from '../src/site.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const origin=siteOrigin();
const canonicalPaths=['/','/tools/',...tools.map(t=>`/tools/${t.slug}/`),...legal.map(([s])=>`/${s}/`)];
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
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=`${dir}/${entry.name}`;if(entry.isDirectory()){await walk(file);continue}if(!file.endsWith('.html'))continue;
 if(entry.name==='converter-template.html'){await rm(file);continue}
 let html=await readFile(file,'utf8');
 const old=html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/)?.[1];
 if(!old)throw Error(`Missing canonical in ${file}`);
 let path=new URL(old).pathname;
 if(path==='/screenshot-editor.html')path='/tools/screenshot-editor/';
 if(!canonicalPaths.includes(path))throw Error(`Unknown canonical ${path}`);
 const url=origin+path,tool=tools.find(t=>path===`/tools/${t.slug}/`);
 const title=(tool?(titles[tool.slug]||`${tool.name} Online Free`):path==='/'?'Free Online Tools for Images, PDFs & Everyday Work':path==='/tools/'?'All Free Online Tools – Images, PDF & Calculators':legal.find(([s])=>path===`/${s}/`)?.[1])+' | BrandiQue';
 const description=tool?.description||(path==='/'?'Free online image, PDF, document, video and calculator tools. Process files locally in your browser, with no login. Built by BrandiQue Web Solutions.':path==='/tools/'?`Browse ${tools.length} free tools for resizing images, merging PDFs, checking resumes, converting files and calculating. No login; local browser processing.`:html.match(/<meta name="description" content="([^"]*)"/)?.[1]);
 const name=tool?.name||(path==='/'?'BrandiQue Tools':path==='/tools/'?'All tools':legal.find(([s])=>path===`/${s}/`)?.[1]);
 const graph=[org,website,{'@type':path==='/tools/'?'CollectionPage':'WebPage','@id':url+'#page',url,name:title,description,isPartOf:{'@id':website['@id']},inLanguage:'en',publisher:{'@id':org['@id']}}];
 if(path!=='/')graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{name:'Home',item:origin+'/'},...(tool?[{name:'Tools',item:origin+'/tools/'}]:[]),{name,item:url}].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))});
 if(tool){graph[2].mainEntity={'@id':url+'#app'};graph.push({'@type':'WebApplication','@id':url+'#app',name:tool.name,url,description,applicationCategory:['Image Tools','Video Tools'].includes(tool.category)?'MultimediaApplication':tool.category==='Calculators'?'UtilitiesApplication':'BusinessApplication',operatingSystem:'Web browser',browserRequirements:'Requires JavaScript and a current web browser.',isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},publisher:{'@id':org['@id']}})}
 if(path==='/tools/')graph.push({'@type':'ItemList',name:'BrandiQue tool directory',numberOfItems:tools.length,itemListElement:tools.map((t,i)=>({'@type':'ListItem',position:i+1,name:t.name,url:origin+`/tools/${t.slug}/`}))});
 html=html.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name="(?:description|robots|twitter:[^"]+|google-site-verification|msvalidate.01)"|property="og:[^"]+")[^>]*>/gi,'').replace(/<link\b[^>]*rel="canonical"[^>]*>/gi,'').replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi,'');
 const tags=`<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="BrandiQue Tools"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${origin}/assets/brandique-social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="BrandiQue Tools — free tools, local processing, no login"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/assets/brandique-social.png"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>`;
 const googleVerification = process.env.GOOGLE_SITE_VERIFICATION || 'yabpCgv5BOpOpfkzwsekwwHq1DGyhdGIsjG_UHh5Wb4';
 const verification=[['GOOGLE_SITE_VERIFICATION','google-site-verification',googleVerification],['BING_SITE_VERIFICATION','msvalidate.01',process.env.BING_SITE_VERIFICATION]].map(([key,tag,val])=>val?`<meta name="${tag}" content="${esc(val)}">`:'').join('');
 html=html.replace('</head>',tags+verification+'</head>');
 // Retain readable HTML and working tools; consolidate historical duplicate URLs.
 const actual='/'+file.slice('dist/'.length);
 if(!actual.endsWith('/index.html')&&actual!=='/index.html'){
 redirects.set(actual,path);redirects.set(actual.replace(/\.html$/,''),path);
 }else if(actual!==path+'index.html')redirects.set(actual.replace(/index\.html$/,''),path);
 await writeFile(file,html);
 }}
await walk('dist');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${canonicalPaths.map(p=>`  <url><loc>${esc(origin+p)}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
const migration=origin!==previousOrigin?`${previousOrigin}/* ${origin}/:splat 301\n`:'';
await writeFile('dist/_redirects',migration+[...redirects].filter(([a,b])=>a!==b).map(([a,b])=>`${a} ${b} 301`).join('\n')+'\n');
console.log(`SEO: ${canonicalPaths.length} canonical pages at ${origin}; ${redirects.size} legacy redirects`);
