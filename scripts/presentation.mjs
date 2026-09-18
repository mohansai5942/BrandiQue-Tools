import {readdir, readFile, writeFile} from 'node:fs/promises';
import {tools} from '../src/tools.mjs';
import {header,footer,home,directory,card} from './design.mjs';

const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const connections = {
  'image-resizer':['image-compressor','screenshot-editor','image-to-pdf'],
  'image-compressor':['image-resizer','image-to-pdf','screenshot-editor'],
  'screenshot-editor':['image-resizer','image-compressor','image-to-pdf'],
  'resume-ats-checker':['document-format-converter','pdf-merger','word-counter','document-converter'],
  'json-formatter':['json-validator','document-converter','base64-encoder-decoder','url-encoder-decoder'],
  'json-validator':['json-formatter','document-converter','base64-encoder-decoder'],
  'word-counter':['case-converter','resume-ats-checker','document-converter'],
  'case-converter':['word-counter','document-converter','url-encoder-decoder'],
  'color-converter':['screenshot-editor','image-resizer','image-compressor'],
  'timestamp-converter':['age-calculator','json-formatter','unit-converter'],
  'password-generator':['base64-encoder-decoder','qr-code-generator','url-encoder-decoder'],
  'qr-code-generator':['url-encoder-decoder','image-resizer','image-to-pdf'],
  'base64-encoder-decoder':['url-encoder-decoder','json-formatter','file-converter'],
  'url-encoder-decoder':['base64-encoder-decoder','qr-code-generator','json-formatter'],
  'file-converter':['document-converter','image-compressor','document-format-converter','video-to-audio'],
  'document-format-converter':['document-converter','pdf-splitter','resume-ats-checker']
};
function related(tool) {
  const preferred = connections[tool.slug] || [];
  const candidates = [...preferred.map(slug => tools.find(t => t.slug === slug)), ...tools.filter(t => t.category === tool.category)];
  return [...new Map(candidates.filter(t => t && t.slug !== tool.slug).map(t => [t.slug,t])).values()].slice(0,4);
}
const strip = `<div class="site-trust" aria-label="Platform benefits"><span>No login</span><span>Local processing</span><a href="https://www.brandique.in" target="_blank" rel="noopener noreferrer">Designed by BrandiQue Web Solutions <span aria-hidden="true">↗</span></a><span>Free to use</span></div>`;
const recommendations = tool => `<section class="section wrap related-tools" aria-labelledby="related-heading"><div class="section-title"><div><span class="eyebrow">KEEP THE MOMENTUM</span><h2 id="related-heading">Your next useful tool.</h2></div><a class="text-link" href="/tools/">Explore all tools ↗</a></div><div class="grid">${related(tool).map(card).join('')}</div></section>`;
async function enhance(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = `${dir}/${entry.name}`;
    if (entry.isDirectory()) { await enhance(file); continue; }
    if (!file.endsWith('.html')) continue;
    let html = await readFile(file, 'utf8');
    const slug = html.match(/rel="canonical" href="https:\/\/tools\.brandique\.in\/tools\/([^/]+)\//)?.[1];
    const tool = tools.find(t => t.slug === slug);
    html = html.replace('<body', '<body data-ui="compact"');
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/presentation.css"><link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg"></head>');
    html = html.replace(/(<body[^>]*>)/, `$1${strip}`);
    html = html.replace(/<header[\s\S]*?<\/header>/, header);
    if (html.includes('<footer')) html = html.replace(/<footer[\s\S]*?<\/footer>/,footer);
    else html = html.replace('</main>',`</main>${footer}`);
    if (file === 'dist/index.html') html = html.replace(/(<main[^>]*>)[\s\S]*?<\/main>/,`$1${home}</main>`);
    if (file === 'dist/tools/index.html') html = html.replace(/(<main[^>]*>)[\s\S]*?<\/main>/,`$1${directory}</main>`);
    html = html.replace(/<aside class="ad">[\s\S]*?<\/aside>/g,'').replace(/<div class="wrap ad">[\s\S]*?<\/div>/g,'');
    html = html.replace('</body>','<script type="module" src="/assets/site-shell.js"></script></body>');
    if (tool) {
      // Replace legacy recommendation blocks so each page gets one relevant set.
      html = html.replace(/<section\b[^>]*>\s*<h2>(?:Related tools|Try our other tools)<\/h2>[\s\S]*?<\/section>/gi, '');
      html = html.replace('</main>', `${recommendations(tool)}</main>`);

      const headBar = `<div class="head-bar"><p class="head-crumbs"><a href="/">Home</a> / <a href="/tools/">Tools</a> / ${escape(tool.name)}</p><button type="button" class="btn-share" data-share-tool aria-label="Share ${escape(tool.name)}" title="Share this tool"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg><span class="share-btn-text">Share</span></button></div>`;
      if (/<section class="head wrap">\s*<p><a href="\/"/i.test(html)) {
        html = html.replace(/<section class="head wrap">\s*<p><a href="\/">[\s\S]*?<\/p>/i, `<section class="head wrap">${headBar}`);
      } else if (html.includes('<section class="head wrap">')) {
        html = html.replace('<section class="head wrap">', `<section class="head wrap">${headBar}`);
      }
    }
    await writeFile(file, html);
  }
}
await enhance('dist');
console.log('Applied compact presentation, trust strip and related tools to all HTML pages');
