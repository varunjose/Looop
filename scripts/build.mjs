import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'favicon.svg', 'og-image.svg', '.nojekyll'];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of files) {
  await cp(join(root, file), join(output, file));
}

console.log(`Built ${files.length} static assets in dist/`);
