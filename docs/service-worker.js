const CACHE_NAME = 'fairy-lights'

const urlsToCache = [
  '.',
  'script.js',
  'styles.css',
  'manifest.json',
  'https://fonts.googleapis.com/css?family=Open+Sans:800i'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request)
      .then(response => {

        if (response) return response

        return fetch(event.request.clone())
          .then(response => {

            // this should probably have more checks,
            // but it's just a static site for now, so meh
            if(!response) {
              return response
            }

            console.log("caching new request", event.request)
            var responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache)
              })

            return response
          })
      }
    )
  )
})
