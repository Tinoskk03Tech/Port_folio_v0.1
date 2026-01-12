// script.js
(() => {
  const body = document.body;

  // ----- Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ----- Theme (dark par défaut)
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");

  const THEME_KEY = "portfolio_theme"; // "dark" | "light"

  function applyTheme(theme) {
    const isLight = theme === "light";
    body.classList.toggle("light", isLight);
    body.classList.toggle("dark", !isLight);

    if (themeIcon) themeIcon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
    if (themeLabel) themeLabel.textContent = isLight ? "Light" : "Dark";
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });

  // ----- Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function setMenu(open) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    navToggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  navToggle?.addEventListener("click", () => {
    const open = !navMenu?.classList.contains("is-open");
    setMenu(open);
  });

  // Close menu when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (!navMenu || !navToggle) return;
    const target = e.target;
    const isClickInside = navMenu.contains(target) || navToggle.contains(target);
    if (!isClickInside && navMenu.classList.contains("is-open")) setMenu(false);
  });

  // Close menu on resize to desktop
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 860px)").matches) setMenu(false);
  });

  // ----- Smooth scroll (ancres)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile menu after click
      setMenu(false);
    });
  });

  // ----- Reveal on scroll
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  // ----- Form validation (front only)
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formStatus = document.getElementById("formStatus");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  function setStatus(type, msg) {
    if (!formStatus) return;
    formStatus.classList.remove("is-success", "is-error");
    if (type) formStatus.classList.add(type === "success" ? "is-success" : "is-error");
    formStatus.textContent = msg || "";
  }

  function setFieldError(el, errorEl, msg) {
    if (errorEl) errorEl.textContent = msg || "";
    if (el) el.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validate() {
    let ok = true;
    setStatus("", "");

    const nameVal = (nameInput?.value || "").trim();
    const emailVal = (emailInput?.value || "").trim();
    const msgVal = (messageInput?.value || "").trim();

    if (!nameVal) {
      ok = false;
      setFieldError(nameInput, nameError, "Le nom est requis.");
    } else {
      setFieldError(nameInput, nameError, "");
    }

    if (!emailVal) {
      ok = false;
      setFieldError(emailInput, emailError, "L’email est requis.");
    } else if (!emailRegex.test(emailVal)) {
      ok = false;
      setFieldError(emailInput, emailError, "Format d’email invalide.");
    } else {
      setFieldError(emailInput, emailError, "");
    }

    if (!msgVal) {
      ok = false;
      setFieldError(messageInput, messageError, "Le message est requis.");
    } else if (msgVal.length < 10) {
      ok = false;
      setFieldError(messageInput, messageError, "Message trop court (min. 10 caractères).");
    } else {
      setFieldError(messageInput, messageError, "");
    }

    return ok;
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
      setStatus("error", "Veuillez corriger les erreurs du formulaire.");
      return;
    }

    // Pas de backend : on simule un envoi
    setStatus("success", "Message envoyé (simulation). Je reviens vers vous rapidement !");
    form.reset();

    // Reset aria-invalid after reset
    [nameInput, emailInput, messageInput].forEach((el) => el?.setAttribute("aria-invalid", "false"));
  });

  // Validate on blur for quick feedback
  [nameInput, emailInput, messageInput].forEach((el) => {
    el?.addEventListener("blur", () => validate());
  });
})();