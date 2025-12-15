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
  let mouse = { x: null, y: null, radius: 180 };

  // Configuration
  const config = {
    particleCount: 80,
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

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
      
      // Interpolate color based on highlight
      const alpha = 0.55 + this.highlightFactor * 0.4;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // Use highlight color when highlighted
      if (this.highlightFactor > 0.1) {
        ctx.fillStyle = colors.particleHighlight;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 10  + this.highlightFactor * 6;
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
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const colors = getColors();
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          // Base opacity from distance (fade with distance)
          const distanceOpacity = 1 - (distance / config.connectionDistance);
          
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

  // Event listeners
  window.addEventListener('resize', () => {
    resize();
    init();
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

  // Watch for theme changes
  const observer = new MutationObserver(() => {
    // Colors will update automatically on next frame
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Initialize
  resize();
  init();
  animate();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    observer.disconnect();
  });
})();
