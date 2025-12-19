document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  const nav = document.querySelector('#main-nav');

  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let headerHeight = 0;

  function updateHeaderOffset() {
    const existingSpacer = document.getElementById('header-spacer');
    if (existingSpacer) {
      existingSpacer.remove();
    }

    headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-offset', `${headerHeight}px`);
  }

  function updateHeaderState() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 10) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }

    const navOpen = nav && nav.classList.contains('nav-open');

    if (navOpen || currentScrollY <= headerHeight) {
      header.classList.remove('header-hidden');
    } else if (currentScrollY > lastScrollY) {
      header.classList.add('header-hidden');
    } else if (currentScrollY < lastScrollY) {
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  updateHeaderOffset();
  updateHeaderState();

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function() {
    updateHeaderOffset();
  });

  window.addEventListener('orientationchange', function() {
    setTimeout(updateHeaderOffset, 100);
  });
});
