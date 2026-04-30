import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const allowedTypeTokens = new Set([
  'var(--t-xs)',
  'var(--t-sm)',
  'var(--t-md)',
  'var(--t-lg)',
  'var(--t-xl)',
  '0'
]);

const allowedFontFamilies = new Set([
  'var(--font-sans)',
  'var(--font-display)',
  'var(--font-mono)'
]);

const errors = [];

const ignoredDirs = new Set(['.git', 'node_modules', '_site', '_site_preview', '.jekyll-cache']);

function walk(dir, predicate, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(fullPath, predicate, files);
    } else if (entry.isFile() && predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function assertTypeScale() {
  const sassFiles = walk('_sass', (file) => file.endsWith('.scss'));
  for (const file of sassFiles) {
    const source = readFileSync(file, 'utf8');
    const lines = source.split(/\r?\n/);
    lines.forEach((line, index) => {
      const fontSize = line.match(/font-size:\s*([^;]+);/);
      if (fontSize && !allowedTypeTokens.has(fontSize[1].trim())) {
        errors.push(`${file}:${index + 1} uses non-token font-size ${fontSize[1].trim()}`);
      }

      const fontFamily = line.match(/font-family:\s*([^;]+);/);
      if (fontFamily && !allowedFontFamilies.has(fontFamily[1].trim())) {
        errors.push(`${file}:${index + 1} uses non-token font-family ${fontFamily[1].trim()}`);
      }
    });
  }
}

function assertFontLoading() {
  const layout = readFileSync('_layouts/default.html', 'utf8');
  const fontUrlMatch = layout.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"'{}]+/);
  if (!fontUrlMatch) {
    errors.push('_layouts/default.html is missing the Google Fonts stylesheet URL');
    return;
  }

  const url = fontUrlMatch[0].replace(/&amp;/g, '&');
  const families = Array.from(url.matchAll(/[?&]family=([^&]+)/g)).map((match) => match[1].split(':')[0]);
  const uniqueFamilies = new Set(families);
  if (uniqueFamilies.size > 2) {
    errors.push(`Google Fonts loads ${uniqueFamilies.size} families; expected at most 2`);
  }
  for (const family of uniqueFamilies) {
    if (!['Inter', 'Playfair+Display'].includes(family)) {
      errors.push(`Google Fonts loads unsupported family ${family}`);
    }
  }

  const repoFiles = walk('.', (file) => /\.(scss|html|md|yml|js|svg)$/.test(file));
  for (const file of repoFiles) {
    const source = readFileSync(file, 'utf8');
    if (source.includes('JetBrains')) {
      errors.push(`${file} references JetBrains Mono; typography contract allows Inter and Playfair Display only`);
    }
  }
}

assertTypeScale();
assertFontLoading();

if (errors.length > 0) {
  console.error('Typography validation failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('typography ok: 2 font families, 5 Sass type tokens');
