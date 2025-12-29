/**
 * ARQUIVO: update.js
 * LOCAL: /src/app/
 * DESCRIÇÃO: Sistema inteligente de gestão de atualizações e melhorias.
 * FUNCIONALIDADES: 
 *   - Detecção de ambiente (Navegador vs Atalho Instalado)
 *   - Verificação assíncrona de versão via JSON
 *   - Persistência de estado via LocalStorage (exibição única)
 *   - Renderização dinâmica de notas em Markdown
 */

const UpdateSystem = (function() {
    'use strict';

    // Configurações centrais do sistema
    const CURRENT_VERSION = '1.1.1'; // Versão atual do código fonte
    const VERSION_CHECK_URL = '/src/app/version.json'; // Endpoint do arquivo de versão
    const STORAGE_KEY = 'suite_last_seen_version'; // Chave para persistência no navegador

    /**
     * Verifica se a aplicação está sendo executada no modo "Standalone".
     * Isso identifica se o usuário abriu o atalho instalado na tela inicial.
     * @returns {boolean} Verdadeiro se for o app instalado.
     */
    function isStandalone() {
        const isPWA = window.matchMedia('(display-mode: standalone)').matches;
        const isIOS = window.navigator.standalone;
        const isAndroidApp = document.referrer.includes('android-app://');
        return isPWA || isIOS || isAndroidApp;
    }

    /**
     * Ponto de entrada do sistema.
     * Só ativa a lógica se detectar que é o aplicativo instalado.
     */
    function init() {
        if (!isStandalone()) {
            console.log('[App] Rodando no navegador. Sistema de atualização em espera.');
            return;
        }

        console.log('[App] Modo Standalone detectado. Iniciando verificador de melhorias.');
        
        // Delay estratégico para priorizar o carregamento visual do site
        setTimeout(checkVersion, 2500);
    }

    /**
     * Realiza a chamada ao servidor para buscar a versão mais recente.
     * Compara com a versão local e com a última versão que o usuário visualizou.
     */
    async function checkVersion() {
        try {
            // Adiciona um timestamp para evitar cache do navegador na busca do JSON
            const response = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`);
            if (!response.ok) throw new Error('Falha ao buscar arquivo de versão');

            const data = await response.json();
            const lastSeenVersion = localStorage.getItem(STORAGE_KEY);

            // Lógica de decisão: 
            // 1. Existe uma versão nova no servidor?
            // 2. O usuário já viu essa versão específica?
            if (isNewerVersion(data.version, CURRENT_VERSION) && 
                isNewerVersion(data.version, lastSeenVersion || '0.0.0')) {
                showUpdateModal(data);
            }
        } catch (error) {
            console.warn('[App] Verificação de versão ignorada:', error.message);
        }
    }

    /**
     * Algoritmo de comparação de versões semânticas (Major.Minor.Patch).
     * @param {string} newVer - Versão vinda do servidor.
     * @param {string} currentVer - Versão atual para comparar.
     * @returns {boolean}
     */
    function isNewerVersion(newVer, currentVer) {
        if (!newVer) return false;
        const v1 = newVer.split('.').map(Number);
        const v2 = currentVer.split('.').map(Number);
        
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;
            if (num1 > num2) return true;
            if (num1 < num2) return false;
        }
        return false;
    }

    /**
     * Constrói e injeta o modal de novidades na interface.
     * Utiliza o design Glassmorphism definido no update.css.
     * @param {Object} data - Dados contendo versão e notas.
     */
    function showUpdateModal(data) {
        // Prevenção contra múltiplas instâncias do modal
        if (document.querySelector('.update-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'update-overlay';
        
        // Processa as notas em Markdown para HTML seguro
        const htmlNotes = formatMarkdown(data.notes);

        overlay.innerHTML = `
            <div class="update-modal">
                <div class="update-header">
                    <h2 class="update-title">O que melhorou</h2>
                    <span class="update-version">v${data.version}</span>
                </div>
                <div class="update-content">
                    ${htmlNotes}
                </div>
                <div class="update-actions">
                    <button class="update-btn update-btn-primary" id="btn-close-update">Entendido</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        // Ativa a animação de entrada (fade-in + slide-up)
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // Gerenciador do botão de fechamento
        document.getElementById('btn-close-update').onclick = () => {
            // Persiste a visualização para não incomodar o usuário novamente
            localStorage.setItem(STORAGE_KEY, data.version);
            
            // Animação de saída
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400);
        };
    }

    /**
     * Mini-parser de Markdown para converter sintaxe básica em HTML.
     * Suporta: Títulos (###), Negrito (**), Listas (-) e Quebras de linha.
     * @param {string} text - Texto bruto em Markdown.
     * @returns {string} HTML formatado.
     */
    function formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>') // Títulos de nível 3
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>') // Negrito
            .replace(/^\- (.*$)/gim, '<li>$1</li>') // Itens de lista
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>') // Envolve itens em <ul>
            .replace(/<\/ul>\s*<ul>/gim, '') // Limpa tags <ul> duplicadas
            .replace(/\n/g, '<br>'); // Converte quebras de linha simples
    }

    // Exporta o método de inicialização
    return {
        init: init
    };
})();

/**
 * INICIALIZAÇÃO SEGURA
 * Garante que o script só rode após o carregamento completo do DOM.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UpdateSystem.init);
} else {
    UpdateSystem.init();
}
