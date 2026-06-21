const getFavorites = () =>
  JSON.parse(localStorage.getItem("favorites") || "[]");

const saveFavorites = (favs) =>
  localStorage.setItem("favorites", JSON.stringify(favs));

const toggleFavorite = (foodName) => {
  const favs = getFavorites();
  const isInFav = favs.includes(foodName);
  const updated =
    isInFav ? favs.filter((f) => f !== foodName) : [...favs, foodName];
  saveFavorites(updated);
  return !isInFav;
};

const addHeartButtons = () => {
  const favs = getFavorites();

  document.querySelectorAll(".fcard").forEach((card) => {
    const nameEl = card.querySelector(".fcard__name");
    if (!nameEl) return;

    const foodName = nameEl.textContent.trim();
    const isFav = favs.includes(foodName);

    const btn = document.createElement("button");
    btn.className = "fav-btn";
    btn.innerHTML = isFav ? "♥" : "♡";
    btn.title = "რჩეულებში დამატება";
    btn.dataset.food = foodName;

    Object.assign(btn.style, {
      position: "absolute",
      top: "0.9rem",
      right: "0.9rem",
      background: "rgba(30, 4, 9, 0.62)",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      fontSize: "1.1rem",
      color: isFav ? "#e85d75" : "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.25s ease",
      zIndex: "5",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.background = "rgba(232, 93, 117, 0.7)";
      btn.style.transform = "scale(1.15)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "rgba(30, 4, 9, 0.62)";
      btn.style.transform = "scale(1)";
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(foodName);
      btn.innerHTML = nowFav ? "♥" : "♡";
      btn.style.color = nowFav ? "#e85d75" : "#fff";
      showFavToast(foodName, nowFav);
    });

    const imgWrap = card.querySelector(".fcard__img");
    if (imgWrap) {
      imgWrap.style.position = "relative";
      imgWrap.appendChild(btn);
    }
  });
};

const showFavToast = (name, added) => {
  const existing = document.getElementById("fav-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "fav-toast";
  toast.textContent =
    added ? `♥ "${name}" დაემატა რჩეულებს` : `♡ "${name}" წაიშალა რჩეულებიდან`;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#3a0a0a",
    color: "#e2c97e",
    padding: "0.75rem 1.8rem",
    borderRadius: "30px",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.92rem",
    fontWeight: "600",
    boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
    zIndex: "9999",
    border: "1px solid rgba(191,160,122,0.4)",
    whiteSpace: "nowrap",
    pointerEvents: "none",
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
};

const buildSearchBar = () => {
  const filterBar = document.querySelector(".filter-bar");
  if (!filterBar) return;

  const searchWrap = document.createElement("div");
  searchWrap.className = "js-search-wrap";
  searchWrap.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="#7a5a4a" stroke-width="2" class="search-icon">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
    <input
      type="text"
      id="food-search"
      placeholder="მოძებნე კერძი… (მაგ: ხინკალი, khinkali, კახეთი)"
      autocomplete="off"
    />
    <button id="search-clear" title="გასუფთავება" style="display:none">✕</button>
  `;

  Object.assign(searchWrap.style, {
    maxWidth: "1440px",
    margin: "1.4rem auto 0",
    padding: "0 2.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  });

  filterBar.insertAdjacentElement("afterend", searchWrap);

  const input = document.getElementById("food-search");
  Object.assign(input.style, {
    flex: "1",
    padding: "0.72rem 1.2rem",
    border: "1.5px solid #d4c4b0",
    borderRadius: "30px",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.92rem",
    color: "#4a2c2c",
    background: "#fdfaf6",
    outline: "none",
    transition: "border-color 0.25s, box-shadow 0.25s",
  });

  const clearBtn = document.getElementById("search-clear");
  Object.assign(clearBtn.style, {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#7a5a4a",
    fontSize: "1.1rem",
    padding: "0.2rem 0.5rem",
    borderRadius: "50%",
  });

  input.addEventListener("focus", () => {
    input.style.borderColor = "#7b2828";
    input.style.boxShadow = "0 0 0 3px rgba(123,40,40,0.1)";
  });
  input.addEventListener("blur", () => {
    input.style.borderColor = "#d4c4b0";
    input.style.boxShadow = "none";
  });

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    clearBtn.style.display = query ? "block" : "none";
    filterCards(query);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    filterCards("");
    input.focus();
  });
};

const filterCards = (query) => {
  const cards = document.querySelectorAll(".fcard");
  let visible = 0;

  cards.forEach((card) => {
    const searchData = (card.dataset.search || "").toLowerCase();
    const cardName = (
      card.querySelector(".fcard__name")?.textContent || ""
    ).toLowerCase();
    const matches =
      !query || searchData.includes(query) || cardName.includes(query);

    card.style.display = matches ? "flex" : "none";
    if (matches) visible++;
  });

  updateResultsBar(visible, query);
};

const updateResultsBar = (count, query) => {
  const el = document.querySelector(".results-bar__text");
  if (!el) return;

  el.textContent =
    query ?
      `ძიება: "${query}" — ნაპოვნია ${count} კერძი`
    : `ნაჩვენებია ყველა კერძი`;
};

document.addEventListener("DOMContentLoaded", () => {
  addHeartButtons();
  buildSearchBar();
});
