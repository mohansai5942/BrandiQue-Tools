import {readFile,writeFile} from 'node:fs/promises';
import {tools,categories} from '../src/tools.mjs';
// Branded 404 page built from the final site shell (header, footer, trust strip, styles).
// Static hosts serve /404.html with HTTP 404 for unknown URLs (Vercel automatically; Cloudflare
// Pages automatically; Cloudflare Workers static assets with not_found_handling = "404-page").
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const popular=['image-resizer','image-compressor','pdf-merger','resume-ats-checker','word-counter','unit-converter'].map(s=>tools.find(t=>t.slug===s));
const body=`<section class="section wrap not-found" aria-labelledby="nf-title"><span class="eyebrow">ERROR 404</span><h1 id="nf-title">Page not found.</h1><p class="lead">The page you were looking for doesn't exist or has moved. All ${tools.length} BrandiQue tools are still free and run in your browser.</p><p class="hero-actions"><a class="btn" href="/tools/">Browse all tools ↗</a> <a class="text-link" href="/">Go to the homepage</a></p><h2>Popular tools</h2><ul class="not-found-links">${popular.map(t=>`<li><a href="/tools/${t.slug}/">${esc(t.name.replace(/^Free /,''))}</a></li>`).join('')}</ul><h2>Collections</h2><ul class="not-found-links">${categories.map(c=>`<li><a href="/collections/${c.toLowerCase().replaceAll(' ','-')}/">${esc(c)}</a></li>`).join('')}</ul></section>`;
let html=await readFile('dist/tools/index.html','utf8');
html=html.replace(/(<main\b[^>]*>)[\s\S]*?<\/main>/,`$1${body}</main>`)
 .replace(/<title>[\s\S]*?<\/title>/,'<title>Page not found (404) | BrandiQue Tools</title>')
 .replace(/<meta name="description"[^>]*>/,'<meta name="description" content="This page could not be found. Browse free BrandiQue browser tools.">')
 .replace(/<meta name="robots"[^>]*>/,'<meta name="robots" content="noindex, follow">')
 .replace(/<link rel="canonical"[^>]*>/,'')
 .replace(/<meta property="og:[^>]*>/g,'').replace(/<meta name="twitter:[^>]*>/g,'')
 .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'')
 // No ads on error pages (AdSense policy: no ads on pages without publisher content).
 .replace(/<aside class="ad-placement[\s\S]*?<\/aside>/g,'').replace(/<div class="wrap"><\/div>/g,'')
 .replace(/<meta name="google-adsense-account"[^>]*>/,'').replace(/<script async src="https:\/\/pagead2\.googlesyndication\.com[^>]*><\/script>/,'')
 .replace(/<link rel="stylesheet" href="\/assets\/ads\.css">/,'').replace(/<script type="module" src="\/assets\/ads\.js"><\/script>/,'')
 .replace('<body','<body data-page="404"');
await writeFile('dist/404.html',html);
console.log('404: branded not-found page written to dist/404.html');
