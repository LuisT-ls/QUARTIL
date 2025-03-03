// tabelaFrequencia.js - Módulo para cálculo e exibição da tabela de frequência
import { appState } from '../app.js'

// Função para inicializar o módulo de tabela de frequência
export function initializeTabelaFrequencia() {
  const tabelaFrequenciaInput = document.getElementById('tabelaFrequenciaInput')
  const calcularTabelaFrequenciaBtn = document.getElementById(
    'calcularTabelaFrequencia'
  )

  calcularTabelaFrequenciaBtn.addEventListener('click', () => {
    const inputValue = tabelaFrequenciaInput.value.trim()

    if (!inputValue) {
      alert(
        'Por favor, insira alguns números para criar a tabela de frequência.'
      )
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

    // Criar e exibir a tabela de frequência
    criarTabelaFrequencia(numeros)
  })

  // Permitir cálculo ao pressionar Enter
  tabelaFrequenciaInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      document.getElementById('calcularTabelaFrequencia').click()
    }
  })
}

// Função para criar e exibir a tabela de frequência
export function criarTabelaFrequencia(data) {
  const tabelaFrequenciaResult = document.getElementById(
    'tabelaFrequenciaResult'
  )

  // Contar frequências
  const frequencias = {}
  data.forEach(valor => {
    frequencias[valor] = (frequencias[valor] || 0) + 1
  })

  // Organizar os dados para a tabela
  const tabelaData = []
  let freqAcumulada = 0
  let totalFreq = data.length

  // Ordenar as chaves numericamente
  const chaves = Object.keys(frequencias)
    .map(k => parseFloat(k))
    .sort((a, b) => a - b)

  chaves.forEach(valor => {
    const freq = frequencias[valor]
    freqAcumulada += freq
    const freqRelativa = (freq / totalFreq) * 100
    const freqRelativaAcumulada = (freqAcumulada / totalFreq) * 100

    tabelaData.push({
      valor,
      freq,
      freqAcumulada,
      freqRelativa,
      freqRelativaAcumulada
    })
  })

  // Criar a tabela HTML
  let tabelaHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Valor</th>
            <th>Frequência (f)</th>
            <th>Freq. Acumulada (F)</th>
            <th>Freq. Relativa (%)</th>
            <th>Freq. Relativa Acumulada (%)</th>
          </tr>
        </thead>
        <tbody>
  `

  tabelaData.forEach(row => {
    tabelaHTML += `
      <tr>
        <td>${row.valor}</td>
        <td>${row.freq}</td>
        <td>${row.freqAcumulada}</td>
        <td>${row.freqRelativa.toFixed(2)}%</td>
        <td>${row.freqRelativaAcumulada.toFixed(2)}%</td>
      </tr>
    `
  })

  tabelaHTML += `
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>${totalFreq}</th>
            <th>-</th>
            <th>100.00%</th>
            <th>-</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `

  // Adicionar algumas estatísticas da tabela
  tabelaHTML += `
    <div class="tabela-stats mt-3">
      <h4>Estatísticas da Tabela:</h4>
      <p><strong>Número de valores distintos:</strong> ${chaves.length}</p>
      <p><strong>Valor mais frequente:</strong> ${getMaisFrequente(
        frequencias
      )}</p>
      <p><strong>Frequência máxima:</strong> ${Math.max(
        ...Object.values(frequencias)
      )}</p>
    </div>
  `

  tabelaFrequenciaResult.innerHTML = tabelaHTML
}

// Função auxiliar para obter o valor mais frequente
function getMaisFrequente(frequencias) {
  let maxFreq = 0
  let valoresMaisFrequentes = []

  for (const [valor, freq] of Object.entries(frequencias)) {
    if (freq > maxFreq) {
      maxFreq = freq
      valoresMaisFrequentes = [valor]
    } else if (freq === maxFreq) {
      valoresMaisFrequentes.push(valor)
    }
  }

  return valoresMaisFrequentes.join(', ')
}

// Função para criar tabela de frequência agrupada
export function criarTabelaFrequenciaAgrupada(data, numClasses = null) {
  // Se número de classes não for especificado, calcular usando a regra de Sturges
  if (!numClasses) {
    numClasses = Math.ceil(1 + 3.322 * Math.log10(data.length))
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const amplitude = max - min
  const larguraClasse = amplitude / numClasses

  // Criar as classes
  const classes = []
  for (let i = 0; i < numClasses; i++) {
    const limiteInferior = min + i * larguraClasse
    const limiteSuperior = min + (i + 1) * larguraClasse

    classes.push({
      limiteInferior,
      limiteSuperior,
      frequencia: 0,
      frequenciaAcumulada: 0,
      frequenciaRelativa: 0,
      frequenciaRelativaAcumulada: 0
    })
  }

  // Calcular frequências
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

  // Calcular frequências acumuladas e relativas
  let freqAcumulada = 0
  classes.forEach(classe => {
    freqAcumulada += classe.frequencia
    classe.frequenciaAcumulada = freqAcumulada
    classe.frequenciaRelativa = (classe.frequencia / data.length) * 100
    classe.frequenciaRelativaAcumulada = (freqAcumulada / data.length) * 100
  })

  return {
    classes,
    numClasses,
    totalFrequencia: data.length
  }
}
