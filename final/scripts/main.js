import { fetchServices, formatPrice } from "./modules/data.js";
import { setStatus, createElement } from "./modules/utils.js";

// ---- Mobile menu ----
const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#primaryNav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// ---- Year ----
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

// ---- Reusable card renderer (with image + lazy loading) ----
function createServiceCard(service, { showFavorite = false, favorites = [] } = {}) {
  const article = document.createElement("article");
  article.className = "service-card";
  article.setAttribute("tabindex", "0");
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `View details for ${service.name}`);

  const isFav = favorites.includes(service.id);

  article.innerHTML = `
    <img src="${service.image}"
         alt="${service.imageAlt}"
         width="800" height="500"
         loading="lazy" decoding="async">
    <div class="service-card-body">
      <h3>
        ${service.name}
        ${service.popular ? '<span class="badge">Popular</span>' : ''}
        ${showFavorite ? `
          <button class="fav-btn" type="button"
                  aria-pressed="${isFav}"
                  aria-label="${isFav ? 'Remove from' : 'Add to'} favorites"
                  data-id="${service.id}">
            ${isFav ? '♥' : '♡'}
          </button>` : ''}
      </h3>
      <p class="description">${service.description}</p>
      <p class="meta">
        <span class="price">${formatPrice(service.price)}</span> ·
        ${service.duration} · ${service.category}
      </p>
    </div>
  `;

  // Card click → modal (ignore clicks on the fav button)
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

// ---- Home page init ----
const statusEl = document.querySelector("#featuredStatus");
const gridEl = document.querySelector("#featuredServices");
const featureGrid = document.querySelector("#featureGrid");

async function init() {
  setStatus(statusEl, "Loading services…", "loading");
  try {
    const services = await fetchServices();
    renderFeatures();
    renderFeatured(services);
    setStatus(statusEl, "", "loading");
  } catch (err) {
    setStatus(
      statusEl,
      "Sorry — we couldn't load the services right now. Please try again later.",
      "error"
    );
  }
}

function renderFeatures() {
  featureGrid.innerHTML = "";
  const features = [
    { emoji: "⚙️", title: "Custom Workflows", text: "Tailored n8n automations for your exact stack." },
    { emoji: "🤖", title: "AI Integration", text: "GPT-powered chatbots and smart data pipelines." },
    { emoji: "🔒", title: "Reliable APIs", text: "Secure, monitored integrations that just work." }
  ];
  features.forEach(f => {
    const card = createElement("article", "card");
    card.innerHTML = `
      <span class="emoji" aria-hidden="true">${f.emoji}</span>
      <h3>${f.title}</h3>
      <p>${f.text}</p>
    `;
    featureGrid.appendChild(card);
  });
}

function renderFeatured(services) {
  gridEl.innerHTML = "";
  // .filter + .slice — array methods
  const featured = services.filter(s => s.popular).slice(0, 3);
  featured.forEach(service => {
    gridEl.appendChild(createServiceCard(service));
  });
}

init();