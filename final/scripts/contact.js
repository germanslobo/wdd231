import { fetchServices } from "./modules/data.js";

// ---- Mobile menu ----
const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#primaryNav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

document.querySelector("#year").textContent = new Date().getFullYear();

// ---- Refs ----
const form = document.querySelector("#contactForm");
const serviceSelect = document.querySelector("#service");
const contactMethodSelect = document.querySelector("#contactMethod");
const budgetSelect = document.querySelector("#budget");
const statusEl = document.querySelector("#formStatus");
const recapCard = document.querySelector("#recapCard");
const recapText = document.querySelector("#recapText");
const clearRecapBtn = document.querySelector("#clearRecap");

const PREF_KEY = "af_contact_prefs";

// ---- LocalStorage helpers ----
function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || {};
  } catch {
    return {};
  }
}
function savePrefs(prefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

// ---- Populate service dropdown from JSON ----
async function populateServices() {
  try {
    const services = await fetchServices();
    serviceSelect.innerHTML = '<option value="">— Choose a service —</option>';
    // .map used to produce option text labels
    services
      .map(s => ({ id: s.id, name: s.name, category: s.category }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(({ id, name, category }) => {
        const opt = document.createElement("option");
        opt.value = `${name} (${category})`;
        opt.textContent = `${name} — ${category}`;
        opt.dataset.serviceId = id;
        serviceSelect.appendChild(opt);
      });
  } catch (err) {
    console.error(err);
    serviceSelect.innerHTML = '<option value="">Unable to load services</option>';
    statusEl.textContent = "Could not load the service list. Please refresh the page.";
    statusEl.className = "status error";
  }
}

// ---- Pre-fill form from saved prefs ----
function applyPrefs(prefs) {
  if (prefs.contactMethod) {
    const opt = [...contactMethodSelect.options].find(o => o.value === prefs.contactMethod);
    if (opt) contactMethodSelect.value = prefs.contactMethod;
  }
  if (prefs.budget) {
    const opt = [...budgetSelect.options].find(o => o.value === prefs.budget);
    if (opt) budgetSelect.value = prefs.budget;
  }
  // Last service: match by value string
  if (prefs.lastService) {
    const opt = [...serviceSelect.options].find(o => o.value === prefs.lastService);
    if (opt) serviceSelect.value = prefs.lastService;
  }
}

// ---- Show "Welcome back" recap card ----
function showRecap(prefs) {
  const parts = [];
  if (prefs.contactMethod) parts.push(`contact via <strong>${prefs.contactMethod}</strong>`);
  if (prefs.lastService) parts.push(`service: <strong>${prefs.lastService}</strong>`);
  if (prefs.budget) parts.push(`budget: <strong>${prefs.budget}</strong>`);

  if (parts.length === 0) {
    recapCard.hidden = true;
    return;
  }
  recapText.innerHTML = `Last time you chose: ${parts.join(", ")}. We've pre-filled your form.`;
  recapCard.hidden = false;
}

// ---- Form submit: validate + save prefs + let browser navigate to action ----
form.addEventListener("submit", (e) => {
  // Custom validity check for the checkbox pattern (not strictly needed; kept for demo)
  if (!form.checkValidity()) {
    e.preventDefault();
    // Find first invalid field and focus
    const firstInvalid = form.querySelector(":invalid");
    if (firstInvalid) firstInvalid.focus();
    statusEl.textContent = "Please fix the highlighted fields before submitting.";
    statusEl.className = "status error";
    return;
  }

  // Save preferences before navigation
  savePrefs({
    contactMethod: contactMethodSelect.value,
    budget: budgetSelect.value,
    lastService: serviceSelect.value,
    lastSubmit: new Date().toISOString()
  });

  statusEl.textContent = "Sending your request…";
  statusEl.className = "status loading";
  // Let the browser perform GET navigation to form-action.html
});

// ---- Track changes live so prefs reflect what the user picks even without submit ----
[contactMethodSelect, budgetSelect, serviceSelect].forEach(el => {
  el.addEventListener("change", () => {
    const prefs = loadPrefs();
    prefs.contactMethod = contactMethodSelect.value;
    prefs.budget = budgetSelect.value;
    prefs.lastService = serviceSelect.value;
    savePrefs(prefs);
  });
});

// ---- Clear saved preferences ----
clearRecapBtn.addEventListener("click", () => {
  localStorage.removeItem(PREF_KEY);
  recapCard.hidden = true;
  form.reset();
  statusEl.textContent = "Saved preferences cleared.";
  statusEl.className = "status loading";
  setTimeout(() => { statusEl.textContent = ""; statusEl.className = "status"; }, 2500);
});

// ---- Init ----
async function init() {
  await populateServices();
  const prefs = loadPrefs();
  applyPrefs(prefs);
  showRecap(prefs);
}
init();