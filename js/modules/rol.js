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
  const gerarDadosBtn = document.getElementById('gerarDados')
  const exportPopup = document.getElementById('exportPopup')
  const randomPopup = document.getElementById('randomPopup')
  const closePopup = document.querySelector('.close-popup')
  const closeRandomPopup = randomPopup.querySelector('.close-popup')
  const confirmarGeracaoBtn = document.getElementById('confirmarGeracao')

  // Inputs do popup de geração aleatória
  const quantidadeNumerosInput = document.getElementById('quantidadeNumeros')
  const valorMinimoInput = document.getElementById('valorMinimo')
  const valorMaximoInput = document.getElementById('valorMaximo')
  const numerosInteirosCheck = document.getElementById('numerosInteiros')

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
    if (event.target === randomPopup) {
      randomPopup.style.display = 'none'
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

  // Eventos para geração de dados aleatórios
  gerarDadosBtn.addEventListener('click', () => {
    randomPopup.style.display = 'flex'
  })

  closeRandomPopup.addEventListener('click', () => {
    randomPopup.style.display = 'none'
  })

  confirmarGeracaoBtn.addEventListener('click', gerarDadosAleatorios)
}

// Função para processar o rol inserido
export function processarRol() {
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

// Função para gerar dados aleatórios
function gerarDadosAleatorios() {
  // Obter os valores dos inputs
  const quantidade = parseInt(
    document.getElementById('quantidadeNumeros').value
  )
  const min = parseFloat(document.getElementById('valorMinimo').value)
  const max = parseFloat(document.getElementById('valorMaximo').value)
  const apenasInteiros = document.getElementById('numerosInteiros').checked

  // Validar os valores
  if (isNaN(quantidade) || isNaN(min) || isNaN(max)) {
    alert('Por favor, preencha todos os campos com valores numéricos.')
    return
  }

  if (quantidade < 5 || quantidade > 100) {
    alert('A quantidade de números deve estar entre 5 e 100.')
    return
  }

  if (min >= max) {
    alert('O valor mínimo deve ser menor que o valor máximo.')
    return
  }

  // Gerar os números aleatórios
  const numeros = []
  for (let i = 0; i < quantidade; i++) {
    let numero
    if (apenasInteiros) {
      // Gerar número inteiro aleatório entre min e max (inclusive)
      numero = Math.floor(Math.random() * (max - min + 1)) + min
    } else {
      // Gerar número decimal aleatório entre min e max
      numero = Math.random() * (max - min) + min
      // Arredondar para 2 casas decimais
      numero = Math.round(numero * 100) / 100
    }
    numeros.push(numero)
  }

  // Formatar os números como string
  const numerosFormatados = numeros.join(', ')

  // Preencher o input com os números gerados
  document.getElementById('rolInput').value = numerosFormatados

  // Fechar o popup
  document.getElementById('randomPopup').style.display = 'none'

  // Calcular automaticamente o rol
  processarRol()
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
    'assimetriaResult',
    'curtoseResult',
    'cvResult',
    'q1Result',
    'q2Result',
    'q3Result',
    'iqrResult',
    'mediaJuntasResult'
  ]

  resultDivs.forEach(div => {
    document.getElementById(div).innerHTML = ''
  })

  // Limpar o estado da aplicação
  appState.currentData = []
  appState.isCalculated = false

  // Limpar gráficos e restaurar estado inicial
  resetGraficos()
}

// Função para resetar os gráficos
function resetGraficos() {
  const histogramaCanvas = document.getElementById('histogramaChart')
  const boxplotCanvas = document.getElementById('boxplotChart')

  // Limpar o gráfico do histograma
  if (histogramaCanvas) {
    const histogramCtx = histogramaCanvas.getContext('2d')
    histogramCtx.clearRect(
      0,
      0,
      histogramaCanvas.width,
      histogramaCanvas.height
    )

    // Destruir o gráfico se existir
    if (window.histogramaChart) {
      window.histogramaChart.destroy()
      window.histogramaChart = null
    }

    // Remover legenda do histograma
    const histogramaContainer = histogramaCanvas.parentElement
    const histogramaLegenda = histogramaContainer.querySelector(
      '.histograma-legenda'
    )
    if (histogramaLegenda) {
      histogramaContainer.removeChild(histogramaLegenda)
    }
  }

  // Limpar o boxplot
  if (boxplotCanvas) {
    const boxplotCtx = boxplotCanvas.getContext('2d')
    boxplotCtx.clearRect(0, 0, boxplotCanvas.width, boxplotCanvas.height)

    // Destruir o gráfico se existir
    if (window.boxplotChart) {
      window.boxplotChart.destroy()
      window.boxplotChart = null
    }

    // Remover informações do boxplot
    const boxplotContainer = boxplotCanvas.parentElement
    const boxplotInfo = boxplotContainer.querySelector('.boxplot-info')
    if (boxplotInfo) {
      boxplotContainer.removeChild(boxplotInfo)
    }
  }

  // Recriar gráficos vazios
  initializeGraficos()
}

// Função para exportar dados em diferentes formatos
function exportarDados(formato) {
  if (!appState.isCalculated || appState.currentData.length === 0) {
    alert('Não há dados para exportar. Por favor, calcule os dados primeiro.')
    return
  }

  const { jsPDF } = window.jspdf
  const rol = appState.currentData
  let nomeArquivo = `estatistica_${new Date().toISOString().split('T')[0]}`
  let conteudo = ''
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
      const doc = new jsPDF()
      
      // Título do documento
      doc.setFontSize(18)
      doc.text('Relatório de Estatística', 14, 22)
      
      // Data
      doc.setFontSize(10)
      doc.text(`Data: ${new Date().toLocaleString()}`, 14, 30)
      
      // Rol (dados)
      doc.setFontSize(12)
      doc.text('Rol de Dados:', 14, 40)
      doc.setFontSize(10)
      const rolText = rol.join(', ')
      const splitRol = doc.splitTextToSize(rolText, 180)
      doc.text(splitRol, 14, 47)
      
      // Estatísticas descritivas
      const estatisticas = [
        `Número de Elementos: ${rol.length}`,
        `Média: ${media.toFixed(2)}`,
        `Mediana: ${mediana.toFixed(2)}`,
        `Moda: ${typeof moda === 'object' ? moda.join(', ') : moda}`,
        `Desvio Padrão: ${desvioPadrao.toFixed(2)}`,
        `Variância: ${variancia.toFixed(2)}`,
        `Coeficiente de Variação: ${cv.toFixed(2)}%`,
        `Mínimo: ${Math.min(...rol)}`,
        `Máximo: ${Math.max(...rol)}`,
        `Amplitude: ${Math.max(...rol) - Math.min(...rol)}`,
        `Q1: ${q1.toFixed(2)}`,
        `Q2 (Mediana): ${mediana.toFixed(2)}`,
        `Q3: ${q3.toFixed(2)}`,
        `Intervalo Interquartil (IQR): ${(q3 - q1).toFixed(2)}`
      ]
      
      // Adicionar estatísticas
      doc.setFontSize(12)
      doc.text('Estatísticas Descritivas:', 14, 70)
      doc.setFontSize(10)
      estatisticas.forEach((stat, index) => {
        doc.text(stat, 14, 77 + (index * 7))
      })
      
      // Salvar o PDF
      nomeArquivo += '.pdf'
      doc.save(nomeArquivo)
      break

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

  // Criar e baixar o arquivo (para txt e csv)
  if (formato !== 'pdf') {
    const blob = new Blob([conteudo], { type: tipo })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nomeArquivo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
