/* ===========================
   THE DIGITAL CURATOR — JS
   =========================== */

// ── STATE ──
let state = {
  fullName: 'Alex Silva',
  jobTitle: 'Senior UI Designer',
  email: 'alex.silva@email.com',
  phone: '+55 11 99999-9999',
  location: 'São Paulo, SP',
  linkedin: '',
  summary: '',
  tags: ['UI/UX Design', 'Figma', 'React & Tailwind'],
  experience: [
    {
      company: 'Tech Flow Studios',
      role: 'Lead Product Designer',
      period: '2021 — Presente',
      desc: 'Liderança de equipe de design para produtos SaaS, redução de churn em 75% através de melhorias na UX e implementação de design systems escaláveis.'
    },
    {
      company: 'Creative Agency X',
      role: 'UI Designer Pleno',
      period: '2018 — 2021',
      desc: 'Criação de interfaces responsivas e protótipos de alta fidelidade para clientes internacionais no setor de fintech e e-commerce.'
    }
  ],
  education: [
    {
      institution: 'Universidade de Design',
      course: 'Bacharelado em Design Gráfico',
      start: '2014',
      end: '2018',
      current: false
    }
  ],
  skills: [
    { name: 'Visual Design',  level: 90 },
    { name: 'Prototipação',   level: 80 },
    { name: 'Design Systems', level: 75 },
    { name: 'User Research',  level: 70 }
  ],
  certs: [],
  projects: []
};

let zoomLevel = 1;

// ── INIT ──
function init() {
  loadFromState();
  renderTags();
  renderExperience();
  renderEducation();
  renderSkills();
  renderCerts();
  renderProjects();
  renderCV();
}

function loadFromState() {
  document.getElementById('fullName').value  = state.fullName;
  document.getElementById('jobTitle').value  = state.jobTitle;
  document.getElementById('email').value     = state.email;
  document.getElementById('phone').value     = state.phone;
  document.getElementById('location').value  = state.location;
  document.getElementById('linkedin').value  = state.linkedin;
  document.getElementById('summary').value   = state.summary;
}

// ── TABS ──
function setTab(name, el) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('visible');
  el.classList.add('active');
}

// ── LIVE UPDATE ──
function liveUpdate() {
  state.fullName = document.getElementById('fullName').value;
  state.jobTitle = document.getElementById('jobTitle').value;
  state.email    = document.getElementById('email').value;
  state.phone    = document.getElementById('phone').value;
  state.location = document.getElementById('location').value;
  state.linkedin = document.getElementById('linkedin').value;
  state.summary  = document.getElementById('summary').value;
  renderCV();
}

function updatePreview() {
  liveUpdate();
  showToast('Preview atualizado!');
}

// ── TAGS ──
function renderTags() {
  const container = document.getElementById('skills-tags');
  container.innerHTML = '';
  state.tags.forEach((tag, i) => {
    const el = document.createElement('div');
    el.className = 'tag';
    el.innerHTML = `${tag} <span class="tag-remove" onclick="removeTag(${i})">×</span>`;
    container.appendChild(el);
  });
}

function removeTag(i) {
  state.tags.splice(i, 1);
  renderTags();
  renderCV();
}

function promptAddTag() {
  const inp = document.getElementById('tag-inline-input');
  inp.style.display = 'inline-block';
  inp.focus();
}

function handleTagInput(e) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) {
      state.tags.push(val);
      renderTags();
      renderCV();
    }
    e.target.value = '';
    e.target.style.display = 'none';
  }
  if (e.key === 'Escape') {
    e.target.value = '';
    e.target.style.display = 'none';
  }
}

// ── EXPERIENCE ──
function renderExperience() {
  const el = document.getElementById('experience-list');
  el.innerHTML = '';
  state.experience.forEach((exp, i) => el.appendChild(makeExpCard(exp, i)));
}

function makeExpCard(exp, i) {
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-title">Entrada ${i + 1}</span>
      <button class="btn-remove-entry" onclick="removeEntry('experience', ${i})">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Empresa</label>
        <input class="form-input" value="${exp.company}" oninput="updateEntry('experience', ${i}, 'company', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Cargo</label>
        <input class="form-input" value="${exp.role}" oninput="updateEntry('experience', ${i}, 'role', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Período</label>
        <input class="form-input" value="${exp.period}" oninput="updateEntry('experience', ${i}, 'period', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea class="form-textarea" style="min-height:60px" oninput="updateEntry('experience', ${i}, 'desc', this.value)">${exp.desc}</textarea>
      </div>
    </div>
  `;
  return card;
}

function addExperience() {
  state.experience.push({ company: '', role: '', period: '', desc: '' });
  renderExperience();
}

// ── EDUCATION ──
function renderEducation() {
  const el = document.getElementById('education-list');
  el.innerHTML = '';
  state.education.forEach((edu, i) => el.appendChild(makeEduCard(edu, i)));
}

function makeEduCard(edu, i) {
  const card = document.createElement('div');
  card.className = 'entry-card';
  card.innerHTML = `
    <div class="entry-card-header">
      <span class="entry-card-title">Formação ${i + 1}</span>
      <button class="btn-remove-entry" onclick="removeEntry('education', ${i})">×</button>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Instituição</label>
        <input class="form-input" value="${edu.institution}" placeholder="Instituição" oninput="updateEntry('education', ${i}, 'institution', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Curso</label>
        <input class="form-input" value="${edu.course}" placeholder="Curso" oninput="updateEntry('education', ${i}, 'course', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Ano Início</label>
        <input class="form-input" value="${edu.start}" placeholder="Ano Início" oninput="updateEntry('education', ${i}, 'start', this.value)" />
      </div>
      <div class="form-group">
        <label class="form-label">Ano Fim</label>
        <input class="form-input" value="${edu.end}" placeholder="Ano Fim" ${edu.current ? 'disabled' : ''} oninput="updateEntry('education', ${i}, 'end', this.value)" />
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" ${edu.current ? 'checked' : ''} onchange="updateEntry('education', ${i}, 'current', this.checked); renderEducation();" />
          Cursando
        </label>
      </div>
    </div>
  `;
  return card;
}

function addEducation() {
  state.education.push({ institution: '', course: '', start: '', end: '', current: false });
  renderEducation();
}

// ── SKILLS ──
function renderSkills() {
  const el = document.getElementById('skills-list');
  el.innerHTML = '';
  state.skills.forEach((sk, i) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-title">${sk.name || 'Habilidade ' + (i + 1)}</span>
        <button class="btn-remove-entry" onclick="removeEntry('skills', ${i})">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" value="${sk.name}" placeholder="Nome da habilidade"
            oninput="updateEntry('skills', ${i}, 'name', this.value); renderSkills();" />
        </div>
        <div class="form-group">
          <label class="form-label">Nível (${sk.level}%)</label>
          <input type="range" min="0" max="100" value="${sk.level}"
            style="width:100%;accent-color:var(--accent);margin-top:6px"
            oninput="updateEntry('skills', ${i}, 'level', +this.value); this.previousElementSibling.textContent='Nível (' + this.value + '%)';"
            onchange="renderCV()" />
        </div>
      </div>
    `;
    el.appendChild(card);
  });
}

function addSkill() {
  state.skills.push({ name: '', level: 70 });
  renderSkills();
}

// ── CERTS ──
function renderCerts() {
  const el = document.getElementById('certs-list');
  el.innerHTML = '';
  state.certs.forEach((cert, i) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-title">Certificado ${i + 1}</span>
        <button class="btn-remove-entry" onclick="removeEntry('certs', ${i})">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" value="${cert.name || ''}" placeholder="Nome do certificado" oninput="updateEntry('certs', ${i}, 'name', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Emissor</label>
          <input class="form-input" value="${cert.issuer || ''}" placeholder="Organização emissora" oninput="updateEntry('certs', ${i}, 'issuer', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Ano</label>
          <input class="form-input" value="${cert.year || ''}" placeholder="Ano" oninput="updateEntry('certs', ${i}, 'year', this.value)" />
        </div>
      </div>
    `;
    el.appendChild(card);
  });
}

function addCert() {
  state.certs.push({ name: '', issuer: '', year: '' });
  renderCerts();
}

// ── PROJECTS ──
function renderProjects() {
  const el = document.getElementById('projects-list');
  el.innerHTML = '';
  state.projects.forEach((proj, i) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-title">Projeto ${i + 1}</span>
        <button class="btn-remove-entry" onclick="removeEntry('projects', ${i})">×</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" value="${proj.name || ''}" placeholder="Nome do projeto" oninput="updateEntry('projects', ${i}, 'name', this.value)" />
        </div>
        <div class="form-group">
          <label class="form-label">Link</label>
          <input class="form-input" value="${proj.link || ''}" placeholder="URL ou repositório" oninput="updateEntry('projects', ${i}, 'link', this.value)" />
        </div>
        <div class="form-group full">
          <label class="form-label">Descrição</label>
          <textarea class="form-textarea" style="min-height:60px" oninput="updateEntry('projects', ${i}, 'desc', this.value)">${proj.desc || ''}</textarea>
        </div>
      </div>
    `;
    el.appendChild(card);
  });
}

function addProject() {
  state.projects.push({ name: '', link: '', desc: '' });
  renderProjects();
}

// ── ENTRY HELPERS ──
function updateEntry(arr, i, field, val) {
  state[arr][i][field] = val;
  renderCV();
}

function removeEntry(arr, i) {
  state[arr].splice(i, 1);
  if      (arr === 'experience') renderExperience();
  else if (arr === 'education')  renderEducation();
  else if (arr === 'skills')     renderSkills();
  else if (arr === 'certs')      renderCerts();
  else if (arr === 'projects')   renderProjects();
  renderCV();
}

// ── RENDER CV ──
function renderCV() {
  const doc   = document.getElementById('cv-doc');
  const name  = state.fullName || 'Seu Nome';
  const title = state.jobTitle || 'Cargo';

  // Experience
  let expHTML = '';
  state.experience.forEach(exp => {
    if (!exp.company) return;
    expHTML += `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <span class="cv-entry-company">${exp.company}</span>
          <span class="cv-entry-date">${exp.period}</span>
        </div>
        <div class="cv-entry-role">${exp.role}</div>
        ${exp.desc ? `<div class="cv-entry-desc">${exp.desc}</div>` : ''}
      </div>
    `;
  });

  // Education
  let eduHTML = '';
  state.education.forEach(edu => {
    if (!edu.institution) return;
    const period = edu.start
      ? `${edu.start} — ${edu.current ? 'Cursando' : edu.end}`
      : '';
    eduHTML += `
      <div class="cv-entry">
        <div class="cv-entry-header">
          <span class="cv-entry-company">${edu.institution}</span>
          <span class="cv-entry-date">${period}</span>
        </div>
        <div class="cv-entry-role">${edu.course}</div>
      </div>
    `;
  });

  // Skills bars
  let skillsHTML = '';
  if (state.skills.length > 0) {
    skillsHTML = '<div class="cv-skills-grid">';
    state.skills.forEach(sk => {
      if (!sk.name) return;
      skillsHTML += `
        <div class="cv-skill-row">
          <span class="cv-skill-name">${sk.name}</span>
          <div class="cv-skill-bar">
            <div class="cv-skill-fill" style="width:${sk.level}%"></div>
          </div>
        </div>
      `;
    });
    skillsHTML += '</div>';
  }

  // Tags / competências
  let tagsHTML = '';
  if (state.tags.length > 0) {
    tagsHTML = '<div class="cv-tags-row">';
    state.tags.forEach(t => { tagsHTML += `<span class="cv-tag">${t}</span>`; });
    tagsHTML += '</div>';
  }

  // Certs
  let certsHTML = '';
  state.certs.forEach(c => {
    if (!c.name) return;
    certsHTML += `
      <div class="cv-entry">
        <div class="cv-entry-company">${c.name}</div>
        <div class="cv-entry-role">${c.issuer}${c.year ? ' · ' + c.year : ''}</div>
      </div>
    `;
  });

  // Projects
  let projHTML = '';
  state.projects.forEach(p => {
    if (!p.name) return;
    projHTML += `
      <div class="cv-entry">
        <div class="cv-entry-company">${p.name}</div>
        ${p.desc ? `<div class="cv-entry-desc">${p.desc}</div>` : ''}
      </div>
    `;
  });

  doc.innerHTML = `
    <div class="cv-top">
      <div>
        <div class="cv-name">${name.toUpperCase()}</div>
        <div class="cv-role">${title}</div>
      </div>
      <div class="cv-contact">
        ${state.email    ? state.email    + '<br>' : ''}
        ${state.phone    ? state.phone    + '<br>' : ''}
        ${state.location ? state.location          : ''}
      </div>
    </div>

    ${state.summary ? `<div class="cv-entry-desc" style="margin-bottom:10px;font-size:8px">${state.summary}</div>` : ''}

    ${expHTML    ? `<hr class="cv-divider"><div class="cv-section-title">Experiência Profissional</div>${expHTML}`  : ''}
    ${eduHTML    ? `<hr class="cv-divider"><div class="cv-section-title">Formação Acadêmica</div>${eduHTML}`        : ''}
    ${skillsHTML ? `<hr class="cv-divider"><div class="cv-section-title">Habilidades</div>${skillsHTML}`            : ''}
    ${tagsHTML   ? `<hr class="cv-divider"><div class="cv-section-title">Competências</div>${tagsHTML}`             : ''}
    ${certsHTML  ? `<hr class="cv-divider"><div class="cv-section-title">Certificados</div>${certsHTML}`            : ''}
    ${projHTML   ? `<hr class="cv-divider"><div class="cv-section-title">Projetos</div>${projHTML}`                 : ''}
  `;
}

// ── ZOOM ──
function zoomPreview(delta) {
  zoomLevel = Math.min(1.5, Math.max(0.5, zoomLevel + delta));
  document.getElementById('cv-doc').style.transform = `scale(${zoomLevel})`;
}

// ── CLEAR DATA ──
function clearData() {
  if (!confirm('Limpar todos os dados?')) return;
  state = {
    fullName: '', jobTitle: '', email: '', phone: '',
    location: '', linkedin: '', summary: '',
    tags: [], experience: [], education: [],
    skills: [], certs: [], projects: []
  };
  loadFromState();
  renderTags();
  renderExperience();
  renderEducation();
  renderSkills();
  renderCerts();
  renderProjects();
  renderCV();
  showToast('Dados limpos.');
}

// ── GENERATE PDF ──
function generatePDF() {
  const { lines, fileName } = buildPdfDataFromState();
  const pdfBytes = createPdfDocument(lines);
  downloadPdf(pdfBytes, fileName);
  showToast('PDF gerado com sucesso.');
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── THEME ──
function toggleTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initTheme() {
  const saved       = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark      = saved ? saved === 'dark' : prefersDark;
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.getElementById('theme-checkbox').checked = true;
  }
}

function buildPdfDataFromState() {
  const lines = [];

  lines.push((state.fullName || 'Seu Nome').trim());
  if (state.jobTitle) lines.push(state.jobTitle.trim());
  lines.push('');

  if (state.email) lines.push(`E-mail: ${state.email.trim()}`);
  if (state.phone) lines.push(`Telefone: ${state.phone.trim()}`);
  if (state.location) lines.push(`Localização: ${state.location.trim()}`);
  if (state.linkedin) lines.push(`LinkedIn/Site: ${state.linkedin.trim()}`);
  lines.push('');

  pushSection(lines, 'RESUMO', state.summary ? [state.summary] : []);
  pushSection(lines, 'COMPETÊNCIAS', state.tags, true);

  const expLines = [];
  state.experience.forEach((item) => {
    if (!item.company) return;
    expLines.push(`${item.company}${item.period ? ` (${item.period})` : ''}`);
    if (item.role) expLines.push(`Cargo: ${item.role}`);
    if (item.desc) expLines.push(item.desc);
    expLines.push('');
  });
  pushSection(lines, 'EXPERIÊNCIA', expLines.filter(Boolean));

  const eduLines = [];
  state.education.forEach((item) => {
    if (!item.institution) return;
    const end = item.current ? 'Cursando' : (item.end || '');
    const period = item.start ? `${item.start}${end ? ` — ${end}` : ''}` : '';
    eduLines.push(`${item.institution}${period ? ` (${period})` : ''}`);
    if (item.course) eduLines.push(item.course);
    eduLines.push('');
  });
  pushSection(lines, 'FORMAÇÃO', eduLines.filter(Boolean));

  const skillLines = state.skills
    .filter((item) => item.name)
    .map((item) => `${item.name} (${item.level || 0}%)`);
  pushSection(lines, 'HABILIDADES', skillLines, true);

  const certLines = state.certs
    .filter((item) => item.name)
    .map((item) => `${item.name}${item.issuer ? ` — ${item.issuer}` : ''}${item.year ? ` (${item.year})` : ''}`);
  pushSection(lines, 'CERTIFICADOS', certLines, true);

  const projectLines = [];
  state.projects.forEach((item) => {
    if (!item.name) return;
    projectLines.push(item.name);
    if (item.link) projectLines.push(`Link: ${item.link}`);
    if (item.desc) projectLines.push(item.desc);
    projectLines.push('');
  });
  pushSection(lines, 'PROJETOS', projectLines.filter(Boolean));

  return {
    lines,
    fileName: makePdfFileName(state.fullName)
  };
}

function pushSection(targetLines, title, contentLines, asBullets = false) {
  if (!contentLines || contentLines.length === 0) return;

  targetLines.push(title);
  if (asBullets) {
    contentLines.forEach((line) => targetLines.push(`• ${line}`));
  } else {
    contentLines.forEach((line) => targetLines.push(line));
  }
  targetLines.push('');
}

function makePdfFileName(name) {
  const safe = (name || 'curriculo')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  return `${safe || 'curriculo'}-${new Date().toISOString().slice(0, 10)}.pdf`;
}

function createPdfDocument(lines) {
  const startY = 800;
  const bottomMargin = 50;
  const lineHeight = 16;
  const pages = [];
  let currentPage = [];
  let y = startY;

  lines.forEach((rawLine) => {
    if (y < bottomMargin) {
      pages.push(currentPage);
      currentPage = [];
      y = startY;
    }

    currentPage.push(`BT /F1 11 Tf 40 ${y} Td (${escapePdfText(rawLine || ' ')}) Tj ET`);
    y -= lineHeight;
  });

  if (currentPage.length === 0) {
    currentPage.push('BT /F1 11 Tf 40 800 Td (Currículo) Tj ET');
  }
  pages.push(currentPage);

  return buildPdfBytes(pages);
}

function buildPdfBytes(pageStreams) {
  const objects = {};
  let nextId = 1;

  const fontId = nextId++;
  objects[fontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  const contentIds = pageStreams.map(() => nextId++);
  const pageIds = pageStreams.map(() => nextId++);
  const pagesId = nextId++;
  const catalogId = nextId++;

  pageStreams.forEach((commands, index) => {
    const stream = commands.join('\n');
    objects[contentIds[index]] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[pagesId] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] >>`;

  pageIds.forEach((pageId, index) => {
    objects[pageId] = [
      '<< /Type /Page',
      `/Parent ${pagesId} 0 R`,
      '/MediaBox [0 0 595 842]',
      `/Resources << /Font << /F1 ${fontId} 0 R >> >>`,
      `/Contents ${contentIds[index]} 0 R`,
      '>>'
    ].join(' ');
  });

  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  const maxId = catalogId;

  for (let id = 1; id <= maxId; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${maxId + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let id = 1; id <= maxId; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${maxId + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return new TextEncoder().encode(pdf);
}

function escapePdfText(text) {
  return (text || '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function downloadPdf(bytes, fileName) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ── START ──
initTheme();
init();
