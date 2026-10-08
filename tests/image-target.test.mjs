import test from 'node:test';
import assert from 'node:assert/strict';
import {findQualityForTarget,outputDimensions} from '../public/assets/image-core.js';

test('exact dimension mode can set width and height independently',()=>{
 assert.deepEqual(outputDimensions(4000,3000,{mode:'exact',width:800,height:800,lock:false}),{width:800,height:800});
});

test('target quality search reaches a byte ceiling when encoder can',async()=>{
 const result=await findQualityForTarget(async quality=>({size:Math.round(1000*quality)+50}),500,{min:.01,max:1,iterations:18});
 assert.equal(result.metTarget,true);
 assert.ok(result.blob.size<=500);
 assert.ok(result.quality>.4&&result.quality<.46);
});

test('target quality search reports when the encoder minimum is still too large',async()=>{
 const result=await findQualityForTarget(async quality=>({size:900}),200,{min:.01,max:1,iterations:12});
 assert.equal(result.metTarget,false);
 assert.equal(result.blob.size,900);
});
