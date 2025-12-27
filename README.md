# 🚀 Projeto Suite - Central de Links & Clima

Bem-vindo ao **Projeto Suite**! Esta é uma aplicação web moderna, elegante e funcional, desenvolvida para servir como uma central de links personalizada, integrando informações litúrgicas e meteorológicas em tempo real.

---

## 🌟 Funcionalidades Principais

### 1. 🌡️ Widget de Clima Inteligente (Jacinto Machado)
O widget de clima foi desenvolvido para ser preciso e visualmente atraente:
- **Localização Fixa**: Configurado para exibir sempre os dados de **Jacinto Machado**, garantindo que você veja o clima da sua cidade sem erros de localização por IP.
- **Dados Completos**: Exibe temperatura atual, sensação térmica, **máxima e mínima do dia**, umidade, cobertura de nuvens e precipitação (chuva).
- **Templates Dinâmicos**: O fundo do widget e os ícones mudam automaticamente de acordo com o tempo (sol, chuva, nublado, tempestade) e o período do dia (dia ou noite).
- **Atualização Automática**: Os dados são renovados a cada 15 minutos via WeatherAPI.

### 2. ⛪ Santo do Dia & Liturgia
Uma seção dedicada à espiritualidade que se atualiza sozinha:
- **Calendário Litúrgico**: Busca dados de um arquivo JSON local para exibir o santo do dia e a biografia breve.
- **Cores Litúrgicas**: Uma "fitinha" lateral muda de cor (Verde, Roxo, Branco, Vermelho) automaticamente seguindo o calendário da Igreja.
- **Lógica de Vésperas**: Aos sábados após as 15h, o sistema já adianta a liturgia para o domingo, seguindo a tradição católica.

### 3. 🌓 Sistema de Temas (Dark/Light Mode)
- **Modo Escuro Nativo**: O site conta com um modo escuro elegante que preserva a visão e economiza bateria.
- **Alternância Suave**: Um botão de switch personalizado permite trocar de tema com animações fluidas.
- **Persistência**: O site lembra qual tema você escolheu, mesmo se você fechar o navegador.

### 4. 🔗 Central de Links & Easter Egg
- **Links Rápidos**: Botões estilizados para acesso fácil a currículos, arquivos de missa e outros projetos.
- **Segredo (Easter Egg)**: Ao alternar o tema para o modo escuro duas vezes, um botão de **Login** secreto é revelado na lista de links!

---

## 🎨 Design & Tecnologia

- **Glassmorphism**: O projeto utiliza o estilo "vidro fosco", com transparências e desfoques de fundo (backdrop-filter) para um visual premium.
- **Responsividade Total**: O site se adapta perfeitamente a computadores, tablets e celulares. No mobile, o widget de clima fica fixo no rodapé para facilitar o acesso.
- **Código Documentado**: Todos os arquivos (HTML, CSS, JS) estão 100% comentados em português, explicando cada função e regra de estilo.

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
3. Aproveite sua central de links personalizada com o clima de Jacinto Machado!

---

**Desenvolvido com foco em precisão, elegância e funcionalidade.** 🚀
