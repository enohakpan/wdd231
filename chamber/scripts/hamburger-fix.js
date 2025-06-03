// Ultra simple hamburger menu fix
window.onload = function() {
  // Get elements
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var primaryNav = document.getElementById('primary-nav');
  
  // Add click event directly
  if (hamburgerBtn && primaryNav) {
    hamburgerBtn.onclick = function() {
      if (primaryNav.classList.contains('open')) {
        primaryNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      } else {
        primaryNav.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
      }
      console.log('Menu toggled');
      return false; // Prevent default
    };
  }
};