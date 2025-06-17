// index.js
document.addEventListener("DOMContentLoaded", () => {
  fetch('data/recipes.json')
    .then(response => response.json())
    .then(data => {
      const container = document.querySelector('#recipeGrid');
      const modal = document.querySelector('#recipeModal');
      const modalContent = modal.querySelector('.modal-content');
      const closeModal = modal.querySelector('.close-button');

      const featured = data.slice(0, 6);
      featured.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.name}" loading="lazy" onerror="this.src='images/recipes/jollof-rice.webp';">
          <h3>${recipe.name}</h3>
        `;
        
        card.addEventListener('click', () => {
          document.getElementById('modalTitle').textContent = recipe.name;
          document.getElementById('modalImage').src = recipe.image;
          document.getElementById('modalImage').alt = recipe.name;
          
          const ingredientsList = document.getElementById('modalIngredients');
          ingredientsList.innerHTML = '';
          recipe.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
          });
          
          document.getElementById('modalInstructions').innerHTML = recipe.steps.map(step => `<p>${step}</p>`).join('');
          
          modal.classList.remove('hidden');
          document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
        
        container.appendChild(card);
      });

      // Add intersection observer for scroll animations
      if ('IntersectionObserver' in window) {
        const cards = document.querySelectorAll('.recipe-card');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
          observer.observe(card);
        });
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.recipe-card').forEach(card => {
          card.classList.add('visible');
        });
      }

      closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
      });

      window.addEventListener('click', event => {
        if (event.target === modal) {
          modal.classList.add('hidden');
          document.body.style.overflow = ''; // Restore scrolling
        }
      });
      
      // Add escape key support for closing modal
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });

      // Add event listeners for navigation buttons
      document.getElementById('exploreRecipesBtn').addEventListener('click', () => {
        window.location.href = 'recipes.html';
      });

      document.getElementById('planMealsBtn').addEventListener('click', () => {
        window.location.href = 'planner.html';
      });
    })
    .catch(error => {
      console.error('Error loading recipes:', error);
    });
});