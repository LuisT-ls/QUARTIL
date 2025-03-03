// medidasDispersao.js
export function calcularVariancia(numeros) {
  const media = calcularMedia(numeros)
  const somaQuadrados = numeros.reduce(
    (acc, num) => acc + Math.pow(num - media, 2),
    0
  )
  return somaQuadrados / numeros.length
}

export function calcularDesvioPadrao(numeros) {
  return Math.sqrt(calcularVariancia(numeros))
}

export function calcularCoeficienteVariacao(numeros) {
  const media = calcularMedia(numeros)
  const desvioPadrao = calcularDesvioPadrao(numeros)
  return (desvioPadrao / media) * 100
}
