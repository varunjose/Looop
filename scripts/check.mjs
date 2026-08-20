import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = await readFile(join(root, 'index.html'), 'utf8');
const css = await readFile(join(root, 'styles.css'), 'utf8');
const script = await readFile(join(root, 'app.js'), 'utf8');

const failures = [];
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

if (duplicateIds.length) failures.push(`Duplicate ids: ${[...new Set(duplicateIds)].join(', ')}`);
if (!html.includes('<main id="main">')) failures.push('Missing main landmark');
if (!html.includes('class="skip-link"')) failures.push('Missing skip link');
if (!html.includes('name="viewport"')) failures.push('Missing viewport metadata');
if (/href="#"/.test(html)) failures.push('Placeholder href found');
if (!css.includes('@media (prefers-reduced-motion: reduce)')) failures.push('Missing reduced-motion treatment');
if (!css.includes('@media (max-width: 760px)')) failures.push('Missing mobile breakpoint');
if (!script.includes('IntersectionObserver')) failures.push('Missing progressive reveal handling');
if (!html.includes('data-loop-demo')) failures.push('Missing verification loop demo');
if (!html.includes('data-replay')) failures.push('Missing demo replay control');
if (!html.includes('data-copy="npm run demo"')) failures.push('Missing copyable demo command');
if (!html.includes('./assets/looop-logo.svg')) failures.push('Missing supplied Looop logo');
if (!html.includes('./assets/looop-landscape.webp')) failures.push('Missing original blue landscape');
if (/<script[^>]+src="https?:|<link[^>]+href="https?:/i.test(html)) failures.push('External runtime asset found');

const requiredSections = [
  ['what', 'WHAT LOOOP DOES'],
  ['for', 'WHO IT IS FOR'],
  ['value', 'THE VALUE IT PROVIDES'],
  ['difference', 'WHY IT IS DIFFERENT'],
  ['next', 'WHAT TO DO NEXT'],
];

requiredSections.forEach(([id, label]) => {
  if (!html.includes(`id="${id}"`)) failures.push(`Missing #${id} section`);
  if (!html.includes(label)) failures.push(`Missing ${label} content`);
});

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`✓ Static checks passed (${ids.length} unique ids)`);
