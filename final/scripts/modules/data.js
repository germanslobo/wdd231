import { formatPrice } from "./utils.js";

const DATA_URL = "data/services.json";

export async function fetchServices() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data.services)) {
      throw new Error("Malformed data: 'services' array not found.");
    }
    return data.services;
  } catch (error) {
    console.error("Failed to load services:", error);
    throw error;
  }
}

export { formatPrice };