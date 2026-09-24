// ============================================================================
// SERVICE WORKER : GOURMETRESTO PWA (SW.JS)
// ============================================================================
const CACHE_NAME = 'gourmetresto-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Les requêtes API ne doivent pas être cachées par le SW
  const url = event.request.url;
  if (url.includes('/authentification') ||
      url.includes('/commande') ||
      url.includes('/plat') ||
      url.includes('/facture') ||
      url.includes('/client') ||
      url.includes('/user') ||
      url.includes('/categori') ||
      url.includes('/recherche')) {
    return;
  }

  // Cache-first pour le shell de l'application
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => caches.match('/'));
    })
  );
});
