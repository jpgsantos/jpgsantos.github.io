// Theme Switcher Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Theme options
  const themeOptions = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
  };

  // Check for saved theme preference or use default
  const getTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return themeOptions.SYSTEM; // Default to system preference
  };

  // Function to detect system preference
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? themeOptions.DARK 
      : themeOptions.LIGHT;
  };

  // Apply the selected theme
  const applyTheme = (theme) => {
    // If system preference, determine which theme to actually use
    const themeToApply = theme === themeOptions.SYSTEM 
      ? getSystemTheme() 
      : theme;
    
    if (themeToApply === themeOptions.DARK) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Update active button styling
    updateActiveButton(theme);
  };

  // Save theme preference
  const saveTheme = (theme) => {
    localStorage.setItem('theme', theme);
  };

  // Update active button styling
  const updateActiveButton = (theme) => {
    document.querySelectorAll('.theme-option').forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-theme') === theme) {
        button.classList.add('active');
      }
    });
  };

  // Initialize the theme
  const initTheme = () => {
    const currentTheme = getTheme();
    applyTheme(currentTheme);
  };

  // Create theme switcher UI
  const createThemeSwitcher = () => {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-switch-wrapper';
    
    // Create container
    const container = document.createElement('div');
    container.className = 'theme-switch-container';
    
    // Create the options buttons
    const lightButton = createThemeButton(themeOptions.LIGHT, 'fas fa-sun');
    const darkButton = createThemeButton(themeOptions.DARK, 'fas fa-moon');
    const systemButton = createThemeButton(themeOptions.SYSTEM, 'fas fa-desktop');
    
    // Add buttons to container
    container.appendChild(lightButton);
    container.appendChild(darkButton);
    container.appendChild(systemButton);
    
    // Add container to wrapper
    wrapper.appendChild(container);
    
    // Add to page
    document.body.appendChild(wrapper);
    
    // Update active state
    updateActiveButton(getTheme());
  };

  // Create a theme button
  const createThemeButton = (theme, iconClass) => {
    const button = document.createElement('button');
    button.className = 'theme-option';
    button.setAttribute('data-theme', theme);
    button.setAttribute('title', `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme`);
    
    const icon = document.createElement('i');
    icon.className = iconClass;
    button.appendChild(icon);
    
    // Add click handler
    button.addEventListener('click', () => {
      saveTheme(theme);
      applyTheme(theme);
    });
    
    return button;
  };

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (getTheme() === themeOptions.SYSTEM) {
      applyTheme(themeOptions.SYSTEM);
    }
  });

  // Initialize theme and create switcher
  initTheme();
  createThemeSwitcher();
});