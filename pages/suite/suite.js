/**
 * ARQUIVO: suite.js
 * DESCRIÇÃO: Gerenciamento de temas e interações da suíte.
 * FUNCIONALIDADES: Alternância de tema (Claro/Escuro) e segredos de interface (Easter Egg).
 * VERSÃO: 2.0.0 - Auditoria Total e Comentários Detalhados
 */

/**
 * Módulo SuiteModule encapsulado usando o padrão IIFE (Immediately Invoked Function Expression)
 * para evitar poluição do escopo global e manter a privacidade das variáveis internas.
 */
const SuiteModule = (function() {
    'use strict'; // Ativa o modo restrito para capturar erros comuns e melhorar a performance

    // Contador interno para rastrear quantas vezes o modo escuro foi ativado
    let darkModeToggleCount = 0;

    /**
     * Inicializa o interruptor de tema (Switch) e gerencia a lógica de alternância.
     * Inclui a persistência visual e a chamada para a lógica de segredos (Easter Egg).
     */
    function initThemeSwitch() {
        // Seleciona os elementos necessários do DOM
        const switchBtn = document.querySelector('.switch');
        const toggle = document.querySelector('.switch-toggle');
        const body = document.body;

        // Verifica se os elementos existem na página antes de prosseguir
        if (!switchBtn || !toggle) return;

        /**
         * ESTADO INICIAL: Modo Escuro
         * Por decisão de design, o aplicativo inicia sempre no Modo Escuro.
         * Adicionamos as classes necessárias ao carregar a página.
         */
        body.classList.add('dark-mode');
        toggle.classList.add('switch-toggle-right');

        /**
         * Adiciona o ouvinte de evento de clique ao botão do switch.
         */
        switchBtn.addEventListener('click', () => {
            // Alterna a classe 'dark-mode' no body e armazena o novo estado
            const isDark = body.classList.toggle('dark-mode');
            
            // Alterna a classe que move o botão deslizante para a direita
            toggle.classList.toggle('switch-toggle-right');
            
            // Se o usuário mudou para o modo escuro, incrementamos o contador do segredo
            if (isDark) {
                darkModeToggleCount++;
                checkEasterEgg(); // Verifica se as condições do segredo foram atingidas
            }
            
            // Log informativo no console para depuração
            console.log(`[Suite] Tema alterado para: ${isDark ? 'Escuro' : 'Claro'}`);
        });
    }

    /**
     * Lógica do Easter Egg (Segredo):
     * Revela o botão de login oculto após o usuário ativar o modo escuro exatamente 2 vezes.
     * Esta é uma forma criativa de esconder o acesso administrativo.
     */
    function checkEasterEgg() {
        // Condição: O modo escuro foi ativado 2 vezes
        if (darkModeToggleCount === 2) {
            const linksContainer = document.querySelector('.links');
            
            // Verifica se o container de links existe e se o botão de login já não foi criado
            if (linksContainer && !document.querySelector('.link-item.login')) {
                // Cria dinamicamente o elemento do botão de login
                const loginButton = document.createElement('div');
                loginButton.className = 'link-item login'; // Aplica as classes de estilo
                loginButton.textContent = 'Login';         // Define o texto visível
                
                // Adiciona o evento de clique para redirecionar à página de login
                loginButton.addEventListener('click', () => {
                    // O caminho é relativo à localização da página atual (pages/suite.html)
                    window.location.href = 'pages/login.html';
                });
                
                // Insere o novo botão no final da lista de links
                linksContainer.appendChild(loginButton);
                
                // Log de confirmação da ativação do segredo
                console.log('[Suite] Easter Egg ativado: Botão de Login revelado!');
            }
        }
    }

    /**
     * Retorna apenas os métodos públicos do módulo.
     */
    return {
        init: function() {
            initThemeSwitch(); // Inicia a lógica de temas
        }
    };
})();

/**
 * Inicialização segura do script.
 * Verifica se o documento já foi carregado ou se ainda está em processo de carregamento.
 */
if (document.readyState === 'loading') {
    // Se ainda estiver carregando, aguarda o evento DOMContentLoaded
    document.addEventListener('DOMContentLoaded', SuiteModule.init);
} else {
    // Se já estiver carregado (ex: script carregado de forma assíncrona), executa imediatamente
    SuiteModule.init();
}
