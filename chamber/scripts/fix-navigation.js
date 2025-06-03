// Fix navigation issues
document.addEventListener('DOMContentLoaded', () => {
  // Fix hamburger menu toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const primaryNav = document.getElementById('primary-nav');
  
  if (hamburgerBtn && primaryNav) {
    hamburgerBtn.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
      const isExpanded = primaryNav.classList.contains('open');
      hamburgerBtn.setAttribute('aria-expanded', isExpanded);
    });
  }
  
  // Fix form navigation
  const nextButtons = document.querySelectorAll('.next-btn');
  const prevButtons = document.querySelectorAll('.prev-btn');
  const formPages = document.querySelectorAll('.form-page');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  // Ensure first page is visible
  if (formPages.length > 0 && !document.querySelector('.form-page.active')) {
    formPages[0].classList.add('active');
    if (progressSteps.length > 0) {
      progressSteps[0].classList.add('active');
    }
  }
  
  // Handle next button clicks
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentPage = document.querySelector('.form-page.active');
      if (currentPage) {
        const currentIndex = Array.from(formPages).indexOf(currentPage);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < formPages.length) {
          // Update progress steps
          if (progressSteps[currentIndex]) progressSteps[currentIndex].classList.add('completed');
          if (progressSteps[nextIndex]) progressSteps[nextIndex].classList.add('active');
          
          // Change page
          currentPage.classList.remove('active');
          formPages[nextIndex].classList.add('active');
        }
      }
    });
  });
  
  // Handle previous button clicks
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      const currentPage = document.querySelector('.form-page.active');
      if (currentPage) {
        const currentIndex = Array.from(formPages).indexOf(currentPage);
        const prevIndex = currentIndex - 1;
        
        if (prevIndex >= 0) {
          // Update progress steps
          if (progressSteps[currentIndex]) progressSteps[currentIndex].classList.remove('active');
          if (progressSteps[prevIndex]) {
            progressSteps[prevIndex].classList.remove('completed');
            progressSteps[prevIndex].classList.add('active');
          }
          
          // Change page
          currentPage.classList.remove('active');
          formPages[prevIndex].classList.add('active');
        }
      }
    });
  });
});