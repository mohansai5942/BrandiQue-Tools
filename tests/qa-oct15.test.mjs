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
