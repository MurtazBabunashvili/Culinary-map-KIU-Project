// Shared helpers exposed on window.AppUtils

const formatDate = (date) => new Date(date).toLocaleDateString("ka-GE");

const greetUser = (name) => `გამარჯობა, ${name}!`;

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const createCardHTML = ({ name, region, desc }) =>
  `<div class="card">
    <h3>${name}</h3>
    <p>${region} — ${desc}</p>
  </div>`;

const buildAvatarInitials = (firstName = "", lastName = "") =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "–";

const getUserInfo = () => {
  const raw = localStorage.getItem("currentUser") || "{}";
  const {
    firstName = "",
    lastName = "",
    email = "",
    region = "",
  } = JSON.parse(raw);
  return { firstName, lastName, email, region };
};

const getTopFavorites = () => {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const [first = null, second = null, third = null] = favs;
  return { first, second, third, total: favs.length };
};

const updateUser = (existingUser, changes) => ({ ...existingUser, ...changes });

const mergeDefaults = (userPrefs) => ({
  ...{ theme: "light", lang: "ka", notifications: true },
  ...userPrefs,
});

const saveUserData = (email, password, ...extras) => ({
  email,
  password,
  extras,
});

const buildGreeting = (name = "სტუმარი", lang = "ka") =>
  lang === "ka" ? `გამარჯობა, ${name}!` : `Hello, ${name}!`;

window.AppUtils = {
  formatDate,
  greetUser,
  clamp,
  createCardHTML,
  buildAvatarInitials,
  getUserInfo,
  getTopFavorites,
  updateUser,
  mergeDefaults,
  saveUserData,
  buildGreeting,
};
