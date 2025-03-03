// rol.js - Módulo para manipulação do rol e exportação
import { appState } from '../app.js'
import { calculateMedidasPosicao } from './medidasPosicao.js'
import { calculateMedidasDispersao } from './medidasDispersao.js'
import { calculateQuartis } from './quartis.js'
import { updateGraficos } from './graficos.js'

// Função para inicializar o módulo de rol
export function initializeRol() {
  const rolInput = document.getElementById('rolInput')
  const calcularRolBtn = document.getElementById('calcularRol')
  const limparRolBtn = document.getElementById('limparRol')
  const exportarRolBtn = document.getElementById('exportarRol')
  const exportPopup = document.getElementById('exportPopup')
  const closePopup = document.querySelector('.close-popup')

  // Botões de exportação
  const exportPDFBtn = document.getElementById('exportPDF')
  const exportTXTBtn = document.getElementById('exportTXT')
  const exportCSVBtn = document.getElementById('exportCSV')

  // Event Listeners
  calcularRolBtn.addEventListener('click', processarRol)
  limparRolBtn.addEventListener('click', limparRol)
  exportarRolBtn.addEventListener('click', () => {
    if (appState.isCalculated) {
      exportPopup.style.display = 'block'
    } else {
      alert('Por favor, calcule os dados primeiro.')
    }
  })

  closePopup.addEventListener('click', () => {
    exportPopup.style.display = 'none'
  })

  // Fechar popup ao clicar fora dele
  window.addEventListener('click', event => {
    if (event.target === exportPopup) {
      exportPopup.style.display = 'none'
    }
  })

  // Event listeners para exportação
  exportPDFBtn.addEventListener('click', () => exportarDados('pdf'))
  exportTXTBtn.addEventListener('click', () => exportarDados('txt'))
  exportCSVBtn.addEventListener('click', () => exportarDados('csv'))

  // Permitir cálculo ao pressionar Enter
  rolInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      processarRol()
    }
  })
}

// Função para processar o rol inserido
function processarRol() {
  const rolInput = document.getElementById('rolInput')
  const rolResult = document.getElementById('rolResult')

  // Remover espaços extras e dividir pelos delimitadores (vírgula ou espaço)
  const inputValue = rolInput.value.trim()

  if (!inputValue) {
    alert('Por favor, insira alguns números.')
    return
  }

  // Aceitar números separados por vírgula ou espaço
  const numerosString = inputValue.split(/[,\s]+/)

  // Converter para números, filtrar valores não numéricos
  const numeros = numerosString
    .map(num => num.replace(',', '.')) // Suportar vírgula decimal
    .map(num => parseFloat(num))
    .filter(num => !isNaN(num))

  if (numeros.length === 0) {
    alert('Dados inválidos. Por favor, insira números válidos.')
    return
  }

  // Ordenar o rol
  const rol = [...numeros].sort((a, b) => a - b)

  // Atualizar o estado da aplicação
  appState.currentData = rol
  appState.isCalculated = true

  rolResult.style.display = 'block'
  rolResult.classList.add('active')
  // Exibir o rol ordenado
  rolResult.innerHTML = `
    <div class="result-card">
      <h3 class="rol-title">Rol Ordenado</h3>
      <p>${rol.join(' - ')}</p>
      <div class="result-info">
        <span><strong>n =</strong> ${rol.length}</span>
        <span><strong>Mínimo:</strong> ${Math.min(...rol)}</span>
        <span><strong>Máximo:</strong> ${Math.max(...rol)}</span>
        <span><strong>Amplitude:</strong> ${
          Math.max(...rol) - Math.min(...rol)
        }</span>
      </div>
    </div>
  `

  // Calcular e exibir todas as estatísticas
  calculateMedidasPosicao(rol)
  calculateMedidasDispersao(rol)
  calculateQuartis(rol)
  updateGraficos(rol)
}

// Função para limpar o rol e os resultados
function limparRol() {
  document.getElementById('rolInput').value = ''
  document.getElementById('rolResult').innerHTML = ''

  // Limpar todas as seções de resultados
  const resultDivs = [
    'mediaResult',
    'medianaResult',
    'modaResult',
    'desvioPadraoResult',
    'varianciaResult',
    'cvResult',
    'q1Result',
    'q2Result',
    'q3Result'
  ]

  resultDivs.forEach(div => {
    document.getElementById(div).innerHTML = ''
  })

  // Limpar o estado da aplicação
  appState.currentData = []
  appState.isCalculated = false

  // Limpar gráficos
  resetGraficos()
}

// Função para resetar os gráficos
function resetGraficos() {
  const histogramaChart = document.getElementById('histogramaChart')
  const boxplotChart = document.getElementById('boxplotChart')

  if (histogramaChart) {
    const histogramCtx = histogramaChart.getContext('2d')
    histogramCtx.clearRect(0, 0, histogramaChart.width, histogramaChart.height)
  }

  if (boxplotChart) {
    const boxplotCtx = boxplotChart.getContext('2d')
    boxplotCtx.clearRect(0, 0, boxplotChart.width, boxplotChart.height)
  }
}

// Função para exportar dados em diferentes formatos
function exportarDados(formato) {
  if (!appState.isCalculated || appState.currentData.length === 0) {
    alert('Não há dados para exportar. Por favor, calcule os dados primeiro.')
    return
  }

  const rol = appState.currentData
  let conteudo = ''
  let nomeArquivo = `estatistica_${new Date().toISOString().split('T')[0]}`
  let tipo = ''

  // Obter todas as estatísticas calculadas
  const media = rol.reduce((sum, value) => sum + value, 0) / rol.length
  const mediana = calcularMediana(rol)
  const moda = calcularModa(rol)
  const desvioPadrao = calcularDesvioPadrao(rol)
  const variancia = desvioPadrao * desvioPadrao
  const cv = (desvioPadrao / media) * 100
  const q1 = calcularQuartil(rol, 0.25)
  const q3 = calcularQuartil(rol, 0.75)

  switch (formato) {
    case 'pdf':
      alert(
        'Exportação para PDF não implementada diretamente no navegador. Use a exportação TXT ou CSV.'
      )
      return

    case 'txt':
      conteudo = `Calculadora de Estatística - Resultados\n`
      conteudo += `Data: ${new Date().toLocaleString()}\n\n`
      conteudo += `Rol (${rol.length} elementos): ${rol.join(', ')}\n\n`
      conteudo += `Estatísticas Descritivas:\n`
      conteudo += `- Média: ${media.toFixed(2)}\n`
      conteudo += `- Mediana: ${mediana.toFixed(2)}\n`
      conteudo += `- Moda: ${
        typeof moda === 'object' ? moda.join(', ') : moda
      }\n`
      conteudo += `- Desvio Padrão: ${desvioPadrao.toFixed(2)}\n`
      conteudo += `- Variância: ${variancia.toFixed(2)}\n`
      conteudo += `- Coeficiente de Variação: ${cv.toFixed(2)}%\n`
      conteudo += `- Mínimo: ${Math.min(...rol)}\n`
      conteudo += `- Máximo: ${Math.max(...rol)}\n`
      conteudo += `- Amplitude: ${Math.max(...rol) - Math.min(...rol)}\n`
      conteudo += `- Q1: ${q1.toFixed(2)}\n`
      conteudo += `- Q2 (Mediana): ${mediana.toFixed(2)}\n`
      conteudo += `- Q3: ${q3.toFixed(2)}\n`
      conteudo += `- Intervalo Interquartil (IQR): ${(q3 - q1).toFixed(2)}\n`

      nomeArquivo += '.txt'
      tipo = 'text/plain'
      break

    case 'csv':
      conteudo = `"Estatística","Valor"\n`
      conteudo += `"Tamanho da Amostra","${rol.length}"\n`
      conteudo += `"Mínimo","${Math.min(...rol)}"\n`
      conteudo += `"Máximo","${Math.max(...rol)}"\n`
      conteudo += `"Amplitude","${Math.max(...rol) - Math.min(...rol)}"\n`
      conteudo += `"Média","${media.toFixed(2)}"\n`
      conteudo += `"Mediana","${mediana.toFixed(2)}"\n`
      conteudo += `"Moda","${
        typeof moda === 'object' ? moda.join('; ') : moda
      }"\n`
      conteudo += `"Desvio Padrão","${desvioPadrao.toFixed(2)}"\n`
      conteudo += `"Variância","${variancia.toFixed(2)}"\n`
      conteudo += `"Coeficiente de Variação","${cv.toFixed(2)}%"\n`
      conteudo += `"Q1","${q1.toFixed(2)}"\n`
      conteudo += `"Q2 (Mediana)","${mediana.toFixed(2)}"\n`
      conteudo += `"Q3","${q3.toFixed(2)}"\n`
      conteudo += `"IQR","${(q3 - q1).toFixed(2)}"\n\n`

      conteudo += `"Rol"\n`
      rol.forEach((valor, index) => {
        conteudo += `"${index + 1}","${valor}"\n`
      })

      nomeArquivo += '.csv'
      tipo = 'text/csv'
      break
  }

  // Criar e baixar o arquivo
  const blob = new Blob([conteudo], { type: tipo })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomeArquivo
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  // Fechar o popup
  document.getElementById('exportPopup').style.display = 'none'
}

// Funções auxiliares para cálculos
function calcularMediana(array) {
  const meio = Math.floor(array.length / 2)
  if (array.length % 2 === 0) {
    return (array[meio - 1] + array[meio]) / 2
  } else {
    return array[meio]
  }
}

function calcularModa(array) {
  const contagem = {}
  let maxFreq = 0
  let moda = []

  array.forEach(num => {
    contagem[num] = (contagem[num] || 0) + 1
    if (contagem[num] > maxFreq) {
      maxFreq = contagem[num]
      moda = [num]
    } else if (contagem[num] === maxFreq) {
      moda.push(num)
    }
  })

  // Se todos os valores tiverem a mesma frequência
  if (moda.length === Object.keys(contagem).length) {
    return 'Não há moda (todos os valores têm a mesma frequência)'
  }

  return moda.length === 1 ? moda[0] : moda
}

function calcularDesvioPadrao(array) {
  const media = array.reduce((sum, val) => sum + val, 0) / array.length
  const somaDosQuadradosDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow(val - media, 2)
  }, 0)
  return Math.sqrt(somaDosQuadradosDasDiferencas / array.length)
}

function calcularQuartil(array, percentil) {
  const posicao = percentil * (array.length - 1)
  const base = Math.floor(posicao)
  const resto = posicao - base

  if (array[base + 1] !== undefined) {
    return array[base] + resto * (array[base + 1] - array[base])
  } else {
    return array[base]
  }
}
