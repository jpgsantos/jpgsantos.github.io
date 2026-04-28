(function() {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const scrollButton = document.getElementById('scrollToTop');
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const designRoots = Array.from(document.querySelectorAll('[data-design-root]'));
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

  let contactScrollFrame = 0;
  let resizeFrame = 0;

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
        config.onChoose(value);
        setOpen(false);
      });
    });

    if (trigger) {
      trigger.addEventListener('click', () => {
        setOpen(!(menu && menu.classList.contains('is-open')));
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

  function isInActiveDesignTree(element) {
    const designRoot = element.closest('[data-design-root]');
    if (!designRoot) return true;
    return designRootSupports(designRoot, root.getAttribute('data-style') || 'default');
  }

  function setHeaderOffset() {
    if (!header) return;
    root.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }

  function scheduleHeaderOffset() {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      setHeaderOffset();
      scrollToContactHash('auto');
      resizeFrame = 0;
    });
  }

  function getContactTarget() {
    const style = root.getAttribute('data-style') || 'default';
    return document.querySelector(`[data-contact-anchor="${style}"]`)
      || document.querySelector('[data-contact-anchor="default"]');
  }

  function scrollToContactHash(behavior) {
    if (window.location.hash !== '#contact') return;
    const target = getContactTarget();
    if (!target) return;

    window.cancelAnimationFrame(contactScrollFrame);
    contactScrollFrame = window.requestAnimationFrame(() => {
      contactScrollFrame = window.requestAnimationFrame(() => {
        const headerOffset = header ? header.offsetHeight : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: reduceMotion ? 'auto' : (behavior || 'auto')
        });
      });
    });
  }

  function applyTheme(choice) {
    const theme = choice || readPreference('theme', 'auto');
    const shouldUseDark = theme === 'dark' || (theme === 'auto' && darkQuery && darkQuery.matches);

    if (shouldUseDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    root.setAttribute('data-theme-choice', theme);
    themeMenu.render(theme);
  }

  function applyStyle(choice) {
    const requestedStyle = choice || readPreference('style', 'default');
    const fallbackStyle = supportedStyles.includes('default') ? 'default' : supportedStyles[0];
    const style = supportedStyles.includes(requestedStyle) ? requestedStyle : fallbackStyle;

    root.setAttribute('data-style', style);
    syncDesignTrees(style);

    if (styleSelect && styleSelect.value !== style) {
      styleSelect.value = style;
    }

    styleMenu.render(style);
    scrollToContactHash('auto');
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

  function handleScroll() {
    body.classList.toggle('has-scrolled', window.scrollY > 18);

    if (scrollButton) {
      scrollButton.classList.toggle('is-visible', window.scrollY > 500);
    }
  }

  function initScrollToTop() {
    if (!scrollButton) return;
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
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
      applyTheme(theme);
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
      writePreference('style', style);
      applyStyle(style);
    }
  });

  applyTheme(readPreference('theme', 'auto'));
  applyStyle(readPreference('style', 'default'));

  if (styleSelect) {
    styleSelect.addEventListener('change', () => {
      const nextStyle = styleSelect.value;
      writePreference('style', nextStyle);
      applyStyle(nextStyle);
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
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  window.addEventListener('resize', scheduleHeaderOffset);
  window.addEventListener('hashchange', () => scrollToContactHash(reduceMotion ? 'auto' : 'smooth'));
  window.addEventListener('load', () => scrollToContactHash('auto'));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => scrollToContactHash('auto')).catch(() => {});
  }

  initNavigation();
  initScrollToTop();
  initCarousels();
  initReveals();
  setHeaderOffset();
  handleScroll();
  scrollToContactHash('auto');
})();
