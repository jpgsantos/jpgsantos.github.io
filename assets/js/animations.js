// Consolidated animations for all pages
document.addEventListener('DOMContentLoaded', function() {
  // Note: Typewriter effect has been removed
   
  // Scroll Animations - for all pages
  // Map of page-specific selectors to animate on scroll
  const pageSelectors = {
    'home': '.expertise-card, .project-showcase',
    'about': '.bio-content, .career-goal-card, .timeline-entry',
    'projects': '.project-card, .future-project-card, .project-showcase',
    'cv': '.cv-header-card, .cv-section, .publication-card, .project-mini-card',
    'contact': '.contact-card, .info-card, .cv-showcase'
  };
  
  // Determine current page based on body class or URL
  let currentPage = 'home'; // Default
  const pathname = window.location.pathname;
  
  if (pathname.includes('/about')) {
    currentPage = 'about';
  } else if (pathname.includes('/projects')) {
    currentPage = 'projects';
  } else if (pathname.includes('/cv')) {
    currentPage = 'cv';
  } else if (pathname.includes('/contact')) {
    currentPage = 'contact';
  }
  
  // Get selector for current page, or use a default selector
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
  
  // Set initial styles for animation
  const elementsToAnimate = document.querySelectorAll(selector);
  elementsToAnimate.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  // Listen for scroll events
  window.addEventListener('scroll', animateOnScroll);
  
  // Trigger once on load
  animateOnScroll();
});