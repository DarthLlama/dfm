var CACHE_NAME = 'gih-cache-v5';
var BASE_PATH = '/dfm/';
var CACHED_URLS = [
  // Our HTML
  BASE_PATH + 'first.html',
  // Stylesheets and fonts
    BASE_PATH + 'min-style.css',
    BASE_PATH + 'styles.css',
    BASE_PATH + 'mystyles.css',
    BASE_PATH + 'offline-map.js',
    'https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
  // JavaScript
    BASE_PATH + 'material.js',
  // Images
    BASE_PATH + 'appimages/android-icon-36x36.png',
    BASE_PATH + 'appimages/android-icon-48x48.png',
    BASE_PATH + 'appimages/android-icon-72x72.png',
    BASE_PATH + 'appimages/android-icon-96x96.png',
    BASE_PATH + 'appimages/android-icon-144x144.png',
    BASE_PATH + 'appimages/android-icon-192x192.png',
    BASE_PATH + 'appimages/paddy.jpg',
    BASE_PATH + 'appimages/favicon.ico',
    BASE_PATH + 'appimages/favicon-16x16.ico',
    BASE_PATH + 'appimages/favicon-96x96.ico',
    BASE_PATH + 'appimages/favicon.ico',
    BASE_PATH + 'eventsimages/example-blog01.jpg',
    BASE_PATH + 'eventsimages/example-blog02.jpg',
    BASE_PATH + 'eventsimages/example-blog03.jpg',
    BASE_PATH + 'eventsimages/example-blog04.jpg',
    BASE_PATH + 'eventsimages/example-blog05.jpg',
    BASE_PATH + 'eventsimages/example-blog06.jpg',
    BASE_PATH + 'eventsimages/example-blog07.jpg',
    BASE_PATH + 'eventsimages/example-blog08.jpg',
    BASE_PATH + 'https://maps.googleapis.com/maps/api/staticmap?center=53.0027,2.1794&zoom=2&size=600x100&key=AIzaSyDDCkYNBfhXUt6Ogx_ITtmNdjt0w9oW1rE'
    
];

self.addEventListener('install', function(event) {
  // Cache everything in CACHED_URLS. Installation will fail if something fails to cache
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestURL = new URL(event.request.url);
  if (requestURL.pathname === BASE_PATH + 'first.html') {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match('first.html').then(function(cachedResponse) {
          var fetchPromise = fetch('first.html').then(function(networkResponse) {
            cache.put('first.html', networkResponse.clone());
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
       // Handle requests for Google Maps JavaScript API file
  } else if (requestURL.href === googleMapsAPIJS) {
    event.respondWith(
      fetch(
        googleMapsAPIJS+'&'+Date.now(),
        { mode: 'no-cors', cache: 'no-store' }
      ).catch(function() {
        return caches.match('offline-map.js');
      })
    );
      
  } else if (
    CACHED_URLS.includes(requestURL.href) ||
    CACHED_URLS.includes(requestURL.pathname) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
      })
    );
  }
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName.startsWith('gih-cache') && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
