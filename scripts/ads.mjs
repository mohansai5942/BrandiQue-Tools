import {readFile,writeFile,readdir} from 'node:fs/promises';
const client='ca-pub-9587188804206049';
const unit=(kind,extra='')=>{
 const attrs={display:'data-ad-slot="1781948278" data-ad-format="auto" data-full-width-responsive="true"',feed:'data-ad-slot="2366860495" data-ad-format="fluid" data-ad-layout-key="-ef+6k-30-ac+ty"',article:'data-ad-slot="9328856681" data-ad-format="fluid" data-ad-layout="in-article"',multiplex:'data-ad-slot="2426738115" data-ad-format="autorelaxed"'};
 return `<aside class="ad-placement ad-${kind} ${extra}" aria-label="Advertisements"><span class="ad-label">Advertisements</span><ins class="adsbygoogle" style="display:block;${kind==='article'?'text-align:center;':''}" data-ad-client="${client}" ${attrs[kind]}></ins></aside>`;
};
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory()){await walk(p);continue}if(!p.endsWith('.html'))continue;let h=await readFile(p,'utf8');
 const path=new URL(h.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
 const isTool=/^\/tools\/[^/]+\/$/.test(path),directory=path==='/tools/',home=path==='/';
 h=h.replace(/<(?:aside|div) class="(?:wrap )?ad">Advertisement space<\/(?:aside|div)>/g,'');
 h=h.replace('</head>',`<meta name="google-adsense-account" content="${client}"><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script><link rel="stylesheet" href="/assets/ads.css"></head>`);
 if(isTool){
  h=h.replace(/(<section class="head wrap">[\s\S]*?<\/section>)/,`$1<div class="wrap">${unit('display','ad-banner')}</div>`);

  h=h.replace(/(<section class="section wrap cols">)([\s\S]*?)(<\/section>)/,(all,start,body,end)=>{return start+body+unit('article','ad-editorial')+end});
  // Side inventory accompanies editorial recommendations, never the upload/download controls.
  h=h.replace(/<section class="section wrap related-tools"([\s\S]*?)<\/section>/,(_,rest)=>`<div class="wrap ad-related-layout"><section class="section wrap related-tools"${rest}</section>${unit('display','ad-side')}</div>`);
  h=h.replace('</main>',`<div class="wrap">${unit('multiplex')}</div></main>`);
 }else if(directory){
  let count=0;h=h.replace(/<a class="card"[\s\S]*?<\/a>/g,card=>card+(++count===8?unit('feed','ad-catalog'):''));
  h=h.replace('</main>',`<div class="wrap">${unit('display','ad-banner')}</div></main>`);
 }else if(home){
  h=h.replace(/(<section class="benefit-bar">[\s\S]*?<\/section>)/,`$1<div class="wrap">${unit('display','ad-banner')}</div>`);
  h=h.replace('</main>',`<div class="wrap">${unit('multiplex')}</div></main>`);
 }else{h=h.replace('</main>',`<div class="wrap">${unit('display','ad-banner')}</div></main>`)}
 if(path==='/privacy/')h=h.replace('</article>',`<h2>Advertising and cookies</h2><p>This site uses Google AdSense to display advertisements. Google and its partners may use cookies and similar technologies, IP addresses and device information to deliver, measure and personalize ads, subject to your consent and applicable settings. File processing stays in your browser; selected document contents are not intentionally sent to an advertising service.</p><p>Learn <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from partner sites</a> and manage personalization at <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">My Ad Center</a>. Where a consent message is available, use it to manage your advertising choices.</p></article>`);
 h=h.replace('</body>','<script type="module" src="/assets/ads.js"></script></body>');await writeFile(p,h);
}}
await walk('dist');
await writeFile('dist/ads.txt','google.com, pub-9587188804206049, DIRECT, f08c47fec0942fa0\n');
console.log('AdSense: shared loader, responsive display, in-feed, in-article and multiplex placements');
