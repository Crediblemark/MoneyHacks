// Basic service worker
self.addEventListener('install', (event) => {
  console.log('ChatExpense Service Worker installing.');
  // event.waitUntil(
  //   caches.open('chatexpense-cache-v1').then((cache) => {
  //     return cache.addAll([
  //       // Add URLs to cache here for offline access
  //       // '/',
  //       // '/index.html', // if you have one
  //       // '/styles/main.css', // example
  //       // '/scripts/main.js'  // example
  //     ]);
  //   })
  // );
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('ChatExpense Service Worker activating.');
  // event.waitUntil(
  //   // Clean up old caches if any
  //   caches.keys().then((cacheNames) => {
  //     return Promise.all(
  //       cacheNames.map((cacheName) => {
  //         if (cacheName !== 'chatexpense-cache-v1') { // Update 'chatexpense-cache-v1' if you change cache name
  //           return caches.delete(cacheName);
  //         }
  //       })
  //     );
  //   })
  // );
  return self.clients.claim(); // Ensure new service worker takes control immediately
});

self.addEventListener('fetch', (event) => {
  // console.log('ChatExpense Service Worker fetching:', event.request.url);
  // Basic cache-first strategy (example, can be more complex)
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );
});
