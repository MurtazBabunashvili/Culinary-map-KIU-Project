const API_BASE = "http://localhost:3600";

// --- Helpers ---
function showError(formId, message) {
  let el = document.getElementById(formId + "-error");
  if (!el) {
    el = document.createElement("div");
    el.id = formId + "-error";
    el.style.cssText =
      "color:#8B2635;background:#fdf0f0;border:1px solid #e8c0c0;border-radius:8px;padding:.65rem 1rem;font-size:.88rem;font-family:var(--font-display);margin-bottom:.5rem;";
    const card = document.getElementById(formId);
    const btn = card.querySelector(".btn-primary");
    card.insertBefore(el, btn);
  }
  el.textContent = message;
  el.style.display = "block";
}

function hideError(formId) {
  const el = document.getElementById(formId + "-error");
  if (el) el.style.display = "none";
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? "გთხოვთ დაიცადოთ..." : btn.dataset.label;
}

// --- Register ---
async function handleRegister() {
  const card = document.getElementById("register");
  const btn = card.querySelector(".btn-primary");
  hideError("register");

  const first_name = document.getElementById("firstname").value.trim();
  const last_name = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const region = document.getElementById("region").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const terms = document.getElementById("terms").checked;

  if (!first_name || !last_name)
    return showError("register", "გთხოვთ შეიყვანოთ სახელი და გვარი.");
  if (!email) return showError("register", "გთხოვთ შეიყვანოთ ელფოსტა.");
  if (!region) return showError("register", "გთხოვთ აირჩიოთ რეგიონი.");
  if (password.length < 6)
    return showError("register", "პაროლი მინიმუმ 6 სიმბოლოს უნდა შეიცავდეს.");
  if (password !== confirm)
    return showError("register", "პაროლები არ ემთხვევა.");
  if (!terms)
    return showError("register", "გთხოვთ დაეთანხმოთ მომსახურების პირობებს.");

  const regionMap = {
    kakheti: "კახეთი",
    imereti: "იმერეთი",
    samegrelo: "სამეგრელო",
    adjara: "აჭარა",
    svaneti: "სვანეთი",
    racha: "რაჭა-ლეჩხუმი",
    guria: "გურია",
    mtskheta: "მცხეთა-მთიანეთი",
    shida: "შიდა ქართლი",
    kvemo: "ქვემო ქართლი",
    samtskhe: "სამცხე-ჯავახეთი",
    tbilisi: "თბილისი",
    abkhazia: "აფხაზეთი",
  };

  setLoading(btn, true);
  try {
    const res = await fetch(`${API_BASE}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        region: regionMap[region] || region,
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "რეგისტრაცია ვერ მოხერხდა.");

    window.location.hash = "login";
    setTimeout(() => {
      const loginEmail = document.getElementById("login-email");
      if (loginEmail) loginEmail.value = email;
      showSuccess("login", "✓ რეგისტრაცია წარმატებულია! შედით სისტემაში.");
    }, 80);
  } catch (err) {
    showError("register", err.message);
  } finally {
    setLoading(btn, false);
  }
}

async function handleLogin() {
  const card = document.getElementById("login");
  const btn = card.querySelector(".btn-primary");
  hideError("login");

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email) return showError("login", "გთხოვთ შეიყვანოთ ელფოსტა.");
  if (!password) return showError("login", "გთხოვთ შეიყვანოთ პაროლი.");

  setLoading(btn, true);
  try {
    const res = await fetch(`${API_BASE}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "ავტორიზაცია ვერ მოხერხდა.");

    localStorage.setItem("token", data.data);
    window.location.href = "index.html";
  } catch (err) {
    showError("login", err.message);
  } finally {
    setLoading(btn, false);
  }
}

function showSuccess(formId, message) {
  let el = document.getElementById(formId + "-success");
  if (!el) {
    el = document.createElement("div");
    el.id = formId + "-success";
    el.style.cssText =
      "color:#2D6A5B;background:#f0fdf8;border:1px solid #a8ddc8;border-radius:8px;padding:.65rem 1rem;font-size:.88rem;font-family:var(--font-display);margin-bottom:.5rem;";
    const card = document.getElementById(formId);
    const btn = card.querySelector(".btn-primary");
    card.insertBefore(el, btn);
  }
  el.textContent = message;
  el.style.display = "block";
}

// --- Password toggle ---
function initPasswordToggles() {
  document.querySelectorAll(".field__eye").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      if (!input || input.tagName !== "INPUT") return;
      input.type = input.type === "password" ? "text" : "password";
    });
  });
}

// --- Wire up buttons ---
document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();

  // Store original button labels
  document.querySelectorAll(".btn-primary").forEach((btn) => {
    btn.dataset.label = btn.textContent.trim();
  });

  // Register button
  const registerCard = document.getElementById("register");
  if (registerCard) {
    registerCard
      .querySelector(".btn-primary")
      .addEventListener("click", handleRegister);
  }

  // Login button
  const loginCard = document.getElementById("login");
  if (loginCard) {
    loginCard
      .querySelector(".btn-primary")
      .addEventListener("click", handleLogin);

    // Allow Enter key
    loginCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }
});
