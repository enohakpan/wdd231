// Discover page JavaScript

// Initialize Trusted Types policy
if (window.trustedTypes && trustedTypes.createPolicy) {
  trustedTypes.createPolicy('default', {
    createHTML: (string) => string,
    createScriptURL: (string) => string
  });
}

// Function to safely set innerHTML
function setInnerHTML(element, html) {
  if (window.trustedTypes && trustedTypes.createPolicy) {
    element.innerHTML = trustedTypes.defaultPolicy.createHTML(html);
  } else {
    element.innerHTML = html;
  }
}

// Function to display the last visit message
function displayLastVisit() {
  const visitMessage = document.getElementById('visit-message');
  const now = Date.now();
  const lastVisit = localStorage.getItem('lastVisit');
  
  if (!lastVisit) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const daysBetween = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
    
    if (daysBetween < 1) {
      visitMessage.textContent = "Back so soon! Awesome!";
    } else {
      const dayText = daysBetween === 1 ? "day" : "days";
      visitMessage.textContent = `You last visited ${daysBetween} ${dayText} ago.`;
    }
  }
  
  localStorage.setItem('lastVisit', now);
}

// Function to load attractions from JSON
async function loadAttractions() {
  try {
    const response = await fetch('data/attractions.json');
    const data = await response.json();
    displayAttractions(data.attractions);
  } catch (error) {
    const errorMessage = '<p>Unable to load attractions data.</p>';
    setInnerHTML(document.querySelector('.attractions-grid'), errorMessage);
  }
}

// Function to load member companies from JSON
async function loadCompanies() {
  try {
    const response = await fetch('data/members.json');
    const data = await response.json();
    const filteredCompanies = data.members.filter(company => {
      const imageName = company.image.split('/').pop();
      return ['dashfinancial.jpg', 'technova.jpg', 'dashboutique.jpg', 
              'greenharvest.jpg', 'dashdigital.jpg', 'dashautos.jpg', 
              'dashwellness.jpg', 'logo.png'].includes(imageName);
    });
    displayCompanies(filteredCompanies);
  } catch (error) {
    const errorMessage = '<p>Unable to load company data.</p>';
    setInnerHTML(document.querySelector('.companies-grid'), errorMessage);
  }
}

// Function to safely create HTML elements
function createSafeElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  
  // Set attributes safely
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Set text content if provided
  if (textContent) {
    element.textContent = textContent;
  }
  
  return element;
}

// Function to display attractions
function displayAttractions(attractions) {
  const attractionsGrid = document.querySelector('.attractions-grid');
  attractionsGrid.innerHTML = '';
  
  attractions.forEach(attraction => {
    const card = createSafeElement('div', { className: 'attraction-card' });
    
    // Create figure element for the image
    const figure = createSafeElement('figure');
    const img = createSafeElement('img', {
      src: `images/${attraction.image}`,
      alt: attraction.name,
      className: 'attraction-img',
      loading: 'lazy',
      width: '300',
      height: '200'
    });
    
    // Add error handling for images
    img.onerror = function() {
      this.src = 'images/logo.png';
    };
    
    figure.appendChild(img);
    
    // Create content div
    const content = createSafeElement('div', { className: 'attraction-content' });
    
    // Create title
    const title = createSafeElement('h3', {}, attraction.name);
    
    // Create address
    const address = createSafeElement('address', { className: 'attraction-address' }, attraction.address);
    
    // Create description
    const description = createSafeElement('p', { className: 'attraction-description' }, attraction.description);
    
    // Create button
    const button = createSafeElement('button', { className: 'learn-more-btn' }, 'Learn More');
    
    // Append all elements
    content.appendChild(title);
    content.appendChild(address);
    content.appendChild(description);
    content.appendChild(button);
    
    card.appendChild(figure);
    card.appendChild(content);
    
    attractionsGrid.appendChild(card);
  });
}

// Function to display companies
function displayCompanies(companies) {
  const companiesGrid = document.querySelector('.companies-grid');
  companiesGrid.innerHTML = '';
  
  companies.forEach(company => {
    const card = createSafeElement('div', { className: 'company-card' });
    
    // Create figure element for the image
    const figure = createSafeElement('figure');
    const img = createSafeElement('img', {
      src: company.image.replace('../', ''),
      alt: company.name,
      className: 'company-img',
      loading: 'lazy',
      width: '300',
      height: '200'
    });
    
    // Add error handling for images
    img.onerror = function() {
      this.src = 'images/logo.png';
    };
    
    figure.appendChild(img);
    
    // Create content div
    const content = createSafeElement('div', { className: 'company-content' });
    
    // Create title
    const title = createSafeElement('h3', {}, company.name);
    
    // Create address
    const address = createSafeElement('address', { className: 'company-address' }, company.address);
    
    // Create description
    const description = createSafeElement('p', { className: 'company-description' }, company.description);
    
    // Append all elements
    content.appendChild(title);
    content.appendChild(address);
    content.appendChild(description);
    
    card.appendChild(figure);
    card.appendChild(content);
    
    companiesGrid.appendChild(card);
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  displayLastVisit();
  loadAttractions();
  loadCompanies();
});