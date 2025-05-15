document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const directoryList = document.getElementById("directory-list")
  const gridViewBtn = document.querySelector(".grid-view")
  const listViewBtn = document.querySelector(".list-view")
  const modal = document.getElementById("company-modal")
  const closeModal = document.querySelector(".close-modal")
  const modalBody = document.querySelector(".modal-body")
  const hamburger = document.querySelector(".hamburger")
  const navList = document.querySelector(".nav-list")

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Set last modified date in footer
  document.getElementById("last-modified").textContent = document.lastModified

  // Initialize directory
  async function initDirectory() {
    try {
      // Fetch the members data from JSON file
      const response = await fetch("data/members.json")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Remove skeleton loading
      directoryList.innerHTML = ""

      // Add class for grid view
      directoryList.classList.add("directory-grid")

      // Render companies
      renderCompanies(data.members)

      // Set up event listeners
      setupEventListeners()
    } catch (error) {
      console.error("Error loading directory data:", error)
      directoryList.innerHTML = `<div class="error-message">
        <p>Sorry, we couldn't load the directory data. Please try again later.</p>
      </div>`
    }
  }

  // Render companies
  function renderCompanies(members) {
    directoryList.innerHTML = ""

    if (members.length === 0) {
      directoryList.innerHTML = '<div class="no-results"><p>No companies found in the directory.</p></div>'
      return
    }

    members.forEach((member) => {
      const memberElement = document.createElement("div")
      memberElement.className = "directory-item"
      memberElement.dataset.id = member.id

      // Get membership level text
      let membershipText = "Member"
      if (member.membership === 2) {
        membershipText = "Silver Member"
      } else if (member.membership === 3) {
        membershipText = "Gold Member"
      }

      memberElement.innerHTML = `
        <div class="directory-item-img">
          <img src="images/${member.image}" alt="${member.name}">
        </div>
        <div class="directory-item-content">
          <h3>${member.name}</h3>
          <p>${member.address}</p>
          <p>${member.phone}</p>
          <p><a href="https://${member.website}" target="_blank">${member.website}</a></p>
          <span class="membership">${membershipText}</span>
        </div>
      `

      directoryList.appendChild(memberElement)
    })
  }

  // Toggle view (grid/list)
  function toggleView(viewType) {
    if (viewType === "grid") {
      directoryList.classList.add("directory-grid")
      directoryList.classList.remove("list-view")
      gridViewBtn.classList.add("active")
      listViewBtn.classList.remove("active")
    } else {
      directoryList.classList.remove("directory-grid")
      directoryList.classList.add("list-view")
      listViewBtn.classList.add("active")
      gridViewBtn.classList.remove("active")
    }
  }

  // Show company details in modal
  async function showCompanyDetails(memberId) {
    try {
      // Fetch the members data from JSON file
      const response = await fetch("data/members.json")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const member = data.members.find((m) => m.id === Number(memberId))

      if (!member) return

      // Get membership level text
      let membershipText = "Member"
      if (member.membership === 2) {
        membershipText = "Silver Member"
      } else if (member.membership === 3) {
        membershipText = "Gold Member"
      }

      modalBody.innerHTML = `
        <div class="company-header">
          <div class="company-logo">
            <img src="images/${member.image}" alt="${member.name} Logo">
          </div>
          <div class="company-title">
            <h2>${member.name}</h2>
            <span class="membership">${membershipText}</span>
          </div>
        </div>
        
        <div class="company-details">
          <div class="company-info">
            <h3>About Us</h3>
            <p>${member.description}</p>
          </div>
          
          <div class="company-contact">
            <h3>Contact Information</h3>
            <ul>
              <li><i class="fas fa-map-marker-alt"></i> ${member.address}</li>
              <li><i class="fas fa-phone"></i> ${member.phone}</li>
              <li><i class="fas fa-globe"></i> <a href="https://${member.website}" target="_blank">${member.website}</a></li>
            </ul>
          </div>
        </div>
      `

      modal.style.display = "block"
      document.body.style.overflow = "hidden"
    } catch (error) {
      console.error("Error loading member details:", error)
    }
  }

  // Close modal
  function closeCompanyModal() {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    navList.classList.toggle("active")

    // Toggle hamburger animation
    const spans = hamburger.querySelectorAll("span")
    if (navList.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
      spans[1].style.opacity = "0"
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
    } else {
      spans[0].style.transform = "none"
      spans[1].style.opacity = "1"
      spans[2].style.transform = "none"
    }
  }

  // Set up event listeners
  function setupEventListeners() {
    // View toggle
    gridViewBtn.addEventListener("click", () => toggleView("grid"))
    listViewBtn.addEventListener("click", () => toggleView("list"))

    // Company details
    directoryList.addEventListener("click", (e) => {
      const directoryItem = e.target.closest(".directory-item")
      if (directoryItem) {
        showCompanyDetails(directoryItem.dataset.id)
      }
    })

    // Close modal
    closeModal.addEventListener("click", closeCompanyModal)
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeCompanyModal()
      }
    })

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        closeCompanyModal()
      }
    })

    // Mobile menu
    hamburger.addEventListener("click", toggleMobileMenu)

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (navList.classList.contains("active") && !e.target.closest(".navbar") && !e.target.closest(".hamburger")) {
        toggleMobileMenu()
      }
    })

    // Close mobile menu when window is resized to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navList.classList.contains("active")) {
        toggleMobileMenu()
      }
    })
  }

  // Initialize the directory
  initDirectory()
})
