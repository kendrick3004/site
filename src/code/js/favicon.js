(function() {
    // Este script JavaScript é responsável por adicionar dinamicamente vários elementos <link> e <meta>
    // ao cabeçalho (head) do documento HTML. O objetivo principal é configurar favicons para diferentes
    // dispositivos e navegadores, além de metadados para Progressive Web Apps (PWAs) e dispositivos Apple.

    // Ícone padrão (ICO)
    // Cria um elemento <link> para o favicon tradicional no formato .ico.
    const iconDefault = document.createElement("link");
    iconDefault.rel = "icon"; // Define a relação como 'icon' (favicon)
    iconDefault.href = "/src/Favicon/Favicon.ico"; // Caminho para o arquivo .ico
    iconDefault.type = "image/x-icon"; // Tipo MIME do arquivo
    document.head.appendChild(iconDefault); // Adiciona o elemento ao <head>

    // PNG 32x32 (opcional, se existir)
    // Cria um elemento <link> para um favicon PNG de 32x32 pixels.
    const icon32 = document.createElement("link");
    icon32.rel = "icon"; // Define a relação como 'icon'
    icon32.type = "image/png"; // Tipo MIME do arquivo
    icon32.sizes = "32x32"; // Define o tamanho do ícone
    icon32.href = "/src/Favicon/favicon.png"; // Caminho para o arquivo PNG
    document.head.appendChild(icon32); // Adiciona o elemento ao <head>

    // PNG 16x16 (opcional, se existir)
    // Cria um elemento <link> para um favicon PNG de 16x16 pixels.
    const icon16 = document.createElement("link");
    icon16.rel = "icon"; // Define a relação como 'icon'
    icon16.type = "image/png"; // Tipo MIME do arquivo
    icon16.sizes = "16x16"; // Define o tamanho do ícone
    icon16.href = "/src/Favicon/favicon.png"; // Caminho para o arquivo PNG
    document.head.appendChild(icon16); // Adiciona o elemento ao <head>

    // Apple Touch Icon (opcional, se existir)
    // Cria um elemento <link> para o ícone usado por dispositivos Apple (iOS) quando o site é adicionado à tela inicial.
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon"; // Define a relação como 'apple-touch-icon'
    appleIcon.sizes = "180x180"; // Define o tamanho do ícone para dispositivos Apple
    appleIcon.href = "/src/Favicon/favicon.png"; // Caminho para o arquivo PNG
    document.head.appendChild(appleIcon); // Adiciona o elemento ao <head>

    // Manifesto PWA (opcional, se existir)
    // Cria um elemento <link> para o arquivo de manifesto de um Progressive Web App (PWA).
    // O manifesto fornece informações sobre o aplicativo web, como nome, ícones e comportamento de exibição.
    const manifest = document.createElement("link");
    manifest.rel = "manifest"; // Define a relação como 'manifest'
    manifest.href = "/src/Favicon/favicon.png"; // Caminho para o arquivo de manifesto (geralmente .webmanifest)
    document.head.appendChild(manifest); // Adiciona o elemento ao <head>

    // Safari (macOS/iOS) metas
    // Cria metatags específicas para o navegador Safari em dispositivos Apple.

    // Meta tag para indicar que o aplicativo web pode ser executado em modo de tela cheia.
    const metaCapable = document.createElement("meta");
    metaCapable.name = "apple-mobile-web-app-capable";
    metaCapable.content = "yes";
    document.head.appendChild(metaCapable); // Adiciona o elemento ao <head>

    // Meta tag para definir o estilo da barra de status em dispositivos iOS.
    const metaStatusBar = document.createElement("meta");
    metaStatusBar.name = "apple-mobile-web-app-status-bar-style";
    metaStatusBar.content = "black"; // Define a cor da barra de status como preta
    document.head.appendChild(metaStatusBar); // Adiciona o elemento ao <head>

    // Meta tag para definir o título do aplicativo web na tela inicial do iOS.
    const metaTitle = document.createElement("meta");
    metaTitle.name = "apple-mobile-web-app-title";
    metaTitle.content = "Nome do Site"; // Define o título do site
    document.head.appendChild(metaTitle); // Adiciona o elemento ao <head>

    // Cor da barra de ferramentas mobile
    // Meta tag para definir a cor da barra de endereço do navegador em dispositivos Android (Chrome).
    const metaTheme = document.createElement("meta");
    metaTheme.name = "theme-color";
    metaTheme.content = "#ffffff"; // Define a cor do tema como branco
    document.head.appendChild(metaTheme); // Adiciona o elemento ao <head>
})();

