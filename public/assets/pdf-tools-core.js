export const PDF_LIB_URL='https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm';
export const PDFJS_URL='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
export const PDFJS_WORKER_URL='https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
export function safeBaseName(value,fallback='document'){return(String(value||fallback).trim().replace(/\.[^.]+$/,'').replace(/[^\p{L}\p{N}._-]+/gu,'-').replace(/^-+|-+$/g,'').slice(0,100)||fallback)}
export function savingStats(before,after){before=Math.max(0,Number(before)||0);after=Math.max(0,Number(after)||0);const bytes=before-after;return{bytes,percent:before?Math.round(bytes/before*1000)/10:0,smaller:bytes>0}}
export function rasterScale(dpi){return clamp(dpi,72,240)/72}
export function pageBox(width,height,rotation=0){const swap=Math.abs(rotation)%180===90;return{width:swap?height:width,height:swap?width:height}}
export function imagePlacement(imageWidth,imageHeight,pageWidth,pageHeight,margin=24,mode='contain'){margin=clamp(margin,0,Math.min(pageWidth,pageHeight)/2);const areaW=Math.max(1,pageWidth-margin*2),areaH=Math.max(1,pageHeight-margin*2);const scale=mode==='cover'?Math.max(areaW/imageWidth,areaH/imageHeight):Math.min(areaW/imageWidth,areaH/imageHeight);const width=imageWidth*scale,height=imageHeight*scale;return{x:(pageWidth-width)/2,y:(pageHeight-height)/2,width,height}}
export function pageDimensions(preset,orientation='auto',imageWidth=1,imageHeight=1){let dims=preset==='a4'?[595.28,841.89]:preset==='letter'?[612,792]:[imageWidth,imageHeight];const landscape=orientation==='landscape'||(orientation==='auto'&&imageWidth>imageHeight);if(landscape&&dims[1]>dims[0])dims=[dims[1],dims[0]];if(!landscape&&orientation==='portrait'&&dims[0]>dims[1])dims=[dims[1],dims[0]];return{width:dims[0],height:dims[1]}}
