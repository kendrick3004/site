/**
 * ARQUIVO: sw.js
 * DESCRIÇÃO: Service Worker para o PWA "Suite".
 * FUNCIONALIDADES: Cache de arquivos estáticos para funcionamento offline e gerenciamento de ativos.
 * VERSÃO: 2.0.0 - Auditoria Total e Comentários Detalhados
 */

/**
 * Nome do cache. Ao atualizar esta versão, o navegador entenderá que deve renovar os arquivos.
 */
const CACHE_NAME = 'suite-cache-v2.0.0';

/**
 * Lista de arquivos essenciais que serão armazenados localmente no dispositivo do usuário.
 * Isso permite que o aplicativo abra instantaneamente, mesmo sem conexão com a internet.
 */
const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    'pages/login.html',
    'pages/login-index.html',
    'pages/suite/suite.css',
    'pages/suite/suite.js',
    'pages/suite/santo-do-dia.js',
    'pages/suite/weather/weather.css',
    'pages/suite/weather/weather.js',
    'src/styles/fonts-manager.css',
    'src/styles/modes.css',
    'src/app/update.css',
    'src/app/update.js',
    'src/scripts/main/config.js',
    'src/scripts/main/factory.js',
    'database/avatar/avatar.jpg',
    'database/calendario.json',
    'database/templates/dark_mode.jpg',
    'database/templates/light_mode.jpg',
    'database/favicon/Favicon.png',
    'database/favicon/icon-192.png',
    'database/favicon/icon-512.png'
];

/**
 * EVENTO: INSTALL
 * Ocorre quando o Service Worker é registrado pela primeira vez.
 * Aqui abrimos o cache e salvamos todos os arquivos da lista ASSETS_TO_CACHE.
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker v2.0.0...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cache aberto e ativos sendo armazenados localmente');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => {
            // Força o Service Worker a se tornar ativo imediatamente
            return self.skipWaiting();
        })
    );
});

/**
 * EVENTO: ACTIVATE
 * Ocorre após a instalação. É o momento ideal para limpar caches de versões antigas
 * e garantir que o aplicativo use apenas os arquivos mais recentes.
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Ativando Service Worker v2.0.0...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Se o nome do cache encontrado for diferente do atual, ele é deletado
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Removendo cache antigo e obsoleto:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Permite que o Service Worker controle as páginas abertas imediatamente
            return self.clients.claim();
        })
    );
});

/**
 * EVENTO: FETCH
 * Intercepta todas as requisições de rede feitas pelo aplicativo.
 * ESTRATÉGIA: Stale-While-Revalidate
 * 1. Tenta servir o arquivo do cache imediatamente (velocidade máxima).
 * 2. Ao mesmo tempo, busca uma versão atualizada na rede.
 * 3. Se a rede retornar um arquivo novo, atualiza o cache para a próxima vez.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Inicia a busca na rede
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Se a resposta da rede for válida, atualizamos o cache
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone(); // Clonamos pois a resposta só pode ser lida uma vez
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Silencia erros de rede (o usuário está offline)
                console.log('[SW] Dispositivo offline, servindo do cache se disponível.');
            });

            // Retorna a resposta do cache se existir, caso contrário aguarda a rede
            return cachedResponse || fetchPromise;
        })
    );
});
