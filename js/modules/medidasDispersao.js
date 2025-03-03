// medidasDispersao.js - Cálculos para medidas de dispersão
import { appState } from '../app.js'
import { calcularMedia } from './medidasPosicao.js'

// Função para inicializar o módulo de medidas de dispersão
export function initializeMedidasDispersao() {
  // Este módulo não tem sua própria interface de entrada,
  // os cálculos são acionados a partir do módulo de rol
}

// Função para calcular e exibir todas as medidas de dispersão
export function calculateMedidasDispersao(data) {
  if (!data || data.length === 0) {
    return
  }

  const desvioPadraoResult = document.getElementById('desvioPadraoResult')
  const varianciaResult = document.getElementById('varianciaResult')
  const cvResult = document.getElementById('cvResult')
  const assimetriaResult = document.getElementById('assimetriaResult')
  const curtoseResult = document.getElementById('curtoseResult')

  // Calcular desvio padrão
  const media = calcularMedia(data)
  const variancia = calcularVariancia(data, media)
  const desvioPadrao = Math.sqrt(variancia)
  const cv = (desvioPadrao / media) * 100
  const assimetria = calcularAssimetria(data, media, desvioPadrao)
  const curtose = calcularCurtose(data, media, desvioPadrao)

  // Exibir desvio padrão
  desvioPadraoResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${desvioPadrao.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> σ = √(∑(x - μ)² / n)
      </p>
      <div class="result-steps">
        <p>μ (média) = ${media.toFixed(2)}</p>
        <p>n = ${data.length}</p>
      </div>
    </div>
  `

  // Exibir variância
  varianciaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${variancia.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> σ² = ∑(x - μ)² / n
      </p>
      <div class="result-steps">
        <p>σ² = ${desvioPadrao.toFixed(2)}² = ${variancia.toFixed(2)}</p>
      </div>
    </div>
  `

  // Exibir coeficiente de variação
  cvResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${cv.toFixed(2)}%</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> CV = (σ / μ) × 100%
      </p>
      <div class="result-steps">
        <p>σ (desvio padrão) = ${desvioPadrao.toFixed(2)}</p>
        <p>μ (média) = ${media.toFixed(2)}</p>
        <p>Interpretação: ${interpretarCV(cv)}</p>
      </div>
    </div>
  `

  // Exibir assimetria
  assimetriaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${assimetria.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Assimetria = [n / ((n-1)(n-2))] * ∑[(x - μ)/σ]³
      </p>
      <div class="result-steps">
        <p>Interpretação: ${interpretarAssimetria(assimetria)}</p>
      </div>
    </div>
  `

  // Exibir curtose
  curtoseResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${curtose.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Curtose = [n(n+1)/((n-1)(n-2)(n-3))] * ∑[(x - μ)/σ]⁴ - [3(n-1)²/((n-2)(n-3))]
      </p>
      <div class="result-steps">
        <p>Interpretação: ${interpretarCurtose(curtose)}</p>
      </div>
    </div>
  `
}

// Função para calcular a variância
export function calcularVariancia(array, media = null) {
  if (!array || array.length === 0) return 0

  if (media === null) {
    media = calcularMedia(array)
  }

  const somaDosQuadradosDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow(val - media, 2)
  }, 0)

  return somaDosQuadradosDasDiferencas / array.length
}

// Função para calcular o desvio padrão
export function calcularDesvioPadrao(array, media = null) {
  return Math.sqrt(calcularVariancia(array, media))
}

// Função para calcular o coeficiente de variação
export function calcularCV(array, media = null, desvioPadrao = null) {
  if (!array || array.length === 0) return 0

  if (media === null) {
    media = calcularMedia(array)
  }

  if (desvioPadrao === null) {
    desvioPadrao = calcularDesvioPadrao(array, media)
  }

  return (desvioPadrao / media) * 100
}

// Função para interpretar o coeficiente de variação
function interpretarCV(cv) {
  if (cv < 15) {
    return 'Baixa dispersão (dados homogêneos)'
  } else if (cv < 30) {
    return 'Média dispersão'
  } else {
    return 'Alta dispersão (dados heterogêneos)'
  }
}

// Função para calcular a assimetria
export function calcularAssimetria(array, media = null, desvioPadrao = null) {
  if (!array || array.length === 0) return 0

  if (media === null) {
    media = calcularMedia(array)
  }

  if (desvioPadrao === null) {
    desvioPadrao = calcularDesvioPadrao(array, media)
  }

  const n = array.length
  const somaCubosDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow((val - media) / desvioPadrao, 3)
  }, 0)

  return (n / ((n - 1) * (n - 2))) * somaCubosDasDiferencas
}

// Função para interpretar a assimetria
function interpretarAssimetria(assimetria) {
  if (assimetria === 0) {
    return 'Distribuição simétrica'
  } else if (assimetria > 0) {
    return 'Assimetria positiva (cauda à direita)'
  } else {
    return 'Assimetria negativa (cauda à esquerda)'
  }
}

// Função para calcular a curtose
export function calcularCurtose(array, media = null, desvioPadrao = null) {
  if (!array || array.length === 0) return 0

  if (media === null) {
    media = calcularMedia(array)
  }

  if (desvioPadrao === null) {
    desvioPadrao = calcularDesvioPadrao(array, media)
  }

  const n = array.length
  const somaQuartasPotenciaDasDiferencas = array.reduce((sum, val) => {
    return sum + Math.pow((val - media) / desvioPadrao, 4)
  }, 0)

  const curtose =
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) *
    somaQuartasPotenciaDasDiferencas
  return curtose - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3))
}

// Função para interpretar a curtose
function interpretarCurtose(curtose) {
  if (curtose === 0) {
    return 'Curtose normal (mesocúrtica)'
  } else if (curtose > 0) {
    return 'Curtose alta (leptocúrtica)'
  } else {
    return 'Curtose baixa (platicúrtica)'
  }
}
