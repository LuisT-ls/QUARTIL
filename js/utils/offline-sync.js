// offline-sync.js - Sistema de sincronização offline

// Configurações do IndexedDB
const DB_NAME = 'QuartilCalculatorDB'
const DB_VERSION = 1
const STORE_NAMES = {
  CALCULATIONS: 'calculations',
  SETTINGS: 'settings',
  CACHE: 'cache'
}

let db = null

// Função para inicializar IndexedDB
export async function initializeIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Erro ao abrir IndexedDB:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      console.log('IndexedDB inicializado com sucesso')
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result

      // Store para cálculos
      if (!database.objectStoreNames.contains(STORE_NAMES.CALCULATIONS)) {
        const calculationsStore = database.createObjectStore(STORE_NAMES.CALCULATIONS, {
          keyPath: 'id',
          autoIncrement: true
        })
        calculationsStore.createIndex('timestamp', 'timestamp', { unique: false })
        calculationsStore.createIndex('dataLength', 'dataLength', { unique: false })
      }

      // Store para configurações
      if (!database.objectStoreNames.contains(STORE_NAMES.SETTINGS)) {
        const settingsStore = database.createObjectStore(STORE_NAMES.SETTINGS, {
          keyPath: 'key'
        })
      }

      // Store para cache
      if (!database.objectStoreNames.contains(STORE_NAMES.CACHE)) {
        const cacheStore = database.createObjectStore(STORE_NAMES.CACHE, {
          keyPath: 'key'
        })
        cacheStore.createIndex('expiry', 'expiry', { unique: false })
      }
    }
  })
}

// Função para salvar cálculo offline
export async function saveCalculationOffline(data, results, metadata = {}) {
  if (!db) {
    await initializeIndexedDB()
  }

  const calculation = {
    data: data,
    results: results,
    metadata: {
      timestamp: Date.now(),
      dataLength: data.length,
      processingTime: metadata.processingTime || 0,
      version: '2.0.0',
      ...metadata
    }
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.CALCULATIONS], 'readwrite')
    const store = transaction.objectStore(STORE_NAMES.CALCULATIONS)
    const request = store.add(calculation)

    request.onsuccess = () => {
      console.log('Cálculo salvo offline:', request.result)
      resolve(request.result)
    }

    request.onerror = () => {
      console.error('Erro ao salvar cálculo offline:', request.error)
      reject(request.error)
    }
  })
}

// Função para recuperar cálculos salvos
export async function getSavedCalculations(limit = 50) {
  if (!db) {
    await initializeIndexedDB()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.CALCULATIONS], 'readonly')
    const store = transaction.objectStore(STORE_NAMES.CALCULATIONS)
    const index = store.index('timestamp')
    const request = index.openCursor(null, 'prev')

    const calculations = []
    let count = 0

    request.onsuccess = (event) => {
      const cursor = event.target.result
      
      if (cursor && count < limit) {
        calculations.push(cursor.value)
        count++
        cursor.continue()
      } else {
        resolve(calculations)
      }
    }

    request.onerror = () => {
      console.error('Erro ao recuperar cálculos salvos:', request.error)
      reject(request.error)
    }
  })
}

// Função para salvar configurações offline
export async function saveSettingOffline(key, value) {
  if (!db) {
    await initializeIndexedDB()
  }

  const setting = {
    key: key,
    value: value,
    timestamp: Date.now()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SETTINGS], 'readwrite')
    const store = transaction.objectStore(STORE_NAMES.SETTINGS)
    const request = store.put(setting)

    request.onsuccess = () => {
      console.log('Configuração salva offline:', key)
      resolve(request.result)
    }

    request.onerror = () => {
      console.error('Erro ao salvar configuração offline:', request.error)
      reject(request.error)
    }
  })
}

// Função para recuperar configuração offline
export async function getSettingOffline(key) {
  if (!db) {
    await initializeIndexedDB()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SETTINGS], 'readonly')
    const store = transaction.objectStore(STORE_NAMES.SETTINGS)
    const request = store.get(key)

    request.onsuccess = () => {
      resolve(request.result ? request.result.value : null)
    }

    request.onerror = () => {
      console.error('Erro ao recuperar configuração offline:', request.error)
      reject(request.error)
    }
  })
}

// Função para cache de dados
export async function cacheData(key, data, expiryMinutes = 60) {
  if (!db) {
    await initializeIndexedDB()
  }

  const cacheItem = {
    key: key,
    data: data,
    timestamp: Date.now(),
    expiry: Date.now() + (expiryMinutes * 60 * 1000)
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.CACHE], 'readwrite')
    const store = transaction.objectStore(STORE_NAMES.CACHE)
    const request = store.put(cacheItem)

    request.onsuccess = () => {
      console.log('Dados salvos no cache:', key)
      resolve(request.result)
    }

    request.onerror = () => {
      console.error('Erro ao salvar no cache:', request.error)
      reject(request.error)
    }
  })
}

// Função para recuperar dados do cache
export async function getCachedData(key) {
  if (!db) {
    await initializeIndexedDB()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.CACHE], 'readonly')
    const store = transaction.objectStore(STORE_NAMES.CACHE)
    const request = store.get(key)

    request.onsuccess = () => {
      const result = request.result
      
      if (result && result.expiry > Date.now()) {
        resolve(result.data)
      } else {
        // Cache expirado, remover
        if (result) {
          removeCachedData(key)
        }
        resolve(null)
      }
    }

    request.onerror = () => {
      console.error('Erro ao recuperar do cache:', request.error)
      reject(request.error)
    }
  })
}

// Função para remover dados do cache
export async function removeCachedData(key) {
  if (!db) {
    await initializeIndexedDB()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.CACHE], 'readwrite')
    const store = transaction.objectStore(STORE_NAMES.CACHE)
    const request = store.delete(key)

    request.onsuccess = () => {
      console.log('Dados removidos do cache:', key)
      resolve(request.result)
    }

    request.onerror = () => {
      console.error('Erro ao remover do cache:', request.error)
      reject(request.error)
    }
  })
}

// Função para limpar cache expirado
export async function cleanExpiredCache() {
  if (!db) {
    await initializeIndexedDB()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.CACHE], 'readwrite')
    const store = transaction.objectStore(STORE_NAMES.CACHE)
    const index = store.index('expiry')
    const request = index.openCursor()

    const now = Date.now()
    let deletedCount = 0

    request.onsuccess = (event) => {
      const cursor = event.target.result
      
      if (cursor) {
        if (cursor.value.expiry <= now) {
          cursor.delete()
          deletedCount++
        }
        cursor.continue()
      } else {
        console.log(`Cache limpo: ${deletedCount} itens expirados removidos`)
        resolve(deletedCount)
      }
    }

    request.onerror = () => {
      console.error('Erro ao limpar cache:', request.error)
      reject(request.error)
    }
  })
}

// Função para sincronizar dados quando online
export async function syncWhenOnline() {
  if (!navigator.onLine) {
    return
  }

  try {
    // Recuperar cálculos salvos offline
    const savedCalculations = await getSavedCalculations(100)
    
    // Aqui você pode implementar lógica para sincronizar com servidor
    // Por exemplo, enviar dados para analytics ou backup
    console.log('Sincronizando dados offline:', savedCalculations.length, 'cálculos')
    
    // Limpar cache expirado
    await cleanExpiredCache()
    
    return savedCalculations
  } catch (error) {
    console.error('Erro na sincronização offline:', error)
    throw error
  }
}

// Função para detectar status de conexão
export function setupConnectionMonitoring() {
  // Monitorar mudanças de status de conexão
  window.addEventListener('online', async () => {
    console.log('Conexão restaurada')
    try {
      await syncWhenOnline()
    } catch (error) {
      console.error('Erro na sincronização após reconexão:', error)
    }
  })

  window.addEventListener('offline', () => {
    console.log('Conexão perdida - modo offline ativado')
  })

  // Verificar status inicial
  if (navigator.onLine) {
    syncWhenOnline()
  }
}

// Função para exportar dados offline
export async function exportOfflineData() {
  try {
    const calculations = await getSavedCalculations(1000)
    const settings = await getAllSettings()
    
    const exportData = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      calculations: calculations,
      settings: settings
    }
    
    return exportData
  } catch (error) {
    console.error('Erro ao exportar dados offline:', error)
    throw error
  }
}

// Função para recuperar todas as configurações
async function getAllSettings() {
  if (!db) {
    await initializeIndexedDB()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SETTINGS], 'readonly')
    const store = transaction.objectStore(STORE_NAMES.SETTINGS)
    const request = store.getAll()

    request.onsuccess = () => {
      const settings = {}
      request.result.forEach(item => {
        settings[item.key] = item.value
      })
      resolve(settings)
    }

    request.onerror = () => {
      console.error('Erro ao recuperar configurações:', request.error)
      reject(request.error)
    }
  })
}

// Função para inicializar sistema offline
export async function initializeOfflineSync() {
  try {
    await initializeIndexedDB()
    setupConnectionMonitoring()
    
    // Limpar cache expirado na inicialização
    await cleanExpiredCache()
    
    console.log('Sistema de sincronização offline inicializado')
  } catch (error) {
    console.error('Erro ao inicializar sistema offline:', error)
  }
}
