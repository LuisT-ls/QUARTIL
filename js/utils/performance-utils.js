// performance-utils.js - Utilitários para otimização de performance

// Cache de resultados calculados
const calculationCache = new Map()
const CACHE_SIZE_LIMIT = 100
const CACHE_EXPIRY_TIME = 5 * 60 * 1000 // 5 minutos

// Web Worker para cálculos pesados
let calculatorWorker = null
let workerReady = false
const pendingCalculations = new Map()

// Função para inicializar o Web Worker
export function initializeWorker() {
  if (typeof Worker !== 'undefined') {
    calculatorWorker = new Worker('/js/workers/calculator-worker.js')
    
    calculatorWorker.onmessage = function(e) {
      const { tipo, id, sucesso, resultado, erro, tempoProcessamento } = e.data
      
      if (tipo === 'worker_ready') {
        workerReady = true
        console.log('Web Worker inicializado com sucesso')
        return
      }
      
      // Processar resultado de cálculo
      if (pendingCalculations.has(id)) {
        const { resolve, reject } = pendingCalculations.get(id)
        pendingCalculations.delete(id)
        
        if (sucesso) {
          resolve({
            resultado,
            tempoProcessamento,
            timestamp: Date.now()
          })
        } else {
          reject(new Error(erro))
        }
      }
    }
    
    calculatorWorker.onerror = function(error) {
      console.error('Erro no Web Worker:', error)
      workerReady = false
    }
  } else {
    console.warn('Web Workers não suportados neste navegador')
  }
}

// Função para calcular hash dos dados para cache
function calculateDataHash(data, tipoCalculo) {
  const dataString = JSON.stringify({ data: data.sort(), tipoCalculo })
  let hash = 0
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

// Função para limpar cache expirado
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, value] of calculationCache.entries()) {
    if (now - value.timestamp > CACHE_EXPIRY_TIME) {
      calculationCache.delete(key)
    }
  }
  
  // Limitar tamanho do cache
  if (calculationCache.size > CACHE_SIZE_LIMIT) {
    const entries = Array.from(calculationCache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    const toDelete = entries.slice(0, calculationCache.size - CACHE_SIZE_LIMIT)
    toDelete.forEach(([key]) => calculationCache.delete(key))
  }
}

// Função para obter resultado do cache
function getCachedResult(data, tipoCalculo) {
  cleanExpiredCache()
  const hash = calculateDataHash(data, tipoCalculo)
  return calculationCache.get(hash)
}

// Função para salvar resultado no cache
function cacheResult(data, tipoCalculo, resultado) {
  cleanExpiredCache()
  const hash = calculateDataHash(data, tipoCalculo)
  calculationCache.set(hash, {
    resultado,
    timestamp: Date.now()
  })
}

// Função principal para cálculos com cache e Web Worker
export async function calculateWithWorker(data, tipoCalculo) {
  if (!data || data.length === 0) {
    throw new Error('Dados inválidos para cálculo')
  }
  
  // Verificar cache primeiro
  const cachedResult = getCachedResult(data, tipoCalculo)
  if (cachedResult) {
    console.log('Resultado obtido do cache')
    return {
      resultado: cachedResult.resultado,
      tempoProcessamento: 0,
      fromCache: true,
      timestamp: cachedResult.timestamp
    }
  }
  
  // Se Web Worker não estiver disponível, usar cálculo síncrono
  if (!workerReady || !calculatorWorker) {
    console.log('Usando cálculo síncrono (Web Worker não disponível)')
    return calculateSynchronously(data, tipoCalculo)
  }
  
  // Usar Web Worker para cálculo assíncrono
  return new Promise((resolve, reject) => {
    const id = Date.now() + Math.random()
    
    pendingCalculations.set(id, { resolve, reject })
    
    // Timeout para evitar travamento
    const timeout = setTimeout(() => {
      if (pendingCalculations.has(id)) {
        pendingCalculations.delete(id)
        reject(new Error('Timeout no cálculo'))
      }
    }, 10000) // 10 segundos
    
    // Limpar timeout quando resolver
    const originalResolve = resolve
    resolve = (result) => {
      clearTimeout(timeout)
      originalResolve(result)
    }
    
    pendingCalculations.set(id, { resolve, reject })
    
    calculatorWorker.postMessage({
      id,
      data,
      tipoCalculo
    })
  }).then(result => {
    // Salvar no cache
    cacheResult(data, tipoCalculo, result.resultado)
    return result
  })
}

// Função de fallback para cálculo síncrono
function calculateSynchronously(data, tipoCalculo) {
  const startTime = performance.now()
  
  // Importar funções de cálculo (fallback)
  const media = data.reduce((sum, val) => sum + val, 0) / data.length
  const ordenado = [...data].sort((a, b) => a - b)
  const mediana = ordenado.length % 2 === 0 
    ? (ordenado[ordenado.length / 2 - 1] + ordenado[ordenado.length / 2]) / 2
    : ordenado[Math.floor(ordenado.length / 2)]
  
  let resultado = {}
  
  switch (tipoCalculo) {
    case 'estatisticas_completas':
      const variancia = data.reduce((sum, val) => sum + Math.pow(val - media, 2), 0) / data.length
      const desvioPadrao = Math.sqrt(variancia)
      
      resultado = {
        media,
        mediana,
        variancia,
        desvioPadrao,
        cv: (desvioPadrao / media) * 100,
        min: Math.min(...data),
        max: Math.max(...data),
        amplitude: Math.max(...data) - Math.min(...data)
      }
      break
      
    case 'quartis':
      const q1 = calcularQuartilSimples(ordenado, 0.25)
      const q2 = mediana
      const q3 = calcularQuartilSimples(ordenado, 0.75)
      
      resultado = {
        q1,
        q2,
        q3,
        iqr: q3 - q1
      }
      break
      
    default:
      throw new Error(`Tipo de cálculo não suportado: ${tipoCalculo}`)
  }
  
  const endTime = performance.now()
  
  return {
    resultado,
    tempoProcessamento: endTime - startTime,
    fromCache: false,
    timestamp: Date.now()
  }
}

// Função auxiliar para calcular quartil (versão simples)
function calcularQuartilSimples(ordenado, percentil) {
  const posicao = percentil * (ordenado.length - 1)
  const base = Math.floor(posicao)
  const resto = posicao - base
  
  if (ordenado[base + 1] !== undefined) {
    return ordenado[base] + resto * (ordenado[base + 1] - ordenado[base])
  } else {
    return ordenado[base]
  }
}

// Função para debounce
export function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Função para throttle
export function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Função para lazy loading de módulos
export async function loadModule(modulePath) {
  try {
    const module = await import(modulePath)
    return module
  } catch (error) {
    console.error(`Erro ao carregar módulo ${modulePath}:`, error)
    throw error
  }
}

// Função para medir performance
export function measurePerformance(name, fn) {
  return function(...args) {
    const start = performance.now()
    const result = fn.apply(this, args)
    const end = performance.now()
    
    console.log(`${name} executado em ${(end - start).toFixed(2)}ms`)
    
    return result
  }
}

// Função para limpar recursos
export function cleanup() {
  if (calculatorWorker) {
    calculatorWorker.terminate()
    calculatorWorker = null
  }
  
  calculationCache.clear()
  pendingCalculations.clear()
  workerReady = false
}

// Inicializar automaticamente quando o módulo for carregado
if (typeof window !== 'undefined') {
  initializeWorker()
}
