// quartis.js - Cálculos para quartis
import { appState } from '../app.js'
import { calcularMediana } from './medidasPosicao.js'

// Função para inicializar o módulo de quartis
export function initializeQuartis() {
  // Este módulo não tem sua própria interface de entrada,
  // os cálculos são acionados a partir do módulo de rol
}

// Função para calcular e exibir todos os quartis
export function calculateQuartis(data) {
  if (!data || data.length === 0) {
    return
  }

  const q1Result = document.getElementById('q1Result')
  const q2Result = document.getElementById('q2Result')
  const q3Result = document.getElementById('q3Result')
  const iqrResult = document.getElementById('iqrResult')
  const mediaJuntasResult = document.getElementById('mediaJuntasResult')

  // Calcular quartis
  const q1 = calcularQuartil(data, 0.25)
  const q2 = calcularMediana(data) // Q2 é a mediana
  const q3 = calcularQuartil(data, 0.75)
  const iqr = q3 - q1
  const mediaJuntas = (q1 + q2 + q3) / 3

  // Exibir Q1
  q1Result.innerHTML = `
    <div class="result-card">
      <p class="result-value">${q1.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Q1 = Valor na posição 25% dos dados
      </p>
      <div class="result-steps">
        <p>Posição aproximada: ${(data.length * 0.25).toFixed(2)}</p>
      </div>
    </div>
  `

  // Exibir Q2 (Mediana)
  q2Result.innerHTML = `
    <div class="result-card">
      <p class="result-value">${q2.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Q2 = Mediana
      </p>
      <div class="result-steps">
        <p>Posição central dos dados</p>
      </div>
    </div>
  `

  // Exibir Q3
  q3Result.innerHTML = `
    <div class="result-card">
      <p class="result-value">${q3.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Q3 = Valor na posição 75% dos dados
      </p>
      <div class="result-steps">
        <p>Posição aproximada: ${(data.length * 0.75).toFixed(2)}</p>
      </div>
    </div>
  `

  // Exibir Amplitude do Interquartil (IQR)
  iqrResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${iqr.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> IQR = Q3 - Q1
      </p>
      <div class="result-steps">
        <p>Q3 = ${q3.toFixed(2)}</p>
        <p>Q1 = ${q1.toFixed(2)}</p>
        <p>IQR = ${q3.toFixed(2)} - ${q1.toFixed(2)} = ${iqr.toFixed(2)}</p>
      </div>
    </div>
  `

  // Exibir Média das Juntas (Q1, Mediana, Q3)
  mediaJuntasResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${mediaJuntas.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Média das Juntas = (Q1 + Q2 + Q3) / 3
      </p>
      <div class="result-steps">
        <p>Q1 = ${q1.toFixed(2)}</p>
        <p>Q2 = ${q2.toFixed(2)}</p>
        <p>Q3 = ${q3.toFixed(2)}</p>
        <p>Média = (${q1.toFixed(2)} + ${q2.toFixed(2)} + ${q3.toFixed(
    2
  )}) / 3 = ${mediaJuntas.toFixed(2)}</p>
      </div>
    </div>
  `

  // Retornar os valores calculados para uso em outros módulos
  return { q1, q2, q3, iqr, mediaJuntas }
}

// Função para calcular um quartil específico
export function calcularQuartil(array, percentil) {
  if (!array || array.length === 0) return 0

  // Garantir que o array está ordenado
  const ordenado = [...array].sort((a, b) => a - b)

  // Método da interpolação linear
  const posicao = percentil * (ordenado.length - 1)
  const base = Math.floor(posicao)
  const resto = posicao - base

  if (ordenado[base + 1] !== undefined) {
    return ordenado[base] + resto * (ordenado[base + 1] - ordenado[base])
  } else {
    return ordenado[base]
  }
}

// Função para calcular valores atípicos (outliers)
export function calcularOutliers(array) {
  if (!array || array.length === 0) return { inferior: [], superior: [] }

  const q1 = calcularQuartil(array, 0.25)
  const q3 = calcularQuartil(array, 0.75)
  const iqr = q3 - q1

  const limiteInferior = q1 - 1.5 * iqr
  const limiteSuperior = q3 + 1.5 * iqr

  const outliersInferiores = array.filter(val => val < limiteInferior)
  const outliersSuperiores = array.filter(val => val > limiteSuperior)

  return {
    inferior: outliersInferiores,
    superior: outliersSuperiores,
    limiteInferior,
    limiteSuperior
  }
}
