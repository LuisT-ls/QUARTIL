// quartis.js
export function calcularQuartil(numeros, percentil) {
  const sorted = [...numeros].sort((a, b) => a - b)
  const posicao = percentil * (sorted.length - 1)
  const base = Math.floor(posicao)
  const resto = posicao - base
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + resto * (sorted[base + 1] - sorted[base])
  } else {
    return sorted[base]
  }
}

export function calcularQ1(numeros) {
  return calcularQuartil(numeros, 0.25)
}

export function calcularQ2(numeros) {
  return calcularQuartil(numeros, 0.5)
}

export function calcularQ3(numeros) {
  return calcularQuartil(numeros, 0.75)
}

export function calcularIQR(numeros) {
  return calcularQ3(numeros) - calcularQ1(numeros)
}
