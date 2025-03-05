// graficos.js - Módulo para criação e atualização dos gráficos
import { appState } from '../app.js'
import { calcularQuartil, calcularOutliers } from './quartis.js'

window.histogramaChart = null
window.boxplotChart = null

// Função para inicializar o módulo de gráficos
export function initializeGraficos() {
  // Inicializar os contextos dos gráficos
  const histogramaCanvas = document.getElementById('histogramaChart')
  const boxplotCanvas = document.getElementById('boxplotChart')

  if (histogramaCanvas && boxplotCanvas) {
    // Criar gráficos iniciais padrão
    criarHistogramaVazio(histogramaCanvas)
    criarBoxplotVazio(boxplotCanvas)
  }
}

// Função para atualizar todos os gráficos com novos dados
export function updateGraficos(data) {
  if (!data || data.length === 0) {
    return
  }

  const histogramaCanvas = document.getElementById('histogramaChart')
  const boxplotCanvas = document.getElementById('boxplotChart')

  if (histogramaCanvas && boxplotCanvas) {
    criarHistograma(data, histogramaCanvas)
    criarBoxplot(data, boxplotCanvas)
  }
}

// Função para criar um histograma vazio
function criarHistogramaVazio(canvas) {
  const ctx = canvas.getContext('2d')

  // Destruir gráfico anterior se existir
  if (window.histogramaChart) {
    window.histogramaChart.destroy()
  }

  // Criar novo gráfico com estilo padrão inicial
  window.histogramaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sem Dados'],
      datasets: [
        {
          label: 'Frequência',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          borderColor: 'rgba(150, 150, 150, 0.5)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequência'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Insira dados para visualizar'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Histograma'
        },
        legend: {
          display: false
        }
      }
    }
  })

  // Limpar legenda anterior, se existir
  const chartContainer = canvas.parentElement
  const existingLegenda = chartContainer.querySelector('.histograma-legenda')
  if (existingLegenda) {
    chartContainer.removeChild(existingLegenda)
  }
}

// Função para criar um boxplot vazio
function criarBoxplotVazio(canvas) {
  const ctx = canvas.getContext('2d')

  // Destruir gráfico anterior se existir
  if (window.boxplotChart) {
    window.boxplotChart.destroy()
  }

  // Criar novo gráfico com estilo padrão inicial
  window.boxplotChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Sem Dados'],
      datasets: [
        {
          label: 'Sem Dados',
          data: [0],
          backgroundColor: 'rgba(200, 200, 200, 0.3)',
          borderColor: 'rgba(150, 150, 150, 0.5)',
          borderWidth: 1
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Insira dados para visualizar'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Boxplot'
        },
        legend: {
          display: false
        }
      }
    }
  })

  // Limpar informações anteriores do boxplot, se existirem
  const boxplotContainer = canvas.parentElement
  const existingInfo = boxplotContainer.querySelector('.boxplot-info')
  if (existingInfo) {
    boxplotContainer.removeChild(existingInfo)
  }
}

// Função para criar um histograma
function criarHistograma(data, canvas) {
  const ctx = canvas.getContext('2d')

  // Determinar o número de classes (bins) usando a regra de Sturges
  const numClasses = Math.ceil(1 + 3.322 * Math.log10(data.length))

  // Calcular a largura das classes
  const min = Math.min(...data)
  const max = Math.max(...data)
  const amplitude = max - min
  const larguraClasse = amplitude / numClasses

  // Criar as classes
  const classes = []
  const labels = []

  for (let i = 0; i < numClasses; i++) {
    const limiteInferior = min + i * larguraClasse
    const limiteSuperior = min + (i + 1) * larguraClasse

    classes.push({
      limiteInferior,
      limiteSuperior,
      frequencia: 0
    })

    labels.push(`${limiteInferior.toFixed(1)} - ${limiteSuperior.toFixed(1)}`)
  }

  // Contar a frequência em cada classe
  data.forEach(valor => {
    for (let i = 0; i < classes.length; i++) {
      if (
        valor >= classes[i].limiteInferior &&
        (valor < classes[i].limiteSuperior ||
          (i === classes.length - 1 && valor <= classes[i].limiteSuperior))
      ) {
        classes[i].frequencia++
        break
      }
    }
  })

  // Encontrar a frequência máxima para normalização
  const maxFrequencia = Math.max(...classes.map(classe => classe.frequencia))

  // Função para gerar cores gradientes baseadas na frequência
  const gerarCor = (frequencia, type = 'background') => {
    const intensidade = frequencia / maxFrequencia
    const r = Math.floor(52 + 54 * (1 - intensidade)) // 52-106
    const g = Math.floor(162 + 0 * (1 - intensidade)) // mantém constante
    const b = Math.floor(235 - 135 * (1 - intensidade)) // 235-100

    // Opacidade varia de 0.4 a 1 para background, 1 para border
    const alpha = type === 'background' ? 0.4 + 0.6 * intensidade : 1

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Extrair frequências para o gráfico
  const frequencias = classes.map(classe => classe.frequencia)

  // Gerar cores baseadas nas frequências
  const backgroundCores = classes.map(classe =>
    gerarCor(classe.frequencia, 'background')
  )
  const borderCores = classes.map(classe =>
    gerarCor(classe.frequencia, 'border')
  )

  // Destruir gráfico anterior se existir
  if (histogramaChart) {
    histogramaChart.destroy()
  }

  // Criar o novo histograma
  histogramaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Frequência',
          data: frequencias,
          backgroundColor: backgroundCores,
          borderColor: borderCores,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frequência'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Classes'
          },
          ticks: {
            autoSkip: true,
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              const item = tooltipItems[0]
              const index = item.dataIndex
              return `Classe: ${labels[index]}`
            },
            label: function (context) {
              const classInfo = classes[context.dataIndex]
              return [
                `Frequência: ${context.raw}`,
                `Limite Inferior: ${classInfo.limiteInferior.toFixed(2)}`,
                `Limite Superior: ${classInfo.limiteSuperior.toFixed(2)}`
              ]
            }
          }
        },
        title: {
          display: true,
          text: 'Histograma'
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            generateLabels: chart => {
              return [
                {
                  text: 'Legenda do Histograma',
                  fillStyle: 'rgba(0,0,0,0.8)',
                  hidden: false,
                  index: -1
                }
              ]
            }
          }
        }
      }
    }
  })

  // Criar legenda personalizada abaixo do gráfico
  const legendaContainer = document.createElement('div')
  legendaContainer.className = 'histograma-legenda'
  legendaContainer.innerHTML = `
    <div class="legenda-container">
      <h4>Detalhes do Histograma</h4>
      <div class="legenda-stats">
        <div class="legenda-item">
          <span class="legenda-label">Número de Classes:</span>
          <span class="legenda-value">${numClasses}</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-label">Valor Mínimo:</span>
          <span class="legenda-value">${min.toFixed(2)}</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-label">Valor Máximo:</span>
          <span class="legenda-value">${max.toFixed(2)}</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-label">Amplitude Total:</span>
          <span class="legenda-value">${amplitude.toFixed(2)}</span>
        </div>
        <div class="legenda-item">
          <span class="legenda-label">Largura da Classe:</span>
          <span class="legenda-value">${larguraClasse.toFixed(2)}</span>
        </div>
      </div>
      <div class="legenda-classes">
        <h5>Distribuição das Classes</h5>
        ${classes
          .map(
            (classe, index) => `
          <div class="classe-item" style="background-color: ${
            backgroundCores[index]
          };">
            <span class="classe-label">
              Classe ${index + 1}: 
              ${classe.limiteInferior.toFixed(
                2
              )} - ${classe.limiteSuperior.toFixed(2)}
            </span>
            <span class="classe-frequencia">
              Frequência: ${classe.frequencia}
            </span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `

  // Adicionar CSS para a legenda
  const style = document.createElement('style')
  style.textContent = `
    .histograma-legenda {
      margin-top: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .legenda-container h4 {
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .legenda-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 15px;
    }
    .legenda-item {
      background-color: white;
      border-radius: 5px;
      padding: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .legenda-label {
      display: block;
      color: #6c757d;
      font-size: 0.8em;
      margin-bottom: 5px;
    }
    .legenda-value {
      font-weight: bold;
      color: #007bff;
    }
    .legenda-classes {
      background-color: white;
      border-radius: 5px;
      padding: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .classe-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      padding: 8px;
      border-radius: 4px;
      color: white;
    }
    .classe-label {
      font-size: 0.9em;
    }
    .classe-frequencia {
      font-weight: bold;
    }
  `

  // Adicionar legenda ao container do gráfico
  const chartContainer = canvas.parentElement
  const existingLegenda = chartContainer.querySelector('.histograma-legenda')
  if (existingLegenda) {
    chartContainer.removeChild(existingLegenda)
  }

  chartContainer.appendChild(style)
  chartContainer.appendChild(legendaContainer)
}

// Função para criar um boxplot personalizado usando Chart.js
function criarBoxplot(data, canvas) {
  const ctx = canvas.getContext('2d')
  canvas.height = 300

  // Calcular estatísticas para o boxplot
  const min = Math.min(...data)
  const max = Math.max(...data)
  const q1 = calcularQuartil(data, 0.25)
  const mediana = calcularQuartil(data, 0.5)
  const q3 = calcularQuartil(data, 0.75)
  const iqr = q3 - q1

  // Calcular outliers
  const resultado = calcularOutliers(data)
  const outliers = [...resultado.inferior, ...resultado.superior]

  // Paleta de cores mais sofisticada
  const colorPalette = {
    whiskerLine: 'rgba(55, 126, 184, 1)', // Deep Blue
    whiskerFill: 'rgba(55, 126, 184, 0.3)', // Light Blue
    q1MedianBox: 'rgba(77, 175, 74, 0.5)', // Soft Green
    medianQ3Box: 'rgba(228, 26, 28, 0.5)', // Soft Red
    outliers: 'rgba(152, 78, 163, 0.7)', // Purple
    boxBorder: 'rgba(0, 0, 0, 0.6)' // Dark Border
  }

  // Limites para o whisker (sem incluir outliers)
  const whiskerMin =
    resultado.inferior.length > 0
      ? Math.min(...data.filter(v => v >= resultado.limiteInferior))
      : min
  const whiskerMax =
    resultado.superior.length > 0
      ? Math.max(...data.filter(v => v <= resultado.limiteSuperior))
      : max

  // Destruir gráfico anterior se existir
  if (boxplotChart) {
    boxplotChart.destroy()
  }

  // Criar o boxplot usando barras empilhadas e pontos
  boxplotChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [''],
      datasets: [
        // Linha inferior (whisker min até q1)
        {
          label: 'Whisker Inferior',
          data: [q1 - whiskerMin],
          backgroundColor: colorPalette.whiskerFill,
          borderColor: colorPalette.whiskerLine,
          borderWidth: 2,
          base: whiskerMin
        },
        // Caixa Q1-Mediana
        {
          label: 'Q1 a Mediana',
          data: [mediana - q1],
          backgroundColor: colorPalette.q1MedianBox,
          borderColor: colorPalette.boxBorder,
          borderWidth: 1,
          base: q1
        },
        // Caixa Mediana-Q3
        {
          label: 'Mediana a Q3',
          data: [q3 - mediana],
          backgroundColor: colorPalette.medianQ3Box,
          borderColor: colorPalette.boxBorder,
          borderWidth: 1,
          base: mediana
        },
        // Linha superior (q3 até whisker max)
        {
          label: 'Whisker Superior',
          data: [whiskerMax - q3],
          backgroundColor: colorPalette.whiskerFill,
          borderColor: colorPalette.whiskerLine,
          borderWidth: 2,
          base: q3
        },
        // Outliers (se houver)
        {
          label: 'Outliers',
          data: outliers.map(() => 0),
          backgroundColor: colorPalette.outliers,
          borderColor: colorPalette.boxBorder,
          borderWidth: 1,
          pointRadius: 8,
          pointStyle: 'diamond',
          type: 'scatter',
          xAxisID: 'x'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      scales: {
        x: {
          position: 'top',
          title: {
            display: true,
            text: 'Valores',
            color: colorPalette.boxBorder
          },
          grid: {
            drawOnChartArea: true,
            color: 'rgba(0,0,0,0.1)'
          }
        },
        y: {
          display: true,
          grid: {
            display: false
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Boxplot',
          color: colorPalette.boxBorder,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.9)',
          titleColor: colorPalette.boxBorder,
          bodyColor: colorPalette.boxBorder,
          borderColor: colorPalette.boxBorder,
          borderWidth: 1,
          callbacks: {
            title: function () {
              return 'Boxplot Detalhado'
            },
            label: function (context) {
              const datasetLabel = context.dataset.label
              switch (datasetLabel) {
                case 'Outliers':
                  return `Outlier: ${outliers[context.dataIndex].toFixed(2)}`
                case 'Whisker Inferior':
                  return `Whisker Inferior: ${whiskerMin.toFixed(
                    2
                  )} - ${q1.toFixed(2)}`
                case 'Q1 a Mediana':
                  return `Q1: ${q1.toFixed(2)}, Mediana: ${mediana.toFixed(2)}`
                case 'Mediana a Q3':
                  return `Mediana: ${mediana.toFixed(2)}, Q3: ${q3.toFixed(2)}`
                case 'Whisker Superior':
                  return `Whisker Superior: ${q3.toFixed(
                    2
                  )} - ${whiskerMax.toFixed(2)}`
                default:
                  return `${datasetLabel}: ${context.raw}`
              }
            }
          }
        },
        legend: {
          display: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })

  // Adicionar informação sobre quartis abaixo do gráfico
  const boxplotInfo = document.createElement('div')
  boxplotInfo.className = 'boxplot-info'
  boxplotInfo.innerHTML = `
  <div class="stats-grid">
    ${[
      { label: 'Mínimo', value: min },
      { label: 'Q1', value: q1 },
      { label: 'Mediana', value: mediana },
      { label: 'Q3', value: q3 },
      { label: 'Máximo', value: max },
      { label: 'IQR', value: iqr }
    ]
      .map(
        stat => `
      <div class="stat-item" style="
        border-left: 4px solid ${
          stat.label === 'Q1'
            ? colorPalette.q1MedianBox
            : stat.label === 'Mediana'
            ? colorPalette.medianQ3Box
            : stat.label === 'Q3'
            ? colorPalette.medianQ3Box
            : colorPalette.whiskerLine
        }
      ">
        <span class="stat-label">${stat.label}</span>
        <span class="stat-value">${stat.value.toFixed(2)}</span>
      </div>
    `
      )
      .join('')}
  </div>
  ${
    outliers.length > 0
      ? `<div class="outliers-info" style="border-left: 4px solid ${
          colorPalette.outliers
        };">
          <div class="stat-label">Outliers (${outliers.length})</div>
          <div class="stat-value">
            ${outliers.map(o => o.toFixed(2)).join(', ')}
          </div>
        </div>`
      : '<div class="outliers-info"><div class="stat-label">Não há outliers</div></div>'
  }
`

  // Substituir informações anteriores
  const boxplotContainer = canvas.parentElement
  const existingInfo = boxplotContainer.querySelector('.boxplot-info')
  if (existingInfo) {
    boxplotContainer.removeChild(existingInfo)
  }
  boxplotContainer.appendChild(boxplotInfo)
}

// Função para exportar gráficos como imagens
export function exportarGrafico(canvas, filename) {
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = filename
  link.click()
}
