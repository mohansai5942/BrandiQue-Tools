import{copyFile,mkdir,access,readFile,writeFile}from'node:fs/promises';

const routeOverrides=[
['image-resizer','image-resizer'],
['image-compressor','image-compressor'],
['screenshot-editor','screenshot-editor'],
['image-to-pdf','image-to-pdf'],
['video-resizer','video-resizer'],
['video-compressor','video-compressor'],
['video-to-audio','video-to-audio'],
['document-format-converter','document-format-converter'],
['pdf-to-word','document-format-converter'],
['pdf-merger','pdf-merger'],
['pdf-splitter','pdf-splitter'],
['pdf-compressor','pdf-compressor'],
['document-converter','document-converter'],
['file-converter','file-converter'],
['age-calculator','age-calculator'],
['resume-ats-checker','resume-ats-checker'],
['ats-resume-builder','resume-ats-checker'],
['json-formatter','json-formatter'],
['json-validator','json-validator'],
['base64-encoder-decoder','base64-encoder-decoder'],
['url-encoder-decoder','url-encoder-decoder'],
['password-generator','password-generator'],
['word-counter','word-counter'],
['case-converter','case-converter'],
['color-converter','color-converter'],
['timestamp-converter','timestamp-converter'],
['qr-code-generator','qr-code-generator'],
['percentage-calculator','percentage-calculator'],
['emi-calculator','emi-calculator'],
['discount-calculator','discount-calculator'],
['gst-calculator','gst-calculator']
];

for(const[slug,file]of routeOverrides){
 const source=`public/${file}.html`,target=`dist/tools/${slug}/index.html`;
 await access(source);
 await mkdir(`dist/tools/${slug}`,{recursive:true});
 await copyFile(source,target);
 console.log(`Applied route override: ${target}`);
}

const template=await readFile('public/converter-template.html','utf8');
const converters=[
['unit-converter','Advanced Unit Converter','scientific and everyday','length',true],
['area-converter','Advanced Area Converter','area','area',false],
['length-converter','Advanced Length Converter','length','length',false],
['temperature-converter','Advanced Temperature Converter','temperature','temperature',false],
['volume-converter','Advanced Volume Converter','volume and cooking','volume',false],
['weight-converter','Advanced Weight Converter','mass and weight','mass',false],
['power-converter','Advanced Power Converter','power','power',false],
['speed-converter','Advanced Speed Converter','speed','speed',false]
];
for(const[slug,title,category,key,all]of converters){
 const target=`dist/tools/${slug}/index.html`;
 await mkdir(`dist/tools/${slug}`,{recursive:true});
 await writeFile(target,template.replaceAll('{{TITLE}}',title).replaceAll('{{CATEGORY}}',category).replaceAll('{{SLUG}}',slug).replaceAll('{{KEY}}',key).replaceAll('{{ALL}}',String(all)));
 console.log(`Applied converter override: ${target}`);
}
