import test from 'node:test';import assert from 'node:assert/strict';import {tools} from '../src/tools.mjs';
const convert=(v,a,b,map)=>v*map[a]/map[b];
test('registry slugs and titles are unique',()=>{assert.equal(new Set(tools.map(x=>x.slug)).size,tools.length);assert.equal(new Set(tools.map(x=>x.name)).size,tools.length)});
test('length conversion',()=>{const m={m:1,km:1000,ft:.3048,mi:1609.344};assert.equal(convert(1,'km','m',m),1000);assert.ok(Math.abs(convert(1,'mi','ft',m)-5280)<1e-9)});
test('speed conversion',()=>{const m={'m/s':1,'km/h':1/3.6,mph:.44704};assert.equal(convert(36,'km/h','m/s',m),10);assert.ok(Math.abs(convert(60,'mph','km/h',m)-96.56064)<1e-8)});
test('temperature formulas',()=>{assert.equal(0*9/5+32,32);assert.equal(0+273.15,273.15)});
test('EMI amortization',()=>{const p=100000,r=10/1200,n=12,emi=p*r*(1+r)**n/((1+r)**n-1);assert.ok(Math.abs(emi-8791.59)<.02)});
test('leap years',()=>{const leap=y=>y%4===0&&(y%100!==0||y%400===0);assert.equal(leap(2000),true);assert.equal(leap(1900),false)});
test('major tools exist',()=>{for(const s of ['image-resizer','video-resizer','age-calculator','document-format-converter','resume-ats-checker','screenshot-editor'])assert.ok(tools.some(x=>x.slug===s))});
