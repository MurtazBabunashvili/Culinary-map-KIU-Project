const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    return {};
  }
};

const updateNavAuth = () => {
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

const rememberCurrentPage = () => {
  const page = window.location.pathname.split("/").pop() || "index.html";
  sessionStorage.setItem("lastVisitedPage", page);
};

const renderSessionInfo = () => {
  const footerTagline = document.querySelector(".footer-tagline");
  if (!footerTagline) return;

  const page = sessionStorage.getItem("lastVisitedPage");
  if (!page) return;

  let note = document.getElementById("session-page-note");
  if (!note) {
    note = document.createElement("p");
    note.id = "session-page-note";
    note.className = "session-page-note";
    footerTagline.insertAdjacentElement("afterend", note);
  }

  note.textContent = `sessionStorage: ბოლო გვერდი — ${page}`;
};

document.addEventListener("DOMContentLoaded", () => {
  rememberCurrentPage();
  renderSessionInfo();
  updateNavAuth();
});
