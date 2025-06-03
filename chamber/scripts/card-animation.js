// Add animation to membership cards when scrolled into view
document.addEventListener('DOMContentLoaded', function() {
  // Create an intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the section is visible
      if (entry.isIntersecting) {
        // Get all cards in the section
        const cards = entry.target.querySelectorAll('.membership-card');
        
        // Animate each card with a delay
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('animate');
          }, 200 * index);
        });
        
        // Stop observing once animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.2}); // Trigger when 20% of the section is visible
  
  // Start observing the membership benefits section
  const benefitsSection = document.querySelector('.membership-benefits');
  if (benefitsSection) {
    observer.observe(benefitsSection);
  }
});