// sw.js - sederhana: cache shell app dan fallback
const CACHE_NAME = 'tanda-terima-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  // tambahkan asset lain jika ada (css, gambar statis)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  // Network-first for API/Firestore requests can be implemented separately.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // optionally cache new requests
        return resp;
      }).catch(()=> caches.match('/index.html'));
    })
  );
});
