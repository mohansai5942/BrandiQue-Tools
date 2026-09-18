import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {tools} from '../src/tools.mjs';

const walk=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(async entry=>{
 const path=`${dir}/${entry.name}`;
 return entry.isDirectory()?walk(path):path;
}))).flat();

const sourceFiles=['src/tools.mjs','src/site.mjs','src/seo-content.mjs','scripts/ads.mjs','scripts/ads-qa.mjs','scripts/seo.mjs','scripts/seo-qa.mjs','scripts/build.mjs','scripts/overrides.mjs','scripts/presentation.mjs','scripts/design.mjs','scripts/assets.mjs',...(await walk('public/assets')).filter(path=>path.endsWith('.js'))];
for(const file of sourceFiles){
 const source=await readFile(file,'utf8');
 if(/eval\s*\(|new Function\s*\(/.test(source))throw new Error(`Unsafe dynamic code in ${file}`);
 const checked=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
 if(checked.status!==0)throw new Error(`Syntax error in ${file}\n${checked.stderr||checked.stdout}`);
}
if(new Set(tools.map(tool=>tool.slug)).size!==tools.length)throw new Error('Duplicate slugs');
if(new Set(tools.map(tool=>tool.name)).size!==tools.length)throw new Error('Duplicate tool titles');
for(const tool of tools)if(!tool.description||tool.description.length<45)throw new Error(`Thin description: ${tool.slug}`);
console.log(`Lint passed for ${tools.length} tools and ${sourceFiles.length} JavaScript modules`);
