# Chromium checks for the exact-size video tools (records in real time). Same setup as size_target_images.py.
# Usage: python3 size_target_video.py '[["compressor","clip.mp4",5,"MB"],["resizer","clip.webm",20,"MB","exact"]]'
import asyncio, json, sys, os, time
from playwright.async_api import async_playwright
FX = os.environ.get("FX", "tests/browser/fixtures"); OUT = os.environ.get("OUT", "/tmp/bq-size-out"); os.makedirs(OUT, exist_ok=True)

async def run(b, tool, file, value, unit, match="exact", extra=None):
    pg = await b.new_page(); errs = []
    await pg.route("**/*", lambda r: r.continue_() if "localhost" in r.request.url else r.abort())
    pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
    await pg.goto(f"http://localhost:3000/tools/video-{tool}/", wait_until="domcontentloaded")
    await pg.wait_for_selector("[data-target]")
    await pg.select_option("[data-match]", match)
    await pg.select_option("[data-unit]", unit)
    await pg.fill("[data-target]", str(value))
    if extra and "autosize" in extra:
        await pg.set_checked("[data-autosize]", extra["autosize"])
    t0 = time.time()
    await pg.set_input_files("[data-drop] input", f"{FX}/{file}")
    try:
        await pg.wait_for_function("document.querySelector('[data-result] a[download]')", timeout=400000)
    except Exception:
        errs.append("timeout")
    secs = round(time.time() - t0)
    status = await pg.inner_text("[data-status]")
    verdict = await pg.evaluate("document.querySelector('[data-result]')?.innerText||''")
    res = None
    if await pg.query_selector("[data-result] a[download]"):
        info = await pg.evaluate("""async()=>{const a=document.querySelector('[data-result] a[download]');const b=await (await fetch(a.href)).blob();const u=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode(...u.subarray(i,i+32768));return{name:a.download,b64:btoa(s)}}""")
        import base64
        path = f"{OUT}/{tool}-{info['name']}"; open(path,"wb").write(base64.b64decode(info["b64"]))
        size = os.path.getsize(path)
        # playback check in Chromium: play the padded file and confirm time advances
        play = await pg.evaluate("""async()=>{const v=document.querySelector('[data-result] video');v.muted=true;try{await v.play()}catch(e){return 'play-fail '+e}await new Promise(r=>setTimeout(r,2500));const t=v.currentTime;v.currentTime=1e9;await new Promise(r=>setTimeout(r,800));return {t:+t.toFixed(2),w:v.videoWidth,h:v.videoHeight,err:v.error?.message||null,ended_dur:v.duration}}""")
        res = dict(path=path, size=size, play=play)
    await pg.close()
    return dict(tool=tool, file=file, target=f"{value} {unit}", match=match, secs=secs, res=res, status=status[:160], verdict=verdict.replace("\n", " | ")[:400], errs=errs)

async def main():
    cases = json.loads(sys.argv[1])
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox", "--autoplay-policy=no-user-gesture-required"])
        for c in cases:
            r = await run(b, *c)
            print(json.dumps(r), flush=True)
        await b.close()
asyncio.run(main())
