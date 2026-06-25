const cityNames = {
  all: "ყველა ქალაქი",
  tbilisi: "თბილისი",
  kutaisi: "ქუთაისი",
  samegrelo: "სამეგრელო",
  kakheti: "კახეთი",
};

const getSelectedCity = () => {
  const checked = document.querySelector('input[name="city-filter"]:checked');
  return checked ? checked.id.replace("f-", "") : "all";
};

const buildRestaurantSearch = () => {
  const filterBar = document.querySelector(".filter-bar");
  if (!filterBar) return;

  const searchWrap = document.createElement("div");
  searchWrap.className = "js-restaurant-search";
  searchWrap.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="#7a5a4a" stroke-width="2" class="search-icon">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </svg>
    <input
      type="text"
      id="restaurant-search"
      placeholder="მოძებნე რესტორანი… (მაგ: ქუთაისი, ღვინო, ხინკალი)"
      autocomplete="off"
    />
    <button id="restaurant-search-clear" title="გასუფთავება" style="display:none">✕</button>
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

  const input = document.getElementById("restaurant-search");
  const clearBtn = document.getElementById("restaurant-search-clear");

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
    clearBtn.style.display = input.value.trim() ? "block" : "none";
    filterRestaurants();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    clearBtn.style.display = "none";
    filterRestaurants();
    input.focus();
  });

  document.querySelectorAll('input[name="city-filter"]').forEach((radio) => {
    radio.addEventListener("change", filterRestaurants);
  });
};

const filterRestaurants = () => {
  const query =
    document.getElementById("restaurant-search")?.value.trim().toLowerCase() ||
    "";
  const city = getSelectedCity();
  const cards = document.querySelectorAll(".rcard");
  let visible = 0;

  cards.forEach((card) => {
    const cityMatches = city === "all" || card.dataset.city === city;
    const text = card.textContent.toLowerCase();
    const queryMatches = !query || text.includes(query);
    const matches = cityMatches && queryMatches;

    card.style.display = matches ? "flex" : "none";
    if (matches) visible++;
  });

  updateRestaurantResults(visible, query, city);
};

const updateRestaurantResults = (count, query, city) => {
  const resultText = document.querySelector(".results-bar__text");
  const emptyState = document.querySelector(".empty-state");
  if (!resultText) return;

  if (query) {
    resultText.textContent = `ძიება: "${query}" — ნაპოვნია ${count} რესტორანი`;
  } else if (city !== "all") {
    resultText.textContent = `${cityNames[city]} — ნაჩვენებია ${count} რესტორანი`;
  } else {
    resultText.textContent = `ნაჩვენებია ყველა რესტორანი`;
  }

  if (emptyState) {
    emptyState.style.display = count ? "none" : "block";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  buildRestaurantSearch();
  filterRestaurants();
});
