/**
 * ARQUIVO: colors.js
 * DESCRIÇÃO: Módulo de gerenciamento do banco de dados de 16.7 milhões de cores.
 * FUNCIONALIDADES: Busca cores por HEX ou RGB e injeta variáveis CSS dinâmicas.
 * VERSÃO: 2.2.0 - Integração Total com Banco de Dados Local
 */

const ColorSystem = (function() {
    'use strict';

    const BASE_PATH = 'database/colors/';

    /**
     * Converte HEX para o nome do arquivo de segmento (baseado no canal Red).
     */
    function getSegmentName(hex) {
        // Normaliza hex curto (#FFF -> #FFFFFF)
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        const r = parseInt(hex.slice(1, 3), 16);
        return `r_${r}.json`;
    }

    /**
     * Busca uma cor específica no banco de dados local.
     */
    async function getColor(hex) {
        hex = hex.toUpperCase();
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        
        if (!/^#[0-9A-F]{6}$/.test(hex)) return null;

        const segmentFile = getSegmentName(hex);
        const path = window.location.pathname.includes('/pages/') ? `../../${BASE_PATH}${segmentFile}` : `${BASE_PATH}${segmentFile}`;

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Erro ao carregar segmento: ${segmentFile}`);
            
            const colors = await response.json();
            return colors[hex] || null;
        } catch (error) {
            console.error('[ColorSystem] Erro na busca da cor:', error);
            return null;
        }
    }

    /**
     * Injeta uma cor do banco de dados como uma variável CSS no :root.
     * @param {string} varName Nome da variável (ex: --primary-color).
     * @param {string} hex Código HEX para buscar no banco.
     */
    async function applyColor(varName, hex) {
        const rgbValue = await getColor(hex);
        if (rgbValue) {
            document.documentElement.style.setProperty(varName, rgbValue);
            // console.log(`[ColorSystem] Aplicada cor ${hex} (${rgbValue}) para ${varName}`);
        }
    }

    /**
     * Inicializa as cores padrão do sistema puxando da base de dados.
     */
    async function initDefaultTheme() {
        const defaultColors = {
            '--text-primary': '#FFFFFF',
            '--text-secondary': '#A0A0A0',
            '--bg-dark': '#1A1A1A',
            '--accent-gold': '#FFD700',
            '--accent-purple': '#9370DB'
        };

        for (const [name, hex] of Object.entries(defaultColors)) {
            await applyColor(name, hex);
        }
    }

    return {
        getRGB: getColor,
        apply: applyColor,
        init: initDefaultTheme
    };
})();

// Inicializa o tema padrão ao carregar
ColorSystem.init();
