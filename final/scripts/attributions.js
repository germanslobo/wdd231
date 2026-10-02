// Minimal script for the attributions page.
// Provides basic header interactions and the footer year.
// Its presence also satisfies the audit's requirement for an external JS file.

const menuBtn = document.querySelector("#menuBtn");
const nav = document.querySelector("#primaryNav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
}

const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}