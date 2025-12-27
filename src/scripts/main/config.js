/**
 * ARQUIVO: config.js
 * DESCRIÇÃO: Arquivo de Configuração Global do Site.
 * FUNCIONALIDADES: Centraliza o carregamento de favicon, meta tags e estilos de temas.
 */

(function() {
    'use strict'; // Ativa o modo restrito do JavaScript para evitar erros comuns de codificação

    // ========================================
    // CONFIGURAÇÃO DE FAVICON (Ícones da Aba)
    // ========================================
    
    // Cria e configura o ícone padrão em formato PNG
    const iconDefault = document.createElement("link");
    iconDefault.rel = "icon"; // Define a relação como ícone
    iconDefault.href = "/database/favicon/Favicon.png"; // Caminho da imagem
    iconDefault.type = "image/png"; // Tipo do arquivo
    document.head.appendChild(iconDefault); // Adiciona a tag ao cabeçalho do HTML

    // Cria e configura o ícone específico para tamanho 32x32 pixels
    const icon32 = document.createElement("link");
    icon32.rel = "icon";
    icon32.type = "image/png";
    icon32.sizes = "32x32"; // Define o tamanho
    icon32.href = "/database/favicon/Favicon.png";
    document.head.appendChild(icon32);

    // Cria e configura o ícone específico para tamanho 16x16 pixels
    const icon16 = document.createElement("link");
    icon16.rel = "icon";
    icon16.type = "image/png";
    icon16.sizes = "16x16";
    icon16.href = "/database/favicon/Favicon.png";
    document.head.appendChild(icon16);

    // Configura o ícone para dispositivos Apple (iPhone/iPad) quando salvos na tela de início
    // Este é o ícone que aparece quando você adiciona um atalho no Safari
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.sizes = "180x180";
    appleIcon.href = "/database/favicon/Favicon.png";
    document.head.appendChild(appleIcon);

    // Configura o manifesto PWA (Progressive Web App) para Android
    // Este arquivo JSON define como o app se comporta quando instalado
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "/manifest.json"; // Aponta para um arquivo manifest.json na raiz
    document.head.appendChild(manifest);

    // ========================================
    // META TAGS PARA SAFARI E DISPOSITIVOS MÓVEIS
    // ========================================
    
    // Informa ao Safari que o site pode se comportar como um aplicativo em tela cheia
    const metaCapable = document.createElement("meta");
    metaCapable.name = "apple-mobile-web-app-capable";
    metaCapable.content = "yes";
    document.head.appendChild(metaCapable);

    // Define a cor da barra de status no Safari mobile como preta
    const metaStatusBar = document.createElement("meta");
    metaStatusBar.name = "apple-mobile-web-app-status-bar-style";
    metaStatusBar.content = "black";
    document.head.appendChild(metaStatusBar);

    // Define o título que aparecerá abaixo do ícone na tela de início do iPhone
    const metaTitle = document.createElement("meta");
    metaTitle.name = "apple-mobile-web-app-title";
    metaTitle.content = "Suite";
    document.head.appendChild(metaTitle);

    // Define a cor da barra de ferramentas no navegador Chrome do Android
    // Esta cor será usada para a barra de status e outras elementos da interface
    const metaTheme = document.createElement("meta");
    metaTheme.name = "theme-color";
    metaTheme.content = "#000000";
    document.head.appendChild(metaTheme);

    // ========================================
    // CARREGAMENTO DINÂMICO DE CSS DE TEMAS
    // ========================================
    
    // Cria uma tag <link> para carregar o arquivo CSS que gerencia os modos claro/escuro
    const modesCSS = document.createElement("link");
    modesCSS.rel = "stylesheet";
    modesCSS.href = "/src/styles/modes.css";
    document.head.appendChild(modesCSS);

    // Log de confirmação no console do desenvolvedor
    console.log("✅ Configurações globais carregadas: favicon, meta tags e temas");
})();
