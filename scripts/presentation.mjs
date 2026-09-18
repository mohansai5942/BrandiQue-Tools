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
    html = html.replace('</head>', '<link rel="stylesheet" href="/assets/presentation.css"></head>');
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
    }
    await writeFile(file, html);
  }
}
await enhance('dist');
console.log('Applied compact presentation, trust strip and related tools to all HTML pages');
