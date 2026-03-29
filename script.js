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
const API_BASE = '/api';
const LEGACY_RESUMES_STORAGE_KEY = 'myResumes.v1';
let authUser = null;
let legacySynced = false;

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
  refreshAuthState();
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
async function generatePDF() {
  const fileName = makePdfFileName(state.fullName);

  try {
    const jsPDF = await loadJsPdfLibrary();
    const pdf = createStandardResumePdf(jsPDF, state);
    pdf.save(fileName);
    showToast('PDF gerado no padrão de currículo.');
  } catch (error) {
    console.error('Falha ao gerar PDF:', error);
    showToast('Não foi possível gerar o PDF agora.');
  }
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── API HELPERS ──
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Erro ao processar requisição.');
  }
  return payload;
}

// ── MY RESUMES ──
async function getSavedResumes() {
  if (!authUser) return [];
  const payload = await apiRequest('/resumes');
  return payload.items || [];
}

function openMyResumes() {
  if (!authUser) {
    openAuthModal();
    showToast('Faça login para usar My Resumes.');
    return;
  }

  const modal = document.getElementById('my-resumes-modal');
  if (!modal) return;
  renderMyResumesList();
  modal.classList.add('show');
}

function closeMyResumes(event) {
  if (event && event.type === 'click' && event.target?.id !== 'my-resumes-modal') return;
  const modal = document.getElementById('my-resumes-modal');
  if (!modal) return;
  modal.classList.remove('show');
}

async function renderMyResumesList() {
  const list = document.getElementById('my-resumes-list');
  if (!list) return;

  try {
    list.innerHTML = '<div class="resume-empty">Carregando...</div>';
    const resumes = await getSavedResumes();
    if (!resumes.length) {
      list.innerHTML = '<div class="resume-empty">Nenhuma versão salva ainda.</div>';
      return;
    }

    list.innerHTML = resumes.map((item, index) => `
      <div class="resume-item">
        <div class="resume-item-main">
          <div class="resume-item-name">${escapeHtml(item.name || `Versão ${index + 1}`)}</div>
          <div class="resume-item-date">${new Date(item.updated_at || item.created_at).toLocaleString('pt-BR')}</div>
        </div>
        <div class="resume-item-actions">
          <button class="btn-clear" onclick="loadSavedResume(${item.id})">Carregar</button>
          <button class="btn-clear" onclick="deleteSavedResume(${item.id})">Excluir</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    list.innerHTML = `<div class="resume-empty">${escapeHtml(error.message)}</div>`;
  }
}

async function saveCurrentResume() {
  if (!authUser) return;
  const currentName = (state.fullName || 'Currículo').trim();
  const name = prompt('Nome para esta versão:', `${currentName} - ${new Date().toLocaleDateString('pt-BR')}`);
  if (name === null) return;

  const trimmed = name.trim();
  if (!trimmed) {
    showToast('Informe um nome para salvar.');
    return;
  }

  try {
    await apiRequest('/resumes', {
      method: 'POST',
      body: JSON.stringify({ name: trimmed, stateSnapshot: state })
    });
    await renderMyResumesList();
    showToast('Versão salva com sucesso.');
  } catch (error) {
    showToast(error.message);
  }
}

async function loadSavedResume(resumeId) {
  try {
    const resumes = await getSavedResumes();
    const selected = resumes.find((item) => item.id === resumeId);
    if (!selected?.state_snapshot) {
      showToast('Versão inválida.');
      return;
    }

    state = selected.state_snapshot;
    loadFromState();
    renderTags();
    renderExperience();
    renderEducation();
    renderSkills();
    renderCerts();
    renderProjects();
    renderCV();
    closeMyResumes();
    showToast('Currículo carregado.');
  } catch (error) {
    showToast(error.message);
  }
}

async function deleteSavedResume(resumeId) {
  try {
    await apiRequest(`/resumes/${resumeId}`, { method: 'DELETE' });
    await renderMyResumesList();
    showToast('Versão removida.');
  } catch (error) {
    showToast(error.message);
  }
}

function escapeHtml(value) {
  return (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── AUTH ──
function setAuthTab(tabName, el) {
  document.querySelectorAll('.auth-tab').forEach((tab) => tab.classList.remove('active'));
  el.classList.add('active');

  document.getElementById('auth-login-view').style.display = tabName === 'login' ? 'block' : 'none';
  document.getElementById('auth-register-view').style.display = tabName === 'register' ? 'block' : 'none';
}

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  document.getElementById('auth-account-view').style.display = authUser ? 'block' : 'none';
  document.getElementById('auth-tabs').style.display = authUser ? 'none' : 'flex';
  document.getElementById('auth-login-view').style.display = authUser ? 'none' : 'block';
  document.getElementById('auth-register-view').style.display = 'none';
  modal.classList.add('show');

  if (authUser) {
    document.getElementById('auth-modal-title').textContent = 'Minha conta';
    document.getElementById('auth-modal-subtitle').textContent = 'Gerencie sua sessão.';
    document.getElementById('account-name').textContent = authUser.name || '';
    document.getElementById('account-email').textContent = authUser.email || '';
  } else {
    document.getElementById('auth-modal-title').textContent = 'Entrar';
    document.getElementById('auth-modal-subtitle').textContent = 'Acesse sua conta para salvar currículos no banco de dados.';
  }
}

function closeAuthModal(event) {
  if (event && event.type === 'click' && event.target?.id !== 'auth-modal') return;
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.remove('show');
}

async function handleRegister() {
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  if (!name || !email || !password) {
    showToast('Preencha todos os campos do cadastro.');
    return;
  }

  try {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    showToast('Conta criada. Faça login.');
    setAuthTab('login', document.querySelectorAll('.auth-tab')[0]);
  } catch (error) {
    showToast(error.message);
  }
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    showToast('Informe e-mail e senha.');
    return;
  }

  try {
    const payload = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    authUser = payload.user;
    updateAvatar();
    closeAuthModal();
    showToast('Login realizado com sucesso.');
  } catch (error) {
    showToast(error.message);
  }
}

async function handleLogout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    authUser = null;
    updateAvatar();
    closeAuthModal();
    showToast('Sessão encerrada.');
  } catch (error) {
    showToast(error.message);
  }
}

async function refreshAuthState() {
  try {
    const payload = await apiRequest('/auth/me');
    authUser = payload.user || null;
    if (authUser && !legacySynced) {
      await migrateLegacyResumes();
      legacySynced = true;
    }
  } catch {
    authUser = null;
  }
  updateAvatar();
}

function updateAvatar() {
  const avatar = document.getElementById('user-avatar');
  if (!avatar) return;
  const base = authUser?.name || authUser?.email || 'A';
  avatar.textContent = base.charAt(0).toUpperCase();
  avatar.title = authUser ? `Conectado: ${authUser.name}` : 'Entrar / Cadastrar';
}

async function migrateLegacyResumes() {
  try {
    const raw = localStorage.getItem(LEGACY_RESUMES_STORAGE_KEY);
    const legacy = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(legacy) || !legacy.length) return;

    for (const item of legacy) {
      if (!item?.name || !item?.stateSnapshot) continue;
      await apiRequest('/resumes', {
        method: 'POST',
        body: JSON.stringify({ name: item.name, stateSnapshot: item.stateSnapshot })
      });
    }
    localStorage.removeItem(LEGACY_RESUMES_STORAGE_KEY);
    showToast('Templates antigos importados para sua conta.');
  } catch (error) {
    console.warn('Falha ao migrar templates locais:', error);
  }
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

function loadJsPdfLibrary() {
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (window.__jspdfLoadingPromise) return window.__jspdfLoadingPromise;

  window.__jspdfLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.__jspdfLoadingPromise;
}

function createStandardResumePdf(jsPDF, resumeState) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const lineGap = 5;
  const sectionGap = 6;
  const itemGap = 4;
  let y = 18;

  const ensureSpace = (needed = 10) => {
    if (y + needed <= pageHeight - margin) return;
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    y = margin;
  };

  const drawSectionTitle = (title) => {
    ensureSpace(10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.2, pageWidth - margin, y + 1.2);
    y += sectionGap;
  };

  const drawParagraph = (text, options = {}) => {
    if (!text) return;
    const fontSize = options.fontSize || 10;
    const style = options.style || 'normal';
    const color = options.color || [50, 50, 50];
    const gap = options.gap || lineGap;
    doc.setFont('helvetica', style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * gap + 2);
    doc.text(lines, margin, y);
    y += lines.length * gap;
  };

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  const name = (resumeState.fullName || 'Seu Nome').trim();
  const role = (resumeState.jobTitle || 'Cargo').trim();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text(name, pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(role, pageWidth / 2, y, { align: 'center' });
  y += 7;

  const contacts = [resumeState.email, resumeState.phone, resumeState.location, resumeState.linkedin]
    .map((value) => (value || '').trim())
    .filter(Boolean);
  if (contacts.length) {
    doc.setFontSize(9.5);
    doc.text(contacts.join('  |  '), pageWidth / 2, y, { align: 'center' });
    y += 6;
  }

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.35);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  if (resumeState.summary?.trim()) {
    drawSectionTitle('Resumo Profissional');
    drawParagraph(resumeState.summary.trim(), { fontSize: 10, gap: 4.7 });
    y += 2;
  }

  const experiences = resumeState.experience.filter((item) => item.company?.trim());
  if (experiences.length) {
    drawSectionTitle('Experiência Profissional');
    experiences.forEach((item) => {
      ensureSpace(16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(25, 25, 25);
      doc.text(item.company.trim(), margin, y);

      if (item.period?.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(95, 95, 95);
        doc.text(item.period.trim(), pageWidth - margin, y, { align: 'right' });
      }
      y += lineGap;

      if (item.role?.trim()) {
        drawParagraph(item.role.trim(), { fontSize: 9.8, style: 'italic', color: [70, 70, 70], gap: 4.5 });
      }
      if (item.desc?.trim()) {
        drawParagraph(item.desc.trim(), { fontSize: 9.6, gap: 4.4, color: [55, 55, 55] });
      }
      y += itemGap;
    });
  }

  const education = resumeState.education.filter((item) => item.institution?.trim());
  if (education.length) {
    drawSectionTitle('Formação Acadêmica');
    education.forEach((item) => {
      ensureSpace(14);
      const end = item.current ? 'Cursando' : (item.end || '').trim();
      const period = item.start?.trim() ? `${item.start.trim()}${end ? ` — ${end}` : ''}` : '';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.2);
      doc.setTextColor(25, 25, 25);
      doc.text(item.institution.trim(), margin, y);

      if (period) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.4);
        doc.setTextColor(95, 95, 95);
        doc.text(period, pageWidth - margin, y, { align: 'right' });
      }
      y += lineGap;

      if (item.course?.trim()) {
        drawParagraph(item.course.trim(), { fontSize: 9.6, color: [60, 60, 60], gap: 4.3 });
      }
      y += itemGap;
    });
  }

  const skills = resumeState.skills.filter((item) => item.name?.trim());
  if (skills.length) {
    drawSectionTitle('Habilidades');
    const text = skills.map((item) => item.name.trim()).join(' • ');
    drawParagraph(text, { fontSize: 9.8, gap: 4.8 });
    y += 1;
  }

  const tags = resumeState.tags.filter(Boolean);
  if (tags.length) {
    drawSectionTitle('Competências');
    drawParagraph(tags.join(' • '), { fontSize: 9.8, gap: 4.8 });
    y += 1;
  }

  const certs = resumeState.certs.filter((item) => item.name?.trim());
  if (certs.length) {
    drawSectionTitle('Certificados');
    certs.forEach((item) => {
      const line = `${item.name.trim()}${item.issuer?.trim() ? ` — ${item.issuer.trim()}` : ''}${item.year?.trim() ? ` (${item.year.trim()})` : ''}`;
      drawParagraph(`• ${line}`, { fontSize: 9.5, gap: 4.5 });
    });
    y += 1;
  }

  const projects = resumeState.projects.filter((item) => item.name?.trim());
  if (projects.length) {
    drawSectionTitle('Projetos');
    projects.forEach((item) => {
      drawParagraph(item.name.trim(), { fontSize: 10, style: 'bold', color: [30, 30, 30], gap: 4.7 });
      if (item.link?.trim()) drawParagraph(item.link.trim(), { fontSize: 9.2, color: [80, 80, 80], gap: 4.2 });
      if (item.desc?.trim()) drawParagraph(item.desc.trim(), { fontSize: 9.4, color: [55, 55, 55], gap: 4.4 });
      y += itemGap;
    });
  }

  return doc;
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


// ── START ──
initTheme();
init();
