// Scroll Reveal Animation using Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  // Elements to reveal on scroll
  const revealElements = document.querySelectorAll('[data-reveal], .card, .project-card, .timeline__entry, .stat-card, .skill-category, .core-value-card, .goal-card, .expertise-card, .contact-card, .publication-card');
  
  // Add initial hidden state
  revealElements.forEach(el => {
    el.classList.add('reveal-hidden');
  });

  // Intersection Observer options
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on element position
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const elementIndex = siblings.indexOf(entry.target);
        const delay = Math.min(elementIndex * 0.08, 0.4); // Cap delay at 0.4s
        
        // Use CSS custom property for reveal delay (doesn't affect theme transitions)
        entry.target.style.setProperty('--reveal-delay', `${delay}s`);
        entry.target.classList.add('reveal-visible');
        entry.target.classList.remove('reveal-hidden');
        
        // Clear the reveal delay after animation completes
        setTimeout(() => {
          entry.target.style.removeProperty('--reveal-delay');
        }, (delay + 0.6) * 1000); // delay + animation duration
        
        // Unobserve after revealing
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements
  revealElements.forEach(el => {
    observer.observe(el);
  });
});
