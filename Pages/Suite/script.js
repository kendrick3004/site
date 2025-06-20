// Este arquivo contém o código JavaScript para a página Suite do sistema de design.
// O ícone será adicionado a todas as páginas do projeto.

// Adiciona um ouvinte de evento que será disparado quando todo o conteúdo HTML for carregado e analisado.
document.addEventListener("DOMContentLoaded", () => {
    // Adiciona a classe 'dark-mode' ao corpo do documento quando a página é carregada.
    // Isso garante que o site inicie no modo escuro por padrão, ou mantém o estado se houver persistência.
    document.body.classList.add("dark-mode"); 

    // Seleciona o elemento HTML que representa o botão de alternância de tema (o switch visual).
    const switchToggle = document.querySelector(".switch-toggle");
    
    // Inicializa um contador para rastrear quantas vezes o modo escuro foi ativado (alternado para escuro).
    let darkModeToggleCount = 0;

    // Adiciona a classe 'switch-toggle-right' ao botão de alternância.
    // Isso posiciona o botão à direita, indicando visualmente que o modo escuro está ativo.
    switchToggle.classList.add("switch-toggle-right");

    // Adiciona um ouvinte de evento de clique ao botão de alternância de tema.
    switchToggle.addEventListener("click", () => {
        // Alterna a classe 'dark-mode' no corpo do documento.
        // Se 'dark-mode' estiver presente, ela é removida (passa para modo claro); se não, é adicionada (passa para modo escuro).
        document.body.classList.toggle("dark-mode");
        
        // Alterna a classe 'switch-toggle-right' no botão de alternância.
        // Isso move o botão para a esquerda ou direita, dependendo do tema atual, criando a animação do switch.
        switchToggle.classList.toggle("switch-toggle-right");
        
        // Garante que a transição de estilo seja aplicada suavemente para as propriedades 'transform' e 'background-color'.
        switchToggle.style.transition = "transform 0.3s, background-color 0.3s";

        // Verifica se o modo escuro está ativo após a alternância (ou seja, se a classe 'dark-mode' está presente no body).
        if (document.body.classList.contains("dark-mode")) {
            // Se o modo escuro foi ativado, incrementa o contador.
            darkModeToggleCount++;
        }

        // Se o modo escuro foi ativado duas vezes (o que significa que o usuário alternou para claro e depois para escuro novamente),
        // um novo botão de login é adicionado dinamicamente à página.
        if (darkModeToggleCount === 2) {
            // Seleciona o contêiner onde os links de navegação são exibidos.
            const linksContainer = document.querySelector(".links");
            
            // Verifica se um botão de login com a classe 'login' já existe para evitar a criação de duplicatas.
            if (!document.querySelector(".link-item.login")) {
                // Cria um novo elemento HTML do tipo 'div' para o botão de login.
                const loginButton = document.createElement("div");
                
                // Adiciona as classes CSS 'link-item' e 'login' para estilização do botão.
                loginButton.className = "link-item login";
                
                // Define o texto visível do botão como "Login".
                loginButton.textContent = "Login";
                
                // Adiciona um ouvinte de evento de clique ao recém-criado botão de login.
                loginButton.addEventListener("click", () => {
                    // Quando o botão é clicado, redireciona o navegador para a página de login.
                    window.location.href = "/Pages/Login/index.html";
                });
                
                // Adiciona o botão de login como um filho do contêiner de links, tornando-o visível na página.
                linksContainer.appendChild(loginButton);
            }
        }
    });
});

