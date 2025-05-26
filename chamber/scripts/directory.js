document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const directoryList = document.getElementById("directory-list");
  const gridViewBtn = document.querySelector(".grid-view");
  const listViewBtn = document.querySelector(".list-view");
  const searchInput = document.getElementById("directory-search");
  const modal = document.getElementById("company-modal");
  const closeModal = document.querySelector(".close-modal");
  const modalBody = document.querySelector(".modal-body");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const primaryNav = document.getElementById("primary-nav");

  // Store all members for filtering
  let allMembers = [];

  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Set last modified date in footer
  document.getElementById("last-updated").textContent = document.lastModified;

  // Initialize directory
  async function initDirectory() {
    try {
      // Fetch the members data from JSON file
      const response = await fetch("data/members.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allMembers = data.members;

      // Remove skeleton loading
      directoryList.innerHTML = "";

      // Add class for grid view
      directoryList.classList.add("directory-grid");

      // Render companies
      renderCompanies(allMembers);

      // Set up event listeners
      setupEventListeners();
    } catch (error) {
      console.error("Error loading directory data:", error);
      directoryList.innerHTML = `<div class="error-message">
        <p>Sorry, we couldn't load the directory data. Please try again later.</p>
      </div>`;
    }
  }

  // Render companies
  function renderCompanies(members) {
    directoryList.innerHTML = "";

    if (members.length === 0) {
      directoryList.innerHTML = '<div class="no-results"><p>No companies found in the directory.</p></div>';
      return;
    }

    members.forEach((member) => {
      const memberElement = document.createElement("div");
      memberElement.className = "directory-item";
      memberElement.dataset.id = member.id;

      // Get membership level text and class
      let membershipText = "Member";
      let membershipClass = "bronze";
      
      if (member.membership === 2) {
        membershipText = "Silver Member";
        membershipClass = "silver";
      } else if (member.membership === 3) {
        membershipText = "Gold Member";
        membershipClass = "gold";
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
          <span class="membership ${membershipClass}">${membershipText}</span>
        </div>
      `;

      directoryList.appendChild(memberElement);
    });
  }

  // Toggle view (grid/list)
  function toggleView(viewType) {
    if (viewType === "grid") {
      directoryList.classList.add("directory-grid");
      directoryList.classList.remove("list-view");
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
    } else {
      directoryList.classList.remove("directory-grid");
      directoryList.classList.add("list-view");
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
    }
  }

  // Filter companies by search term
  function filterCompanies(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    
    if (!searchTerm) {
      renderCompanies(allMembers);
      return;
    }
    
    const filteredMembers = allMembers.filter(member => {
      return (
        member.name.toLowerCase().includes(searchTerm) ||
        member.address.toLowerCase().includes(searchTerm) ||
        member.website.toLowerCase().includes(searchTerm) ||
        (member.description && member.description.toLowerCase().includes(searchTerm))
      );
    });
    
    renderCompanies(filteredMembers);
  }

  // Show company details in modal
  async function showCompanyDetails(memberId) {
    try {
      const member = allMembers.find((m) => m.id === Number(memberId));

      if (!member) return;

      // Get membership level text and class
      let membershipText = "Member";
      let membershipClass = "bronze";
      
      if (member.membership === 2) {
        membershipText = "Silver Member";
        membershipClass = "silver";
      } else if (member.membership === 3) {
        membershipText = "Gold Member";
        membershipClass = "gold";
      }

      modalBody.innerHTML = `
        <div class="company-header">
          <div class="company-logo">
            <img src="images/${member.image}" alt="${member.name} Logo">
          </div>
          <div class="company-title">
            <h2>${member.name}</h2>
            <span class="membership ${membershipClass}">${membershipText}</span>
          </div>
        </div>
        
        <div class="company-details">
          <div class="company-info">
            <h3>About Us</h3>
            <p>${member.description || "No description available."}</p>
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
      `;

      modal.style.display = "block";
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error loading member details:", error);
    }
  }

  // Close modal
  function closeCompanyModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    primaryNav.classList.toggle("open");
  }

  // Set up event listeners
  function setupEventListeners() {
    // View toggle
    gridViewBtn.addEventListener("click", () => toggleView("grid"));
    listViewBtn.addEventListener("click", () => toggleView("list"));

    // Search functionality
    searchInput.addEventListener("input", (e) => {
      filterCompanies(e.target.value);
    });

    // Company details
    directoryList.addEventListener("click", (e) => {
      const directoryItem = e.target.closest(".directory-item");
      if (directoryItem) {
        showCompanyDetails(directoryItem.dataset.id);
      }
    });

    // Close modal
    closeModal.addEventListener("click", closeCompanyModal);
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeCompanyModal();
      }
    });

    // Escape key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        closeCompanyModal();
      }
    });

    // Mobile menu
    hamburgerBtn.addEventListener("click", toggleMobileMenu);
  }

  // Initialize the directory
  initDirectory();
});