// Import the items of interest data
import { itemsOfInterest } from '../data/discover.mjs';

// ============================================
// 1. POPULATE THE CARDS
// ============================================
function createCard(item, index) {
  const card = document.createElement('article');
  card.classList.add('discover-card');
  // Each card gets a unique grid-area class based on its index (1-8)
  card.classList.add(`card-${index + 1}`);

  card.innerHTML = `
    <h2>${item.name}</h2>
    <figure>
      <img src="images/${item.image}" 
           alt="${item.name}" 
           width="300" 
           height="200" 
           loading="lazy">
    </figure>
    <address>${item.address}</address>
    <p>${item.description}</p>
    <button type="button" class="learn-more-btn" aria-label="Learn more about ${item.name}">
      Learn More
    </button>
  `;

  return card;
}

function displayCards() {
  const grid = document.getElementById('discover-grid');
  if (!grid) return;

  itemsOfInterest.forEach((item, index) => {
    grid.appendChild(createCard(item, index));
  });
}

// ============================================
// 2. LOCALSTORAGE VISITOR MESSAGE
// ============================================
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
      // More than a day - calculate whole days
      const daysDiff = Math.floor(timeDiff / oneDayMs);
      const dayWord = daysDiff === 1 ? 'day' : 'days';
      message = `You last visited ${daysDiff} ${dayWord} ago.`;
    }
  }

  messageEl.textContent = message;

  // Store current visit date
  localStorage.setItem('lastVisitDate', now.toString());
}

// ============================================
// 3. FOOTER DATES
// ============================================
function setFooterDates() {
  const yearEl = document.getElementById('current-year');
  const modifiedEl = document.getElementById('last-modified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modifiedEl) modifiedEl.textContent = document.lastModified;
}

// ============================================
// 4. MOBILE NAVIGATION
// ============================================
function setupNavigation() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute(
        'aria-expanded',
        nav.classList.contains('open') ? 'true' : 'false'
      );
    });
  }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  displayCards();
  displayVisitorMessage();
  setFooterDates();
  setupNavigation();
});