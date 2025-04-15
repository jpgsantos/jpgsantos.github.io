// Theme switcher script
document.addEventListener('DOMContentLoaded', function() {
  const lightButton = document.getElementById('light-theme');
  const darkButton = document.getElementById('dark-theme');
  
  // Check for saved theme preference
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // Apply the current theme
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    darkButton.classList.add('active');
    lightButton.classList.remove('active');
  } else {
    document.documentElement.removeAttribute('data-theme');
    lightButton.classList.add('active');
    darkButton.classList.remove('active');
  }
  
  // Light theme button
  lightButton.addEventListener('click', function() {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    lightButton.classList.add('active');
    darkButton.classList.remove('active');
    console.log('Light theme activated');
  });
  
  // Dark theme button
  darkButton.addEventListener('click', function() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    darkButton.classList.add('active');
    lightButton.classList.remove('active');
    console.log('Dark theme activated');
  });
});