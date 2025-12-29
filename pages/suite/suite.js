/**
 * ARQUIVO: suite.js
 * DESCRIÇÃO: Gerenciamento de temas e interações da suíte.
 * FUNCIONALIDADES: Alternância de tema (Claro/Escuro) e segredos de interface (Easter Egg).
 */

const SuiteModule = (function() {
    'use strict';

    let darkModeToggleCount = 0;

    /**
     * Gerencia a alternância de temas com persistência e lógica de Easter Egg.
     */
    function initThemeSwitch() {
        const switchBtn = document.querySelector('.switch');
        const toggle = document.querySelector('.switch-toggle');
        const body = document.body;

        if (!switchBtn || !toggle) return;

        // Estado inicial: Modo Escuro (decisão de design)
        body.classList.add('dark-mode');
        toggle.classList.add('switch-toggle-right');

        switchBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-mode');
            toggle.classList.toggle('switch-toggle-right');
            
            if (isDark) {
                darkModeToggleCount++;
                checkEasterEgg();
            }
            
            console.log(`[Suite] Tema alterado para: ${isDark ? 'Escuro' : 'Claro'}`);
        });
    }

    /**
     * Lógica do Easter Egg: Revela o botão de login após 2 ativações do modo escuro.
     */
    function checkEasterEgg() {
        if (darkModeToggleCount === 2) {
            const linksContainer = document.querySelector('.links');
            if (linksContainer && !document.querySelector('.link-item.login')) {
                const loginButton = document.createElement('div');
                loginButton.className = 'link-item login';
                loginButton.textContent = 'Login';
                
                loginButton.addEventListener('click', () => {
                    window.location.href = 'pages/login';
                });
                
                linksContainer.appendChild(loginButton);
                console.log('[Suite] Easter Egg ativado: Botão de Login revelado!');
            }
        }
    }

    return {
        init: function() {
            initThemeSwitch();
        }
    };
})();

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SuiteModule.init);
} else {
    SuiteModule.init();
}
