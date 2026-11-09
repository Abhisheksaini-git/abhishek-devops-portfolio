/**
 * Production Web Server for Abhishek Saini's DevOps Portfolio & AI Terminal
 * Native Node.js HTTP server with zero external framework overhead.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleDevOpsChatApi } from './api/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env parser for standalone execution
function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim().replace(/^['"](.*)['"]$/, '$1');
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (e) {
      console.warn('Could not parse .env file:', e.message);
    }
  }
}

loadLocalEnv();

const PORT = parseInt(process.env.PORT || '5173', 10);
const STATIC_DIR = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // 1. API Route: /api/chat
  if (pathname === '/api/chat' || pathname === '/api/chat/') {
    handleDevOpsChatApi(req, res, process.env);
    return;
  }

  // 2. Health check endpoint
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }));
    return;
  }

  // 3. Static File Serving
  let filePath = path.join(STATIC_DIR, pathname === '/' ? 'index.html' : pathname);

  // If running in development root and file not found, check public directory
  if (STATIC_DIR === __dirname && !fs.existsSync(filePath)) {
    const publicCandidate = path.join(__dirname, 'public', pathname);
    if (fs.existsSync(publicCandidate)) {
      filePath = publicCandidate;
    }
  }

  // Security: Prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback to index.html
      const fallbackIndex = path.join(STATIC_DIR, 'index.html');
      fs.readFile(fallbackIndex, (err2, data) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 Abhishek Saini DevOps Portfolio & AI Terminal Server`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
  console.log(`🤖 AI Endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`📁 Static Root: ${STATIC_DIR}`);
  console.log(`========================================================`);
});
