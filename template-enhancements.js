"use strict";

(function templateEnhancements() {
  const EXTRA_FIELDS = ["experience", "projects", "portfolio"];
  const STORAGE_KEY_PREFIX = "cv_pdf_";

  const templateConfig = Object.freeze({
    classic: {
      labels: { objective: "OBJETIVOS", skills: "COMPETÊNCIAS (1 por linha)", experience: "EXPERIÊNCIA / DESTAQUES", projects: "PROJETOS (1 por linha)" },
      headings: { objective: "OBJETIVOS", skills: "COMPETÊNCIAS", education: "FORMAÇÃO", certs: "CERTIFICADOS E LICENÇAS", languages: "IDIOMAS", experience: "EXPERIÊNCIA", projects: "PROJETOS" },
      show: ["objective", "skills", "education", "certs", "languages", "experience", "projects"]
    },
    modern: {
      labels: { objective: "RESUMO PROFISSIONAL", skills: "STACK / TECNOLOGIAS", experience: "IMPACTO PROFISSIONAL", projects: "CASOS / PROJETOS" },
      headings: { objective: "RESUMO PROFISSIONAL", skills: "STACK", education: "FORMAÇÃO", certs: "CERTIFICAÇÕES", languages: "IDIOMAS", experience: "IMPACTO", projects: "CASOS" },
      show: ["objective", "skills", "education", "experience", "projects", "certs"]
    },
    minimal: {
      labels: { objective: "SOBRE MIM", skills: "PONTOS FORTES", experience: "TRAJETÓRIA", projects: "TRABALHOS" },
      headings: { objective: "SOBRE", skills: "PONTOS FORTES", education: "FORMAÇÃO", certs: "CURSOS", languages: "IDIOMAS", experience: "TRAJETÓRIA", projects: "TRABALHOS" },
      show: ["objective", "skills", "education", "experience"]
    },
    corporate: {
      labels: { objective: "RESUMO EXECUTIVO", skills: "COMPETÊNCIAS ESTRATÉGICAS", experience: "RESULTADOS E LIDERANÇA", projects: "INICIATIVAS RELEVANTES" },
      headings: { objective: "RESUMO EXECUTIVO", skills: "COMPETÊNCIAS-CHAVE", education: "FORMAÇÃO ACADÊMICA", certs: "CERTIFICAÇÕES", languages: "IDIOMAS", experience: "RESULTADOS E LIDERANÇA", projects: "INICIATIVAS" },
      show: ["objective", "skills", "education", "certs", "languages", "experience"]
    },
    creative: {
      labels: { objective: "MANIFESTO CRIATIVO", skills: "FERRAMENTAS E LINGUAGENS", experience: "EXPERIÊNCIAS CRIATIVAS", projects: "PORTFÓLIO (1 por linha)" },
      headings: { objective: "MANIFESTO", skills: "FERRAMENTAS", education: "FORMAÇÃO", certs: "PRÊMIOS / CURSOS", languages: "IDIOMAS", experience: "EXPERIÊNCIAS", projects: "PORTFÓLIO" },
      show: ["objective", "skills", "projects", "experience", "languages"]
    }
  });

  const el = {
    template: document.getElementById("template"),
    btnPreview: document.getElementById("btnPreview"),
    btnPdf: document.getElementById("btnPdf"),
    btnClear: document.getElementById("btnClear"),

    inputExperience: document.getElementById("experience"),
    inputProjects: document.getElementById("projects"),
    inputPortfolio: document.getElementById("portfolio"),

    labelObjective: document.getElementById("labelObjective"),
    labelSkills: document.getElementById("labelSkills"),
    labelExperience: document.getElementById("labelExperience"),
    labelProjects: document.getElementById("labelProjects"),

    pObjective: document.getElementById("pObjective"),
    pSkills: document.getElementById("pSkills"),
    pExperience: document.getElementById("pExperience"),
    pProjects: document.getElementById("pProjects"),

    pContact: document.getElementById("pContact"),

    blockObjective: document.getElementById("blockObjective"),
    blockSkills: document.getElementById("blockSkills"),
    blockEducation: document.getElementById("blockEducation"),
    blockCerts: document.getElementById("blockCerts"),
    blockLanguages: document.getElementById("blockLanguages"),
    blockExperience: document.getElementById("blockExperience"),
    blockProjects: document.getElementById("blockProjects"),

    hObjective: document.getElementById("hObjective"),
    hSkills: document.getElementById("hSkills"),
    hEducation: document.getElementById("hEducation"),
    hCerts: document.getElementById("hCerts"),
    hLanguages: document.getElementById("hLanguages"),
    hExperience: document.getElementById("hExperience"),
    hProjects: document.getElementById("hProjects")
  };

  if (!el.template || !el.inputExperience || !el.blockObjective) return;

  init();

  function init() {
    restoreExtraFields();
    bindEvents();
    updateEnhancements();
  }

  function bindEvents() {
    [el.inputExperience, el.inputProjects, el.inputPortfolio].forEach((input) => {
      input.addEventListener("input", () => {
        safeStorageSet(storageKey(input.id), input.value);
        updateEnhancements();
      });
    });

    el.template.addEventListener("change", updateEnhancements);
    el.btnPreview.addEventListener("click", updateEnhancements);
    el.btnPdf.addEventListener("click", updateEnhancements, true);
    el.btnClear.addEventListener("click", () => {
      setTimeout(() => {
        clearExtraFieldsIfNeeded();
      }, 0);
    });
  }

  function updateEnhancements() {
    const template = readSafeTemplate();
    const config = templateConfig[template] || templateConfig.classic;

    updateLabels(config.labels);
    updateHeadings(config.headings);
    updateVisibility(config.show);
    renderExtraContent();
    ensurePortfolioInContact();
  }

  function updateLabels(labels) {
    el.labelObjective.textContent = labels.objective;
    el.labelSkills.textContent = labels.skills;
    el.labelExperience.textContent = labels.experience;
    el.labelProjects.textContent = labels.projects;
  }

  function updateHeadings(headings) {
    el.hObjective.textContent = headings.objective;
    el.hSkills.textContent = headings.skills;
    el.hEducation.textContent = headings.education;
    el.hCerts.textContent = headings.certs;
    el.hLanguages.textContent = headings.languages;
    el.hExperience.textContent = headings.experience;
    el.hProjects.textContent = headings.projects;
  }

  function updateVisibility(show) {
    const blocks = {
      objective: el.blockObjective,
      skills: el.blockSkills,
      education: el.blockEducation,
      certs: el.blockCerts,
      languages: el.blockLanguages,
      experience: el.blockExperience,
      projects: el.blockProjects
    };

    for (const [key, block] of Object.entries(blocks)) {
      block.style.display = show.includes(key) ? "block" : "none";
    }
  }

  function renderExtraContent() {
    el.pExperience.textContent = el.inputExperience.value.trim() || "Adicione sua experiência principal.";
    renderProjectList(el.pProjects, el.inputProjects.value);
  }

  function renderProjectList(list, text) {
    while (list.firstChild) list.removeChild(list.firstChild);
    const items = text.split("\n").map((line) => line.trim()).filter(Boolean);

    if (items.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Adicione projetos para aparecerem aqui.";
      list.appendChild(li);
      return;
    }

    for (const item of items) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }
  }

  function ensurePortfolioInContact() {
    const portfolioValue = el.inputPortfolio.value.trim();
    const old = el.pContact.querySelector('[data-extra="portfolio"]');
    if (old) old.remove();

    if (!portfolioValue) return;

    const line = document.createElement("div");
    line.dataset.extra = "portfolio";

    const url = normalizeUrl(portfolioValue);
    if (!url) {
      line.textContent = `Portfólio: ${portfolioValue}`;
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = `Portfólio: ${portfolioValue}`;
      line.appendChild(a);
    }

    el.pContact.appendChild(line);
  }

  function clearExtraFieldsIfNeeded() {
    const hasPrimaryData = ["name", "objective", "skills", "eduInstitution"].some((id) => {
      const node = document.getElementById(id);
      return node && node.value.trim() !== "";
    });

    if (hasPrimaryData) return;

    for (const field of EXTRA_FIELDS) {
      const input = document.getElementById(field);
      input.value = "";
      safeStorageRemove(storageKey(field));
    }

    updateEnhancements();
  }

  function restoreExtraFields() {
    for (const field of EXTRA_FIELDS) {
      const value = safeStorageGet(storageKey(field));
      if (value !== null) {
        document.getElementById(field).value = value;
      }
    }
  }

  function readSafeTemplate() {
    const allowed = ["classic", "modern", "minimal", "corporate", "creative"];
    return allowed.includes(el.template.value) ? el.template.value : "classic";
  }

  function storageKey(id) {
    return `${STORAGE_KEY_PREFIX}${id}`;
  }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  function safeStorageSet(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }

  function safeStorageRemove(key) {
    try { localStorage.removeItem(key); } catch {}
  }

  function normalizeUrl(input) {
    const raw = (input || "").trim();
    if (!raw) return null;

    const candidate = raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

    try {
      const url = new URL(candidate);
      return (url.protocol === "https:" || url.protocol === "http:") ? url.toString() : null;
    } catch {
      return null;
    }
  }
})();
