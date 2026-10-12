// Generates the long-form user guide (docs/USER-GUIDE.md) from the same data as the in-page guides.
// Usage: node scripts/user-guide.mjs [output-path]
import {writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {tools,categories} from '../src/tools.mjs';
import {guides,intro,faq} from '../src/tool-guides.mjs';
const base='https://tools.brandique.in';
const cell=s=>String(s).replace(/\|/g,'\\|').replace(/\n/g,' ');
const name=t=>t.name.replace(/^Free /,'');
let md=`# BrandiQue Tools — User Guide\n\nA practical guide to all ${tools.length} free tools on [tools.brandique.in](${base}/). Every option described here matches the controls on the live tool pages.\n\n`;
md+=`## Before you start\n\n- **Private by design.** ${intro.privacy}\n- **Free, no account.** ${intro.account}\n- **Works in your browser.** Use a current Chrome, Edge, Firefox or Safari. Most tools update automatically as you change a setting (“Live updates on – all changes applied”), so there is often no Start button.\n- **Install as an app.** ${intro.install}\n- **Leaving with work loaded.** After you load a file, the browser asks before you leave the page so you don’t lose your work by accident.\n- **Share.** Every tool page has a Share button (uses your phone’s share sheet, or copies the link).\n- **Find a tool.** On [All tools](${base}/tools/) type what you want to do (e.g. “word counter”, “jpg to pdf”, “emi loan”) or filter by category. Press “/” to jump to the search box.\n\n`;
md+=`## Contents\n\n${categories.map(c=>`- **${c}:** ${tools.filter(t=>t.category===c).map(t=>`[${name(t)}](#${name(t).toLowerCase().replace(/[^a-z0-9 -]/g,'').replace(/ /g,'-')})`).join(' · ')}`).join('\n')}\n- [Frequently asked questions](#frequently-asked-questions)\n\n`;
for(const c of categories){
 md+=`---\n\n## ${c}\n\n`;
 for(const t of tools.filter(x=>x.category===c)){
  const g=guides[t.slug];if(!g)throw Error(`Missing guide: ${t.slug}`);
  md+=`### ${name(t)}\n\n**URL:** [${base}/tools/${t.slug}/](${base}/tools/${t.slug}/)  \n**Formats:** ${t.formats.join(', ')}\n\n${g.summary}\n\n**How to use**\n\n${g.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\n\n**Options and controls**\n\n| Option | What it does |\n|---|---|\n${g.options.map(([k,v])=>`| ${cell(k)} | ${cell(v)} |`).join('\n')}\n\n**Output:** ${g.output}\n\n**Limits & tips**\n\n${g.tips.map(x=>`- ${x}`).join('\n')}\n- Files stay on your device; nothing is uploaded.\n\n`;
 }
}
md+=`---\n\n## Frequently asked questions\n\n${faq.map(([q,a])=>`**${q}**  \n${a}`).join('\n\n')}\n\n---\n\n*BrandiQue Tools is built by [BrandiQue Web Solutions](https://www.brandique.in). Guide generated from the site’s tool definitions (src/tool-guides.mjs).*\n`;
const out=process.argv[2]||'docs/USER-GUIDE.md';
await mkdir(dirname(out),{recursive:true});await writeFile(out,md);
console.log(`User guide: ${tools.length} tools → ${out} (${md.length} chars)`);
