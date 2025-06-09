// Common JavaScript for all pages

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Set last updated date in footer
document.getElementById('last-updated').textContent = document.lastModified;

// Add hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const primaryNav = document.getElementById('primary-nav');
  
  if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener('click', function() {
      primaryNav.classList.toggle('open');
      const expanded = primaryNav.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', expanded);
    });
  }
  
  // Set secure cookie attributes
  document.cookie = "SameSite=Strict; Secure";
});

// Add security headers via JavaScript as a fallback
function addSecurityHeaders() {
  try {
    // Check if headers are already set via meta tags
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; frame-src https://www.google.com; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;");
      document.head.appendChild(cspMeta);
    }
  } catch (e) {
    // Silent fail
  }
}

// Call the function to ensure headers are set
addSecurityHeaders();