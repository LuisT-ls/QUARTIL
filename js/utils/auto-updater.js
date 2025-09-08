// auto-updater.js - Sistema de atualizações automáticas para PWA

// Configurações de atualização
const UPDATE_CONFIG = {
  checkInterval: 24 * 60 * 60 * 1000, // 24 horas
  forceCheckInterval: 7 * 24 * 60 * 60 * 1000, // 7 dias
  versionUrl: '/version.json',
  updatePromptDelay: 5000 // 5 segundos
}

let updateAvailable = false
let newServiceWorker = null
let updateCheckTimer = null

// Função para verificar atualizações
export async function checkForUpdates() {
  try {
    console.log('Verificando atualizações...')
    
    // Verificar se há Service Worker registrado
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      
      if (registration) {
        // Verificar se há atualização disponível
        await registration.update()
        
        // Verificar versão do manifest
        await checkManifestVersion()
        
        console.log('Verificação de atualizações concluída')
      }
    }
  } catch (error) {
    console.error('Erro ao verificar atualizações:', error)
  }
}

// Função para verificar versão do manifest
async function checkManifestVersion() {
  try {
    const response = await fetch(UPDATE_CONFIG.versionUrl, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (response.ok) {
      const versionData = await response.json()
      const currentVersion = getCurrentVersion()
      
      if (versionData.version !== currentVersion) {
        console.log('Nova versão disponível:', versionData.version)
        showUpdateAvailable(versionData)
      }
    }
  } catch (error) {
    console.log('Não foi possível verificar versão do manifest:', error)
  }
}

// Função para obter versão atual
function getCurrentVersion() {
  // Tentar obter do manifest
  const manifestLink = document.querySelector('link[rel="manifest"]')
  if (manifestLink) {
    return '2.0.0' // Versão atual hardcoded
  }
  
  // Fallback para versão do package.json ou timestamp
  return Date.now().toString()
}

// Função para mostrar que há atualização disponível
function showUpdateAvailable(versionData) {
  updateAvailable = true
  
  // Importar e usar sistema de notificações
  import('./notifications.js').then(({ notifyUpdateAvailable }) => {
    const notification = notifyUpdateAvailable()
    
    if (notification) {
      notification.addEventListener('click', () => {
        applyUpdate()
      })
    }
  })
  
  // Mostrar banner de atualização na UI
  showUpdateBanner(versionData)
}

// Função para mostrar banner de atualização
function showUpdateBanner(versionData) {
  // Remover banner existente se houver
  const existingBanner = document.getElementById('update-banner')
  if (existingBanner) {
    existingBanner.remove()
  }
  
  // Criar banner de atualização
  const banner = document.createElement('div')
  banner.id = 'update-banner'
  banner.className = 'update-banner'
  banner.innerHTML = `
    <div class="update-banner-content">
      <div class="update-banner-icon">
        <i class="fas fa-download"></i>
      </div>
      <div class="update-banner-text">
        <strong>Nova versão disponível!</strong>
        <span>Versão ${versionData.version} - Clique para atualizar</span>
      </div>
      <div class="update-banner-actions">
        <button class="btn btn-sm btn-primary" id="update-now">
          <i class="fas fa-sync-alt"></i> Atualizar
        </button>
        <button class="btn btn-sm btn-secondary" id="update-later">
          <i class="fas fa-times"></i> Mais tarde
        </button>
      </div>
    </div>
  `
  
  // Adicionar estilos
  const style = document.createElement('style')
  style.textContent = `
    .update-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 20px;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      animation: slideDown 0.3s ease-out;
    }
    
    .update-banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .update-banner-icon {
      font-size: 20px;
      margin-right: 15px;
    }
    
    .update-banner-text {
      flex: 1;
    }
    
    .update-banner-text strong {
      display: block;
      font-size: 14px;
      margin-bottom: 2px;
    }
    
    .update-banner-text span {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .update-banner-actions {
      display: flex;
      gap: 10px;
    }
    
    .update-banner .btn {
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 4px;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }
    
    .dark-mode .update-banner {
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    }
    
    @media (max-width: 768px) {
      .update-banner-content {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
      
      .update-banner-actions {
        width: 100%;
        justify-content: center;
      }
    }
  `
  
  document.head.appendChild(style)
  document.body.appendChild(banner)
  
  // Adicionar event listeners
  document.getElementById('update-now').addEventListener('click', applyUpdate)
  document.getElementById('update-later').addEventListener('click', () => {
    banner.remove()
    // Agendar verificação para mais tarde
    scheduleUpdateCheck(UPDATE_CONFIG.updatePromptDelay)
  })
  
  // Auto-remover após 30 segundos
  setTimeout(() => {
    if (banner.parentNode) {
      banner.remove()
    }
  }, 30000)
}

// Função para aplicar atualização
export async function applyUpdate() {
  try {
    console.log('Aplicando atualização...')
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      
      if (registration && registration.waiting) {
        // Enviar mensagem para o Service Worker para ativar
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        // Recarregar a página após um pequeno delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        // Forçar recarregamento se não houver Service Worker esperando
        window.location.reload()
      }
    } else {
      // Fallback: recarregar página
      window.location.reload()
    }
  } catch (error) {
    console.error('Erro ao aplicar atualização:', error)
    // Fallback: recarregar página
    window.location.reload()
  }
}

// Função para agendar verificação de atualização
function scheduleUpdateCheck(delay = UPDATE_CONFIG.checkInterval) {
  if (updateCheckTimer) {
    clearTimeout(updateCheckTimer)
  }
  
  updateCheckTimer = setTimeout(() => {
    checkForUpdates()
  }, delay)
}

// Função para configurar Service Worker para atualizações
export function setupServiceWorkerUpdates() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        console.log('Atualização disponível via Service Worker')
        showUpdateAvailable(event.data.versionData)
      }
    })
    
    // Verificar se há Service Worker esperando
    navigator.serviceWorker.ready.then(registration => {
      if (registration.waiting) {
        console.log('Service Worker esperando para ativação')
        showUpdateAvailable({ version: 'Nova versão' })
      }
    })
  }
}

// Função para configurar listeners de atualização
export function setupUpdateListeners() {
  // Listener para quando o Service Worker é atualizado
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker atualizado')
      // Recarregar página para usar nova versão
      window.location.reload()
    })
  }
  
  // Listener para visibilidade da página (verificar atualizações quando voltar)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && navigator.onLine) {
      // Verificar atualizações quando a página volta a ficar visível
      checkForUpdates()
    }
  })
  
  // Listener para foco da janela
  window.addEventListener('focus', () => {
    if (navigator.onLine) {
      checkForUpdates()
    }
  })
}

// Função para inicializar sistema de atualizações
export function initializeAutoUpdater() {
  try {
    // Configurar Service Worker
    setupServiceWorkerUpdates()
    
    // Configurar listeners
    setupUpdateListeners()
    
    // Verificar atualizações na inicialização
    checkForUpdates()
    
    // Agendar verificações periódicas
    scheduleUpdateCheck()
    
    // Verificação forçada semanal
    setInterval(() => {
      if (navigator.onLine) {
        checkForUpdates()
      }
    }, UPDATE_CONFIG.forceCheckInterval)
    
    console.log('Sistema de atualizações automáticas inicializado')
  } catch (error) {
    console.error('Erro ao inicializar sistema de atualizações:', error)
  }
}

// Função para verificar se há atualização pendente
export function hasUpdateAvailable() {
  return updateAvailable
}

// Função para forçar verificação de atualização
export function forceUpdateCheck() {
  return checkForUpdates()
}
