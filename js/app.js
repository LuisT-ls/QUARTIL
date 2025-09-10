// app.js - Arquivo principal que importa e inicializa todos os módulos
import { initializeRol } from './modules/rol.js'
import { initializeMedidasPosicao } from './modules/medidasPosicao.js'
import { initializeMedidasDispersao } from './modules/medidasDispersao.js'
import { initializeQuartis } from './modules/quartis.js'
import { initializeTabelaFrequencia } from './modules/tabelaFrequencia.js'
import { initializeTabelaFrequenciaManual } from './modules/tabelaFrequenciaManual.js'
import { initializeGraficos } from './modules/graficos.js'
import { inicializarGeradorAleatorio } from './modules/geradorAleatorio.js'
import Glossario from './modules/glossary.js'
import { initializeAccessibility } from './modules/accessibility.js'
import { debounce, throttle, measurePerformance } from './utils/performance-utils.js'
import { initializeImageOptimizations } from './utils/image-optimizer.js'
import { initializeNotifications } from './utils/notifications.js'
import { initializeOfflineSync } from './utils/offline-sync.js'
import { initializeAutoUpdater } from './utils/auto-updater.js'
import FontLoader from './utils/font-loader.js'
import reflowOptimizer from './utils/reflow-optimizer.js'

// Dados compartilhados entre módulos
export const appState = {
  currentData: [],
  isCalculated: false,
}

// Inicializar o glossário
function initializeGlossario() {
  const glossario = new Glossario()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log(
          'Service Worker registrado com sucesso:',
          registration.scope
        )
      })
      .catch(error => {
        console.log('Falha ao registrar o Service Worker:', error)
      })
  })
}

// Função para inicializar todos os módulos
async function initializeAllModules() {
  try {
    // Usar requestAnimationFrame para evitar reflow forçado
    await new Promise(resolve => requestAnimationFrame(resolve))
    
    // Módulos críticos carregados imediatamente
    initializeRol()
    initializeAccessibility()
    initializeImageOptimizations()
    
    // Inicializar sistemas PWA de forma otimizada
    await reflowOptimizer.batchDOMUpdates([
      () => initializeNotifications(),
      () => initializeOfflineSync(),
      () => initializeAutoUpdater()
    ])
    
    // Inicializar todos os módulos de forma síncrona
    initializeMedidasPosicao()
    initializeMedidasDispersao()
    initializeQuartis()
    initializeTabelaFrequencia()
    initializeTabelaFrequenciaManual()
    initializeGraficos()
    inicializarGeradorAleatorio()
    initializeGlossario()
    
    // Inicializar otimizador de fontes
    const fontLoader = new FontLoader()
    fontLoader.preloadCriticalFonts()
    
    console.log('Todos os módulos inicializados com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar módulos:', error)
  }
}

// Inicializar todos os módulos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeAllModules()
})
