export function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

export function setStatus(container, message, type = "loading") {
  container.innerHTML = "";
  if (!message) return;
  const p = createElement("p", `status ${type}`, message);
  p.setAttribute("role", "status");
  container.appendChild(p);
}