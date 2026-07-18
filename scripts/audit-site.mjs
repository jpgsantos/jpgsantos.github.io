import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';

const baseUrl = getArg('--base-url') || process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4022';
const outputDir = resolve('_site_preview/audit-site');
const pageFilter = getArg('--path');
const styleFilter = getArg('--style');
const themeFilter = getArg('--theme');
const widthFilter = Number(getArg('--width'));
const designRegistry = readDesignRegistry();
const requiredDesignIncludeKeys = ['home', 'projects', 'cv', 'case'];
const requiredDesignFields = ['value', 'name', 'icon', 'stylesheet'];
const requiredCaseVisualTypes = readCaseVisualTypes();
const captureSnapshots = process.argv.includes('--snapshots');
const emulateReducedMotion = process.argv.includes('--reduced-motion');
const snapshotDir = join(outputDir, 'snapshots');
const pages = pageFilter ? [pageFilter] : readAuditedPages();
const widths = Number.isFinite(widthFilter) && widthFilter > 0 ? [widthFilter] : [390, 540, 768, 920, 1024, 1366];
const styles = styleFilter ? [styleFilter] : designRegistry.map((design) => design.value);
const themes = themeFilter ? [themeFilter] : ['light', 'dark'];
const height = 900;

function getArg(name) {
  const match = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function readAuditedPages() {
  const source = readFileSync('_data/work.yml', 'utf8');
  const projectPages = Array.from(source.matchAll(/^\s+url:\s+"(\/projects\/[^"]+\/)"/gm))
    .map((match) => match[1]);
  return Array.from(new Set(['/', '/projects/', '/cv/', ...projectPages]));
}

function readDesignRegistry() {
  const source = readFileSync('_data/designs.yml', 'utf8');
  const entries = source
    .split(/\n(?=-\s+value:)/)
    .map((block) => {
      const read = (key) => {
        const match = block.match(new RegExp(`\\b${key}:\\s*"?([^"\\n]+)"?`));
        return match ? match[1].trim() : undefined;
      };
      const value = read('value');
      if (!value) return null;
      const includes = readNestedMap(block, 'includes');
      const caseVisuals = readNestedMap(block, 'case_visuals');
      return {
        value,
        name: read('name'),
        description: read('description'),
        icon: read('icon'),
        stylesheet: read('stylesheet'),
        cssBudgetKb: Number(read('css_budget_kb')) || null,
        includes,
        caseVisuals
      };
    })
    .filter(Boolean);

  return entries.length > 0 ? entries : [{ value: 'default' }, { value: 'mondrian' }];
}

function readNestedMap(block, mapName) {
  const values = {};
  let inMap = false;
  for (const line of block.split('\n')) {
    if (new RegExp(`^\\s+${mapName}:\\s*$`).test(line)) {
      inMap = true;
      continue;
    }
    if (!inMap) continue;
    const mapMatch = line.match(/^\s{4}([A-Za-z0-9_-]+):\s*"?([^"\n]+)"?\s*$/);
    if (mapMatch) {
      values[mapMatch[1]] = mapMatch[2].trim();
      continue;
    }
    if (/^\s{2}\S/.test(line)) inMap = false;
  }
  return values;
}

function readCaseVisualTypes() {
  const source = readFileSync('_data/work.yml', 'utf8');
  return Array.from(new Set(
    Array.from(source.matchAll(/^\s+type:\s+"?([A-Za-z0-9_-]+)"?\s*$/gm))
      .map((match) => match[1])
  )).sort();
}

function assertDesignRegistry(registry) {
  const failures = [];
  const seenValues = new Set();
  for (const design of registry) {
    for (const field of requiredDesignFields) {
      if (!design[field]) failures.push(`${design.value || '(missing value)'} design is missing ${field}`);
    }
    if (design.value && !/^[a-z][a-z0-9-]*$/.test(design.value)) {
      failures.push(`${design.value} design value should be lowercase kebab-case`);
    }
    if (design.value && seenValues.has(design.value)) {
      failures.push(`${design.value} design value is duplicated`);
    }
    seenValues.add(design.value);
    if (!design.cssBudgetKb) {
      failures.push(`${design.value} design is missing css_budget_kb`);
    }
    if (!design.includes || Object.keys(design.includes).length === 0) {
      failures.push(`${design.value} design is missing an includes map`);
    }
    if (design.stylesheet) {
      const sourcePath = resolve(design.stylesheet.replace(/^\/+/, '').replace(/\.css$/, '.scss'));
      if (!existsSync(sourcePath)) failures.push(`${design.value} stylesheet source missing at ${sourcePath}`);
    }
  }
  return failures;
}

function assertDesignIncludes(registry) {
  return registry.flatMap((design) => {
    const failures = [];
    for (const key of requiredDesignIncludeKeys) {
      const includePath = design.includes?.[key];
      if (!includePath) {
        failures.push(`${design.value} design is missing includes.${key}`);
        continue;
      }
      const resolved = resolve('_includes', includePath);
      if (!existsSync(resolved)) {
        failures.push(`${design.value} includes.${key} points to missing file ${resolved}`);
      }
    }
    return failures;
  });
}

function assertCaseVisualIncludes(registry) {
  return registry.flatMap((design) => {
    const failures = [];
    if (!design.caseVisuals || Object.keys(design.caseVisuals).length === 0) {
      failures.push(`${design.value} design is missing a case_visuals map`);
      return failures;
    }
    for (const type of requiredCaseVisualTypes) {
      const includePath = design.caseVisuals[type];
      if (!includePath) {
        failures.push(`${design.value} design is missing case_visuals.${type}`);
        continue;
      }
      const resolved = resolve('_includes', includePath);
      if (!existsSync(resolved)) {
        failures.push(`${design.value} case_visuals.${type} points to missing file ${resolved}`);
      }
    }
    return failures;
  });
}

function assertCssBudgets(registry) {
  return registry.flatMap((design) => {
    if (!design.stylesheet || !design.cssBudgetKb) return [];
    const builtPath = resolve('_site', design.stylesheet.replace(/^\/+/, ''));
    if (!existsSync(builtPath)) return [`${design.value} CSS output missing at ${builtPath}`];
    const sizeKb = statSync(builtPath).size / 1024;
    if (sizeKb > design.cssBudgetKb) {
      return [`${design.value} CSS is ${sizeKb.toFixed(1)}KB, above ${design.cssBudgetKb}KB budget`];
    }
    return [];
  });
}

function normalizeUrl(path) {
  return new URL(path, baseUrl).href;
}

function normalizeCaseUrl(testCase) {
  const url = new URL(testCase.path, baseUrl);
  url.searchParams.set('audit', `${testCase.style}-${testCase.theme}-${testCase.width}`);
  return url.href;
}

function snapshotName(testCase) {
  const pathName = testCase.path
    .replace(/^\/$/, 'home')
    .replace(/^\/|\/$/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '') || 'home';
  return `${pathName}-${testCase.style}-${testCase.theme}-${testCase.width}.png`;
}

function shouldCaptureSnapshot(testCase) {
  if (!captureSnapshots) return false;
  if (themeFilter && widthFilter) return true;
  return !testCase.path.includes('#') &&
    testCase.theme === 'light' &&
    [390, 1024, 1366].includes(testCase.width);
}

async function writeSnapshot(page, testCase) {
  mkdirSync(snapshotDir, { recursive: true });
  const result = await page.send('Page.captureScreenshot', {
    captureBeyondViewport: false,
    format: 'png'
  });
  writeFileSync(join(snapshotDir, snapshotName(testCase)), Buffer.from(result.data, 'base64'));
}

function findBrowser() {
  const envPath = process.env.CHROME_PATH || process.env.EDGE_PATH;
  const candidates = [
    envPath,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'google-chrome',
    'chromium',
    'chromium-browser',
    'msedge'
  ].filter(Boolean);

  return candidates.find((candidate) => !candidate.includes('/') && !candidate.includes('\\') || existsSync(candidate));
}

function freePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolvePort(address.port));
    });
  });
}

async function waitForVersion(port) {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) return response.json();
    } catch (error) {}
    await delay(120);
  }
  throw new Error('Timed out waiting for headless browser DevTools endpoint.');
}

async function newTarget(port) {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`, {
    method: 'PUT'
  });
  if (!response.ok) {
    throw new Error(`Could not create browser target: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function closeTarget(port, id) {
  try {
    await fetch(`http://127.0.0.1:${port}/json/close/${id}`);
  } catch (error) {}
}

async function navigateAndWait(page, url) {
  await page.send('Page.navigate', { url });
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const currentUrl = await page.evaluate('location.href');
      const state = await page.evaluate('document.readyState');
      const hasBody = await page.evaluate('Boolean(document.body)');
      if (currentUrl === url && (state === 'interactive' || state === 'complete') && hasBody) {
        await delay(120);
        return;
      }
    } catch (error) {}
    await delay(80);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function waitForDesignStylesheet(page, style) {
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const ready = await page.evaluate(`(() => {
        const link = document.querySelector('[data-design-stylesheet="${style}"]');
        if (!link || link.disabled || !link.href || !link.sheet) return false;
        try { return link.sheet.cssRules.length > 0; } catch (error) { return false; }
      })()`);
      if (ready) return;
    } catch (error) {}
    await delay(80);
  }
  throw new Error(`Timed out waiting for ${style} design stylesheet.`);
}

async function waitForDesignRuntime(page, style) {
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const ready = await page.evaluate(`(() => {
        if (document.documentElement.getAttribute('data-style') !== '${style}') return false;
        const supports = (root) => (root.dataset.designRoot || '').split(/\\s+/).includes('${style}');
        const roots = Array.from(document.querySelectorAll('[data-design-root]'));
        const activeRoots = roots.filter(supports);
        const inactiveReady = roots
          .filter((root) => !supports(root))
          .every((root) => getComputedStyle(root).display === 'none' || root.getAttribute('aria-hidden') === 'true');
        const carousel = activeRoots.flatMap((root) => Array.from(root.querySelectorAll('[data-carousel]')))[0];
        const carouselReady = !carousel || (
          carousel.querySelector('.app-carousel__viewport')?.dataset.carouselIndex === '1' &&
          carousel.querySelector('[data-carousel-prev]')?.disabled === true
        );
        return activeRoots.length === 1 && inactiveReady && carouselReady;
      })()`);
      if (ready) return;
    } catch (error) {}
    await delay(80);
  }
  throw new Error(`Timed out waiting for ${style} design runtime.`);
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

async function waitForExit(process, timeout = 2500) {
  if (process.exitCode !== null || process.killed) return;
  await Promise.race([
    new Promise((resolveExit) => process.once('exit', resolveExit)),
    delay(timeout)
  ]);
}

async function removeDirWithRetry(path) {
  let lastError;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      rmSync(path, { recursive: true, force: true });
      return;
    } catch (error) {
      lastError = error;
      await delay(180);
    }
  }
  console.warn(`Warning: could not remove temporary browser profile ${path}: ${lastError?.message || lastError}`);
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.errors = [];
  }

  async open() {
    await new Promise((resolveOpen, reject) => {
      this.ws.addEventListener('open', resolveOpen, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolveMessage, rejectMessage } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) rejectMessage(new Error(message.error.message));
        else resolveMessage(message.result || {});
        return;
      }

      if (message.method === 'Runtime.exceptionThrown') {
        const details = message.params.exceptionDetails;
        const exception = details?.exception;
        this.errors.push(
          exception?.description ||
            exception?.value ||
            details?.text ||
            'Runtime exception'
        );
      }
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
        this.errors.push(message.params.args?.map((arg) => arg.value || arg.description || '').join(' ') || 'Console error');
      }
      if (message.method === 'Log.entryAdded' && message.params.entry?.level === 'error') {
        this.errors.push(message.params.entry.text || 'Log error');
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolveMessage, rejectMessage) => {
      this.pending.set(id, { resolveMessage, rejectMessage });
      this.ws.send(payload);
    });
  }

  evaluate(expression) {
    return this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    }).then((result) => {
      if (result.exceptionDetails) {
        const details = result.exceptionDetails;
        const exception = details.exception;
        throw new Error(
          exception?.description ||
            exception?.value ||
            details.text ||
            'Runtime evaluation failed'
        );
      }
      return result.result?.value;
    });
  }

  close() {
    this.ws.close();
  }
}

function auditExpression(expectedStyle, path) {
  return `(() => {
      const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
      const html = document.documentElement;
      const docWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
      const roots = Array.from(document.querySelectorAll('[data-design-root]'));
      const supports = (root, style) => (root.dataset.designRoot || '').split(/\\s+/).includes(style);
      const activeRoots = roots.filter((item) => supports(item, '${expectedStyle}'));
      const inactiveLeaks = roots.filter((item) => !supports(item, '${expectedStyle}') && getComputedStyle(item).display !== 'none' && item.getAttribute('aria-hidden') !== 'true');
      const inactiveEagerImages = roots
        .filter((item) => !supports(item, '${expectedStyle}'))
        .flatMap((item) => Array.from(item.querySelectorAll('img[loading="eager"], img[fetchpriority="high"]')))
        .length;
      const activeScoped = (selector) => activeRoots.flatMap((item) => Array.from(item.querySelectorAll(selector)));
      const alignmentFailures = [];
      const clippedTextFailures = [];
      const viewportContainmentFailures = [];
      const overlapFailures = [];
      const emptySpaceFailures = [];
      const geometry = (node) => {
        if (!node || node.offsetParent === null) return null;
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
      };
      const describeNode = (node) => {
        if (!node) return 'missing node';
        const name = node.tagName?.toLowerCase() || 'node';
        const identity = node.id ? '#' + node.id : '';
        const classes = Array.from(node.classList || []).slice(0, 2).map((item) => '.' + item).join('');
        return name + identity + classes;
      };
      const compareOuterEdges = (label, nodes, tolerance = 2) => {
        const visible = nodes.map((node) => ({ node, rect: geometry(node) })).filter((item) => item.rect && item.rect.width > 1);
        const reference = visible[0];
        if (!reference) return;
        for (const item of visible.slice(1)) {
          const leftDelta = Math.abs(item.rect.left - reference.rect.left);
          const rightDelta = Math.abs(item.rect.right - reference.rect.right);
          if (leftDelta > tolerance || rightDelta > tolerance) {
            alignmentFailures.push(label + ': ' + describeNode(item.node) + ' differs by ' + leftDelta.toFixed(1) + 'px left / ' + rightDelta.toFixed(1) + 'px right');
          }
        }
      };
      const activeRoot = activeRoots[0];
      if (activeRoot && '${expectedStyle}' !== 'mondrian') {
        compareOuterEdges('${expectedStyle} page landmarks', Array.from(activeRoot.children));
      }
      if (activeRoot && '${expectedStyle}' === 'editorial' && location.pathname === '/cv/') {
        const compareRail = (sectionSelector, rowSelector) => {
          const section = activeRoot.querySelector(sectionSelector);
          const reference = geometry(section?.querySelector('.ed-section__number'));
          if (!reference) return;
          for (const row of Array.from(section.querySelectorAll(rowSelector))) {
            const rect = geometry(row);
            if (rect && Math.abs(rect.right - reference.right) > 1.25) {
              alignmentFailures.push(sectionSelector + ' rail: ' + describeNode(row) + ' differs by ' + Math.abs(rect.right - reference.right).toFixed(1) + 'px');
            }
          }
        };
        compareRail('.ed-cv-experience', '.ed-timeline__date');
        compareRail('.ed-cv-education', '.ed-timeline__date');
        compareRail('.ed-cv-publications', '.publication-card__year');
        const publicationCards = Array.from(activeRoot.querySelectorAll('.ed-cv-publications .publication-card'))
          .map((node) => ({ node, rect: geometry(node) }))
          .filter((item) => item.rect);
        for (let index = 1; index < publicationCards.length; index += 1) {
          const gap = publicationCards[index].rect.top - publicationCards[index - 1].rect.bottom;
          if (Math.abs(gap) > 1.25) {
            alignmentFailures.push('.ed-cv-publications row gap: ' + gap.toFixed(1) + 'px');
          }
        }
      }
      if (activeRoot && '${expectedStyle}' === 'default' && innerWidth <= 980) {
        for (const feature of Array.from(activeRoot.querySelectorAll('.project-feature--research'))) {
          compareOuterEdges('default stacked research feature', [
            feature.querySelector('.project-feature__content'),
            feature.querySelector('.project-feature__media')
          ].filter(Boolean));
        }
      }
      if (activeRoot && '${expectedStyle}' === 'default' && innerWidth <= 980) {
        for (const layout of Array.from(activeRoot.querySelectorAll('.case-study__hero, .case-study__visual--workflow, .case-study__visual--porphyrin'))) {
          compareOuterEdges('default stacked case layout', Array.from(layout.children));
        }
      }
      if (activeRoot && '${expectedStyle}' === 'editorial' && innerWidth <= 760) {
        for (const head of Array.from(activeRoot.querySelectorAll('.ed-project__head'))) {
          compareOuterEdges('editorial stacked project head', Array.from(head.children));
        }
      }
      if (activeRoot && '${expectedStyle}' === 'editorial' && innerWidth <= 900) {
        for (const layout of Array.from(activeRoot.querySelectorAll('.case-study__visual--workflow, .case-study__visual--porphyrin'))) {
          compareOuterEdges('editorial stacked case visual', Array.from(layout.children));
        }
      }
      if (activeRoot && '${expectedStyle}' === 'azulejo') {
        for (const mark of Array.from(activeRoot.querySelectorAll('.az-page-hero__mark, .az-case-hero__mark'))) {
          const rosette = geometry(mark.querySelector('.az-rosette'));
          const caption = geometry(mark.querySelector(':scope > span:last-child'));
          const markRect = geometry(mark);
          if (!rosette || !caption || !markRect) continue;
          const markCenter = markRect.left + (markRect.width / 2);
          const rosetteCenter = rosette.left + (rosette.width / 2);
          const captionCenter = caption.left + (caption.width / 2);
          if (Math.abs(rosetteCenter - markCenter) > 2 || Math.abs(captionCenter - markCenter) > 2) {
            alignmentFailures.push('azulejo mark ornament and caption are not horizontally centered');
          }
          const markGap = caption.top - rosette.bottom;
          if (markGap < 6) alignmentFailures.push('azulejo mark ornament and caption gap is ' + markGap.toFixed(1) + 'px');
        }
        for (const media of Array.from(activeRoot.querySelectorAll('.az-project__media'))) {
          const mediaRect = geometry(media);
          const children = Array.from(media.children).map(geometry).filter(Boolean);
          if (!mediaRect || children.length === 0) continue;
          const contentBottom = Math.max(...children.map((rect) => rect.bottom));
          const unusedTail = mediaRect.bottom - contentBottom - (Number.parseFloat(getComputedStyle(media).paddingBottom) || 0);
          if (unusedTail > 48) alignmentFailures.push('azulejo project media leaves ' + unusedTail.toFixed(1) + 'px of unused vertical space');
        }
        for (const container of Array.from(activeRoot.querySelectorAll('.az-timeline, .az-work-grid, .az-focus-grid, .az-contact-grid, .az-cv-projects, .az-cv-skills .skills-grid, .az-project-index, .publications-list'))) {
          const containerRect = geometry(container);
          if (!containerRect || containerRect.height < 260) continue;
          const children = Array.from(container.children)
            .map((node) => ({ node, rect: geometry(node), style: getComputedStyle(node) }))
            .filter((item) => item.rect && item.rect.width > 1 && item.rect.height > 1 && item.rect.width < containerRect.width * 0.82 && !['absolute', 'fixed'].includes(item.style.position));
          const columns = [];
          for (const item of children) {
            let column = columns.find((candidate) => Math.abs(candidate.left - item.rect.left) < 4);
            if (!column) {
              column = { left: item.rect.left, bottom: item.rect.bottom };
              columns.push(column);
            }
            column.bottom = Math.max(column.bottom, item.rect.bottom);
          }
          if (columns.length < 2 || columns.length > 4) continue;
          const tails = columns.map((column) => column.bottom);
          const imbalance = Math.max(...tails) - Math.min(...tails);
          if (imbalance > Math.max(150, containerRect.height * 0.2)) {
            emptySpaceFailures.push(describeNode(container) + ' leaves a ' + imbalance.toFixed(1) + 'px unbalanced column tail');
          }
        }
      }
      if (activeRoot && '${expectedStyle}' === 'mondrian') {
        const rootRect = geometry(activeRoot);
        const rootStyle = getComputedStyle(activeRoot);
        const columns = rootStyle.gridTemplateColumns.split(/\\s+/).map(Number.parseFloat).filter(Number.isFinite);
        const gap = Number.parseFloat(rootStyle.columnGap) || 0;
        if (rootRect && columns.length > 0) {
          const contentLeft = rootRect.left + (Number.parseFloat(rootStyle.borderLeftWidth) || 0) + (Number.parseFloat(rootStyle.paddingLeft) || 0);
          const boundaries = [contentLeft];
          let cursor = contentLeft;
          columns.forEach((width, index) => {
            cursor += width;
            boundaries.push(cursor);
            if (index < columns.length - 1) {
              cursor += gap;
              boundaries.push(cursor);
            }
          });
          const distanceToGrid = (value) => Math.min(...boundaries.map((boundary) => Math.abs(boundary - value)));
          for (const child of Array.from(activeRoot.children)) {
            const rect = geometry(child);
            if (!rect || rect.width <= 1 || getComputedStyle(child).position === 'absolute') continue;
            const leftDelta = distanceToGrid(rect.left);
            const rightDelta = distanceToGrid(rect.right);
            if (leftDelta > 1.5 || rightDelta > 1.5) {
              alignmentFailures.push('mondrian grid: ' + describeNode(child) + ' differs by ' + leftDelta.toFixed(1) + 'px left / ' + rightDelta.toFixed(1) + 'px right');
            }
          }
        }
      }
      if (activeRoot) {
        const siteHeader = geometry(document.querySelector('.site-header'));
        const directChildren = Array.from(activeRoot.children)
          .map((node) => {
            const rect = geometry(node);
            const flowBottom = rect ? Array.from(node.querySelectorAll('*')).reduce((bottom, descendant) => {
              if (descendant.ownerSVGElement) return bottom;
              const descendantStyle = getComputedStyle(descendant);
              let ancestor = descendant;
              let transformed = false;
              while (ancestor && ancestor !== node) {
                if (getComputedStyle(ancestor).transform !== 'none') {
                  transformed = true;
                  break;
                }
                ancestor = ancestor.parentElement;
              }
              if (descendantStyle.display === 'none' || descendantStyle.visibility === 'hidden' || transformed || ['absolute', 'fixed'].includes(descendantStyle.position)) return bottom;
              const descendantRect = geometry(descendant);
              return descendantRect ? Math.max(bottom, descendantRect.bottom) : bottom;
            }, rect.bottom) : 0;
            return { node, rect, flowBottom, style: getComputedStyle(node) };
          })
          .filter((item) => item.rect && item.rect.width > 1 && item.rect.height > 1 && item.style.visibility !== 'hidden');
        if (!location.hash && scrollY < 2 && siteHeader && directChildren.length > 0) {
          const firstContentTop = Math.min(...directChildren.map((item) => item.rect.top));
          if (firstContentTop < siteHeader.bottom - 2) {
            alignmentFailures.push('page content begins ' + (siteHeader.bottom - firstContentTop).toFixed(1) + 'px beneath the site header');
          }
        }
        for (let leftIndex = 0; leftIndex < directChildren.length; leftIndex += 1) {
          for (let rightIndex = leftIndex + 1; rightIndex < directChildren.length; rightIndex += 1) {
            const left = directChildren[leftIndex];
            const right = directChildren[rightIndex];
            if (['absolute', 'fixed'].includes(left.style.position) || ['absolute', 'fixed'].includes(right.style.position)) continue;
            const intersectionWidth = Math.min(left.rect.right, right.rect.right) - Math.max(left.rect.left, right.rect.left);
            const intersectionHeight = Math.min(left.flowBottom, right.flowBottom) - Math.max(left.rect.top, right.rect.top);
            if (intersectionWidth > 2 && intersectionHeight > 2) {
              const overflowDetail = left.flowBottom > left.rect.bottom + 2 ? ' (including overflowing flow content)' : '';
              overlapFailures.push(describeNode(left.node) + ' overlaps ' + describeNode(right.node) + ' by ' + intersectionWidth.toFixed(1) + 'x' + intersectionHeight.toFixed(1) + 'px' + overflowDetail);
            }
          }
        }
      }
      for (const node of activeScoped('h1, h2, h3, h4, button, .button, .mond-button, .ed-button')) {
        const rect = geometry(node);
        if (!rect || rect.width <= 1 || rect.height <= 1) continue;
        const insideHorizontalScroller = (() => {
          let ancestor = node.parentElement;
          while (ancestor && ancestor !== activeRoot) {
            const style = getComputedStyle(ancestor);
            if (['auto', 'scroll'].includes(style.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 2) return true;
            ancestor = ancestor.parentElement;
          }
          return false;
        })();
        if (node.scrollWidth - node.clientWidth > 2) {
          clippedTextFailures.push(describeNode(node) + ' exceeds its box by ' + (node.scrollWidth - node.clientWidth).toFixed(1) + 'px');
        }
        if (!insideHorizontalScroller && (rect.left < -2 || rect.right > innerWidth + 2)) {
          viewportContainmentFailures.push(describeNode(node) + ' extends outside the viewport (' + rect.left.toFixed(1) + 'px to ' + rect.right.toFixed(1) + 'px)');
        }
      }
      for (const trigger of Array.from(document.querySelectorAll('[data-style-trigger], [data-theme-trigger]'))) {
        const triggerRect = geometry(trigger);
        const labelRect = geometry(trigger.querySelector('.style-menu__label, .theme-menu__label'));
        const arrowStyle = getComputedStyle(trigger, '::after');
        if (!triggerRect || !labelRect || arrowStyle.position !== 'absolute') continue;
        const arrowRight = Number.parseFloat(arrowStyle.right) || 0;
        const arrowWidth = Number.parseFloat(arrowStyle.width) || 0;
        const arrowLeftEdge = triggerRect.right - arrowRight - arrowWidth;
        if (labelRect.right > arrowLeftEdge - 4) {
          clippedTextFailures.push(describeNode(trigger) + ' label overlaps its menu arrow by ' + (labelRect.right - arrowLeftEdge).toFixed(1) + 'px');
        }
      }
      const defaultRoot = document.querySelector('[data-design-root="default"]');
      const mondrianRoot = document.querySelector('[data-design-root="mondrian"]');
      const defaultH1 = normalize(defaultRoot?.querySelector('h1')?.textContent);
      const mondrianH1 = normalize(mondrianRoot?.querySelector('h1')?.textContent);
      const defaultHeroButtons = Array.from(defaultRoot?.querySelectorAll('.hero__actions a') || []).map((item) => normalize(item.textContent));
      const mondrianHeroButtons = Array.from(mondrianRoot?.querySelectorAll('.mond-tile--actions a') || []).map((item) => normalize(item.textContent));
      const textList = (root, selector) => Array.from(root?.querySelectorAll(selector) || [])
        .map((item) => normalize(item.textContent))
        .filter(Boolean);
      const uniqueList = (items) => Array.from(new Set(items));
      const hrefList = (root) => uniqueList(Array.from(root?.querySelectorAll('a[href]') || [])
        .map((item) => item.getAttribute('href'))
        .filter((href) => href && (/^(mailto:|tel:)/.test(href) || href.includes('github.com') || href.includes('linkedin.com')))
        .sort());
      const sameList = (left, right) => left.length === 0 || right.length === 0 || left.join('|') === right.join('|');
      const contentSnapshot = (root) => {
        const singletons = {};
        const lists = {};
        Array.from(root?.querySelectorAll('[data-content-key]:not([data-content-list])') || []).forEach((node) => {
          const key = node.dataset.contentKey;
          if (!key) return;
          singletons[key] = normalize(node.dataset.contentValue || node.getAttribute('href') || node.textContent);
        });
        Array.from(root?.querySelectorAll('[data-content-list]') || []).forEach((node) => {
          const list = node.dataset.contentList;
          if (!list) return;
          const key = node.dataset.contentKey || node.getAttribute('href') || normalize(node.textContent);
          const value = normalize(node.dataset.contentValue || node.getAttribute('href') || node.textContent);
          if (!lists[list]) lists[list] = [];
          lists[list].push(key + '=' + value);
        });
        Object.keys(lists).forEach((name) => { lists[name] = uniqueList(lists[name]).sort(); });
        return { singletons, lists };
      };
      const contentByDesign = Object.fromEntries(
        roots
          .map((root) => [(root.dataset.designRoot || '').split(/\\s+/)[0], contentSnapshot(root)])
          .filter(([designValue]) => Boolean(designValue))
      );
      const contentDesigns = Object.keys(contentByDesign).sort();
      const canonicalDesign = contentByDesign.default ? 'default' : contentDesigns[0];
      const contentParityFailures = [];
      const unionKeys = (left, right) => Array.from(new Set([...(Object.keys(left || {})), ...(Object.keys(right || {}))])).sort();
      const serializeValue = (value) => Array.isArray(value) ? value.join('|') : (value || '');
      if (canonicalDesign) {
        const canonicalContent = contentByDesign[canonicalDesign];
        for (const designValue of contentDesigns) {
          if (designValue === canonicalDesign) continue;
          const designContent = contentByDesign[designValue];
          for (const key of unionKeys(canonicalContent.singletons, designContent.singletons)) {
            if (serializeValue(canonicalContent.singletons[key]) !== serializeValue(designContent.singletons[key])) {
              contentParityFailures.push(designValue + ' singleton mismatch: ' + key);
            }
          }
          for (const list of unionKeys(canonicalContent.lists, designContent.lists)) {
            if (serializeValue(canonicalContent.lists[list]) !== serializeValue(designContent.lists[list])) {
              contentParityFailures.push(designValue + ' list mismatch: ' + list);
            }
          }
        }
      }
      const defaultProjectTitles = textList(defaultRoot, '.project-feature h2');
      const mondrianProjectTitles = textList(mondrianRoot, '.proj-tile--head h2');
      const defaultCvExperience = uniqueList(textList(defaultRoot, '[data-cv-entry^="experience:"] h3'));
      const mondrianCvExperience = uniqueList(textList(mondrianRoot, 'header[data-cv-entry^="experience:"] h3'));
      const defaultCvEducation = uniqueList(textList(defaultRoot, '[data-cv-entry^="education:"] h3'));
      const mondrianCvEducation = uniqueList(textList(mondrianRoot, 'header[data-cv-entry^="education:"] h3'));
      const defaultCvPublications = textList(defaultRoot, '.publication-card h3');
      const mondrianCvPublications = textList(mondrianRoot, '.cv-pub-card h3');
      const defaultContactLinks = hrefList(defaultRoot);
      const mondrianContactLinks = hrefList(mondrianRoot);
      const carousel = activeScoped('[data-carousel]')[0];
      const visibleImages = activeScoped('img').filter((img) => img.offsetParent !== null);
      const imagesMissingDimensions = visibleImages.filter((img) => !img.getAttribute('width') || !img.getAttribute('height')).length;
      const responsiveImagesMissingSizes = activeScoped('img[srcset], source[srcset]').filter((media) => !media.getAttribute('sizes')).length;
      const activeThemeMode = html.getAttribute('data-theme') === 'dark' ? 'Dark' : 'Light';
      const themePictureMismatches = activeScoped('[data-theme-picture]')
        .map((picture) => {
          const image = picture.querySelector('img');
          const source = picture.querySelector('source[type="image/webp"]');
          const expectedSrc = picture.dataset['theme' + activeThemeMode + 'Src'];
          const expectedFallbackSrcset = picture.dataset['theme' + activeThemeMode + 'FallbackSrcset'];
          const expectedWebpSrcset = picture.dataset['theme' + activeThemeMode + 'WebpSrcset'];
          const matches = image &&
            image.getAttribute('src') === expectedSrc &&
            image.getAttribute('srcset') === expectedFallbackSrcset &&
            (!source || source.getAttribute('srcset') === expectedWebpSrcset);
          return matches ? null : { mode: activeThemeMode.toLowerCase(), src: image?.getAttribute('src') || '' };
        })
        .filter(Boolean);
      const parseColor = (value) => {
        const channels = String(value || '').match(/[\\d.]+/g)?.map(Number) || [];
        return channels.length >= 3 ? { r: channels[0], g: channels[1], b: channels[2], a: channels[3] ?? 1 } : null;
      };
      const luminance = (color) => {
        const channel = (value) => {
          const normalized = value / 255;
          return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b);
      };
      const imageOverlayContrastFailures = activeScoped('[data-image-overlay]')
        .filter((node) => node.offsetParent !== null)
        .map((node) => {
          const style = getComputedStyle(node);
          const foreground = parseColor(style.color);
          const background = parseColor(style.backgroundColor);
          if (!foreground || !background) return { text: normalize(node.textContent), reason: 'unresolved color' };
          const lighter = Math.max(luminance(foreground), luminance(background));
          const darker = Math.min(luminance(foreground), luminance(background));
          const ratio = (lighter + 0.05) / (darker + 0.05);
          if (background.a < 0.98) return { text: normalize(node.textContent), reason: 'translucent background', ratio };
          if (ratio < 4.5) return { text: normalize(node.textContent), reason: 'contrast below 4.5:1', ratio };
          return null;
        })
        .filter(Boolean);
      const cvPhoto = activeScoped('.cv-tile--photo')[0];
      const cvPhotoRect = cvPhoto?.getBoundingClientRect();
      const cvPhotoPictureRect = cvPhoto?.querySelector('.profile-picture')?.getBoundingClientRect();
      const cvPhotoImageRect = cvPhoto?.querySelector('img')?.getBoundingClientRect();
      const cvPhotoAspect = cvPhotoPictureRect ? cvPhotoPictureRect.width / Math.max(1, cvPhotoPictureRect.height) : 1;
      const cvPhotoTooLarge = Boolean(
        cvPhotoPictureRect &&
          '${expectedStyle}' === 'mondrian' &&
          location.pathname === '/cv/' &&
          window.innerWidth > 540 &&
          window.innerWidth <= 980 &&
          (cvPhotoPictureRect.width > window.innerWidth * 0.45 || cvPhotoPictureRect.height > 340)
      );
      const cvPhotoBadCrop = Boolean(
        cvPhotoPictureRect &&
          '${expectedStyle}' === 'mondrian' &&
          location.pathname === '/cv/' &&
          window.innerWidth > 540 &&
          window.innerWidth <= 980 &&
          (cvPhotoAspect < 0.9 || cvPhotoAspect > 1.1)
      );
      const cvPhotoImageMismatch = Boolean(
        cvPhotoPictureRect &&
          cvPhotoImageRect &&
          '${expectedStyle}' === 'mondrian' &&
          location.pathname === '/cv/' &&
          window.innerWidth > 540 &&
          window.innerWidth <= 980 &&
          (
            Math.abs(cvPhotoPictureRect.width - cvPhotoImageRect.width) > 2 ||
            Math.abs(cvPhotoPictureRect.height - cvPhotoImageRect.height) > 2
          )
      );
      const target = document.querySelector('[data-contact-anchor="${expectedStyle}"]') || document.querySelector('[data-contact-anchor="default"]');
      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      const readingRail = document.querySelector('[data-reading-progress]');
      const readingRailStyle = readingRail ? getComputedStyle(readingRail) : null;
      const azulejoFieldStyle = '${expectedStyle}' === 'azulejo' ? getComputedStyle(document.body, '::before') : null;
      const azulejoTiles = '${expectedStyle}' === 'azulejo' ? Array.from(document.querySelectorAll('.az-tile')) : [];
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const shouldShowReadingProgress = maxScroll > Math.max(560, window.innerHeight * 0.75);
      const activeProjectIndexLinks = activeScoped('a[data-content-list="project-index"][aria-current="location"]');
      const revealTargets = activeScoped('[data-reveal]').filter((node) => node.offsetParent !== null);
      const revealStyle = revealTargets[0] ? getComputedStyle(revealTargets[0]) : null;
      const carouselViewport = carousel?.querySelector('.app-carousel__viewport');
      const navigationEntry = window.performance.getEntriesByType('navigation')[0];
      const resourceEntries = window.performance.getEntriesByType('resource');
      const firstContentfulPaint = window.performance.getEntriesByName('first-contentful-paint')[0];
      const resourceSize = (type) => resourceEntries
        .filter((entry) => entry.initiatorType === type)
        .reduce((total, entry) => total + (entry.decodedBodySize || 0), 0);
      const visibleElements = Array.from(document.querySelectorAll('*')).filter((node) => node.offsetParent !== null);
      const maskLayerCount = visibleElements.reduce((count, node) => {
        const style = getComputedStyle(node);
        const before = getComputedStyle(node, '::before');
        const after = getComputedStyle(node, '::after');
        const hasMask = (candidate) => (candidate.maskImage || candidate.webkitMaskImage || 'none') !== 'none';
        return count + Number(hasMask(style)) + Number(hasMask(before)) + Number(hasMask(after));
      }, 0);
      return {
        path: '${path}',
        expectedStyle: '${expectedStyle}',
        actualStyle: html.getAttribute('data-style'),
        themeChoice: html.getAttribute('data-theme-choice'),
        activeRootCount: activeRoots.length,
        inactiveLeakCount: inactiveLeaks.length,
        inactiveEagerImages,
        overflow: Math.max(0, docWidth - window.innerWidth),
        motion: {
          reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
          revealCount: revealTargets.length,
          revealPreparedCount: revealTargets.filter((node) => node.classList.contains('reveal') || node.classList.contains('is-visible')).length,
          revealTransitionDuration: revealStyle?.transitionDuration || '',
          revealPromotedCount: revealTargets.filter((node) => getComputedStyle(node).willChange !== 'auto').length
        },
        readingProgress: {
          present: Boolean(readingRail),
          ariaHidden: readingRail?.getAttribute('aria-hidden') === 'true',
          pointerEvents: readingRailStyle?.pointerEvents || '',
          height: readingRailStyle ? Number.parseFloat(readingRailStyle.height) : 0,
          shouldShow: shouldShowReadingProgress,
          active: document.body.classList.contains('has-reading-progress'),
          nativeTimeline: CSS.supports('animation-timeline: scroll()'),
          inlineProgressValue: html.style.getPropertyValue('--reading-progress')
        },
        performance: {
          domContentLoadedMs: Math.round(navigationEntry?.domContentLoadedEventEnd || 0),
          loadMs: Math.round(navigationEntry?.loadEventEnd || 0),
          firstContentfulPaintMs: Math.round(firstContentfulPaint?.startTime || 0),
          resourceCount: resourceEntries.length,
          totalResourceKb: Math.round(resourceEntries.reduce((total, entry) => total + (entry.decodedBodySize || 0), 0) / 1024),
          imageResourceKb: Math.round(resourceSize('img') / 1024),
          stylesheetResourceKb: Math.round(resourceSize('link') / 1024),
          scriptResourceKb: Math.round(resourceSize('script') / 1024),
          visibleElementCount: visibleElements.length,
          maskLayerCount
        },
        azulejoField: azulejoFieldStyle ? {
          maskImage: azulejoFieldStyle.maskImage || azulejoFieldStyle.webkitMaskImage || '',
          maskSize: azulejoFieldStyle.maskSize || azulejoFieldStyle.webkitMaskSize || '',
          opacity: Number.parseFloat(azulejoFieldStyle.opacity),
          tileVariantCount: new Set(azulejoTiles
            .map((tile) => tile.querySelector('use')?.getAttribute('href') || '')
            .filter(Boolean)).size
        } : null,
        activeProjectIndexCount: activeProjectIndexLinks.length,
        activeProjectIndexKeys: uniqueList(activeProjectIndexLinks.map((link) => link.dataset.contentKey)),
        imagesMissingDimensions,
        responsiveImagesMissingSizes,
        themePictureMismatches,
        imageOverlayContrastFailures,
        alignmentFailures,
        clippedTextFailures,
        viewportContainmentFailures,
        overlapFailures,
        emptySpaceFailures,
        cvPhotoTooLarge,
        cvPhotoBadCrop,
        cvPhotoImageMismatch,
        parity: {
          h1Matches: !defaultH1 || !mondrianH1 || defaultH1 === mondrianH1,
          heroButtonsMatch: defaultHeroButtons.length === 0 || mondrianHeroButtons.length === 0 || defaultHeroButtons.join('|') === mondrianHeroButtons.join('|'),
          projectTitlesMatch: sameList(defaultProjectTitles, mondrianProjectTitles),
          cvExperienceMatch: sameList(defaultCvExperience, mondrianCvExperience),
          cvEducationMatch: sameList(defaultCvEducation, mondrianCvEducation),
          cvPublicationsMatch: sameList(defaultCvPublications, mondrianCvPublications),
          contactLinksMatch: sameList(defaultContactLinks, mondrianContactLinks),
          contentParityFailures,
          contentByDesign,
          defaultH1,
          mondrianH1,
          defaultProjectTitles,
          mondrianProjectTitles,
          defaultCvExperience,
          mondrianCvExperience,
          defaultCvEducation,
          mondrianCvEducation,
          defaultCvPublications,
          mondrianCvPublications,
          defaultContactLinks,
          mondrianContactLinks
        },
        contact: location.hash !== '#contact' || !target ? null : (() => {
          const top = target.getBoundingClientRect().top;
          const expectedTop = headerHeight + 16;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const reachedBottom = Math.abs(window.scrollY - maxScroll) < 8;
          return {
            top: Math.round(top),
            expectedTop: Math.round(expectedTop),
            ok: Math.abs(top - expectedTop) < 96 || (reachedBottom && top < window.innerHeight * 0.45)
          };
        })(),
        carousel: !carousel ? null : {
          beforeIndex: carouselViewport?.dataset.carouselIndex,
          scrollBehavior: carouselViewport ? getComputedStyle(carouselViewport).scrollBehavior : '',
          previousDisabled: Boolean(carousel.querySelector('[data-carousel-prev]')?.disabled),
          nextDisabled: Boolean(carousel.querySelector('[data-carousel-next]')?.disabled)
        }
      };
  })()`;
}

async function pressArrowRight(page) {
  await page.send('Runtime.evaluate', {
    expression: `(() => {
      const style = document.documentElement.getAttribute('data-style') || 'default';
      const supports = (root) => !root || (root.dataset.designRoot || '').split(/\\s+/).includes(style);
      const carousel = Array.from(document.querySelectorAll('[data-carousel]')).find((item) => supports(item.closest('[data-design-root]')));
      carousel?.querySelector('.app-carousel__viewport')?.focus();
    })()`
  });
  await page.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await page.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
  await delay(100);
  return page.evaluate(`(() => {
    const style = document.documentElement.getAttribute('data-style') || 'default';
    const supports = (root) => !root || (root.dataset.designRoot || '').split(/\\s+/).includes(style);
    const carousel = Array.from(document.querySelectorAll('[data-carousel]')).find((item) => supports(item.closest('[data-design-root]')));
    if (!carousel) return null;
    return {
      afterIndex: carousel.querySelector('.app-carousel__viewport')?.dataset.carouselIndex,
      previousDisabled: Boolean(carousel.querySelector('[data-carousel-prev]')?.disabled),
      nextDisabled: Boolean(carousel.querySelector('[data-carousel-next]')?.disabled)
    };
  })()`);
}

async function inspectReadingProgressAfterScroll(page) {
  const state = await page.evaluate(`(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return { skipped: true };
    const header = document.querySelector('.site-header');
    const headerStyle = header ? getComputedStyle(header) : null;
    const headerRect = header?.getBoundingClientRect();
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    scrollTo(0, maxScroll * 0.5);
    return {
      skipped: false,
      maxScroll,
      headerBefore: headerStyle && headerRect ? {
        height: headerRect.height,
        paddingBlock: [headerStyle.paddingTop, headerStyle.paddingBottom],
        borderBlock: [headerStyle.borderTopWidth, headerStyle.borderBottomWidth],
        backgroundImage: headerStyle.backgroundImage,
        backgroundColor: headerStyle.backgroundColor,
        boxShadow: headerStyle.boxShadow
      } : null
    };
  })()`);
  if (state.skipped) return state;

  await delay(120);
  const after = await page.evaluate(`(() => {
    const rail = document.querySelector('[data-reading-progress]');
    const bar = rail?.querySelector('.reading-progress__bar');
    const railWidth = rail?.getBoundingClientRect().width || 0;
    const barWidth = bar?.getBoundingClientRect().width || 0;
    const header = document.querySelector('.site-header');
    const headerStyle = header ? getComputedStyle(header) : null;
    const headerRect = header?.getBoundingClientRect();
    return {
      skipped: false,
      customProgress: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reading-progress')),
      visualProgress: railWidth > 0 ? barWidth / railWidth : 0,
      nativeTimeline: CSS.supports('animation-timeline: scroll()'),
      hasScrolled: document.body.classList.contains('has-scrolled'),
      headerAfter: headerStyle && headerRect ? {
        height: headerRect.height,
        paddingBlock: [headerStyle.paddingTop, headerStyle.paddingBottom],
        borderBlock: [headerStyle.borderTopWidth, headerStyle.borderBottomWidth],
        backgroundImage: headerStyle.backgroundImage,
        backgroundColor: headerStyle.backgroundColor,
        boxShadow: headerStyle.boxShadow
      } : null
    };
  })()`);
  return { ...after, headerBefore: state.headerBefore };
}

async function inspectThemeTransition(page) {
  return page.evaluate(`new Promise((resolve) => {
    const root = document.documentElement;
    const darkButton = document.querySelector('[data-theme-value="dark"]');
    const lightButton = document.querySelector('[data-theme-value="light"]');
    if (!darkButton || !lightButton || typeof document.startViewTransition !== 'function') {
      resolve({ supported: false });
      return;
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      darkButton.click();
      window.setTimeout(() => {
        resolve({
          supported: true,
          reducedMotion: true,
          kind: root.dataset.transitionKind || '',
          resolvedTheme: root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
        });
      }, 20);
      return;
    }
    const capture = () => ({
        kind: root.dataset.transitionKind || '',
        from: root.dataset.transitionFrom || '',
        to: root.dataset.transitionTo || '',
        oldAnimationName: getComputedStyle(root, '::view-transition-old(root)').animationName,
        newAnimationName: getComputedStyle(root, '::view-transition-new(root)').animationName,
        animationNames: document.getAnimations().map((animation) => animation.animationName).filter(Boolean)
    });
    darkButton.click();
    window.setTimeout(() => {
      const forward = capture();
      window.setTimeout(() => {
        lightButton.click();
        window.setTimeout(() => {
          const reverse = capture();
          window.setTimeout(() => resolve({ supported: true, forward, reverse }), 520);
        }, 80);
      }, 520);
    }, 80);
  })`);
}

async function inspectStyleTransitions(page) {
  return page.evaluate(`(async () => {
    const root = document.documentElement;
    const targets = ['editorial', 'mondrian', 'azulejo', 'default'];
    const buttons = new Map(Array.from(document.querySelectorAll('[data-style-value]')).map((button) => [button.dataset.styleValue, button]));
    if (typeof document.startViewTransition !== 'function' || targets.some((target) => !buttons.has(target))) {
      return { supported: false };
    }
    const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
    const choose = async (target, captureMotion) => {
      const changed = new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(false), 2600);
        const listener = (event) => {
          if (event.detail?.style !== target) return;
          clearTimeout(timeout);
          window.removeEventListener('site:stylechange', listener);
          resolve(true);
        };
        window.addEventListener('site:stylechange', listener);
      });
      buttons.get(target).click();
      const changedInTime = await changed;
      await wait(captureMotion ? 80 : 20);
      const state = {
        target,
        changedInTime,
        actualStyle: root.dataset.style || '',
        kind: root.dataset.transitionKind || '',
        from: root.dataset.transitionFrom || '',
        to: root.dataset.transitionTo || '',
        oldAnimationName: getComputedStyle(root, '::view-transition-old(root)').animationName,
        newAnimationName: getComputedStyle(root, '::view-transition-new(root)').animationName,
        animationNames: document.getAnimations().map((animation) => animation.animationName).filter(Boolean)
      };
      await wait(captureMotion ? 520 : 20);
      return state;
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const state = await choose('editorial', false);
      await choose('default', false);
      return { supported: true, reducedMotion: true, states: [state] };
    }
    const states = [];
    for (const target of targets) states.push(await choose(target, true));
    return { supported: true, reducedMotion: false, states };
  })()`);
}

async function inspectMobileNavigation(page) {
  return page.evaluate(`(async () => {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.nav-toggle');
    const lines = Array.from(toggle?.querySelectorAll('.nav-toggle__line') || []);
    if (!nav || !toggle || getComputedStyle(toggle).display === 'none') return { supported: false };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return { supported: true, reducedMotion: true };
    const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
    const capture = () => {
      const navStyle = getComputedStyle(nav);
      return {
        expanded: toggle.getAttribute('aria-expanded'),
        isOpen: nav.classList.contains('is-open'),
        display: navStyle.display,
        opacity: Number.parseFloat(navStyle.opacity),
        transform: navStyle.transform,
        transitionProperty: navStyle.transitionProperty,
        transitionDuration: navStyle.transitionDuration,
        lineTransforms: lines.map((line) => getComputedStyle(line).transform),
        lineOpacities: lines.map((line) => Number.parseFloat(getComputedStyle(line).opacity))
      };
    };
    toggle.click();
    await wait(40);
    const opening = capture();
    await wait(280);
    toggle.click();
    await wait(40);
    const closing = capture();
    await wait(280);
    return { supported: true, opening, closing, settled: capture() };
  })()`);
}

async function inspectChoiceMenuMotion(page) {
  return page.evaluate(`(async () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return { supported: true, reducedMotion: true, menus: [] };
    const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
    const menus = [];
    for (const kind of ['style', 'theme']) {
      const menu = document.querySelector('[data-' + kind + '-menu]');
      const trigger = document.querySelector('[data-' + kind + '-trigger]');
      const panel = menu?.querySelector('.' + kind + '-menu__panel');
      if (!menu || !trigger || !panel) continue;
      const capture = () => {
        const panelStyle = getComputedStyle(panel);
        return {
          expanded: trigger.getAttribute('aria-expanded'),
          isOpen: menu.classList.contains('is-open'),
          display: panelStyle.display,
          opacity: Number.parseFloat(panelStyle.opacity),
          transform: panelStyle.transform,
          transitionProperty: panelStyle.transitionProperty,
          transitionDuration: panelStyle.transitionDuration,
          chevronTransform: getComputedStyle(trigger, '::after').transform
        };
      };
      trigger.click();
      await wait(40);
      const opening = capture();
      await wait(280);
      trigger.click();
      await wait(40);
      const closing = capture();
      await wait(280);
      menus.push({ kind, opening, closing, settled: capture() });
    }
    return { supported: menus.length > 0, reducedMotion: false, menus };
  })()`);
}

async function runCase(page, testCase) {
  page.errors = [];
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: testCase.width,
    height,
    deviceScaleFactor: testCase.width <= 540 ? 2 : 1,
    mobile: testCase.width <= 540
  });
  await page.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: emulateReducedMotion ? 'reduce' : 'no-preference' }]
  });

  await navigateAndWait(page, normalizeUrl('/'));
  await page.evaluate(`(() => {
    localStorage.setItem('style', '${testCase.style}');
    localStorage.setItem('theme', '${testCase.theme}');
  })()`);
  await navigateAndWait(page, normalizeCaseUrl(testCase));
  await waitForDesignStylesheet(page, testCase.style);
  await waitForDesignRuntime(page, testCase.style);
  await delay(testCase.path.includes('#contact') ? 700 : 260);

  let result = await page.evaluate(auditExpression(testCase.style, testCase.path));
  if (testCase.path.includes('#') && result.contact && !result.contact.ok) {
    await delay(600);
    result = await page.evaluate(auditExpression(testCase.style, testCase.path));
  }
  const mediaOrLayoutStillSettling = result.themePictureMismatches?.length > 0
    || result.readingProgress?.shouldShow !== result.readingProgress?.active;
  if (mediaOrLayoutStillSettling) {
    await delay(450);
    result = await page.evaluate(auditExpression(testCase.style, testCase.path));
  }
  if (shouldCaptureSnapshot(testCase)) {
    await writeSnapshot(page, testCase);
  }
  let mobileNavigation = null;
  if (testCase.path === '/' && testCase.theme === 'light' && testCase.width === 390) {
    mobileNavigation = await inspectMobileNavigation(page);
  }
  let choiceMenuMotion = null;
  if (testCase.path === '/' && testCase.theme === 'light' && testCase.width === 1366) {
    choiceMenuMotion = await inspectChoiceMenuMotion(page);
  }
  let readingProgressAfterScroll = null;
  if (testCase.path === '/' && testCase.width === 1366) {
    readingProgressAfterScroll = await inspectReadingProgressAfterScroll(page);
  }
  let themeTransition = null;
  if (testCase.path === '/' && testCase.theme === 'light' && testCase.width === 1366) {
    themeTransition = await inspectThemeTransition(page);
  }
  let styleTransitions = null;
  if (testCase.path === '/' && testCase.style === 'default' && testCase.theme === 'light' && testCase.width === 1366) {
    styleTransitions = await inspectStyleTransitions(page);
  }
  let carouselAfter = null;
  if (result.carousel) {
    carouselAfter = await pressArrowRight(page);
  }

  return {
    ...testCase,
    ...result,
    mobileNavigation,
    choiceMenuMotion,
    readingProgressAfterScroll,
    themeTransition,
    styleTransitions,
    carouselAfter,
    consoleErrors: page.errors.slice()
  };
}

function assertResult(result) {
  const failures = [];
  if (result.actualStyle !== result.expectedStyle) failures.push(`style mismatch ${result.actualStyle}`);
  if (result.themeChoice !== result.theme) failures.push(`theme mismatch ${result.themeChoice}`);
  if (result.activeRootCount !== 1) failures.push(`expected exactly one active design root, got ${result.activeRootCount}`);
  if (result.inactiveLeakCount > 0) failures.push('inactive design roots visible/accessibility-leaking');
  if (result.inactiveEagerImages > 0) failures.push(`${result.inactiveEagerImages} inactive design image(s) are eager/high priority`);
  if (result.overflow > 2) failures.push(`horizontal overflow ${result.overflow}px`);
  if (result.motion?.revealCount !== result.motion?.revealPreparedCount) {
    failures.push(`reveal preparation mismatch (${result.motion?.revealPreparedCount || 0}/${result.motion?.revealCount || 0})`);
  }
  if (!result.motion?.reduced && result.motion?.revealCount > 0) {
    const revealHasDuration = String(result.motion.revealTransitionDuration || '')
      .split(',')
      .some((duration) => Number.parseFloat(duration) > 0);
    if (!revealHasDuration) failures.push('reveal elements have no transition duration');
  }
  if ((result.motion?.revealPromotedCount || 0) > 0) {
    failures.push(`${result.motion.revealPromotedCount} reveal element(s) reserve compositor layers while idle`);
  }
  if (!result.readingProgress?.present) failures.push('reading progress rail is missing');
  if (!result.readingProgress?.ariaHidden) failures.push('reading progress rail should be hidden from assistive technology');
  if (result.readingProgress?.pointerEvents !== 'none') failures.push('reading progress rail should not intercept input');
  if (result.readingProgress?.shouldShow !== result.readingProgress?.active) failures.push('reading progress activation does not match page length');
  if (result.readingProgress?.nativeTimeline && result.readingProgress?.inlineProgressValue) {
    failures.push('native scroll timeline is receiving duplicate JavaScript progress updates');
  }
  const expectedProgressHeight = result.expectedStyle === 'mondrian' ? 5 : 3;
  if (Math.abs((result.readingProgress?.height || 0) - expectedProgressHeight) > 0.5) {
    failures.push(`reading progress height is ${result.readingProgress?.height || 0}px, expected ${expectedProgressHeight}px`);
  }
  if (result.readingProgressAfterScroll && !result.readingProgressAfterScroll.skipped) {
    const { customProgress, visualProgress, nativeTimeline, hasScrolled, headerBefore, headerAfter } = result.readingProgressAfterScroll;
    const stateProgressIsWrong = !nativeTimeline && Math.abs(customProgress - 0.5) > 0.12;
    if (stateProgressIsWrong || Math.abs(visualProgress - 0.5) > 0.12) {
      failures.push(`reading progress did not track midpoint (state ${customProgress}, visual ${visualProgress})`);
    }
    if (!hasScrolled) failures.push('scrolled page did not activate the header scroll state');
    if (!headerBefore || !headerAfter) {
      failures.push('header state could not be measured before and after scrolling');
    } else {
      const stableHeaderKeys = ['paddingBlock', 'borderBlock', 'backgroundImage', 'backgroundColor'];
      if (result.expectedStyle === 'azulejo') stableHeaderKeys.push('boxShadow');
      if (Math.abs(headerBefore.height - headerAfter.height) > 0.5) {
        failures.push(`header height changes on scroll (${headerBefore.height}px to ${headerAfter.height}px)`);
      }
      for (const key of stableHeaderKeys) {
        if (JSON.stringify(headerBefore[key]) !== JSON.stringify(headerAfter[key])) {
          failures.push(`header ${key} changes on scroll`);
        }
      }
    }
  }
  if (result.expectedStyle === 'azulejo') {
    if (!result.azulejoField?.maskImage.includes('tile-atlas.svg')) {
      failures.push('Azulejo background is not using the twenty-tile atlas');
    }
    if (result.azulejoField?.maskSize !== '480px 384px') {
      failures.push(`Azulejo background mosaic has unexpected sizing (${result.azulejoField?.maskSize || 'none'})`);
    }
    if (result.azulejoField?.tileVariantCount !== 20) {
      failures.push(`Azulejo ribbons expose ${result.azulejoField?.tileVariantCount || 0} of 20 tile variants`);
    }
    if (!(result.azulejoField?.opacity > 0 && result.azulejoField?.opacity < 0.15)) {
      failures.push('Azulejo background mosaic opacity is outside the quiet decorative range');
    }
    if ((result.performance?.maskLayerCount || 0) > 20) {
      failures.push(`Azulejo renders ${result.performance.maskLayerCount} visible mask layers, exceeding the paint budget`);
    }
  }
  if (result.themeTransition?.supported) {
    if (result.themeTransition.reducedMotion) {
      if (result.themeTransition.kind || result.themeTransition.resolvedTheme !== 'dark') {
        failures.push('reduced-motion theme switch should update instantly without a view transition');
      }
    } else {
      const expectedAnimations = {
        default: ['site-style-out', 'site-style-in'],
        editorial: ['editorial-style-out', 'editorial-style-in'],
        mondrian: ['mondrian-style-out', 'mondrian-style-in'],
        azulejo: ['azulejo-glaze-out', 'azulejo-glaze-in']
      }[result.expectedStyle] || [];
      const directions = [
        { label: 'light to dark', state: result.themeTransition.forward, from: 'light', to: 'dark' },
        { label: 'dark to light', state: result.themeTransition.reverse, from: 'dark', to: 'light' }
      ];
      for (const direction of directions) {
        if (direction.state.kind !== 'theme' || direction.state.from !== direction.from || direction.state.to !== direction.to) {
          failures.push(`${direction.label} transition metadata mismatch (${direction.state.from || '?'} -> ${direction.state.to || '?'}, kind ${direction.state.kind || '?'})`);
        }
        const appliedAnimations = [
          direction.state.oldAnimationName,
          direction.state.newAnimationName,
          ...direction.state.animationNames
        ];
        for (const animationName of expectedAnimations) {
          if (!appliedAnimations.includes(animationName)) {
            failures.push(`${direction.label} transition is missing ${animationName}`);
          }
        }
      }
    }
  }
  if (result.styleTransitions?.supported) {
    const expectedAnimations = {
      default: ['site-style-out', 'site-style-in'],
      editorial: ['editorial-style-out', 'editorial-style-in'],
      mondrian: ['mondrian-style-out', 'mondrian-style-in'],
      azulejo: ['azulejo-glaze-out', 'azulejo-glaze-in']
    };
    for (const state of result.styleTransitions.states || []) {
      if (!state.changedInTime || state.actualStyle !== state.target) {
        failures.push(`style switch to ${state.target} did not complete`);
        continue;
      }
      if (result.styleTransitions.reducedMotion) {
        if (state.kind) failures.push('reduced-motion style switch should not start a view transition');
        continue;
      }
      if (state.kind !== 'style' || state.to !== state.target) {
        failures.push(`style transition metadata mismatch for ${state.target}`);
      }
      const appliedAnimations = [state.oldAnimationName, state.newAnimationName, ...state.animationNames];
      for (const animationName of expectedAnimations[state.target] || []) {
        if (!appliedAnimations.includes(animationName)) failures.push(`style switch to ${state.target} is missing ${animationName}`);
      }
    }
  }
  if (result.mobileNavigation?.supported && !result.mobileNavigation.reducedMotion) {
    const { opening, closing, settled } = result.mobileNavigation;
    const motionProperties = String(opening.transitionProperty || '');
    for (const property of ['opacity', 'transform', 'display']) {
      if (!motionProperties.includes(property)) failures.push(`mobile navigation transition is missing ${property}`);
    }
    if (opening.expanded !== 'true' || !opening.isOpen || opening.display === 'none') {
      failures.push('mobile navigation did not enter its open state');
    }
    if (opening.transform === 'none') failures.push('mobile navigation has no opening transform');
    if (opening.lineTransforms?.[0] === 'none' || opening.lineTransforms?.[2] === 'none' || opening.lineOpacities?.[1] >= 1) {
      failures.push('mobile navigation icon did not morph into a close control');
    }
    if (closing.expanded !== 'false' || closing.isOpen || closing.display === 'none' || closing.transform === 'none') {
      failures.push('mobile navigation closing animation was skipped');
    }
    if (settled.display !== 'none' || settled.lineTransforms?.[0] !== 'none' || settled.lineTransforms?.[2] !== 'none' || settled.lineOpacities?.[1] < 0.99) {
      failures.push('mobile navigation did not settle back to its closed state');
    }
  }
  if (result.choiceMenuMotion?.supported && !result.choiceMenuMotion.reducedMotion) {
    if (result.choiceMenuMotion.menus?.length !== 2) failures.push('style and theme menu motion could not both be inspected');
    for (const menu of result.choiceMenuMotion.menus || []) {
      const { opening, closing, settled } = menu;
      const motionProperties = String(opening.transitionProperty || '');
      for (const property of ['opacity', 'transform', 'display']) {
        if (!motionProperties.includes(property)) failures.push(`${menu.kind} menu transition is missing ${property}`);
      }
      if (opening.expanded !== 'true' || !opening.isOpen || opening.display === 'none' || opening.transform === 'none' || opening.chevronTransform === 'none') {
        failures.push(`${menu.kind} menu did not animate into its open state`);
      }
      if (closing.expanded !== 'false' || closing.isOpen || closing.display === 'none' || closing.transform === 'none') {
        failures.push(`${menu.kind} menu closing animation was skipped`);
      }
      if (settled.display !== 'none') failures.push(`${menu.kind} menu did not settle closed`);
    }
  }
  if (result.path === '/projects/' && (result.activeProjectIndexCount !== 1 || result.activeProjectIndexKeys?.length !== 1)) {
    failures.push(`project index should expose one active location, got ${result.activeProjectIndexCount}`);
  }
  if (result.imagesMissingDimensions > 0) failures.push(`${result.imagesMissingDimensions} visible image(s) missing dimensions`);
  if (result.responsiveImagesMissingSizes > 0) failures.push(`${result.responsiveImagesMissingSizes} responsive image candidate(s) missing sizes`);
  if (result.themePictureMismatches?.length > 0) {
    failures.push(`theme-aware picture mismatch: ${result.themePictureMismatches.map((item) => `${item.mode} -> ${item.src || 'missing src'}`).join('; ')}`);
  }
  if (result.imageOverlayContrastFailures?.length > 0) {
    failures.push(`image overlay contrast: ${result.imageOverlayContrastFailures.map((item) => `${item.text} (${item.reason}${item.ratio ? `, ${item.ratio.toFixed(2)}:1` : ''})`).join('; ')}`);
  }
  if (result.alignmentFailures?.length > 0) {
    failures.push(`alignment: ${result.alignmentFailures.slice(0, 6).join('; ')}`);
  }
  if (result.clippedTextFailures?.length > 0) {
    failures.push(`clipped text: ${result.clippedTextFailures.slice(0, 6).join('; ')}`);
  }
  if (result.viewportContainmentFailures?.length > 0) {
    failures.push(`viewport containment: ${result.viewportContainmentFailures.slice(0, 6).join('; ')}`);
  }
  if (result.overlapFailures?.length > 0) {
    failures.push(`overlap: ${result.overlapFailures.slice(0, 6).join('; ')}`);
  }
  if (result.emptySpaceFailures?.length > 0) {
    failures.push(`empty space: ${result.emptySpaceFailures.slice(0, 6).join('; ')}`);
  }
  if (result.cvPhotoTooLarge) failures.push('Mondrian CV tablet photo is oversized');
  if (result.cvPhotoBadCrop) failures.push('Mondrian CV tablet photo aspect is unstable');
  if (result.cvPhotoImageMismatch) failures.push('Mondrian CV tablet photo image does not fill tile');
  if (!result.parity.h1Matches) failures.push(`H1 parity mismatch: "${result.parity.defaultH1}" vs "${result.parity.mondrianH1}"`);
  if (!result.parity.heroButtonsMatch) failures.push('home hero button parity mismatch');
  if (!result.parity.projectTitlesMatch) failures.push('project title parity mismatch');
  if (!result.parity.cvExperienceMatch) failures.push('CV experience parity mismatch');
  if (!result.parity.cvEducationMatch) failures.push('CV education parity mismatch');
  if (!result.parity.cvPublicationsMatch) failures.push('CV publication parity mismatch');
  if (!result.parity.contactLinksMatch) failures.push('contact link parity mismatch');
  if (result.parity.contentParityFailures?.length > 0) {
    failures.push(`content contract parity mismatch: ${result.parity.contentParityFailures.slice(0, 5).join('; ')}`);
  }
  if (result.contact && !result.contact.ok) failures.push(`contact hash landed at ${result.contact.top}px`);
  if (result.carousel) {
    const expectedScrollBehavior = result.motion?.reduced ? 'auto' : 'smooth';
    if (result.carousel.scrollBehavior !== expectedScrollBehavior) {
      failures.push(`carousel scroll behavior is ${result.carousel.scrollBehavior}, expected ${expectedScrollBehavior}`);
    }
    if (result.carousel.beforeIndex !== '1') failures.push('carousel did not start on slide 1');
    if (!result.carousel.previousDisabled) failures.push('carousel previous button should start disabled');
    if (result.carousel.nextDisabled) failures.push('carousel next button should start enabled');
    if (result.carouselAfter?.afterIndex !== '2') failures.push('carousel ArrowRight did not advance to slide 2');
  }
  if (result.consoleErrors.length > 0) failures.push(`console errors: ${result.consoleErrors.join('; ')}`);
  return failures;
}

async function main() {
  const browserPath = findBrowser();
  if (!browserPath) {
    throw new Error('No Chrome or Edge executable found. Set CHROME_PATH to run the local site audit.');
  }

  mkdirSync(outputDir, { recursive: true });
  if (captureSnapshots) mkdirSync(snapshotDir, { recursive: true });
  const profileDir = join(outputDir, `chrome-profile-${Date.now()}`);
  rmSync(profileDir, { recursive: true, force: true });

  const port = await freePort();
  const browser = spawn(browserPath, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    await waitForVersion(port);
    const testCases = [];
    for (const path of pages) {
      for (const style of styles) {
        for (const theme of themes) {
          for (const width of widths) {
            testCases.push({ path, style, theme, width });
          }
        }
      }
    }
    if (!pageFilter) {
      const contactWidths = widthFilter ? widths : [768];
      for (const style of styles) {
        for (const theme of themes) {
          for (const width of contactWidths) {
            testCases.push({ path: '/#contact', style, theme, width });
          }
        }
      }
    }

    const target = await newTarget(port);
    const page = new CdpClient(target.webSocketDebuggerUrl);
    await page.open();
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Log.enable');

    const results = [];
    const failures = [];
    try {
      for (const testCase of testCases) {
        try {
          const result = await runCase(page, testCase);
          const resultFailures = assertResult(result);
          results.push(result);
          if (resultFailures.length > 0) {
            failures.push({ testCase, failures: resultFailures });
          }
          process.stdout.write(resultFailures.length > 0 ? 'F' : '.');
        } catch (error) {
          results.push({ ...testCase, error: error.message });
          failures.push({ testCase, failures: [error.message] });
          process.stdout.write('F');
        }
      }
    } finally {
      page.close();
      await closeTarget(port, target.id);
    }
    process.stdout.write('\n');

    const cssBudgetFailures = assertCssBudgets(designRegistry);
    if (cssBudgetFailures.length > 0) {
      failures.push({ testCase: { path: 'assets/css', style: 'all', theme: 'all', width: 0 }, failures: cssBudgetFailures });
    }
    const registryFailures = assertDesignRegistry(designRegistry);
    if (registryFailures.length > 0) {
      failures.push({ testCase: { path: '_data/designs.yml', style: 'all', theme: 'all', width: 0 }, failures: registryFailures });
    }
    const includeFailures = assertDesignIncludes(designRegistry);
    if (includeFailures.length > 0) {
      failures.push({ testCase: { path: '_data/designs.yml', style: 'all', theme: 'all', width: 0 }, failures: includeFailures });
    }
    const caseVisualFailures = assertCaseVisualIncludes(designRegistry);
    if (caseVisualFailures.length > 0) {
      failures.push({ testCase: { path: '_data/designs.yml', style: 'all', theme: 'all', width: 0 }, failures: caseVisualFailures });
    }

    const report = {
      baseUrl,
      generatedAt: new Date().toISOString(),
      designs: designRegistry,
      snapshots: captureSnapshots ? snapshotDir : null,
      results,
      failures
    };
    writeFileSync(join(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

    if (failures.length > 0) {
      console.error(JSON.stringify(failures.slice(0, 10), null, 2));
      throw new Error(`${failures.length} audit case(s) failed. See ${join(outputDir, 'report.json')}.`);
    }

    console.log(`Audit passed: ${results.length} cases. Report: ${join(outputDir, 'report.json')}`);
  } finally {
    browser.kill();
    await waitForExit(browser);
    await removeDirWithRetry(profileDir);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
