import express from 'express';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

if (!existsSync(path.join(distDir, 'index.html'))) {
  console.log('Building static site distribution before starting server...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error('Build failed during server initialization:', err);
  }
}

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Serve static assets from dist
app.use(express.static(distDir, {
  extensions: ['html'],
  index: 'index.html'
}));

// Route fallback for trailing slash / directory matching
app.use((req, res) => {
  const cleanPath = req.path.replace(/\/+$/, '');
  const candidateHtml = path.join(distDir, `${cleanPath}.html`);
  const candidateIndex = path.join(distDir, cleanPath, 'index.html');

  if (cleanPath && existsSync(candidateIndex)) {
    return res.sendFile(candidateIndex);
  }
  if (cleanPath && existsSync(candidateHtml)) {
    return res.sendFile(candidateHtml);
  }
  const rootIndex = path.join(distDir, 'index.html');
  if (existsSync(rootIndex)) {
    return res.status(200).sendFile(rootIndex);
  }
  return res.status(404).send('Not Found');
});

const server = app.listen(PORT, HOST, () => {
  console.log(`BrandiQue Tools server running on http://${HOST}:${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
