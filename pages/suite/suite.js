/**
 * ARQUIVO: suite.js
 * DESCRIÇÃO: Controla as interações principais da página "Suite".
 * FUNCIONALIDADES: Alternância de temas (Claro/Escuro) e Easter Egg para o botão de login.
 */

// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
    
    // Define o Modo Escuro como padrão ao carregar a página (decisão de design inicial)
    document.body.classList.add("dark-mode"); 

    // Seleciona o botão circular do switch de tema no HTML
    const switchToggle = document.querySelector(".switch-toggle");
    
    // Contador para rastrear quantas vezes o tema foi alternado (usado para ativar o Easter Egg)
    let darkModeToggleCount = 0;

    // Posiciona o botão do switch à direita (estado visual inicial correspondente ao modo escuro)
    switchToggle.classList.add("switch-toggle-right");

    /**
     * FUNÇÃO: Evento de clique no botão de alternância de tema
     * O QUE FAZ: Muda as cores do site e verifica se deve mostrar o botão de login secreto.
     */
    switchToggle.addEventListener("click", () => {
        
        // Alterna a classe 'dark-mode' no elemento <body>. 
        // Isso dispara as mudanças de cores definidas no CSS (modes.css).
        document.body.classList.toggle("dark-mode");
        
        // Alterna a posição visual do botão (desliza entre esquerda e direita)
        switchToggle.classList.toggle("switch-toggle-right");
        
        // Aplica uma transição suave para o movimento e mudança de cor do botão
        switchToggle.style.transition = "transform 0.3s, background-color 0.3s";

        // Se o modo escuro estiver ativo após o clique, incrementa o contador de ativações
        if (document.body.classList.contains("dark-mode")) {
            darkModeToggleCount++;
        }

        /**
         * LÓGICA DO EASTER EGG (Segredo):
         * Se o usuário alternar para o modo escuro exatamente 2 vezes, o botão de Login secreto aparece na lista de links.
         */
        if (darkModeToggleCount === 2) {
            
            // Seleciona o contêiner onde os botões de links estão localizados
            const linksContainer = document.querySelector(".links");
            
            // Verifica se o botão de login já não foi criado anteriormente para evitar duplicatas
            if (!document.querySelector(".link-item.login")) {
                
                // Cria um novo elemento <div> para ser o botão de login
                const loginButton = document.createElement("div");
                
                // Define as classes de estilo para que ele pareça com os outros botões
                loginButton.className = "link-item login";
                
                // Define o texto que aparecerá dentro do botão
                loginButton.textContent = "Login";
                
                // Adiciona a funcionalidade de clique: redireciona para a página de login
                loginButton.addEventListener("click", () => {
                    window.location.href = "pages/login";
                });
                
                // Insere o novo botão dentro da lista de links na página
                linksContainer.appendChild(loginButton);
                
                console.log("Easter Egg ativado: Botão de Login revelado!");
            }
        }
    });
});
