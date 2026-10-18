/* Chili's PWA — cache-first shell so the app opens and works offline. */
const CACHE = 'chilis-pwa-v2';

const ASSETS = [
  './',
  'index.html',
  'app.html',
  'styles.css',
  'landing.css',
  'app.js',
  'pwa.js',
  'manifest.webmanifest',
  'lucide.min.js',
  'triple-dipper-logo.webp',
  'chili.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'images/pexels-photo-12557551.jpg',
  'images/pexels-photo-14303579.jpg',
  'images/pexels-photo-15010289.jpg',
  'images/pexels-photo-1556698.jpg',
  'images/pexels-photo-1639557.jpg',
  'images/pexels-photo-20323423.jpg',
  'images/pexels-photo-25390059.jpg',
  'images/pexels-photo-25390061.jpg',
  'images/pexels-photo-27294722.jpg',
  'images/pexels-photo-30700803.jpg',
  'images/pexels-photo-31256017.jpg',
  'images/pexels-photo-40135708.jpg',
  'images/pexels-photo-40135711.jpg',
  'images/pexels-photo-4662032.jpg',
  'images/pexels-photo-5474836.jpg',
  'images/pexels-photo-5668209.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(ASSETS.map(url => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;   // fonts and the like stay on the network

  const isNavigation = request.mode === 'navigate';

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => null);

      // cached copy wins for instant paint, network refreshes the cache in the background
      if (cached) { network.catch(() => null); return cached; }
      return network.then(response => response || (isNavigation ? caches.match('app.html') : undefined));
    }).then(response => response || new Response('', { status: 504, statusText: 'offline' }))
  );
});
