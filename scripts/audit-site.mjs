import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';

const baseUrl = getArg('--base-url') || process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4022';
const outputDir = resolve('_site_preview/audit-site');
const pageFilter = getArg('--path');
const styleFilter = getArg('--style');
const themeFilter = getArg('--theme');
const widthFilter = Number(getArg('--width'));
const pages = pageFilter ? [pageFilter] : ['/', '/projects/', '/cv/', '/projects/octidy-android-app/', '/projects/subcellular-workflow/'];
const widths = Number.isFinite(widthFilter) && widthFilter > 0 ? [widthFilter] : [390, 540, 768, 1024, 1366];
const styles = styleFilter ? [styleFilter] : ['default', 'mondrian'];
const themes = themeFilter ? [themeFilter] : ['light', 'dark'];
const height = 900;

function getArg(name) {
  const match = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

function normalizeUrl(path) {
  return new URL(path, baseUrl).href;
}

function normalizeCaseUrl(testCase) {
  const url = new URL(testCase.path, baseUrl);
  url.searchParams.set('audit', `${testCase.style}-${testCase.theme}-${testCase.width}`);
  return url.href;
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
      const activeScoped = (selector) => activeRoots.flatMap((item) => Array.from(item.querySelectorAll(selector)));
      const defaultRoot = document.querySelector('[data-design-root="default"]');
      const mondrianRoot = document.querySelector('[data-design-root="mondrian"]');
      const defaultH1 = normalize(defaultRoot?.querySelector('h1')?.textContent);
      const mondrianH1 = normalize(mondrianRoot?.querySelector('h1')?.textContent);
      const defaultHeroButtons = Array.from(defaultRoot?.querySelectorAll('.hero__actions a') || []).map((item) => normalize(item.textContent));
      const mondrianHeroButtons = Array.from(mondrianRoot?.querySelectorAll('.mond-tile--actions a') || []).map((item) => normalize(item.textContent));
      const carousel = activeScoped('[data-carousel]')[0];
      const visibleImages = activeScoped('img').filter((img) => img.offsetParent !== null);
      const imagesMissingDimensions = visibleImages.filter((img) => !img.getAttribute('width') || !img.getAttribute('height')).length;
      const responsiveImagesMissingSizes = activeScoped('img[srcset], source[srcset]').filter((media) => !media.getAttribute('sizes')).length;
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
      return {
        path: '${path}',
        expectedStyle: '${expectedStyle}',
        actualStyle: html.getAttribute('data-style'),
        themeChoice: html.getAttribute('data-theme-choice'),
        activeRootCount: activeRoots.length,
        inactiveLeakCount: inactiveLeaks.length,
        overflow: Math.max(0, docWidth - window.innerWidth),
        imagesMissingDimensions,
        responsiveImagesMissingSizes,
        cvPhotoTooLarge,
        cvPhotoBadCrop,
        cvPhotoImageMismatch,
        parity: {
          h1Matches: !defaultH1 || !mondrianH1 || defaultH1 === mondrianH1,
          heroButtonsMatch: defaultHeroButtons.length === 0 || mondrianHeroButtons.length === 0 || defaultHeroButtons.join('|') === mondrianHeroButtons.join('|'),
          defaultH1,
          mondrianH1
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
          beforeIndex: carousel.querySelector('.app-carousel__viewport')?.dataset.carouselIndex,
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

async function runCase(page, testCase) {
  page.errors = [];
  await page.send('Emulation.setDeviceMetricsOverride', {
    width: testCase.width,
    height,
    deviceScaleFactor: testCase.width <= 540 ? 2 : 1,
    mobile: testCase.width <= 540
  });

  await navigateAndWait(page, normalizeUrl('/'));
  await page.evaluate(`(() => {
    localStorage.setItem('style', '${testCase.style}');
    localStorage.setItem('theme', '${testCase.theme}');
  })()`);
  await navigateAndWait(page, normalizeCaseUrl(testCase));
  await delay(testCase.path.includes('#contact') ? 700 : 260);

  const result = await page.evaluate(auditExpression(testCase.style, testCase.path));
  let carouselAfter = null;
  if (result.carousel) {
    carouselAfter = await pressArrowRight(page);
  }

  return {
    ...testCase,
    ...result,
    carouselAfter,
    consoleErrors: page.errors.slice()
  };
}

function assertResult(result) {
  const failures = [];
  if (result.actualStyle !== result.expectedStyle) failures.push(`style mismatch ${result.actualStyle}`);
  if (result.themeChoice !== result.theme) failures.push(`theme mismatch ${result.themeChoice}`);
  if (result.activeRootCount < 1) failures.push('missing active design root');
  if (result.inactiveLeakCount > 0) failures.push('inactive design roots visible/accessibility-leaking');
  if (result.overflow > 2) failures.push(`horizontal overflow ${result.overflow}px`);
  if (result.imagesMissingDimensions > 0) failures.push(`${result.imagesMissingDimensions} visible image(s) missing dimensions`);
  if (result.responsiveImagesMissingSizes > 0) failures.push(`${result.responsiveImagesMissingSizes} responsive image candidate(s) missing sizes`);
  if (result.cvPhotoTooLarge) failures.push('Mondrian CV tablet photo is oversized');
  if (result.cvPhotoBadCrop) failures.push('Mondrian CV tablet photo aspect is unstable');
  if (result.cvPhotoImageMismatch) failures.push('Mondrian CV tablet photo image does not fill tile');
  if (!result.parity.h1Matches) failures.push(`H1 parity mismatch: "${result.parity.defaultH1}" vs "${result.parity.mondrianH1}"`);
  if (!result.parity.heroButtonsMatch) failures.push('home hero button parity mismatch');
  if (result.contact && !result.contact.ok) failures.push(`contact hash landed at ${result.contact.top}px`);
  if (result.carousel) {
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

    const report = {
      baseUrl,
      generatedAt: new Date().toISOString(),
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
