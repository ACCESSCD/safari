const CACHE_NAME = 'safari-trip-v5';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './css/main.css',
    './css/print.css',
    './js/data.js',
    './js/store.js',
    './js/app.js',
    './assets/images/hero-cheetah.avif',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png'
];
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
    event.waitUntil(
        // Cache each shell file independently so one slow/failed asset (e.g. on
        // weak signal) can't block the rest from being available offline.
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => {})))
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

function fetchWithTimeout(request, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('network timeout')), ms);
        fetch(request, { cache: 'no-store' }).then(
            (response) => { clearTimeout(timer); resolve(response); },
            (err) => { clearTimeout(timer); reject(err); }
        );
    });
}

// Network-first so live edits always win when online, but don't let a slow or
// flaky connection (e.g. roaming) hang or fail outright — fall back to cache quickly.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetchWithTimeout(event.request, NETWORK_TIMEOUT_MS)
            .then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                return response;
            })
            .catch(() =>
                caches.match(event.request).then((cached) => cached || caches.match('./index.html'))
            )
    );
});
