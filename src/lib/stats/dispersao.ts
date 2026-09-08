import { calcularMedia } from "./media";
import type { VarianceMethod } from "../statisticsSettings";

export function calcularVariancia(
  array: number[],
  media: number | null = null,
  method: VarianceMethod = "population"
): number {
  if (!array?.length) return 0;
  if (method === "sample" && array.length < 2) return 0;
  const m = media ?? calcularMedia(array);
  const soma = array.reduce((sum, val) => sum + (val - m) ** 2, 0);
  return soma / (method === "sample" ? array.length - 1 : array.length);
}

export function calcularDesvioPadrao(
  array: number[],
  media: number | null = null,
  method: VarianceMethod = "population"
): number {
  return Math.sqrt(calcularVariancia(array, media, method));
}

export function calcularCV(
  array: number[],
  media: number | null = null,
  desvioPadrao: number | null = null,
  method: VarianceMethod = "population"
): number {
  if (!array?.length) return 0;
  const m = media ?? calcularMedia(array);
  const dp = desvioPadrao ?? calcularDesvioPadrao(array, m, method);
  if (m === 0) return 0;
  return (dp / m) * 100;
}

export function calcularAssimetria(
  array: number[],
  media: number | null = null
): number {
  const n = array?.length || 0;
  if (n <= 2) return 0;
  const m = media ?? calcularMedia(array);

  const somaQuad = array.reduce((sum, val) => sum + (val - m) ** 2, 0);
  const s = Math.sqrt(somaQuad / (n - 1));

  if (s === 0) return 0;

  const soma = array.reduce(
    (sum, val) => sum + ((val - m) / s) ** 3,
    0
  );
  return (n / ((n - 1) * (n - 2))) * soma;
}

export function calcularCurtose(
  array: number[],
  media: number | null = null
): number {
  const n = array?.length || 0;
  if (n <= 3) return 0;
  const m = media ?? calcularMedia(array);

  const somaQuad = array.reduce((sum, val) => sum + (val - m) ** 2, 0);
  const s = Math.sqrt(somaQuad / (n - 1));

  if (s === 0) return 0;

  const soma = array.reduce(
    (sum, val) => sum + ((val - m) / s) ** 4,
    0
  );
  const curtose =
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * soma;
  return curtose - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
}
