self.addEventListener('install', function(event) {
  console.log('install');
});

self.addEventListener('activate', function(event) {
  console.log('activate');
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.indexOf('material.teal-red.min.css') !== -1) {
    console.log('Fetch request for:', event.request.url);
    event.respondWith(new Response('header {background: green url("")!important}', {
      headers: { 'Content-Type': 'text/css' }
    }));
  }
});
