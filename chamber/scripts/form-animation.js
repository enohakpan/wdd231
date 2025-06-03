// Form animations for join.html

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const progressSteps = document.querySelectorAll('.progress-step');
    const formPages = document.querySelectorAll('.form-page');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    
    // Add animation to membership cards
    const membershipCards = document.querySelectorAll('.membership-card');
    membershipCards.forEach((card, index) => {
        // Add staggered animation delay
        setTimeout(() => {
            card.classList.add('show');
        }, 200 * index);
    });
    
    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find current active page
            const currentPage = document.querySelector('.form-page.active');
            const currentIndex = Array.from(formPages).indexOf(currentPage);
            const nextIndex = currentIndex + 1;
            
            if (nextIndex < formPages.length) {
                // Update progress steps
                progressSteps[currentIndex].classList.add('completed');
                progressSteps[nextIndex].classList.add('active');
                
                // Animate page transition
                currentPage.classList.remove('active');
                formPages[nextIndex].classList.add('active');
            }
        });
    });
    
    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find current active page
            const currentPage = document.querySelector('.form-page.active');
            const currentIndex = Array.from(formPages).indexOf(currentPage);
            const prevIndex = currentIndex - 1;
            
            if (prevIndex >= 0) {
                // Update progress steps
                progressSteps[currentIndex].classList.remove('active');
                progressSteps[prevIndex].classList.remove('completed');
                progressSteps[prevIndex].classList.add('active');
                
                // Animate page transition
                currentPage.classList.remove('active');
                formPages[prevIndex].classList.add('active');
            }
        });
    });
});