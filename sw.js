const CACHE = 'prode-26-v2';
const FILES = ['./','./index.html','./manifest.json','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(()=>{})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  // No cachear nada de Firebase ni openfootball - siempre fresco
  if (e.request.url.includes('firestore') || e.request.url.includes('firebase') || e.request.url.includes('openfootball')) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && e.request.method === 'GET') {
        const c = r.clone();
        caches.open(CACHE).then(ca => ca.put(e.request, c)).catch(()=>{});
      }
      return r;
    }).catch(() => caches.match(e.request))
  );
});
