"use strict";

(function themeToggle() {
  const STORAGE_KEY = "cv_pdf_theme";
  const actions = document.querySelector(".actions");
  if (!actions) return;

  let btn = document.getElementById("btnTheme");
  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btnTheme";
    btn.type = "button";
    btn.textContent = "🌙 Tema escuro";
    btn.setAttribute("aria-label", "Alternar tema");
    actions.insertBefore(btn, actions.firstChild);
  }

  const saved = safeStorageGet(STORAGE_KEY);
  const initial = saved === "light" || saved === "dark" ? saved : "dark";
  applyTheme(initial);

  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    safeStorageSet(STORAGE_KEY, next);
  });

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "dark";
    if (document.documentElement.dataset.theme === "light") {
      btn.textContent = "☀️ Tema claro";
      btn.setAttribute("aria-label", "Alternar para tema escuro");
    } else {
      btn.textContent = "🌙 Tema escuro";
      btn.setAttribute("aria-label", "Alternar para tema claro");
    }
  }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }
})();
