// --- OpenWeatherMap Configuration ---
const apiKey = 'e939040ca79ec7d849be16c44aa00b54';
const lat = '10.4806'; // Caracas latitude
const lon = '-66.9036'; // Caracas longitude

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

// Navigation Toggle
const menuBtn = document.getElementById('menu-btn');
const navBar = document.getElementById('nav-bar');

menuBtn.addEventListener('click', () => {
  navBar.classList.toggle('open');
});

// Footer Info
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;

// --- Fetch Current Weather ---
async function fetchWeather() {
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error('Weather network error');
    const data = await response.json();
    displayCurrentWeather(data);
  } catch (error) {
    console.error('Weather error:', error);
  }
}

function displayCurrentWeather(data) {
  const container = document.getElementById('weather-info');
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.5rem;">
      <img src="${icon}" alt="${desc}" width="50" height="50">
      <p><strong>${temp}°C</strong> - ${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
    </div>
  `;
}

// --- Fetch 3-Day Forecast ---
async function fetchForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error('Forecast network error');
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error('Forecast error:', error);
  }
}

function displayForecast(data) {
  const container = document.getElementById('forecast-info');
  container.innerHTML = '';
  
  // Extract daily readings taken around noon (12:00:00)
  const dailyList = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

  dailyList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const temp = Math.round(item.main.temp);
    
    const p = document.createElement('p');
    p.innerHTML = `<strong>${date}:</strong> ${temp}°C`;
    container.appendChild(p);
  });
}

// --- Fetch & Display Random Member Spotlights ---
async function fetchSpotlights() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Members data error');
    const members = await response.json();
    
    // Filter Gold (3) and Silver (2) members
    const qualified = members.filter(m => m.membership === 2 || m.membership === 3);
    
    // Shuffle array randomly
    const shuffled = qualified.sort(() => 0.5 - Math.random());
    
    // Select 2 or 3 members
    const selected = shuffled.slice(0, 3);
    
    displaySpotlights(selected);
  } catch (error) {
    console.error('Spotlight error:', error);
  }
}

function displaySpotlights(members) {
  const container = document.getElementById('spotlights');
  container.innerHTML = '';

  members.forEach(m => {
    const levelText = m.membership === 3 ? 'Gold Member' : 'Silver Member';
    const card = document.createElement('div');
    card.className = 'spotlight-card';
    card.innerHTML = `
      <img src="${m.image}" alt="${m.name} logo" loading="lazy">
      <h3>${m.name}</h3>
      <p><em>${m.tagline}</em></p>
      <p>${m.phone}</p>
      <p>${m.address}</p>
      <p><a href="${m.website}" target="_blank" rel="noopener">Website</a></p>
      <p><strong>Level:</strong> ${levelText}</p>
    `;
    container.appendChild(card);
  });
}

// Initialize Page Data
fetchWeather();
fetchForecast();
fetchSpotlights();