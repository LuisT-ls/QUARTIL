export function calcularModa(array: number[]): number | number[] | string {
  if (!array?.length) return 0;
  const contagem: Record<string, number> = {};
  let maxFreq = 0;
  let moda: number[] = [];

  array.forEach((num) => {
    const key = String(num);
    contagem[key] = (contagem[key] ?? 0) + 1;
    if (contagem[key]! > maxFreq) {
      maxFreq = contagem[key]!;
      moda = [num];
    } else if (contagem[key] === maxFreq) {
      moda.push(num);
    }
  });

  if (moda.length === Object.keys(contagem).length) {
    return "Não há moda";
  }

  return moda.length === 1 ? moda[0]! : moda;
}
