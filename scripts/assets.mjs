import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

// Every build gets a content-derived namespace. HTML and lazy imports always
// refer to the same release, even if a browser cached a previous URL forever.
async function files(dir){
 const paths=[];
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=`${dir}/${entry.name}`;
  if(entry.isDirectory())paths.push(...await files(path));else paths.push(path);
 }
 return paths.sort();
}
const originals=await files('dist/assets');
const hash=createHash('sha256');
for(const file of originals){hash.update(file);hash.update(await readFile(file));}
const prefix=`/assets/release-${hash.digest('hex').slice(0,16)}/`;
for(const file of originals){
 const dest=`dist${prefix}${file.slice('dist/assets/'.length)}`;
 await mkdir(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});
 const bytes=await readFile(file);
 await writeFile(dest,/\.(?:js|mjs|css)$/.test(file)?bytes.toString('utf8').replaceAll('/assets/',prefix):bytes);
}
for(const file of (await files('dist')).filter(file=>file.endsWith('.html'))){
 const html=await readFile(file,'utf8');
 await writeFile(file,html.replaceAll('/assets/',prefix));
}
console.log(`Versioned ${originals.length} assets at ${prefix}`);
