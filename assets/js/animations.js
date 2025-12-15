// Consolidated animations for all pages
document.addEventListener('DOMContentLoaded', function() {
  // Note: Typewriter effect has been removed
   
  // Scroll Animations - for all pages
  // Map of page-specific selectors to animate on scroll
  const pageSelectors = {
    'home': '.expertise-card, .project-showcase, .card',
    'about': '.bio-content, .career-goal-card, .timeline__entry, .card',
    'projects': '.project-card, .future-project-card, .project-showcase, .card',
    'cv': '.cv-header-card, .cv-section, .publication-card, .project-mini-card, .card',
    'contact': '.contact-card, .info-card, .cv-showcase, .card'
  };
  
  // Use data attribute instead of URL parsing
  const currentPage = document.body.dataset.page || 'home';
  const selector = pageSelectors[currentPage] || '.card, .section';
  
  const animateOnScroll = function() {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // If element is in viewport
      if (elementPosition < windowHeight * 0.85) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    const elementsToAnimate = document.querySelectorAll(selector);
    elementsToAnimate.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
  }
});