import { fetchServices, formatPrice } from "./modules/data.js";
import { setStatus, createElement } from "./modules/utils.js";

// ---- Mobile menu ----
const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#primaryNav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

document.querySelector("#year").textContent = new Date().getFullYear();

// ---- Modal ----
const dlg = document.querySelector("#serviceModal");
dlg.querySelector(".modal-close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

function openModal(service) {
  dlg.querySelector("#modalTitle").textContent = service.name;
  dlg.querySelector("#modalBody").innerHTML = `
    <img src="${service.image}" alt="${service.imageAlt}" width="800" height="500" loading="lazy" decoding="async">
    <p>${service.description}</p>
    <p><strong>Category:</strong> ${service.category}</p>
    <p><strong>Price:</strong> ${formatPrice(service.price)}</p>
    <p><strong>Timeline:</strong> ${service.duration}</p>
  `;
  dlg.showModal();
}

// ---- Local Storage (favorites) ----
const STORAGE_KEY = "af_favorites";
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveFavorites(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  saveFavorites(favs);
  return favs.includes(id);
}

// ---- State ----
let allServices = [];
let activeFilter = "All";

// ---- Refs ----
const statusEl = document.querySelector("#servicesStatus");
const gridEl = document.querySelector("#allServices");
const filterBar = document.querySelector("#filterBar");

// ---- Render filters ----
function renderFilters() {
  filterBar.innerHTML = "";
  // unique categories via Set + spread
  const categories = ["All", ...new Set(allServices.map(s => s.category))];
  categories.forEach(cat => {
    const btn = createElement("button", "filter-btn", cat);
    btn.type = "button";
    if (cat === activeFilter) btn.classList.add("active");
    btn.addEventListener("click", () => {
      activeFilter = cat;
      renderFilters();
      renderServices();
    });
    filterBar.appendChild(btn);
  });
}

// ---- Card renderer (with image) ----
function createServiceCard(service) {
  const favs = getFavorites();
  const isFav = favs.includes(service.id);

  const article = document.createElement("article");
  article.className = "service-card";
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `View details for ${service.name}`);

  article.innerHTML = `
    <img src="${service.image}"
         alt="${service.imageAlt}"
         width="800" height="500"
         loading="lazy" decoding="async">
    <div class="service-card-body">
      <h3>
        ${service.name}
        ${service.popular ? '<span class="badge">Popular</span>' : ''}
        <button class="fav-btn" type="button"
                aria-pressed="${isFav}"
                aria-label="${isFav ? 'Remove from' : 'Add to'} favorites"
                data-id="${service.id}">
          ${isFav ? '♥' : '♡'}
        </button>
      </h3>
      <p class="description">${service.description}</p>
      <p class="meta">
        <span class="price">${formatPrice(service.price)}</span> ·
        ${service.duration} · ${service.category}
      </p>
    </div>
  `;

  // Favorite button
  article.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    const nowFav = toggleFavorite(service.id);
    const btn = e.currentTarget;
    btn.setAttribute("aria-pressed", String(nowFav));
    btn.setAttribute("aria-label", `${nowFav ? 'Remove from' : 'Add to'} favorites`);
    btn.textContent = nowFav ? '♥' : '♡';
  });

  // Card click → modal
  article.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) return;
    openModal(service);
  });
  article.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && !e.target.closest(".fav-btn")) {
      e.preventDefault();
      openModal(service);
    }
  });

  return article;
}

// ---- Render services ----
function renderServices() {
  gridEl.innerHTML = "";
  // .filter + .map — array methods
  const visible = allServices
    .filter(s => activeFilter === "All" || s.category === activeFilter)
    .map(s => s);

  if (!visible.length) {
    setStatus(statusEl, "No services match this filter.", "loading");
    return;
  }
  setStatus(statusEl, "", "loading");

  visible.forEach(service => gridEl.appendChild(createServiceCard(service)));
}

// ---- Init ----
async function init() {
  setStatus(statusEl, "Loading services…", "loading");
  try {
    allServices = await fetchServices();
    renderFilters();
    renderServices();
    setStatus(statusEl, "", "loading");
  } catch (err) {
    setStatus(
      statusEl,
      "Sorry — we couldn't load the services right now. Please try again later.",
      "error"
    );
  }
}

init();