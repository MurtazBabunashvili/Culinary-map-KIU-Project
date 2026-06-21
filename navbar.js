function applyClosedState(nav, button, lines) {
  nav.style.display = "none";
  nav.style.opacity = "0";
  nav.style.transform = "translateY(-8px)";
  nav.style.pointerEvents = "none";
  button.setAttribute("aria-expanded", "false");

  lines[0].style.transform = "";
  lines[1].style.opacity = "";
  lines[2].style.transform = "";
}

function applyOpenState(nav, button, lines) {
  nav.style.display = "flex";
  nav.style.position = "absolute";
  nav.style.top = "66px";
  nav.style.left = "0";
  nav.style.right = "0";
  nav.style.width = "100%";
  nav.style.flexDirection = "column";
  nav.style.alignItems = "stretch";
  nav.style.gap = "0";
  nav.style.padding = "0.45rem 1.2rem 0.9rem";
  nav.style.margin = "0";
  nav.style.background = "rgba(58, 10, 10, 0.98)";
  nav.style.borderTop = "1px solid rgba(255, 255, 255, 0.12)";
  nav.style.boxShadow = "0 18px 34px rgba(0, 0, 0, 0.28)";
  nav.style.opacity = "1";
  nav.style.transform = "translateY(0)";
  nav.style.pointerEvents = "auto";
  nav.style.transition = "opacity 180ms ease, transform 180ms ease";
  nav.style.zIndex = "1001";
  button.setAttribute("aria-expanded", "true");

  lines[0].style.transform = "translateY(7px) rotate(45deg)";
  lines[1].style.opacity = "0";
  lines[2].style.transform = "translateY(-7px) rotate(-45deg)";
}

function applyMobileLinkStyles(nav) {
  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.style.display = "block";
    link.style.width = "100%";
    link.style.padding = "0.78rem 0";
    link.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";
    link.style.fontSize = "0.94rem";
    link.style.lineHeight = "1.2";
  });

  const lastLink = nav.querySelector(".nav-link:last-child");
  if (lastLink) {
    lastLink.style.borderBottom = "0";
  }
}

function resetNavbar(nav, button, checkbox, lines) {
  nav.removeAttribute("style");
  button.setAttribute("aria-expanded", "false");

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.removeAttribute("style");
  });

  lines.forEach((line) => line.removeAttribute("style"));

  if (checkbox) {
    checkbox.checked = false;
  }
}

function initNavbarToggle() {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".main-nav");
  const button = document.querySelector(".nav-burger");
  const checkbox = document.getElementById("nav-toggle");

  if (!header || !nav || !button) {
    return;
  }

  const lines = button.querySelectorAll(".nav-burger__line");
  if (lines.length < 3) {
    return;
  }

  let open = false;

  button.removeAttribute("for");
  button.setAttribute("role", "button");
  button.setAttribute("tabindex", "0");
  button.setAttribute("aria-controls", "main-navigation");
  button.setAttribute("aria-expanded", "false");
  nav.id = nav.id || "main-navigation";

  if (checkbox) {
    checkbox.checked = false;
    checkbox.setAttribute("aria-hidden", "true");
  }

  function burgerIsVisible() {
    return window.getComputedStyle(button).display !== "none";
  }

  function close() {
    open = false;
    if (burgerIsVisible()) {
      applyMobileLinkStyles(nav);
      applyClosedState(nav, button, lines);
    } else {
      resetNavbar(nav, button, checkbox, lines);
    }
  }

  function openMenu() {
    open = true;
    applyMobileLinkStyles(nav);
    applyOpenState(nav, button, lines);
  }

  function toggle(event) {
    event.preventDefault();

    if (!burgerIsVisible()) {
      return;
    }

    if (checkbox) {
      checkbox.checked = false;
    }

    if (open) {
      close();
    } else {
      openMenu();
    }
  }

  button.addEventListener("click", toggle);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      toggle(event);
    }
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (burgerIsVisible()) {
        close();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!open || !burgerIsVisible()) {
      return;
    }

    if (!header.contains(event.target)) {
      close();
    }
  });

  window.addEventListener("resize", close);
  close();
}

document.addEventListener("DOMContentLoaded", initNavbarToggle);
