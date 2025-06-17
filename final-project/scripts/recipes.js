// recipes.js
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('recipeResults');
  let allRecipes = [];
  let currentPage = 1;
  const recipesPerPage = 12;

  // Get favorites from localStorage
  function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  // Save favorites to localStorage
  function saveFavorite(recipeId) {
    const favorites = getFavorites();
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return true;
    }
    return false;
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

  // Fetch all recipes
  fetch('data/recipes.json')
    .then(response => response.json())
    .then(data => {
      allRecipes = data;

      // Fix image paths based on actual filenames
      allRecipes.forEach(recipe => {
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

      displayRecipes(allRecipes);

      // Add animation class after recipes are loaded
      setTimeout(() => {
        document.querySelector('.search-section')?.classList.add('fade-in');
        document.querySelector('.recipe-results')?.classList.add('fade-in');
      }, 100);
    })
    .catch(error => console.error('Error loading recipes:', error));

  // Search functionality with debounce
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.toLowerCase();
      currentPage = 1; // Reset to first page on new search

      if (searchTerm.length === 0) {
        displayRecipes(allRecipes);
        return;
      }

      const filteredRecipes = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
      );

      displayRecipes(filteredRecipes);
    }, 300);
  });

  function showFavoritesModal() {
    const favorites = getFavorites()
    const modal = document.getElementById("favoritesModal")
    const favoritesGrid = document.getElementById("favoritesGrid")

    // Clear previous content
    favoritesGrid.innerHTML = ""

    if (favorites.length === 0) {
      favoritesGrid.innerHTML = '<p class="no-favorites">You haven\'t added any favorites yet.</p>'
    } else {
      // Filter recipes to only show favorites
      const favoriteRecipes = allRecipes.filter((recipe) => favorites.includes(recipe.id))

      favoriteRecipes.forEach((recipe) => {
        const card = document.createElement("div")
        card.className = "favorite-card"

        card.innerHTML = `
          <img loading="lazy" src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';" />
          <h3>${recipe.name}</h3>
          <button class="remove-favorite-btn" data-id="${recipe.id}">Remove</button>
          <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
        `

        // Add event listener to remove button
        card.querySelector(".remove-favorite-btn").addEventListener("click", (e) => {
          const recipeId = Number.parseInt(e.target.dataset.id)
          removeFavorite(recipeId)
          card.classList.add("removing")

          // Remove card with animation
          setTimeout(() => {
            card.remove()

            // Check if there are no more favorites
            if (favoritesGrid.children.length === 0) {
              favoritesGrid.innerHTML = '<p class="no-favorites">You haven\'t added any favorites yet.</p>'
            }

            // Update heart icons in the main recipe list
            document.querySelectorAll(".favorite").forEach((btn) => {
              if (Number.parseInt(btn.dataset.id) === recipeId) {
                btn.classList.remove("active")
                btn.textContent = "🤍"
              }
            })
          }, 300)
        })

        // Add event listener to view recipe button
        card.querySelector(".view-recipe-btn").addEventListener("click", () => {
          const recipeToShow = allRecipes.find((r) => r.id === recipe.id)
          showRecipeModal(recipeToShow)
        })

        favoritesGrid.appendChild(card)
      })
    }

    // Show modal
    modal.classList.remove("hidden")

    // Add event listeners for closing the modal if not already added
    const closeBtn = modal.querySelector(".close-button")
    if (!closeBtn.hasListener) {
      closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden")
      })
      closeBtn.hasListener = true
    }

    // Close modal when clicking outside
    if (!modal.hasListener) {
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.add("hidden")
        }
      })
      modal.hasListener = true
    }
  }

  // Make the showFavoritesModal function globally accessible
  window.showFavoritesModal = showFavoritesModal

  // Display recipes in the results container
  function displayRecipes(recipes) {
    resultsContainer.innerHTML = '';

    if (recipes.length === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No recipes found. Try another search term.</p>';
      return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(recipes.length / recipesPerPage);
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = Math.min(startIndex + recipesPerPage, recipes.length);
    const currentRecipes = recipes.slice(startIndex, endIndex);
    const favorites = getFavorites();

    // Create recipe grid
    const recipeGrid = document.createElement('div');
    recipeGrid.className = 'recipe-grid';

    currentRecipes.forEach((recipe, index) => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.style.animationDelay = `${index * 0.1}s`;

      // Check if recipe is in favorites
      const isFavorite = favorites.includes(recipe.id);
      const favoriteClass = isFavorite ? 'favorite active' : 'favorite';
      const favoriteIcon = isFavorite ? '❤️' : '🤍';

      card.innerHTML = `
        <div class="${favoriteClass}" data-id="${recipe.id}">${favoriteIcon}</div>
        <img loading="lazy" src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';" />
        <h3>${recipe.name}</h3>
        <div class="recipe-overlay">
          <div class="recipe-details">
            <h4>${recipe.name}</h4>
            <p>${recipe.ingredients.length} ingredients</p>
            <button class="view-recipe-btn">View Recipe</button>
          </div>
        </div>
      `;

      // Add favorite toggle functionality
      const favoriteBtn = card.querySelector('.favorite');
      favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const recipeId = parseInt(favoriteBtn.dataset.id);

        if (favoriteBtn.classList.contains('active')) {
          removeFavorite(recipeId);
          favoriteBtn.classList.remove('active');
          favoriteBtn.textContent = '🤍';
        } else {
          saveFavorite(recipeId);
          favoriteBtn.classList.add('active');
          favoriteBtn.textContent = '❤️';
        }
      });

      card.querySelector('.view-recipe-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showRecipeModal(recipe);
      });

      // Make the whole card clickable to view recipe
      card.addEventListener('click', () => {
        showRecipeModal(recipe);
      });

      recipeGrid.appendChild(card);
    });

    resultsContainer.appendChild(recipeGrid);

    // Add pagination controls
    if (totalPages > 1) {
      const paginationControls = document.createElement('div');
      paginationControls.className = 'pagination-controls';

      // Previous button
      if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn prev-btn';
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
          currentPage--;
          displayRecipes(recipes);
          window.scrollTo(0, 0);
        });
        paginationControls.appendChild(prevButton);
      }

      // Page indicator
      const pageIndicator = document.createElement('span');
      pageIndicator.className = 'page-indicator';
      pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
      paginationControls.appendChild(pageIndicator);

      // Next button
      if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn next-btn';
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
          currentPage++;
          displayRecipes(recipes);
          window.scrollTo(0, 0);
        });
        paginationControls.appendChild(nextButton);
      }

      resultsContainer.appendChild(paginationControls);
    }

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
  }

  // Show recipe modal
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
          <img loading="lazy" id="modalImage" src="" alt="Recipe image" onerror="this.src='images/recipes/jollof-rice.webp';">
          <h3>Ingredients</h3>
          <ul id="modalIngredients"></ul>
          <h3>Instructions</h3>
          <div id="modalInstructions"></div>
        </div>
      `;

      document.body.appendChild(modal);
    }

    // Add event listeners for closing the modal
    const closeBtn = modal.querySelector('.close-button');
    closeBtn.onclick = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };

    document.onkeydown = (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };

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
    document.body.style.overflow = 'hidden';
  }
});