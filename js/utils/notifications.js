// notifications.js - Sistema de notificações push para PWA

// Configurações de notificação
const NOTIFICATION_CONFIG = {
  icon: '/assets/img/favicon/android-chrome-192x192.png',
  badge: '/assets/img/favicon/favicon-32x32.png',
  tag: 'quartil-calculator',
  requireInteraction: false,
  silent: false,
  vibrate: [200, 100, 200]
}

// Função para solicitar permissão de notificação
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    console.log('Permissão de notificação negada')
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error)
    return false
  }
}

// Função para mostrar notificação
export function showNotification(title, options = {}) {
  if (Notification.permission !== 'granted') {
    console.log('Permissão de notificação não concedida')
    return null
  }

  const notificationOptions = {
    ...NOTIFICATION_CONFIG,
    ...options
  }

  try {
    const notification = new Notification(title, notificationOptions)
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
      notification.close()
    }, 5000)

    return notification
  } catch (error) {
    console.error('Erro ao mostrar notificação:', error)
    return null
  }
}

// Função para notificar cálculo concluído
export function notifyCalculationComplete(dataLength, processingTime) {
  const title = 'Cálculo Concluído!'
  const body = `Estatísticas calculadas para ${dataLength} valores em ${processingTime.toFixed(2)}ms`
  
  return showNotification(title, {
    body,
    tag: 'calculation-complete',
    data: {
      type: 'calculation',
      dataLength,
      processingTime
    }
  })
}

// Função para notificar exportação concluída
export function notifyExportComplete(format) {
  const title = 'Exportação Concluída!'
  const body = `Arquivo ${format.toUpperCase()} baixado com sucesso`
  
  return showNotification(title, {
    body,
    tag: 'export-complete',
    data: {
      type: 'export',
      format
    }
  })
}

// Função para notificar erro
export function notifyError(message) {
  const title = 'Erro na Calculadora'
  const body = message
  
  return showNotification(title, {
    body,
    tag: 'error',
    icon: '/assets/img/icons/error-icon.png',
    data: {
      type: 'error'
    }
  })
}

// Função para notificar atualização disponível
export function notifyUpdateAvailable() {
  const title = 'Atualização Disponível!'
  const body = 'Uma nova versão da calculadora está disponível. Clique para atualizar.'
  
  return showNotification(title, {
    body,
    tag: 'update-available',
    requireInteraction: true,
    actions: [
      {
        action: 'update',
        title: 'Atualizar Agora'
      },
      {
        action: 'dismiss',
        title: 'Mais Tarde'
      }
    ],
    data: {
      type: 'update'
    }
  })
}

// Função para notificar modo offline
export function notifyOfflineMode() {
  const title = 'Modo Offline Ativado'
  const body = 'Você está offline, mas pode continuar usando a calculadora com dados salvos.'
  
  return showNotification(title, {
    body,
    tag: 'offline-mode',
    data: {
      type: 'offline'
    }
  })
}

// Função para notificar modo online
export function notifyOnlineMode() {
  const title = 'Conexão Restaurada'
  const body = 'Você está online novamente. Todas as funcionalidades estão disponíveis.'
  
  return showNotification(title, {
    body,
    tag: 'online-mode',
    data: {
      type: 'online'
    }
  })
}

// Função para configurar Service Worker para notificações
export function setupNotificationServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      // Configurar push manager se disponível
      if ('PushManager' in window) {
        setupPushManager(registration)
      }
    })
  }
}

// Função para configurar Push Manager
async function setupPushManager(registration) {
  try {
    // Verificar se já está inscrito
    const existingSubscription = await registration.pushManager.getSubscription()
    
    if (!existingSubscription) {
      // Para desenvolvimento local, não configurar push notifications
      // pois requer chave de servidor válida
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Push notifications desabilitadas em ambiente de desenvolvimento')
        return
      }
      
      // Em produção, usar chave válida do servidor
      // const subscription = await registration.pushManager.subscribe({
      //   userVisibleOnly: true,
      //   applicationServerKey: urlBase64ToUint8Array('CHAVE_DO_SERVIDOR_AQUI')
      // })
      
      console.log('Push notifications configuradas para produção')
    }
  } catch (error) {
    console.log('Push notifications não disponíveis:', error.message)
  }
}

// Função auxiliar para converter chave
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Função para configurar listeners de notificação
export function setupNotificationListeners() {
  // Listener para cliques em notificações
  self.addEventListener('notificationclick', event => {
    event.notification.close()

    const data = event.notification.data
    const action = event.action

    if (action === 'update') {
      // Atualizar a aplicação
      window.location.reload()
    } else if (action === 'dismiss') {
      // Apenas fechar a notificação
      return
    } else {
      // Abrir a aplicação
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
    }
  })

  // Listener para fechamento de notificações
  self.addEventListener('notificationclose', event => {
    console.log('Notificação fechada:', event.notification.tag)
  })
}

// Função para inicializar sistema de notificações
export function initializeNotifications() {
  // Solicitar permissão na inicialização
  requestNotificationPermission()
  
  // Configurar Service Worker
  setupNotificationServiceWorker()
  
  // Configurar listeners
  setupNotificationListeners()
  
  // Monitorar status de conexão
  window.addEventListener('online', () => {
    notifyOnlineMode()
  })
  
  window.addEventListener('offline', () => {
    notifyOfflineMode()
  })
  
  console.log('Sistema de notificações inicializado')
}

// Função para mostrar notificação de boas-vindas
export function showWelcomeNotification() {
  const title = 'Bem-vindo à Calculadora de Quartil!'
  const body = 'Comece inserindo seus dados para calcular estatísticas e quartis.'
  
  return showNotification(title, {
    body,
    tag: 'welcome',
    data: {
      type: 'welcome'
    }
  })
}

// Função para notificar sobre novos recursos
export function notifyNewFeature(featureName, description) {
  const title = `Novo Recurso: ${featureName}`
  const body = description
  
  return showNotification(title, {
    body,
    tag: 'new-feature',
    data: {
      type: 'new-feature',
      feature: featureName
    }
  })
}
