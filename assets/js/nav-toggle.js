document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#main-nav');
  
  if (!navToggle || !nav) return;
  
  navToggle.addEventListener('click', function() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('nav-open');
  });
  
  // Close nav when clicking outside
  document.addEventListener('click', function(event) {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
    }
  });
  
  // Close nav on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      navToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
    }
  });
});


