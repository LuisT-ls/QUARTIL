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
  const somaTotal = data.reduce((a, b) => a + b, 0).toFixed(2)
  const tamanhoAmostra = data.length

  mediaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${media.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> μ = <span class="fraction"><span class="numerator">∑x</span><span class="denominator">n</span></span>
      </p>
      <div class="result-steps">
        <p>∑x = ${somaTotal} (soma dos valores)</p>
        <p>n = ${tamanhoAmostra} (quantidade de valores)</p>
        <p>μ = <span class="fraction"><span class="numerator">${somaTotal}</span><span class="denominator">${tamanhoAmostra}</span></span> = ${media.toFixed(
    2
  )}</p>
      </div>
    </div>
  `

  // Calcular mediana
  const mediana = calcularMediana(data)
  const isPar = data.length % 2 === 0
  let posicaoMediana
  let formulaMediana

  if (isPar) {
    const pos1 = data.length / 2
    const pos2 = data.length / 2 + 1
    posicaoMediana = `${pos1} e ${pos2}`
    formulaMediana = `Md = <span class="fraction"><span class="numerator">X<sub>${pos1}</sub> + X<sub>${pos2}</sub></span><span class="denominator">2</span></span>`
  } else {
    const pos = (data.length + 1) / 2
    posicaoMediana = pos
    formulaMediana = `Md = X<sub>${pos}</sub>`
  }

  medianaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${mediana.toFixed(2)}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> ${formulaMediana}
      </p>
      <div class="result-steps">
        <p>Dados ordenados: [${[...data].sort((a, b) => a - b).join(', ')}]</p>
        <p>Posição: ${posicaoMediana}</p>
        <p>Mediana = ${mediana.toFixed(2)}</p>
      </div>
    </div>
  `

  // Calcular moda
  const moda = calcularModa(data)
  let tipoDistribuicao

  if (typeof moda === 'object' && moda.length > 1) {
    tipoDistribuicao = 'Distribuição multimodal'
  } else if (typeof moda === 'string') {
    tipoDistribuicao = 'Distribuição amodal'
  } else {
    tipoDistribuicao = 'Distribuição unimodal'
  }

  const valorModa = typeof moda === 'object' ? moda.join(', ') : moda

  modaResult.innerHTML = `
    <div class="result-card">
      <p class="result-value">${valorModa}</p>
      <p class="result-formula">
        <strong>Fórmula:</strong> Mo = valor(es) com maior frequência
      </p>
      <div class="result-steps">
        <p>${tipoDistribuicao}</p>
        <p>Valor(es) mais frequente(s): ${valorModa}</p>
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
