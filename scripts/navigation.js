const mainNav = document.getElementById('primary-nav');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  hamburger.classList.toggle('open');
});