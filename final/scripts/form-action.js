// Reads the query string from the URL and displays it nicely.
// Demonstrates: URLSearchParams, DOM manipulation, template literals, ES module.

const FRIENDLY_LABELS = {
  fullName: "Full Name",
  email: "Email",
  phone: "Phone",
  service: "Service Requested",
  contactMethod: "Preferred Contact",
  budget: "Estimated Budget",
  message: "Project Details",
  newsletter: "Newsletter Opt-in"
};

const recapList = document.querySelector("#recapList");
const emptyMsg = document.querySelector("#emptyMsg");

document.querySelector("#year").textContent = new Date().getFullYear();

// Mobile menu (in case someone lands directly)
const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#primaryNav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// ---- Parse query string ----
const params = new URLSearchParams(window.location.search);

// Skip empty values; skip null
const entries = [...params.entries()].filter(([, value]) => value && value.trim() !== "");

if (entries.length === 0) {
  emptyMsg.hidden = false;
  recapList.hidden = true;
} else {
  entries.forEach(([key, value]) => {
    const label = FRIENDLY_LABELS[key] || key;
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    // Wrap in <div> so the grid alignment works
    const item = document.createElement("div");
    item.className = "recap-item";
    item.append(dt, dd);
    recapList.appendChild(item);
  });

  // Bonus: save last submission to localStorage (harmless; shows the pattern)
  try {
    localStorage.setItem("af_last_submission", JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* ignore quota errors */
  }
}