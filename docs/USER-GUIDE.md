# BrandiQue Tools — User Guide

A practical guide to all 37 free tools on [tools.brandique.in](https://tools.brandique.in/). Every option described here matches the controls on the live tool pages.

## Before you start

- **Private by design.** Every tool runs inside your browser. Files you choose are processed on your device and are not uploaded to a BrandiQue server. Some tools download a library the first time you use them (for example PDF or QR libraries); your file content is never sent with those requests.
- **Free, no account.** No login, no sign-up and no watermark. All tools are free.
- **Works in your browser.** Use a current Chrome, Edge, Firefox or Safari. Most tools update automatically as you change a setting (“Live updates on – all changes applied”), so there is often no Start button.
- **Install as an app.** You can install BrandiQue Tools as an app from the Download app page (/download/). Chrome/Edge: Install icon in the address bar or menu → Install. Android: ⋮ → Install app. iPhone/iPad: Safari Share → Add to Home Screen. Mac Safari: File → Add to Dock.
- **Leaving with work loaded.** After you load a file, the browser asks before you leave the page so you don’t lose your work by accident.
- **Share.** Every tool page has a Share button (uses your phone’s share sheet, or copies the link).
- **Find a tool.** On [All tools](https://tools.brandique.in/tools/) type what you want to do (e.g. “word counter”, “jpg to pdf”, “emi loan”) or filter by category. Press “/” to jump to the search box.

## Contents

- **Image Tools:** [Image Resizer](#image-resizer) · [Image Compressor](#image-compressor) · [Screenshot Editor](#screenshot-editor)
- **Video Tools:** [Video Resizer](#video-resizer) · [Video Compressor](#video-compressor) · [Video to Audio](#video-to-audio)
- **PDF Tools:** [Image to PDF](#image-to-pdf) · [PDF Merger](#pdf-merger) · [PDF Splitter](#pdf-splitter) · [PDF Optimizer](#pdf-optimizer)
- **Document Tools:** [Document Format Converter](#document-format-converter) · [Document Converter](#document-converter)
- **Converters:** [Universal File Converter](#universal-file-converter) · [Unit Converter](#unit-converter) · [Length Converter](#length-converter) · [Area Converter](#area-converter) · [Temperature Converter](#temperature-converter) · [Volume Converter](#volume-converter) · [Weight Converter](#weight-converter) · [Power Converter](#power-converter) · [Speed Converter](#speed-converter)
- **Calculators:** [Exact Age Calculator](#exact-age-calculator) · [Percentage Calculator](#percentage-calculator) · [EMI Calculator](#emi-calculator) · [Discount Calculator](#discount-calculator) · [GST Calculator](#gst-calculator)
- **Resume Tools:** [Resume ATS Score Checker](#resume-ats-score-checker)
- **Utilities:** [JSON Formatter](#json-formatter) · [JSON Validator](#json-validator) · [Base64 Encoder & Decoder](#base64-encoder--decoder) · [URL Encoder & Decoder](#url-encoder--decoder) · [Password Generator](#password-generator) · [Word & Character Counter](#word--character-counter) · [Case Converter](#case-converter) · [HEX, RGB & HSL Color Converter](#hex-rgb--hsl-color-converter) · [Unix Timestamp Converter](#unix-timestamp-converter) · [QR Code Generator](#qr-code-generator)
- [Frequently asked questions](#frequently-asked-questions)

---

## Image Tools

### Image Resizer

**URL:** [https://tools.brandique.in/tools/image-resizer/](https://tools.brandique.in/tools/image-resizer/)  
**Formats:** JPG, PNG, WebP, AVIF*

Resize one or many images to exact pixels, a percentage or a scale factor — and, if you need it, to an exact file size such as 20 KB or 50 KB for exam and government forms.

**How to use**

1. Click Add images (or drop files / paste with Ctrl+V). JPG, PNG, WebP, GIF (first frame) and AVIF (if your browser supports it) are accepted.
2. Under “1. Pixel size”, choose Resize by and enter Width and Height, a Percent or a Scale. Keep “Keep proportions” on to avoid stretching, or pick a Size preset.
3. Under “2. File type & file size”, choose Save as (JPG is best for forms). For a fixed file size, type it in Target file size and pick KB or MB — or tap a chip such as 20 KB or 100 KB. Leave it empty to use the Quality slider instead.
4. The queue is processed automatically after every change. The box under the preview shows the final size in KB and bytes, the pixel size and a green “Matches target” note (or an amber explanation).
5. Select an image in the queue and click the yellow Download button under the preview (or Download on its row). The file name includes the target, e.g. photo-resized-20KB.jpg.

**Options and controls**

| Option | What it does |
|---|---|
| Resize by | Width × height (pixels), Percentage of original, or Scale factor (e.g. 0.5 or 2). |
| Width / Height | Size in pixels (defaults 1280 × 720). With Keep proportions on, changing one updates the other. |
| Percent | 1–1000 % of the original size (default 50 %). Used for “Percentage of original”. |
| Scale | 0.01–100× (default 1). Used for “Scale factor”. |
| Keep proportions | Keeps the original shape so nothing is stretched (on by default). |
| Size preset | Instagram square 1080×1080, portrait 1080×1350, story 1080×1920, YouTube thumbnail 1280×720, LinkedIn post 1200×627, X post 1600×900, Facebook post 1200×630. Choosing one turns off Keep proportions. |
| Save as | JPG (default, best for photos and forms), PNG (lossless, larger) or WebP (small, modern). AVIF appears only if your browser can encode it. |
| Target file size | Optional. Type any size and choose KB or MB (1 KB = 1024 bytes), or tap 20 KB / 50 KB / 100 KB / 200 KB / 500 KB / 1 MB. The tool searches quality (and, if allowed, pixel size) so the file is never above your target. Sizes bigger than the original are allowed. |
| Match | Exact size (default): the file is exactly the size you typed — any small gap is filled with harmless padding that image viewers ignore. Up to this size: the file is at most your target, with no padding. WebP files always have an even byte count, so an odd target ends 1 byte under; AVIF cannot be padded. |
| If the size can’t be reached | Shrink pixel size if needed (default), Shrink or enlarge pixel size, or Keep my pixel size exactly. With “Keep”, a target that is too small for those pixels shows an amber message instead of a bigger file. |
| Quality | 10–100 % (default 86 %) for JPG/WebP/AVIF when no target size is set. PNG is lossless. With a target size, quality is chosen automatically. |
| When the shape changes | Fit inside (adds borders, no crop), Fill and crop the edges, or Stretch to fill. |
| Rotate | 0°, 90°, 180° or 270°. |
| Smoothness | High quality, Medium or Fast scaling. |
| Flip H / Flip V | Mirror horizontally or vertically. |
| Sharpen / Reduce noise | Optional filters applied after resizing. |
| Keep transparent areas | Keeps transparency for PNG/WebP. When off (or for JPG) the Background colour is used. |
| Background colour | Fill colour for transparent areas and borders (default white). |
| File name pattern / Added to file name | Output name pattern, default {name}{suffix} with “-resized”. With a target size the size is added, e.g. -resized-50KB. |
| Queue buttons ↑ ↓ × Retry Download | Reorder, remove, retry a failed image, or download that image’s result. |
| Clear | Empties the queue. |
| Cancel | Stops processing. |
| Split / Side by side / Before / After · − / + / Fit / 100% | The large preview: Split slider or side-by-side comparison, zoom buttons, Fit to panel and Full size (actual pixels). Mouse wheel / pinch zooms, drag pans when zoomed, double-click toggles 100 %; ◩ changes the background. Stats (dimensions, size, % saved, format) and Download sit under the image. |
| More options | Crop/fit, rotate, smoothness, flip, sharpen, noise, transparency, background colour and file-name settings. Pixel size and File type & file size are always visible. |
| More size presets | Also includes Passport photo 35×45 mm (413×531 px at 300 dpi), WhatsApp profile photo, WhatsApp status, Full HD 1080p and HD 720p. |

**Output:** One file per image in the chosen format, named with the pattern (e.g. photo-resized.jpg, or photo-resized-20KB.jpg with a target size). The final size (KB and bytes), pixel size, % saved and format are shown under the large preview.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- For exam photos and signatures, choose JPG and type the limit from the form (for example 20 KB). If the form also fixes the pixel size, enter it and choose “Keep my pixel size exactly”.
- PNG is lossless, so it cannot get very small; the tool reduces colours or pixels and suggests JPG if needed.
- Re-encoding removes EXIF/metadata such as GPS location.
- Very large images (over 150 megapixels) are refused to avoid browser crashes.
- Files stay on your device; nothing is uploaded.

### Image Compressor

**URL:** [https://tools.brandique.in/tools/image-compressor/](https://tools.brandique.in/tools/image-compressor/)  
**Formats:** JPG, PNG*, WebP, AVIF*

Make an image an exact file size you type — 5 KB to 5 MB and beyond — or compress it by quality. Built for exam, job and government form uploads.

**How to use**

1. Choose or drop one image.
2. Pick Save as: JPG (best for photos and forms), WebP or PNG.
3. Keep “How to compress” on “To a file size I choose”, then type the size and choose KB or MB — or tap a chip (20 KB, 50 KB, 100 KB, 200 KB, 500 KB, 1 MB).
4. The image is processed automatically. The result says what happened (e.g. “Compressed from 4.3 MB to 20.0 KB”), with the size in bytes, pixel size, quality and a green “Matches target” note.
5. Click Download. The file name includes the size, e.g. photo-20KB.jpg.

**Options and controls**

| Option | What it does |
|---|---|
| Save as | JPG (default), WebP or PNG (lossless). Transparent areas become white in JPG. |
| How to compress | “To a file size I choose” (default) or “By quality level”. If the size box is empty the quality setting is used. |
| Target file size | Any size in KB or MB (1 KB = 1024 bytes, as most Indian exam and government forms mean). Very small (5–20 KB) and large (1–5 MB+) targets work, including targets bigger than the original. |
| Match | Exact size (default): the file is exactly the number of bytes you asked for — a small gap is filled with harmless padding (a JPEG comment, PNG text chunk or WebP extra chunk) that viewers ignore. Up to this size: never above the target and no padding. |
| If the size can’t be reached | Change pixel size as needed (default — shrinks for small targets, can enlarge for big ones), Only shrink pixel size, or Keep my pixel size (shows an amber note if impossible). |
| Quality | 10–100 % (default 82 %) in “By quality level” mode. Lower = smaller file. Ignored for PNG. |
| Split / Side by side / Before / After | Large preview modes. Split puts a draggable before/after line over the image; Side by side shows both at the same zoom. |
| − / + / Fit / 100% | Zoom out, zoom in, fit the whole image in the panel, or Full size (100 % = actual pixels). Mouse wheel and pinch also zoom; drag to pan when zoomed; double-click toggles 100 %. ◩ changes the background (checker, dark, light). |
| Result stats | Dimensions, file size, % saved (green) or larger (amber) and format, before → after, with the Download button. |

**Output:** A single file named name-20KB.jpg (target mode) or name-compressed.jpg (quality mode), with a preview, the final size in KB and bytes, pixel size and format.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- A tiny target needs fewer pixels: a 4000×3000 photo becomes roughly 1000×750 at 20 KB. Choose JPG for the best detail at small sizes.
- If even a 16-pixel image is bigger than your target (for example 1 KB), the tool says so instead of giving you a wrong file.
- WebP files always have an even byte count, so an odd target ends 1 byte under.
- Only image files are accepted.
- Files stay on your device; nothing is uploaded.

### Screenshot Editor

**URL:** [https://tools.brandique.in/tools/screenshot-editor/](https://tools.brandique.in/tools/screenshot-editor/)  
**Formats:** PNG, JPG, WebP

Annotate, crop, blur, resize, rotate and export a screenshot without a watermark.

**How to use**

1. Click Add a screenshot, drop an image, or paste one with Ctrl+V / ⌘V.
2. Pick a tool on the left and drag on the canvas (for Text, click where the text should start, type, then press Enter).
3. Use Transform and Effects on the right if needed; Undo / Redo at any time.
4. Choose the export format and quality, then click Download image.

**Options and controls**

| Option | What it does |
|---|---|
| Freehand | Draw freely with the chosen colour and line thickness. |
| Arrow | Drag from start to end to draw an arrow. |
| Rectangle | Drag to draw an outline box. |
| Text | Click on the canvas, type in the box that appears, press Enter to place it (Escape cancels). Text size = Line thickness × 5 px (minimum 14 px). |
| Crop | Drag a rectangle; the canvas is cropped to it. |
| Pixelate | Drag over sensitive details to pixelate them (block size grows with Line thickness). |
| Blur region | Drag over an area to blur it (blur radius = Line thickness px, min 2). |
| Color | Colour for drawing and text (default red). |
| Line thickness | 1–30 (default 4): line width, text size, pixelation and blur strength. |
| Undo / Redo | Up to 25 steps. |
| ↺ 90° / ↻ 90° / Flip H / Flip V | Rotate or mirror the whole image. |
| Width / Height | Type new pixel dimensions; the canvas resizes automatically after you stop typing (or click Apply new size). |
| Effects | Brightness, Contrast, Saturate (0–200, default 100) and Grayscale, Sepia (0–100, default 0). Applied live. |
| Format | PNG, JPG or WebP export. |
| Quality | 10–100 (default 92) for JPG/WebP. |
| Download image | Saves the canvas at its exact pixel size as name-edited.png/jpg/webp. |

**Output:** One image file at the canvas’s exact dimensions, no watermark.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- GIFs use their first frame; animation is not kept.
- Outputs above 60 megapixels are blocked to prevent crashes.
- Pixelate rather than blur when hiding passwords or numbers.
- Files stay on your device; nothing is uploaded.

---

## Video Tools

### Video Resizer

**URL:** [https://tools.brandique.in/tools/video-resizer/](https://tools.brandique.in/tools/video-resizer/)  
**Formats:** Browser-decodable video, WebM output

Change a video’s resolution and frame rate, and optionally make it an exact file size in KB or MB. Output is WebM.

**How to use**

1. Choose or drop a video (MP4, WebM, MOV… whatever your browser can play).
2. Width and Height are filled from the video; change them (keep “Keep proportions” on to avoid distortion).
3. Optional: type a Target file size (e.g. 5 MB) or tap a chip. Otherwise set Video quality (bitrate).
4. Processing starts automatically and runs in real time (a 1-minute video takes about 1 minute per pass; a target size may take 2–3 passes). Preview the result and click Download.

**Options and controls**

| Option | What it does |
|---|---|
| Target file size | Optional. Any size in KB or MB (1 MB = 1024 × 1024 bytes); chips for 1, 5, 10 and 25 MB. The bitrate is worked out from the video length, then the video is re-recorded once or twice if the first pass misses. The file is never above your target. |
| Match | Exact size (default) adds a harmless WebM “Void” block so the file is exactly your target and still plays. Up to this size skips the padding. |
| Lower the resolution automatically | Off by default here. When on, small targets also get a smaller frame so they stay watchable. |
| Width / Height | Output size in pixels (rounded to even numbers; max 16 megapixels). |
| Keep proportions | Height follows width to keep the shape (on by default). |
| Frame rate | 24, 30 (default) or 60 fps. |
| Video quality (bitrate, Mbps) | 0.1–50 Mbps (default 4) when no target size is set. Higher = sharper and bigger. |
| Cancel | Stops the recording. |
| Resolution preset | 4K, 1080p, 720p, 480p, 360p or 240p. Sets the shorter side and keeps the original shape; presets never enlarge a smaller video. Typing your own width or height switches back to Custom. |
| Result table | Original vs result dimensions, file size, format and the % change (when no target size is set). |

**Output:** A WebM file (name-resized.webm, or name-5MB.webm with a target) with a preview, its exact size in MB and bytes, and the original size.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Output is WebM because browsers cannot reliably record MP4.
- Keep the tab visible while processing; it records in real time.
- Targets larger than the original are allowed: the bitrate is raised and the rest is padded.
- Desktop Chrome or Edge gives the best results.
- Non-video files (for example images) are rejected with “This is not a video file. Choose an MP4, WebM, MOV or another video your browser can play.” and the width, height and result are cleared.
- Files stay on your device; nothing is uploaded.

### Video Compressor

**URL:** [https://tools.brandique.in/tools/video-compressor/](https://tools.brandique.in/tools/video-compressor/)  
**Formats:** Browser-decodable video, WebM output

Shrink a video to a file size you choose (e.g. 5 MB or 10 MB) or by quality; output is WebM.

**How to use**

1. Choose or drop a video.
2. Type a Target file size and pick KB or MB, or tap 1 MB / 5 MB / 10 MB / 25 MB.
3. Leave “Lower the resolution automatically” on so small targets stay watchable.
4. Compression runs automatically in real time (about the video’s length per pass; 2–3 passes for a target). The result shows the final size and a green “Matches target” note. Click Download.

**Options and controls**

| Option | What it does |
|---|---|
| Target file size | Any size in KB or MB (1 MB = 1024 × 1024 bytes), from about 500 KB to 50 MB and more. The tool computes the bitrate from the length (target bits ÷ seconds − audio), measures the result and re-records if needed. Never above the target. |
| Match | Exact size (default) pads the file with a harmless WebM Void block so it is exactly your target; Up to this size skips padding. |
| Lower the resolution automatically | On by default: picks a smaller frame when the target is small. |
| Width / Height | Maximum output size (defaults to the source, capped at 1280 px wide; max 16 megapixels). |
| Keep proportions | Keeps the shape (on by default). |
| Frame rate | 24, 30 (default) or 60 fps. 24 fps saves space. |
| Video quality (bitrate, Mbps) | 0.1–50 Mbps (default 1.5) when no target size is set. |
| Cancel | Stops the recording. |
| Resolution preset | 4K, 1080p, 720p, 480p, 360p or 240p. Sets the shorter side and keeps the original shape; presets never enlarge a smaller video. Typing your own width or height switches back to Custom. |
| Result table | Original vs result dimensions, file size, format and the % change (when no target size is set). |

**Output:** A WebM file (name-5MB.webm or name-compressed.webm) with preview, final size in MB and bytes, resolution and bitrate.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Rough size guide: bitrate (Mbps) × duration (s) ÷ 8 = MB.
- Very small targets for long videos (for example 500 KB for a 10-minute clip) can fall below what the encoder can do; the tool then says the file is above the target.
- Processing happens in real time; keep the tab open and visible.
- Non-video files (for example images) are rejected with “This is not a video file. Choose an MP4, WebM, MOV or another video your browser can play.” and the width, height and result are cleared.
- Files stay on your device; nothing is uploaded.

### Video to Audio

**URL:** [https://tools.brandique.in/tools/video-to-audio/](https://tools.brandique.in/tools/video-to-audio/)  
**Formats:** Browser-decodable video, WebM/Opus

Extract the sound track from a video as a WebM/Opus audio file.

**How to use**

1. Choose or drop a video that has sound.
2. Extraction starts automatically and runs in real time.
3. Listen to the inline preview, check the size and duration, then click Download.

**Options and controls**

| Option | What it does |
|---|---|
| Choose input file | Any video your browser can play (MP4, WebM, MOV…). |
| Cancel | Stops extraction. |

**Output:** name-audio.webm (Opus, 192 kbps) with an inline audio player, file size and duration.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Silent videos show “This video has no accessible audio track”.
- Most players and editors open WebM/Opus; convert to MP3 elsewhere if a device needs it.
- Image files are rejected with “This is not a video file. Choose an MP4, WebM, MOV or another video your browser can play.”
- Files stay on your device; nothing is uploaded.

---

## PDF Tools

### Image to PDF

**URL:** [https://tools.brandique.in/tools/image-to-pdf/](https://tools.brandique.in/tools/image-to-pdf/)  
**Formats:** JPG, PNG, WebP

Put several images into one PDF, one image per page, in the order you choose.

**How to use**

1. Click Add images and pick JPG, PNG, WebP or other images (you can add more later).
2. Reorder: drag a row, drag the ⠿ handle (touch screens), or use the ↑ / ↓ buttons. Use ↻ to rotate an image 90° or Remove to drop it.
3. Choose page size, orientation, fit, margin and image quality.
4. The PDF is rebuilt automatically after each change; click the Download link to save it.

**Options and controls**

| Option | What it does |
|---|---|
| Page size | Match each image (page = image size), A4 or US Letter. |
| Orientation | Auto (follows each image), Portrait or Landscape. |
| Fit | Contain (whole image visible, no crop) or Cover (fills the page, edges cropped). |
| Page margin | 0–144 points of white space around each image (default 24; 72 pt = 1 inch). |
| Image quality in the PDF | 40–95 % (default 82 %). Images are embedded as JPEG; lower = smaller PDF. |
| Output name | File name for the PDF (default images.pdf). |
| ⠿ / ↑ / ↓ | Change page order (drag handle works with touch). |
| ↻ | Rotate that image by 90°. |
| Remove | Remove that image. |
| Cancel | Stops building the PDF after the current image. |

**Output:** One PDF (e.g. images.pdf). The result shows the PDF size and page count.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Transparent PNG areas become white.
- Only images are accepted; other files (such as PDFs) are rejected with “Only image files are supported. Choose a JPG, PNG, WebP, GIF or another image your browser can open.” followed by their names (use PDF Merger to combine PDFs).
- You will be asked to confirm before leaving the page while images are loaded.
- Files stay on your device; nothing is uploaded.

### PDF Merger

**URL:** [https://tools.brandique.in/tools/pdf-merger/](https://tools.brandique.in/tools/pdf-merger/)  
**Formats:** PDF

Combine several PDFs into one, choosing pages, order and rotation.

**How to use**

1. Click Add PDFs or drop several PDF files. Each page appears as a thumbnail.
2. Drag pages to reorder; untick Use to skip a page; ↻ rotates; Delete hides a page (Restore brings it back).
3. Optionally set the file name and document metadata.
4. The merged PDF is rebuilt automatically; click Download merged-document.pdf.

**Options and controls**

| Option | What it does |
|---|---|
| Select all / Select none / Invert | Change which pages are used. |
| Remove selected | Marks the selected pages as deleted. |
| Restore deleted | Brings back all deleted pages. |
| Clear all / Start over | Removes all loaded PDFs, pages and the merged result. |
| Use (per page) | Include or skip that page. |
| ↻ (per page) | Rotate the page 90° clockwise. |
| Delete / Restore (per page) | Remove or restore a single page. |
| Click a page | Shows a larger preview with source file details. |
| Filename | Output name (default merged-document). |
| Document metadata | Optional Title, Author, Subject and Keywords. |
| Preserve source page annotations | Keeps comments/links/form annotations (on by default). |
| Cancel | Stops the current merge. |

**Output:** One PDF (merged-document.pdf by default) with the selected pages in the shown order.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Bookmarks/outlines are not preserved.
- Password-protected PDFs must be unlocked first.
- Non-PDF files (e.g. JPG) are listed by name with “This file is not a PDF. Choose a PDF document (the file must start with a %PDF header).”; use Image to PDF for images.
- “Clear all / Start over” removes every loaded file and page; adding more PDFs otherwise appends their pages after the existing ones.
- Files stay on your device; nothing is uploaded.

### PDF Splitter

**URL:** [https://tools.brandique.in/tools/pdf-splitter/](https://tools.brandique.in/tools/pdf-splitter/)  
**Formats:** PDF

Extract page ranges or split a PDF into several smaller PDFs.

**How to use**

1. Choose a PDF (up to 80 MB and 300 pages). Thumbnails of every page appear.
2. Choose what you want to do (range, picked pages, every page, every N pages, odd, even or custom groups).
3. Enter the pages or groups; the plan on the right shows exactly which pages go into each file.
4. Output files are created automatically; download each one.

**Options and controls**

| Option | What it does |
|---|---|
| Extract a page range into one PDF | Type pages like 1-3, 5, 8 (in that order). |
| Pick pages from the thumbnails | Click thumbnails to include/exclude; Select all / Clear selection. |
| Save every page as a separate PDF | One file per page. |
| Split after every N pages | Pages per PDF (default 2): 1–2, 3–4, … |
| Keep odd / even pages | One PDF with pages 1, 3, 5… or 2, 4, 6… |
| Create custom PDF groups | Separate files with semicolons, e.g. 1-3; 4-6; 7,9. |
| Output filename prefix | Files are named prefix-1.pdf, prefix-2.pdf… (default split-document). |

**Output:** One or more PDFs, each with its own Download button (no ZIP).

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Page numbers start at 1.
- Encrypted PDFs cannot be split until unlocked.
- Files stay on your device; nothing is uploaded.

### PDF Optimizer

**URL:** [https://tools.brandique.in/tools/pdf-compressor/](https://tools.brandique.in/tools/pdf-compressor/)  
**Formats:** PDF

Make a PDF smaller: keep text sharp (lossless, small savings) or turn pages into images (much smaller, lossy).

**How to use**

1. Choose a PDF. The first page preview, page count and size appear.
2. Pick a Compression method. For “Turn pages into images”, set Image sharpness (DPI), Image quality and optionally grayscale.
3. The optimised PDF is created automatically; the result shows the new size and savings.
4. Click Download.

**Options and controls**

| Option | What it does |
|---|---|
| Compression method | Keep text sharp (lossless: keeps text, links, forms; may save little) or Turn pages into images (lossy: much smaller, text becomes part of a picture). |
| Image sharpness (DPI) | 72–240 (default 120). Lower = smaller, less sharp. Only for “Turn pages into images”. |
| Image quality | 35–92 % (default 72 %). Only for “Turn pages into images”. |
| Grayscale raster output | Converts pages to black and white for extra savings. |
| Output name | Default compressed-document.pdf. |
| Cancel | Stops after the current page. |

**Output:** One PDF; the result says how much smaller (or larger) it is.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Rasterized PDFs lose selectable text, links, forms and signatures; keep the original.
- If the output is larger, lower DPI or quality.
- Non-PDF files are rejected with “This file is not a PDF. Choose a PDF document (the file must start with a %PDF header).” and any previous result is cleared.
- Files stay on your device; nothing is uploaded.

---

## Document Tools

### Document Format Converter

**URL:** [https://tools.brandique.in/tools/document-format-converter/](https://tools.brandique.in/tools/document-format-converter/)  
**Formats:** PDF, DOCX, XLSX, CSV, HTML, TXT, Images

Convert PDF, Word, spreadsheet, text and image files between supported formats, detected by file content.

**How to use**

1. Upload a document (up to 25 MB). The tool detects its real type.
2. Choose the output format (only supported targets are listed). For spreadsheets to CSV/HTML, pick the worksheet.
3. Click Convert document. Check the preview (first pages) and download.

**Options and controls**

| Option | What it does |
|---|---|
| Convert to | PDF → Word (pages as images), PNG or JPG (one image per page). Word → PDF. PNG/JPG → PDF, Word or the other image type. XLSX → ODS, CSV, HTML · ODS → XLSX, CSV, HTML · CSV → XLSX, ODS, HTML. TXT → Word, PDF, HTML. Markdown → Word, PDF, TXT, HTML. HTML → PDF. |
| Worksheet | Which sheet to export when converting a workbook to CSV or HTML. |
| Convert document | Starts the conversion (this tool does not auto-convert). |
| What is preserved | Expandable notes describing exactly what each conversion keeps or loses. |

**Output:** One file per conversion (named after the original), or one image per page for PDF → PNG/JPG, each with its own Download button.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- PDF → Word embeds page images: the Word text is not editable.
- Legacy .doc/.xls, PowerPoint and password-protected files are not supported.
- Fonts and page breaks of Word/HTML → PDF may differ from the original app.
- Files stay on your device; nothing is uploaded.

### Document Converter

**URL:** [https://tools.brandique.in/tools/document-converter/](https://tools.brandique.in/tools/document-converter/)  
**Formats:** TXT, CSV, JSON, HTML, Markdown

Convert simple text documents between TXT, Markdown, HTML, JSON and CSV.

**How to use**

1. Choose or drop a .txt, .md, .html, .json or .csv file.
2. Pick the target in Convert to (only valid targets are listed).
3. The file converts automatically; check the size and click Download.

**Options and controls**

| Option | What it does |
|---|---|
| Detected input | The format read from the file extension. |
| Convert to | TXT → Markdown, HTML, JSON · Markdown → TXT, HTML · HTML → TXT, Markdown · JSON → TXT (pretty), CSV · CSV → TXT (tab-separated), JSON. |

**Output:** name-converted.<ext> with input and output sizes.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Layout, fonts and images are not preserved; this is for structured text.
- Images and other non-text files are rejected; use File Converter or Document Format Converter instead.
- JSON → CSV expects an array of objects (or one object).
- Files stay on your device; nothing is uploaded.

---

## Converters

### Universal File Converter

**URL:** [https://tools.brandique.in/tools/file-converter/](https://tools.brandique.in/tools/file-converter/)  
**Formats:** Images, Text formats, Limited media

Convert images between PNG, JPEG and WebP, and text files between TXT, Markdown, HTML, JSON and CSV.

**How to use**

1. Choose or drop an image or text file.
2. Pick the target in Convert to.
3. Conversion runs automatically; check the size/preview and click Download.

**Options and controls**

| Option | What it does |
|---|---|
| Detected input | IMAGE for pictures, otherwise the text format from the extension. |
| Convert to | Images: png, jpeg or webp (quality 90 %). Text: same matrix as Document Converter. |

**Output:** name-converted.<ext>; images show a preview, dimensions and input → output size.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Unsupported files (video, PDF, Office) show a clear message and clear the old result.
- JPEG has no transparency; transparent areas become white.
- Files stay on your device; nothing is uploaded.

### Unit Converter

**URL:** [https://tools.brandique.in/tools/unit-converter/](https://tools.brandique.in/tools/unit-converter/)  
**Formats:** Length, Area, Temperature, Volume, Mass

Convert between units in 23 categories, from length and temperature to data, pressure and cooking.

**How to use**

1. Pick a category tab (Length, Area, Volume, Mass, Temperature, Time, Speed, Pressure, Energy, Power, Frequency, Digital storage, Data transfer, Fuel economy, Angle, Acceleration, Force, Torque, Density, Numbers, Typography, Cooking, Illumination).
2. Type a value and choose the From unit.
3. Choose the To unit for the primary result; all other units are listed below.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |
| Category tabs | Switch the measurement type. |

**Output:** Results on screen; Copy primary copies the main result.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Files stay on your device; nothing is uploaded.

### Length Converter

**URL:** [https://tools.brandique.in/tools/length-converter/](https://tools.brandique.in/tools/length-converter/)  
**Formats:** mm, cm, m, km, in, ft, yd, mi

Convert nm, μm, mm, cm, m, km, in, ft, yd, mi and nautical miles.

**How to use**

1. Type a value.
2. Choose From and To units.
3. Read the primary result or the full list.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Files stay on your device; nothing is uploaded.

### Area Converter

**URL:** [https://tools.brandique.in/tools/area-converter/](https://tools.brandique.in/tools/area-converter/)  
**Formats:** m², km², ft², acre, hectare

Convert mm², cm², m², km², in², ft², yd², mi², acres and hectares.

**How to use**

1. Type a value.
2. Choose From and To units.
3. Read the primary result or the full list.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Files stay on your device; nothing is uploaded.

### Temperature Converter

**URL:** [https://tools.brandique.in/tools/temperature-converter/](https://tools.brandique.in/tools/temperature-converter/)  
**Formats:** °C, °F, K

Convert Celsius, Fahrenheit, Kelvin and Rankine with exact offset formulas.

**How to use**

1. Type a temperature.
2. Choose From and To scales.
3. Read the result.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Values below absolute zero (0 K = −273.15 °C = −459.67 °F = 0 °R) show an error.
- Files stay on your device; nothing is uploaded.

### Volume Converter

**URL:** [https://tools.brandique.in/tools/volume-converter/](https://tools.brandique.in/tools/volume-converter/)  
**Formats:** mL, L, m³, gal, qt, pt, cup

Convert mL, L, cm³, m³, in³, ft³, US/Imperial gallons, quarts, pints, cups, fl oz, tbsp and tsp.

**How to use**

1. Type a value.
2. Choose From and To units.
3. Read the result.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Cups, pints and quarts are US measures.
- Files stay on your device; nothing is uploaded.

### Weight Converter

**URL:** [https://tools.brandique.in/tools/weight-converter/](https://tools.brandique.in/tools/weight-converter/)  
**Formats:** mg, g, kg, tonne, oz, lb, stone

Convert μg, mg, g, kg, tonnes, ounces, pounds, stone, US tons and Imperial tons.

**How to use**

1. Type a value.
2. Choose From and To units.
3. Read the result.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Files stay on your device; nothing is uploaded.

### Power Converter

**URL:** [https://tools.brandique.in/tools/power-converter/](https://tools.brandique.in/tools/power-converter/)  
**Formats:** W, kW, MW, hp

Convert mW, W, kW, MW, GW, mechanical hp, metric hp (PS) and BTU/h.

**How to use**

1. Type a value.
2. Choose From and To units.
3. Read the result.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Files stay on your device; nothing is uploaded.

### Speed Converter

**URL:** [https://tools.brandique.in/tools/speed-converter/](https://tools.brandique.in/tools/speed-converter/)  
**Formats:** m/s, km/h, mph, knot, ft/s

Convert m/s, km/h, mph, ft/s, knots and Mach (at sea level).

**How to use**

1. Type a value.
2. Choose From and To units.
3. Read the result.

**Options and controls**

| Option | What it does |
|---|---|
| Value | The number to convert. Decimals and negative numbers are allowed (temperatures below absolute zero are rejected). |
| From unit | The unit of the value you typed. |
| ⇄ Swap | Swaps the From and To units. |
| To unit (Primary conversion) | The main target unit shown large on the right, with the formula used. |
| Precision | Decimal places shown (0–15, default 6). |
| Scientific | Shows results in scientific notation, e.g. 1.234560e+3. |
| Significant figures | Uses Precision as the number of significant figures instead of decimal places. |
| Clear | Empties the value box. |
| Copy primary | Copies the primary result to the clipboard. |
| Favorite source | Stars the current From unit so it is listed first. |
| Search results | Filters the all-units list by name or symbol. |
| ☆ / ★ (per row) | Adds or removes a unit from your favourites for this category. |
| Recent history | Click an entry to restore that conversion. |

**Output:** Results on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Type a value and every unit in the category updates at once; the right-hand box shows the one target unit you pick.
- Values update as you type; a conversion is added to Recent history when you change the value or a unit (last 20, stored only in this browser).
- Use ⇄ Swap to reverse the conversion, the ☆ star to pin favourite units to the top, and Precision / Scientific / Significant figures to control rounding.
- Files stay on your device; nothing is uploaded.

---

## Calculators

### Exact Age Calculator

**URL:** [https://tools.brandique.in/tools/age-calculator/](https://tools.brandique.in/tools/age-calculator/)  
**Formats:** Date, Optional time

Exact calendar age plus live, second-by-second stats: totals, a next-birthday countdown, zodiac signs, birthstone, generation, life-in-numbers estimates, age on other planets and milestone dates.

**How to use**

1. Enter your Birth date (and, optionally, your Birth time for exact hours, minutes and seconds).
2. Everything appears instantly: calendar age, a live next-birthday countdown and your age in years, months, weeks, days, hours, minutes and seconds, ticking every second.
3. Scroll the cards: About your birthday, Your life in numbers (approximate), Your age on other planets and Milestones.
4. Change “Calendar age on” to see your calendar age on another date (the live counters always use the current time).

**Options and controls**

| Option | What it does |
|---|---|
| Birth date | Date of birth (required). |
| Birth time (optional) | Time of birth; without it midnight is used. |
| Calendar age on | Date used for the headline years-months-days age (default today). |
| Your age right now (live) | Years (8 decimals), months, weeks, days, hours, minutes and seconds, updated every second. |
| Next birthday · live countdown | Days, hours, minutes and seconds to your next birthday, the age you will turn and its date. |
| About your birthday | Day of the week you were born, zodiac sign, Chinese zodiac (element + animal, by birth year), birthstone, birth flower, generation (Gen Z, Millennial…), leap days lived and the weekday of your next birthday. |
| Your life in numbers (approximate) | Estimated heartbeats (80/min), breaths (16/min), hours asleep (one third of life), meals (3/day), blinks (15 per waking minute), steps (about 6,000/day after age one), distance travelled around the Sun (29.78 km/s) and full moons seen (every 29.53 days). |
| Your age on other planets | Your age in Mercury, Venus, Mars, Jupiter, Saturn, Uranus and Neptune years (by orbital period). |
| Milestones | Dates you reach 10,000 / 15,000 / 20,000 / 25,000 / 30,000 days, 500 million / 1 / 2 billion seconds, 1,000–3,000 weeks, 10,000–500,000 hours and 1–25 million minutes, marked passed or “in N days”. |

**Output:** Years, months and days, live totals, a live birthday countdown and the fact and estimate cards — all on screen, nothing uploaded.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Uses calendar months, not averages.
- A 29 February birthday is counted on 28 February in non-leap years (and on 29 February in leap years); month-end dates use the last day of shorter months.
- Life-in-numbers values are rough averages for fun, not medical facts.
- Chinese zodiac follows the birth year; if you were born in January or early February, check the Chinese New Year date for your year.
- The live counters pause when the tab is hidden and stop when you leave the page.
- Files stay on your device; nothing is uploaded.

### Percentage Calculator

**URL:** [https://tools.brandique.in/tools/percentage-calculator/](https://tools.brandique.in/tools/percentage-calculator/)  
**Formats:** Numbers

Five percentage calculations with the formula and steps shown.

**How to use**

1. Pick a mode tab.
2. Enter the two values (and Direction where shown).
3. The result, formula and steps update as you type.

**Options and controls**

| Option | What it does |
|---|---|
| Percentage of a value | X % of Y (e.g. 15 % of 200 = 30). |
| What percent? | Part is what % of Total. |
| Percent change | Change from Starting value to New value. |
| Increase / decrease | Base value ± a percentage. |
| Reverse percentage | Original value before a % increase/decrease. |
| Direction | Increase or Decrease (last two modes). |
| Reset | Restores the default example values. |
| Copy result | Copies a one-line summary of the result. |
| Local history | Your last 12 results, saved only in this browser. Copy re-copies an entry; Clear history deletes them. |

**Output:** Result with formula and step-by-step working.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Total and Starting value cannot be zero.
- Files stay on your device; nothing is uploaded.

### EMI Calculator

**URL:** [https://tools.brandique.in/tools/emi-calculator/](https://tools.brandique.in/tools/emi-calculator/)  
**Formats:** Currency values

Monthly loan EMI, interest, amortization schedule and prepayment savings, or compare two loans.

**How to use**

1. Enter loan principal, annual interest rate and tenure in months.
2. Optionally add an extra monthly payment or a one-time prepayment.
3. Results, the schedule table and balance chart update as you type; download the schedule as CSV.
4. Use the Compare loans tab to compare two offers.

**Options and controls**

| Option | What it does |
|---|---|
| Loan principal | Amount borrowed (default ₹10,00,000). |
| Annual interest rate (%) | Default 9 %. 0 % is allowed. |
| Tenure (months) | Number of EMIs (default 120). A 60-month loan finishes in exactly 60 months. |
| Extra monthly payment | Added to every EMI to finish early. |
| One-time prepayment month / amount | A lump sum paid in that month. |
| Compare loans | Loan A and Loan B principal, rate and tenure; shows which costs less in total. |
| Download CSV | Saves emi-amortization.csv (month, payment, principal, interest, balance). |
| Reset | Restores the default example values. |
| Copy result | Copies a one-line summary of the result. |
| Local history | Your last 12 results, saved only in this browser. Copy re-copies an entry; Clear history deletes them. |

**Output:** Monthly EMI, total interest, total paid, interest saved and months saved, plus the full schedule and chart.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Amounts are shown in Indian Rupees format but the maths works for any currency.
- Results are estimates; your lender’s rounding may differ slightly.
- Files stay on your device; nothing is uploaded.

### Discount Calculator

**URL:** [https://tools.brandique.in/tools/discount-calculator/](https://tools.brandique.in/tools/discount-calculator/)  
**Formats:** Currency values

Final price after one or two discounts and optional tax.

**How to use**

1. Enter the original price and discount %.
2. Optionally add an additional discount, tax and quantity.
3. Read the final total, savings and steps.

**Options and controls**

| Option | What it does |
|---|---|
| Original price | Price per item (default 2499). |
| Discount (%) | 0–100 (default 20). |
| Additional discount (%) | Applied to the already-discounted price. |
| Tax after discount (%) | Added on the discounted price. |
| Quantity | Number of items (default 1). |
| Reset | Restores the default example values. |
| Copy result | Copies a one-line summary of the result. |
| Local history | Your last 12 results, saved only in this browser. Copy re-copies an entry; Clear history deletes them. |

**Output:** Final total, You save, Effective discount, Discounted subtotal and Tax.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- 20 % + 10 % extra is 28 % effective, not 30 %.
- Files stay on your device; nothing is uploaded.

### GST Calculator

**URL:** [https://tools.brandique.in/tools/gst-calculator/](https://tools.brandique.in/tools/gst-calculator/)  
**Formats:** Currency values

Add or remove GST and split it into CGST + SGST or IGST, with a printable invoice summary.

**How to use**

1. Enter amount per item, GST rate and quantity.
2. Choose GST exclusive (add GST) or inclusive (extract GST from the price).
3. Choose intra-state or inter-state supply.
4. Optionally add invoice number and customer, then Print invoice.

**Options and controls**

| Option | What it does |
|---|---|
| Amount per item | Default 1000. |
| GST rate (%) | Default 18 (0–100). |
| Quantity | Default 1. |
| Price type | GST exclusive (price + GST) or GST inclusive (price already includes GST). |
| Supply type | Intra-state: CGST + SGST (half each). Inter-state: IGST. |
| Invoice number / Customer | Shown on the printable summary. |
| Print invoice | Opens the browser print dialog for the summary. |
| Reset | Restores the default example values. |
| Copy result | Copies a one-line summary of the result. |
| Local history | Your last 12 results, saved only in this browser. Copy re-copies an entry; Clear history deletes them. |

**Output:** Taxable value, total GST, CGST/SGST or IGST and invoice total.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Common Indian GST slabs are 5 %, 12 %, 18 % and 28 %; check the correct rate for your item.
- Files stay on your device; nothing is uploaded.

---

## Resume Tools

### Resume ATS Score Checker

**URL:** [https://tools.brandique.in/tools/resume-ats-checker/](https://tools.brandique.in/tools/resume-ats-checker/)  
**Formats:** PDF, DOCX, TXT

Score how readable and complete a resume is, and how well it matches a job description.

**How to use**

1. Upload your resume as PDF, DOCX or TXT (up to 10 MB; PDFs up to 30 pages).
2. Optionally paste the job description to get a job-match score.
3. Open “Review extracted resume text” and fix any extraction mistakes; the report updates as you edit.
4. Read the breakdown and improvement plan; download the JSON report if you want to keep it.

**Options and controls**

| Option | What it does |
|---|---|
| Upload your resume | PDF, DOCX or TXT. Other types show “This file type is not supported. Upload PDF, DOCX or TXT.” with a Try another file button. |
| Job description (optional) | With a JD the main score is 40 % resume quality + 60 % job match. |
| Review extracted resume text | Editable text the score is based on; you can also paste a resume here. |
| Try another file | Shown when a file cannot be read; opens the file picker again. |

**Output:** Score /100, Resume quality and Job match sub-scores, category breakdown, keyword evidence per JD term, a prioritised improvement plan, and a downloadable resume-readiness-report.json.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Resumes under 30 words show “Your resume has only N words. Add at least M more words (minimum 30) to get a score.”
- Scanned (image) PDFs with no readable text show “Not enough readable resume text to score… Scanned PDFs need OCR first.”
- Multi-column layouts may extract in the wrong order; check the extracted text.
- This is a readiness estimate, not an employer’s ATS result.
- Files stay on your device; nothing is uploaded.

---

## Utilities

### JSON Formatter

**URL:** [https://tools.brandique.in/tools/json-formatter/](https://tools.brandique.in/tools/json-formatter/)  
**Formats:** JSON

Pretty-print, minify and sort JSON, with exact error positions.

**How to use**

1. Paste JSON into Input.
2. The formatted result appears automatically; errors show the line and column.
3. Copy or download the result.

**Options and controls**

| Option | What it does |
|---|---|
| Indent | 2 spaces (default), 4 spaces or Compact. |
| Sort keys | Sorts object keys alphabetically at every level. |
| Minify | Removes all whitespace. |
| Clear | Empties the input and result. |
| Copy result / Download | Copy to clipboard or save formatted.json. |
| Error location | Invalid JSON shows the line, column and the offending line with a ^ marker. |
| Size & depth | The status line shows input and output size in bytes and the nesting depth. |

**Output:** Formatted or minified JSON text.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Comments and trailing commas are not valid JSON and will be reported.
- Files stay on your device; nothing is uploaded.

### JSON Validator

**URL:** [https://tools.brandique.in/tools/json-validator/](https://tools.brandique.in/tools/json-validator/)  
**Formats:** JSON

Check whether text is valid JSON and see where it breaks.

**How to use**

1. Paste JSON (or click Load sample).
2. The result shows Valid JSON with the root type and number of keys/items, or the error with line and column.

**Options and controls**

| Option | What it does |
|---|---|
| Load sample | Inserts a small valid example. |
| Clear | Empties the input and result. |
| Copy result / Download | Copy the validation report or save json-validation.txt. |
| Error location | Invalid JSON shows the line, column and the offending line with a ^ marker. |
| Size & depth | The status line shows the size in bytes and the nesting depth. |

**Output:** Validation report text.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Fix the first error reported, then re-check; later errors often disappear.
- Files stay on your device; nothing is uploaded.

### Base64 Encoder & Decoder

**URL:** [https://tools.brandique.in/tools/base64-encoder-decoder/](https://tools.brandique.in/tools/base64-encoder-decoder/)  
**Formats:** Text, Files

Encode text or a file to Base64, or decode Base64 back to text.

**How to use**

1. Choose Encode or Decode (the active mode is highlighted with a ✓).
2. Type or paste into Input; the result updates as you type, always from the input (never re-encoding the previous result).
3. Copy or download the result. Use Clear to start again.

**Options and controls**

| Option | What it does |
|---|---|
| Encode / Decode | Mode toggle; Encode turns UTF-8 text into Base64, Decode turns Base64 into text. |
| Clear | Empties the input and result. |
| Encode a file (max 10 MB) | Encodes any file’s bytes to Base64. |
| Copy result / Download | Disabled while there is an error or no result. |

**Output:** Base64 or decoded text (base64.txt / decoded.txt).

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Errors (invalid Base64, or binary data that is not UTF-8 text) appear in the result panel.
- Base64 is encoding, not encryption.
- Files stay on your device; nothing is uploaded.

### URL Encoder & Decoder

**URL:** [https://tools.brandique.in/tools/url-encoder-decoder/](https://tools.brandique.in/tools/url-encoder-decoder/)  
**Formats:** Text, URL components

Percent-encode or decode URL components and full URLs.

**How to use**

1. Choose Encode or Decode.
2. Choose the Scope.
3. Type or paste input; the result updates as you type. Copy, download or Clear.

**Options and controls**

| Option | What it does |
|---|---|
| Encode / Decode | Mode toggle with the active mode highlighted. |
| Scope | Component (encodes everything special, for query values and path segments) or Full URL (keeps : / ? & = so the URL still works). |
| Clear | Empties input and result. |
| Copy result / Download | Saves url-result.txt. |

**Output:** Encoded/decoded text.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- In Component decode, “+” is treated as a space.
- A “%” must be followed by two hex digits, otherwise an error is shown in the result panel.
- Files stay on your device; nothing is uploaded.

### Password Generator

**URL:** [https://tools.brandique.in/tools/password-generator/](https://tools.brandique.in/tools/password-generator/)  
**Formats:** Text

Generate strong random passwords with the browser’s secure random generator.

**How to use**

1. Set the Length.
2. Tick the character sets you want.
3. A new password appears instantly; click Generate for another, then Copy password.

**Options and controls**

| Option | What it does |
|---|---|
| Length | 8–128 characters (default 20). |
| Lowercase / Uppercase / Numbers / Symbols | Character sets (all on by default). At least one is required; with none, the output is cleared and Copy is disabled. |
| Generate | Creates a new password. |
| Copy password | Copies it to the clipboard. |

**Output:** Password plus strength label (Weak, Fair, Good ≥55 bits, Strong ≥80 bits) and estimated entropy.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Look-alike characters (l, I, O, 0, 1) are excluded; symbols are ! @ # $ % ^ & * _ - + =.
- Every chosen set appears at least once.
- Nothing is stored or sent.
- Files stay on your device; nothing is uploaded.

### Word & Character Counter

**URL:** [https://tools.brandique.in/tools/word-counter/](https://tools.brandique.in/tools/word-counter/)  
**Formats:** Text

Live counts of words, characters, sentences, paragraphs and reading time.

**How to use**

1. Type or paste text into Input.
2. Statistics update as you type.
3. Clear empties the box.

**Options and controls**

| Option | What it does |
|---|---|
| Words | Language-aware word count. |
| Characters / No spaces | Unicode characters with and without whitespace. |
| Sentences / Paragraphs | Paragraphs are separated by blank lines. |
| Read minutes / Speak minutes | At 200 and 130 words per minute. |
| Clear | Empties the text. |
| Unique words / Avg word length / Words per sentence | Extra readability figures that update as you type. |
| Top keywords | The most repeated meaningful words with their count and share of all words. Common words such as “the” and “and” are ignored. |

**Output:** Statistics on screen.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Emoji and accented letters count as single characters; emoji are not counted as words (“🙏 Namaste 🙏” = 1 word).
- Files stay on your device; nothing is uploaded.

### Case Converter

**URL:** [https://tools.brandique.in/tools/case-converter/](https://tools.brandique.in/tools/case-converter/)  
**Formats:** Text

Change text to upper, lower, title, sentence, camel, Pascal, snake, kebab or CONSTANT case.

**How to use**

1. Paste text into Input.
2. Click a case button; the result updates as you keep typing.
3. Copy or download.

**Options and controls**

| Option | What it does |
|---|---|
| Upper / Lower | ALL CAPS or all lowercase. |
| Title | Capitalises Each Word. |
| Sentence | First letter capitalised. |
| Camel / Pascal | camelCase / PascalCase. |
| Snake / Kebab / Constant | snake_case, kebab-case, CONSTANT_CASE. |
| Active case | The selected case button is highlighted with a ✓ (Upper by default). |
| Clear | Empties the input and result. |
| Copy result / Download | Saves converted-text.txt. |

**Output:** Converted text.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Camel, Pascal, snake, kebab and constant remove punctuation between words.
- Files stay on your device; nothing is uploaded.

### HEX, RGB & HSL Color Converter

**URL:** [https://tools.brandique.in/tools/color-converter/](https://tools.brandique.in/tools/color-converter/)  
**Formats:** HEX, RGB, HSL

Convert colours between HEX, RGB and HSL with a live preview and contrast check.

**How to use**

1. Type a HEX value, or RGB, or HSL numbers.
2. The other fields, preview and CSS values update instantly (the field you are typing in is never overwritten).
3. Copy the CSS values.

**Options and controls**

| Option | What it does |
|---|---|
| HEX | 3, 4, 6 or 8 digits, with or without #. Tidied to #RRGGBB when you leave the field. |
| Red / Green / Blue | 0–255. Values outside the range are not clamped; the field is marked and “Red: 0–255 only.” (etc.) is shown. |
| Hue / Saturation % / Lightness % | 0–360 and 0–100. |
| Preview | Shows the colour with the more readable text colour (black or white) and its contrast ratio. |
| Copy CSS values | Copies HEX, rgb() and hsl() lines. |
| Contrast checker | Pick a text colour to test on the current background. Shows the contrast ratio and whether it passes WCAG AA/AAA for normal and large text. |
| Palette | Tints and shades of the colour plus complementary, analogous and triadic hues. Click a swatch to load it. |

**Output:** HEX, RGB, HSL and best text colour with contrast ratio.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Aim for a contrast of at least 4.5:1 for body text.
- Files stay on your device; nothing is uploaded.

### Unix Timestamp Converter

**URL:** [https://tools.brandique.in/tools/timestamp-converter/](https://tools.brandique.in/tools/timestamp-converter/)  
**Formats:** Unix, ISO 8601

Convert Unix timestamps to dates and dates to timestamps.

**How to use**

1. The page starts with the current time.
2. Type a Unix timestamp on the left to see Local, UTC and ISO dates.
3. Or pick a local date and time on the right to get seconds and milliseconds.

**Options and controls**

| Option | What it does |
|---|---|
| Unix timestamp | Seconds or milliseconds since 1 Jan 1970 UTC. |
| Detect unit | Auto (values ≥ 100 billion are milliseconds), Seconds or Milliseconds. |
| Local date and time | Date/time in your device time zone. |
| Use current time | Fills both sides with now. |

**Output:** Local, UTC, ISO 8601 and time zone; or seconds, milliseconds and ISO.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- Local time uses your device’s time zone.
- Files stay on your device; nothing is uploaded.

### QR Code Generator

**URL:** [https://tools.brandique.in/tools/qr-code-generator/](https://tools.brandique.in/tools/qr-code-generator/)  
**Formats:** URL, Wi-Fi, vCard, PNG, SVG, JPG

Create styled QR codes for links, text, Wi-Fi, phone, email, SMS, WhatsApp, contact cards (vCard), images and videos — with colours, gradients, dot and corner styles and a centre logo — and download PNG, SVG or JPG.

**How to use**

1. Step 1 · Content: pick a type (URL, Text, Wi-Fi, Phone, Email, SMS, WhatsApp, Contact, Image or Video) and fill in its fields.
2. For Image or Video: either paste a public link, or upload the file — tick the consent box first, because the file is sent through BrandiQue’s upload service to a free public host to get a TEMPORARY link (Litterbox: direct link that expires after 1–72 hours; or Gofile: a page link that is removed when inactive). Upload progress shows in the preview panel.
3. Step 2 · Design: choose size, margin, dot style, colours or a gradient, corner frame/centre style and colour, an optional centre logo and the error-correction level.
4. Step 3 · Preview & download: the code is drawn in the right panel and scan-tested in your browser, then download PNG, SVG or JPG.

**Options and controls**

| Option | What it does |
|---|---|
| Content types | URL, Text, Wi-Fi (WPA/WEP/open, hidden network), Phone, Email (subject/body), SMS, WhatsApp (wa.me link with message), Contact card (vCard 3.0), Image and Video. |
| Image / Video upload | Up to 95 MB, and always temporary. Litterbox (litterbox.catbox.moe — not the permanent Catbox service) gives a direct link and deletes the file after 1, 12, 24 or 72 hours. Gofile (gofile.io) gives a page link; free files can be removed after a period without downloads. Nothing is uploaded unless you tick the consent box and press Upload. For a permanent code, paste a link to a file you host yourself. |
| Size / Margin | 256 to 2048 px; margin (quiet zone) 0–80 px. |
| Dot style | Square, Rounded, Dots, Classy, Classy rounded or Extra rounded. |
| Colours & gradient | Dot colour, background colour or transparent background (PNG/SVG), and an optional linear or radial two-colour gradient with angle. |
| Corner frame / centre | Square, rounded or circle frames and square or circle centres, each with its own colour. |
| Centre logo | PNG, JPG, WebP or SVG up to 2 MB, small/medium/large. A logo switches error correction to High automatically. |
| Error correction | Low 7%, Medium 15%, Quartile 25% or High 30%. |
| Scan test | Every design is decoded in your browser at two sizes; a warning appears if it does not decode exactly. |
| Download PNG / SVG / JPG | PNG keeps transparency, SVG is scalable for print, JPG uses a white background. |

**Output:** brandique-qr.png, brandique-qr.svg or brandique-qr.jpg.

**Limits & tips**

- Every tool follows the same three steps shown above it — 1 Upload or enter input, 2 Choose options, 3 Preview & download — with a status line that says what to do next. On a computer the options sit on the left and middle and the preview & result panel stays on the right; progress (with % where available) is shown inside that panel. On phones the steps stack in order. Start over clears the tool.
- While the code is generated and scan-tested a short progress bar shows in the result panel; it clears as soon as the scan test finishes (for every type, including uploads and pasted links) and the QR shows in full colour.
- Keep dark dots on a light background — light-on-dark and low-contrast codes are flagged.
- If the scan test warns, raise contrast, use square corners, a smaller logo or higher error correction.
- Uploaded links are temporary (Litterbox and Gofile) — do not print a QR made from a temporary upload. Use your own permanent link instead.
- Test the printed size with your phone camera before ordering prints.
- Files stay on your device; nothing is uploaded.

---

## Frequently asked questions

**Are my files uploaded?**  
No. Files are read and processed by your browser on your device. Closing the tab discards them.

**Is there a file size limit?**  
Limits depend on your device memory. Built-in limits: Resume ATS 10 MB (PDF ≤30 pages), Document Format Converter 25 MB, PDF Splitter 80 MB/300 pages, Base64 file 10 MB, Screenshot Editor 60 MP, Image Resizer 150 MP, video 16 MP output.

**Why is video output WebM, not MP4?**  
Browsers can record WebM natively but cannot reliably encode MP4. WebM plays in Chrome, Edge, Firefox, VLC and most editors.

**Why did a tool say “This is not a video file” / “Only image files are supported” / “This file is not a PDF”?**  
Each tool checks the file type before processing. Choose a file of the type named in the message.

**Why does the page ask before I leave?**  
After you load a file, the browser asks for confirmation so an accidental click does not lose your work.

**Do the tools work offline?**  
After installing the app, pages you have opened load from cache. Tools that download a library (PDF, DOCX, QR) need internet the first time.

**Is the ATS score what employers see?**  
No. It is a transparent readiness estimate based on readable text, structure and keyword evidence.

**I found a bug. How do I report it?**  
Use the Contact page on tools.brandique.in or email BrandiQue Web Solutions via brandique.in.

---

*BrandiQue Tools is built by [BrandiQue Web Solutions](https://www.brandique.in). Guide generated from the site’s tool definitions (src/tool-guides.mjs).*
