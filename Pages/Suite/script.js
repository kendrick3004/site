// Este arquivo contém o código JavaScript para a página Suite do sistema de design.
// O ícone será adicionado a todas as páginas do projeto.

document.addEventListener("DOMContentLoaded", () => {
    // Adiciona a classe 'dark-mode' ao corpo do documento quando a página é carregada.
    // Isso garante que o site inicie no modo escuro por padrão.
    document.body.classList.add("dark-mode"); 

    // Seleciona o elemento que representa o botão de alternância de tema (switch).
    const switchToggle = document.querySelector(".switch-toggle");
    
    // Inicializa um contador para rastrear quantas vezes o modo escuro foi ativado.
    let darkModeToggleCount = 0;

    // Adiciona a classe 'switch-toggle-right' ao botão de alternância.
    // Isso posiciona o botão à direita, indicando visualmente o modo escuro.
    switchToggle.classList.add("switch-toggle-right");

    // Adiciona um ouvinte de evento de clique ao botão de alternância.
    switchToggle.addEventListener("click", () => {
        // Alterna a classe 'dark-mode' no corpo do documento.
        // Se 'dark-mode' estiver presente, remove; se não, adiciona.
        document.body.classList.toggle("dark-mode");
        
        // Alterna a classe 'switch-toggle-right' no botão de alternância.
        // Isso move o botão para a esquerda ou direita, dependendo do tema.
        switchToggle.classList.toggle("switch-toggle-right");
        
        // Garante que a transição de estilo seja aplicada suavemente.
        switchToggle.style.transition = "transform 0.3s, background-color 0.3s";

        // Verifica se o modo escuro está ativo após a alternância.
        if (document.body.classList.contains("dark-mode")) {
            // Incrementa o contador se o modo escuro foi ativado.
            darkModeToggleCount++;
        }

        // Se o modo escuro foi ativado duas vezes (ou seja, o usuário alternou para claro e depois para escuro novamente),
        // um novo botão de login é adicionado.
        if (darkModeToggleCount === 2) {
            // Seleciona o contêiner onde os links são exibidos.
            const linksContainer = document.querySelector(".links");
            
            // Verifica se um botão de login já existe para evitar duplicatas.
            if (!document.querySelector(".link-item.login")) {
                // Cria um novo elemento div para o botão de login.
                const loginButton = document.createElement("div");
                
                // Adiciona as classes CSS para estilização.
                loginButton.className = "link-item login";
                
                // Define o texto do botão.
                loginButton.textContent = "Login";
                
                // Adiciona um ouvinte de evento de clique ao botão de login.
                loginButton.addEventListener("click", () => {
                    // Redireciona o navegador para a página de login.
                    window.location.href = "/site/Pages/Login/index.html";
                });
                
                // Adiciona o botão de login ao contêiner de links.
                linksContainer.appendChild(loginButton);
            }
        }
    });
});

