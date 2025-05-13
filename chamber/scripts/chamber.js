const harmBurger = document.querySelector('.menubutton');
const menu = document.querySelector('.navlinks');

harmBurger.addEventListener('click', () => {
  menu.classList.toggle('open');
  harmBurger.classList.toggle('open');
});