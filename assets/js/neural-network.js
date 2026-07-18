(function() {
  'use strict';

  const canvases = Array.from(document.querySelectorAll('[data-neural]'));
  if (canvases.length === 0) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (reduceMotion) {
    canvases.forEach((canvas) => { canvas.hidden = true; });
    return;
  }

  const config = {
    density: coarsePointer ? 0.000035 : 0.000055,
    minParticles: coarsePointer ? 18 : 26,
    maxParticles: coarsePointer ? 42 : 76,
    speed: coarsePointer ? 0.16 : 0.22,
    radius: coarsePointer ? 120 : 155
  };
  const radiusSquared = config.radius * config.radius;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function isMondrian() {
    return document.documentElement.getAttribute('data-style') === 'mondrian';
  }

  function isEditorial() {
    return document.documentElement.getAttribute('data-style') === 'editorial';
  }

  function colors() {
    if (isEditorial()) {
      return isDark()
        ? { node: 'rgba(13, 18, 16, .76)', line: 'rgb(13, 18, 16)', hot: 'rgba(239, 113, 93, .95)' }
        : { node: 'rgba(255, 253, 246, .82)', line: 'rgb(255, 253, 246)', hot: 'rgba(213, 169, 31, .96)' };
    }
    if (isMondrian()) {
      return isDark()
        ? { node: 'rgba(241, 236, 225, .85)', line: 'rgb(241, 236, 225)', hot: 'rgba(230, 57, 70, .9)' }
        : { node: 'rgba(13, 13, 13, .82)', line: 'rgb(13, 13, 13)', hot: 'rgba(230, 57, 70, .9)' };
    }
    return isDark()
      ? { node: 'rgba(94, 234, 212, .62)', line: 'rgb(94, 234, 212)', hot: 'rgba(251, 191, 36, .85)' }
      : { node: 'rgba(15, 118, 110, .62)', line: 'rgb(15, 118, 110)', hot: 'rgba(180, 83, 9, .8)' };
  }

  function createInstance(canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    const parent = canvas.parentElement;
    let palette = colors();
    const state = {
      width: 0,
      height: 0,
      dpr: 1,
      particles: [],
      animationId: 0,
      running: false,
      visible: true,
      mouse: { x: null, y: null }
    };

    function particleCount() {
      const area = state.width * state.height;
      return Math.max(config.minParticles, Math.min(config.maxParticles, Math.round(area * config.density)));
    }

    function resize(observedRect) {
      const rect = observedRect || parent.getBoundingClientRect();
      const width = Math.max(120, Math.floor(rect.width));
      const height = Math.max(120, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      if (width === state.width && height === state.height && dpr === state.dpr) return;

      state.width = width;
      state.height = height;
      state.dpr = dpr;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
    }

    function seedParticles() {
      const count = particleCount();
      state.particles = Array.from({ length: count }, () => ({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        size: 1.8 + Math.random() * 2.2
      }));
    }

    function updateParticle(particle) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > state.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > state.height) particle.vy *= -1;

      particle.x = Math.max(0, Math.min(state.width, particle.x));
      particle.y = Math.max(0, Math.min(state.height, particle.y));
    }

    function draw() {
      if (!state.running || !state.visible) return;

      ctx.clearRect(0, 0, state.width, state.height);
      ctx.strokeStyle = palette.line;
      ctx.lineWidth = 1;

      for (let i = 0; i < state.particles.length; i += 1) {
        const current = state.particles[i];
        updateParticle(current);

        for (let j = i + 1; j < state.particles.length; j += 1) {
          const next = state.particles[j];
          const dx = current.x - next.x;
          const dy = current.y - next.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < radiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const opacity = 1 - distance / config.radius;
            ctx.globalAlpha = Math.max(0.04, opacity * 0.22);
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      state.particles.forEach((particle) => {
        const dx = state.mouse.x === null ? Infinity : particle.x - state.mouse.x;
        const dy = state.mouse.y === null ? Infinity : particle.y - state.mouse.y;
        const hot = dx * dx + dy * dy < 9025;
        ctx.fillStyle = hot ? palette.hot : palette.node;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, hot ? particle.size + 1.5 : particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      state.animationId = window.requestAnimationFrame(draw);
    }

    function isInActiveDesignRoot() {
      const designRoot = canvas.closest('[data-design-root]');
      if (!designRoot) return true;
      const style = document.documentElement.getAttribute('data-style') || 'default';
      return (designRoot.dataset.designRoot || '').split(/\s+/).includes(style);
    }

    function isOnscreen() {
      return isInActiveDesignRoot() && canvas.offsetParent !== null;
    }

    function start() {
      if (state.running || !state.visible || !isOnscreen()) return;
      state.running = true;
      draw();
    }

    function stop() {
      state.running = false;
      window.cancelAnimationFrame(state.animationId);
    }

    if (!coarsePointer) {
      canvas.addEventListener('pointermove', (event) => {
        state.mouse.x = event.offsetX;
        state.mouse.y = event.offsetY;
      }, { passive: true });

      canvas.addEventListener('pointerleave', () => {
        state.mouse.x = null;
        state.mouse.y = null;
      });
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      state.visible = entries.some((entry) => entry.isIntersecting);
      if (state.visible && !document.hidden && isOnscreen()) {
        start();
      } else {
        stop();
      }
    }, { threshold: 0.05 });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      resize(entry ? entry.contentRect : null);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    resizeObserver.observe(parent);
    visibilityObserver.observe(canvas);

    return {
      refresh: () => {
        palette = colors();
        if (isOnscreen()) {
          resize();
          start();
        } else {
          stop();
        }
      }
    };
  }

  const instances = canvases.map(createInstance).filter(Boolean);
  instances.forEach((inst) => inst.refresh());

  const styleObserver = new MutationObserver(() => {
    instances.forEach((inst) => inst.refresh());
  });
  styleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-style', 'data-theme'] });
})();
