import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
import vm from 'node:vm';
import * as Q from '../public/assets/qr-core.js';
import {splitIndex, RECIPES} from '../public/assets/tool-flow.js';
import {guides} from '../src/tool-guides.mjs';

// Minimal PNG decoder (8-bit RGB/RGBA, non-interlaced) so fixtures decode without extra dependencies.
function decodePng(buf){
 let i=8,w,h,ct,idat=[];
 while(i<buf.length){const len=buf.readUInt32BE(i),type=buf.toString('ascii',i+4,i+8),data=buf.subarray(i+8,i+8+len);
  if(type==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);ct=data[9];assert.equal(data[8],8);assert.equal(data[12],0)}
  if(type==='IDAT')idat.push(data);if(type==='IEND')break;i+=12+len}
 const bpp=ct===6?4:3,raw=inflateSync(Buffer.concat(idat)),stride=w*bpp,out=new Uint8ClampedArray(w*h*4);let prev=new Uint8Array(stride);
 for(let y=0;y<h;y++){const f=raw[y*(stride+1)],line=new Uint8Array(raw.subarray(y*(stride+1)+1,(y+1)*(stride+1)));
  for(let x=0;x<stride;x++){const a=x>=bpp?line[x-bpp]:0,b=prev[x],c=x>=bpp?prev[x-bpp]:0,p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);
   line[x]=(line[x]+[0,a,b,(a+b)>>1,pa<=pb&&pa<=pc?a:pb<=pc?b:c][f])&255}
  for(let x=0;x<w;x++){const s=x*bpp,d=(y*w+x)*4,al=bpp===4?line[s+3]/255:1;for(let k=0;k<3;k++)out[d+k]=Math.round(line[s+k]*al+255*(1-al));out[d+3]=255}
  prev=line}
 return{width:w,height:h,data:out};
}
const jsQR=await(async()=>{const ctx={};vm.runInNewContext(await readFile('public/assets/vendor/jsqr.js','utf8')+';this.jsQR=jsQRMod;',ctx);return ctx.jsQR})();

test('styled QR fixtures made by the generator scan back to their exact content', async () => {
  const expect = {
    url: 'https://www.brandique.in/',
    wifi: Q.wifiPayload({ssid: 'BrandiQue Office', password: 'secret;pass1'}),
    vcard: Q.vcardPayload({first: 'Mohan', last: 'Rao', phone: '+91 70933 20572', org: 'BrandiQue'}),
    whatsapp: Q.whatsappPayload({number: '91 7093320572', message: 'Hi BrandiQue'})
  };
  for (const [name, text] of Object.entries(expect)) {
    const img = decodePng(await readFile(`tests/fixtures/qr-${name}.png`));
    assert.equal(jsQR(img.data, img.width, img.height, {inversionAttempts: 'attemptBoth'})?.data, text, name);
  }
});
test('QR payload builders follow the formats phones understand', () => {
  assert.equal(Q.wifiPayload({ssid: 'My;Net', password: 'pa:ss\\word', security: 'WPA'}), 'WIFI:T:WPA;S:My\\;Net;P:pa\\:ss\\\\word;;');
  assert.equal(Q.wifiPayload({ssid: 'Cafe', security: 'nopass', hidden: true}), 'WIFI:T:nopass;S:Cafe;H:true;;');
  assert.throws(() => Q.wifiPayload({ssid: 'x', password: 'short'}), /8 characters/);
  assert.equal(Q.normalizeUrl('brandique.in'), 'https://brandique.in/');
  assert.throws(() => Q.normalizeUrl('javascript:alert(1)'), /http/);
  assert.equal(Q.phonePayload('+91 98765-43210'), 'tel:+919876543210');
  assert.equal(Q.emailPayload({to: 'a@b.in', subject: 'Hi there'}), 'mailto:a@b.in?subject=Hi%20there');
  assert.equal(Q.smsPayload({number: '98765 43210', message: 'Hello'}), 'SMSTO:9876543210:Hello');
  assert.equal(Q.whatsappPayload({number: '+91 98765 43210', message: 'Hi!'}), 'https://wa.me/919876543210?text=Hi!');
  const v = Q.vcardPayload({first: 'A', last: 'B', org: 'X, Y', url: 'x.com'});
  assert.match(v, /^BEGIN:VCARD\nVERSION:3\.0\nN:B;A;;;\nFN:A B\nORG:X\\, Y\nURL:https:\/\/x\.com\/\nEND:VCARD$/);
  assert.throws(() => Q.buildPayload('image', {}), /Upload your image or paste a link/);
  assert.equal(Q.buildPayload('video', {link: 'https://litter.catbox.moe/abc.mp4'}), 'https://litter.catbox.moe/abc.mp4');
  assert.equal(Q.TYPES.length, 10);
});
test('image/video uploads are checked and host answers parsed strictly', () => {
  assert.throws(() => Q.checkUpload({type: 'video/mp4', size: 10}, 'image'), /not an image/);
  assert.throws(() => Q.checkUpload({type: 'video/mp4', size: Q.MAX_UPLOAD + 1}, 'video'), /95 MB/);
  assert.ok(Q.MAX_UPLOAD <= 100 * 1024 * 1024); // Workers request-body limit
  assert.equal(Q.uploadUrl('litterbox', {type: 'image/png'}), '/api/qr-upload?host=litterbox&type=image%2Fpng');
  const fd = Q.uploadForm('litterbox', new Blob(['x']), '12h');
  assert.equal(fd.get('reqtype'), 'fileupload'); assert.equal(fd.get('time'), '12h'); assert.ok(fd.get('fileToUpload'));
  assert.equal(Q.uploadForm('litterbox', new Blob(['x']), 'forever').get('time'), '72h');
  assert.ok(Q.uploadForm('gofile', new Blob(['x'])).get('file'));
  assert.equal(Q.parseProxyResponse('litterbox', 200, '{"url":"https://litter.catbox.moe/ab12cd.png"}'), 'https://litter.catbox.moe/ab12cd.png');
  assert.throws(() => Q.parseProxyResponse('litterbox', 502, '{"error":"Litterbox did not accept the file (403)."}'), /did not accept/);
  assert.throws(() => Q.parseProxyResponse('gofile', 403, '<!doctype html><title>403'), /unexpected answer/);
  for (const h of Object.values(Q.HOSTS)) { assert.ok(h.temporary); assert.match(h.name, /temporary/i); assert.doesNotMatch(h.name, /permanent/i); }
});
test('QR styling options: logo forces high error correction, transparent background, gradient', () => {
  const base = {size: '512', margin: '16', dark: '#111111', light: '#ffffff', level: 'L', dots: 'rounded'};
  assert.equal(Q.styleOptions(base, 'x').qrOptions.errorCorrectionLevel, 'L');
  assert.equal(Q.styleOptions({...base, logo: 'data:image/png;base64,AA'}, 'x').qrOptions.errorCorrectionLevel, 'H');
  assert.equal(Q.styleOptions({...base, transparent: true}, 'x').backgroundOptions.color, 'rgba(0,0,0,0)');
  const g = Q.styleOptions({...base, gradient: true, dark2: '#ff0000', rotation: '90'}, 'x').dotsOptions.gradient;
  assert.equal(g.colorStops[1].color, '#ff0000'); assert.ok(Math.abs(g.rotation - Math.PI / 2) < 1e-9);
  assert.equal(Q.styleOptions({...base, size: '99999'}, 'x').width, 2048);
  assert.ok(Q.contrast('#000000', '#ffffff') > 20); assert.ok(Q.contrast('#777777', '#888888') < 1.5);
});
test('QR library is self-hosted (no CDN) and the guide covers the new options', async () => {
  const src = await readFile('public/assets/tool-qr.js', 'utf8');
  assert.doesNotMatch(src + await readFile('public/assets/utility-workbench.js', 'utf8'), /cdn\.jsdelivr|unpkg|esm\.sh/);
  assert.match(src, /\/assets\/vendor\/qr-code-styling\.js/);
  assert.match(await readFile('public/assets/vendor/LICENSES.md', 'utf8'), /MIT/);
  const g = guides['qr-code-generator'];
  for (const k of ['Content types', 'Image / Video upload', 'Dot style', 'Centre logo', 'Download PNG / SVG / JPG']) assert.ok(g.options.some(([o]) => o === k), k);
});
test('workspace layout: long option panels split sensibly; every file-tool family has a recipe', () => {
  const el = (tag, cls = '') => ({tagName: tag, matches: s => s.split(',').some(x => x.trim() === tag.toLowerCase() || (cls && x.trim() === '.' + cls))});
  assert.equal(splitIndex([el('H3'), el('LABEL'), el('DIV'), el('H3'), el('LABEL')]), 3);
  assert.equal(splitIndex([el('LABEL'), el('LABEL'), el('FIELDSET'), el('LABEL')]), 2);
  assert.equal(splitIndex([el('LABEL'), el('LABEL')]), -1);
  assert.equal(splitIndex(Array.from({length: 8}, () => el('LABEL'))), 4);
  assert.deepEqual(RECIPES.map(r => r.id), ['ir', 'media', 'pdfw', 'pm', 'split', 'format']);
});
test('legacy duplicate breadcrumb is stripped from tool pages', async () => {
  assert.match(await readFile('scripts/presentation.mjs', 'utf8'), /<p>Home \\\/ Tools \\\//);
});

test('upload proxy Worker: same-origin, image/video only, size cap, forwards to the host', async () => {
  const W = await import('../worker/index.js');
  const req = (o = {}) => new Request('https://tools.brandique.in/api/qr-upload?host=' + (o.host || 'litterbox') + '&type=' + encodeURIComponent(o.type || 'image/png'), {method: 'POST', body: 'x', headers: {origin: o.origin ?? 'https://tools.brandique.in', 'content-type': o.ct || 'multipart/form-data; boundary=abc'}});
  assert.equal((await W.handleUpload(req({ct: 'image/png'}))).status, 415);
  assert.equal((await W.handleUpload(req({origin: 'https://evil.example'}))).status, 403);
  assert.equal((await W.handleUpload(req({type: 'text/html'}))).status, 415);
  assert.equal((await W.handleUpload(req({host: 'nope'}))).status, 400);
  assert.equal((await W.handleUpload(new Request('https://tools.brandique.in/api/qr-upload'))).status, 405);
  assert.ok(W.MAX_BYTES <= 100 * 1024 * 1024);
  assert.ok(W.HOSTS.litterbox.parse(200, 'https://litter.catbox.moe/a.png\n'));
  assert.throws(() => W.HOSTS.litterbox.parse(403, '<!doctype html><title>403'));
  const wr = await readFile('wrangler.jsonc', 'utf8');
  assert.match(wr, /"main": "worker\/index.js"/); assert.match(wr, /"run_worker_first": \["\/api\/\*"\]/); assert.match(wr, /"not_found_handling": "404-page"/);
});
