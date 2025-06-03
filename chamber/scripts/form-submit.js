// Fix form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('join-form');
  const submitBtn = document.querySelector('.submit-btn');
  
  if (form && submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Make all form pages visible temporarily for validation
      const formPages = document.querySelectorAll('.form-page');
      formPages.forEach(page => {
        page.style.display = 'block';
        page.style.opacity = '1';
      });
      
      // Check form validity
      if (form.checkValidity()) {
        form.submit();
      } else {
        // Show the first page with invalid fields
        formPages.forEach(page => {
          page.style.display = 'none';
          page.classList.remove('active');
        });
        
        // Find the first page with invalid fields
        for (let i = 0; i < formPages.length; i++) {
          const inputs = formPages[i].querySelectorAll('input, select, textarea');
          let hasInvalid = false;
          
          inputs.forEach(input => {
            if (!input.checkValidity()) {
              hasInvalid = true;
            }
          });
          
          if (hasInvalid) {
            formPages[i].style.display = 'block';
            formPages[i].classList.add('active');
            
            // Update progress steps
            const progressSteps = document.querySelectorAll('.progress-step');
            progressSteps.forEach((step, index) => {
              if (index === i) {
                step.classList.add('active');
              } else if (index < i) {
                step.classList.add('completed');
                step.classList.remove('active');
              } else {
                step.classList.remove('active', 'completed');
              }
            });
            
            break;
          }
        }
      }
    });
  }
});