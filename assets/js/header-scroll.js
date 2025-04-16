document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  const headerHeight = header.offsetHeight;
  let prevScrollY = window.scrollY;
  let ticking = false;

  // Function to update header position
  function updateHeaderPosition() {
    const currentScrollY = window.scrollY;
    
    // For shadow effect when scrolled
    if (currentScrollY > 10) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    // Direction of scroll determines our action
    const scrollingDown = currentScrollY > prevScrollY;
    
    // When near top of page, always show header
    if (currentScrollY < headerHeight) {
      header.style.transform = 'translateY(0)';
    } 
    // When scrolling down, gradually hide header
    else if (scrollingDown) {
      // Calculate how much to hide, capped at 100% of header height
      const translateY = Math.min(headerHeight, currentScrollY - prevScrollY);
      const currentTransform = getComputedStyle(header).transform;
      
      // If already has a transform, extract the Y value
      let currentY = 0;
      if (currentTransform !== 'none') {
        const matrix = new DOMMatrix(currentTransform);
        currentY = matrix.m42; // m42 is the Y translation
      }
      
      // Calculate new position (don't go beyond fully hidden)
      const newY = Math.max(-headerHeight, currentY - translateY);
      header.style.transform = `translateY(${newY}px)`;
    } 
    // When scrolling up, gradually show header
    else {
      // Calculate how much to show, proportional to scroll amount
      const translateY = Math.min(headerHeight, prevScrollY - currentScrollY);
      const currentTransform = getComputedStyle(header).transform;
      
      // If already has a transform, extract the Y value
      let currentY = 0;
      if (currentTransform !== 'none') {
        const matrix = new DOMMatrix(currentTransform);
        currentY = matrix.m42; // m42 is the Y translation
      }
      
      // Calculate new position (don't go beyond fully visible)
      const newY = Math.min(0, currentY + translateY);
      header.style.transform = `translateY(${newY}px)`;
    }
    
    prevScrollY = currentScrollY;
    ticking = false;
  }
  
  // Throttle scroll events with requestAnimationFrame for performance
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeaderPosition();
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Initialize header state
  header.style.transform = 'translateY(0)';
});