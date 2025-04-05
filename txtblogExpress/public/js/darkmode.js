// public/js/darkmode.js
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  
  // Function to set the theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button appearance
    if (theme === 'dark') {
      themeToggleText.textContent = 'Light Mode';
      themeToggleIcon.textContent = '☀️';
      document.body.classList.add('dark-mode');
    } else {
      themeToggleText.textContent = 'Dark Mode';
      themeToggleIcon.textContent = '🌙';
      document.body.classList.remove('dark-mode');
    }
  }
  
  // Initialize theme
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
  
  // Initialize theme on load
  initTheme();
});
