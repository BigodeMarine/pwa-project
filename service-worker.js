const CACHE_NAME = 'diario-bordo-v1';
const OFFLINE_URL = '/';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts.js',
    '/manifest.json',
    '/icons/icon-1.png',
    '/icons/icon-2.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).catch(() => caches.match('/index.html'));
            })
        );
        return;
    }

    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => response);
            })
        );
    }
});
