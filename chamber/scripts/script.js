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


// Set the timestamp when the form loads
document.getElementById('timestamp').value = new Date().toISOString();

// Multi-step form functionality
const formPages = document.querySelectorAll('.form-page');
const nextButtons = document.querySelectorAll('.next-btn');
const prevButtons = document.querySelectorAll('.prev-btn');
const progressSteps = document.querySelectorAll('.progress-step');

// Next button functionality
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentPage = button.closest('.form-page');
        const currentIndex = Array.from(formPages).indexOf(currentPage);

        // Validate current page fields
        const inputs = currentPage.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                isValid = false;
            }
        });

        if (isValid) {
            // Move to next page
            currentPage.classList.remove('active');
            formPages[currentIndex + 1].classList.add('active');

            // Update progress steps
            progressSteps[currentIndex].classList.add('completed');
            progressSteps[currentIndex + 1].classList.add('active');
        }
    });
});

// Previous button functionality
prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        const currentPage = button.closest('.form-page');
        const currentIndex = Array.from(formPages).indexOf(currentPage);

        // Move to previous page
        currentPage.classList.remove('active');
        formPages[currentIndex - 1].classList.add('active');

        // Update progress steps
        progressSteps[currentIndex].classList.remove('active');
        progressSteps[currentIndex - 1].classList.add('active');
    });
});

// Modal functionality
const modals = document.querySelectorAll('.modal');
const modalLinks = document.querySelectorAll('.info-btn');
const closeButtons = document.querySelectorAll('.close-modal');

modalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = link.getAttribute('href');
        document.querySelector(modalId).style.display = 'block';
    });
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Animation for membership cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.membership-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('show');
        }, 200 * index);
    });
});
