// graficos.js - Módulo para criação e atualização dos gráficos
import { appState } from '../app.js'
import { calcularQuartil, calcularOutliers } from './quartis.js'

let histogramaChart = null
let boxplotChart = null

// Função para inicializar o módulo de gráficos
export function initializeGraficos() {
  // Inicializar os contextos dos gráficos
  const histogramaCanvas = document.getElementById('histogramaChart')
  const boxplotCanvas = document.getElementById('boxplotChart')

  if (histogramaCanvas && boxplotCanvas) {
    // Pré-configurar os gráficos vazios
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

  if (histogramaChart) {
    histogramaChart.destroy()
  }

  histogramaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Frequência',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
            text: 'Valores'
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
}

// Função para criar um boxplot vazio
function criarBoxplotVazio(canvas) {
  const ctx = canvas.getContext('2d')

  if (boxplotChart) {
    boxplotChart.destroy()
  }

  boxplotChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Boxplot'],
      datasets: [
        {
          label: 'Valores',
          data: [0],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
            text: 'Valores'
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
  const gerarCor = frequencia => {
    // Interpolação entre azul claro (baixa frequência) e azul escuro (alta frequência)
    const intensidade = frequencia / maxFrequencia
    const r = Math.floor(52 + 54 * (1 - intensidade)) // 52-106
    const g = Math.floor(162 + 0 * (1 - intensidade)) // mantém constante
    const b = Math.floor(235 - 135 * (1 - intensidade)) // 235-100

    // Opacidade varia de 0.4 a 1
    const alpha = 0.4 + 0.6 * intensidade

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Extrair frequências para o gráfico
  const frequencias = classes.map(classe => classe.frequencia)

  // Gerar cores baseadas nas frequências
  const cores = classes.map(classe => gerarCor(classe.frequencia))

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
          backgroundColor: cores,
          borderColor: cores.map(cor => cor.replace(/[\d.]+\)$/, '1)')), // Bordas com opacidade total
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
              return `Frequência: ${context.raw}`
            }
          }
        },
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
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          base: whiskerMin
        },
        // Caixa Q1-Mediana
        {
          label: 'Q1 a Mediana',
          data: [mediana - q1],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          base: q1
        },
        // Caixa Mediana-Q3
        {
          label: 'Mediana a Q3',
          data: [q3 - mediana],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          base: mediana
        },
        // Linha superior (q3 até whisker max)
        {
          label: 'Whisker Superior',
          data: [whiskerMax - q3],
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          base: q3
        },
        // Outliers (se houver)
        {
          label: 'Outliers',
          data: outliers.map(() => 0),
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          borderColor: 'rgba(255, 0, 0, 1)',
          borderWidth: 1,
          pointRadius: 6,
          pointStyle: 'circle',
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
            text: 'Valores'
          },
          grid: {
            drawOnChartArea: true
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
          text: 'Boxplot'
        },
        tooltip: {
          callbacks: {
            title: function () {
              return 'Boxplot'
            },
            label: function (context) {
              const datasetLabel = context.dataset.label
              switch (datasetLabel) {
                case 'Outliers':
                  return `Outlier: ${outliers[context.dataIndex]}`
                case 'Whisker Inferior':
                  return `Whisker Inferior: ${whiskerMin} a ${q1}`
                case 'Q1 a Mediana':
                  return `Q1: ${q1.toFixed(2)}, Mediana: ${mediana.toFixed(2)}`
                case 'Mediana a Q3':
                  return `Mediana: ${mediana.toFixed(2)}, Q3: ${q3.toFixed(2)}`
                case 'Whisker Superior':
                  return `Whisker Superior: ${q3} a ${whiskerMax}`
                default:
                  return `${datasetLabel}: ${context.raw}`
              }
            }
          }
        },
        legend: {
          display: false
        }
      }
    }
  })

  // Adicionar informação sobre quartis abaixo do gráfico
  const boxplotInfo = document.createElement('div')
  boxplotInfo.className = 'boxplot-info'
  boxplotInfo.innerHTML = `
  <div class="stats-grid">
    <div class="stat-item">
      <span class="stat-label">Mínimo</span>
      <span class="stat-value">${min.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Q1</span>
      <span class="stat-value">${q1.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Mediana</span>
      <span class="stat-value">${mediana.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Q3</span>
      <span class="stat-value">${q3.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Máximo</span>
      <span class="stat-value">${max.toFixed(2)}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">IQR</span>
      <span class="stat-value">${iqr.toFixed(2)}</span>
    </div>
  </div>
  ${
    outliers.length > 0
      ? `<div class="outliers-info">
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
