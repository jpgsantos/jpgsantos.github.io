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

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function isMondrian() {
    return document.documentElement.getAttribute('data-style') === 'mondrian';
  }

  function colors() {
    if (isMondrian()) {
      return isDark()
        ? { node: 'rgba(241, 236, 225, .85)', line: 'rgba(241, 236, 225, .25)', hot: 'rgba(230, 57, 70, .9)' }
        : { node: 'rgba(13, 13, 13, .82)', line: 'rgba(13, 13, 13, .25)', hot: 'rgba(230, 57, 70, .9)' };
    }
    return isDark()
      ? { node: 'rgba(94, 234, 212, .62)', line: 'rgba(94, 234, 212, .16)', hot: 'rgba(251, 191, 36, .85)' }
      : { node: 'rgba(15, 118, 110, .62)', line: 'rgba(15, 118, 110, .17)', hot: 'rgba(180, 83, 9, .8)' };
  }

  function createInstance(canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    const parent = canvas.parentElement;
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

    function resize() {
      const rect = parent.getBoundingClientRect();
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

      const palette = colors();
      ctx.clearRect(0, 0, state.width, state.height);

      for (let i = 0; i < state.particles.length; i += 1) {
        const current = state.particles[i];
        updateParticle(current);

        for (let j = i + 1; j < state.particles.length; j += 1) {
          const next = state.particles[j];
          const dx = current.x - next.x;
          const dy = current.y - next.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.radius) {
            const opacity = 1 - distance / config.radius;
            ctx.strokeStyle = palette.line.replace(/[\d.]+\)$/g, `${Math.max(0.04, opacity * 0.22)})`);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
        }
      }

      state.particles.forEach((particle) => {
        const dx = state.mouse.x === null ? Infinity : particle.x - state.mouse.x;
        const dy = state.mouse.y === null ? Infinity : particle.y - state.mouse.y;
        const hot = Math.sqrt(dx * dx + dy * dy) < 95;
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
        const rect = canvas.getBoundingClientRect();
        state.mouse.x = event.clientX - rect.left;
        state.mouse.y = event.clientY - rect.top;
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

    const resizeObserver = new ResizeObserver(() => { resize(); });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    resizeObserver.observe(parent);
    visibilityObserver.observe(canvas);

    return {
      refresh: () => {
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
