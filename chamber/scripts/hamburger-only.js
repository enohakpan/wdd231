// Hamburger menu only - no other functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get hamburger button and navigation menu
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var primaryNav = document.getElementById('primary-nav');
  
  // Add click event to hamburger button
  if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener('click', function(event) {
      // Toggle the open class on the navigation menu
      primaryNav.classList.toggle('open');
      
      // Update aria-expanded attribute
      var isExpanded = primaryNav.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
      
      // Prevent default behavior and stop propagation
      event.preventDefault();
      event.stopPropagation();
    });
  }
});