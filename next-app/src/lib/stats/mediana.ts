export function calcularMediana(array: number[]): number {
  if (!array?.length) return 0;
  const ordenado = [...array].sort((a, b) => a - b);
  const meio = Math.floor(ordenado.length / 2);
  if (ordenado.length % 2 === 0) {
    return (ordenado[meio - 1] + ordenado[meio]) / 2;
  }
  return ordenado[meio];
}
