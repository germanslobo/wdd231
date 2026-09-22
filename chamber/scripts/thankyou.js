// Menú y pie de página
const menuBtn = document.getElementById('menu-btn');
const navBar = document.getElementById('nav-bar');

if (menuBtn && navBar) {
  menuBtn.addEventListener('click', () => {
    navBar.classList.toggle('open');
  });
}

document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

// Extraer parámetros de la URL mediante URLSearchParams
const currentUrl = window.location.href;
const urlParams = new URLSearchParams(window.location.search);

const firstName = urlParams.get('first') || '';
const lastName = urlParams.get('last') || '';
const email = urlParams.get('email') || '';
const phone = urlParams.get('phone') || '';
const organization = urlParams.get('organization') || '';
const timestamp = urlParams.get('timestamp') || '';

// Mostrar el nombre principal
document.getElementById('display-name').textContent = `${firstName} ${lastName}`;

// Rellenar la lista con los campos requeridos solicitados
const resultsList = document.getElementById('results-list');
resultsList.innerHTML = `
  <li><strong>First Name:</strong> ${firstName}</li>
  <li><strong>Last Name:</strong> ${lastName}</li>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Mobile Phone:</strong> ${phone}</li>
  <li><strong>Business Name:</strong> ${organization}</li>
  <li><strong>Submission Date/Time:</strong> ${new Date(timestamp).toLocaleString()}</li>
`;