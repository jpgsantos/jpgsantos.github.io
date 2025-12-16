/**
 * Neural Network Background Animation
 * Creates an animated particle/node network effect
 */

(function() {
  'use strict';

  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let lastWidth = 0;
  let lastHeight = 0;

  // Configuration - base values for desktop
  const config = {
    // Particles per 100,000 square pixels (adjust density here)
    particleDensity: 0.00004,
    minParticles: 20,
    maxParticles: 100,
    particleSize: { min: 2, max: 4 },
    connectionDistance: 180,
    speed: 0.25,
    // How much nodes grow on hover (multiplier)
    hoverGrowth: 2,
    colors: {
      light: {
        particle: 'rgba(15, 118, 110, 0.55)',
        particleHighlight: 'rgba(15, 118, 110, 0.85)',
        connection: 'rgba(15, 118, 110, 0.18)',
        connectionHighlight: 'rgba(15, 118, 110, 0.45)',
        glow: 'rgba(15, 118, 110, 0.3)'
      },
      dark: {
        particle: 'rgba(45, 212, 191, 0.6)',
        particleHighlight: 'rgba(45, 212, 191, 0.95)',
        connection: 'rgba(45, 212, 191, 0.2)',
        connectionHighlight: 'rgba(45, 212, 191, 0.55)',
        glow: 'rgba(45, 212, 191, 0.4)'
      }
    }
  };

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? config.colors.dark : config.colors.light;
  }

  // Calculate particle count based on screen area
  function getParticleCount() {
    const area = window.innerWidth * window.innerHeight;
    let count = Math.floor(area * config.particleDensity);
    
    // Clamp between min and max
    count = Math.max(config.minParticles, Math.min(config.maxParticles, count));
    
    // Further reduce for very small screens (phones)
    if (window.innerWidth < 480) {
      count = Math.floor(count * 0.6);
    } else if (window.innerWidth < 768) {
      count = Math.floor(count * 0.75);
    }
    
    return Math.max(config.minParticles, count);
  }

  // Get connection distance based on screen size
  function getConnectionDistance() {
    if (window.innerWidth < 480) {
      return 120;
    } else if (window.innerWidth < 768) {
      return 150;
    }
    return config.connectionDistance;
  }

  function resize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    // Only do a full resize if dimensions changed significantly
    // This prevents jumps from mobile address bar show/hide
    const widthChange = Math.abs(newWidth - lastWidth);
    const heightChange = Math.abs(newHeight - lastHeight);
    
    // Update canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // If it's just a small height change (likely address bar), 
    // just adjust particle positions proportionally
    if (lastWidth > 0 && widthChange < 50 && heightChange < 150 && heightChange > 0) {
      const heightRatio = newHeight / lastHeight;
      particles.forEach(particle => {
        particle.y *= heightRatio;
        // Make sure particle stays in bounds
        if (particle.y > newHeight) particle.y = newHeight - 10;
        if (particle.y < 0) particle.y = 10;
      });
    } else if (lastWidth > 0 && (widthChange > 100 || heightChange > 200)) {
      // Significant resize (rotation, window resize) - reinitialize
      init();
    }
    
    lastWidth = newWidth;
    lastHeight = newHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
      this.baseSize = this.size;
      this.speedX = (Math.random() - 0.5) * config.speed;
      this.speedY = (Math.random() - 0.5) * config.speed;
      this.highlightFactor = 0; // 0 = not highlighted, 1 = fully highlighted
    }

    update() {
      // Move particle
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      
      // Keep particles in bounds
      this.x = Math.max(0, Math.min(canvas.width, this.x));
      this.y = Math.max(0, Math.min(canvas.height, this.y));

      // Mouse interaction - calculate highlight factor
      this.highlightFactor = 0;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          // Smooth falloff from center
          this.highlightFactor = Math.pow((mouse.radius - distance) / mouse.radius, 0.7);
          this.size = this.baseSize + this.highlightFactor * config.hoverGrowth;
        } else {
          this.size = this.baseSize;
        }
      } else {
        this.size = this.baseSize;
      }
    }

    draw() {
      const colors = getColors();
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // Use highlight color when highlighted
      if (this.highlightFactor > 0.1) {
        ctx.fillStyle = colors.particleHighlight;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 10 + this.highlightFactor * 6;
      } else {
        ctx.fillStyle = colors.particle;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 6;
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function init() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const colors = getColors();
    const connectionDist = getConnectionDistance();
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDist) {
          // Base opacity from distance (fade with distance)
          const distanceOpacity = 1 - (distance / connectionDist);
          
          // Combined highlight factor from both connected nodes
          const combinedHighlight = Math.max(p1.highlightFactor, p2.highlightFactor);
          
          // Calculate final opacity: base + highlight boost
          const baseOpacity = 0.18;
          const highlightOpacity = 0.32;
          const finalOpacity = (baseOpacity + combinedHighlight * (highlightOpacity - baseOpacity)) * distanceOpacity;
          
          // Line width based on highlight (thicker when nodes are highlighted)
          const baseWidth = 1;
          const maxWidth = 1.8;
          const lineWidth = baseWidth + combinedHighlight * (maxWidth - baseWidth);
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          // Create color with calculated opacity
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          if (isDark) {
            ctx.strokeStyle = `rgba(45, 212, 191, ${finalOpacity.toFixed(3)})`;
          } else {
            ctx.strokeStyle = `rgba(15, 118, 110, ${finalOpacity.toFixed(3)})`;
          }
          
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    // Don't continue if animation should be stopped
    if (!isAnimating) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update all particles first
    particles.forEach(particle => {
      particle.update();
    });
    
    // Draw connections (uses updated highlight factors)
    drawConnections();
    
    // Draw particles on top
    particles.forEach(particle => {
      particle.draw();
    });

    animationId = requestAnimationFrame(animate);
  }

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Immediate canvas resize for smooth experience
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Debounce the particle adjustment
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
    }, 100);
  });

  // Track mouse position globally since canvas has pointer-events: none
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Touch support for mobile
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', () => {
    // Delay clearing to allow for smooth fadeout
    setTimeout(() => {
      mouse.x = null;
      mouse.y = null;
    }, 100);
  });

  // Watch for theme changes
  const observer = new MutationObserver(() => {
    // Colors will update automatically on next frame
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Track animation state
  let isAnimating = false;

  // Start animation function
  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }

  // Stop animation function
  function stopAnimation() {
    if (isAnimating) {
      isAnimating = false;
      cancelAnimationFrame(animationId);
    }
  }

  // Pause animation when tab is not visible, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  // Initialize
  lastWidth = window.innerWidth;
  lastHeight = window.innerHeight;
  canvas.width = lastWidth;
  canvas.height = lastHeight;
  init();
  
  // Only start animation if tab is visible
  if (!document.hidden) {
    startAnimation();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopAnimation();
    observer.disconnect();
  });
})();
