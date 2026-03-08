// Service Worker — Centro Psicológico Aquí y Ahora A.C.
const CACHE_NAME = 'centro-psi-v1';

// Archivos a guardar en caché para uso offline
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalar: guarda archivos en caché
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activar: limpia cachés viejos
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: sirve desde caché si no hay red, si no va a la red
self.addEventListener('fetch', function(event) {
  // Las llamadas al backend de GAS siempre van a la red (no cachear datos)
  if (event.request.url.includes('script.google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      return cached || fetch(event.request).then(function(response) {
        // Guardar en caché si es un recurso estático
        if (response.status === 200 && event.request.method === 'GET') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Sin red y sin caché: mostrar página principal guardada
        return caches.match('/index.html');
      });
    })
  );
});
