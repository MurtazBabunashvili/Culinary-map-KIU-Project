document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.querySelector("#register .btn-primary");

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      const firstName =
        document.getElementById("firstname")?.value.trim() || "";
      const lastName = document.getElementById("lastname")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const region = document.getElementById("region")?.value || "";
      const password = document.getElementById("password")?.value || "";
      const confirm = document.getElementById("confirm")?.value || "";
      const motivation =
        document.getElementById("motivation")?.value.trim() || "";
      const terms = document.getElementById("terms")?.checked;

      if (!firstName || !lastName) {
        showRegisterError("გთხოვთ შეიყვანოთ სახელი და გვარი.");
        return;
      }
      if (!email.includes("@")) {
        showRegisterError("გთხოვთ შეიყვანოთ სწორი ელფოსტა.");
        return;
      }
      if (password.length < 6) {
        showRegisterError("პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს.");
        return;
      }
      if (password !== confirm) {
        showRegisterError("პაროლები არ ემთხვევა.");
        return;
      }
      if (!terms) {
        showRegisterError("გთხოვთ დაეთანხმოთ მომსახურების პირობებს.");
        return;
      }

      const user = { firstName, lastName, email, region, motivation };

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "profile.html";
    });
  }

  const loginBtn = document.querySelector("#login .btn-primary");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("login-email")?.value.trim() || "";
      const password = document.getElementById("login-password")?.value || "";

      if (!email || !password) {
        showLoginError("გთხოვთ შეიყვანოთ ელფოსტა და პაროლი.");
        return;
      }

      const stored = localStorage.getItem("currentUser");
      if (!stored) {
        showLoginError("მომხმარებელი ვერ მოიძებნა. გთხოვთ დარეგისტრირდეთ.");
        return;
      }

      const { email: storedEmail } = JSON.parse(stored);

      if (email.toLowerCase() !== storedEmail.toLowerCase()) {
        showLoginError("ელფოსტა ან პაროლი არასწორია.");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "profile.html";
    });
  }

  function showRegisterError(msg) {
    let err = document.getElementById("register-error");
    if (!err) {
      err = document.createElement("p");
      err.id = "register-error";
      Object.assign(err.style, {
        color: "#8b2635",
        background: "#fdf0f0",
        border: "1px solid #e8c0c0",
        borderRadius: "8px",
        padding: "0.6rem 1rem",
        fontFamily: "Nunito, sans-serif",
        fontSize: "0.88rem",
        marginBottom: "0.5rem",
      });
      const btn = document.querySelector("#register .btn-primary");
      if (btn) btn.insertAdjacentElement("beforebegin", err);
    }
    err.textContent = msg;
  }

  function showLoginError(msg) {
    let err = document.getElementById("login-error");
    if (!err) {
      err = document.createElement("p");
      err.id = "login-error";
      Object.assign(err.style, {
        color: "#8b2635",
        background: "#fdf0f0",
        border: "1px solid #e8c0c0",
        borderRadius: "8px",
        padding: "0.6rem 1rem",
        fontFamily: "Nunito, sans-serif",
        fontSize: "0.88rem",
        marginBottom: "0.5rem",
      });
      const btn = document.querySelector("#login .btn-primary");
      if (btn) btn.insertAdjacentElement("beforebegin", err);
    }
    err.textContent = msg;
  }
});
