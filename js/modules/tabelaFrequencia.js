// tabelaFrequencia.js - Módulo para cálculo e exibição da tabela de frequência
import { appState } from '../app.js'
import {
  calcularMedia,
  calcularMediana,
  calcularModa
} from './medidasPosicao.js'

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

// Função para criar e exibir a tabela de frequência agrupada
export function criarTabelaFrequencia(data) {
  const tabelaFrequenciaResult = document.getElementById(
    'tabelaFrequenciaResult'
  )

  // Verificar se há dados
  if (!data || data.length === 0) {
    tabelaFrequenciaResult.innerHTML =
      '<p class="text-danger">Nenhum dado disponível para criar a tabela de frequência.</p>'
    return
  }

  // Calcular número de classes usando a regra de Sturges
  const numClasses = Math.ceil(1 + 3.322 * Math.log10(data.length))

  // Calcular amplitude total
  const min = Math.min(...data)
  const max = Math.max(...data)
  const amplitudeTotal = max - min

  // Calcular largura das classes (h)
  const h = amplitudeTotal / numClasses

  // Criar as classes
  const classes = []
  for (let i = 0; i < numClasses; i++) {
    const limiteInferior = min + i * h
    const limiteSuperior = limiteInferior + h

    classes.push({
      limiteInferior,
      limiteSuperior,
      pontoMedio: (limiteInferior + limiteSuperior) / 2, // Ponto médio
      frequencia: 0, // fi
      frequenciaRelativa: 0, // fri
      frequenciaRelativaPercentual: 0, // fri (%)
      frequenciaAcumulada: 0, // Fi
      frequenciaRelativaAcumulada: 0 // Fri
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

  // Calcular frequências relativas e acumuladas
  let freqAcumulada = 0
  classes.forEach(classe => {
    freqAcumulada += classe.frequencia
    classe.frequenciaAcumulada = freqAcumulada
    classe.frequenciaRelativa = classe.frequencia / data.length
    classe.frequenciaRelativaPercentual = classe.frequenciaRelativa * 100
    classe.frequenciaRelativaAcumulada = freqAcumulada / data.length
  })

  // Calcular média, mediana e moda usando as funções importadas
  const media = calcularMedia(data)
  const mediana = calcularMediana(data)
  const moda = calcularModa(data)

  // Criar a tabela HTML
  let tabelaHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Classe</th>
            <th>Ponto Médio</th>
            <th>h</th>
            <th>fi</th>
            <th>fri</th>
            <th>fri (%)</th>
            <th>Fi</th>
            <th>Fri</th>
          </tr>
        </thead>
        <tbody>
  `

  classes.forEach(classe => {
    tabelaHTML += `
      <tr>
        <td>${classe.limiteInferior.toFixed(
          2
        )} ⊢ ${classe.limiteSuperior.toFixed(2)}</td>
        <td>${classe.pontoMedio.toFixed(2)}</td>
        <td>${h.toFixed(2)}</td>
        <td>${classe.frequencia}</td>
        <td>${classe.frequenciaRelativa.toFixed(4)}</td>
        <td>${classe.frequenciaRelativaPercentual.toFixed(2)}%</td>
        <td>${classe.frequenciaAcumulada}</td>
        <td>${classe.frequenciaRelativaAcumulada.toFixed(4)}</td>
      </tr>
    `
  })

  tabelaHTML += `
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <th>-</th>
            <th>-</th>
            <th>${data.length}</th>
            <th>1.0000</th>
            <th>100.00%</th>
            <th>-</th>
            <th>-</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `

  // Adicionar estatísticas e legenda
  tabelaHTML += `
<div class="tabela-stats mt-3">
  <h4>Estatísticas da Tabela:</h4>
  <div class="stats-container">
    <!-- Legenda à esquerda -->
    <div class="stats-card">
      <h4>Legenda:</h4>
      <ul>
        <li><strong>h:</strong> Largura da classe (h = Amplitude Total / Número de Classes).</li>
        <li><strong>fi:</strong> Frequência absoluta (número de observações na classe).</li>
        <li><strong>fri:</strong> Frequência relativa (fi / Total de Observações).</li>
        <li><strong>fri (%):</strong> Frequência relativa em porcentagem (fri * 100).</li>
        <li><strong>Fi:</strong> Frequência acumulada (soma das frequências até a classe atual).</li>
        <li><strong>Fri:</strong> Frequência relativa acumulada (Fi / Total de Observações).</li>
      </ul>
    </div>
    <!-- Estatísticas à direita -->
    <div class="stats-card">
      <p><strong>Número de classes:</strong> ${numClasses}</p>
      <p><strong>Amplitude total:</strong> ${amplitudeTotal.toFixed(2)}</p>
      <p><strong>Largura das classes (h):</strong> ${h.toFixed(2)}</p>
      <p><strong>Média:</strong> ${media.toFixed(2)}</p>
      <p><strong>Mediana:</strong> ${mediana.toFixed(2)}</p>
      <p><strong>Moda:</strong> ${
        Array.isArray(moda) ? moda.join(', ') : moda
      }</p>
    </div>
  </div>
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
