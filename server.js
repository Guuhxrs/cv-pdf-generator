const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'cv-generator-secret-change-me';
const DB_PATH = path.join(__dirname, 'data', 'app.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    state_snapshot TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: 'Não autenticado.' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Sessão inválida.' });
  }
}

function sanitizeUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Dados inválidos. Senha mínima: 6 caracteres.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (exists) return res.status(409).json({ message: 'E-mail já cadastrado.' });

  const hash = bcrypt.hashSync(password, 12);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(String(name).trim(), normalizedEmail, hash);

  return res.status(201).json({ id: result.lastInsertRowid });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Informe e-mail e senha.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).trim().toLowerCase());
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) return res.status(401).json({ message: 'Credenciais inválidas.' });

  const token = jwt.sign(sanitizeUser(user), JWT_SECRET, { expiresIn: '7d' });
  res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({ user: sanitizeUser(user) });
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('auth_token');
  return res.json({ ok: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

app.get('/api/resumes', authMiddleware, (req, res) => {
  const items = db
    .prepare('SELECT id, name, state_snapshot, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC')
    .all(req.user.id)
    .map((item) => ({
      ...item,
      state_snapshot: JSON.parse(item.state_snapshot)
    }));

  return res.json({ items });
});

app.post('/api/resumes', authMiddleware, (req, res) => {
  const { name, stateSnapshot } = req.body || {};
  if (!name || !stateSnapshot) return res.status(400).json({ message: 'Dados do currículo inválidos.' });

  const result = db
    .prepare('INSERT INTO resumes (user_id, name, state_snapshot, updated_at) VALUES (?, ?, ?, datetime(\'now\'))')
    .run(req.user.id, String(name).trim(), JSON.stringify(stateSnapshot));

  return res.status(201).json({ id: result.lastInsertRowid });
});

app.delete('/api/resumes/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM resumes WHERE id = ? AND user_id = ?').run(id, req.user.id);
  if (!result.changes) return res.status(404).json({ message: 'Currículo não encontrado.' });
  return res.json({ ok: true });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
