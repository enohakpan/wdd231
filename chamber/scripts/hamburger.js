// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var primaryNav = document.getElementById('primary-nav');
  
  if (hamburgerBtn && primaryNav) {
    hamburgerBtn.onclick = function() {
      primaryNav.classList.toggle('open');
      return false;
    };
  }
});