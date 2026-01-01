/**
 * ARQUIVO: factory.js
 * DESCRIÇÃO: Centraliza a geração de metadados, SEO e configurações estruturais ("fábrica").
 * OBJETIVO: Manter os arquivos HTML limpos e garantir consistência em todo o projeto.
 * VERSÃO: 2.1.0 - Sistema de Cores Infinitas Integrado
 */

/**
 * Módulo SiteFactory encapsulado para gerenciar a infraestrutura básica de cada página.
 * Ele injeta automaticamente tags de SEO, fontes e registra o Service Worker.
 */
const SiteFactory = (function() {
    'use strict'; // Modo restrito para melhor qualidade de código

    /**
     * Configurações globais do site.
     * Centralizar estes dados facilita a alteração de informações básicas em todas as páginas simultaneamente.
     */
    const CONFIG = {
        title: "Suite",                                     // Título principal do aplicativo
        description: "Dashboard pessoal com informações de clima, calendário litúrgico e links úteis.", // Descrição para SEO
        author: "Kendrick Nicoleti",                        // Autor do projeto
        keywords: "Suite, Dashboard, Clima, Santo do Dia, PWA, Produtividade", // Palavras-chave para busca
        themeColor: "#000000",                              // Cor do tema para navegadores mobile
        favicon: "database/favicon/Favicon.png"             // Caminho para o ícone do site
    };

    /**
     * Injeta metadados essenciais no <head> de cada página.
     * Isso inclui tags de descrição, autor, robôs de busca e configurações para Web Apps (PWA).
     */
    function injectMetadata() {
        const head = document.head;

        // Definição das Meta Tags padrão de SEO e comportamento mobile
        const metaTags = [
            { name: "description", content: CONFIG.description },
            { name: "author", content: CONFIG.author },
            { name: "keywords", content: CONFIG.keywords },
            { name: "robots", content: "index, follow" },      // Instrução para buscadores indexarem a página
            { name: "mobile-web-app-capable", content: "yes" }, // Suporte para Web App no Android
            { name: "apple-mobile-web-app-capable", content: "yes" }, // Suporte para Web App no iOS
            { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }, // Estilo da barra no iOS
            { name: "apple-mobile-web-app-title", content: CONFIG.title },
            { name: "format-detection", content: "telephone=no" } // Impede que números virem links de telefone automaticamente
        ];

        // Itera sobre o array e cria as tags meta se elas ainda não existirem no HTML
        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                head.appendChild(meta);
            }
        });

        /**
         * Tags Open Graph (OG)
         * Garantem que o site seja exibido corretamente ao ser compartilhado em redes sociais (Facebook, WhatsApp, etc).
         */
        const ogTags = [
            { property: "og:type", content: "website" },
            { property: "og:title", content: CONFIG.title },
            { property: "og:description", content: CONFIG.description },
            { property: "og:image", content: CONFIG.favicon },
            { property: "og:url", content: window.location.href }
        ];

        // Injeta as tags OG no cabeçalho
        ogTags.forEach(tag => {
            if (!document.querySelector(`meta[property="${tag.property}"]`)) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.content = tag.content;
                head.appendChild(meta);
            }
        });
    }

    /**
     * Inicializa o Service Worker (SW) para habilitar o suporte Offline e PWA.
     * O SW permite que o site carregue instantaneamente e funcione sem internet.
     */
    function initServiceWorker() {
        // Verifica se o navegador suporta Service Workers
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                /**
                 * Lógica de caminho dinâmico:
                 * Se a página estiver dentro da pasta /pages/, o SW está dois níveis acima (../../sw.js).
                 * Se estiver na raiz (index.html), o SW está na mesma pasta (sw.js).
                 */
                const swPath = window.location.pathname.includes('/pages/') ? '../../sw.js' : 'sw.js';
                
                // Registra o Service Worker
                navigator.serviceWorker.register(swPath)
                    .then(reg => console.log('[Factory] SW registrado com sucesso no escopo:', reg.scope))
                    .catch(err => console.error('[Factory] Falha ao registrar Service Worker:', err));
            });
        }
    }

    /**
     * Injeta o gerenciador de fontes centralizado (fonts-manager.css).
     * Isso garante que todas as fontes personalizadas estejam disponíveis em todas as páginas.
     */
    function injectFonts() {
        // Verifica se o arquivo de fontes já foi incluído para evitar duplicidade
        if (!document.querySelector('link[href*="fonts-manager.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            
            /**
             * Ajuste dinâmico de caminho para o CSS de fontes:
             * Páginas em subpastas precisam de um caminho diferente das páginas na raiz.
             */
            const path = window.location.pathname.includes('/pages/') ? '../src/styles/fonts-manager.css' : 'src/styles/fonts-manager.css';
            
            link.href = path;
            document.head.appendChild(link); // Adiciona o link do CSS ao cabeçalho
        }
    }

    /**
     * Injeta o sistema de cores infinitas (colors.js).
     * Permite o acesso ao banco de dados de 16.7 milhões de cores.
     */
    function injectColorSystem() {
        if (!document.querySelector('script[src*="colors.js"]')) {
            const script = document.createElement('script');
            const path = window.location.pathname.includes('/pages/') ? '../../src/scripts/main/colors.js' : 'src/scripts/main/colors.js';
            script.src = path;
            document.head.appendChild(script);
        }
    }

    /**
     * EXECUÇÃO AUTOMÁTICA
     * Ao carregar este script, ele executa imediatamente as funções de infraestrutura.
     */
    injectMetadata();    // Prepara o SEO e metadados
    injectFonts();       // Carrega as fontes do sistema
    injectColorSystem(); // Carrega o sistema de cores infinitas
    initServiceWorker(); // Ativa as capacidades offline

    // Retorna a configuração para que possa ser acessada externamente se necessário
    return {
        config: CONFIG
    };
})();
