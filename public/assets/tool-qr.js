// QR Code Generator: content types (incl. image/video via an anonymous file host), styling, scan check, PNG/SVG/JPG.
import*as Q from'./qr-core.js';
const $=(r,s)=>r.querySelector(s),$$=(r,s)=>[...r.querySelectorAll(s)];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const loaded={};
function script(src,global){return loaded[src]||(loaded[src]=new Promise((ok,fail)=>{if(window[global])return ok(window[global]);const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>window[global]?ok(window[global]):fail(new Error('Library failed to start.'));s.onerror=()=>{delete loaded[src];fail(new Error('Could not load the QR library. Check your connection and reload.'))};document.head.append(s)}))}
const lib=()=>script('/assets/vendor/qr-code-styling.js','QRCodeStyling');
const decoder=()=>script('/assets/vendor/jsqr.js','jsQRMod');
const field=(label,input,hint='')=>`<label class="field">${label}${input}${hint?`<small class="qr-hint">${hint}</small>`:''}</label>`;
const sel=(attr,opts,v)=>`<select ${attr}>${opts.map(([k,l])=>`<option value="${k}"${k===v?' selected':''}>${l}</option>`).join('')}</select>`;
const FIELDS={
 url:field('Website or link','<input data-f="url" type="url" inputmode="url" placeholder="https://www.brandique.in" value="https://www.brandique.in">'),
 text:field('Text','<textarea data-f="text" maxlength="2000" placeholder="Any text, up to about 2,000 characters"></textarea>'),
 wifi:field('Network name (SSID)','<input data-f="ssid" autocomplete="off">')+field('Security',sel('data-f="security"',[['WPA','WPA / WPA2 / WPA3'],['WEP','WEP (old)'],['nopass','No password']],'WPA'))+field('Password','<input data-f="password" type="text" autocomplete="off" spellcheck="false">')+'<label class="qr-check"><input data-f="hidden" type="checkbox"> Hidden network</label>',
 phone:field('Phone number','<input data-f="phone" type="tel" placeholder="+91 98765 43210">'),
 email:field('Email address','<input data-f="to" type="email" placeholder="hello@example.com">')+field('Subject (optional)','<input data-f="subject">')+field('Message (optional)','<textarea data-f="body" rows="3"></textarea>'),
 sms:field('Phone number','<input data-f="number" type="tel" placeholder="+91 98765 43210">')+field('Message (optional)','<textarea data-f="message" rows="3"></textarea>'),
 whatsapp:field('WhatsApp number with country code','<input data-f="number" type="tel" placeholder="91 98765 43210">')+field('Pre-filled message (optional)','<textarea data-f="message" rows="3"></textarea>'),
 vcard:'<div class="qr-two">'+field('First name','<input data-f="first" autocomplete="given-name">')+field('Last name','<input data-f="last" autocomplete="family-name">')+'</div>'+field('Phone','<input data-f="phone" type="tel">')+field('Email','<input data-f="email" type="email">')+'<div class="qr-two">'+field('Company','<input data-f="org">')+field('Job title','<input data-f="title">')+'</div>'+field('Website','<input data-f="url" type="url">')+field('Address','<input data-f="address">')
};
const media=kind=>`<div class="uw-mode" role="group" aria-label="How to add the ${kind}"><button type="button" data-src="upload" aria-pressed="true">Upload a file</button><button type="button" class="alt" data-src="link" aria-pressed="false">Paste a link</button></div>
<div data-pane="upload">${field(`${kind==='image'?'Image':'Video'} file (max 95 MB)`,`<input data-file data-tf-hint="1" type="file" accept="${kind}/*">`)}
${field('Host',Q.HOSTS?sel('data-host',Object.entries(Q.HOSTS).map(([k,h])=>[k,h.name]),'litterbox'):'')}
<div data-expiry-wrap>${field('Link stays online for',sel('data-expiry',Q.EXPIRY,'72h'))}</div>
<p class="qr-note" data-host-note></p>
<label class="qr-check qr-consent"><input data-consent type="checkbox"> <span data-consent-text></span></label>
<button type="button" data-upload disabled>Upload &amp; create QR</button></div>
<div data-pane="link" hidden>${field(`Link to the ${kind}`,'<input data-f="link" type="url" placeholder="https://…">','Use a public link (Google Drive “Anyone with the link”, YouTube, your website…).')}</div>`;
export function mountQr(r){
 r.innerHTML=`<div class="tf-ws qr-ws" data-own="1">
 <section class="tf-col tf-a"><p class="tf-col-h">Step 1 · Content</p>
  <div class="qr-types" role="radiogroup" aria-label="QR content type">${Q.TYPES.map(([k,l],i)=>`<button type="button" role="radio" data-type="${k}" aria-checked="${i===0}" class="${i===0?'':'alt'}">${l}</button>`).join('')}</div>
  <div data-fields></div><p data-status class="status" role="status" aria-live="polite"></p></section>
 <section class="tf-col tf-b"><p class="tf-col-h">Step 2 · Design</p>
  <div class="qr-two">${field('Size (px)',sel('data-s="size"',[['256','256'],['512','512'],['768','768'],['1024','1024'],['2048','2048 (print)']],'512'))+field('Margin (px)','<input data-s="margin" type="number" min="0" max="80" value="16">')}</div>
  ${field('Dot style',sel('data-s="dots"',[['square','Square'],['rounded','Rounded'],['dots','Dots'],['classy','Classy'],['classy-rounded','Classy rounded'],['extra-rounded','Extra rounded']],'square'))}
  <div class="qr-two">${field('Dot colour','<input data-s="dark" type="color" value="#111111">')+field('Background','<input data-s="light" type="color" value="#ffffff">')}</div>
  <label class="qr-check"><input data-s="transparent" type="checkbox"> Transparent background (PNG/SVG)</label>
  <label class="qr-check"><input data-s="gradient" type="checkbox"> Gradient fill</label>
  <div class="qr-two" data-grad hidden>${field('Second colour','<input data-s="dark2" type="color" value="#7a5af8">')+field('Gradient',sel('data-s="gradientType"',[['linear','Linear'],['radial','Radial']],'linear'))}${field('Angle (°)','<input data-s="rotation" type="number" min="0" max="360" step="15" value="45">')}</div>
  <div class="qr-two">${field('Corner frame',sel('data-s="corner"',[['square','Square'],['extra-rounded','Rounded'],['dot','Circle']],'square'))+field('Corner centre',sel('data-s="cornerDot"',[['square','Square'],['dot','Circle']],'square'))}</div>
  <div class="qr-two">${field('Frame colour','<input data-s="eye" type="color" value="#111111">')+field('Centre colour','<input data-s="eyeDot" type="color" value="#111111">')}</div>
  ${field('Centre logo (optional)','<input data-logo type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml">','A logo switches error correction to High so the code still scans.')}
  <div class="qr-two" data-logo-opts hidden>${field('Logo size',sel('data-s="logoSize"',[['0.2','Small'],['0.3','Medium'],['0.4','Large']],'0.3'))}<button type="button" class="alt" data-logo-clear>Remove logo</button></div>
  ${field('Error correction',sel('data-s="level"',[['L','Low (7%)'],['M','Medium (15%)'],['Q','Quartile (25%)'],['H','High (30%)']],'M'),'Higher survives damage and logos but makes a denser code.')}
  <p class="qr-warn" data-contrast hidden></p></section>
 <section class="tf-col tf-r"><p class="tf-col-h">Step 3 · Preview &amp; download</p>
  <div class="tf-proc" hidden aria-live="polite"><div class="tf-proc-head"><span class="tf-spin" aria-hidden="true"></span><p class="tf-proc-text">Working…</p><b class="tf-proc-pct"></b></div><div class="tf-proc-bar"><span></span></div><button type="button" class="alt" data-cancel hidden>Cancel upload</button></div>
  <div class="qr-preview" data-preview><p class="qr-empty">Your QR code appears here.</p></div>
  <div class="qr-link" data-link hidden></div>
  <p class="status" data-check aria-live="polite"></p>
  <div class="actions"><button data-dl="png" disabled>Download PNG</button><button class="alt" data-dl="svg" disabled>SVG</button><button class="alt" data-dl="jpeg" disabled>JPG</button></div>
  <p class="notice">QR codes are generated in your browser. Only image/video uploads leave your device, and only after you agree.</p></section></div>`;
 let type='url',src='upload',logo='',qr=null,payload='',timer,token=0,uploadCtl=null,pending=false,lastKey='';const linkFor={image:'',video:''};
 const st=(t,c='')=>{const e=$(r,'[data-status]');e.textContent=t;e.className='status '+c};
 const proc=(on,text='',pct=null)=>{const p=$(r,'.tf-proc');p.hidden=!on;if(on)r.setAttribute('aria-busy','true');else r.removeAttribute('aria-busy');if(!on)return;$(p,'.tf-proc-text').textContent=text;$(p,'.tf-proc-pct').textContent=pct==null?'':Math.round(pct*100)+'%';$(p,'.tf-proc-bar').classList.toggle('is-indeterminate',pct==null);$(p,'.tf-proc-bar span').style.width=pct==null?'':pct*100+'%'};
 const enable=on=>$$(r,'[data-dl]').forEach(b=>b.disabled=!on);
 const state=()=>Object.fromEntries($$(r,'[data-s]').map(e=>[e.dataset.s,e.type==='checkbox'?e.checked:e.value]).concat([['logo',logo]]));
 const values=()=>{const f=Object.fromEntries($$(r,'[data-fields] [data-f]').map(e=>[e.dataset.f,e.type==='checkbox'?e.checked:e.value]));if(type==='image'||type==='video')f.link=src==='link'?f.link:linkFor[type];return f};
 const showLink=url=>{const b=$(r,'[data-link]');if(!url){b.hidden=true;b.innerHTML='';return}b.hidden=false;b.innerHTML=`<span>Link in this QR</span><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url)}</a><button type="button" class="alt" data-copy-link>Copy link</button>`;$(b,'[data-copy-link]').onclick=async()=>{try{await navigator.clipboard.writeText(url);st('Link copied.','success')}catch{st('Copy unavailable — select the link and copy it.','error')}}};
 function hostUi(){const h=Q.HOSTS[$(r,'[data-host]').value];$(r,'[data-expiry-wrap]').hidden=$(r,'[data-host]').value!=='litterbox';$(r,'[data-host-note]').textContent=h.note;$(r,'[data-consent-text]').textContent=`I understand my ${type} will be uploaded to ${h.short} to create a temporary public link, and anyone with this QR code (or the link) can view it.`;$(r,'[data-consent]').checked=false;readyUpload()}
 function readyUpload(){const f=$(r,'[data-file]')?.files?.[0];$(r,'[data-upload]').disabled=!(f&&$(r,'[data-consent]').checked)}
 function setType(t){type=t;$$(r,'[data-type]').forEach(b=>{const on=b.dataset.type===t;b.setAttribute('aria-checked',String(on));b.classList.toggle('alt',!on)});
  const box=$(r,'[data-fields]');box.innerHTML=t==='image'||t==='video'?media(t):FIELDS[t];
  if(t==='image'||t==='video'){src='upload';$$(box,'[data-src]').forEach(b=>b.onclick=()=>{src=b.dataset.src;$$(box,'[data-src]').forEach(x=>{const on=x===b;x.setAttribute('aria-pressed',String(on));x.classList.toggle('alt',!on)});$(box,'[data-pane="upload"]').hidden=src!=='upload';$(box,'[data-pane="link"]').hidden=src!=='link';schedule()});
   $(box,'[data-host]').onchange=hostUi;$(box,'[data-consent]').onchange=readyUpload;$(box,'[data-file]').onchange=()=>{const f=$(box,'[data-file]').files[0];try{if(f)Q.checkUpload(f,t);readyUpload();if(f)st(`${f.name} · ${f.size<1048576?Math.max(1,Math.round(f.size/1024))+' KB':(f.size/1048576).toFixed(1)+' MB'} ready. Tick the consent box and press Upload.`)}catch(e){$(box,'[data-file]').value='';readyUpload();st(e.message,'error')}};
   $(box,'[data-upload]').onclick=upload;hostUi()}
  schedule()}
 async function upload(){const f=$(r,'[data-file]').files[0],host=$(r,'[data-host]').value,h=Q.HOSTS[host];try{Q.checkUpload(f,type)}catch(e){return st(e.message,'error')}if(!$(r,'[data-consent]').checked)return st('Tick the consent box first.','error');
  uploadCtl=new AbortController();const cancel=$(r,'[data-cancel]');cancel.hidden=false;cancel.onclick=()=>uploadCtl?.abort();$(r,'[data-upload]').disabled=true;const t0=Date.now(),mb=f.size<1048576?`${Math.max(1,Math.round(f.size/1024))} KB`:`${(f.size/1048576).toFixed(1)} MB`;
  let sent=0,tick=setInterval(()=>{if(sent>=1)proc(true,`${h.short} is saving the file… ${Math.round((Date.now()-t0)/1000)} s`,null)},1000);proc(true,`Uploading ${mb} to ${h.short}…`,0);
  try{const url=await Q.uploadFile(f,host,{expiry:$(r,'[data-expiry]').value,signal:uploadCtl.signal,onProgress:p=>{sent=p;proc(true,`Uploading ${mb} to ${h.short}…`,p)}});linkFor[type]=url;uploadCtl=null;$(r,'[data-cancel]').hidden=true;st(`Uploaded. Temporary link: ${host==='litterbox'?`it expires in ${$(r,'[data-expiry]').selectedOptions[0].textContent}`:'Gofile removes it after a period without downloads'}. For a permanent QR, use “Paste a link” with your own hosting.`,'success');proc(false);await render()}
  catch(e){proc(false);st(e.message,'error')}finally{clearInterval(tick);cancel.hidden=true;uploadCtl=null;readyUpload()}}
 function contrastNote(s){const w=$(r,'[data-contrast]'),bg=s.transparent?'#ffffff':s.light,cols=[s.dark,s.gradient?s.dark2:null,s.eye,s.eyeDot].filter(Boolean),low=Math.min(...cols.map(c=>Q.contrast(c,bg)));const inv=cols.some(c=>Q.contrast(c,'#000000')>Q.contrast(bg,'#000000'));
  w.hidden=low>=3&&!inv;w.textContent=inv?'Dots are lighter than the background — many scanners cannot read inverted codes. Use dark dots on a light background.':low<3?`Low contrast (${low.toFixed(1)}:1) — some scanners may fail. Aim for at least 4:1.`:'';}
 // Decode the design at two sizes (a phone-like 400 px and the export size) on white; pass only if both decode exactly.
 async function scanAt(Lib,jsQR,opts,px){const bg=opts.backgroundOptions.color.startsWith('rgba')?'#ffffff':opts.backgroundOptions.color,c=new Lib({...opts,width:px,height:px,type:'canvas',backgroundOptions:{color:bg}}),bmp=await createImageBitmap(await c.getRawData('png')),cv=document.createElement('canvas');cv.width=bmp.width;cv.height=bmp.height;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);g.drawImage(bmp,0,0);const img=g.getImageData(0,0,cv.width,cv.height);const hit=jsQR(img.data,img.width,img.height,{inversionAttempts:'attemptBoth'});return !!hit&&(hit.data===Q.fromQrBytes(opts.data)||Q.fromQrBytes(String.fromCharCode(...hit.binaryData))===Q.fromQrBytes(opts.data))}
 async function scanCheck(opts){try{const Lib=await lib(),jsQR=await decoder();for(const px of[...new Set([400,Math.max(300,Math.min(1024,opts.width))])])if(!await scanAt(Lib,jsQR,opts,px))return false;return true}catch{return null}}
 async function render(){pending=false;clearTimeout(timer);const my=++token;lastKey=keyOf();let data;try{data=Q.buildPayload(type,values())}catch(e){payload='';qr=null;enable(false);showLink('');$(r,'[data-preview]').innerHTML=`<p class="qr-empty">${esc(e.message)}</p>`;st(e.message,/^(Enter|Upload)/.test(e.message)?'':'error');$(r,'[data-check]').textContent='';if(!uploadCtl)proc(false);return}
  const s=state();contrastNote(s);$(r,'[data-grad]').hidden=!s.gradient;$(r,'[data-logo-opts]').hidden=!logo;{const lv=$(r,'[data-s="level"]');if(logo&&!lv.disabled){lv.dataset.prev=lv.value;lv.value='H'}else if(!logo&&lv.disabled&&lv.dataset.prev){lv.value=lv.dataset.prev;delete lv.dataset.prev}lv.disabled=!!logo;}/* UTIL-07: show the High level a logo forces */
  proc(true,'Generating your QR code…');
  try{const Lib=await lib();if(my!==token)return;const opts=Q.styleOptions(s,data);qr=new Lib(opts);payload=data;const box=$(r,'[data-preview]');box.replaceChildren();qr.append(box);box.classList.toggle('is-transparent',!!s.transparent);
   showLink(/^https?:/.test(data)?data:'');enable(true);proc(true,'Scan-testing the code…');const ok=await scanCheck(opts);if(my!==token)return;if(!uploadCtl)proc(false);
   const chk=$(r,'[data-check]');chk.textContent=ok?'✓ Scan-tested in your browser: this code decodes to exactly your content.':ok===false?'⚠ This design did not decode in our scan test. Increase contrast, use a smaller logo, plain square corners or a higher error-correction level.':'Preview ready. Test it with your phone camera before printing.';chk.className='status '+(ok===false?'error':ok?'success':'');
   st(data.length>1200?`Large content (${data.length} characters) makes a dense code — keep it short for easier scanning.`:'QR code ready.',data.length>1200?'error':'success')}
  catch(e){enable(false);st(e.message||'Could not create this QR code.','error')}finally{if(my===token&&!uploadCtl)proc(false)}}
 const keyOf=()=>JSON.stringify([type,src,values(),state()]);
 function schedule(){if(keyOf()===lastKey&&!pending)return;pending=true;clearTimeout(timer);timer=setTimeout(render,250)}
 $$(r,'[data-type]').forEach(b=>b.onclick=()=>setType(b.dataset.type));
 r.addEventListener('input',e=>{if(e.target.closest('[data-fields],.tf-b')&&!e.target.matches('[data-file],[data-logo],[data-consent]'))schedule()});
 r.addEventListener('change',e=>{if(e.target.matches('[data-s],[data-f]'))schedule()});
 $(r,'[data-logo]').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>2*1048576){e.target.value='';return st('Use a logo up to 2 MB.','error')}const fr=new FileReader();fr.onload=()=>{logo=fr.result;schedule()};fr.readAsDataURL(f)};
 $(r,'[data-logo-clear]').onclick=()=>{logo='';$(r,'[data-logo]').value='';schedule()};
 $$(r,'[data-dl]').forEach(b=>b.onclick=async()=>{if(pending)await render();if(!qr)return;const ext=b.dataset.dl,s=state();try{const Lib=await lib(),o=Q.styleOptions(s,payload);if(ext==='jpeg'&&s.transparent)o.backgroundOptions={color:'#ffffff'};if(ext==='svg')o.type='svg';const blob=await new Lib(o).getRawData(ext),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`brandique-qr.${ext==='jpeg'?'jpg':ext}`;a.dataset.googleVignette='false';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);st(`Downloaded ${a.download}.`,'success')}catch(e){st('Download failed: '+(e.message||e),'error')}});
 setType('url');
}
