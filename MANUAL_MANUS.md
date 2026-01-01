# 📘 Guia Mestre de Operação - Projeto Suite

> **⚠️ INSTRUÇÃO MANDATÓRIA PARA IA:** Toda vez que este projeto for carregado ou uma nova tarefa for solicitada, a IA **DEVE LER ESTE ARQUIVO INTEGRALMENTE** antes de realizar qualquer ação. Este manual contém as diretrizes fundamentais que se sobrepõem a qualquer interpretação automática, servindo como o guia mestre de operação do código.

---

## 🚀 1. Controle de Versão (Versionamento Estruturado)

O projeto utiliza um sistema de versionamento semântico rigoroso e **documentação expandida**. Sempre incremente a versão após qualquer modificação.

- **PATCH (Z)**: Pequenas correções, ajustes de texto ou comentários.
  - *Exemplo: 1.7.5 → 1.7.6*
- **MINOR (Y)**: Novas funcionalidades pequenas ou melhorias visuais.
  - *Exemplo: 1.7.5 → 1.8.0*
- **MAJOR (X)**: Grandes mudanças estruturais, novo design ou atualizações críticas.
  - *Exemplo: 1.7.5 → 2.0.0*

**Onde atualizar (Obrigatório):**
1. `src/app/version.json`: Atualize a chave `"version"`, a `"date"` e detalhe **todas** as mudanças em `"notes"`.
2. `src/app/update.js`: Atualize a constante `CURRENT_VERSION`.
3. `src/app/versions/v[versão].md`: **Crie um novo arquivo Markdown** para cada versão, contendo a documentação detalhada (Resumo, Novidades, Arquivos Modificados, Benefícios e Detalhes Técnicos). Use parágrafos completos e quebras de linha adequadas.
4. **Cabeçalhos de Arquivos**: Atualize a versão nos comentários iniciais dos arquivos modificados.

---

## 🛠️ 2. Operação e Manutenção do Código

### Regras de Ouro para o Desenvolvedor:
- **Análise Prévia**: Antes de alterar, leia o arquivo inteiro para entender o contexto e a lógica existente.
- **Preservação de Estilo**: Mantenha o padrão de indentação, nomenclatura de variáveis e estilo de comentários.
- **Comentários Explicativos**: Todo código novo ou alterado deve ser 100% comentado em português, focando no "porquê" daquela implementação.
- **Documentação Expandida**: Os textos nos arquivos de versão devem ser estruturados, com parágrafos completos e explicações claras, evitando apenas listas de tópicos quando possível.
- **Limpeza**: Não crie arquivos de relatório ou teste na raiz do projeto. Todas as informações de mudanças devem ir para o `version.json` e para o arquivo correspondente na pasta `/src/app/versions/`.

---

## 📂 3. Estrutura de Pastas e Organização

Mantenha a organização profissional e modular:
- `/pages/`: **Raiz das páginas HTML**. Todos os arquivos `.html` devem residir aqui.
- `/pages/[modulo]/`: Arquivos de suporte específicos (CSS, JS, JSON) de cada módulo.
- `/src/app/`: Lógica de sistema, controle de versão e estilos exclusivos.
- `/src/app/versions/`: **Repositório de documentação de versões** (Arquivos .md individuais).
- `/src/scripts/`: Scripts globais e configurações.
- `/src/styles/`: Estilos globais (fontes, temas, modos).
- `/database/`: Repositório de ativos estáticos (Imagens, JSON de dados, Favicons).

---

## 🎨 4. Identidade Visual (Liquid Design)

- **Glassmorphism**: Use `backdrop-filter: blur(12px)` e fundos translúcidos (`rgba`) para o efeito de vidro.
- **Paleta de Cores**:
  - **Dark Mode**: Fundo `#1a1a1a` (Cinza Escuro Premium).
  - **Light Mode**: Fundo `#ffffff`.
- **Responsividade**: O design deve ser impecável em dispositivos móveis e desktop.

---

## 🔐 5. Segurança e Persistência

- **Bloqueio de Login**: O sistema de bloqueio deve ser persistente via `localStorage`. 
- **Regras de Bloqueio**:
  - Após 3 tentativas falhas, o usuário deve ser bloqueado por **10 segundos**.
  - O bloqueio **DEVE** persistir mesmo que a página seja recarregada ou o navegador fechado.
  - Use timestamps absolutos (`Date.now()`) salvos no `localStorage` para calcular o tempo restante.
- **Estado do Usuário**: Use `localStorage` para salvar preferências de tema e estado de autenticação.

---

## 🤖 6. Protocolo de Atuação da IA

Ao receber uma tarefa, a IA deve seguir este protocolo:
1. **Leitura do Manual**: Ler o `MANUAL_MANUS.md` antes de qualquer outra coisa.
2. **Identificação**: Localizar a versão atual e entender o impacto da mudança solicitada.
3. **Execução**: Realizar a alteração seguindo os padrões de design e código.
4. **Registro e Documentação**: 
   - Atualizar `src/app/version.json`.
   - Criar o arquivo de documentação detalhada em `src/app/versions/v[versão].md`.
   - Atualizar o índice no `src/app/versions/README.md`.
5. **Limpeza**: Remover qualquer arquivo temporário criado durante o processo.

---

**Desenvolvido com foco em precisão, fé e tecnologia.** 🚀
**Versão Atual do Manual: 1.9.0**
