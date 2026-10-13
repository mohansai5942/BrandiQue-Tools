// QR payload builders and file-host helpers. Pure functions: no DOM, safe to test in Node.
export const TYPES=[
 ['url','URL / link'],['text','Text'],['wifi','Wi-Fi'],['phone','Phone'],['email','Email'],
 ['sms','SMS'],['whatsapp','WhatsApp'],['vcard','Contact (vCard)'],['image','Image'],['video','Video']
];
export const MAX_UPLOAD=200*1024*1024;
// Anonymous hosts that accept browser uploads (CORS) without an account. Tested Oct 2026.
export const HOSTS={
 litterbox:{name:'Litterbox (catbox.moe)',site:'https://litterbox.catbox.moe',endpoint:'https://litterbox.catbox.moe/resources/internals/api.php',progress:false,
  note:'Direct link to the file. Temporary: it is deleted automatically after the time you pick (max 72 hours).'},
 gofile:{name:'Gofile (gofile.io)',site:'https://gofile.io',endpoint:'https://upload.gofile.io/uploadfile',progress:true,
  note:'Link opens a Gofile page where the file can be viewed or downloaded. Free files can be removed by Gofile after a period without downloads.'}
};
export const EXPIRY=[['1h','1 hour'],['12h','12 hours'],['24h','24 hours'],['72h','72 hours']];

const wifiEsc=s=>String(s).replace(/([\\;,:"])/g,'\\$1');
const vEsc=s=>String(s??'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/([,;])/g,'\\$1');
const digits=s=>String(s||'').replace(/[^\d+]/g,'').replace(/(?!^)\+/g,'');
export function normalizeUrl(value){
 let u=String(value||'').trim();if(!u)throw new Error('Enter a link.');
 if(/\s/.test(u))throw new Error('A link cannot contain spaces.');
 if(!/^[a-z][a-z0-9+.-]*:/i.test(u))u='https://'+u;
 let x;try{x=new URL(u)}catch{throw new Error('That does not look like a valid link.')}
 if(!/^https?:$/.test(x.protocol))throw new Error('Use an http:// or https:// link.');
 if(!x.hostname.includes('.')&&x.hostname!=='localhost')throw new Error('The link needs a domain such as example.com.');
 return x.href;
}
export function wifiPayload({ssid='',password='',security='WPA',hidden=false}={}){
 if(!ssid.trim())throw new Error('Enter the Wi-Fi network name (SSID).');
 const open=security==='nopass';
 if(!open&&!password)throw new Error('Enter the Wi-Fi password, or choose “No password”.');
 if(security==='WPA'&&password.length<8)throw new Error('WPA/WPA2 passwords are at least 8 characters.');
 return `WIFI:T:${open?'nopass':security};S:${wifiEsc(ssid)};${open?'':`P:${wifiEsc(password)};`}${hidden?'H:true;':''};`;
}
export function phonePayload(n){const d=digits(n);if(d.replace('+','').length<3)throw new Error('Enter a phone number.');return`tel:${d}`}
export function emailPayload({to='',subject='',body=''}={}){
 const t=to.trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))throw new Error('Enter a valid email address.');
 const q=[subject&&`subject=${encodeURIComponent(subject)}`,body&&`body=${encodeURIComponent(body)}`].filter(Boolean).join('&');
 return`mailto:${t}${q?'?'+q:''}`;
}
export function smsPayload({number='',message=''}={}){const d=digits(number);if(d.replace('+','').length<3)throw new Error('Enter the phone number to text.');return`SMSTO:${d}:${message}`}
export function whatsappPayload({number='',message=''}={}){
 const d=digits(number).replace('+','');if(d.length<8)throw new Error('Enter the WhatsApp number with country code, e.g. 91 98765 43210.');
 return`https://wa.me/${d}${message?`?text=${encodeURIComponent(message)}`:''}`;
}
export function vcardPayload(c={}){
 const first=(c.first||'').trim(),last=(c.last||'').trim();
 if(!first&&!last&&!(c.org||'').trim())throw new Error('Enter at least a name or a company.');
 const lines=['BEGIN:VCARD','VERSION:3.0',`N:${vEsc(last)};${vEsc(first)};;;`,`FN:${vEsc([first,last].filter(Boolean).join(' ')||c.org)}`];
 if(c.org)lines.push(`ORG:${vEsc(c.org)}`);if(c.title)lines.push(`TITLE:${vEsc(c.title)}`);
 if(c.phone)lines.push(`TEL;TYPE=CELL:${digits(c.phone)}`);if(c.email)lines.push(`EMAIL:${vEsc(c.email.trim())}`);
 if(c.url)lines.push(`URL:${vEsc(normalizeUrl(c.url))}`);if(c.address)lines.push(`ADR;TYPE=WORK:;;${vEsc(c.address)};;;;`);
 lines.push('END:VCARD');return lines.join('\n');
}
export function buildPayload(type,f={}){
 switch(type){
  case'url':return normalizeUrl(f.url);
  case'text':{const t=String(f.text||'');if(!t.trim())throw new Error('Enter some text.');return t}
  case'wifi':return wifiPayload(f);
  case'phone':return phonePayload(f.phone);
  case'email':return emailPayload(f);
  case'sms':return smsPayload(f);
  case'whatsapp':return whatsappPayload(f);
  case'vcard':return vcardPayload(f);
  case'image':case'video':if(!f.link)throw new Error(`Upload your ${type} or paste a link to it.`);return normalizeUrl(f.link);
  default:throw new Error('Unknown QR type.');
 }
}
export function checkUpload(file,kind){
 if(!file)throw new Error(`Choose a${kind==='image'?'n image':' video'} file.`);
 if(!String(file.type||'').startsWith(kind+'/'))throw new Error(`That file is not a${kind==='image'?'n image':' video'}.`);
 if(file.size>MAX_UPLOAD)throw new Error('Files up to 200 MB can be uploaded. Use “Paste a link” for bigger files.');
 if(!file.size)throw new Error('The file is empty.');
 return true;
}
export function parseHostResponse(host,status,body){
 if(host==='litterbox'){const t=String(body||'').trim();if(status===200&&/^https:\/\/litter\.catbox\.moe\/\S+$/.test(t))return t;throw new Error(`Litterbox did not accept the file${t?`: ${t.slice(0,120)}`:''}.`)}
 if(host==='gofile'){let j;try{j=JSON.parse(body)}catch{throw new Error('Gofile returned an unexpected answer.')}const u=j?.data?.downloadPage;if(status===200&&j.status==='ok'&&/^https:\/\/gofile\.io\//.test(u||''))return u;throw new Error(`Gofile did not accept the file (${j?.status||status}).`)}
 throw new Error('Unknown host.');
}
export function uploadForm(host,file,expiry='72h'){
 const fd=new FormData();
 if(host==='litterbox'){fd.append('reqtype','fileupload');fd.append('time',EXPIRY.some(([k])=>k===expiry)?expiry:'72h');fd.append('fileToUpload',file)}
 else fd.append('file',file);
 return fd;
}
// Upload with XHR. Gofile allows CORS preflight, so it reports byte progress; Litterbox only accepts simple
// requests (no preflight), so progress listeners must not be attached for it.
export function uploadFile(file,host,{expiry,onProgress,signal}={}){
 return new Promise((resolve,reject)=>{
  const h=HOSTS[host];if(!h)return reject(new Error('Unknown host.'));
  const x=new XMLHttpRequest();x.open('POST',h.endpoint);x.timeout=30*60*1000;
  if(h.progress&&onProgress)x.upload.onprogress=e=>{if(e.lengthComputable)onProgress(e.loaded/e.total)};
  x.onload=()=>{try{resolve(parseHostResponse(host,x.status,x.responseText))}catch(e){reject(e)}};
  x.onerror=()=>reject(new Error(`Could not reach ${h.name}. Check your connection, or try the other host.`));
  x.ontimeout=()=>reject(new Error('The upload timed out.'));x.onabort=()=>reject(new Error('Upload cancelled.'));
  signal?.addEventListener('abort',()=>x.abort(),{once:true});
  x.send(uploadForm(host,file,expiry));
 });
}
// Relative luminance contrast (WCAG) for #rrggbb colours.
export function contrast(a,b){
 const lum=h=>{const n=parseInt(h.slice(1),16),c=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return(x+.05)/(y+.05);
}
// Options object for qr-code-styling from the form state.
export function styleOptions(s,data){
 const fill=s.gradient?{gradient:{type:s.gradientType||'linear',rotation:(+s.rotation||0)*Math.PI/180,colorStops:[{offset:0,color:s.dark},{offset:1,color:s.dark2}]}}:{color:s.dark};
 const size=Math.max(128,Math.min(2048,+s.size||512));
 return{width:size,height:size,type:'canvas',data,margin:Math.max(0,Math.min(80,+s.margin||0)),
  qrOptions:{errorCorrectionLevel:s.logo?'H':(s.level||'M')},
  image:s.logo||undefined,imageOptions:{hideBackgroundDots:true,imageSize:Math.max(.1,Math.min(.4,+s.logoSize||.3)),margin:4,crossOrigin:'anonymous'},
  dotsOptions:{type:s.dots||'square',...fill},
  backgroundOptions:{color:s.transparent?'rgba(0,0,0,0)':s.light},
  cornersSquareOptions:{type:s.corner||'square',color:s.eye||s.dark},
  cornersDotOptions:{type:s.cornerDot||'square',color:s.eyeDot||s.eye||s.dark}};
}
