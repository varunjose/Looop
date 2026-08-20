import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const entries = ['index.html', 'styles.css', 'app.js', 'favicon.svg', 'og-image.svg', 'assets', '.nojekyll'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of entries) {
  await cp(join(root, entry), join(output, entry), { recursive: true });
}

console.log(`Built ${entries.length} static entries in dist/`);
