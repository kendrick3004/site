# 🚀 Projeto Suite - Dashboard Pessoal & Litúrgico

Bem-vindo ao **Projeto Suite**! Esta é uma aplicação web moderna, elegante e funcional, desenvolvida para servir como um dashboard pessoal, integrando informações litúrgicas e meteorológicas em tempo real com alta precisão e robustez.

---

## ✨ Funcionalidades Principais

### 1. 🌦️ Widget de Clima Inteligente (Jacinto Machado)
O widget de clima foi desenvolvido para ser preciso e visualmente atraente:
- **Localização Fixa**: Configurado para exibir sempre os dados de **Jacinto Machado**, garantindo que você veja o clima da sua cidade sem erros de localização por IP.
- **Dados Completos**: Exibe temperatura atual, sensação térmica, **máxima e mínima do dia**, umidade, cobertura de nuvens e precipitação (chuva).
- **Templates Dinâmicos**: O fundo do widget e os ícones mudam automaticamente de acordo com o tempo (sol, chuva, nublado, tempestade) e o período do dia (dia ou noite).
- **Atualização Automática**: Os dados são renovados a cada 15 minutos via WeatherAPI.

### 2. ⛪ Calendário Litúrgico 2026 (Fiel ao GCatholic)
Uma seção dedicada à espiritualidade que se atualiza sozinha:
- **Base de Dados Completa**: Contém todos os **365 dias de 2026**, extraídos fielmente do calendário litúrgico oficial para o Brasil (GCatholic).
- **Múltiplos Santos**: Suporte para exibir vários santos no mesmo dia, organizados com quebras de linha automáticas.
- **Lógica de Virada Litúrgica**: Aos domingos, a partir das **15h**, o widget já antecipa a liturgia da segunda-feira.
- **Cores Litúrgicas**: Fitinha lateral dinâmica que muda de cor (Verde, Branco, Roxo, Vermelho) conforme a celebração do dia.
- **Mensagens Amigáveis**: Caso um dia não seja encontrado, exibe uma mensagem neutra com cor branca.

### 3. 🎨 Interface e Design
- **Glassmorphism**: Estilo visual moderno com efeitos de desfoque (blur) e transparências elegantes.
- **Modo Escuro/Claro**: Alternância suave de temas com um switch milimetricamente ajustado para encostar nas extremidades do trilho.
- **Easter Egg**: Botão de login secreto que se revela após alternar o tema para o modo escuro exatamente 2 vezes.
- **Responsividade**: Design adaptável que funciona em computadores e celulares, mantendo a elegância original.

### 4. 🛡️ Robustez e Segurança
- **Módulos Protegidos (IIFE)**: Código JavaScript encapsulado para evitar conflitos globais.
- **Sanitização XSS**: Todos os dados dinâmicos são limpos antes de serem inseridos no HTML para evitar ataques de injeção.
- **Tratamento de Erros**: Logs profissionais no console e fallbacks visuais para garantir que o site nunca "quebre" para o usuário.
- **Meta Tags Modernas**: Configurado com as tags mais recentes para Web Apps, eliminando avisos de depreciação no console.

---

## 📂 Estrutura de Pastas

- `/index.html`: Porta de entrada do site.
- `/pages/suite/`: Contém a lógica e os estilos principais.
- `/pages/suite/weather/`: Toda a inteligência do widget de clima.
- `/database/`: Onde ficam as imagens, ícones, fotos de avatar e o calendário litúrgico (JSON).
- `/src/`: Arquivos de configuração global e fontes.

---

## 🛠️ Como Usar

1. Extraia o conteúdo do arquivo ZIP.
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Safari, Firefox).
3. Aproveite seu dashboard pessoal com o clima de Jacinto Machado!

---

**Desenvolvido com foco em precisão, fé e tecnologia.** 🚀
