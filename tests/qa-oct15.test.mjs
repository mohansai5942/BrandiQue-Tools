// Regression tests for the Oct 15 QA report (CALC, UTIL, IMG ids).
import test from 'node:test';
import assert from 'node:assert/strict';
import {formatValue} from '../public/assets/unit-core.js';
import {extractRequirements} from '../public/assets/ats-core.js';
import {fitImageToTarget,parseTarget} from '../public/assets/size-target.js';
import {outputDimensions} from '../public/assets/image-core.js';
import {gst,emi,amortization} from '../public/assets/calculator-core.js';
import {decodeBase64,convertCase,timestampToDate,countText,passwordStrength} from '../public/assets/utility-core.js';
import {keywordStats} from '../public/assets/utility-workbench.js';

test('CALC-04: converter output has no floating-point artifacts',()=>{
  assert.equal(formatValue(1016046908799.9999),'1,016,046,908,800');
  assert.equal(formatValue(453592.3700000001,{precision:10}),'453,592.37');
  assert.equal(formatValue(760.0000000003,{precision:10}),'760');
  assert.equal(formatValue(1/3,{precision:2}),'0.33');
});
test('CALC-07: tiny non-zero results switch to scientific notation',()=>{
  assert.equal(formatValue(1e-12,{precision:10}),'1e-12');
  assert.equal(formatValue(1e-9),'1e-9');
  assert.equal(formatValue(0),'0');
});
test('CALC-08: huge results are consistent (scientific or "Too large")',()=>{
  assert.equal(formatValue(1e308),'1e308');
  assert.equal(formatValue(Infinity),'Too large');
  assert.equal(formatValue(NaN),'—');
});
test('UTIL-10: hiring filler words are not ATS keywords',()=>{
  const t=extractRequirements('We are hiring a Senior Python Developer with Django and AWS. Remote, full time.').map(x=>x.term);
  assert.ok(t.includes('python'));
  for(const w of ['hiring','senior','remote','full','time'])assert.ok(!t.includes(w),w);
});
test('IMG-06: tiny images are never enlarged to fill a target',async()=>{
  const r=await fitImageToTarget({encode:async({width,height,quality})=>new Uint8Array(Math.max(1,Math.round(width*height*quality*0.5))),width:4,height:4,mime:'image/jpeg',target:20480,exact:false,policy:'auto'});
  assert.equal(r.ok,true);assert.equal(r.width,4);assert.equal(r.height,4);
});
test('IMG-04/IMG-07: invalid sizes are rejected clearly',()=>{
  assert.equal(parseTarget('0'),0);assert.equal(parseTarget('-5'),0);
  assert.throws(()=>outputDimensions(100,100,{mode:'exact',width:0,height:-5,lock:false}),/at least 1 px/);
});
test('CALC-03/05/06/10: calculator validation and rounding',()=>{
  assert.throws(()=>gst({amount:1000,rate:18,quantity:0}),/Quantity/);
  assert.equal(gst({amount:999.99,rate:28,quantity:3}).steps[0],'Taxable value: 2999.97');
  assert.throws(()=>emi({principal:1e6,annualRate:8.5,months:2.5}),/whole number/);
  const a=amortization({principal:1e15,annualRate:8.5,months:240});assert.equal(a.interestSaved,0);assert.equal(a.monthsSaved,0);
});
test('CALC-01, UTIL-02/03/06/09: utility fixes',()=>{
  assert.throws(()=>timestampToDate(''),/Enter a timestamp/);
  assert.equal(decodeBase64('4LCk4LGG4LCy4LGB4LCX4LGBIPCfmIA'),'తెలుగు 😀');
  assert.equal(convertCase('hello WORLD from the USA. second sentence here! is it OK?','sentence'),'Hello world from the USA. Second sentence here! Is it OK?');
  const k=keywordStats('నేను తెలుగు మాట్లాడతాను. మీరు ఎలా ఉన్నారు?');assert.equal(k.unique,6);assert.equal(k.longest,'మాట్లాడతాను');
  assert.equal(countText('मैं ठीक हूँ। आप कैसे हैं?').sentences,2);
  assert.equal(Math.round(passwordStrength('x'.repeat(20),{lower:false,upper:false,digits:false,symbols:true}).entropy),72);
});
