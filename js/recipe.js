const getDishSlug = () =>
  new URLSearchParams(window.location.search).get("dish") || "khinkali";

const getRecipe = () => {
  const slug = getDishSlug();
  return {
    slug,
    recipe: window.RecipeData?.[slug] || window.RecipeData?.khinkali,
  };
};

const difficultyDots = (level = 1) =>
  [1, 2, 3]
    .map((dot) => `<span class="${dot <= level ? "on" : "off"}"></span>`)
    .join("");

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const renderHero = (recipe, slug) => {
  document.title = `${recipe.name} — რეცეპტი | ქართული კულინარიული გიდი`;

  setText("recipe-breadcrumb-current", recipe.name);
  setText("recipe-title", recipe.name);
  setText("recipe-subtitle", `${recipe.nameEn} — ${recipe.tagline}`);
  setText("recipe-region", recipe.region);
  setText("recipe-time", recipe.time);
  setText("recipe-servings", recipe.servings);
  setText("recipe-calories", recipe.calories);
  setText("recipe-category", recipe.category);
  setText("recipe-ingredients-title", recipe.ingredientsTitle);
  setText("recipe-step-count", `${recipe.steps.length} ნაბიჯი`);
  setText("recipe-note", recipe.note);
  setText("recipe-tip", recipe.tip);

  const image = document.getElementById("recipe-image");
  if (image) {
    image.src = recipe.image;
    image.alt = recipe.name;
  }

  const category = document.getElementById("recipe-category");
  if (category) {
    category.className = `recipe-category recipe-category--${recipe.categoryClass}`;
  }

  const difficulty = document.getElementById("recipe-difficulty");
  if (difficulty) {
    difficulty.innerHTML = difficultyDots(recipe.difficulty);
  }

  const favoriteMark = document.getElementById("recipe-favorite-mark");
  if (favoriteMark) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    favoriteMark.textContent = favorites.includes(recipe.name) ? "♥ რჩეულებშია" : "♡";
    favoriteMark.dataset.dish = slug;
  }
};

const renderTags = (recipe) => {
  const tags = document.getElementById("recipe-tags");
  if (!tags) return;

  tags.innerHTML = "";
  recipe.tags.forEach((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    tags.appendChild(item);
  });
};

const renderIngredients = (recipe) => {
  const list = document.getElementById("recipe-ingredients");
  if (!list) return;

  list.innerHTML = "";
  recipe.ingredientGroups.forEach((group) => {
    const groupEl = document.createElement("div");
    const title = document.createElement("h3");
    const items = document.createElement("ul");

    groupEl.className = "ingredient-group";
    title.textContent = group.title;

    group.items.forEach((ingredient) => {
      const item = document.createElement("li");
      const check = document.createElement("button");
      const label = document.createElement("span");

      check.type = "button";
      check.className = "ingredient-check";
      check.setAttribute("aria-label", `${ingredient} მონიშვნა`);
      check.addEventListener("click", () => {
        item.classList.toggle("is-checked");
      });

      label.textContent = ingredient;
      item.append(check, label);
      items.appendChild(item);
    });

    groupEl.append(title, items);
    list.appendChild(groupEl);
  });
};

const renderSteps = (recipe) => {
  const steps = document.getElementById("recipe-steps");
  if (!steps) return;

  steps.innerHTML = "";
  recipe.steps.forEach((step, index) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    const text = document.createElement("p");

    number.className = "step-number";
    number.textContent = index + 1;
    text.textContent = step;
    item.append(number, text);
    steps.appendChild(item);
  });
};

const renderRelated = (recipe, slug) => {
  const grid = document.getElementById("related-recipes");
  if (!grid) return;

  const relatedSlugs = [
    ...(recipe.related || []),
    ...(window.RecipeFallbacks || []),
  ]
    .filter((item, index, arr) => item !== slug && arr.indexOf(item) === index)
    .filter((item) => window.RecipeData?.[item])
    .slice(0, 6);

  grid.innerHTML = "";
  relatedSlugs.forEach((relatedSlug) => {
    const item = window.RecipeData?.[relatedSlug];
    if (!item) return;

    const card = document.createElement("a");
    card.className = "related-card";
    card.href = `recipe.html?dish=${relatedSlug}`;
    card.innerHTML = `
      <div class="related-card__img">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="related-card__body">
        <h3>${item.name}</h3>
        <p>${item.time} · ${item.region}</p>
        <div class="related-card__meta">
          <span class="recipe-diff">${difficultyDots(item.difficulty)}</span>
          <span>რეცეპტი →</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
};

const setupActions = (recipe) => {
  const printBtn = document.getElementById("print-recipe");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  const favoriteMark = document.getElementById("recipe-favorite-mark");
  if (favoriteMark) {
    favoriteMark.addEventListener("click", () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const isFavorite = favorites.includes(recipe.name);
      const updated =
        isFavorite ?
          favorites.filter((favorite) => favorite !== recipe.name)
        : [...favorites, recipe.name];

      localStorage.setItem("favorites", JSON.stringify(updated));
      favoriteMark.textContent = isFavorite ? "♡" : "♥ რჩეულებშია";
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const { slug, recipe } = getRecipe();
  if (!recipe) return;

  renderHero(recipe, slug);
  renderTags(recipe);
  renderIngredients(recipe);
  renderSteps(recipe);
  renderRelated(recipe, slug);
  setupActions(recipe);
});
