# 📘 Manual de Diretrizes - Projeto Suite

Este documento serve como guia mestre para o **Manus AI** (ou qualquer desenvolvedor) realizar manutenções e atualizações no projeto Suite. Siga estas regras rigorosamente em cada nova interação.

---

## 🚀 1. Controle de Versão (Versionamento)

Sempre que houver uma alteração, o número da versão deve ser atualizado seguindo o padrão **X.Y.Z**:

- **PATCH (Z)**: Pequenas correções, ajustes de texto ou comentários.
  - *Exemplo: 1.1.1 → 1.1.2*
- **MINOR (Y)**: Novas funcionalidades pequenas ou melhorias visuais.
  - *Exemplo: 1.1.2 → 1.2.0*
- **MAJOR (X)**: Grandes mudanças estruturais, novo design ou atualizações críticas.
  - *Exemplo: 1.2.0 → 2.0.0*

**Onde atualizar:**
1. No arquivo `src/app/version.json` (para o usuário ver).
2. No arquivo `src/app/update.js` (variável `CURRENT_VERSION`).
3. Nos comentários de cabeçalho dos arquivos modificados.

---

## 🎨 2. Identidade Visual e Design

- **Efeito Líquido**: Ícones e elementos principais devem usar o efeito de vidro (Glassmorphism) com fundo translúcido e blur.
- **Cores**: 
  - Fundo Modo Escuro: `#1a1a1a` (Cinza Escuro Premium).
  - Fundo Modo Claro: `#ffffff`.
  - Elementos: Devem usar transparência (`rgba`) e `backdrop-filter: blur()`.
- **Fidelidade**: Nunca altere o design original (paddings, margens, tamanhos) a menos que solicitado explicitamente.

---

## 📂 3. Estrutura de Pastas

Mantenha a organização profissional:
- `/src/app/`: Lógica, estilos e controle de versão exclusivos do Aplicativo (Atalho).
- `/src/scripts/`: Scripts globais do site.
- `/src/styles/`: Estilos globais do site.
- `/pages/`: Estrutura de páginas e módulos específicos (Suite, Weather, Login).
- `/database/`: Apenas arquivos de dados (Imagens, JSONs, Favicons).

---

## 📝 4. Padrão de Programação

- **Comentários**: Todo código deve ser 100% comentado em português, explicando o "porquê" de cada função.
- **Standalone**: O sistema de notificação de melhorias deve funcionar **apenas** no modo atalho instalado.
- **Memória**: Use `localStorage` para garantir que avisos de atualização apareçam apenas uma vez por versão.

---

## 🤖 5. Instrução para o Manus

> "Manus, analise o projeto Suite e siga as diretrizes do `MANUAL_MANUS.md`. Realize a atualização [DESCREVER AQUI] e incremente a versão conforme a regra."

---
**Desenvolvido com foco em precisão, fé e tecnologia.** 🚀
