// Trusted Types policy for safe HTML creation
if (window.trustedTypes && trustedTypes.createPolicy) {
  // Create a policy for HTML sanitization
  const policy = trustedTypes.createPolicy('default', {
    createHTML: (string) => {
      // Basic sanitization - you may want to add more sophisticated sanitization
      return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },
    createScriptURL: (string) => {
      // Only allow URLs from our domain
      if (string.startsWith('/') || string.startsWith(window.location.origin)) {
        return string;
      }
      throw new Error('Invalid script URL');
    }
  });
}

// Helper function to safely set innerHTML
function setInnerHTML(element, html) {
  if (window.trustedTypes && trustedTypes.createPolicy) {
    element.innerHTML = trustedTypes.defaultPolicy.createHTML(html);
  } else {
    // Fallback for browsers that don't support Trusted Types
    element.innerHTML = html;
  }
}

// Helper function to safely create elements with attributes
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