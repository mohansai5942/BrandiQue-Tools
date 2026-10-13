import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {analyzeResume,MIN_RESUME_WORDS} from '../public/assets/ats-core.js';
import {sizeLabel} from '../public/assets/size-target.js';
import {MESSAGES} from '../public/assets/file-guards.js';
import {guides} from '../src/tool-guides.mjs';
const src=f=>readFile(new URL(`../public/${f}`,import.meta.url),'utf8');
test('ATS: short but readable resume gets an exact word count, not the OCR hint',()=>{
 const text=Array.from({length:25},(_,i)=>`word${i}`).join(' ');
 assert.throws(()=>analyzeResume(text),e=>/Your resume has only 25 words\. Add at least 5 more words/.test(e.message)&&!/OCR/.test(e.message));
 assert.throws(()=>analyzeResume('Page 1 image'),/OCR/);assert.equal(MIN_RESUME_WORDS,30);
});
test('byte counts use one consistent en-US grouping',()=>{assert.match(sizeLabel(716491),/716,491 bytes/);assert.doesNotMatch(sizeLabel(716491),/7,16,491/)});
test('guides quote the exact on-page rejection messages',()=>{
 for(const slug of ['video-resizer','video-compressor','video-to-audio'])assert(guides[slug].tips.some(t=>t.includes(MESSAGES.notVideo)),slug);
 assert(guides['pdf-compressor'].tips.some(t=>t.includes(MESSAGES.notPdf)));assert(guides['image-to-pdf'].tips.some(t=>t.includes(MESSAGES.notImage)));
 assert(guides['pdf-merger'].options.some(([k])=>k.startsWith('Clear all')));
});
test('PDF merger: Clear all, recomputed counters and stale banner reset',async()=>{const s=await src('assets/tool-pdf-merger.js');assert(s.includes('data-clear-all'));assert(/\/\^Merged \/\.test/.test(s));assert(s.includes('No pages selected'))});
test('PDF compressor: label spacing and reset on invalid upload',async()=>{const s=await src('assets/tool-pdf-compressor.js');assert(s.includes('Image quality: <input'));assert(s.includes('resetOutput()'));assert(s.includes('isPdfFile'))});
test('utilities: Clear buttons, case pressed state, colour range validation, emoji note',async()=>{const s=await src('assets/utility-workbench.js');
 assert((s.match(/data-clear>Clear<\/button>/g)||[]).length>=3);assert(s.includes('aria-pressed="${t===mode}" data-case'));assert(s.includes("0–255"));assert(!/Math\.min\(max,Math\.max\(0,n\)\)/.test(s));assert(s.includes('Emoji count as characters but not as words'))});
test('Image to PDF announces a rejection once',async()=>{const s=await src('assets/tool-image-to-pdf.js');assert(!s.includes("status(problems.join(' '),'error')"))});
test('blob URLs: result containers auto-revoke and tool links opt out of vignettes',async()=>{assert((await src('assets/live-core.js')).includes('export function autoRevoke'));assert((await src('assets/tool-media-suite.js')).includes("autoRevoke($('[data-result]',r))"));assert((await src('assets/ads.js')).includes("setAttribute('data-google-vignette','false')"))});
test('video tools: rejected file resets dimensions and the live chip',async()=>{const s=await src('assets/tool-media-suite.js');assert(s.includes("$('[data-width]',r).value='';$('[data-height]',r).value=''"));assert(s.includes("'live-rejected'"))});
