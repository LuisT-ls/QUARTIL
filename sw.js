const CACHE_NAME = 'quartil-v2.0.0'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/img/logo/logo.svg',
  '/assets/img/favicon/site.webmanifest',
  '/js/app.js',
  '/js/utils/performance-utils.js',
  '/js/utils/image-optimizer.js',
  '/js/utils/notifications.js',
  '/js/utils/offline-sync.js',
  '/js/utils/auto-updater.js',
  '/js/workers/calculator-worker.js',
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
  console.log('Service Worker instalando...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto:', CACHE_NAME)
      return cache.addAll(ASSETS_TO_CACHE)
    }).then(() => {
      console.log('Recursos em cache')
      // Forçar ativação imediata do novo Service Worker
      return self.skipWaiting()
    })
  )
})

// Intercepta as requisições e serve do cache ou offline.html
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response
      }
      return fetch(event.request).catch(() => {
        // Se for navegação (HTML), retorna offline.html
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html')
        }
      })
    })
  )
})

// Limpa caches antigos e ativa novo Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativando...')
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Assumir controle de todas as abas
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker ativado:', CACHE_NAME)
    })
  )
})

// Listener para mensagens do cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Pulando espera e ativando novo Service Worker')
    self.skipWaiting()
  }
})

// Listener para notificações push (se implementado)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/assets/img/favicon/android-chrome-192x192.png',
      badge: '/assets/img/favicon/favicon-32x32.png',
      tag: 'quartil-notification',
      data: data.data
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Listener para cliques em notificações
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Se já há uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      // Caso contrário, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
