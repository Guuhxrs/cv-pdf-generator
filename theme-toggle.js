"use strict";

(function themeToggle() {
  const STORAGE_KEY = "cv_pdf_theme";
  const btnTheme = document.getElementById("btnTheme");
  if (!btnTheme) return;

  restoreTheme();
  btnTheme.addEventListener("click", toggleTheme);

  function restoreTheme() {
    const saved = safeStorageGet(STORAGE_KEY);
    const valid = saved === "light" || saved === "dark" ? saved : "dark";
    applyTheme(valid);
  }

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    safeStorageSet(STORAGE_KEY, next);
  }

  function applyTheme(theme) {
    const safeTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = safeTheme;

    if (safeTheme === "light") {
      btnTheme.textContent = "☀️ Tema claro";
      btnTheme.setAttribute("aria-label", "Alternar para tema escuro");
    } else {
      btnTheme.textContent = "🌙 Tema escuro";
      btnTheme.setAttribute("aria-label", "Alternar para tema claro");
    }
  }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }
})();
