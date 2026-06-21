// api.js — Shared API utilities & auth-aware navbar
// Demonstrates: DOM manipulation, ES6+, Async/Await, Fetch API, localStorage

// ─── Auth Helpers ────────────────────────────────────────────────────────────

const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    return {};
  }
};

// ─── Auth-aware Navbar ───────────────────────────────────────────────────────
// Finds the "ავტორიზაცია" nav link (href contains "register") and swaps it
// to "პროფილი" → profile.html whenever a user session is active.

const updateNavAuth = () => {
  // Select every nav-link whose href points to register or contains "login"
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.includes("register") || href.includes("login")) {
      if (isLoggedIn()) {
        const { firstName = "" } = getCurrentUser();
        link.textContent = firstName ? firstName : "პროფილი";
        link.setAttribute("href", "profile.html");
      } else {
        link.textContent = "ავტორიზაცია";
        link.setAttribute("href", "register.html#login");
      }
    }
  });
};

// ─── Open-Meteo Weather API ──────────────────────────────────────────────────

const WEATHER_CONFIG = {
  lat: 42.2679,
  lon: 42.697,
  baseUrl: "https://api.open-meteo.com/v1/forecast",
};

const buildWeatherUrl = ({ lat, lon, baseUrl }) =>
  `${baseUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&wind_speed_unit=ms&timezone=Asia%2FTbilisi`;

// Callback pattern
const fetchWeatherCallback = (callback) => {
  fetch(buildWeatherUrl(WEATHER_CONFIG))
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => callback(null, data.current_weather))
    .catch((err) => callback(err, null));
};

// Promise pattern
const fetchWeatherPromise = () =>
  fetch(buildWeatherUrl(WEATHER_CONFIG))
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => data.current_weather)
    .catch((err) => {
      console.error("Weather promise error:", err);
      return null;
    });

// Async/Await pattern
const fetchWeatherAsync = async () => {
  try {
    const res = await fetch(buildWeatherUrl(WEATHER_CONFIG));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { current_weather } = await res.json();
    const { temperature, windspeed, weathercode } = current_weather;
    return { temperature, windspeed, weathercode };
  } catch (err) {
    console.error("Weather async error:", err);
    return null;
  }
};

// ─── Generic JSON Fetch ──────────────────────────────────────────────────────

const fetchJSON = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`fetchJSON error [${url}]:`, err);
    return null;
  }
};

// ─── localStorage Utilities ──────────────────────────────────────────────────

const storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

// ─── Expose on window ────────────────────────────────────────────────────────

window.AppAPI = {
  isLoggedIn,
  getCurrentUser,
  fetchWeatherCallback,
  fetchWeatherPromise,
  fetchWeatherAsync,
  fetchJSON,
  storage,
};

// ─── Init on DOM ready ───────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  updateNavAuth();
});