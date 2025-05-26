// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Toggle mobile menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const primaryNav = document.getElementById('primary-nav');
    
    hamburgerBtn.addEventListener('click', () => {
        primaryNav.classList.toggle('open');
    });

    // Update copyright year and last modified date
    const currentYearElement = document.getElementById('current-year');
    const lastUpdatedElement = document.getElementById('last-updated');
    
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = document.lastModified;
    }
});