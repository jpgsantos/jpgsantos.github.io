import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files = [
  '_includes/style-rotation.js',
  'assets/js/site.js',
  'assets/js/neural-network.js'
];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  new Function(source);
  console.log(`syntax ok: ${file}`);
}

const scripts = readdirSync('scripts')
  .filter((file) => file.endsWith('.mjs'))
  .map((file) => `scripts/${file}`);

for (const file of scripts) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  console.log(`syntax ok: ${file}`);
}

const sassEntries = readdirSync('assets/css')
  .filter((file) => file.endsWith('.scss'))
  .sort()
  .map((file) => `assets/css/${file}`);

for (const file of sassEntries) {
  const source = readFileSync(file, 'utf8');
  if (/@use\s+["']/.test(source)) {
    console.error(`GitHub Pages Sass does not compile @use in ${file}; use @import for asset entrypoints.`);
    process.exit(1);
  }
  console.log(`sass entrypoint ok: ${file}`);
}
