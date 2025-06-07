// favorites.js
document.addEventListener("DOMContentLoaded", () => {
  const favoritesGrid = document.getElementById('favoritesGrid');
  
  // Get favorites from localStorage
  function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }
  
  // Remove from favorites
  function removeFavorite(recipeId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(recipeId);
    if (index !== -1) {
      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return true;
    }
    return false;
  }
  
  // Add animation to the heading
  const heading = document.querySelector('.favorites-section h2');
  if (heading) {
    heading.classList.add('animated-heading');
  }
  
  // Get favorite recipe IDs
  const favoriteIds = getFavorites();
  
  // Fetch all recipes
  fetch('data/recipes.json')
    .then(response => response.json())
    .then(data => {
      // Fix image paths based on actual filenames
      data.forEach(recipe => {
        // Fix specific image paths with spelling issues
        if (recipe.image.includes('peppered-chicken')) {
          recipe.image = 'images/recipes/peppered-chichen.jpeg';
        }
        else if (recipe.image.includes('peppered-snails')) {
          recipe.image = 'images/recipes/peppered-snail.jpeg';
        }
        // Fix general .jpg extensions to .jpeg
        else if (recipe.image.includes('.jpg')) {
          recipe.image = recipe.image.replace('.jpg', '.jpeg');
        }
      });
      
      // Filter recipes to only show favorites
      const favoriteRecipes = data.filter(recipe => favoriteIds.includes(recipe.id));
      
      if (favoriteRecipes.length === 0) {
        favoritesGrid.innerHTML = `
          <div class="no-favorites">
            <p>You haven't added any favorites yet.</p>
            <a href="recipes.html" class="browse-btn">Browse Recipes</a>
          </div>
        `;
        return;
      }
      
      // Display favorite recipes
      favoriteRecipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
          <div class="favorite-badge">❤️</div>
          <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';" />
          <h3>${recipe.name}</h3>
          <div class="card-actions">
            <button class="view-btn">View Recipe</button>
            <button class="remove-btn">Remove</button>
          </div>
        `;
        
        // Add event listeners
        card.querySelector('.view-btn').addEventListener('click', () => {
          showRecipeModal(recipe);
        });
        
        card.querySelector('.remove-btn').addEventListener('click', () => {
          // Remove from favorites
          if (removeFavorite(recipe.id)) {
            // Animation for removal
            card.classList.add('fade-out');
            setTimeout(() => {
              card.remove();
              if (favoritesGrid.children.length === 0) {
                favoritesGrid.innerHTML = `
                  <div class="no-favorites">
                    <p>You haven't added any favorites yet.</p>
                    <a href="recipes.html" class="browse-btn">Browse Recipes</a>
                  </div>
                `;
              }
            }, 300);
          }
        });
        
        favoritesGrid.appendChild(card);
      });
      
      // Add animation class to cards
      setTimeout(() => {
        document.querySelectorAll('.recipe-card').forEach(card => {
          card.classList.add('visible');
        });
      }, 100);
    })
    .catch(error => {
      console.error('Error loading recipes:', error);
      favoritesGrid.innerHTML = '<p>Error loading favorites. Please try again later.</p>';
    });
    
  // Show recipe modal function
  function showRecipeModal(recipe) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('recipeModal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'recipeModal';
      modal.className = 'modal hidden';
      
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-button">&times;</span>
          <h2 id="modalTitle"></h2>
          <img id="modalImage" src="" alt="Recipe image" onerror="this.src='images/recipes/jollof-rice.webp';">
          <h3>Ingredients</h3>
          <ul id="modalIngredients"></ul>
          <h3>Instructions</h3>
          <div id="modalInstructions"></div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Add event listeners for closing the modal
      const closeBtn = modal.querySelector('.close-button');
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      });
      
      window.addEventListener('click', event => {
        if (event.target === modal) {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          modal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    }
    
    // Populate modal with recipe data
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
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
});