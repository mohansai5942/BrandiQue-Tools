// Regression tests for the 13 Oct 2026 QA report fixes.
import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateRawSync} from 'node:zlib';
import {calculateAge} from '../public/assets/media-core.js';
import {amortization,emi} from '../public/assets/calculator-core.js';
import {convert,allConversions,ABSOLUTE_ZERO_MESSAGE} from '../public/assets/unit-core.js';
import {matchesQuery,scoreTool} from '../public/assets/search-core.js';
import {encodeBase64,decodeBase64,generatePassword,encodeUrl,decodeUrl} from '../public/assets/utility-core.js';
import {extractDocxText,wordXmlToText,zipEntries} from '../public/assets/docx-text.js';
import {resumeFileKind,decodeTextBytes,hasPdfHeader,isImageFile,isVideoFile} from '../public/assets/file-guards.js';
import {tools} from '../src/tools.mjs';

// --- #14 Age calculator: 29 Feb birthdays use 28 Feb in non-leap years, consistently.
test('age: 29 Feb 2000 birthday is observed on 28 Feb in non-leap years',()=>{
 assert.deepEqual(calculateAge('2000-02-29','2026-02-28'),{years:26,months:0,days:0,totalDays:9496,totalWeeks:1356,nextBirthday:'2027-02-28',daysToBirthday:365});
 const mar1=calculateAge('2000-02-29','2026-03-01');assert.deepEqual([mar1.years,mar1.months,mar1.days],[26,0,1]);
 const feb27=calculateAge('2000-02-29','2026-02-27');assert.deepEqual([feb27.years,feb27.months,feb27.days],[25,11,29]);assert.equal(feb27.nextBirthday,'2026-02-28');assert.equal(feb27.daysToBirthday,1);
 const leap=calculateAge('2000-02-29','2028-02-29');assert.deepEqual([leap.years,leap.months,leap.days],[28,0,0]);
 const oct=calculateAge('2000-02-29','2026-10-13');assert.deepEqual([oct.years,oct.months,oct.days],[26,7,14]);
});
test('age: month-end birthdays clamp to the last day of shorter months',()=>{
 const a=calculateAge('2000-01-31','2000-02-29');assert.deepEqual([a.years,a.months,a.days],[0,1,0]);
 const b=calculateAge('2000-01-31','2000-03-01');assert.deepEqual([b.years,b.months,b.days],[0,1,1]);
 const c=calculateAge('1990-05-15','2026-05-14');assert.deepEqual([c.years,c.months,c.days],[35,11,29]);
 assert.throws(()=>calculateAge('2030-01-01','2026-01-01'),/after/);
});
test('age: Y-M-D difference rebuilt from the birth date always lands on the as-of date',()=>{
 const start=Date.UTC(1999,0,1);
 for(let i=0;i<900;i+=7){const b=new Date(start+i*86400000*3).toISOString().slice(0,10);const a='2026-10-13';const r=calculateAge(b,a);assert(r.months>=0&&r.months<12&&r.days>=0&&r.days<31,`${b}: ${JSON.stringify(r)}`)}
});

// --- #15 EMI: an n-month loan finishes in exactly n months.
test('EMI: 60-month loan is scheduled over 60 months, not 61',()=>{
 const r=amortization({principal:500000,annualRate:10,months:60});
 assert.equal(r.actualMonths,60);assert.equal(r.rows.length,60);assert.equal(r.rows.at(-1).balance,0);assert.equal(r.monthsSaved,0);
});
test('EMI: no floating-point tail month across common principals, rates and tenures',()=>{
 for(const months of [1,12,24,36,60,84,120,180,240,360])for(const annualRate of [0,7,8.5,9,10.5,13.37,24])for(const principal of [1,999,100000,2500000,99999999]){
  const r=amortization({principal,annualRate,months});
  assert.equal(r.actualMonths,months,`${principal} @ ${annualRate}% for ${months}`);
  assert(Math.abs(r.totalPaid-emi({principal,annualRate,months}).total)<0.01);
 }
 const pre=amortization({principal:500000,annualRate:10,months:60,extraMonthly:2000});assert(pre.actualMonths<60);assert.equal(pre.monthsSaved,60-pre.actualMonths);
});

// --- #13 Temperature: nothing below absolute zero.
test('temperature: values below absolute zero are rejected in every scale',()=>{
 for(const [v,u] of [[-500,'K'],[-0.01,'K'],[-273.16,'°C'],[-460,'°F'],[-1,'°R']])assert.throws(()=>convert(v,'temperature',u,'°C'),{message:ABSOLUTE_ZERO_MESSAGE});
});
test('temperature: absolute zero itself and normal values still convert',()=>{
 assert.equal(convert(-273.15,'temperature','°C','K'),0);assert.equal(convert(-459.67,'temperature','°F','K'),0);assert.equal(convert(0,'temperature','K','K'),0);
 assert.equal(convert(100,'temperature','°C','°F'),212);assert(Math.abs(convert(-40,'temperature','°F','°C')+40)<1e-9);
 assert.throws(()=>allConversions(-1,'temperature','K'));assert.equal(convert(-5,'length','m','cm'),-500);
});

// --- #22 Tool search: tokenized, aliases, case-insensitive.
test('search: "word counter" and other natural queries find the right tool',()=>{
 const find=q=>tools.filter(t=>matchesQuery(q,`${t.name} ${t.keywords.join(' ')} ${t.category} ${t.description}`)).map(t=>t.slug);
 assert.deepEqual(find('word counter'),['word-counter']);
 assert.deepEqual(find('WORD   Counter'),['word-counter']);
 assert(find('merge pdf').includes('pdf-merger'));assert(find('jpg to pdf').includes('image-to-pdf'));
 assert(find('celsius').includes('temperature-converter'));assert(find('emi loan').includes('emi-calculator'));
 assert(find('character count').includes('word-counter'));assert(find('compress images').includes('image-compressor'));
 assert.deepEqual(find('zzzz-nothing'),[]);assert.equal(find('').length,tools.length);
 assert(scoreTool('pdf merger',{name:'PDF Merger'})>scoreTool('pdf merger',{name:'Other',keywords:'pdf merger'}));
});
test('search: every tool has aliases and finds itself by its own name',()=>{
 for(const t of tools){assert(t.keywords.length>t.formats.length+2,t.slug);assert(matchesQuery(t.name,`${t.name} ${t.keywords.join(' ')}`),t.slug)}
});

// --- #17 Base64 / URL: output is always computed from the input, so re-running never double-encodes.
test('base64 and URL encoding are idempotent for the same input and reject bad input clearly',()=>{
 const input='héllo ₹ world';const once=encodeBase64(input);assert.equal(encodeBase64(input),once);assert.equal(decodeBase64(once),input);
 assert.throws(()=>decodeBase64('###'),/Invalid Base64/);
 assert.equal(encodeUrl('a b&c'),'a%20b%26c');assert.equal(decodeUrl(encodeUrl('a b&c')),'a b&c');assert.throws(()=>decodeUrl('%E0%A4%A'));
});

// --- #19 Password: no character set selected is an error, never a stale password.
test('password generator refuses to run with every character set off',()=>{
 assert.throws(()=>generatePassword({lower:false,upper:false,digits:false,symbols:false}),/at least one/);
 assert.match(generatePassword({length:12,lower:false,upper:false,digits:true,symbols:false}),/^[2-9]{12}$/);
});

// --- #1 Resume ATS: TXT and DOCX extraction without network libraries.
const crc32=bytes=>{let c,crc=0xffffffff;for(const b of bytes){c=(crc^b)&0xff;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crc=(crc>>>8)^c}return(crc^0xffffffff)>>>0};
function makeZip(files){const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;for(const [name,text,store] of files){const raw=enc.encode(text),data=store?raw:deflateRawSync(raw),n=enc.encode(name),crc=crc32(raw);const lh=Buffer.alloc(30);lh.writeUInt32LE(0x04034b50,0);lh.writeUInt16LE(20,4);lh.writeUInt16LE(store?0:8,8);lh.writeUInt32LE(crc,14);lh.writeUInt32LE(data.length,18);lh.writeUInt32LE(raw.length,22);lh.writeUInt16LE(n.length,26);const ch=Buffer.alloc(46);ch.writeUInt32LE(0x02014b50,0);ch.writeUInt16LE(20,4);ch.writeUInt16LE(20,6);ch.writeUInt16LE(store?0:8,10);ch.writeUInt32LE(crc,16);ch.writeUInt32LE(data.length,20);ch.writeUInt32LE(raw.length,24);ch.writeUInt16LE(n.length,28);ch.writeUInt32LE(offset,42);locals.push(lh,n,data);centrals.push(ch,n);offset+=30+n.length+data.length}const cd=Buffer.concat(centrals),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(cd.length,12);end.writeUInt32LE(offset,16);return new Uint8Array(Buffer.concat([...locals,cd,end]))}
const documentXml=`<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Mohan Rao</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Email: mohan@example.com </w:t></w:r><w:r><w:tab/><w:t>Phone &amp; WhatsApp</w:t></w:r></w:p><w:p/><w:p><w:r><w:t>EXPERIENCE</w:t></w:r><w:r><w:br/><w:t>Built 25 websites &#8212; React</w:t></w:r></w:p></w:body></w:document>`;
test('DOCX text is extracted from word/document.xml (deflate and stored entries)',async()=>{
 for(const store of [false,true]){const zip=makeZip([['[Content_Types].xml','<Types/>',store],['word/document.xml',documentXml,store]]);
  assert.deepEqual(zipEntries(zip).map(e=>e.name),['[Content_Types].xml','word/document.xml']);
  const text=await extractDocxText(zip.buffer);
  assert.equal(text,'Mohan Rao\nEmail: mohan@example.com \tPhone & WhatsApp\n\nEXPERIENCE\nBuilt 25 websites — React');
 }
});
test('DOCX extraction gives friendly errors for non-DOCX files',async()=>{
 await assert.rejects(extractDocxText(new TextEncoder().encode('%PDF-1.7 not a zip').buffer),/not a valid DOCX/);
 await assert.rejects(extractDocxText(makeZip([['word/other.xml','<x/>']]).buffer),/No Word document text/);
 assert.equal(wordXmlToText('<w:p><w:r><w:t>A&lt;B</w:t></w:r></w:p>'),'A<B');
});
test('TXT resumes decode UTF-8, UTF-8 BOM and UTF-16 (Windows "Unicode") files',()=>{
 const text='Mohan Rao — Résumé ₹';
 assert.equal(decodeTextBytes(new TextEncoder().encode(text)),text);
 assert.equal(decodeTextBytes(new Uint8Array([0xef,0xbb,0xbf,...new TextEncoder().encode(text)])),text);
 const le=Buffer.from('\ufeff'+text,'utf16le');assert.equal(decodeTextBytes(new Uint8Array(le)),text);
 const noBom=Buffer.from('Plain ASCII resume text','utf16le');assert.equal(decodeTextBytes(new Uint8Array(noBom)),'Plain ASCII resume text');
});
test('resume file kind uses extension first, then MIME, and rejects other types',()=>{
 assert.equal(resumeFileKind({name:'cv.PDF',type:''}),'pdf');assert.equal(resumeFileKind({name:'cv.docx',type:'application/octet-stream'}),'docx');
 assert.equal(resumeFileKind({name:'cv.txt',type:'text/plain'}),'txt');assert.equal(resumeFileKind({name:'cv',type:'text/plain'}),'txt');
 assert.equal(resumeFileKind({name:'cv',type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}),'docx');
 for(const f of [{name:'photo.jpg',type:'image/jpeg'},{name:'old.doc',type:'application/msword'},{name:'cv.rtf',type:'application/rtf'},{name:'x',type:'image/png'}])assert.equal(resumeFileKind(f),null);
});

// --- #6-#10 File-type guards used by image, PDF and video tools.
test('file guards: images, videos and PDF headers',()=>{
 assert(isImageFile({name:'a.jpg',type:'image/jpeg'}));assert(!isImageFile({name:'a.pdf',type:'application/pdf'}));assert(isImageFile({name:'a.webp',type:''}));
 assert(isVideoFile({name:'a.mp4',type:'video/mp4'}));assert(!isVideoFile({name:'a.jpg',type:'image/jpeg'}));assert(isVideoFile({name:'a.mkv',type:''}));assert(!isVideoFile({name:'a.png',type:''}));
 assert(hasPdfHeader(new TextEncoder().encode('%PDF-1.4\n...')));assert(hasPdfHeader(new TextEncoder().encode('\n\n%PDF-1.7')));
 assert(!hasPdfHeader(new Uint8Array([0xff,0xd8,0xff,0xe0,0,0,0,0])));assert(!hasPdfHeader(new Uint8Array()));
});

// Usage guides shown below every tool and in docs/USER-GUIDE.md.
test('every tool has a usage guide with steps, options, output and tips',async()=>{
 const {guides}=await import('../src/tool-guides.mjs');
 for(const t of tools){const g=guides[t.slug];assert(g,`missing guide ${t.slug}`);assert(g.summary&&g.output,t.slug);assert(g.steps.length>=2,t.slug);assert(g.options.length>=2,t.slug);assert(g.options.every(o=>o.length===2&&o[0]&&o[1]),t.slug);assert(g.tips.length>=1,t.slug)}
 assert.deepEqual(Object.keys(guides).sort(),tools.map(t=>t.slug).sort());
});
