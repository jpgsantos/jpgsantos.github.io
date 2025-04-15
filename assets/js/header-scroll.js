// Add this to assets/js/header-scroll.js
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  // Initialize header state
  header.classList.add('header-visible');
  
  function updateHeader() {
    // How much the user has scrolled since last check
    const scrollDelta = window.scrollY - lastScrollY;
    
    // Current scroll position
    const currentScrollY = window.scrollY;
    
    // If we've scrolled down and we're past the header height
    if (currentScrollY > 100) {
      // Add shadow only when not hidden
      header.classList.add('header-scrolled');
      
      // Only hide when scrolling down, not when at the top
      if (scrollDelta > 10) {
        header.classList.remove('header-visible');
        header.classList.add('header-hidden');
      } else if (scrollDelta < -10) {
        // If scrolling up, show the header
        header.classList.remove('header-hidden');
        header.classList.add('header-visible');
      }
    } else {
      // At the top or near top - show header without shadow
      header.classList.remove('header-scrolled');
      header.classList.remove('header-hidden');
      header.classList.add('header-visible');
    }
    
    lastScrollY = window.scrollY;
    ticking = false;
  }
  
  // Event handling with requestAnimationFrame for performance
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true }); // Passive event for performance
});