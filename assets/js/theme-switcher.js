// Enhanced theme switcher script with system theme detection
document.addEventListener('DOMContentLoaded', function() {
  const lightButton = document.getElementById('light-theme');
  const darkButton = document.getElementById('dark-theme');
  const autoButton = document.getElementById('auto-theme');
  
  // Make sure all buttons exist
  if (!lightButton || !darkButton || !autoButton) {
    return;
  }
  
  // Function to set theme based on selection
  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      darkButton.classList.add('active');
      lightButton.classList.remove('active');
      autoButton.classList.remove('active');
    } else if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      lightButton.classList.add('active');
      darkButton.classList.remove('active');
      autoButton.classList.remove('active');
    } else if (theme === 'auto') {
      autoButton.classList.add('active');
      lightButton.classList.remove('active');
      darkButton.classList.remove('active');
      
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }
  
  // Add listener for system theme changes when in auto mode
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (localStorage.getItem('theme') === 'auto') {
        if (event.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
  }
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'auto';
  
  // Apply the saved theme
  setTheme(savedTheme);
  
  // Direct click handler function
  function handleThemeClick(themeName) {
    setTheme(themeName);
    localStorage.setItem('theme', themeName);
  }
  
  // Light theme button - Add explicit onclick as backup
  lightButton.addEventListener('click', function() {
    handleThemeClick('light');
  });
  lightButton.onclick = function() {
    handleThemeClick('light');
  };
  
  // Dark theme button - Add explicit onclick as backup
  darkButton.addEventListener('click', function() {
    handleThemeClick('dark');
  });
  darkButton.onclick = function() {
    handleThemeClick('dark');
  };
  
  // Auto theme button - Add explicit onclick as backup
  autoButton.addEventListener('click', function() {
    handleThemeClick('auto');
  });
  autoButton.onclick = function() {
    handleThemeClick('auto');
  };
});