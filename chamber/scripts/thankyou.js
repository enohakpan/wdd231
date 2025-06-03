// Thank you page script
document.addEventListener('DOMContentLoaded', () => {
  // Get URL parameters
  const params = new URLSearchParams(window.location.search);
  const applicationDetails = document.getElementById('application-details');
  
  if (applicationDetails) {
    // Format date from timestamp
    let formattedDate = 'Not available';
    if (params.get('timestamp')) {
      const timestamp = new Date(params.get('timestamp'));
      formattedDate = timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString();
    }
    
    // Display application details
    applicationDetails.innerHTML = `
      <p><strong>First Name:</strong> ${params.get('first-name') || 'Not provided'}</p>
      <p><strong>Last Name:</strong> ${params.get('last-name') || 'Not provided'}</p>
      <p><strong>Email:</strong> ${params.get('email') || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${params.get('phone') || 'Not provided'}</p>
      <p><strong>Business/Organization:</strong> ${params.get('business-name') || 'Not provided'}</p>
      <p><strong>Membership Level:</strong> ${params.get('membership-level') || 'Not provided'}</p>
      <p><strong>Application Date:</strong> ${formattedDate}</p>
    `;
  }
});