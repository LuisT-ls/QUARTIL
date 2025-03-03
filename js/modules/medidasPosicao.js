// medidasPosicao.js
export function calcularMedia(numeros) {
  const soma = numeros.reduce((acc, num) => acc + num, 0)
  return soma / numeros.length
}

export function calcularMediana(numeros) {
  const sorted = [...numeros].sort((a, b) => a - b)
  const meio = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[meio]
    : (sorted[meio - 1] + sorted[meio]) / 2
}

export function calcularModa(numeros) {
  const contagem = numeros.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1
    return acc
  }, {})
  const moda = Object.keys(contagem).reduce((a, b) =>
    contagem[a] > contagem[b] ? a : b
  )
  return moda
}
