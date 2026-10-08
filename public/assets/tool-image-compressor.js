import{findQualityForTarget}from'./image-core.js';
import{safeOutputName,humanBytes}from'./media-core.js';

const $=(s,r=document)=>r.querySelector(s);
const extFor=m=>m==='image/jpeg'?'jpg':m.split('/')[1]||'png';
const revoke=u=>{if(u)URL.revokeObjectURL(u)};
const download=(blob,name)=>{const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)};
const canvasEncode=async(bitmap,type,quality,width=bitmap.width,height=bitmap.height)=>{
 const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width));canvas.height=Math.max(1,Math.round(height));
 const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas encoding is unavailable in this browser.');
 if(type==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height)}
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?.size?resolve(blob):reject(Error(`This browser cannot encode ${type.split('/')[1].toUpperCase()} images.`)),type,type==='image/png'?undefined:quality));
};

function shell(){
 return `<div class="media-grid">
 <section class="media-card">
  <h2>1. Choose an image</h2>
  <div class="dropzone" data-drop><div><p><b>Drop an image here</b> or choose one</p><input aria-label="Choose image" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif"></div></div>
  <div class="media-meta" data-source>Nothing selected.</div>
  <div class="media-fields" style="margin-top:12px">
   <label class="media-label">Compression goal
    <select data-mode><option value="quality">Reduce file size</option><option value="target">Get to a target size</option></select>
   </label>
   <label class="media-label">Output format
    <select data-format><option value="image/jpeg">JPEG — best for photos</option><option value="image/webp">WebP — smaller for web</option><option value="image/png">PNG — lossless</option></select>
   </label>
   <label class="media-label" data-quality-wrap>Quality <output data-qout>82%</output>
    <input data-quality type="range" min="1" max="100" value="82">
   </label>
   <label class="media-label" data-target-wrap hidden>Target size (KB)
    <input data-target type="number" min="1" step="1" value="20" placeholder="e.g. 20">
   </label>
   <label class="media-label wide" data-downscale-wrap hidden><span>Need it smaller than that?</span>
    <span><input data-downscale type="checkbox" checked> Automatically reduce dimensions only when needed</span>
   </label>
  </div>
  <p class="support-note" data-help>Use <b>Reduce file size</b> when you mainly want smaller output. Use <b>Get to a target size</b> when the final file must be at or below a specific KB limit.</p>
  <div class="media-actions"><button data-run disabled>Compress image</button></div>
  <progress class="media-progress" data-progress max="1" value="0" hidden></progress>
  <p class="media-status" data-status aria-live="polite">Choose an image to begin.</p>
 </section>
 <aside class="media-card">
  <h2>2. Result</h2>
  <div class="media-result" data-result><p class="media-help">Your output preview, exact dimensions and file size will appear here.</p></div>
 </aside>
 </div>`;
}

export function mountImageCompressor(root){
 if(!root||root.dataset.imageCompressorMounted==='true')return;
 root.dataset.imageCompressorMounted='true';
 root.innerHTML=shell();
 let file=null,bitmap=null,resultUrl='';
 const drop=$('[data-drop]',root),input=$('input[type=file]',drop),run=$('[data-run]',root),mode=$('[data-mode]',root),format=$('[data-format]',root),quality=$('[data-quality]',root),target=$('[data-target]',root),qualityWrap=$('[data-quality-wrap]',root),targetWrap=$('[data-target-wrap]',root),downscaleWrap=$('[data-downscale-wrap]',root),downscale=$('[data-downscale]',root);
 const source=$('[data-source]',root),status=$('[data-status]',root),progress=$('[data-progress]',root),result=$('[data-result]',root),qout=$('[data-qout]',root);

 const setStatus=(text,tone='')=>{status.textContent=text;status.dataset.tone=tone};
 const updateUI=()=>{
  const targetMode=mode.value==='target';
  qualityWrap.hidden=targetMode;targetWrap.hidden=!targetMode;downscaleWrap.hidden=!targetMode;
  format.querySelector('option[value="image/png"]').textContent=targetMode?'PNG — lossless, dimensions may need to change':'PNG — lossless';
  qout.textContent=quality.value+'%';
  $('[data-help]',root).innerHTML=targetMode
   ? 'Target mode searches encoder quality automatically. If the target is still too large, optional <b>automatic dimension reduction</b> lowers resolution until the output reaches the limit or the smallest practical size.'
   : 'Quality changes are used for JPEG/WebP. PNG stays lossless, so PNG compression depends mainly on the source image.';
  run.disabled=!bitmap;
  if(targetMode&&format.value==='image/png')setStatus('PNG is lossless. Target-size mode may need to reduce dimensions.','');
 };
 const load=async f=>{
  try{
   if(!f?.type.startsWith('image/'))throw Error('Choose an image file.');
   if(f.size>50*1024*1024)throw Error('Choose an image smaller than 50 MB.');
   bitmap?.close();file=f;bitmap=await createImageBitmap(f,{imageOrientation:'from-image'});
   source.textContent=`${f.name} · ${bitmap.width} × ${bitmap.height} · ${humanBytes(f.size)}`;
   result.replaceChildren(document.createElement('p'));result.firstChild.textContent='Ready. Set your goal, then compress.';
   setStatus('Image ready.','success');updateUI();
  }catch(e){bitmap?.close();bitmap=null;file=null;run.disabled=true;setStatus(e.message,'error')}
 };
 input.onchange=()=>load(input.files[0]);
 for(const event of ['dragenter','dragover'])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.add('is-over')});
 for(const event of ['dragleave','drop'])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.remove('is-over')});
 drop.addEventListener('drop',e=>load(e.dataTransfer.files[0]));
 mode.onchange=updateUI;format.onchange=updateUI;quality.oninput=()=>qout.textContent=quality.value+'%';

 run.onclick=async()=>{
  if(!bitmap||!file)return setStatus('Choose an image first.','error');
  run.disabled=true;progress.hidden=false;progress.value=.05;result.replaceChildren();revoke(resultUrl);resultUrl='';
  try{
   const type=format.value,targetBytes=Math.max(1,Math.floor((+target.value||20)*1024));
   let width=bitmap.width,height=bitmap.height,blob,usedQuality=+quality.value/100,metTarget=true,autoResized=false;
   const encodeAt=(q,w=width,h=height)=>canvasEncode(bitmap,type,q,w,h);
   if(mode.value==='target'){
    if(!Number.isFinite(+target.value)||+target.value<1)throw Error('Enter a target size of at least 1 KB.');
    let attempt=await findQualityForTarget(q=>encodeAt(q),targetBytes,{min:.01,max:1,iterations:18});
    blob=attempt.blob;usedQuality=attempt.quality;metTarget=blob.size<=targetBytes;progress.value=.55;
    if(!metTarget&&downscale.checked){
      for(let round=0;round<12&&!metTarget;round++){
       const ratio=Math.sqrt(targetBytes/blob.size)*.94;
       const nextW=Math.max(24,Math.floor(width*Math.min(.92,Math.max(.25,ratio))));
       const nextH=Math.max(24,Math.round(nextW*height/width));
       if(nextW>=width&&nextH>=height)break;
       width=nextW;height=nextH;autoResized=true;
       attempt=await findQualityForTarget(q=>encodeAt(q,width,height),targetBytes,{min:.01,max:1,iterations:18});
       blob=attempt.blob;usedQuality=attempt.quality;metTarget=blob.size<=targetBytes;
       progress.value=.55+((round+1)/12)*.4;
      }
    }
    if(!metTarget)throw Error(`The browser could not reach ${target.value} KB. Smallest result was ${humanBytes(blob.size)}. Try a larger target or allow more dimension reduction.`);
   }else{
    blob=await encodeAt(usedQuality);progress.value=.85;
   }
   if(!blob?.size)throw Error('The browser produced an empty image.');
   progress.value=1;const name=file.name.replace(/\.[^.]+$/,'')+'-compressed.'+extFor(blob.type);
   resultUrl=URL.createObjectURL(blob);
   const img=document.createElement('img');img.alt='Compressed image preview';img.src=resultUrl;img.style.maxWidth='100%';img.style.maxHeight='420px';
   const summary=document.createElement('div');
   summary.innerHTML=`<p><b>${humanBytes(blob.size)}</b> output · ${Math.round((blob.size/file.size)*100)}% of original</p><p>${width} × ${height} · ${blob.type.split('/')[1].toUpperCase()} ${type==='image/png'?'lossless':''}</p><p>${mode.value==='target'?(metTarget?`Target reached: ≤ ${target.value} KB`:'Target not reached'):`Quality: ${Math.round(usedQuality*100)}%`}${autoResized?' · dimensions reduced automatically':''}</p>`;
   const dl=document.createElement('button');dl.className='btn';dl.textContent='Download compressed image';dl.onclick=()=>download(blob,name);
   result.append(img,summary,dl);
   setStatus(mode.value==='target'?(`Done. Output is ${humanBytes(blob.size)} ${metTarget?'and meets the target.':''}`):'Compression complete.','success');
  }catch(e){result.innerHTML='<p class="media-help">No output was created.</p>';setStatus(e.message,'error')}
  finally{run.disabled=!bitmap;progress.hidden=true}
 };
 updateUI();
 window.addEventListener('pagehide',()=>{bitmap?.close();revoke(resultUrl)},{once:true});
}

// Self-mount when this module is loaded directly by the tool page.
if(typeof document!=='undefined'){
 const root=document.querySelector('[data-tool]');
 if(root)mountImageCompressor(root);
}
