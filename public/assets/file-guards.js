// Shared, dependency-free file checks. Every tool validates the file kind
// before decoding so users get a clear message instead of a raw browser error.
const ext=name=>String(name||'').toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]||'';
export const IMAGE_EXTENSIONS=['jpg','jpeg','png','webp','gif','avif','bmp','svg','ico','heic','heif','tif','tiff'];
export const VIDEO_EXTENSIONS=['mp4','m4v','webm','mov','mkv','ogv','avi','3gp','mpeg','mpg'];
export const MESSAGES={
 notImage:'Only image files are supported. Choose a JPG, PNG, WebP, GIF or another image your browser can open.',
 notVideo:'This is not a video file. Choose an MP4, WebM, MOV or another video your browser can play.',
 notPdf:'This file is not a PDF. Choose a PDF document (the file must start with a %PDF header).',
 resumeType:'This file type is not supported. Upload PDF, DOCX or TXT.'
};
export function fileExtension(file){return ext(file?.name)}
export function isImageFile(file){if(!file)return false;const type=String(file.type||'').toLowerCase();if(type)return type.startsWith('image/');return IMAGE_EXTENSIONS.includes(ext(file.name))}
export function isVideoFile(file){if(!file)return false;const type=String(file.type||'').toLowerCase();if(type)return type.startsWith('video/')||(type==='application/octet-stream'&&VIDEO_EXTENSIONS.includes(ext(file.name)));return VIDEO_EXTENSIONS.includes(ext(file.name))}
export function hasPdfHeader(bytes){if(!bytes||bytes.length<5)return false;// The PDF spec allows a little leading junk; real PDFs place %PDF- within the first 1024 bytes.
 const limit=Math.min(bytes.length-4,1024);for(let i=0;i<limit;i++)if(bytes[i]===0x25&&bytes[i+1]===0x50&&bytes[i+2]===0x44&&bytes[i+3]===0x46&&bytes[i+4]===0x2d)return true;return false}
export async function isPdfFile(file){if(!file)return false;const head=new Uint8Array(await file.slice(0,1024).arrayBuffer());return hasPdfHeader(head)}
const DOCX_MIME='application/vnd.openxmlformats-officedocument.wordprocessingml.document';
// Resume input: decide by extension first, then MIME. Returns 'pdf' | 'docx' | 'txt' | null.
export function resumeFileKind(file){if(!file)return null;const e=ext(file.name),type=String(file.type||'').toLowerCase();if(e==='pdf')return'pdf';if(e==='docx')return'docx';if(e==='txt'||e==='text')return'txt';if(e)return null;if(type==='application/pdf')return'pdf';if(type===DOCX_MIME)return'docx';if(type.startsWith('text/plain'))return'txt';return null}
// Decode text bytes with BOM detection (UTF-8, UTF-16 LE/BE). Windows "Unicode" .txt files are UTF-16.
export function decodeTextBytes(bytes){bytes=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);if(bytes[0]===0xff&&bytes[1]===0xfe)return new TextDecoder('utf-16le').decode(bytes.subarray(2));if(bytes[0]===0xfe&&bytes[1]===0xff)return new TextDecoder('utf-16be').decode(bytes.subarray(2));if(bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf)bytes=bytes.subarray(3);
 // UTF-16 without BOM: many zero bytes in alternating positions.
 const sample=bytes.subarray(0,Math.min(bytes.length,2000));let evenZero=0,oddZero=0;for(let i=0;i<sample.length;i++)if(sample[i]===0)(i%2?oddZero++:evenZero++);if(sample.length>8&&oddZero>sample.length*.3&&evenZero<sample.length*.05)return new TextDecoder('utf-16le').decode(bytes);if(sample.length>8&&evenZero>sample.length*.3&&oddZero<sample.length*.05)return new TextDecoder('utf-16be').decode(bytes);
 const utf8=new TextDecoder('utf-8').decode(bytes);if(!utf8.includes('\ufffd'))return utf8;return new TextDecoder('windows-1252').decode(bytes)}
// DOC-03/DOC-04: turn raw pdf.js / pdf-lib errors into messages people can act on.
export const PDF_MESSAGES={locked:'This PDF is password-protected. Unlock it first, then try again.',broken:'This PDF is damaged or not a valid PDF, so it cannot be read. Try re-saving or re-downloading it.'};
export function pdfErrorMessage(e,fallback='This PDF could not be read.'){const t=`${e?.name||''} ${e?.message||e||''}`;if(/password|encrypt/i.test(t))return PDF_MESSAGES.locked;if(/invalid pdf|invalidpdf|formaterror|bad xref|no pdf header|unexpected (end|server response)|failed to parse|corrupt/i.test(t))return PDF_MESSAGES.broken;return e?.message||fallback}
