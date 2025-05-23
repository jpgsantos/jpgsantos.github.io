document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  let lastScrollY = 0;
  let ticking = false;
  
  // Create a spacer element with the same height as the header
  function createHeaderSpacer() {
    // Remove any existing spacer to avoid duplicates
    const existingSpacer = document.getElementById('header-spacer');
    if (existingSpacer) {
      existingSpacer.remove();
    }
    
    // Create new spacer with current header height
    const headerHeight = header.offsetHeight;
    const spacer = document.createElement('div');
    spacer.id = 'header-spacer';
    spacer.style.height = headerHeight + 'px';
    spacer.style.width = '100%';
    spacer.style.display = 'block';
    
    // Insert spacer at the beginning of main
    const main = document.querySelector('main');
    main.insertBefore(spacer, main.firstChild);
    
    return headerHeight;
  }
  
  // Create initial spacer
  let headerHeight = createHeaderSpacer();
  
  // Set initial position - always show header at top of page
  header.style.transform = 'translateY(0)';

  // Function to update header position based on scroll
  function updateHeaderPosition() {
    const currentScrollY = window.scrollY;
    
    // Shadow effect when scrolled
    if (currentScrollY > 10) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    // Determine scroll direction
    const scrollingDown = currentScrollY > lastScrollY;
    
    // The key difference - start hiding immediately with any scroll
    if (scrollingDown) {
      // Calculate how much to hide based on scroll distance
      // Make the header move proportionally to scroll distance
      const scrollAmount = currentScrollY - lastScrollY;
      
      // Get current transform position
      let currentY = 0;
      const transform = getComputedStyle(header).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        currentY = matrix.m42;
      }
      
      // Calculate new position (don't hide more than header height)
      const newY = Math.max(-headerHeight, currentY - scrollAmount);
      header.style.transform = `translateY(${newY}px)`;
    } 
    // When scrolling up or at top, show the header
    else if (!scrollingDown || currentScrollY === 0) {
      // Get current transform position
      let currentY = 0;
      const transform = getComputedStyle(header).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        currentY = matrix.m42;
      }
      
      // Calculate amount to show based on scroll
      const scrollAmount = lastScrollY - currentScrollY;
      
      // Calculate new position (don't show more than fully visible)
      const newY = Math.min(0, currentY + scrollAmount);
      header.style.transform = `translateY(${newY}px)`;
    }
    
    // At the very top, always fully show header
    if (currentScrollY === 0) {
      header.style.transform = 'translateY(0)';
    }
    
    // Update last scroll position
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  // Add scroll event listener with requestAnimationFrame for performance
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateHeaderPosition();
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Update spacer on window resize to account for header height changes
  window.addEventListener('resize', function() {
    headerHeight = createHeaderSpacer();
  });
  
  // Also update on orientation change for mobile devices
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      headerHeight = createHeaderSpacer();
    }, 100); // Small delay to ensure correct calculations after orientation change
  });
});