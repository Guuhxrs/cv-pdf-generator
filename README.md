# 📄 CV PDF Generator

Gerador de currículo em PDF feito com **HTML, CSS e JavaScript puro**, com foco em simplicidade, responsividade e segurança no navegador.

---

## 🚀 Funcionalidades

- ✨ Geração de currículo em PDF com download direto no navegador
- 💾 Salvamento automático local com `localStorage`
- 📱 Interface responsiva (desktop e mobile)
- 🧩 **5 modelos de currículo** com diferenças visuais:
  - Clássico
  - Moderno
  - Minimalista
  - Corporativo
  - Criativo
- 🏷️ Seções e rótulos dinâmicos conforme modelo selecionado
- 🧾 Campos extras para conteúdo profissional:
  - Experiência
  - Projetos
  - Portfólio
- 🔒 Validações de formulário e sanitização em runtime
- 🛡️ Boas práticas de segurança front-end (CSP + DOM seguro)
- 🎛️ Interface estilo dashboard com barra superior, menu lateral e editor + prévia lado a lado

---

## 🧱 Estrutura do projeto

- `index.html` → estrutura da aplicação e layout da prévia
- `style.css` → estilos base da interface
- `script.js` → lógica principal (editor, preview, tema, geração direta de PDF e interações)
- `template-enhancements.css` → estilos avançados por tipo de currículo
- `template-enhancements.js` → comportamento dinâmico por template (labels, seções, render extra)

---

## 🧰 Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla JS)

---

## 📋 Validações implementadas

- Nome com restrição de caracteres válidos
- Telefone com máscara livre controlada por regex
- E-mail com validação de formato
- Links de GitHub e LinkedIn validados
- Portfólio com normalização/validação de URL
- Limites de caracteres por campo
- Sanitização durante digitação
- Validação extra em runtime antes de gerar PDF

---

## 🔐 Segurança e confiabilidade

- Não usa `innerHTML` com dados do usuário
- Renderização de conteúdo com APIs seguras do DOM
- URLs normalizadas e verificadas com `URL()`
- Tratamento de falhas de `localStorage` com segurança
- Content Security Policy (CSP) no HTML

---

## ▶️ Como usar

### 1) Instalar dependências

```bash
npm install
```

### 2) Rodar o servidor (API + front-end)

```bash
npm start
```

Abra: `http://localhost:3000`

### Modo local (sem servidor / fora do GitHub)

Também funciona abrindo o `index.html` diretamente no navegador:

```bash
open index.html
```

Nesse modo, autenticação e "My Resumes" usam `localStorage` automaticamente (sem API externa).
Para geração de PDF, o app tenta carregar primeiro `./vendor/jspdf.umd.min.js` e depois CDN.

### 3) Fluxo recomendado

1. Clique no ícone de usuário no topo para **Cadastro/Login**.
2. Preencha os dados do currículo.
3. Clique em **My Resumes** para salvar e gerenciar versões na sua conta.
4. Clique em **Generate PDF** para exportar.

---

## 🛣️ Roadmap

- [ ] Tema claro/escuro manual
- [x] Templates diferentes de currículo
- [x] Exportação direta para PDF (sem impressão)
- [ ] Reordenação de seções por drag-and-drop
- [ ] Transformação em PWA (app instalável)

---

## 👨‍💻 Autor

Projeto desenvolvido por **Gustavo Entony**.
