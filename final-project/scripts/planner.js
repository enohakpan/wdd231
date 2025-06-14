// Enhanced planner.js - All functionality consolidated
document.addEventListener("DOMContentLoaded", () => {
  const plannerGrid = document.getElementById("plannerGrid")
  let allRecipes = [] // Store all recipes for use in favorites modal

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Meal types
  const mealTypes = ["Breakfast", "Lunch", "Dinner"]

  // Get current day of week
  const currentDay = new Date().toLocaleString("en-us", { weekday: "long" })

  // Initialize all functionality
  initializeFooterElements()
  initializeFavoritesModal()
  initializeRecipeModal()
  initializeContactForm()

  // Create planner structure
  createPlannerHeader()
  createPlannerGrid()

  // Load saved meal plan if exists
  loadSavedMealPlan()

  // Fetch recipes for the recipe selector
  fetch("data/recipes.json")
    .then((response) => response.json())
    .then((recipes) => {
      allRecipes = recipes // Store recipes globally
      createRecipeSelector(recipes)
    })
    .catch((error) => console.error("Error loading recipes:", error))

  // Initialize footer elements
  function initializeFooterElements() {
    // Update copyright year
    const currentYearElement = document.getElementById("currentYear")
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear()
    }

    // Update last modified date
    const lastModifiedElement = document.getElementById("lastModified")
    if (lastModifiedElement) {
      lastModifiedElement.textContent = document.lastModified
    }
  }

  // Get favorites from localStorage
  function getFavorites() {
    const favorites = localStorage.getItem("favorites")
    return favorites ? JSON.parse(favorites) : []
  }

  // Save favorites to localStorage
  function saveFavorite(recipeId) {
    const favorites = getFavorites()
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      return true
    }
    return false
  }

  // Remove from favorites
  function removeFavorite(recipeId) {
    const favorites = getFavorites()
    const index = favorites.indexOf(recipeId)
    if (index !== -1) {
      favorites.splice(index, 1)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      return true
    }
    return false
  }

  // Initialize favorites modal
  function initializeFavoritesModal() {
    const favoritesModal = document.getElementById("favoritesModal")
    if (!favoritesModal) return

    const closeButton = favoritesModal.querySelector(".close-button")

    // Show favorites modal
    function showFavoritesModal() {
      const favorites = getFavorites()
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
      favoritesModal.classList.remove("hidden")
      document.body.style.overflow = "hidden"
    }

    function closeFavoritesModal() {
      favoritesModal.classList.add("hidden")
      document.body.style.overflow = ""
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeFavoritesModal)
    }

    window.addEventListener("click", (event) => {
      if (event.target === favoritesModal) {
        closeFavoritesModal()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !favoritesModal.classList.contains("hidden")) {
        closeFavoritesModal()
      }
    })

    // Make showFavoritesModal globally available
    window.showFavoritesModal = showFavoritesModal
  }

  // Initialize recipe modal
  function initializeRecipeModal() {
    window.showRecipeModal = (recipe) => {
      // Create modal if it doesn't exist
      let modal = document.getElementById("recipeModal")

      if (!modal) {
        modal = document.createElement("div")
        modal.id = "recipeModal"
        modal.className = "modal hidden"

        modal.innerHTML = `
          <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2 id="modalTitle"></h2>
            <img loading="lazy" id="modalImage" src="/placeholder.svg" alt="Recipe image" onerror="this.src='images/recipes/jollof-rice.webp';">
            <h3>Ingredients</h3>
            <ul id="modalIngredients"></ul>
            <h3>Instructions</h3>
            <div id="modalInstructions"></div>
          </div>
        `

        document.body.appendChild(modal)

        // Add event listeners for closing the modal
        const closeBtn = modal.querySelector(".close-button")
        closeBtn.addEventListener("click", () => {
          modal.classList.add("hidden")
          document.body.style.overflow = ""
        })

        window.addEventListener("click", (event) => {
          if (event.target === modal) {
            modal.classList.add("hidden")
            document.body.style.overflow = ""
          }
        })

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            modal.classList.add("hidden")
            document.body.style.overflow = ""
          }
        })
      }

      // Populate modal with recipe data
      document.getElementById("modalTitle").textContent = recipe.name
      document.getElementById("modalImage").src = recipe.image
      document.getElementById("modalImage").alt = recipe.name

      const ingredientsList = document.getElementById("modalIngredients")
      ingredientsList.innerHTML = ""
      recipe.ingredients.forEach((ingredient) => {
        const li = document.createElement("li")
        li.textContent = ingredient
        ingredientsList.appendChild(li)
      })

      document.getElementById("modalInstructions").innerHTML = recipe.steps.map((step) => `<p>${step}</p>`).join("")

      // Show modal
      modal.classList.remove("hidden")
      document.body.style.overflow = "hidden"
    }
  }

  // Show meal selection modal
  function showMealSelectionModal(recipe) {
    const mealSelectionModal = document.createElement("div")
    mealSelectionModal.className = "modal meal-selection-modal"
    mealSelectionModal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Select Day and Meal</h2>
        <div class="meal-selection-form">
          <div class="form-group">
            <label for="day-select">Day:</label>
            <select id="day-select">
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div class="form-group">
            <label for="meal-select">Meal:</label>
            <select id="meal-select">
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
          <button class="btn btn-save">Add to Plan</button>
        </div>
      </div>
    `

    document.body.appendChild(mealSelectionModal)

    // Close button functionality
    const closeBtn = mealSelectionModal.querySelector(".close-button")
    closeBtn.addEventListener("click", () => {
      mealSelectionModal.remove()
    })

    // Add to plan button functionality
    const addBtn = mealSelectionModal.querySelector(".btn-save")
    addBtn.addEventListener("click", () => {
      const day = document.getElementById("day-select").value
      const mealType = document.getElementById("meal-select").value

      // Find the target drop zone
      const dropZone = document.querySelector(`.drop-zone[data-day="${day}"][data-meal-type="${mealType}"]`)

      if (dropZone) {
        // Add the recipe to the planner
        dropZone.innerHTML = `
          <div class="planned-recipe">
            <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';">
            <h4>${recipe.name}</h4>
            <button class="remove-recipe-btn" title="Remove recipe">×</button>
            <span class="recipe-id" style="display:none;">${recipe.id}</span>
          </div>
        `

        // Add remove button functionality
        dropZone.querySelector(".remove-recipe-btn").addEventListener("click", (e) => {
          e.stopPropagation()
          dropZone.innerHTML = `<div class="placeholder">Click to add ${mealType}</div>`
        })

        // Add animation
        dropZone.querySelector(".planned-recipe").classList.add("pop-in")
      }

      // Remove the modal
      mealSelectionModal.remove()

      // Show confirmation toast
      showToast(`Added ${recipe.name} to ${day} ${mealType}!`)
    })
  }

  // Initialize contact form
  function initializeContactForm() {
    let currentStep = 1
    const totalSteps = 3

    // Mobile contact button
    const mobileBtn = document.querySelector(".mobile-contact-btn")
    const modal = document.querySelector(".contact-form-modal")
    const closeBtn = document.querySelector(".modal-close-btn")

    if (mobileBtn && modal) {
      mobileBtn.addEventListener("click", () => {
        modal.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active")
        document.body.style.overflow = ""
      })
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
    }

    // Add event listeners for form navigation
    document.addEventListener("click", handleFormNavigation)
    document.addEventListener("input", handleFormInput)

    function handleFormNavigation(e) {
      if (e.target.classList.contains("btn-next")) {
        e.preventDefault()
        if (validateCurrentStep()) {
          nextStep()
        }
      } else if (e.target.classList.contains("btn-back")) {
        e.preventDefault()
        prevStep()
      } else if (e.target.classList.contains("btn-submit")) {
        e.preventDefault()
        if (validateCurrentStep()) {
          submitForm()
        }
      }
    }

    function handleFormInput(e) {
      if (e.target.tagName === "TEXTAREA") {
        updateCharCount(e.target)
      }
    }

    function showStep(step) {
      // Hide all steps
      document.querySelectorAll(".contact-form-step").forEach((stepEl) => {
        stepEl.classList.remove("active")
      })

      // Show current step
      const currentStepEl = document.querySelector(`#step-${step}`)
      const mobileStepEl = document.querySelector(`#mobile-step-${step}`)

      if (currentStepEl) {
        currentStepEl.classList.add("active")
      }
      if (mobileStepEl) {
        mobileStepEl.classList.add("active")
      }

      currentStep = step
      updateProgress()
    }

    function nextStep() {
      if (currentStep < totalSteps) {
        showStep(currentStep + 1)
      }
    }

    function prevStep() {
      if (currentStep > 1) {
        showStep(currentStep - 1)
      }
    }

    function updateProgress() {
      document.querySelectorAll(".progress-dot").forEach((dot, index) => {
        if (index < currentStep) {
          dot.classList.add("active")
        } else {
          dot.classList.remove("active")
        }
      })
    }

    function validateCurrentStep() {
      const currentStepEl = document.querySelector(`#step-${currentStep}`)
      const mobileStepEl = document.querySelector(`#mobile-step-${currentStep}`)

      let requiredFields = []
      if (currentStepEl) {
        requiredFields = [...requiredFields, ...currentStepEl.querySelectorAll("[required]")]
      }
      if (mobileStepEl) {
        requiredFields = [...requiredFields, ...mobileStepEl.querySelectorAll("[required]")]
      }

      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.style.borderColor = "#ff4444"
          isValid = false
        } else {
          field.style.borderColor = "rgba(255, 255, 255, 0.3)"
        }
      })

      return isValid
    }

    function updateCharCount(textarea) {
      const maxLength = textarea.getAttribute("maxlength")
      const currentLength = textarea.value.length
      const charCountEl = textarea.parentNode.querySelector(".char-count")

      if (charCountEl && maxLength) {
        charCountEl.textContent = `${currentLength}/${maxLength}`
      }
    }

    function submitForm() {
      // Show loading state
      const submitBtns = document.querySelectorAll(".btn-submit")
      submitBtns.forEach((btn) => {
        btn.textContent = "Sending..."
        btn.disabled = true
      })

      // Simulate form submission
      setTimeout(() => {
        showSuccessMessage()
        resetForm()
        submitBtns.forEach((btn) => {
          btn.textContent = "Send Message"
          btn.disabled = false
        })
      }, 2000)
    }

    function showSuccessMessage() {
      const formContainers = document.querySelectorAll(".footer-contact-form, .contact-form-modal-content")

      const successHTML = `
        <div class="form-success">
          <i class="fas fa-check-circle"></i>
          <h4>Message Sent Successfully!</h4>
          <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
          <button class="form-btn btn-next" onclick="location.reload()" style="margin-top: 1rem;">Send Another Message</button>
        </div>
      `

      formContainers.forEach((container) => {
        if (container) {
          container.innerHTML = successHTML
        }
      })
    }

    function resetForm() {
      currentStep = 1
      document
        .querySelectorAll(".contact-form-step input, .contact-form-step textarea, .contact-form-step select")
        .forEach((field) => {
          field.value = ""
          field.style.borderColor = "rgba(255, 255, 255, 0.3)"
        })

      const checkboxes = document.querySelectorAll("#newsletter-signup, #mobile-newsletter-signup")
      checkboxes.forEach((checkbox) => {
        if (checkbox) checkbox.checked = false
      })

      showStep(1)
    }

    // Initialize form
    showStep(1)
    updateProgress()
  }

  // Create planner header with action buttons
  function createPlannerHeader() {
    const plannerSection = document.querySelector(".meal-planner")
    const plannerTitle = plannerSection.querySelector("h2")

    // Create header container
    const headerContainer = document.createElement("div")
    headerContainer.className = "planner-header"

    // Create week selector with current date
    const weekSelector = document.createElement("div")
    weekSelector.className = "week-selector"

    // Get current date and format it properly
    const currentDate = new Date()
    const mondayDate = getMonday(new Date(currentDate))
    const formattedDate = mondayDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    weekSelector.innerHTML = `
      <h3>Week of ${formattedDate}</h3>
    `

    // Create action buttons
    const actionButtons = document.createElement("div")
    actionButtons.className = "planner-actions"

    actionButtons.innerHTML = `
      <button class="btn btn-favorites">
        <i class="fas fa-heart"></i> Favorites
      </button>
      <button class="btn btn-save">
        <i class="fas fa-save"></i> Save Plan
      </button>
      <button class="btn btn-clear">
        <i class="fas fa-trash-alt"></i> Clear All
      </button>
      <button class="btn btn-print">
        <i class="fas fa-print"></i> Print
      </button>
    `

    // Insert header elements
    headerContainer.appendChild(weekSelector)
    headerContainer.appendChild(actionButtons)

    // Insert header after the title
    plannerSection.insertBefore(headerContainer, plannerTitle.nextSibling)

    // Add event listeners to buttons
    const saveBtn = actionButtons.querySelector(".btn-save")
    saveBtn.addEventListener("click", saveMealPlan)

    const clearBtn = actionButtons.querySelector(".btn-clear")
    clearBtn.addEventListener("click", clearMealPlan)

    const printBtn = actionButtons.querySelector(".btn-print")
    printBtn.addEventListener("click", printMealPlan)

    const favoritesBtn = actionButtons.querySelector(".btn-favorites")
    favoritesBtn.addEventListener("click", () => {
      window.showFavoritesModal()
    })
  }

  // Create the weekly planner grid
  function createPlannerGrid() {
    // Create header row
    const headerRow = document.createElement("div")
    headerRow.className = "planner-row header-row"

    // Empty cell for the corner
    const cornerCell = document.createElement("div")
    cornerCell.className = "planner-cell corner-cell"
    cornerCell.innerHTML = '<i class="fas fa-utensils"></i>'
    headerRow.appendChild(cornerCell)

    // Add day headers
    days.forEach((day) => {
      const dayCell = document.createElement("div")
      dayCell.className = "planner-cell day-cell"

      // Highlight current day
      if (day === currentDay) {
        dayCell.classList.add("current-day")
      }

      dayCell.textContent = day
      headerRow.appendChild(dayCell)
    })

    plannerGrid.appendChild(headerRow)

    // Create rows for each meal type
    mealTypes.forEach((mealType) => {
      const row = document.createElement("div")
      row.className = "planner-row"

      // Meal type cell
      const typeCell = document.createElement("div")
      typeCell.className = "planner-cell meal-type-cell"
      typeCell.dataset.mealType = mealType

      // Add meal type icon
      let mealIcon = "coffee"
      if (mealType === "Lunch") mealIcon = "hamburger"
      if (mealType === "Dinner") mealIcon = "utensils"

      typeCell.innerHTML = `<i class="fas fa-${mealIcon}"></i> ${mealType}`
      row.appendChild(typeCell)

      // Create drop zones for each day
      days.forEach((day) => {
        const dropZone = document.createElement("div")
        dropZone.className = "planner-cell drop-zone"
        dropZone.dataset.day = day
        dropZone.dataset.mealType = mealType

        // Add placeholder text
        dropZone.innerHTML = `<div class="placeholder">Click to add ${mealType}</div>`

        // Add click event to open recipe selector
        dropZone.addEventListener("click", () => {
          const selector = document.getElementById("recipeSelectorModal")
          if (selector) {
            selector.classList.remove("hidden")
            selector.dataset.targetDay = day
            selector.dataset.targetMealType = mealType
            document.body.style.overflow = "hidden"

            // Focus on search input
            setTimeout(() => {
              selector.querySelector("#recipeSelectorSearch").focus()
            }, 300)
          }
        })

        row.appendChild(dropZone)
      })

      plannerGrid.appendChild(row)
    })

    // Add animation class to rows with delay
    const rows = document.querySelectorAll(".planner-row")
    rows.forEach((row, index) => {
      setTimeout(
        () => {
          row.classList.add("fade-in")
        },
        100 + index * 100,
      )
    })
  }

  // Create recipe selector modal
  function createRecipeSelector(recipes) {
    const modal = document.createElement("div")
    modal.id = "recipeSelectorModal"
    modal.className = "modal recipe-selector-modal hidden"

    const modalContent = document.createElement("div")
    modalContent.className = "modal-content recipe-selector-content"

    modalContent.innerHTML = `
      <span class="close-button">&times;</span>
      <h2>Select a Recipe</h2>
      <input type="text" id="recipeSelectorSearch" placeholder="Search recipes..." class="recipe-search">
      <div class="recipe-selector-grid"></div>
    `

    modal.appendChild(modalContent)
    document.body.appendChild(modal)

    // Add recipes to the selector
    const selectorGrid = modalContent.querySelector(".recipe-selector-grid")
    recipes.forEach((recipe) => {
      const recipeItem = document.createElement("div")
      recipeItem.className = "recipe-selector-item"

      recipeItem.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';">
        <h4>${recipe.name}</h4>
      `

      recipeItem.addEventListener("click", () => {
        const targetDay = modal.dataset.targetDay
        const targetMealType = modal.dataset.targetMealType

        // Find the target drop zone
        const dropZone = document.querySelector(
          `.drop-zone[data-day="${targetDay}"][data-meal-type="${targetMealType}"]`,
        )

        if (dropZone) {
          // Add the recipe to the planner
          dropZone.innerHTML = `
            <div class="planned-recipe">
              <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';">
              <h4>${recipe.name}</h4>
              <button class="remove-recipe-btn">×</button>
              <span class="recipe-id" style="display:none;">${recipe.id}</span>
            </div>
          `

          // Add remove button functionality
          dropZone.querySelector(".remove-recipe-btn").addEventListener("click", (e) => {
            e.stopPropagation()
            dropZone.innerHTML = `<div class="placeholder">Click to add ${targetMealType}</div>`
          })

          // Add animation
          dropZone.querySelector(".planned-recipe").classList.add("pop-in")
        }

        // Close the modal
        closeRecipeSelector()
      })

      selectorGrid.appendChild(recipeItem)
    })

    // Add search functionality
    const searchInput = modalContent.querySelector("#recipeSelectorSearch")
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase()

      selectorGrid.querySelectorAll(".recipe-selector-item").forEach((item) => {
        const recipeName = item.querySelector("h4").textContent.toLowerCase()

        if (recipeName.includes(searchTerm)) {
          item.style.display = ""
        } else {
          item.style.display = "none"
        }
      })
    })

    // Add close button functionality
    const closeBtn = modalContent.querySelector(".close-button")
    closeBtn.addEventListener("click", closeRecipeSelector)

    // Close when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeRecipeSelector()
      }
    })

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeRecipeSelector()
      }
    })
  }

  // Function to close recipe selector
  function closeRecipeSelector() {
    const modal = document.getElementById("recipeSelectorModal")
    if (modal) {
      modal.classList.add("hidden")
      document.body.style.overflow = ""
    }
  }

  // Save meal plan to localStorage
  function saveMealPlan() {
    const mealPlan = {}

    document.querySelectorAll(".drop-zone").forEach((dropZone) => {
      const day = dropZone.dataset.day
      const mealType = dropZone.dataset.mealType
      const recipeElement = dropZone.querySelector(".planned-recipe")

      if (!mealPlan[day]) {
        mealPlan[day] = {}
      }

      if (recipeElement) {
        const recipeIdElement = recipeElement.querySelector(".recipe-id")
        const recipeId = recipeIdElement ? Number.parseInt(recipeIdElement.textContent) : null
        const recipeName = recipeElement.querySelector("h4").textContent
        const recipeImage = recipeElement.querySelector("img").src

        mealPlan[day][mealType] = {
          id: recipeId,
          name: recipeName,
          image: recipeImage,
        }
      } else {
        mealPlan[day][mealType] = null
      }
    })

    localStorage.setItem("mealPlan", JSON.stringify(mealPlan))

    // Show confirmation
    showToast("Meal plan saved successfully!")
  }

  // Load saved meal plan from localStorage
  function loadSavedMealPlan() {
    const savedPlan = localStorage.getItem("mealPlan")
    if (!savedPlan) return

    try {
      const mealPlan = JSON.parse(savedPlan)

      // Populate the planner with saved meals
      Object.keys(mealPlan).forEach((day) => {
        Object.keys(mealPlan[day]).forEach((mealType) => {
          const recipe = mealPlan[day][mealType]
          if (recipe) {
            const dropZone = document.querySelector(`.drop-zone[data-day="${day}"][data-meal-type="${mealType}"]`)

            if (dropZone) {
              dropZone.innerHTML = `
                <div class="planned-recipe">
                  <img src="${recipe.image}" alt="${recipe.name}" onerror="this.src='images/recipes/jollof-rice.webp';">
                  <h4>${recipe.name}</h4>
                  <button class="remove-recipe-btn" title="Remove recipe">×</button>
                  <span class="recipe-id" style="display:none;">${recipe.id || ""}</span>
                </div>
              `

              // Add remove button functionality
              dropZone.querySelector(".remove-recipe-btn").addEventListener("click", (e) => {
                e.stopPropagation()
                dropZone.innerHTML = `<div class="placeholder">Click to add ${mealType}</div>`
              })

              // Add animation
              dropZone.querySelector(".planned-recipe").classList.add("pop-in")
            }
          }
        })
      })
    } catch (error) {
      console.error("Error loading saved meal plan:", error)
    }
  }

  // Clear all planned meals
  function clearMealPlan() {
    // Confirm before clearing
    if (!confirm("Are you sure you want to clear all planned meals?")) {
      return
    }

    document.querySelectorAll(".drop-zone").forEach((dropZone) => {
      const mealType = dropZone.dataset.mealType
      dropZone.innerHTML = `<div class="placeholder">Click to add ${mealType}</div>`
    })

    // Clear from localStorage
    localStorage.removeItem("mealPlan")

    // Show confirmation
    showToast("Meal plan cleared!")
  }

  // Print meal plan
  function printMealPlan() {
    window.print()
  }

  // Show toast notification
  function showToast(message) {
    // Remove any existing toasts
    const existingToast = document.querySelector(".toast")
    if (existingToast) {
      existingToast.remove()
    }

    // Create toast element
    const toast = document.createElement("div")
    toast.className = "toast"
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`
    document.body.appendChild(toast)

    // Show toast
    setTimeout(() => {
      toast.classList.add("show")
    }, 100)

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 3000)
  }

  // Helper function to get Monday of current week
  function getMonday(date) {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
    return new Date(d.setDate(diff))
  }
})
