export function calcularMedia(array: number[]): number {
  if (!array?.length) return 0;
  return array.reduce((sum, val) => sum + val, 0) / array.length;
}
