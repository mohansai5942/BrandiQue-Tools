// Regression tests for the 15 Oct 2026 QA report (bug IDs in each test name).
import test from 'node:test';
import assert from 'node:assert/strict';
import {toQrBytes,fromQrBytes,styleOptions} from '../public/assets/qr-core.js';

test('UTIL-01 QR payload is UTF-8 bytes and round-trips Telugu, Hindi and emoji', () => {
  const text = 'Hello తెలుగు 😀 line1\nline2 मैं';
  const bin = toQrBytes(text);
  assert.ok([...bin].every(c => c.charCodeAt(0) < 256));
  assert.equal(bin.slice(0, 6), 'Hello ');
  assert.equal(bin.charCodeAt(6), 0xe0); // త = E0 B0 A4
  assert.equal(fromQrBytes(bin), text);
  assert.equal(toQrBytes('https://x.in/?a=1'), 'https://x.in/?a=1');
  assert.equal(fromQrBytes(styleOptions({dark:'#000',light:'#fff'}, 'రవి').data), 'రవి');
});

import {parseRange} from '../public/assets/pdf-split-core.js';
import {pdfErrorMessage,PDF_MESSAGES} from '../public/assets/file-guards.js';
test('DOC-05 reversed page range extracts in reverse order; out-of-range wording', () => {
  assert.deepEqual(parseRange('3-1', 5), [2, 1, 0]);
  assert.deepEqual(parseRange('2-4', 5), [1, 2, 3]);
  assert.throws(() => parseRange('1-99', 5), /outside this PDF \(pages 1-5\)/);
  assert.throws(() => parseRange('0', 5), /outside/);
  assert.throws(() => parseRange('abc', 5), /Invalid range/);
});
test('DOC-03/DOC-04 PDF errors are translated for people', () => {
  assert.equal(pdfErrorMessage({name: 'PasswordException', message: 'No password given'}), PDF_MESSAGES.locked);
  assert.equal(pdfErrorMessage(new Error('Invalid PDF structure.')), PDF_MESSAGES.broken);
  assert.equal(pdfErrorMessage(new Error('Something else')), 'Something else');
});
