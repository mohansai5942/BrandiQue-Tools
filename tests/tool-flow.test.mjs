import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {describeAccept} from '../public/assets/tool-flow.js';
import {keywordStats} from '../public/assets/utility-workbench.js';
import {compareStats} from '../public/assets/tool-media-suite.js';
import {PRESETS} from '../public/assets/image-core.js';
import {guides} from '../src/tool-guides.mjs';

test('drop-zone hints describe accepted types', () => {
  assert.match(describeAccept('image/*'), /JPG, PNG/);
  assert.equal(describeAccept('.pdf,application/pdf'), 'PDF');
  assert.match(describeAccept(''), /Any file/);
  // UTIL-10: no raw MIME text in the accepted-files hint
  assert.equal(describeAccept('image/png,image/jpeg,image/webp,image/svg+xml'), 'PNG, JPG, WebP, SVG');
  assert.equal(describeAccept('.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'), 'PDF, DOCX, TXT');
});
test('word counter keywords ignore stop words and rank by frequency', () => {
  const k = keywordStats('The brand and the Brand website. BrandiQue builds a website!');
  assert.deepEqual(k.top.slice(0, 2), [['brand', 2], ['website', 2]]);
  assert.equal(k.longest, 'brandique');
  assert.ok(k.avg > 4);
  assert.equal(keywordStats('').top.length, 0);
});
test('image comparison stats report savings', () => {
  const rows = compareStats({origSize: 2000, newSize: 500, origDims: '10×10 px', newDims: '10×10 px', origType: 'image/png', newType: 'image/jpeg'});
  assert.equal(rows.at(-1)[2], '75.0% smaller');
  assert.deepEqual(rows[2].slice(1), ['PNG', 'JPG']);
});
test('image presets include passport and WhatsApp sizes', () => {
  assert.deepEqual(PRESETS.passportPhoto, [413, 531]);
  assert.deepEqual(PRESETS.whatsappProfile, [500, 500]);
});
test('guides mention the shared three-step flow and new options', () => {
  assert.ok(Object.values(guides).every(g => g.tips[0].includes('three steps')));
  assert.ok(guides['color-converter'].options.some(([k]) => k === 'Contrast checker'));
});
test('tool flow is injected on tool pages by the presentation build', async () => {
  const src = await readFile('scripts/presentation.mjs', 'utf8');
  assert.match(src, /tool-flow\.js/);
  assert.match(src, /tool-flow\.css/);
});
