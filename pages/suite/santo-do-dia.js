/**
 * ARQUIVO: santo-do-dia.js
 * DESCRIÇÃO: Módulo robusto para exibição do calendário litúrgico com suporte a múltiplos santos.
 */

const SaintModule = (function() {
    'use strict';

    let lastProcessedDate = "";

    /**
     * Sanitiza strings e converte separadores " / " em quebras de linha para múltiplos santos.
     */
    function formatSaintName(name) {
        if (!name) return 'Desconhecido';
        
        // Divide os nomes pelo separador " / "
        const names = name.split(' / ');
        
        // Sanitiza cada nome e junta com <br> para quebra de linha no HTML
        return names.map(n => {
            const temp = document.createElement('div');
            temp.textContent = n.trim();
            return temp.innerHTML;
        }).join('<br>');
    }

    function sanitize(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    /**
     * Atualiza a interface com os dados do santo/dia.
     */
    function updateUI(saint) {
        const elements = {
            name: document.querySelector('.santo-name'),
            type: document.querySelector('.santo-type'),
            desc: document.querySelector('.santo-description'),
            ribbon: document.querySelector('.santo-ribbon')
        };

        if (!elements.name || !elements.type || !elements.desc || !elements.ribbon) return;

        if (!saint) {
            elements.name.textContent = 'Dia de hoje não encontrado na base de dados';
            elements.type.textContent = '--';
            elements.desc.textContent = 'Verifique o calendário litúrgico';
            elements.ribbon.style.backgroundColor = '#FFFFFF';
            return;
        }

        // Usa innerHTML para permitir as quebras de linha (<br>) entre múltiplos santos
        elements.name.innerHTML = formatSaintName(saint.name);
        elements.type.textContent = sanitize(saint.type) || '--';
        elements.desc.textContent = sanitize(saint.description) || 'Celebração litúrgica';
        elements.ribbon.style.backgroundColor = saint.color || '#FFFFFF';
    }

    /**
     * Calcula a data litúrgica correta (incluindo virada de domingo às 15h).
     */
    function getLiturgicalDate() {
        const now = new Date();
        if (now.getDay() === 0 && now.getHours() >= 15) {
            now.setDate(now.getDate() + 1);
        }
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function refresh() {
        const today = getLiturgicalDate();
        if (today === lastProcessedDate) return;

        try {
            const response = await fetch('./database/calendario.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const calendar = await response.json();
            const entry = calendar.find(item => item.date === today);
            
            if (entry && entry.saint) {
                updateUI(entry.saint);
                lastProcessedDate = today;
                console.log(`[SaintModule] Atualizado para: ${today}`);
            } else {
                updateUI(null);
            }
        } catch (error) {
            console.error('[SaintModule] Erro ao carregar calendário:', error);
            updateUI(null);
        }
    }

    return {
        init: function() {
            refresh();
            setInterval(refresh, 60000);
        }
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SaintModule.init);
} else {
    SaintModule.init();
}
