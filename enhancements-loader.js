"use strict";

// Loader isolado para evitar conflitos em script.js
(function loadEnhancementModules() {
  const head = document.head || document.getElementsByTagName("head")[0];
  if (!head) return;

  appendCss("theme-toggle.css");
  appendCss("template-enhancements.css");

  appendScript("template-enhancements.js", () => appendScript("theme-toggle.js"));

  function appendCss(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    head.appendChild(link);
  }

  function appendScript(src, onload) {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    if (typeof onload === "function") script.addEventListener("load", onload);
    head.appendChild(script);
  }
})();
