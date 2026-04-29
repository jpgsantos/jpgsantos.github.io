import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const files = [
  'assets/js/site.js',
  'assets/js/neural-network.js'
];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  new Function(source);
  console.log(`syntax ok: ${file}`);
}

for (const file of ['scripts/audit-site.mjs']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
  console.log(`syntax ok: ${file}`);
}

for (const file of ['assets/css/main.scss', 'assets/css/mondrian.scss']) {
  const source = readFileSync(file, 'utf8');
  if (/@use\s+["']/.test(source)) {
    console.error(`GitHub Pages Sass does not compile @use in ${file}; use @import for asset entrypoints.`);
    process.exit(1);
  }
  console.log(`sass entrypoint ok: ${file}`);
}
