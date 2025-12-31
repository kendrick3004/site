/**
 * ARQUIVO: sw.js
 * DESCRIÇÃO: Service Worker para o PWA "Suite".
 * FUNCIONALIDADES: Cache de arquivos estáticos para funcionamento offline e gerenciamento de ativos.
 * VERSÃO: 1.8.0
 */

const CACHE_NAME = 'suite-cache-v1.8.0';
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
    'src/styles/fonts.css',
    'src/styles/modes.css',
    'src/app/update.css',
    'src/app/update.js',
    'src/scripts/main/config.js',
    'database/avatar/avatar.jpg',
    'database/calendario.json',
    'database/templates/dark_mode.jpg',
    'database/templates/light_mode.jpg',
    'database/favicon/Favicon.png',
    'database/favicon/icon-192.png',
    'database/favicon/icon-512.png'
];

// Instalação do Service Worker e cache de recursos
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker v1.8.0...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cache aberto e ativos sendo armazenados');
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
    console.log('[SW] Ativando Service Worker v1.8.0...');
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

// Estratégia de Cache: Stale-While-Revalidate
// Serve do cache imediatamente, mas busca atualização na rede em segundo plano
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Atualiza o cache com a nova resposta da rede
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Se a rede falhar, o cache já foi retornado (se existir)
            });

            return cachedResponse || fetchPromise;
        })
    );
});
