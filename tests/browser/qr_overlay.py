# Regression: after a QR is generated for an uploaded image/video (and for a pasted link),
# the "Scan-testing the code…" overlay must clear once the scan test ends, and the QR must
# not stay greyed out. Run after `npm run build`: python3 tests/browser/qr_overlay.py [chromium-path]
import sys, subprocess, time, json, os
from playwright.sync_api import sync_playwright
PORT = 8831
srv = subprocess.Popen(['python3', '-m', 'http.server', str(PORT), '-d', 'dist'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
exe = sys.argv[1] if len(sys.argv) > 1 else '/usr/bin/chromium'
fails = []
def settled(pg, label):
    pg.wait_for_function("document.querySelector('[data-check]').textContent.length>0", timeout=15000)
    pg.wait_for_timeout(400)
    st = pg.evaluate("""(()=>{const r=document.querySelector('[data-tool]'),p=r.querySelector('.tf-proc'),pv=r.querySelector('[data-preview]');
      return {proc:!p.hidden,busy:r.getAttribute('aria-busy'),state:r.dataset.tfState,opacity:getComputedStyle(pv).opacity,check:r.querySelector('[data-check]').textContent}})()""")
    ok = (not st['proc']) and st['busy'] is None and st['state'] != 'working' and float(st['opacity']) > 0.99
    print(('PASS ' if ok else 'FAIL ') + label, json.dumps(st))
    if not ok: fails.append(label)
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(executable_path=exe)
        pg = b.new_page(viewport={'width': 1440, 'height': 900})
        pg.route('**/*', lambda r: r.continue_() if 'localhost' in r.request.url else r.abort())
        pg.route('**/api/qr-upload**', lambda r: r.fulfill(status=200, content_type='application/json', body=json.dumps({'url': 'https://litter.catbox.moe/abc123.png'})))
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(f'http://localhost:{PORT}/tools/qr-code-generator/', wait_until='load'); pg.wait_for_timeout(800)
        settled(pg, 'url default')
        for kind, name, mime in [('image', 'x.png', 'image/png'), ('video', 'x.mp4', 'video/mp4')]:
            pg.click(f'[data-type={kind}]'); pg.wait_for_timeout(300)
            pg.set_input_files('[data-file]', files=[{'name': name, 'mimeType': mime, 'buffer': b'\x89PNG\r\n\x1a\n' + b'0' * 2048}])
            pg.check('[data-consent]'); pg.click('[data-upload]')
            settled(pg, f'{kind} upload')
            pg.click('[data-src=link]'); pg.fill('[data-f=link]', f'https://example.com/{kind}.file')
            settled(pg, f'{kind} paste link')
        if errs: fails.append('js errors ' + str(errs))
        b.close()
finally:
    srv.kill()
print('qr overlay:', 'OK' if not fails else 'FAILED ' + str(fails))
sys.exit(1 if fails else 0)
