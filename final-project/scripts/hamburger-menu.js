document.addEventListener("DOMContentLoaded", () => {
  // Prevent conflicts with other menu scripts
  if (document.querySelector(".hamburger-menu").hasAttribute("data-menu-initialized")) {
    return;
  }
  document.querySelector(".hamburger-menu").setAttribute("data-menu-initialized", "true");

  const hamburger = document.querySelector(".hamburger-menu");
  const nav = document.querySelector(".main-nav");
  const overlay = document.querySelector(".nav-overlay");
  const navLinks = document.querySelectorAll(".main-nav a");
  const body = document.body;

  // Check if elements exist
  if (!hamburger || !nav || !overlay) {
    console.error("Required elements not found");
    return;
  }

  // Toggle menu function
  function toggleMenu() {
    const isActive = nav.classList.contains("active");

    if (isActive) {
      // Close menu
      hamburger.classList.remove("active");
      nav.classList.remove("active");
      overlay.classList.remove("active");
      body.style.overflow = "";
    } else {
      // Open menu
      hamburger.classList.add("active");
      nav.classList.add("active");
      overlay.classList.add("active");
      body.style.overflow = "hidden";
    }
  }

  // Close menu function
  function closeMenu() {
    hamburger.classList.remove("active");
    nav.classList.remove("active");
    overlay.classList.remove("active");
    body.style.overflow = "";
  }

  // Event listeners
  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking overlay
  overlay.addEventListener("click", closeMenu);

  // Close menu when clicking a navigation link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        closeMenu();
      }
    });
  });

  // Close menu on window resize if open and screen becomes large
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && nav.classList.contains("active")) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("active")) {
      closeMenu();
    }
  });

  // Prevent menu from closing when clicking inside the nav
  nav.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});