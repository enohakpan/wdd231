// Enhanced mobile menu functionality
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const primaryNav = document.getElementById('primary-nav');
  
  if (hamburgerBtn && primaryNav) {
    // Toggle menu on hamburger click
    hamburgerBtn.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
      const isExpanded = primaryNav.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !primaryNav.contains(e.target) && primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
});