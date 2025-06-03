// Inline script to be added directly to the HTML file
document.write(`
<script>
  // Ultra simple hamburger menu fix - inline version
  window.onload = function() {
    // Get elements
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var primaryNav = document.getElementById('primary-nav');
    
    // Add click event directly
    if (hamburgerBtn && primaryNav) {
      hamburgerBtn.onclick = function() {
        primaryNav.classList.toggle('open');
        console.log('Menu toggled');
        return false; // Prevent default
      };
    }
  };
</script>
`);