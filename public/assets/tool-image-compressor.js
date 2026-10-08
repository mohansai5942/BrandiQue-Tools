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
 root.dataset.imageCompressorMounted='true';root.innerHTML=shell();
 let file=null,bitmap=null,resultUrl='',timer=0,busy=false,revision=0;
 const drop=$('[data-drop]',root),input=$('input[type=file]',drop),source=$('[data-source]',root),status=$('[data-status]',root),progress=$('[data-progress]',root),result=$('[data-result]',root),format=$('[data-format]',root),quality=$('[data-quality]',root),qout=$('[data-qout]',root),target=$('[data-target]',root),unit=$('[data-unit]',root);
 const setStatus=(t,tone='')=>{status.textContent=t;status.dataset.tone=tone};
 const targetBytes=()=>{const n=Number(target.value);if(!Number.isFinite(n)||n<=0)return null;return Math.max(1,Math.floor(n*(unit.value==='MB'?1048576:1024)))};
 const clearResult=()=>{revoke(resultUrl);resultUrl='';result.replaceChildren()};
 const schedule=()=>{clearTimeout(timer);revision++;clearResult();if(!bitmap)return;timer=setTimeout(()=>process(revision),450)};
 const updateLabel=()=>{qout.textContent=quality.value+'%';const t=targetBytes();$('[data-target-help]',root).textContent=t?'Automatic compression will aim for ≤ '+target.value+' '+unit.value+' and reduce dimensions only if needed.':'Leave target empty for automatic compression.'};
 const load=async f=>{try{if(!f?.type.startsWith('image/'))throw Error('Choose an image file.');if(f.size>50*1024*1024)throw Error('Choose an image smaller than 50 MB.');bitmap?.close();bitmap=await createImageBitmap(f,{imageOrientation:'from-image'});file=f;source.textContent=f.name+' · '+bitmap.width+' × '+bitmap.height+' · '+humanBytes(f.size);setStatus('Image ready. Compressing automatically…','success');schedule()}catch(e){bitmap?.close();bitmap=null;file=null;clearResult();setStatus(e.message,'error')}};
 async function process(token){
  if(!bitmap||!file||token!==revision||busy)return;
  busy=true;progress.hidden=false;progress.value=.04;setStatus(targetBytes()?'Finding the best quality for ≤ '+target.value+' '+unit.value+'…':'Compressing automatically…');
  try{
   const type=format.value,limit=targetBytes();let width=bitmap.width,height=bitmap.height,blob=null,usedQuality=Number(quality.value)/100,metTarget=!limit,autoResized=false;
   const encodeAt=q=>encode(bitmap,type,q,width,height);
   if(limit){
    let attempt=await findQualityForTarget(encodeAt,limit,{min:.01,max:1,iterations:18});
    blob=attempt.blob;usedQuality=attempt.quality;metTarget=blob.size<=limit;progress.value=.45;
    for(let round=0;round<16&&!metTarget;round++){
     const ratio=Math.sqrt(limit/blob.size)*.93;
     const nextW=Math.max(24,Math.floor(width*Math.min(.9,Math.max(.2,ratio))));
     const nextH=Math.max(24,Math.round(nextW*bitmap.height/bitmap.width));
     if(nextW>=width&&nextH>=height)break;
     width=nextW;height=nextH;autoResized=true;
     attempt=await findQualityForTarget(encodeAt,limit,{min:.01,max:1,iterations:18});
     blob=attempt.blob;usedQuality=attempt.quality;metTarget=blob.size<=limit;progress.value=.45+((round+1)/16)*.5;
    }
    if(!metTarget)throw Error('Could not reach '+target.value+' '+unit.value+'. Smallest result was '+humanBytes(blob.size)+'.');
   }else{blob=await encode(bitmap,type,usedQuality);progress.value=.9}
   if(token!==revision)return;
   if(!blob?.size)throw Error('The browser produced an empty image.');
   const name=safeOutputName(file.name,'-compressed',extFor(blob.type));resultUrl=URL.createObjectURL(blob);
   const img=document.createElement('img');img.alt='Automatically compressed image preview';img.src=resultUrl;img.style.maxWidth='100%';img.style.maxHeight='420px';
   const saving=Math.round((1-blob.size/file.size)*100);
   const summary=document.createElement('div');summary.innerHTML='<p><b>'+humanBytes(blob.size)+'</b> output · '+(saving>=0?saving+'% smaller':Math.abs(saving)+'% larger')+'</p><p>'+width+' × '+height+' · '+blob.type.split('/')[1].toUpperCase()+' · quality '+Math.round(usedQuality*100)+'%</p><p>'+(limit?(metTarget?'Target reached: ≤ '+target.value+' '+unit.value:'Target not reached'):'Automatic compression')+(autoResized?' · dimensions reduced automatically':'')+'</p>';
   const dl=document.createElement('button');dl.className='btn';dl.textContent='Download compressed image';dl.onclick=()=>download(blob,name);
   result.append(img,summary,dl);progress.value=1;setStatus('Compression complete — preview updated automatically.','success');
  }catch(e){if(token===revision){result.innerHTML='<p class="media-help">No output was created.</p>';setStatus(e.message,'error')}}finally{if(token===revision)progress.hidden=true;busy=false;if(token!==revision)schedule()}
 }
 input.onchange=()=>load(input.files[0]);
 for(const event of ['dragenter','dragover'])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.add('is-over')});
 for(const event of ['dragleave','drop'])drop.addEventListener(event,e=>{e.preventDefault();drop.classList.remove('is-over')});
 drop.addEventListener('drop',e=>load(e.dataTransfer.files[0]));
 [format,quality,target,unit].forEach(e=>e.addEventListener('input',()=>{updateLabel();schedule()}));
 [format,unit].forEach(e=>e.addEventListener('change',()=>{updateLabel();schedule()}));
 updateLabel();
 window.addEventListener('pagehide',()=>{clearTimeout(timer);bitmap?.close();clearResult()},{once:true});
}
// Self-mount when this module is loaded directly by the tool page.
if(typeof document!=='undefined'){
 const root=document.querySelector('[data-tool]');
 if(root)mountImageCompressor(root);
}
