/**
 * ARQUIVO: update.js
 * LOCAL: /src/app/
 * DESCRIÇÃO: Sistema de notificação de melhorias exclusivo para o App instalado (PWA).
 * FUNCIONALIDADES: Verifica novas versões, compara com a atual e exibe um modal informativo.
 * VERSÃO: 2.0.0 - Auditoria Total e Comentários Detalhados
 */

/**
 * Módulo UpdateSystem encapsulado para gerenciar notificações de atualização.
 */
const UpdateSystem = (function() {
    'use strict';

    // Versão atual do código em execução
    const CURRENT_VERSION = '2.0.0'; 
    
    // URL do arquivo JSON que contém a versão mais recente disponível no servidor
    const VERSION_CHECK_URL = 'src/app/version.json'; 
    
    // Chave do localStorage para rastrear qual foi a última versão que o usuário visualizou
    const STORAGE_KEY = 'suite_last_seen_version';

    /**
     * Verifica se o site está sendo executado como um aplicativo instalado (PWA).
     * @returns {boolean} Verdadeiro se estiver em modo standalone.
     */
    function isStandalone() {
        return (window.matchMedia('(display-mode: standalone)').matches) || 
               (window.navigator.standalone) || 
               document.referrer.includes('android-app://');
    }

    /**
     * Inicializa o sistema de verificação de atualizações.
     * Só executa se o app estiver instalado para evitar popups desnecessários no navegador comum.
     */
    function init() {
        if (!isStandalone()) return;
        
        // Aguarda 1 segundo após o carregamento para não interferir na performance inicial
        setTimeout(checkVersion, 1000);
    }

    /**
     * Busca o arquivo de versão no servidor e decide se deve exibir o modal de novidades.
     */
    async function checkVersion() {
        try {
            // Adiciona um timestamp (t=Date.now()) para evitar que o navegador use uma versão em cache do JSON
            const response = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`);
            if (!response.ok) return;

            const data = await response.json();
            const lastSeenVersion = localStorage.getItem(STORAGE_KEY);

            /**
             * Lógica de exibição:
             * 1. A versão no servidor (data.version) deve ser maior que a versão atual (CURRENT_VERSION).
             * 2. A versão no servidor deve ser maior que a última versão que o usuário "viu" (lastSeenVersion).
             */
            if (isNewerVersion(data.version, CURRENT_VERSION) && 
                isNewerVersion(data.version, lastSeenVersion || '0.0.0')) {
                showUpdateModal(data);
            }
        } catch (error) {
            console.error('[App] Erro na verificação de atualizações:', error);
        }
    }

    /**
     * Compara duas strings de versão (ex: '1.8.9' vs '1.9.0').
     * @param {string} newVer Versão candidata a ser mais nova.
     * @param {string} currentVer Versão de referência.
     * @returns {boolean} Verdadeiro se newVer for maior que currentVer.
     */
    function isNewerVersion(newVer, currentVer) {
        if (!newVer) return false;
        
        // Divide a string por pontos e converte cada parte em número
        const v1 = newVer.split('.').map(Number);
        const v2 = currentVer.split('.').map(Number);
        
        // Compara cada segmento da versão (Major, Minor, Patch)
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;
            if (num1 > num2) return true;
            if (num1 < num2) return false;
        }
        return false;
    }

    /**
     * Cria e exibe o modal de atualização na tela.
     * @param {Object} data Dados vindos do version.json.
     */
    function showUpdateModal(data) {
        // Evita criar múltiplos modais se um já estiver aberto
        if (document.querySelector('.update-overlay')) return;

        // Cria o fundo escurecido (overlay)
        const overlay = document.createElement('div');
        overlay.className = 'update-overlay';
        
        // Converte as notas em Markdown simples para HTML
        const htmlNotes = formatMarkdown(data.notes);

        // Define a estrutura interna do modal
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

        // Adiciona o modal ao corpo da página
        document.body.appendChild(overlay);
        
        // Ativa a animação de entrada no próximo frame de renderização
        requestAnimationFrame(() => overlay.classList.add('active'));

        // Configura o botão de fechar
        document.getElementById('btn-close-update').onclick = () => {
            // Salva que o usuário já viu esta versão para não mostrar novamente
            localStorage.setItem(STORAGE_KEY, data.version);
            
            // Remove a classe ativa para disparar a animação de saída
            overlay.classList.remove('active');
            
            // Remove o elemento do DOM após o término da animação (400ms)
            setTimeout(() => overlay.remove(), 400);
        };
    }

    /**
     * Mini-parser de Markdown para converter as notas de versão em HTML básico.
     * @param {string} text Texto em formato Markdown.
     * @returns {string} Texto convertido em HTML.
     */
    function formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')             // Converte ### em <h3>
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')   // Converte ** em <strong>
            .replace(/^\- (.*$)/gim, '<li>$1</li>')              // Converte - em <li>
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')         // Envolve <li> em <ul>
            .replace(/<\/ul>\s*<ul>/gim, '')                     // Remove <ul> duplicados entre itens
            .replace(/\n/g, '<br>');                             // Converte quebras de linha em <br>
    }

    // Expõe apenas o método de inicialização
    return { init: init };
})();

/**
 * Inicialização do sistema de atualização baseada no estado do documento.
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UpdateSystem.init);
} else {
    UpdateSystem.init();
}
