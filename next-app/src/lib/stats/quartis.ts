import { calcularMediana } from "./mediana";

export function calcularQuartil(array: number[], percentil: number): number {
  if (!array?.length) return 0;
  const ordenado = [...array].sort((a, b) => a - b);
  const posicao = percentil * (ordenado.length - 1);
  const base = Math.floor(posicao);
  const resto = posicao - base;

  if (ordenado[base + 1] !== undefined) {
    return ordenado[base]! + resto * (ordenado[base + 1]! - ordenado[base]!);
  }
  return ordenado[base] ?? 0;
}

export interface OutliersResult {
  inferior: number[];
  superior: number[];
  limiteInferior: number;
  limiteSuperior: number;
}

export function calcularOutliers(array: number[]): OutliersResult {
  if (!array?.length) {
    return { inferior: [], superior: [], limiteInferior: 0, limiteSuperior: 0 };
  }
  const q1 = calcularQuartil(array, 0.25);
  const q3 = calcularQuartil(array, 0.75);
  const iqr = q3 - q1;
  const limiteInferior = q1 - 1.5 * iqr;
  const limiteSuperior = q3 + 1.5 * iqr;

  return {
    inferior: array.filter((v) => v < limiteInferior),
    superior: array.filter((v) => v > limiteSuperior),
    limiteInferior,
    limiteSuperior,
  };
}
