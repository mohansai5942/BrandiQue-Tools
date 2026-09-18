import test from'node:test';import assert from'node:assert/strict';import{clamp,safeBaseName,savingStats,rasterScale,pageBox,imagePlacement,pageDimensions,PDF_LIB_URL,PDFJS_URL}from'../public/assets/pdf-tools-core.js';
test('dependencies are pinned and lazy-importable URLs',()=>{assert.match(PDF_LIB_URL,/@1\.17\.1/);assert.match(PDFJS_URL,/@4\.10\.38/)});
test('compressor settings and savings are exact',()=>{assert.equal(clamp(500,72,240),240);assert.equal(rasterScale(144),2);assert.deepEqual(savingStats(1000,750),{bytes:250,percent:25,smaller:true});assert.equal(savingStats(100,120).smaller,false)});
test('safe filenames remove path characters',()=>assert.equal(safeBaseName('../My report.pdf'),'..-My-report'));
test('rotated boxes swap dimensions',()=>assert.deepEqual(pageBox(600,800,90),{width:800,height:600}));
test('image placement contains without cropping',()=>{const p=imagePlacement(1000,500,600,800,50);assert.deepEqual(p,{x:50,y:275,width:500,height:250})});
test('page presets honor orientation',()=>{assert.deepEqual(pageDimensions('letter','landscape',1,2),{width:792,height:612});assert.deepEqual(pageDimensions('image','auto',800,600),{width:800,height:600})});
