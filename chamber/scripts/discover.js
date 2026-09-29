// ============================================================
// Import the items of interest data (JSON module)
// ============================================================
import { itemsOfInterest } from '../data/discover.mjs';

// ============================================================
// 1. BUILD THE 8 CARDS
// ============================================================
function createCard(item, index) {
  const card = document.createElement('article');
  card.classList.add('discover-card', `card-${index + 1}`);

  // h2 (title)
  const title = document.createElement('h2');
  title.textContent = item.name;

  // figure + img
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = `images/${item.image}`;
  img.alt = item.name;
  img.width = 300;
  img.height = 200;
  img.loading = 'lazy';
  figure.appendChild(img);

  // address
  const address = document.createElement('address');
  address.textContent = item.address;

  // paragraph (description)
  const description = document.createElement('p');
  description.textContent = item.description;

  // button (learn more)
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('learn-more-btn');
  button.textContent = 'Learn More';
  button.setAttribute('aria-label', `Learn more about ${item.name}`);

  // Assemble the card
  card.appendChild(title);
  card.appendChild(figure);
  card.appendChild(address);
  card.appendChild(description);
  card.appendChild(button);

  return card;
}

function displayCards() {
  const grid = document.getElementById('discover-grid');
  if (!grid) return;

  // Clear any existing content (safety)
  grid.innerHTML = '';

  itemsOfInterest.forEach((item, index) => {
    grid.appendChild(createCard(item, index));
  });
}

// ============================================================
// 2. VISITOR MESSAGE (localStorage)
// ============================================================
function displayVisitorMessage() {
  const messageEl = document.getElementById('visitor-message');
  if (!messageEl) return;

  const lastVisit = localStorage.getItem('lastVisitDate');
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  let message = '';

  if (!lastVisit) {
    // First visit
    message = 'Welcome! Let us know if you have any questions.';
  } else {
    const timeDiff = now - parseInt(lastVisit, 10);

    if (timeDiff < oneDayMs) {
      // Less than a day
      message = 'Back so soon! Awesome!';
    } else {
      const daysDiff = Math.floor(timeDiff / oneDayMs);
      const dayWord = daysDiff === 1 ? 'day' : 'days';
      message = `You last visited ${daysDiff} ${dayWord} ago.`;
    }
  }

  messageEl.textContent = message;

  // Store current visit date
  localStorage.setItem('lastVisitDate', now.toString());
}

// ============================================================
// 3. FOOTER DATES (current year + last modified)
// ============================================================
function setFooterDates() {
  const yearEl = document.getElementById('currentyear');
  const modifiedEl = document.getElementById('lastModified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modifiedEl) modifiedEl.textContent = document.lastModified;
}

// ============================================================
// 4. MOBILE NAVIGATION TOGGLE
// ============================================================
function setupNavigation() {
  const toggle = document.getElementById('menu-btn');
  const nav = document.getElementById('nav-bar');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}

// ============================================================
// INITIALIZE ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  displayCards();
  displayVisitorMessage();
  setFooterDates();
  setupNavigation();
});