"use strict";

(function templateEnhancements() {
  const STORAGE_PREFIX = "cv_pdf_";
  const TEMPLATE_KEY = `${STORAGE_PREFIX}template`;
  const EXTRA_KEYS = ["experience", "projects", "portfolio"];
  const DEFAULT_TEMPLATE = "classic";

  const templates = Object.freeze({
    classic: {
      labelObjective: "OBJETIVOS",
      labelSkills: "COMPETÊNCIAS (1 por linha)",
      headingObjective: "OBJETIVOS",
      headingSkills: "COMPETÊNCIAS",
      headingExperience: "EXPERIÊNCIA",
      headingProjects: "PROJETOS",
      show: ["objective", "skills", "education", "certs", "languages", "experience", "projects"]
    },
    modern: {
      labelObjective: "RESUMO PROFISSIONAL",
      labelSkills: "STACK / TECNOLOGIAS",
      headingObjective: "RESUMO PROFISSIONAL",
      headingSkills: "STACK",
      headingExperience: "IMPACTO",
      headingProjects: "CASOS",
      show: ["objective", "skills", "education", "experience", "projects", "certs"]
    },
    minimal: {
      labelObjective: "SOBRE MIM",
      labelSkills: "PONTOS FORTES",
      headingObjective: "SOBRE",
      headingSkills: "PONTOS FORTES",
      headingExperience: "TRAJETÓRIA",
      headingProjects: "TRABALHOS",
      show: ["objective", "skills", "education", "experience"]
    },
    corporate: {
      labelObjective: "RESUMO EXECUTIVO",
      labelSkills: "COMPETÊNCIAS ESTRATÉGICAS",
      headingObjective: "RESUMO EXECUTIVO",
      headingSkills: "COMPETÊNCIAS-CHAVE",
      headingExperience: "RESULTADOS E LIDERANÇA",
      headingProjects: "INICIATIVAS",
      show: ["objective", "skills", "education", "certs", "languages", "experience"]
    },
    creative: {
      labelObjective: "MANIFESTO CRIATIVO",
      labelSkills: "FERRAMENTAS E LINGUAGENS",
      headingObjective: "MANIFESTO",
      headingSkills: "FERRAMENTAS",
      headingExperience: "EXPERIÊNCIAS",
      headingProjects: "PORTFÓLIO",
      show: ["objective", "skills", "projects", "experience", "languages"]
    }
  });

  const formCard = document.querySelector(".grid .card");
  const paperBody = document.querySelector("#pdfArea .paper-body");
  const contactBox = document.getElementById("pContact");
  const btnPreview = document.getElementById("btnPreview");
  const btnPdf = document.getElementById("btnPdf");
  const btnClear = document.getElementById("btnClear");

  if (!formCard || !paperBody || !contactBox) return;

  ensureFormFields();
  ensurePreviewBlocks();

  const refs = collectRefs();
  if (!refs.template || !refs.objectiveLabel || !refs.blockObjective) return;

  restoreTemplate();
  restoreExtraFields();
  bindEvents();
  updateTemplateUI();

  function ensureFormFields() {
    const nameLabel = document.querySelector('label input#name')?.closest("label");

    if (!document.getElementById("template") && nameLabel) {
      const wrap = document.createElement("label");
      wrap.innerHTML = 'Modelo do currículo<select id="template" aria-label="Selecionar modelo de currículo"><option value="classic">Clássico</option><option value="modern">Moderno</option><option value="minimal">Minimalista</option><option value="corporate">Corporativo</option><option value="creative">Criativo</option></select>';
      formCard.insertBefore(wrap, nameLabel);
    }

    const skillsLabel = document.querySelector('label textarea#skills')?.closest("label");
    if (skillsLabel && !document.getElementById("experience")) {
      const exp = document.createElement("label");
      exp.innerHTML = '<span id="labelExperience">EXPERIÊNCIA / DESTAQUES</span><textarea id="experience" rows="5" maxlength="900" placeholder="Descreva resultados e experiências principais..."></textarea>';
      skillsLabel.insertAdjacentElement("afterend", exp);
    }
    if (skillsLabel && !document.getElementById("projects")) {
      const proj = document.createElement("label");
      proj.innerHTML = '<span id="labelProjects">PROJETOS (1 por linha)</span><textarea id="projects" rows="4" maxlength="700" placeholder="Projeto A — breve descrição&#10;Projeto B — breve descrição"></textarea>';
      document.getElementById("experience")?.closest("label")?.insertAdjacentElement("afterend", proj);
    }
    if (!document.getElementById("portfolio")) {
      const languagesLabel = document.querySelector('label textarea#languages')?.closest("label");
      if (languagesLabel) {
        const port = document.createElement("label");
        port.innerHTML = 'Portfólio/Website (opcional)<input id="portfolio" placeholder="Ex: meuportfolio.dev" inputmode="url" maxlength="140" />';
        languagesLabel.insertAdjacentElement("afterend", port);
      }
    }

    const objectiveLabel = document.querySelector('label textarea#objective')?.closest("label");
    if (objectiveLabel && !document.getElementById("labelObjective")) {
      const text = objectiveLabel.firstChild?.textContent?.trim() || "OBJETIVOS";
      objectiveLabel.firstChild.textContent = "";
      const span = document.createElement("span");
      span.id = "labelObjective";
      span.textContent = text;
      objectiveLabel.prepend(span);
    }

    const skillsFormLabel = document.querySelector('label textarea#skills')?.closest("label");
    if (skillsFormLabel && !document.getElementById("labelSkills")) {
      const txt = skillsFormLabel.firstChild?.textContent?.trim() || "COMPETÊNCIAS (1 por linha)";
      skillsFormLabel.firstChild.textContent = "";
      const span = document.createElement("span");
      span.id = "labelSkills";
      span.textContent = txt;
      skillsFormLabel.prepend(span);
    }
  }

  function ensurePreviewBlocks() {
    const blockObjective = paperBody.querySelector(".block");
    if (blockObjective && !blockObjective.id) blockObjective.id = "blockObjective";
    const hObj = document.getElementById("pObjective")?.previousElementSibling;
    if (hObj && !hObj.id) hObj.id = "hObjective";

    const blockSkills = document.getElementById("pSkills")?.closest(".block");
    if (blockSkills && !blockSkills.id) blockSkills.id = "blockSkills";
    const hSkills = document.getElementById("pSkills")?.previousElementSibling;
    if (hSkills && !hSkills.id) hSkills.id = "hSkills";

    const blockEdu = document.getElementById("pEduInstitution")?.closest(".block");
    if (blockEdu && !blockEdu.id) blockEdu.id = "blockEducation";
    const hEdu = blockEdu?.querySelector("h4");
    if (hEdu && !hEdu.id) hEdu.id = "hEducation";

    const blockCerts = document.getElementById("pCerts")?.closest(".block");
    if (blockCerts && !blockCerts.id) blockCerts.id = "blockCerts";
    const hCerts = blockCerts?.querySelector("h4");
    if (hCerts && !hCerts.id) hCerts.id = "hCerts";

    const blockLangs = document.getElementById("pLanguages")?.closest(".block");
    if (blockLangs && !blockLangs.id) blockLangs.id = "blockLanguages";
    const hLangs = blockLangs?.querySelector("h4");
    if (hLangs && !hLangs.id) hLangs.id = "hLanguages";

    if (!document.getElementById("blockExperience")) {
      const wrap = document.createElement("div");
      wrap.className = "two";
      wrap.id = "templateExtraSections";
      wrap.innerHTML = '<div class="block" id="blockExperience"><h4 id="hExperience">EXPERIÊNCIA</h4><p id="pExperience" class="text">Adicione sua experiência principal.</p></div><div class="block" id="blockProjects"><h4 id="hProjects">PROJETOS</h4><ul id="pProjects" class="bullets"></ul></div>';
      paperBody.appendChild(wrap);
    }
  }

  function collectRefs() {
    return {
      template: document.getElementById("template"),
      objectiveLabel: document.getElementById("labelObjective"),
      skillsLabel: document.getElementById("labelSkills"),
      experienceLabel: document.getElementById("labelExperience"),
      projectsLabel: document.getElementById("labelProjects"),
      blockObjective: document.getElementById("blockObjective"),
      blockSkills: document.getElementById("blockSkills"),
      blockEducation: document.getElementById("blockEducation"),
      blockCerts: document.getElementById("blockCerts"),
      blockLanguages: document.getElementById("blockLanguages"),
      blockExperience: document.getElementById("blockExperience"),
      blockProjects: document.getElementById("blockProjects"),
      hObjective: document.getElementById("hObjective"),
      hSkills: document.getElementById("hSkills"),
      hExperience: document.getElementById("hExperience"),
      hProjects: document.getElementById("hProjects"),
      inputExperience: document.getElementById("experience"),
      inputProjects: document.getElementById("projects"),
      inputPortfolio: document.getElementById("portfolio"),
      outExperience: document.getElementById("pExperience"),
      outProjects: document.getElementById("pProjects"),
      pdfArea: document.getElementById("pdfArea"),
      printArea: document.getElementById("pdfAreaPrint")
    };
  }

  function bindEvents() {
    refs.template.addEventListener("change", () => {
      safeStorageSet(TEMPLATE_KEY, readTemplate());
      updateTemplateUI();
    });

    [refs.inputExperience, refs.inputProjects, refs.inputPortfolio].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        safeStorageSet(`${STORAGE_PREFIX}${input.id}`, input.value);
        renderExtraContent();
      });
    });

    btnPreview?.addEventListener("click", updateTemplateUI);
    btnPdf?.addEventListener("click", updateTemplateUI, true);
    btnClear?.addEventListener("click", () => {
      setTimeout(() => {
        EXTRA_KEYS.forEach((k) => {
          const input = document.getElementById(k);
          if (input) input.value = "";
          safeStorageRemove(`${STORAGE_PREFIX}${k}`);
        });
        refs.template.value = DEFAULT_TEMPLATE;
        safeStorageSet(TEMPLATE_KEY, DEFAULT_TEMPLATE);
        updateTemplateUI();
      }, 0);
    });
  }

  function restoreTemplate() {
    const saved = safeStorageGet(TEMPLATE_KEY);
    refs.template.value = templates[saved] ? saved : DEFAULT_TEMPLATE;
  }

  function restoreExtraFields() {
    EXTRA_KEYS.forEach((k) => {
      const v = safeStorageGet(`${STORAGE_PREFIX}${k}`);
      const input = document.getElementById(k);
      if (input && v !== null) input.value = v;
    });
  }

  function readTemplate() {
    return templates[refs.template.value] ? refs.template.value : DEFAULT_TEMPLATE;
  }

  function updateTemplateUI() {
    const key = readTemplate();
    const cfg = templates[key];
    refs.pdfArea.dataset.template = key;
    if (refs.printArea) refs.printArea.dataset.template = key;

    refs.objectiveLabel.textContent = cfg.labelObjective;
    refs.skillsLabel.textContent = cfg.labelSkills;
    if (refs.experienceLabel) refs.experienceLabel.textContent = "EXPERIÊNCIA / DESTAQUES";
    if (refs.projectsLabel) refs.projectsLabel.textContent = "PROJETOS (1 por linha)";

    refs.hObjective.textContent = cfg.headingObjective;
    refs.hSkills.textContent = cfg.headingSkills;
    refs.hExperience.textContent = cfg.headingExperience;
    refs.hProjects.textContent = cfg.headingProjects;

    const blocks = {
      objective: refs.blockObjective,
      skills: refs.blockSkills,
      education: refs.blockEducation,
      certs: refs.blockCerts,
      languages: refs.blockLanguages,
      experience: refs.blockExperience,
      projects: refs.blockProjects
    };
    for (const [name, el] of Object.entries(blocks)) {
      if (!el) continue;
      el.style.display = cfg.show.includes(name) ? "block" : "none";
    }

    renderExtraContent();
    renderPortfolioInContact();
  }

  function renderExtraContent() {
    if (refs.outExperience) refs.outExperience.textContent = refs.inputExperience?.value.trim() || "Adicione sua experiência principal.";

    if (!refs.outProjects) return;
    while (refs.outProjects.firstChild) refs.outProjects.removeChild(refs.outProjects.firstChild);
    const lines = (refs.inputProjects?.value || "").split("\n").map((v) => v.trim()).filter(Boolean);
    const items = lines.length > 0 ? lines : ["Adicione projetos para aparecerem aqui."];
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      refs.outProjects.appendChild(li);
    });
  }

  function renderPortfolioInContact() {
    const old = contactBox.querySelector('[data-extra="portfolio"]');
    if (old) old.remove();

    const val = refs.inputPortfolio?.value.trim();
    if (!val) return;

    const div = document.createElement("div");
    div.dataset.extra = "portfolio";
    const url = normalizeUrl(val);
    if (!url) {
      div.textContent = `Portfólio: ${val}`;
    } else {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = `Portfólio: ${val}`;
      div.appendChild(a);
    }
    contactBox.appendChild(div);
  }

  function normalizeUrl(input) {
    const raw = (input || "").trim();
    if (!raw) return null;
    const candidate = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
    try {
      const u = new URL(candidate);
      return (u.protocol === "http:" || u.protocol === "https:") ? u.toString() : null;
    } catch {
      return null;
    }
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
})();
