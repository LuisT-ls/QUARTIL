const CACHE_NAME = 'calculadora-estatistica-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/img/logo/logo.svg',
  '/js/app.js',
  '/js/modules/graficos.js',
  '/js/modules/medidasDispersao.js',
  '/js/modules/medidasPosicao.js',
  '/js/modules/quartis.js',
  '/js/modules/rol.js',
  '/js/modules/tabelaFrequencia.js',
  '/js/modules/tabelaFrequenciaManual.js'
]

// Instala o Service Worker e faz cache dos recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE)
    })
  )
})

// Intercepta as requisições e serve do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})

// Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
