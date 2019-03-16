/*Create an array that holds all of
the pages that need to be added to 
the cache*/

const pagesToCache = [
  '/css/styles.css',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  '/index.html',
  '/restaurant.html'
]; 

var staticCacheName ='mws-static-V2';

/*Install the service worker and cashe 
all the information needed for the page 
to function offline*/

self.addEventListener('install', event => { 
  event.waitUntil(
    caches.open(staticCacheName).then(cashe => {
      return cashe.addAll(pagesToCache);
    })
  );
});


/*
Activate cache and remove the previous cache
*/
self.addEventListener('activate', event => {
  event.waitUntil(
    //get all of the cashes that exist
    caches.keys().then(cacheNames => {
      return Promise.all(
        /*we are only interested in the cashe 
        if the name starts with mws- but is not the name of the static cashe
        */
        cacheNames.filter(cacheName => {
          return cacheName.startsWith(`mws-`) && cacheName != staticCacheName;
        /*this gives a list of cashes you no longer need 
        so you map them to promises you need to delete
        */
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  )
})


self.addEventListener('fetch', function(event) { 
  event.respondWith(caches.open(staticCacheName)
    .then(function(cache) { 
      return cache.match(event.request)
      .then(function (response) { 
        return response || fetch(event.request)
        .then(function(response) { 
          cache.put(event.request, response.clone());
          return response; 
        }); 
      }); 
    }) 
  ); 
});

