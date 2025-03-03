// app.js - Arquivo principal que importa e inicializa todos os módulos
import { initializeRol } from './modules/rol.js'
import { initializeMedidasPosicao } from './modules/medidasPosicao.js'
import { initializeMedidasDispersao } from './modules/medidasDispersao.js'
import { initializeQuartis } from './modules/quartis.js'
import { initializeTabelaFrequencia } from './modules/tabelaFrequencia.js'
import { initializeTabelaFrequenciaManual } from './modules/tabelaFrequenciaManual.js'
import { initializeGraficos } from './modules/graficos.js'

// Dados compartilhados entre módulos
export const appState = {
  currentData: [],
  isCalculated: false,
  darkMode: localStorage.getItem('darkMode') === 'true'
}

// Inicializa o modo escuro
function initializeDarkMode() {
  const darkModeToggle = document.querySelector('.dark-mode-toggle')
  const darkModeIcon = document.getElementById('darkModeIcon')
  const isMobile = window.matchMedia('(max-width: 768px)').matches // Verifica se é um dispositivo móvel

  // Ativar modo escuro por padrão em dispositivos móveis
  if (isMobile) {
    document.body.classList.add('dark-mode')
    appState.darkMode = true
    localStorage.setItem('darkMode', true) // Salva a preferência
  } else {
    // Verificar preferência salva no localStorage para dispositivos não móveis
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    if (savedDarkMode) {
      document.body.classList.add('dark-mode')
      appState.darkMode = true
      darkModeIcon.classList.remove('fa-moon')
      darkModeIcon.classList.add('fa-sun')
    }
  }

  // Alternar modo escuro ao clicar (apenas para desktop)
  if (!isMobile) {
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode')
      appState.darkMode = document.body.classList.contains('dark-mode')

      // Alterar ícone
      if (appState.darkMode) {
        darkModeIcon.classList.remove('fa-moon')
        darkModeIcon.classList.add('fa-sun')
      } else {
        darkModeIcon.classList.remove('fa-sun')
        darkModeIcon.classList.add('fa-moon')
      }

      // Salvar preferência
      localStorage.setItem('darkMode', appState.darkMode)
    })
  }
}

// Inicializar todos os módulos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeDarkMode()
  initializeRol()
  initializeMedidasPosicao()
  initializeMedidasDispersao()
  initializeQuartis()
  initializeTabelaFrequencia()
  initializeTabelaFrequenciaManual()
  initializeGraficos()
})
