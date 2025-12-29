/**
 * ARQUIVO: update.js
 * LOCAL: /src/app/
 * DESCRIÇÃO: Sistema de notificação de melhorias exclusivo para o App instalado.
 */

const UpdateSystem = (function() {
    'use strict';

    // IMPORTANTE: Para testar agora, a CURRENT_VERSION deve ser menor que a do version.json
    const CURRENT_VERSION = '1.1.0'; 
    const VERSION_CHECK_URL = '/src/app/version.json';
    const STORAGE_KEY = 'suite_last_seen_version';

    function isStandalone() {
        return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');
    }

    function init() {
        // Para fins de teste, se você quiser ver no navegador também, comente a linha abaixo
        if (!isStandalone()) return;

        // Aparece 1 segundo após o carregamento para ser rápido no teste
        setTimeout(checkVersion, 1000);
    }

    async function checkVersion() {
        try {
            const response = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`);
            if (!response.ok) return;

            const data = await response.json();
            const lastSeenVersion = localStorage.getItem(STORAGE_KEY);

            console.log(`[App] Versão Local: ${CURRENT_VERSION} | Servidor: ${data.version} | Vista: ${lastSeenVersion}`);

            // Lógica: Se a versão do servidor for maior que a local E maior que a última que o usuário viu
            if (isNewerVersion(data.version, CURRENT_VERSION) && isNewerVersion(data.version, lastSeenVersion || '0.0.0')) {
                showUpdateModal(data);
            }
        } catch (error) {
            console.error('[App] Erro na verificação:', error);
        }
    }

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

    function showUpdateModal(data) {
        if (document.querySelector('.update-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'update-overlay';
        
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
        requestAnimationFrame(() => overlay.classList.add('active'));

        document.getElementById('btn-close-update').onclick = () => {
            // GRAVA NA MEMÓRIA: O usuário já viu esta versão
            localStorage.setItem(STORAGE_KEY, data.version);
            console.log(`[App] Versão ${data.version} marcada como vista.`);
            
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400);
        };
    }

    function formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
            .replace(/<\/ul>\s*<ul>/gim, '')
            .replace(/\n/g, '<br>');
    }

    return { init: init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UpdateSystem.init);
} else {
    UpdateSystem.init();
}
