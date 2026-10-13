import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const distDir = path.resolve(__dirname, 'dist');

// Cloud Run readiness & liveness health check probes
app.get(['/health', '/_health', '/ping'], (_req, res) => {
  res.status(200).send('OK');
});

// Serve static assets with caching
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, {
    maxAge: '1d',
    immutable: false,
  }));
}

// SPA Fallback: send index.html for any unhandled routes
app.get('*', (_req, res) => {
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Maison Motors is initializing. Please refresh in a few seconds.');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Maison Motors production server running at http://0.0.0.0:${port}`);
});
