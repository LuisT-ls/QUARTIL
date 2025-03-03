// tabelaFrequencia.js
export function calcularTabelaFrequencia(numeros) {
  const frequencia = {}
  numeros.forEach(num => {
    frequencia[num] = (frequencia[num] || 0) + 1
  })

  const tabela = Object.keys(frequencia).map(key => ({
    valor: Number(key),
    frequencia: frequencia[key]
  }))

  return tabela.sort((a, b) => a.valor - b.valor)
}
