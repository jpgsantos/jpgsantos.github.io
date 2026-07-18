(function() {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const designRoots = Array.from(document.querySelectorAll('[data-design-root]'));
  const designStylesheets = Array.from(document.querySelectorAll('[data-design-stylesheet]'));
  const stylePriorityImages = Array.from(document.querySelectorAll('[data-style-priority-image]'));
  const themePictures = Array.from(document.querySelectorAll('[data-theme-picture]'));
  const readingProgress = document.querySelector('[data-reading-progress]');
  const nativeScrollProgress = Boolean(
    window.CSS
    && typeof window.CSS.supports === 'function'
    && window.CSS.supports('animation-timeline: scroll()')
  );
  const styleSelect = document.querySelector('[data-style-select]');
  const styleButtons = Array.from(document.querySelectorAll('[data-style-value]'));
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-value]'));
  const supportedStyles = styleSelect
    ? Array.from(styleSelect.options).map((option) => option.value)
    : styleButtons.map((button) => button.dataset.styleValue);
  const styleLabels = styleButtons.reduce((labels, button) => {
    labels[button.dataset.styleValue] = button.dataset.styleName || button.textContent.trim();
    return labels;
  }, {});
  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    auto: 'System'
  };

  let anchorScrollFrame = 0;
  let resizeFrame = 0;
  let pageGeometryFrame = 0;
  let readingProgressMaxScroll = 0;
  let readingProgressIsLongPage = false;
  let headerHeight = 76;
  let hasScrolled = false;
  let activeViewTransition = null;
  let transitionSerial = 0;
  let styleRequestSerial = 0;
  let syncProjectIndex = function() {};
  let updateProjectGeometry = function() {};

  function readPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  function rememberStyleChoice(style) {
    if (window.__siteStyleRotation && typeof window.__siteStyleRotation.select === 'function') {
      window.__siteStyleRotation.select(style, supportedStyles);
      return;
    }
    writePreference('style', style);
  }

  function createChoiceMenu(config) {
    const menu = document.querySelector(config.menuSelector);
    const trigger = document.querySelector(config.triggerSelector);
    const currentLabel = document.querySelector(config.labelSelector);
    const currentIcons = Array.from(document.querySelectorAll(config.iconSelector));
    const buttons = Array.from(document.querySelectorAll(config.buttonSelector));

    function labelFor(value) {
      return config.labels[value] || value;
    }

    function setOpen(isOpen) {
      if (!menu || !trigger) return;
      menu.classList.toggle('is-open', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
    }

    function closeAndRestoreFocus() {
      setOpen(false);
      if (trigger) trigger.focus();
    }

    function openAndFocus(fallbackIndex) {
      if (buttons.length === 0) return;
      const selected = buttons.find((button) => button.getAttribute('aria-checked') === 'true');
      setOpen(true);
      (selected || buttons[fallbackIndex]).focus();
    }

    function render(value) {
      if (currentLabel) {
        currentLabel.textContent = labelFor(value);
      }

      currentIcons.forEach((icon) => {
        icon.hidden = icon.dataset[config.currentIconDataset] !== value;
      });

      if (trigger) {
        trigger.setAttribute('aria-label', `${config.triggerLabel}: ${labelFor(value)}`);
      }

      buttons.forEach((button) => {
        const isActive = button.dataset[config.buttonDataset] === value;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-checked', String(isActive));
      });
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset[config.buttonDataset];
        closeAndRestoreFocus();
        config.onChoose(value);
      });

      button.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          setOpen(false);
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          closeAndRestoreFocus();
          return;
        }

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

        const currentIndex = buttons.indexOf(button);
        const keyTargets = {
          ArrowDown: (currentIndex + 1) % buttons.length,
          ArrowUp: (currentIndex - 1 + buttons.length) % buttons.length,
          Home: 0,
          End: buttons.length - 1
        };

        if (!(event.key in keyTargets)) return;
        event.preventDefault();
        buttons[keyTargets[event.key]].focus();
      });
    });

    if (trigger) {
      trigger.addEventListener('click', () => {
        setOpen(!(menu && menu.classList.contains('is-open')));
      });

      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          setOpen(false);
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          closeAndRestoreFocus();
          return;
        }

        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

        event.preventDefault();
        openAndFocus(event.key === 'ArrowDown' ? 0 : buttons.length - 1);
      });
    }

    return { menu, render, setOpen };
  }

  function designRootSupports(element, style) {
    return (element.dataset.designRoot || '')
      .split(/\s+/)
      .filter(Boolean)
      .includes(style);
  }

  function setDesignRootActive(element, isActive) {
    if (isActive) {
      element.removeAttribute('aria-hidden');
      if ('inert' in element) element.inert = false;
      return;
    }

    element.setAttribute('aria-hidden', 'true');
    if ('inert' in element) element.inert = true;
  }

  function syncDesignTrees(style) {
    designRoots.forEach((element) => {
      setDesignRootActive(element, designRootSupports(element, style));
    });
  }

  function syncDesignStylesheets(style) {
    designStylesheets.forEach((stylesheet) => {
      const design = stylesheet.dataset.designStylesheet;
      if ((design === 'default' || design === style) && !stylesheet.href && stylesheet.dataset.designHref) {
        stylesheet.href = stylesheet.dataset.designHref;
      }
      stylesheet.disabled = design !== 'default' && design !== style;
    });
  }

  function isDesignStylesheetReady(stylesheet) {
    if (stylesheet.sheet) return true;
    if (!stylesheet.href) return false;

    return Array.from(document.styleSheets).some((sheet) => sheet.href === stylesheet.href);
  }

  function ensureDesignStylesheet(style) {
    const stylesheet = designStylesheets.find((link) => link.dataset.designStylesheet === style);
    if (!stylesheet || style === 'default') return Promise.resolve();

    if (stylesheet.href) {
      stylesheet.disabled = false;
      if (isDesignStylesheetReady(stylesheet)) return Promise.resolve();
    }

    return new Promise((resolve) => {
      let settled = false;
      let timeout = 0;

      function finish() {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        resolve();
      }

      timeout = window.setTimeout(finish, 2400);
      stylesheet.addEventListener('load', finish, { once: true });
      stylesheet.addEventListener('error', finish, { once: true });
      if (!stylesheet.href && stylesheet.dataset.designHref) {
        stylesheet.href = stylesheet.dataset.designHref;
      }
      stylesheet.disabled = false;
      window.requestAnimationFrame(() => {
        if (isDesignStylesheetReady(stylesheet)) finish();
      });
    });
  }

  function dispatchSiteEvent(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function runViewTransition(kind, from, to, update) {
    if (reduceMotion || typeof document.startViewTransition !== 'function') {
      update();
      return null;
    }

    if (activeViewTransition && typeof activeViewTransition.skipTransition === 'function') {
      activeViewTransition.skipTransition();
    }

    const serial = ++transitionSerial;
    root.dataset.transitionKind = kind;
    root.dataset.transitionFrom = from;
    root.dataset.transitionTo = to;

    try {
      activeViewTransition = document.startViewTransition(update);
    } catch (error) {
      delete root.dataset.transitionKind;
      delete root.dataset.transitionFrom;
      delete root.dataset.transitionTo;
      activeViewTransition = null;
      update();
      return null;
    }

    activeViewTransition.finished
      .catch(() => {})
      .finally(() => {
        if (serial !== transitionSerial) return;
        delete root.dataset.transitionKind;
        delete root.dataset.transitionFrom;
        delete root.dataset.transitionTo;
        activeViewTransition = null;
      });

    return activeViewTransition;
  }

  function isInActiveDesignTree(element) {
    const designRoot = element.closest('[data-design-root]');
    if (!designRoot) return true;
    return designRootSupports(designRoot, root.getAttribute('data-style') || 'default');
  }

  function setHeaderHeight(height) {
    const nextHeight = Math.ceil(height);
    if (!nextHeight || nextHeight === headerHeight) return;
    headerHeight = nextHeight;
    root.style.setProperty('--header-height', `${headerHeight}px`);
    schedulePageGeometryUpdate();
  }

  function measureHeaderOffset() {
    if (!header) return;
    setHeaderHeight(header.getBoundingClientRect().height);
  }

  function initHeaderOffset() {
    if (!header) return;

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        const borderBox = entry && entry.borderBoxSize;
        const size = Array.isArray(borderBox) ? borderBox[0] : borderBox;
        const observedHeight = size && size.blockSize ? size.blockSize : entry.contentRect.height;
        setHeaderHeight(observedHeight);
      });
      observer.observe(header);
      return;
    }

    window.addEventListener('load', measureHeaderOffset, { once: true });
  }

  function scheduleAnchorScroll() {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      scrollToActiveHash('auto');
      refreshPageGeometry();
      resizeFrame = 0;
    });
  }

  function syncStylePriorityImages(style) {
    stylePriorityImages.forEach((image) => {
      const designRoot = image.closest('[data-design-root]');
      const isActive = !designRoot || designRootSupports(designRoot, style);
      image.loading = isActive ? 'eager' : 'lazy';
      if (isActive) {
        image.setAttribute('fetchpriority', 'high');
      } else {
        image.removeAttribute('fetchpriority');
      }
    });
  }

  function syncThemePictures(useDark) {
    const mode = useDark ? 'Dark' : 'Light';

    themePictures.forEach((picture) => {
      const image = picture.querySelector('img');
      if (!image) return;

      const webpSource = picture.querySelector('source[type="image/webp"]');
      const webpSrcset = picture.dataset[`theme${mode}WebpSrcset`];
      const fallbackSrcset = picture.dataset[`theme${mode}FallbackSrcset`];
      const src = picture.dataset[`theme${mode}Src`];

      if (webpSource && webpSrcset && webpSource.getAttribute('srcset') !== webpSrcset) {
        webpSource.setAttribute('srcset', webpSrcset);
      }
      if (fallbackSrcset && image.getAttribute('srcset') !== fallbackSrcset) {
        image.setAttribute('srcset', fallbackSrcset);
      }
      if (src && image.getAttribute('src') !== src) {
        image.setAttribute('src', src);
      }
    });
  }

  function getActiveHashTarget() {
    const anchor = window.location.hash === '#contact'
      ? 'contact'
      : (window.location.hash === '#about' ? 'about' : '');
    if (!anchor) return null;

    const style = root.getAttribute('data-style') || 'default';
    return document.querySelector(`[data-${anchor}-anchor="${style}"]`)
      || document.querySelector(`[data-${anchor}-anchor="default"]`);
  }

  function scrollToActiveHash(behavior) {
    const target = getActiveHashTarget();
    if (!target) return;

    window.cancelAnimationFrame(anchorScrollFrame);
    anchorScrollFrame = window.requestAnimationFrame(() => {
      anchorScrollFrame = window.requestAnimationFrame(() => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: reduceMotion ? 'auto' : (behavior || 'auto')
        });
      });
    });
  }

  function applyTheme(choice, options) {
    const settings = options || {};
    const theme = choice || readPreference('theme', 'auto');
    const shouldUseDark = theme === 'dark' || (theme === 'auto' && darkQuery && darkQuery.matches);
    const previousTheme = root.getAttribute('data-theme-choice') || 'auto';
    const previouslyUsedDark = root.getAttribute('data-theme') === 'dark';

    function commitTheme() {
      if (shouldUseDark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
      root.setAttribute('data-theme-choice', theme);
      syncThemePictures(shouldUseDark);
      themeMenu.render(theme);
      dispatchSiteEvent('site:themechange', {
        theme,
        previousTheme,
        resolvedTheme: shouldUseDark ? 'dark' : 'light',
        previousResolvedTheme: previouslyUsedDark ? 'dark' : 'light'
      });
      window.requestAnimationFrame(handleScroll);
    }

    if (settings.animate && shouldUseDark !== previouslyUsedDark) {
      runViewTransition(
        'theme',
        previouslyUsedDark ? 'dark' : 'light',
        shouldUseDark ? 'dark' : 'light',
        commitTheme
      );
      return;
    }

    commitTheme();
  }

  function applyStyle(choice, options) {
    const settings = options || {};
    const requestedStyle = choice || readPreference('style', 'default');
    const fallbackStyle = supportedStyles.includes('default') ? 'default' : supportedStyles[0];
    const style = supportedStyles.includes(requestedStyle) ? requestedStyle : fallbackStyle;
    const previousStyle = root.getAttribute('data-style') || fallbackStyle;
    const requestSerial = ++styleRequestSerial;

    function commitStyle() {
      syncDesignStylesheets(style);
      root.setAttribute('data-style', style);
      syncDesignTrees(style);
      syncStylePriorityImages(style);

      if (styleSelect && styleSelect.value !== style) {
        styleSelect.value = style;
      }

      styleMenu.render(style);
      dispatchSiteEvent('site:stylechange', { style, previousStyle });
      scrollToActiveHash('auto');
      schedulePageGeometryUpdate();
    }

    if (!settings.animate || previousStyle === style) {
      commitStyle();
      return;
    }

    ensureDesignStylesheet(style).then(() => {
      if (requestSerial !== styleRequestSerial) return;
      runViewTransition('style', previousStyle, style, commitStyle);
    });
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function initNavigation() {
    if (!navToggle || !nav) return;

    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) closeNav();
    });
  }

  function initProjectIndexState() {
    const projectIndexLinks = Array.from(document.querySelectorAll('a[data-content-list="project-index"]'));
    if (projectIndexLinks.length === 0) return;
    const projectPairs = projectIndexLinks
      .map((link) => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
      .filter((pair) => pair.target);
    let currentProjectKey = '';

    function setCurrentProject(projectKey) {
      const nextProjectKey = projectKey || '';
      if (nextProjectKey === currentProjectKey) return;
      currentProjectKey = nextProjectKey;

      projectIndexLinks.forEach((link) => {
        if (nextProjectKey && link.dataset.contentKey === nextProjectKey) {
          link.setAttribute('aria-current', 'location');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    let activeProjectPositions = [];

    function refreshProjectGeometry() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      activeProjectPositions = projectPairs.filter((pair) => (
        isInActiveDesignTree(pair.link) && isInActiveDesignTree(pair.target)
      )).map((pair) => ({
        pair,
        top: pair.target.getBoundingClientRect().top + scrollTop
      }));
    }

    function syncCurrentProjectFromScroll(currentScrollTop) {
      if (activeProjectPositions.length === 0) refreshProjectGeometry();
      if (activeProjectPositions.length === 0) return;

      const scrollTop = Number.isFinite(currentScrollTop)
        ? currentScrollTop
        : (window.scrollY || document.documentElement.scrollTop || 0);
      const marker = scrollTop + headerHeight + Math.min(window.innerHeight * 0.28, 240);
      let currentPair = activeProjectPositions[0].pair;

      activeProjectPositions.forEach((position) => {
        if (position.top <= marker) currentPair = position.pair;
      });

      setCurrentProject(currentPair.link.dataset.contentKey);
    }

    function scrollToProjectLink(link) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;

      window.requestAnimationFrame(() => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'auto' });
      });
    }

    function syncCurrentProjectFromHash() {
      const hashedLink = projectIndexLinks.find((link) => link.hash === window.location.hash);
      if (!hashedLink) {
        syncCurrentProjectFromScroll();
        return;
      }

      const projectKey = hashedLink.dataset.contentKey;
      const activeLink = projectIndexLinks.find((link) => (
        link.dataset.contentKey === projectKey && isInActiveDesignTree(link)
      ));
      if (!activeLink) return;

      setCurrentProject(projectKey);
      if (activeLink.hash !== window.location.hash && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', activeLink.hash);
      }
      scrollToProjectLink(activeLink);
    }

    syncProjectIndex = syncCurrentProjectFromScroll;

    projectIndexLinks.forEach((link) => {
      link.addEventListener('click', () => setCurrentProject(link.dataset.contentKey));
    });

    window.addEventListener('hashchange', syncCurrentProjectFromHash);
    window.addEventListener('site:stylechange', () => {
      refreshProjectGeometry();
      syncCurrentProjectFromHash();
    });
    updateProjectGeometry = refreshProjectGeometry;
    refreshProjectGeometry();
    syncCurrentProjectFromHash();
  }

  function refreshReadingProgressGeometry() {
    if (!readingProgress) return;

    readingProgressMaxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const isLongPage = readingProgressMaxScroll > Math.max(560, window.innerHeight * 0.75);
    if (isLongPage !== readingProgressIsLongPage) {
      body.classList.toggle('has-reading-progress', isLongPage);
      readingProgressIsLongPage = isLongPage;
    }
  }

  function updateReadingProgress(scrollTop) {
    if (!readingProgress || nativeScrollProgress) return;

    const progress = readingProgressMaxScroll > 0
      ? Math.min(1, Math.max(0, scrollTop / readingProgressMaxScroll))
      : 0;
    root.style.setProperty('--reading-progress', progress.toFixed(4));
  }

  function refreshPageGeometry() {
    refreshReadingProgressGeometry();
    updateProjectGeometry();
    handleScroll();
  }

  function schedulePageGeometryUpdate() {
    if (pageGeometryFrame) return;
    pageGeometryFrame = window.requestAnimationFrame(() => {
      refreshPageGeometry();
      pageGeometryFrame = 0;
    });
  }

  function initPageGeometryObserver() {
    const main = document.querySelector('main');
    if ('ResizeObserver' in window && main) {
      const observer = new ResizeObserver(schedulePageGeometryUpdate);
      observer.observe(main);
    }

    document.addEventListener('load', schedulePageGeometryUpdate, true);
    refreshPageGeometry();
  }

  function handleScroll(currentScrollTop) {
    const scrollTop = Number.isFinite(currentScrollTop)
      ? currentScrollTop
      : (window.scrollY || document.documentElement.scrollTop || 0);
    const nextHasScrolled = scrollTop > 18;
    if (nextHasScrolled !== hasScrolled) {
      body.classList.toggle('has-scrolled', nextHasScrolled);
      hasScrolled = nextHasScrolled;
    }

    updateReadingProgress(scrollTop);
    syncProjectIndex(scrollTop);
  }

  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const viewport = carousel.querySelector('.app-carousel__viewport');
      const slides = Array.from(carousel.querySelectorAll('.app-slide'));
      const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
      const captions = Array.from(carousel.querySelectorAll('[data-carousel-caption]'));
      const previous = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      if (!viewport || slides.length === 0) return;

      let activeIndex = 0;
      let frame = 0;

      function syncControls() {
        const isFirst = activeIndex === 0;
        const isLast = activeIndex === slides.length - 1;
        viewport.dataset.carouselIndex = String(activeIndex + 1);

        if (previous) {
          previous.disabled = isFirst;
          previous.setAttribute('aria-disabled', String(isFirst));
        }

        if (next) {
          next.disabled = isLast;
          next.setAttribute('aria-disabled', String(isLast));
        }
      }

      function setActive(index, shouldScroll) {
        const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
        const changed = nextIndex !== activeIndex;
        activeIndex = nextIndex;

        dots.forEach((dot, dotIndex) => {
          dot.setAttribute('aria-current', String(dotIndex === activeIndex));
        });

        captions.forEach((caption, captionIndex) => {
          const isActive = captionIndex === activeIndex;
          caption.hidden = !isActive;
          caption.setAttribute('aria-current', String(isActive));
        });

        syncControls();

        if (shouldScroll && changed && isInActiveDesignTree(carousel)) {
          viewport.scrollTo({
            left: slides[activeIndex].offsetLeft - viewport.offsetLeft,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      }

      function syncFromScroll() {
        if (!isInActiveDesignTree(carousel)) return;
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          const viewportCenter = viewport.scrollLeft + (viewport.clientWidth / 2);
          const closest = slides.reduce((best, slide, index) => {
            const slideCenter = slide.offsetLeft + (slide.clientWidth / 2);
            const distance = Math.abs(slideCenter - viewportCenter);
            return distance < best.distance ? { index, distance } : best;
          }, { index: activeIndex, distance: Infinity });
          setActive(closest.index, false);
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => setActive(index, true));
      });

      if (previous) {
        previous.addEventListener('click', () => setActive(activeIndex - 1, true));
      }

      if (next) {
        next.addEventListener('click', () => setActive(activeIndex + 1, true));
      }

      viewport.addEventListener('keydown', (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

        const keyTargets = {
          ArrowLeft: activeIndex - 1,
          ArrowRight: activeIndex + 1,
          Home: 0,
          End: slides.length - 1
        };

        if (!(event.key in keyTargets)) return;
        event.preventDefault();
        setActive(keyTargets[event.key], true);
      });

      viewport.addEventListener('scroll', syncFromScroll, { passive: true });
      setActive(0, false);
    });
  }

  function initReveals() {
    const revealTargets = document.querySelectorAll('[data-reveal]');

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

      revealTargets.forEach((element) => {
        element.classList.add('reveal');
        observer.observe(element);
      });
      return;
    }

    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

  const themeMenu = createChoiceMenu({
    menuSelector: '[data-theme-menu]',
    triggerSelector: '[data-theme-trigger]',
    labelSelector: '[data-theme-current-label]',
    iconSelector: '[data-theme-current-icon]',
    buttonSelector: '[data-theme-value]',
    buttonDataset: 'themeValue',
    currentIconDataset: 'themeCurrentIcon',
    triggerLabel: 'Theme',
    labels: themeLabels,
    onChoose: (theme) => {
      writePreference('theme', theme);
      applyTheme(theme, { animate: true });
    }
  });

  const styleMenu = createChoiceMenu({
    menuSelector: '[data-style-menu]',
    triggerSelector: '[data-style-trigger]',
    labelSelector: '[data-style-current-label]',
    iconSelector: '[data-style-current-icon]',
    buttonSelector: '[data-style-value]',
    buttonDataset: 'styleValue',
    currentIconDataset: 'styleCurrentIcon',
    triggerLabel: 'Design',
    labels: styleLabels,
    onChoose: (style) => {
      rememberStyleChoice(style);
      applyStyle(style, { animate: true });
    }
  });

  function initializeSite() {
    if (initializeSite.started) return;
    initializeSite.started = true;

    applyTheme(readPreference('theme', 'auto'));
    applyStyle(root.getAttribute('data-style') || readPreference('style', 'default'));

    if (styleSelect) {
      styleSelect.addEventListener('change', () => {
        const nextStyle = styleSelect.value;
        rememberStyleChoice(nextStyle);
        applyStyle(nextStyle, { animate: true });
      });
    }

    if (darkQuery) {
      const handleSystemThemeChange = () => {
        if (readPreference('theme', 'auto') === 'auto') {
          applyTheme('auto');
        }
      };

      if (darkQuery.addEventListener) {
        darkQuery.addEventListener('change', handleSystemThemeChange);
      } else if (darkQuery.addListener) {
        darkQuery.addListener(handleSystemThemeChange);
      }
    }

    document.addEventListener('click', (event) => {
      if (themeMenu.menu && !themeMenu.menu.contains(event.target)) themeMenu.setOpen(false);
      if (styleMenu.menu && !styleMenu.menu.contains(event.target)) styleMenu.setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeNav();
      themeMenu.setOpen(false);
      styleMenu.setOpen(false);
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        handleScroll(scrollTop);
        ticking = false;
      });
      ticking = true;
    }, { passive: true });

    window.addEventListener('resize', scheduleAnchorScroll);
    window.addEventListener('hashchange', () => scrollToActiveHash(reduceMotion ? 'auto' : 'smooth'));
    window.addEventListener('load', () => {
      scrollToActiveHash('auto');
      refreshPageGeometry();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        scrollToActiveHash('auto');
        refreshPageGeometry();
      }).catch(() => {});
    }

    initNavigation();
    initProjectIndexState();
    initCarousels();
    initReveals();
    initHeaderOffset();
    initPageGeometryObserver();
    scrollToActiveHash('auto');
  }

  if (root.classList.contains('is-design-stylesheet-loading')) {
    const fallback = window.setTimeout(initializeSite, 2500);
    window.addEventListener('site:designstylesheetready', () => {
      window.clearTimeout(fallback);
      initializeSite();
    }, { once: true });
  } else {
    initializeSite();
  }
})();
