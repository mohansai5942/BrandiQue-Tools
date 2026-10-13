// BrandiQue Tools Worker: serves the static site from ./dist (assets binding) and adds one small API,
// POST /api/qr-upload, which forwards an image/video to a file host server-side. Uploading from the
// browser straight to catbox.moe/Litterbox fails for many visitors (HTTP 403 HTML page), so the browser
// talks to this same-origin endpoint and the Worker streams the file on (no buffering).
export const MAX_BYTES = 95 * 1024 * 1024; // Workers free plan caps request bodies at 100 MB.
const EXPIRY = new Set(['1h', '12h', '24h', '72h']);
const ORIGINS = /^https:\/\/(tools\.brandique\.in|brandique-tools\.[a-z0-9-]+\.workers\.dev|[a-z0-9-]+-brandique-tools\.[a-z0-9-]+\.workers\.dev|localhost(:\d+)?)$/;
const UA = 'BrandiQueTools/1.0 (+https://tools.brandique.in)';

const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff'}});
const safeName = n => (String(n || 'file').normalize('NFKD').replace(/[^\w.\-]+/g, '_').replace(/^\.+/, '').slice(-80)) || 'file';

export const HOSTS = {
  litterbox: {name: 'Litterbox', url: 'https://litterbox.catbox.moe/resources/internals/api.php', field: 'fileToUpload',
    fields: o => ({reqtype: 'fileupload', time: EXPIRY.has(o.expiry) ? o.expiry : '72h'}),
    parse: (s, t) => { t = t.trim(); if (s === 200 && /^https:\/\/litter\.catbox\.moe\/\S+$/.test(t)) return t; throw new Error(t.slice(0, 80) || `HTTP ${s}`); }},
  catbox: {name: 'Catbox', url: 'https://catbox.moe/user/api.php', field: 'fileToUpload',
    fields: () => ({reqtype: 'fileupload'}),
    parse: (s, t) => { t = t.trim(); if (s === 200 && /^https:\/\/files\.catbox\.moe\/\S+$/.test(t)) return t; throw new Error(t.slice(0, 80) || `HTTP ${s}`); }},
  gofile: {name: 'Gofile', url: 'https://upload.gofile.io/uploadfile', field: 'file', fields: () => ({}),
    parse: (s, t) => { let j; try { j = JSON.parse(t); } catch { throw new Error(`HTTP ${s}`); } const u = j?.data?.downloadPage; if (s === 200 && j.status === 'ok' && /^https:\/\/gofile\.io\//.test(u || '')) return u; throw new Error(j?.status || `HTTP ${s}`); }}
};
// Hosts the proxy accepts. The UI only offers Catbox once anonymous Catbox uploads are confirmed working.
export const ENABLED = new Set(['litterbox', 'gofile', 'catbox']);

export async function handleUpload(request) {
  if (request.method !== 'POST') return json({error: 'Use POST.'}, 405);
  const origin = request.headers.get('origin') || '';
  const self = new URL(request.url).origin;
  if (origin !== self && !ORIGINS.test(origin)) return json({error: 'Uploads are only accepted from tools.brandique.in.'}, 403);
  const p = new URL(request.url).searchParams, host = p.get('host') || 'litterbox', h = HOSTS[host];
  if (!h || !ENABLED.has(host)) return json({error: 'Unknown or unavailable host.'}, 400);
  const type = (request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!/^(image|video)\/[\w.+-]+$/.test(type)) return json({error: 'Only image and video files can be uploaded.'}, 415);
  const size = Number(request.headers.get('content-length'));
  if (!Number.isFinite(size) || size <= 0) return json({error: 'Empty file.'}, 411);
  if (size > MAX_BYTES) return json({error: `Files up to ${MAX_BYTES / 1048576} MB can be uploaded.`}, 413);
  // Build multipart/form-data around the streamed body, with an exact Content-Length.
  const enc = new TextEncoder(), b = '----bq' + crypto.randomUUID().replace(/-/g, '');
  let head = '';
  for (const [k, v] of Object.entries(h.fields({expiry: p.get('expiry')}))) head += `--${b}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`;
  head += `--${b}\r\nContent-Disposition: form-data; name="${h.field}"; filename="${safeName(p.get('name'))}"\r\nContent-Type: ${type}\r\n\r\n`;
  const pre = enc.encode(head), post = enc.encode(`\r\n--${b}--\r\n`);
  const {readable, writable} = new FixedLengthStream(pre.length + size + post.length);
  (async () => { const w = writable.getWriter(); try { await w.write(pre); const r = request.body.getReader(); for (;;) { const {done, value} = await r.read(); if (done) break; await w.write(value); } await w.write(post); await w.close(); } catch (e) { await w.abort(e).catch(() => {}); } })();
  let res;
  try { res = await fetch(h.url, {method: 'POST', body: readable, headers: {'content-type': `multipart/form-data; boundary=${b}`, 'user-agent': UA}}); }
  catch { return json({error: `${h.name} could not be reached. Try the other host.`}, 502); }
  const text = await res.text();
  try { return json({url: h.parse(res.status, text), host}); }
  catch (e) { const m = /<title>([^<]*)/i.exec(text); return json({error: `${h.name} did not accept the file (${m ? m[1].trim() : e.message}). Try the other host.`}, 502); }
}

export default {
  async fetch(request, env) {
    const {pathname} = new URL(request.url);
    if (pathname === '/api/qr-upload') return handleUpload(request);
    return env.ASSETS.fetch(request);
  }
};
