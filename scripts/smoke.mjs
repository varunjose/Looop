import { spawn } from 'node:child_process';

const port = 43173;
const baseUrl = `http://127.0.0.1:${port}`;
const paths = ['/', '/styles.css', '/app.js', '/favicon.svg', '/og-image.svg'];

const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, LOOOP_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'inherit'],
});

const ready = new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('Local server did not become ready')), 5000);
  server.stdout.on('data', (chunk) => {
    if (!chunk.toString().includes('Looop site running')) return;
    clearTimeout(timer);
    resolve();
  });
  server.once('exit', (code) => reject(new Error(`Local server exited early with code ${code}`)));
});

try {
  await ready;
  for (const path of paths) {
    const response = await fetch(`${baseUrl}${path}`);
    if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
    const body = await response.arrayBuffer();
    if (body.byteLength === 0) throw new Error(`${path} returned an empty body`);
    console.log(`✓ ${path} ${response.status} ${response.headers.get('content-type')}`);
  }
} finally {
  server.kill('SIGTERM');
}
