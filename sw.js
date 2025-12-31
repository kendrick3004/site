/**
 * ARQUIVO: sw.js
 * DESCRIÇÃO: Service Worker para o PWA "Suite".
 * FUNCIONALIDADES: Cache de arquivos estáticos para funcionamento offline.
 */

const CACHE_NAME = 'suite-cache-v1.0.1';
const ASSETS_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    'pages/suite/suite.css',
    'pages/suite/suite.js',
    'pages/suite/santo-do-dia.js',
    'pages/suite/weather/weather.css',
    'pages/suite/weather/weather.js',
    'src/styles/fonts.css',
    'src/styles/modes.css',
    'src/app/update.css',
    'src/app/update.js',
    'database/avatar/avatar.jpg',
    'database/calendario.json'
];

// Instalação do Service Worker e cache de recursos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Cache aberto');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
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
        })
    );
});

// Estratégia de Cache: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
