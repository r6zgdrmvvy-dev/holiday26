const CACHE='scotland-escape-v1';
const ASSETS=['./','./index.html','./planning.html','./features.html','./style.css','./script.js','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
