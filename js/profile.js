document.addEventListener("DOMContentLoaded", () => {
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

  // Client-side only; no server validation
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
});
