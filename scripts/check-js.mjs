import { readFileSync } from 'node:fs';

const files = [
  'assets/js/site.js',
  'assets/js/neural-network.js'
];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  new Function(source);
  console.log(`syntax ok: ${file}`);
}
