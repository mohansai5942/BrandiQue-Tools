import {readdir, readFile, writeFile} from 'node:fs/promises';

export const GTAG_ID = 'G-V4Q17T7C5Q';

export const GTAG_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V4Q17T7C5Q"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-V4Q17T7C5Q');
</script>`;

export function applyGoogleTag(html) {
  if (!html.includes('<head')) return html;

  // Clean out any existing gtag blocks to avoid duplicates
  let cleaned = html
    .replace(/<!-- Google tag \(gtag\.js\) -->\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-V4Q17T7C5Q"><\/script>\s*<script>[\s\S]*?gtag\('config',\s*'G-V4Q17T7C5Q'\);\s*<\/script>\s*/gi, '')
    .replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-V4Q17T7C5Q"><\/script>\s*/gi, '')
    .replace(/<script>\s*window\.dataLayer\s*=[\s\S]*?gtag\('config',\s*'G-V4Q17T7C5Q'\);\s*<\/script>\s*/gi, '');

  // Insert immediately after the opening <head> tag
  return cleaned.replace(/(<head\b[^>]*>)\s*/i, `$1\n${GTAG_SNIPPET}\n`);
}

async function walk(dir) {
  const files = [];
  try {
    for (const entry of await readdir(dir, {withFileTypes: true})) {
      const fullPath = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        files.push(...await walk(fullPath));
      } else if (fullPath.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory may not exist
  }
  return files;
}

export async function processAll(dirs = ['dist', 'public']) {
  let count = 0;
  for (const dir of dirs) {
    const htmlFiles = await walk(dir);
    await Promise.all(htmlFiles.map(async (file) => {
      const original = await readFile(file, 'utf8');
      const updated = applyGoogleTag(original);
      if (original !== updated) {
        await writeFile(file, updated);
        count++;
      }
    }));
  }
  return count;
}

if (process.argv[1] && process.argv[1].endsWith('analytics.mjs')) {
  const count = await processAll(['dist', 'public']);
  console.log(`Google Analytics: verified single Google tag (G-V4Q17T7C5Q) immediately after <head> in ${count} files.`);
}
