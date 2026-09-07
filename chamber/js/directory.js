const url = 'data/members.json';
const container = document.getElementById('members-container');
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');
const menuBtn = document.getElementById('menu-btn');
const navBar = document.getElementById('nav-bar');

// Responsive Menu Toggle
menuBtn.addEventListener('click', () => {
  navBar.classList.toggle('open');
});

// Fetch Member Data
async function getMembers() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    displayMembers(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Render Member Cards/List Items
function displayMembers(members) {
  container.innerHTML = '';
  members.forEach((member) => {
    const card = document.createElement('section');
    card.innerHTML = `
      <img src="${member.image}" alt="${member.name} logo" loading="lazy" width="100" height="100">
      <h3>${member.name}</h3>
      <p class="tagline"><em>${member.tagline}</em></p>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <p><a href="${member.website}" target="_blank" rel="noopener">Website</a></p>
    `;
    container.appendChild(card);
  });
}

// Layout Switcher
gridBtn.addEventListener('click', () => {
  container.classList.add('grid-view');
  container.classList.remove('list-view');
  gridBtn.classList.add('active-view');
  listBtn.classList.remove('active-view');
});

listBtn.addEventListener('click', () => {
  container.classList.add('list-view');
  container.classList.remove('grid-view');
  listBtn.classList.add('active-view');
  gridBtn.classList.remove('active-view');
});

// Footer Info
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

// Initialize
getMembers();