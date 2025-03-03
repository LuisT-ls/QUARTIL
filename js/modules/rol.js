// rol.js
export function calcularRol(numeros) {
  if (!Array.isArray(numeros)) {
    throw new Error('Entrada inválida. Esperado um array de números.')
  }
  return numeros.sort((a, b) => a - b)
}
