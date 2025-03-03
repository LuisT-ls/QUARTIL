// medidasPosicao.js - Cálculos para medidas de posição (média, mediana, moda)
import { appState } from '../app.js'

// Função para inicializar o módulo de medidas de posição
export function initializeMedidasPosicao() {
  // Este módulo não tem sua própria interface de entrada,
  // os cálculos são acionados a partir do módulo de rol
}

// Função para calcular e exibir todas as medidas de posição
export function calculateMedidasPosicao(data) {
  if (!data || data.length === 0) {
    return
  }

  const mediaResult = document.getElementById('mediaResult')
  const medianaResult = document.getElementById('medianaResult')
  const modaResult = document.getElementById('modaResult')

  // Calcular média
  const media = calcularMedia(data)
  mediaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${media.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> μ = (∑x) / n
      </p>
      <div class="result-steps">
        <p>∑x = ${data.reduce((a, b) => a + b, 0).toFixed(2)}</p>
        <p>n = ${data.length}</p>
      </div>
    </div>
  `

  // Calcular mediana
  const mediana = calcularMediana(data)
  medianaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${mediana.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> ${
          data.length % 2 === 0
            ? 'Md = (X(n/2) + X(n/2+1)) / 2'
            : 'Md = X((n+1)/2)'
        }
      </p>
      <div class="result-steps">
        <p>Posição: ${
          data.length % 2 === 0
            ? `${data.length / 2} e ${data.length / 2 + 1}`
            : `${(data.length + 1) / 2}`
        }</p>
      </div>
    </div>
  `

  // Calcular moda
  const moda = calcularModa(data)
  modaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${
        typeof moda === 'object' ? moda.join(', ') : moda
      }</p>
      <div class="result-steps">
        <p>${
          typeof moda === 'object' && moda.length > 1
            ? 'Distribuição multimodal'
            : typeof moda === 'string'
            ? 'Distribuição amodal'
            : 'Distribuição unimodal'
        }</p>
      </div>
    </div>
  `
}

// Função para calcular a média
export function calcularMedia(array) {
  if (!array || array.length === 0) return 0
  return array.reduce((sum, value) => sum + value, 0) / array.length
}

// Função para calcular a mediana
export function calcularMediana(array) {
  if (!array || array.length === 0) return 0

  // Garantir que o array está ordenado
  const ordenado = [...array].sort((a, b) => a - b)
  const meio = Math.floor(ordenado.length / 2)

  if (ordenado.length % 2 === 0) {
    return (ordenado[meio - 1] + ordenado[meio]) / 2
  } else {
    return ordenado[meio]
  }
}

// Função para calcular a moda
export function calcularModa(array) {
  if (!array || array.length === 0) return 0

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

  // Se todos os valores tiverem a mesma frequência (não há moda)
  if (moda.length === Object.keys(contagem).length) {
    return 'Não há moda'
  }

  return moda.length === 1 ? moda[0] : moda
}
