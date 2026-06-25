document.addEventListener("DOMContentLoaded", () => {
  const foodCatalog = {
    "ხაჭაპური": {
      slug: "khachapuri",
      image: "images/foods/khachapuri.webp",
      region: "იმერეთი",
      description: "ყველიანი პური",
    },
    "ხინკალი": {
      slug: "khinkali",
      image: "images/foods/khinkali.jpg",
      region: "მცხეთა-მთიანეთი",
      description: "ქართული პელმენი",
    },
    "მწვადი": {
      slug: "mtsvadi",
      image: "images/foods/mtsvadi.jpg",
      region: "კახეთი",
      description: "ნახშირზე შემწვარი ხორცი",
    },
    "ნიგვზიანი ბადრიჯანი": {
      image: "images/foods/nigvziani-badrijani.jpg",
      region: "ყველა რეგიონი",
      description: "ბადრიჯანი კაკლით",
    },
    "ლობიო": {
      slug: "lobio",
      image: "images/foods/lobio.webp",
      region: "იმერეთი",
      description: "ქართული ლობი",
    },
    "ჩურჩხელა": {
      image: "images/foods/churchkhela.jpg",
      region: "კახეთი",
      description: "ყურძნის ტკბილეული",
    },
    "ფხალი": {
      image: "images/foods/pkhali.jpg",
      region: "ყველა რეგიონი",
      description: "ბოსტნეული ნიგვზით",
    },
    "ჩახოხბილი": {
      image: "images/foods/chakhokhbili.jpg",
      region: "კახეთი",
      description: "ქათმის კერძი პომიდვრით",
    },
    "ჩაშუშული": {
      slug: "chashushuli",
      image: "images/foods/chashushuli.webp",
      region: "ქართლი",
      description: "ჩაშუშული ხორცი",
    },
    "ელარჯი": {
      slug: "elarji",
      image: "images/regions/samegrelo/elarji.jpg",
      region: "სამეგრელო",
      description: "ღომი ყველით",
    },
    "საცივი": {
      image: "images/foods/satsivi.jpg",
      region: "ყველა რეგიონი",
      description: "ქათამი ნიგვზის სოუსში",
    },
    "კუბდარი": {
      slug: "kubdari",
      image: "images/foods/kubdari.jpg",
      region: "სვანეთი",
      description: "ხორციანი პური",
    },
    "გებჟალია": {
      image: "images/regions/samegrelo/gebzhalia.jpg",
      region: "სამეგრელო",
      description: "სულგუნის რულეტი",
    },
    "კუპატი": {
      image: "images/regions/samegrelo/kupati.jpg",
      region: "სამეგრელო",
      description: "ხელნაკეთი კოლბასი",
    },
    "ოჯახური": {
      image: "images/foods/ojakhuri.jpg",
      region: "ქართლი",
      description: "ხორცი კარტოფილით",
    },
    "ლობიანი": {
      image: "images/foods/lobiani.jpg",
      region: "რაჭა",
      description: "ლობიოს პური",
    },
    "ჭვიშტარი": {
      image: "images/regions/samegrelo/chvishtari.webp",
      region: "სამეგრელო",
      description: "სიმინდის პური ყველით",
    },
    "ტოლმა": {
      image: "images/foods/tolma.jpg",
      region: "ყველა რეგიონი",
      description: "ვაზის ფოთოლში გახვეული ხორცი",
    },
    "გოზინაყი": {
      image: "images/foods/gozinakhi.jpg",
      region: "ყველა რეგიონი",
      description: "საახალწლო ნიგვზიანი ტკბილეული",
    },
    "ხარჩო": {
      slug: "kharcho",
      image: "images/foods/kharcho.jpg",
      region: "სამეგრელო",
      description: "ცხარე სუპი ნიგვზით",
    },
  };

  const raw = localStorage.getItem("currentUser") || "{}";

  const {
    firstName = "",
    lastName = "",
    email = "",
    region = "",
    motivation = "",
  } = JSON.parse(raw);

  const heroName = document.getElementById("hero-name");
  if (heroName) {
    heroName.textContent =
      firstName || lastName ? `${firstName} ${lastName}`.trim() : "სტუმარი";
  }

  const heroRegion = document.querySelector(".profile-hero__region span");
  if (heroRegion) {
    heroRegion.textContent = region || "რეგიონი არ არის მითითებული";
  }

  const buildInitials = (f, l) =>
    `${f.charAt(0)}${l.charAt(0)}`.toUpperCase() || "–";

  const avatarEl = document.getElementById("avatar-initials");
  if (avatarEl) {
    avatarEl.textContent = buildInitials(firstName, lastName);
  }

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setVal("info-firstname", firstName);
  setVal("info-lastname", lastName);
  setVal("info-email", email);
  setVal("info-region", region);

  const saveBtn = document.getElementById("info-save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const updatedFirst =
        document.getElementById("info-firstname")?.value.trim() || "";
      const updatedLast =
        document.getElementById("info-lastname")?.value.trim() || "";
      const updatedEmail =
        document.getElementById("info-email")?.value.trim() || "";
      const updatedRegion = document.getElementById("info-region")?.value || "";

      const existingUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      const updatedUser = {
        ...existingUser,
        firstName: updatedFirst,
        lastName: updatedLast,
        email: updatedEmail,
        region: updatedRegion,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      if (heroName) {
        heroName.textContent =
          `${updatedFirst} ${updatedLast}`.trim() || "სტუმარი";
      }
      if (heroRegion) {
        heroRegion.textContent = updatedRegion || "რეგიონი არ არის მითითებული";
      }
      if (avatarEl) {
        avatarEl.textContent = buildInitials(updatedFirst, updatedLast);
      }

      showAlert("info-alert", "მონაცემები წარმატებით შეინახა! ✔", "success");
    });
  }

  const navItems = document.querySelectorAll(".profile-nav__item");
  const panels = {
    info: document.getElementById("panel-info"),
    favorites: document.getElementById("panel-favorites"),
    password: document.getElementById("panel-password"),
    delete: document.getElementById("panel-delete"),
  };

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const tab = item.dataset.tab;

      navItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      Object.values(panels).forEach((p) => {
        if (p) p.style.display = "none";
      });
      if (panels[tab]) panels[tab].style.display = "block";
    });
  });

  const pwdSaveBtn = document.getElementById("pwd-save-btn");
  if (pwdSaveBtn) {
    pwdSaveBtn.addEventListener("click", () => {
      const current = document.getElementById("pwd-current")?.value || "";
      const newPwd = document.getElementById("pwd-new")?.value || "";
      const confirm = document.getElementById("pwd-confirm")?.value || "";

      if (!current || !newPwd) {
        showAlert("pwd-alert", "გთხოვთ შეავსოთ ყველა ველი.", "error");
        return;
      }
      if (newPwd.length < 6) {
        showAlert(
          "pwd-alert",
          "ახალი პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.",
          "error",
        );
        return;
      }
      if (newPwd !== confirm) {
        showAlert("pwd-alert", "პაროლები არ ემთხვევა.", "error");
        return;
      }

      const existingUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...existingUser, passwordSet: true }),
      );

      showAlert("pwd-alert", "პაროლი წარმატებით შეიცვალა! ✔", "success");
      ["pwd-current", "pwd-new", "pwd-confirm"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
    });
  }

  const delBtn = document.getElementById("del-btn");
  if (delBtn) {
    delBtn.addEventListener("click", () => {
      const confirmed = window.confirm(
        "ნამდვილად გსურთ ანგარიშის წაშლა? ეს მოქმედება შეუქცევადია.",
      );
      if (!confirmed) return;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("favorites");

      window.location.href = "register.html";
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "register.html#login";
    });
  }

  document.querySelectorAll(".field__eye").forEach((eyeBtn) => {
    eyeBtn.addEventListener("click", () => {
      const input = eyeBtn
        .closest(".field__input-wrap")
        ?.querySelector("input");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  renderFavorites();

  function showAlert(alertId, message, type = "success") {
    const el = document.getElementById(alertId);
    if (!el) return;

    el.className = `alert alert--${type}`;
    el.textContent = message;
    el.style.display = "block";

    setTimeout(() => {
      el.style.display = "none";
    }, 4000);
  }

  function getTopFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const [first = null, second = null, third = null] = favs;
    return { first, second, third, total: favs.length };
  }

  function renderFavorites() {
    const grid = document.getElementById("favorites-grid");
    const emptyState = document.getElementById("favorites-empty");
    const summary = document.getElementById("favorites-summary");
    const totalEl = document.getElementById("favorites-total");
    const topRegionEl = document.getElementById("favorites-top-region");
    const navCount = document.getElementById("favorites-nav-count");
    if (!grid || !emptyState || !summary || !totalEl || !topRegionEl) return;

    const { first, second, third, total } = getTopFavorites();
    const topFavorites = [first, second, third].filter(Boolean);
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const topRegion = getTopRegion(favorites);

    grid.innerHTML = "";
    totalEl.textContent = total;
    topRegionEl.textContent = topRegion || "—";
    if (navCount) navCount.textContent = total;

    if (!total) {
      summary.textContent = "რჩეული კერძები ჯერ არ გაქვთ დამატებული.";
      emptyState.style.display = "grid";
      grid.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    grid.style.display = "grid";
    summary.textContent = `პირველი რჩეულები: ${topFavorites.join(", ")}.`;

    favorites.forEach((name) => {
      grid.appendChild(createFavoriteCard(name));
    });
  }

  function createFavoriteCard(name) {
    const details = foodCatalog[name] || {
      image: "images/main/logo.png",
      region: "ქართული სამზარეულო",
      description: "რჩეული კერძი",
    };
    const card = document.createElement("article");
    const imageWrap = document.createElement("div");
    const image = document.createElement("img");
    const region = document.createElement("span");
    const body = document.createElement("div");
    const title = document.createElement("h3");
    const desc = document.createElement("p");
    const footer = document.createElement("div");
    const recipeLink = document.createElement("a");
    const removeBtn = document.createElement("button");

    card.className = "favorite-card";
    imageWrap.className = "favorite-card__img";
    image.src = details.image;
    image.alt = name;
    region.className = "favorite-card__region";
    region.textContent = details.region;
    body.className = "favorite-card__body";
    title.className = "favorite-card__name";
    title.textContent = name;
    desc.className = "favorite-card__desc";
    desc.textContent = details.description;
    footer.className = "favorite-card__footer";
    recipeLink.className = "favorite-card__recipe";
    recipeLink.textContent = details.slug ? "რეცეპტი →" : "ყველა კერძი →";
    recipeLink.href = details.slug ? `recipe.html?dish=${details.slug}` : "foods.html";
    removeBtn.className = "favorite-card__remove";
    removeBtn.type = "button";
    removeBtn.textContent = "წაშლა";
    removeBtn.addEventListener("click", () => removeFavorite(name));

    imageWrap.append(image, region);
    body.append(title, desc);
    footer.append(recipeLink, removeBtn);
    card.append(imageWrap, body, footer);

    return card;
  }

  function removeFavorite(name) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites.filter((favorite) => favorite !== name)),
    );
    renderFavorites();
  }

  function getTopRegion(favorites) {
    const counts = favorites.reduce((acc, name) => {
      const region = foodCatalog[name]?.region || "ქართული სამზარეულო";
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});
    const [topRegion] =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [];
    return topRegion;
  }
});
