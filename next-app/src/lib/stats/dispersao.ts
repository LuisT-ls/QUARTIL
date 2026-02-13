import { calcularMedia } from "./media";

export function calcularVariancia(
  array: number[],
  media: number | null = null
): number {
  if (!array?.length) return 0;
  const m = media ?? calcularMedia(array);
  const soma = array.reduce((sum, val) => sum + (val - m) ** 2, 0);
  return soma / array.length;
}

export function calcularDesvioPadrao(
  array: number[],
  media: number | null = null
): number {
  return Math.sqrt(calcularVariancia(array, media));
}

export function calcularCV(
  array: number[],
  media: number | null = null,
  desvioPadrao: number | null = null
): number {
  if (!array?.length) return 0;
  const m = media ?? calcularMedia(array);
  const dp = desvioPadrao ?? calcularDesvioPadrao(array, m);
  return (dp / m) * 100;
}

export function calcularAssimetria(
  array: number[],
  media: number | null = null,
  desvioPadrao: number | null = null
): number {
  if (!array?.length) return 0;
  const m = media ?? calcularMedia(array);
  const dp = desvioPadrao ?? calcularDesvioPadrao(array, m);
  if (dp === 0) return 0;
  const n = array.length;
  const soma = array.reduce(
    (sum, val) => sum + ((val - m) / dp) ** 3,
    0
  );
  return (n / ((n - 1) * (n - 2))) * soma;
}

export function calcularCurtose(
  array: number[],
  media: number | null = null,
  desvioPadrao: number | null = null
): number {
  if (!array?.length) return 0;
  const m = media ?? calcularMedia(array);
  const dp = desvioPadrao ?? calcularDesvioPadrao(array, m);
  if (dp === 0) return 0;
  const n = array.length;
  if (n <= 3) return 0;
  const soma = array.reduce(
    (sum, val) => sum + ((val - m) / dp) ** 4,
    0
  );
  const curtose =
    ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * soma;
  return curtose - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
}
