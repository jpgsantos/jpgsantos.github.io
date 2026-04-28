(function() {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('main-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const themeMenu = document.querySelector('[data-theme-menu]');
  const themeTrigger = document.querySelector('[data-theme-trigger]');
  const themeCurrentLabel = document.querySelector('[data-theme-current-label]');
  const themeCurrentIcons = Array.from(document.querySelectorAll('[data-theme-current-icon]'));
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-value]'));
  const styleMenu = document.querySelector('[data-style-menu]');
  const styleTrigger = document.querySelector('[data-style-trigger]');
  const styleCurrentLabel = document.querySelector('[data-style-current-label]');
  const styleCurrentIcons = Array.from(document.querySelectorAll('[data-style-current-icon]'));
  const styleButtons = Array.from(document.querySelectorAll('[data-style-value]'));
  const styleSelect = document.querySelector('[data-style-select]');
  const supportedStyles = styleSelect
    ? Array.from(styleSelect.options).map((option) => option.value)
    : styleButtons.map((button) => button.dataset.styleValue);
  const styleLabels = styleButtons.reduce((labels, button) => {
    labels[button.dataset.styleValue] = button.dataset.styleName || button.textContent.trim();
    return labels;
  }, {});
  const scrollButton = document.getElementById('scrollToTop');
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let contactScrollFrame = 0;
  let resizeFrame = 0;
  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    auto: 'System'
  };
  const defaultDesignRoots = Array.from(document.querySelectorAll('.default-only'));
  const mondrianDesignRoots = Array.from(document.querySelectorAll('.home-mondrian, .about-mondrian, .projects-mondrian, .cv-mondrian'));

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

  function setThemeMenuOpen(isOpen) {
    if (!themeMenu || !themeTrigger) return;
    themeMenu.classList.toggle('is-open', isOpen);
    themeTrigger.setAttribute('aria-expanded', String(isOpen));
  }

  function setStyleMenuOpen(isOpen) {
    if (!styleMenu || !styleTrigger) return;
    styleMenu.classList.toggle('is-open', isOpen);
    styleTrigger.setAttribute('aria-expanded', String(isOpen));
  }

  function applyTheme(choice) {
    const theme = choice || readPreference('theme', 'auto');
    const shouldUseDark = theme === 'dark' || (theme === 'auto' && darkQuery && darkQuery.matches);

    root.toggleAttribute('data-theme', shouldUseDark);
    if (shouldUseDark) {
      root.setAttribute('data-theme', 'dark');
    }
    root.setAttribute('data-theme-choice', theme);

    if (themeCurrentLabel) {
      themeCurrentLabel.textContent = themeLabels[theme] || themeLabels.auto;
    }

    themeCurrentIcons.forEach((icon) => {
      icon.hidden = icon.dataset.themeCurrentIcon !== theme;
    });

    if (themeTrigger) {
      themeTrigger.setAttribute('aria-label', `Theme: ${themeLabels[theme] || themeLabels.auto}`);
    }

    themeButtons.forEach((button) => {
      const isActive = button.dataset.themeValue === theme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-checked', String(isActive));
    });
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function setHeaderOffset() {
    if (!header) return;
    root.style.setProperty('--header-height', `${header.offsetHeight}px`);
  }

  function getContactTarget() {
    const style = root.getAttribute('data-style') || 'default';
    const selector = style === 'mondrian'
      ? '[data-contact-anchor="mondrian"]'
      : '[data-contact-anchor="default"]';
    return document.querySelector(selector);
  }

  function scrollToContactHash(behavior) {
    if (window.location.hash !== '#contact') return;
    const target = getContactTarget();
    if (!target) return;

    window.cancelAnimationFrame(contactScrollFrame);
    window.requestAnimationFrame(() => {
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

  function handleScroll() {
    const scrolled = window.scrollY > 18;
    body.classList.toggle('has-scrolled', scrolled);

    if (scrollButton) {
      scrollButton.classList.toggle('is-visible', window.scrollY > 500);
    }
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
    defaultDesignRoots.forEach((element) => setDesignRootActive(element, style === 'default'));
    mondrianDesignRoots.forEach((element) => setDesignRootActive(element, style === 'mondrian'));
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
    if (styleCurrentLabel) {
      styleCurrentLabel.textContent = styleLabels[style] || style;
    }
    styleCurrentIcons.forEach((icon) => {
      icon.hidden = icon.dataset.styleCurrentIcon !== style;
    });
    if (styleTrigger) {
      styleTrigger.setAttribute('aria-label', `Design: ${styleLabels[style] || style}`);
    }
    styleButtons.forEach((button) => {
      const isActive = button.dataset.styleValue === style;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-checked', String(isActive));
    });

    scrollToContactHash('auto');
  }

  function scheduleHeaderOffset() {
    if (resizeFrame) return;
    resizeFrame = window.requestAnimationFrame(() => {
      setHeaderOffset();
      scrollToContactHash('auto');
      resizeFrame = 0;
    });
  }

  applyTheme(readPreference('theme', 'auto'));
  applyStyle(readPreference('style', 'default'));

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = button.dataset.themeValue;
      writePreference('theme', nextTheme);
      applyTheme(nextTheme);
      setThemeMenuOpen(false);
    });
  });

  if (themeTrigger) {
    themeTrigger.addEventListener('click', () => {
      setThemeMenuOpen(!(themeMenu && themeMenu.classList.contains('is-open')));
    });
  }

  styleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextStyle = button.dataset.styleValue;
      writePreference('style', nextStyle);
      applyStyle(nextStyle);
      setStyleMenuOpen(false);
    });
  });

  if (styleTrigger) {
    styleTrigger.addEventListener('click', () => {
      setStyleMenuOpen(!(styleMenu && styleMenu.classList.contains('is-open')));
    });
  }

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

  if (navToggle && nav) {
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

  document.addEventListener('click', (event) => {
    if (themeMenu && !themeMenu.contains(event.target)) setThemeMenuOpen(false);
    if (styleMenu && !styleMenu.contains(event.target)) setStyleMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeNav();
    setThemeMenuOpen(false);
    setStyleMenuOpen(false);
  });

  if (scrollButton) {
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

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

      if (shouldScroll && changed) {
        viewport.scrollTo({
          left: slides[activeIndex].offsetLeft - viewport.offsetLeft,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }
    }

    function syncFromScroll() {
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
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

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
  setHeaderOffset();
  handleScroll();
  scrollToContactHash('auto');
})();
