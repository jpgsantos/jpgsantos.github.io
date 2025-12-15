// Scroll Reveal Animation using Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
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
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on element position
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const elementIndex = siblings.indexOf(entry.target);
        const delay = elementIndex * 0.1;
        
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('reveal-visible');
        entry.target.classList.remove('reveal-hidden');
        
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

