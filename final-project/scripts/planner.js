// planner.js
document.addEventListener("DOMContentLoaded", () => {
  const plannerGrid = document.getElementById('plannerGrid');
  
  // Days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Meal types
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  
  // Create planner structure
  createPlannerGrid();
  
  // Fetch recipes for the recipe selector
  fetch('data/recipes.json')
    .then(response => response.json())
    .then(recipes => {
      createRecipeSelector(recipes);
    })
    .catch(error => console.error('Error loading recipes:', error));
  
  // Create the weekly planner grid
  function createPlannerGrid() {
    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'planner-row header-row';
    
    // Empty cell for the corner
    const cornerCell = document.createElement('div');
    cornerCell.className = 'planner-cell corner-cell';
    headerRow.appendChild(cornerCell);
    
    // Add day headers
    days.forEach(day => {
      const dayCell = document.createElement('div');
      dayCell.className = 'planner-cell day-cell';
      dayCell.textContent = day;
      headerRow.appendChild(dayCell);
    });
    
    plannerGrid.appendChild(headerRow);
    
    // Create rows for each meal type
    mealTypes.forEach(mealType => {
      const row = document.createElement('div');
      row.className = 'planner-row';
      
      // Meal type cell
      const typeCell = document.createElement('div');
      typeCell.className = 'planner-cell meal-type-cell';
      typeCell.textContent = mealType;
      row.appendChild(typeCell);
      
      // Create drop zones for each day
      days.forEach(day => {
        const dropZone = document.createElement('div');
        dropZone.className = 'planner-cell drop-zone';
        dropZone.dataset.day = day;
        dropZone.dataset.mealType = mealType;
        
        // Add placeholder text
        dropZone.innerHTML = `<div class="placeholder">Click to add ${mealType}</div>`;
        
        // Add click event to open recipe selector
        dropZone.addEventListener('click', () => {
          const selector = document.getElementById('recipeSelectorModal');
          if (selector) {
            selector.classList.remove('hidden');
            selector.dataset.targetDay = day;
            selector.dataset.targetMealType = mealType;
            document.body.style.overflow = 'hidden';
          }
        });
        
        row.appendChild(dropZone);
      });
      
      plannerGrid.appendChild(row);
    });
    
    // Add animation class to rows with delay
    const rows = document.querySelectorAll('.planner-row');
    rows.forEach((row, index) => {
      setTimeout(() => {
        row.classList.add('fade-in');
      }, 100 + (index * 100));
    });
  }
  
  // Create recipe selector modal
  function createRecipeSelector(recipes) {
    const modal = document.createElement('div');
    modal.id = 'recipeSelectorModal';
    modal.className = 'modal recipe-selector-modal hidden';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content recipe-selector-content';
    
    modalContent.innerHTML = `
      <span class="close-button">&times;</span>
      <h2>Select a Recipe</h2>
      <input type="text" id="recipeSelectorSearch" placeholder="Search recipes..." class="recipe-search">
      <div class="recipe-selector-grid"></div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add recipes to the selector
    const selectorGrid = modalContent.querySelector('.recipe-selector-grid');
    recipes.forEach(recipe => {
      const recipeItem = document.createElement('div');
      recipeItem.className = 'recipe-selector-item';
      
      recipeItem.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}">
        <h4>${recipe.name}</h4>
      `;
      
      recipeItem.addEventListener('click', () => {
        const targetDay = modal.dataset.targetDay;
        const targetMealType = modal.dataset.targetMealType;
        
        // Find the target drop zone
        const dropZone = document.querySelector(`.drop-zone[data-day="${targetDay}"][data-meal-type="${targetMealType}"]`);
        
        if (dropZone) {
          // Add the recipe to the planner
          dropZone.innerHTML = `
            <div class="planned-recipe">
              <img src="${recipe.image}" alt="${recipe.name}">
              <h4>${recipe.name}</h4>
              <button class="remove-recipe-btn">×</button>
            </div>
          `;
          
          // Add remove button functionality
          dropZone.querySelector('.remove-recipe-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            dropZone.innerHTML = `<div class="placeholder">Click to add ${targetMealType}</div>`;
          });
          
          // Add animation
          dropZone.querySelector('.planned-recipe').classList.add('pop-in');
        }
        
        // Close the modal
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      });
      
      selectorGrid.appendChild(recipeItem);
    });
    
    // Add search functionality
    const searchInput = modalContent.querySelector('#recipeSelectorSearch');
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      
      selectorGrid.querySelectorAll('.recipe-selector-item').forEach(item => {
        const recipeName = item.querySelector('h4').textContent.toLowerCase();
        
        if (recipeName.includes(searchTerm)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
    
    // Add close button functionality
    const closeBtn = modalContent.querySelector('.close-button');
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    });
    
    // Close when clicking outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  }
});