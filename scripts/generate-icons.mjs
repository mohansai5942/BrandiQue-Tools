import { deflateSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgbaBuffer) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let scanOffset = 0;
  let rgbaOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[scanOffset++] = 0; // filter type 0 (None)
    rgbaBuffer.copy(scanlines, scanOffset, rgbaOffset, rgbaOffset + width * 4);
    scanOffset += width * 4;
    rgbaOffset += width * 4;
  }

  const idat = createChunk('IDAT', deflateSync(scanlines, { level: 9 }));
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function renderBrandIcon(size, isMaskable = false) {
  const buf = Buffer.alloc(size * size * 4); // RGBA

  const yellow = [0xf5, 0xdf, 0x32, 0xff]; // #f5df32
  const dark = [0x11, 0x11, 0x11, 0xff]; // #111
  const bg = isMaskable ? yellow : [0, 0, 0, 0];

  // Fill background
  for (let i = 0; i < size * size; i++) {
    buf[i * 4] = bg[0];
    buf[i * 4 + 1] = bg[1];
    buf[i * 4 + 2] = bg[2];
    buf[i * 4 + 3] = bg[3];
  }

  // Determine card bounding box
  // For maskable, safe zone is central 70-80%
  const scale = isMaskable ? 0.72 : 0.92;
  const cardSize = size * scale;
  const pad = (size - cardSize) / 2;
  const radius = cardSize * 0.28;

  function distToRoundedRect(px, py, x, y, w, h, r) {
    const cx = Math.max(x + r, Math.min(x + w - r, px));
    const cy = Math.max(y + r, Math.min(y + h - r, py));
    const dx = px - cx;
    const dy = py - cy;
    if (px >= x && px <= x + w && py >= y && py <= y + h) {
      if (px < x + r || px > x + w - r || py < y + r || py > y + h - r) {
        return Math.sqrt(dx * dx + dy * dy) - r;
      }
      return -1; // deep inside
    }
    const qx = Math.abs(px - (x + w / 2)) - (w / 2 - r);
    const qy = Math.abs(py - (y + h / 2)) - (h / 2 - r);
    return Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) - r;
  }

  // Draw rounded card (yellow) if not maskable (maskable is already full yellow)
  if (!isMaskable) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const d = distToRoundedRect(x, y, pad, pad, cardSize, cardSize, radius);
        if (d <= 0) {
          const idx = (y * size + x) * 4;
          buf[idx] = yellow[0];
          buf[idx + 1] = yellow[1];
          buf[idx + 2] = yellow[2];
          buf[idx + 3] = yellow[3];
        } else if (d < 1) {
          const alpha = Math.max(0, Math.min(1, 1 - d));
          const idx = (y * size + x) * 4;
          buf[idx] = yellow[0];
          buf[idx + 1] = yellow[1];
          buf[idx + 2] = yellow[2];
          buf[idx + 3] = Math.round(alpha * 255);
        }
      }
    }
  }

  // Now draw the B monogram in dark
  // SVG original:
  // ViewBox 0 0 64 64
  // Path 1 (dark): M18 10h17c10 0 16 5 16 12 0 4-2 7-6 9 5 2 7 6 7 10 0 8-6 13-17 13H18V10Z (after translate 0 -4)
  // Cutout 1 (yellow): M27 18h8c4 0 6 2 6 5s-2 5-6 5h-8V18Z
  // Cutout 2 (yellow): M27 35h9c4 0 6 2 6 5s-2 5-6 5h-9V35Z
  // Accent line: m46 47 8 8 stroke-width 4
  const mapX = (sx) => pad + (sx / 64) * cardSize;
  const mapY = (sy) => pad + (sy / 64) * cardSize;

  // Let's rasterize by sub-sampling 2x2 grid for anti-aliasing
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // normalized 0..64 coords inside card
      const nx = ((x - pad) / cardSize) * 64;
      const ny = ((y - pad) / cardSize) * 64;

      if (nx < 0 || nx > 64 || ny < 0 || ny > 64) continue;

      let isInsideB = false;
      let isCutout1 = false;
      let isCutout2 = false;
      let isAccent = false;

      // Dark B bounding check:
      // Vertical stem from x: 18 to 27, y: 10 to 54
      if (nx >= 18 && nx <= 27 && ny >= 10 && ny <= 54) {
        isInsideB = true;
      }
      // Top lobe: outer arc from y: 10 to 31, x: 27 to ~51
      if (ny >= 10 && ny <= 31 && nx >= 27) {
        const cy = 20.5;
        const rx = 18;
        const ry = 10.5;
        const val = ((nx - 27) / rx) ** 2 + ((ny - cy) / ry) ** 2;
        if (val <= 1.0) isInsideB = true;
      }
      // Bottom lobe: outer arc from y: 31 to 54, x: 27 to ~52
      if (ny >= 31 && ny <= 54 && nx >= 27) {
        const cy = 42.5;
        const rx = 19;
        const ry = 11.5;
        const val = ((nx - 27) / rx) ** 2 + ((ny - cy) / ry) ** 2;
        if (val <= 1.0) isInsideB = true;
      }

      // Cutout 1: top hole (rounded rect x: 27..35, y: 18..28)
      if (nx >= 27 && ny >= 18 && ny <= 28) {
        if (nx <= 35) isCutout1 = true;
        else {
          const cy = 23;
          const rx = 6;
          const ry = 5;
          if (((nx - 35) / rx) ** 2 + ((ny - cy) / ry) ** 2 <= 1.0) isCutout1 = true;
        }
      }

      // Cutout 2: bottom hole (rounded rect x: 27..36, y: 35..45)
      if (nx >= 27 && ny >= 35 && ny <= 45) {
        if (nx <= 36) isCutout2 = true;
        else {
          const cy = 40;
          const rx = 6;
          const ry = 5;
          if (((nx - 36) / rx) ** 2 + ((ny - cy) / ry) ** 2 <= 1.0) isCutout2 = true;
        }
      }

      // Magnifier diagonal handle accent: line from (46, 47) to (54, 55), stroke 4
      const lx1 = 46, ly1 = 47, lx2 = 54, ly2 = 55;
      const ldx = lx2 - lx1, ldy = ly2 - ly1;
      const lenSq = ldx * ldx + ldy * ldy;
      const t = Math.max(0, Math.min(1, ((nx - lx1) * ldx + (ny - ly1) * ldy) / lenSq));
      const projX = lx1 + t * ldx;
      const projY = ly1 + t * ldy;
      const distAccent = Math.sqrt((nx - projX) ** 2 + (ny - projY) ** 2);
      if (distAccent <= 2.2) {
        isAccent = true;
      }

      const idx = (y * size + x) * 4;

      if (isAccent) {
        buf[idx] = yellow[0];
        buf[idx + 1] = yellow[1];
        buf[idx + 2] = yellow[2];
        buf[idx + 3] = 0xff;
      } else if (isInsideB && !isCutout1 && !isCutout2) {
        buf[idx] = dark[0];
        buf[idx + 1] = dark[1];
        buf[idx + 2] = dark[2];
        buf[idx + 3] = 0xff;
      }
    }
  }

  return encodePNG(size, size, buf);
}

// Generate all target icons
const pwa192 = renderBrandIcon(192, false);
await writeFile('public/pwa-192x192.png', pwa192);

const pwa512 = renderBrandIcon(512, false);
await writeFile('public/pwa-512x512.png', pwa512);

const pwaMaskable512 = renderBrandIcon(512, true);
await writeFile('public/pwa-maskable-512x512.png', pwaMaskable512);

const apple180 = renderBrandIcon(180, false);
await writeFile('public/apple-touch-icon.png', apple180);

console.log('Successfully generated PWA and Apple touch icons.');
