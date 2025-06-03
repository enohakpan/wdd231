// Add timestamp to form
document.addEventListener('DOMContentLoaded', () => {
  // Set timestamp when form loads
  const timestampField = document.getElementById('timestamp');
  if (timestampField) {
    const now = new Date();
    timestampField.value = now.toISOString();
  }
});