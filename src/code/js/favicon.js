(function() {
    // Ícone padrão (ICO)
    const iconDefault = document.createElement('link');
    iconDefault.rel = 'icon';
    iconDefault.href = '/src/Favicon/Favicon.ico';
    iconDefault.type = 'image/x-icon';
    document.head.appendChild(iconDefault);

    // PNG 32x32 (opcional, se existir)
    const icon32 = document.createElement('link');
    icon32.rel = 'icon';
    icon32.type = 'image/png';
    icon32.sizes = '32x32';
    icon32.href = '/src/Favicon/favicon.png';
    document.head.appendChild(icon32);

    // PNG 16x16 (opcional, se existir)
    const icon16 = document.createElement('link');
    icon16.rel = 'icon';
    icon16.type = 'image/png';
    icon16.sizes = '16x16';
    icon16.href = '/src/Favicon/favicon.png';
    document.head.appendChild(icon16);

    // Apple Touch Icon (opcional, se existir)
    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.sizes = '180x180';
    appleIcon.href = '/src/Favicon/favicon.png';
    document.head.appendChild(appleIcon);

    // Manifesto PWA (opcional, se existir)
    const manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/src/Favicon/favicon.png';
    document.head.appendChild(manifest);

    // Safari (macOS/iOS) metas
    const metaCapable = document.createElement('meta');
    metaCapable.name = 'apple-mobile-web-app-capable';
    metaCapable.content = 'yes';
    document.head.appendChild(metaCapable);

    const metaStatusBar = document.createElement('meta');
    metaStatusBar.name = 'apple-mobile-web-app-status-bar-style';
    metaStatusBar.content = 'black';
    document.head.appendChild(metaStatusBar);

    const metaTitle = document.createElement('meta');
    metaTitle.name = 'apple-mobile-web-app-title';
    metaTitle.content = 'Nome do Site';
    document.head.appendChild(metaTitle);

    // Cor da barra de ferramentas mobile
    const metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    metaTheme.content = '#ffffff';
    document.head.appendChild(metaTheme);
})();