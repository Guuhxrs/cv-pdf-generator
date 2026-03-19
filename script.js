"use strict";

/**
 * Clean + seguro + confiável:
 * - Sem innerHTML com dados do usuário (evita XSS)
 * - Links validados com URL() (bloqueia esquemas perigosos)
 * - localStorage com try/catch
 * - Sanitização leve e validação em runtime
 * - Bloqueios durante digitação (nome só letras, período só números/símbolos etc.)
 */

const FIELD_IDS = Object.freeze([
  "template", "name", "phone", "email", "github", "linkedin",
  "objective", "skills",
  "eduInstitution", "eduCourse", "eduPeriod", "eduDescription",
  "certs", "languages"
]);

const STORAGE_KEY_PREFIX = "cv_pdf_";
const DEFAULT_TEMPLATE = "classic";

const ui = Object.freeze({
  status: getEl("status"),
  pdfArea: getEl("pdfArea"),

  btnPreview: getEl("btnPreview"),
  btnPdf: getEl("btnPdf"),
  btnClear: getEl("btnClear"),

  inputs: FIELD_IDS.reduce((acc, id) => {
    acc[id] = getEl(id);
    return acc;
  }, {}),

  out: Object.freeze({
    name: getEl("pName"),
    contact: getEl("pContact"),
    objective: getEl("pObjective"),
    skills: getEl("pSkills"),
    eduInstitution: getEl("pEduInstitution"),
    eduCourse: getEl("pEduCourse"),
    eduPeriod: getEl("pEduPeriod"),
    eduDescription: getEl("pEduDescription"),
    certs: getEl("pCerts"),
    languages: getEl("pLanguages")
  })
});

const validators = Object.freeze({
  name: {
    // letras (com acentos), espaços e . ' -
    allowRegex: /[^A-Za-zÀ-ÖØ-öø-ÿ\s'.-]/g,
    validate: (v) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s'.-]{2,60}$/.test(v)
  },
  phone: {
    allowRegex: /[^0-9()\s+-]/g,
    validate: (v) => v === "" || /^[0-9()\s+-]{8,20}$/.test(v)
  },
  email: {
    allowRegex: /[^\w@\.\-+]/g,
    validate: (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
  },
  github: {
    allowRegex: /[^\w:\/\.\-]/g,
    validate: (v) => v === "" || /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]{1,39}\/?$/.test(v)
  },
  linkedin: {
    allowRegex: /[^\w:\/\.\-%]/g,
    validate: (v) => v === "" || /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_%]+\/?$/.test(v)
  },
  eduInstitution: {
    allowRegex: /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s'.-]/g,
    validate: (v) => v === "" || /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'.-]{2,80}$/.test(v)
  },
  eduCourse: {
    allowRegex: /[^A-Za-zÀ-ÖØ-öø-ÿ0-9\s'.-]/g,
    validate: (v) => v === "" || /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s'.-]{2,80}$/.test(v)
  },
  eduPeriod: {
    allowRegex: /[^0-9\s\-–/]/g,
    validate: (v) => v === "" || /^[0-9\s\-–/]{4,25}$/.test(v)
  }
});

init();

function init() {
  bindEvents();
  restoreFormFromStorage();
  attachInputGuards();
  renderPreview();
  applyTemplateFromSelection();
  setStatus("Pronto ✅");
}

function bindEvents() {
  ui.inputs.template.addEventListener("change", applyTemplateFromSelection);
  ui.btnPreview.addEventListener("click", renderPreview);
  ui.btnPdf.addEventListener("click", generatePdf);
  ui.btnClear.addEventListener("click", clearAll);

  for (const id of FIELD_IDS) {
    ui.inputs[id].addEventListener("input", () => {
      safeStorageSet(storageKey(id), ui.inputs[id].value);
      setStatus("Salvando… 💾");
      debounceStatus("Pronto ✅", 500);
    });
  }
}

/**
 * Bloqueios enquanto digita (impede caracteres proibidos)
 * e reduz a chance do usuário colocar número em campo de letras, etc.
 */
function attachInputGuards() {
  guardInput("name");
  guardInput("phone");
  guardInput("email");
  guardInput("github");
  guardInput("linkedin");
  guardInput("eduInstitution");
  guardInput("eduCourse");
  guardInput("eduPeriod");
}

function guardInput(fieldId) {
  const rule = validators[fieldId];
  if (!rule) return;

  const el = ui.inputs[fieldId];

  el.addEventListener("input", () => {
    const raw = el.value;
    const cleaned = raw.replace(rule.allowRegex, "");
    if (cleaned !== raw) {
      const pos = el.selectionStart || cleaned.length;
      el.value = cleaned;
      try { el.setSelectionRange(pos - 1, pos - 1); } catch {}
    }
  });

  // validação visual usando a API do browser
  el.addEventListener("blur", () => {
    const v = el.value.trim();
    if (!rule.validate(v)) {
      el.setCustomValidity(el.title || "Valor inválido.");
    } else {
      el.setCustomValidity("");
    }
    // não precisa chamar reportValidity toda hora, mas ajuda
    try { el.reportValidity(); } catch {}
  });
}

function renderPreview() {
  const data = readFormData();

  // valida em runtime (mesmo se burlar HTML)
  const issues = collectValidationIssues(data);
  if (issues.length > 0) {
    setStatus(`Atenção ⚠️ (${issues.length} campo(s) inválido(s))`);
  } else {
    setStatus("Prévia atualizada ✅");
  }

  setText(ui.out.name, data.name || "Nome do usuário");
  setText(ui.out.objective, data.objective || "Preencha seus objetivos para aparecer aqui.");

  renderContact(ui.out.contact, data);
  renderBullets(ui.out.skills, splitLines(data.skills), "Adicione competências para aparecerem aqui.");

  setText(ui.out.eduInstitution, data.eduInstitution || "Instituição");
  setText(ui.out.eduCourse, data.eduCourse || "Curso");
  setText(ui.out.eduPeriod, data.eduPeriod || "Período");
  setText(ui.out.eduDescription, data.eduDescription || "Descrição da formação.");

  renderBullets(ui.out.certs, splitLines(data.certs), "Adicione certificados/cursos para aparecerem aqui.");
  renderBullets(ui.out.languages, splitLines(data.languages), "Adicione idiomas para aparecerem aqui.");
}

function generatePdf() {
  const data = readFormData();
  const issues = collectValidationIssues(data);

  if (issues.length > 0) {
    // mostra a primeira validação inválida, sem travar o app
    try { focusFirstInvalid(); } catch {}
    alert("Existem campos inválidos. Corrija antes de gerar o PDF.");
    return;
  }

  renderPreview();
  setStatus("Gerando PDF… ⏳");

  const pdfData = buildPdfData(data);
  const pdfBytes = createPdfDocument(pdfData.lines);
  downloadPdf(pdfBytes, pdfData.fileName);
  setStatus("PDF gerado com sucesso ✅");
}

function applyTemplateFromSelection() {
  const selected = ui.inputs.template.value || DEFAULT_TEMPLATE;
  const allowedTemplates = ["classic", "modern", "minimal", "corporate", "creative"];
  const safeTemplate = allowedTemplates.includes(selected) ? selected : DEFAULT_TEMPLATE;

  ui.pdfArea.dataset.template = safeTemplate;
}

function clearAll() {
  const ok = confirm("Deseja apagar os dados salvos neste dispositivo?");
  if (!ok) return;

  for (const id of FIELD_IDS) {
    ui.inputs[id].value = id === "template" ? DEFAULT_TEMPLATE : "";
    safeStorageRemove(storageKey(id));
    try { ui.inputs[id].setCustomValidity(""); } catch {}
  }

  applyTemplateFromSelection();
  renderPreview();
  setStatus("Dados apagados 🧹");
}

/* --------------------------
   Validação runtime
--------------------------- */

function collectValidationIssues(data) {
  const issues = [];

  // obrigatórios (mínimo)
  if (!validators.name.validate(data.name || "")) issues.push("name");

  // opcionais com validação
  if (!validators.phone.validate(data.phone || "")) issues.push("phone");
  if (!validators.email.validate(data.email || "")) issues.push("email");
  if (!validators.github.validate(data.github || "")) issues.push("github");
  if (!validators.linkedin.validate(data.linkedin || "")) issues.push("linkedin");
  if (!validators.eduInstitution.validate(data.eduInstitution || "")) issues.push("eduInstitution");
  if (!validators.eduCourse.validate(data.eduCourse || "")) issues.push("eduCourse");
  if (!validators.eduPeriod.validate(data.eduPeriod || "")) issues.push("eduPeriod");

  return issues;
}

function focusFirstInvalid() {
  // usa checkValidity pra pegar o primeiro que o browser considera inválido
  for (const id of FIELD_IDS) {
    const el = ui.inputs[id];
    if (typeof el.checkValidity === "function" && !el.checkValidity()) {
      el.focus();
      try { el.reportValidity(); } catch {}
      return;
    }
  }
}

/* --------------------------
   Render seguro (sem innerHTML com input)
--------------------------- */

function renderContact(container, data) {
  clearChildren(container);

  const lines = [];

  if (data.github) {
    const url = normalizeUrl(data.github);
    lines.push(url ? { label: `GitHub: ${data.github}`, url } : `GitHub: ${data.github}`);
  }

  if (data.linkedin) {
    const url = normalizeUrl(data.linkedin);
    lines.push(url ? { label: `LinkedIn: ${data.linkedin}`, url } : `LinkedIn: ${data.linkedin}`);
  }

  if (data.email) lines.push(`E-mail: ${data.email}`);
  if (data.phone) lines.push(`Telefone: ${data.phone}`);

  for (const item of lines) {
    const div = document.createElement("div");
    if (typeof item === "string") div.textContent = item;
    else div.appendChild(safeAnchor(item.url, item.label));
    container.appendChild(div);
  }
}

function renderBullets(listEl, items, emptyText) {
  clearChildren(listEl);

  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    listEl.appendChild(li);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    listEl.appendChild(li);
  }
}

/* --------------------------
   Parsing + validações
--------------------------- */

function splitLines(text) {
  return (text || "")
    .split("\n")
    .map(s => s.trim())
    .filter(Boolean);
}

function normalizeUrl(input) {
  const raw = (input || "").trim();
  if (!raw) return null;

  const candidate = raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;

  try {
    const url = new URL(candidate);
    const allowed = url.protocol === "https:" || url.protocol === "http:";
    if (!allowed) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function safeAnchor(url, label) {
  const a = document.createElement("a");
  a.href = url;
  a.textContent = label;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

/* --------------------------
   Form + Storage
--------------------------- */

function readFormData() {
  const data = {};
  for (const id of FIELD_IDS) {
    data[id] = ui.inputs[id].value.trim();
  }
  return data;
}

function restoreFormFromStorage() {
  for (const id of FIELD_IDS) {
    const saved = safeStorageGet(storageKey(id));
    if (saved !== null) ui.inputs[id].value = saved;
  }

  if (!ui.inputs.template.value) {
    ui.inputs.template.value = DEFAULT_TEMPLATE;
  }
}

function storageKey(id) {
  return `${STORAGE_KEY_PREFIX}${id}`;
}

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // evita crash
  }
}

function safeStorageRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // evita crash
  }
}

/* --------------------------
   Utils DOM + status
--------------------------- */

function getEl(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento não encontrado: #${id}`);
  return el;
}

function setText(el, text) {
  el.textContent = text;
}

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function setStatus(msg) {
  ui.status.textContent = msg;
}

function debounceStatus(msg, delayMs) {
  clearTimeout(window.__statusTimer);
  window.__statusTimer = setTimeout(() => setStatus(msg), delayMs);
}

function buildPdfData(data) {
  const experience = readOptionalInputValue("experience");
  const projects = readOptionalInputValue("projects");
  const portfolio = readOptionalInputValue("portfolio");

  const lines = [];
  lines.push(data.name || "Currículo");
  lines.push("");

  const contacts = [];
  if (data.email) contacts.push(`E-mail: ${data.email}`);
  if (data.phone) contacts.push(`Telefone: ${data.phone}`);
  if (data.github) contacts.push(`GitHub: ${data.github}`);
  if (data.linkedin) contacts.push(`LinkedIn: ${data.linkedin}`);
  if (portfolio) contacts.push(`Portfólio: ${portfolio}`);
  if (contacts.length > 0) {
    lines.push(...contacts);
    lines.push("");
  }

  pushSection(lines, "OBJETIVO", splitLines(data.objective));
  pushSection(lines, "COMPETÊNCIAS", splitLines(data.skills), true);
  pushSection(lines, "EXPERIÊNCIA", splitLines(experience));

  const educationLines = [data.eduInstitution, data.eduCourse, data.eduPeriod, data.eduDescription]
    .filter(Boolean);
  pushSection(lines, "FORMAÇÃO", educationLines);
  pushSection(lines, "PROJETOS", splitLines(projects), true);
  pushSection(lines, "CERTIFICADOS", splitLines(data.certs), true);
  pushSection(lines, "IDIOMAS", splitLines(data.languages), true);

  return {
    lines,
    fileName: makePdfFileName(data.name)
  };
}

function pushSection(targetLines, title, sectionLines, asBullets = false) {
  if (!sectionLines || sectionLines.length === 0) return;

  targetLines.push(title);
  if (asBullets) {
    for (const item of sectionLines) {
      targetLines.push(`• ${item}`);
    }
  } else {
    targetLines.push(...sectionLines);
  }
  targetLines.push("");
}

function readOptionalInputValue(id) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : "";
}

function makePdfFileName(name) {
  const clean = (name || "curriculo")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);

  return `${clean || "curriculo"}-${new Date().toISOString().slice(0, 10)}.pdf`;
}

function createPdfDocument(lines) {
  const startY = 800;
  const bottomMargin = 50;
  const lineHeight = 16;
  const pages = [];
  let currentPage = [];
  let y = startY;

  for (const rawLine of lines) {
    if (y < bottomMargin) {
      pages.push(currentPage);
      currentPage = [];
      y = startY;
    }

    const safeLine = escapePdfText(rawLine || " ");
    currentPage.push(`BT /F1 11 Tf 40 ${y} Td (${safeLine}) Tj ET`);
    y -= lineHeight;
  }

  if (currentPage.length === 0) {
    currentPage.push("BT /F1 11 Tf 40 800 Td (Currículo) Tj ET");
  }
  pages.push(currentPage);

  return buildPdfBytes(pages);
}

function buildPdfBytes(pageStreams) {
  const objects = {};
  let nextId = 1;

  const fontId = nextId++;
  objects[fontId] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  const contentIds = pageStreams.map(() => nextId++);
  const pageIds = pageStreams.map(() => nextId++);
  const pagesId = nextId++;
  const catalogId = nextId++;

  pageStreams.forEach((commands, index) => {
    const stream = commands.join("\n");
    objects[contentIds[index]] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[pagesId] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`;

  pageIds.forEach((pageId, index) => {
    objects[pageId] = [
      "<< /Type /Page",
      `/Parent ${pagesId} 0 R`,
      "/MediaBox [0 0 595 842]",
      `/Resources << /Font << /F1 ${fontId} 0 R >> >>`,
      `/Contents ${contentIds[index]} 0 R`,
      ">>"
    ].join(" ");
  });

  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  const maxId = catalogId;

  for (let id = 1; id <= maxId; id++) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let id = 1; id <= maxId; id++) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(pdf);
}

function escapePdfText(text) {
  return (text || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function downloadPdf(bytes, fileName) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(blobUrl);
}
