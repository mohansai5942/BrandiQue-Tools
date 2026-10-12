# BrandiQue Tools

A premium, privacy-focused collection of free browser tools by [BrandiQue Web Solutions](https://www.brandique.in/).

## Architecture

Dependency-free static ES modules keep the initial bundle small and auditable. `src/tools.mjs` is the central registry; `scripts/build.mjs` generates dedicated crawlable routes in `dist`; `public/assets/app.js` hydrates only the active tool. The repository was empty and the build environment had no package-registry access, so the production architecture avoids an unverified framework install.

Heavy PDF/DOCX libraries are dynamically imported only when their tool is activated: pdf-lib, pdfjs-dist and docx. The homepage never loads them. Video uses native Canvas, captureStream and MediaRecorder with browser-dependent WebM/Opus output.

## Privacy

No login, conversion backend or processing database is used. User-selected file bytes stay in the browser. Resume autosave uses localStorage. Page assets and on-demand library code can make normal network requests; file contents are not analytics payloads.

## Development

Requires Node 20+.

```bash
npm run check
python3 -m http.server 8080 -d dist
```

Deploy `dist/` to any static host. Build command: `npm run build`; output: `dist`.

## Coverage and limitations

The registry generates 37 dedicated tools plus Home, All Tools, About, Privacy, Terms and Contact. Images convert to JPG/PNG/WebP. Native media processing emits WebM where supported. PDF tools process locally after downloading pinned library code. PDF-to-Word extracts text from text PDFs into DOCX; it does not include OCR or promise exact complex-layout preservation. Unsupported paths never display fake success or downloads. Browser memory and codec support vary.

SEO includes unique metadata, canonical URLs, WebApplication JSON-LD, breadcrumbs, FAQ content, internal links, sitemap and robots. Reserved ad slots are non-overlaying and no ad or analytics provider is enabled by default.

## User guide

`src/tool-guides.mjs` documents every tool's steps, options, output and limits. `scripts/guides.mjs` renders it as a "How to use / Options explained" section below each tool during the build, and `node scripts/user-guide.mjs` regenerates `docs/USER-GUIDE.md`. Update the guide entry whenever a tool's controls change (a test fails if a tool has no guide).

## Not-found page

The build writes a branded `dist/404.html` (no ads, `noindex`). Vercel and Cloudflare Pages serve it automatically with HTTP 404. On Cloudflare Workers static assets, set `assets.not_found_handling = "404-page"`.
