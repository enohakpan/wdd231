// Update copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Update last modified date
document.getElementById('lastModified').textContent = document.lastModified;

// Make showFavoritesModal globally available
window.showFavoritesModal = function () {
  const favoritesModal = document.getElementById('favoritesModal');
  if (favoritesModal) {
    favoritesModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    loadFavorites();
  }
}; 