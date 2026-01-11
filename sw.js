/**
 * ARQUIVO: sw.js
 * DESCRIÇÃO: Service Worker otimizado para resiliência offline e recarregamento de página.
 * FUNCIONALIDADES: Cache agressivo de ativos e suporte a recarregamento sem internet.
 * VERSÃO: 2.3.0 - Resiliência Offline Aprimorada
 */

const CACHE_NAME = 'suite-cache-v2.3.0';

/**
 * Lista expandida de ativos para garantir que todas as páginas internas funcionem offline.
 */
const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    '404.html',
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
    'src/scripts/main/colors.js',
    'database/avatar/avatar.jpg',
    'database/calendario.json',
    'database/templates/dark_mode.jpg',
    'database/templates/light_mode.jpg',
    'database/favicon/Favicon.png',
    'database/favicon/icon-192.png',
    'database/favicon/icon-512.png'
];

self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker v2.3.0...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cacheando ativos para suporte offline...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Ativando Service Worker v2.3.0...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

/**
 * Estratégia: Cache First para ativos estáticos, Network First para dados dinâmicos.
 * Isso garante que o aplicativo carregue instantaneamente ao recarregar, mesmo offline.
 */
self.addEventListener('fetch', (event) => {
    // Ignora requisições para a API de clima (elas são tratadas pelo weather.js com LocalStorage)
    if (event.request.url.includes('api.weatherapi.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Se estiver no cache, retorna imediatamente (suporte offline ao recarregar)
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                // Se não estiver no cache, busca na rede e salva para a próxima vez
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Se falhar a rede e não tiver no cache, retorna a página inicial ou 404
                if (event.request.mode === 'navigate') {
                    return caches.match('index.html');
                }
            });
        })
    );
});
