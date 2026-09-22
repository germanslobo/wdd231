// Menú hamburguesa y fechas del pie de página
const menuBtn = document.getElementById('menu-btn');
const navBar = document.getElementById('nav-bar');

if (menuBtn && navBar) {
  menuBtn.addEventListener('click', () => {
    navBar.classList.toggle('open');
  });
}

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

// Rellenar automáticamente el campo oculto de la marca de tiempo (Timestamp)
const timestampField = document.getElementById('timestamp');
if (timestampField) {
  timestampField.value = new Date().toISOString();
}

// Funcionalidad de las ventanas modales (<dialog>)
const modalButtons = document.querySelectorAll('.modal-btn');
modalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    }
  });
});

const closeButtons = document.querySelectorAll('.close-modal');
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const dialog = button.closest('dialog');
    if (dialog) {
      dialog.close();
    }
  });
});