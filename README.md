# 📄 CV PDF Generator

Gerador de currículo em PDF desenvolvido com **HTML, CSS e JavaScript puro**, pensado para funcionar diretamente no navegador — inclusive no celular.

O projeto permite que qualquer usuário preencha seus dados e gere um **currículo profissional em PDF** de forma simples, rápida e segura.

---

## 🚀 Funcionalidades

- ✨ Geração de currículo em PDF (via impressão do navegador)
- 💾 Auto-save local (localStorage)
- 📱 Interface responsiva (desktop e mobile)
- 🧱 Layout profissional
- 🔒 Validação e restrições de campos
- 🧼 Código organizado seguindo princípios de Clean Code
- 🛡️ Proteção básica contra XSS
- 🌐 Validação de links (GitHub / LinkedIn)

---

## 🧰 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)

---

## 📋 Validações Implementadas

- Nome aceita somente letras e caracteres válidos
- Telefone aceita apenas números e símbolos comuns
- E-mail validado por padrão
- Links GitHub e LinkedIn validados
- Limite de caracteres por campo
- Sanitização de inputs durante digitação
- Validação extra em runtime (JavaScript)

---

## 🔐 Segurança e Confiabilidade

Este projeto foi desenvolvido com foco em boas práticas de segurança front-end:

- ❌ Não utiliza `innerHTML` com dados do usuário
- 🔎 URLs validadas com `URL()`
- 🧼 Inputs sanitizados em tempo real
- 🔒 Content Security Policy (CSP)
- 💥 Tratamento seguro de erros no localStorage
- 🧱 Manipulação segura do DOM

---

## 🤖 Uso de IA no desenvolvimento

Este projeto foi desenvolvido com apoio de ferramentas de Inteligência Artificial como auxílio durante o processo de aprendizado e desenvolvimento.

A IA foi utilizada para:

- sugerir melhorias de estrutura e organização do código
- revisar boas práticas e padrões de desenvolvimento
- auxiliar na implementação de validações e segurança

Toda a integração, adaptação, testes e decisões finais de implementação foram realizadas manualmente pelo autor do projeto.

---

## ▶️ Como usar

1. Abra o arquivo `index.html` no navegador  
2. Preencha os campos do currículo  
3. Clique em **Gerar PDF**  
4. Escolha **Salvar como PDF**

---

## 🧠 Objetivos do Projeto

Este projeto foi criado como prática de:

- Organização de código (Clean Code)
- Validação e controle de formulários
- Segurança básica no Front-end
- Manipulação segura do DOM
- Desenvolvimento assistido por IA (AI-assisted development)
- Geração de documentos via navegador

---

## 📌 Melhorias Futuras (Roadmap)

- [ ] Tema claro/escuro manual
- [ ] Templates diferentes de currículo
- [ ] Exportação direta para PDF (sem impressão)
- [ ] Sistema de arrastar e soltar seções
- [ ] Transformação em PWA (app instalável)

---

## 👨‍💻 Autor

Projeto desenvolvido por **Gustavo Entony**.