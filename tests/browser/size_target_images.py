# Chromium checks for the exact-size image tools. Needs Python Playwright + system Chromium, `npm run build`, and `node server.js` on :3000.
# Fixtures: FX dir with photo.jpg (4000x3000), small.png, photo.webp. Usage: python3 size_target_images.py x '[["c","photo.jpg","image/jpeg",20,"KB"]]'  (c = compressor, r = resizer)
import asyncio, base64, json, sys, os
from playwright.async_api import async_playwright
FX = os.environ.get("FX", "tests/browser/fixtures")
OUT = os.environ.get("OUT", "/tmp/bq-size-out"); os.makedirs(OUT, exist_ok=True)
BASE = "http://localhost:3000"

GRAB = """async()=>{const a=document.querySelector('[data-result] a[download]');if(!a)return null;const b=await (await fetch(a.href)).blob();const buf=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<buf.length;i+=32768)s+=String.fromCharCode(...buf.subarray(i,i+32768));let dec='';try{const bm=await createImageBitmap(b);dec=bm.width+'x'+bm.height;bm.close()}catch(e){dec='DECODE-FAIL '+e}return{name:a.download,size:b.size,type:b.type,dec,b64:btoa(s),verdict:document.querySelector('.size-verdict')?.innerText||''}}"""

async def compressor(b, file, fmt, value, unit, match="exact", policy="auto"):
    pg = await b.new_page(); errs = []
    await pg.route("**/*", lambda r: r.continue_() if "localhost" in r.request.url else r.abort())
    pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    await pg.goto(BASE + "/tools/image-compressor/", wait_until="domcontentloaded")
    await pg.wait_for_selector("[data-format]")
    await pg.select_option("[data-format]", fmt)
    await pg.select_option("[data-match]", match)
    await pg.select_option("[data-policy]", policy)
    await pg.set_input_files("[data-drop] input", f"{FX}/{file}")
    await pg.wait_for_function("!document.querySelector('[data-run]').disabled", timeout=30000)
    await pg.select_option("[data-unit]", unit)
    await pg.fill("[data-target]", str(value))
    try:
        await pg.wait_for_function("document.querySelector('[data-result] a[download]')||document.querySelector('.size-verdict[data-ok=false]')", timeout=180000)
    except Exception as e:
        errs.append("timeout " + (await pg.inner_text("[data-status]")))
    await pg.wait_for_timeout(300)
    r = await pg.evaluate(GRAB)
    status = await pg.inner_text("[data-status]")
    await pg.close()
    return r, status, errs

async def resizer(b, file, fmt, value, unit, match="exact", policy="shrink", width=None):
    pg = await b.new_page(); errs = []
    await pg.route("**/*", lambda r: r.continue_() if "localhost" in r.request.url else r.abort())
    pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    await pg.goto(BASE + "/tools/image-resizer/", wait_until="domcontentloaded")
    await pg.wait_for_selector("[data-k=mime]")
    await pg.select_option("[data-k=mime]", fmt)
    await pg.select_option("[data-k=targetMode]", match)
    await pg.select_option("[data-k=dimensionPolicy]", policy)
    await pg.select_option("[data-k=targetUnit]", unit)
    if width:
        await pg.fill("[data-k=width]", str(width))
    await pg.fill("[data-k=targetValue]", str(value))
    await pg.set_input_files("[data-pick]", f"{FX}/{file}")
    try:
        await pg.wait_for_function("document.querySelector('.size-verdict[data-ok]')", timeout=180000)
    except Exception:
        errs.append("timeout " + (await pg.inner_text("[data-status]")))
    await pg.wait_for_timeout(300)
    verdict = await pg.evaluate("document.querySelector('.size-verdict')?.innerText||''")
    # Grab the result via the download button (intercept)
    r = None
    if await pg.query_selector("[data-save]"):
        async with pg.expect_download() as dl:
            await pg.click("[data-save]")
        d = await dl.value
        path = f"{OUT}/{d.suggested_filename}"
        await d.save_as(path)
        data = open(path, "rb").read()
        dec = await pg.evaluate("async(b64)=>{const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<u.length;i++)u[i]=bin.charCodeAt(i);try{const bm=await createImageBitmap(new Blob([u]));return bm.width+'x'+bm.height}catch(e){return 'DECODE-FAIL'}}", base64.b64encode(data).decode())
        r = {"name": d.suggested_filename, "size": len(data), "dec": dec, "verdict": verdict}
    else:
        r = {"verdict": verdict}
    status = await pg.inner_text("[data-status]")
    await pg.close()
    return r, status, errs

def kb(v, u): return int(float(v) * (1024 if u == "KB" else 1048576))

async def main():
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    cases = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
        rows = []
        for c in cases:
            tool, file, fmt, v, u = c[:5]; extra = c[5] if len(c) > 5 else {}
            fn = compressor if tool == "c" else resizer
            r, status, errs = await fn(b, file, fmt, v, u, **extra)
            t = kb(v, u)
            if r and r.get("b64"):
                name = r["name"]; open(f"{OUT}/{name}", "wb").write(base64.b64decode(r["b64"])); del r["b64"]
            size = (r or {}).get("size")
            rows.append(dict(tool=tool, file=file, fmt=fmt, target=f"{v} {u}", target_bytes=t, out=size, diff=(size - t) if size else None, dec=(r or {}).get("dec"), name=(r or {}).get("name"), verdict=(r or {}).get("verdict", "").replace("\n", " | ")[:220], status=status[:150], errs=errs))
            print(json.dumps(rows[-1]), flush=True)
        await b.close()
asyncio.run(main())
