const CACHE = 'merc-v5';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    './', 'index.html', 'manifest.webmanifest', 'icon.svg',
    'img/room-base.png', 'img/street.png',
    'img/hero-sleepy.png', 'img/hero-awake.png',
    'img/furn-bed.png', 'img/furn-board.png', 'img/furn-shelf.png',
    'img/furn-rug.png', 'img/furn-chest.png', 'img/furn-bookcase.png',
    'img/focus-gathering.png', 'img/focus-fight.png', 'img/focus-escort.png', 'img/focus-search.png'
  ])));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(m => m || caches.match('index.html')))
  );
});