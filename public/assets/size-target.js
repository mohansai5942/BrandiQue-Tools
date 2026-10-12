// Exact file-size targeting for the image and video tools.
// Pure functions (no DOM) so they run in the page, in the image worker and under node:test.
// 1 KB = 1024 bytes and 1 MB = 1024 × 1024 bytes, matching how Indian exam and government
// upload forms state their limits.

export const KB=1024,MB=1024*1024;
export const IMAGE_PRESETS=[['20 KB',20*KB],['50 KB',50*KB],['100 KB',100*KB],['200 KB',200*KB],['500 KB',500*KB],['1 MB',MB]];
export const VIDEO_PRESETS=[['1 MB',MB],['5 MB',5*MB],['10 MB',10*MB],['25 MB',25*MB]];

/** Converts a typed number and a KB/MB unit to bytes. Returns 0 for an empty or invalid entry. */
export function parseTarget(value,unit='KB'){
 const n=Number(String(value??'').trim().replace(',','.'));
 if(!Number.isFinite(n)||n<=0)return 0;
 return Math.max(1,Math.floor(n*(String(unit).toUpperCase()==='MB'?MB:KB)));
}

/** "49.8 KB (51,000 bytes)" style label. */
export function sizeLabel(bytes){
 if(!Number.isFinite(bytes)||bytes<0)return '—';
 const main=bytes>=MB?`${(bytes/MB).toFixed(2)} MB`:bytes>=KB?`${(bytes/KB).toFixed(1)} KB`:`${bytes} B`;
 return `${main} (${bytes.toLocaleString('en-IN')} bytes)`;
}
export function shortSize(bytes){return bytes>=MB?`${(bytes/MB).toFixed(2)} MB`:bytes>=KB?`${(bytes/KB).toFixed(1)} KB`:`${bytes} B`}

// Smallest padding block each format can add, so searches leave room for an exact pad.
export function padReserve(mime){
 if(/jpeg/.test(mime))return 4;          // FF FE 00 02
 if(/png/.test(mime))return 20;          // tEXt chunk with the keyword "Comment"
 if(/webp/.test(mime))return 26;         // VP8X header (18) + one empty RIFF chunk (8)
 if(/webm/.test(mime))return 2;          // EC 80
 return 0;
}

const toBytes=x=>x instanceof Uint8Array?x:new Uint8Array(x);
const concat=parts=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let o=0;for(const p of parts){out.set(p,o);o+=p.length}return out};

// ---------------- JPEG ----------------
// COM segments (FF FE + 2-byte length that includes itself) are ignored by every decoder.
function comSegments(total){
 const segs=[];let left=total;
 while(left>0){
  let n=Math.min(left,65537);            // largest segment: 2 marker bytes + 65535 length
  if(left-n>0&&left-n<4)n-=4;           // never leave a remainder too small for a segment
  const s=new Uint8Array(n);s[0]=0xff;s[1]=0xfe;s[2]=(n-2)>>8;s[3]=(n-2)&255;
  segs.push(s);left-=n;
 }
 return segs;
}
export function padJpeg(input,target){
 const b=toBytes(input),gap=target-b.length;
 if(b[0]!==0xff||b[1]!==0xd8)throw new Error('Not a JPEG file');
 if(gap<0)throw new Error('File is already larger than the target');
 if(gap===0)return b;
 if(gap<4)return concat([b,new Uint8Array(gap)]); // 1–3 trailing bytes after EOI are ignored by decoders
 // Insert right after SOI and any APP0 (JFIF) segment so JFIF stays first.
 let at=2;
 if(b[2]===0xff&&b[3]===0xe0)at=4+((b[4]<<8)|b[5]);
 return concat([b.subarray(0,at),...comSegments(gap),b.subarray(at)]);
}

// ---------------- PNG ----------------
const crcTable=new Uint32Array(256).map((_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0});
export function crc32(bytes){let c=0xffffffff;for(const x of bytes)c=crcTable[(c^x)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function pngChunk(type,data){
 const out=new Uint8Array(12+data.length),dv=new DataView(out.buffer);
 dv.setUint32(0,data.length);for(let i=0;i<4;i++)out[4+i]=type.charCodeAt(i);out.set(data,8);
 dv.setUint32(8+data.length,crc32(out.subarray(4,8+data.length)));return out;
}
export function padPng(input,target){
 const b=toBytes(input),gap=target-b.length;
 if(b[0]!==0x89||b[1]!==0x50)throw new Error('Not a PNG file');
 if(gap<0)throw new Error('File is already larger than the target');
 if(gap===0)return b;
 const iend=b.length-12;
 if(gap<20)return concat([b,new Uint8Array(gap)]); // bytes after IEND are ignored by decoders
 const keyword='Comment',data=new Uint8Array(gap-12);
 for(let i=0;i<keyword.length;i++)data[i]=keyword.charCodeAt(i);
 data[keyword.length]=0;for(let i=keyword.length+1;i<data.length;i++)data[i]=0x20; // Latin-1 spaces
 return concat([b.subarray(0,iend),pngChunk('tEXt',data),b.subarray(iend)]);
}

// ---------------- WebP ----------------
const fourcc=(b,o)=>String.fromCharCode(b[o],b[o+1],b[o+2],b[o+3]);
function riffChunk(type,size){const out=new Uint8Array(8+size+(size&1));for(let i=0;i<4;i++)out[i]=type.charCodeAt(i);new DataView(out.buffer).setUint32(4,size,true);return out}
function webpDims(b){
 const t=fourcc(b,12),o=20;
 if(t==='VP8 '){return{w:((b[o+7]<<8)|b[o+6])&0x3fff,h:((b[o+9]<<8)|b[o+8])&0x3fff,alpha:false}}
 if(t==='VP8L'){const bits=b[o+1]|(b[o+2]<<8)|(b[o+3]<<16)|(b[o+4]<<24);return{w:(bits&0x3fff)+1,h:((bits>>>14)&0x3fff)+1,alpha:!!((bits>>>28)&1)}}
 throw new Error('Unsupported WebP layout');
}
/** Pads a WebP with an unknown RIFF chunk ("PADD"), converting a simple file to the extended
 *  (VP8X) layout first so the extra chunk is spec-valid. WebP sizes are always even, so an odd
 *  target ends 1 byte below it. */
export function padWebp(input,target){
 let b=toBytes(input);
 if(fourcc(b,0)!=='RIFF'||fourcc(b,8)!=='WEBP')throw new Error('Not a WebP file');
 target-=target&1;
 if(target<b.length)throw new Error('File is already larger than the target');
 if(target===b.length)return b;
 if(fourcc(b,12)!=='VP8X'){
  if(target-b.length<26)return b; // cannot add VP8X + a chunk in the space left
  const {w,h,alpha}=webpDims(b),x=riffChunk('VP8X',10);
  x[8]=alpha?0x10:0;const W=w-1,H=h-1;x[12]=W&255;x[13]=(W>>8)&255;x[14]=(W>>16)&255;x[15]=H&255;x[16]=(H>>8)&255;x[17]=(H>>16)&255;
  b=concat([b.subarray(0,12),x,b.subarray(12)]);
 }
 const gap=target-b.length;
 const out=gap>=8?concat([b,riffChunk('PADD',gap-8)]):b;
 new DataView(out.buffer,out.byteOffset).setUint32(4,out.length-8,true);
 return out;
}

// ---------------- WebM ----------------
/** EBML Void element (ID 0xEC) of exactly n bytes (n ≥ 2). Players skip Void elements. */
export function ebmlVoid(n){
 if(n<2)throw new Error('A Void element needs at least 2 bytes');
 if(n<=128){const v=new Uint8Array(n);v[0]=0xec;v[1]=0x80|(n-2);return v}
 if(n<10){throw new Error('unreachable')}
 const v=new Uint8Array(n),size=n-9;v[0]=0xec;v[1]=0x01;
 let s=size;for(let i=8;i>=2;i--){v[i]=s%256;s=Math.floor(s/256)}
 return v;
}
export function padWebm(input,target){
 const b=toBytes(input),gap=target-b.length;
 if(b[0]!==0x1a||b[1]!==0x45||b[2]!==0xdf||b[3]!==0xa3)throw new Error('Not a WebM file');
 if(gap<0)throw new Error('File is already larger than the target');
 if(gap===0)return b;
 if(gap===1)return b; // a Void element needs 2 bytes
 return concat([b,ebmlVoid(gap)]);
}

/** Pads bytes of the given type to exactly `target` bytes (WebP: nearest even value). */
export function padToSize(bytes,mime,target){
 if(/jpeg/.test(mime))return padJpeg(bytes,target);
 if(/png/.test(mime))return padPng(bytes,target);
 if(/webp/.test(mime))return padWebp(bytes,target);
 if(/webm/.test(mime))return padWebm(bytes,target);
 return toBytes(bytes);
}

// ---------------- image search ----------------
/**
 * Finds the best image that fits a byte budget.
 * encode({width,height,quality,levels}) → Promise<Uint8Array> (levels = colour levels per
 * channel for PNG posterising; 0 = full colour).
 * policy: 'auto' (shrink or enlarge), 'shrink' (shrink only), 'keep' (never change dimensions).
 * Returns {bytes,width,height,quality,levels,raw,ok,reason}. `bytes` is never above target.
 */
export async function fitImageToTarget({encode,width,height,mime,target,exact=true,policy='auto',minSide=16,maxPixels=40_000_000,maxScale=4,onStep}){
 const lossy=!/png/.test(mime),reserve=exact?padReserve(mime):0,budget=target-reserve;
 let steps=0;const enc=async(w,h,q,levels=0)=>{steps++;onStep?.(steps);const bytes=await encode({width:w,height:h,quality:q,levels});return{bytes,width:w,height:h,quality:q,levels}};
 const dims=s=>({w:Math.max(1,Math.round(width*s)),h:Math.max(1,Math.round(height*s))});
 const minScale=Math.min(1,minSide/Math.min(width,height));
 const upScale=Math.min(maxScale,Math.sqrt(maxPixels/(width*height)));
 // Chrome encodes WebP at quality 1.0 as lossless (often 5–10× bigger), so cap lossy WebP at 0.99.
 const QMIN=0.01,QMAX=/webp/.test(mime)?0.99:1;
 // Largest quality whose output fits (lossy). Returns null if even QMIN is too big.
 async function bestQuality(w,h,lo=QMIN,hi=QMAX){
  let top=await enc(w,h,hi);if(top.bytes.length<=budget)return top;
  let best=null,low=await enc(w,h,lo);if(low.bytes.length>budget)return null;best=low;
  for(let i=0;i<8&&hi-lo>0.006;i++){const mid=(lo+hi)/2,x=await enc(w,h,mid);if(x.bytes.length<=budget){best=x;lo=mid}else hi=mid}
  return best;
 }
 // Largest scale in [lo,hi] whose output at fixed quality/levels fits.
 async function bestScale(lo,hi,q,levels=0){
  let best=null;
  const a=dims(lo),first=await enc(a.w,a.h,q,levels);if(first.bytes.length>budget)return null;best=first;
  for(let i=0;i<9&&hi/lo>1.004;i++){const mid=Math.sqrt(lo*hi),d=dims(mid),x=await enc(d.w,d.h,q,levels);if(x.bytes.length<=budget){best=x;lo=mid}else hi=mid}
  return best;
 }
 let result=null,reason='';
 if(budget<=0)reason='The target is smaller than the smallest possible file.';
 else if(lossy){
  result=await bestQuality(width,height);
  if(result&&result.quality===QMAX&&result.bytes.length<0.97*target&&policy==='auto'&&upScale>1.01){
   const up=await bestScale(1,upScale,0.92);
   if(up&&up.width>result.width){const refined=await bestQuality(up.width,up.height,0.92,QMAX);result=refined||up}
  }
  // A full-size image at very low quality looks worse than a slightly smaller, cleaner one.
  if((!result||result.quality<0.4)&&policy!=='keep'&&minScale<1){
   const small=await bestScale(minScale,1,0.6);
   if(small){const refined=await bestQuality(small.width,small.height,0.6,QMAX);result=refined||small}
   else if(!result){const tiny=await bestScale(minScale,1,QMIN);if(tiny)result=tiny}
  }
 }else{
  const full=await enc(width,height,1,0);
  if(full.bytes.length<=budget){
   result=full;
   if(full.bytes.length<0.97*target&&policy==='auto'&&upScale>1.01){const up=await bestScale(1,upScale,1,0);if(up&&up.width>full.width)result=up}
  }else{
   for(const levels of[32,16,8]){const x=await enc(width,height,1,levels);if(x.bytes.length<=budget){result=x;break}}
   if(!result&&policy!=='keep'&&minScale<1){
    const a=await bestScale(minScale,1,1,0),b=await bestScale(minScale,1,1,16);
    result=a&&b?(b.width>a.width*1.25?b:a):(a||b);
   }
  }
 }
 if(!result){
  if(!reason)reason=policy==='keep'?'This target is too small for these exact pixel dimensions, even at the lowest quality.':`This target is too small: even a ${Math.round(width*minScale)}×${Math.round(height*minScale)} px image at the lowest quality is larger.`;
  return{ok:false,reason,steps};
 }
 const raw=result.bytes.length;
 const bytes=exact?padToSize(result.bytes,mime,target):result.bytes;
 return{ok:true,...result,bytes,raw,steps};
}

// ---------------- video planning ----------------
/** Picks audio and video bitrates (bits per second) so a recording of `duration` seconds lands
 *  near `ratio` × target bytes. */
export function planVideoBitrate(targetBytes,duration,{hasAudio=true,ratio=0.92}={}){
 if(!(targetBytes>0)||!(duration>0))throw new Error('Target size and duration must be positive.');
 const total=targetBytes*8*ratio/duration;
 let audio=0;
 if(hasAudio)audio=total>2_000_000?128000:total>600_000?96000:total>200_000?64000:total>80_000?32000:16000;
 const overhead=Math.min(total*0.03,20000);
 const video=Math.max(20000,Math.round(total-audio-overhead));
 return{video,audio,total:Math.round(total)};
}
/** Suggests a frame size whose bits-per-pixel stays watchable at the planned video bitrate. */
export function suggestVideoSize(srcW,srcH,videoBps,fps=30){
 const bpp=0.06,maxPixels=videoBps/(fps*bpp);
 if(srcW*srcH<=maxPixels)return{width:srcW,height:srcH};
 const s=Math.max(Math.sqrt(maxPixels/(srcW*srcH)),160/Math.min(srcW,srcH));
 const even=n=>Math.max(2,Math.round(n/2)*2);
 return{width:even(srcW*Math.min(1,s)),height:even(srcH*Math.min(1,s))};
}
/** Compact label for file names: 20480 → "20KB", 1048576 → "1MB", 1572864 → "1.5MB". */
export function sizeTag(bytes){return bytes>=MB?`${+(bytes/MB).toFixed(2)}MB`:`${+(bytes/KB).toFixed(1)}KB`}
