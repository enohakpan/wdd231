// Get the hamburger button and navigation links
const hamburgerButton = document.querySelector('.menubutton');
const navLinks = document.querySelector('.navlinks');

// Toggle menu when hamburger is clicked
hamburgerButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Optional: Change hamburger icon to X when menu is open
    hamburgerButton.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburgerButton.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburgerButton.classList.remove('open');
    }
});

// Close menu when window is resized to desktop view
window.addEventListener('resize', () => {
    if (window.innerWidth >= 700) {
        navLinks.classList.remove('open');
        hamburgerButton.classList.remove('open');
    }
}); 