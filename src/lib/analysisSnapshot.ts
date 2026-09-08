import {
  calcularDesvioPadrao,
  calcularMediana,
  calcularMedia,
  calcularModa,
  calcularOutliers,
  calcularQuartil,
  calcularVariancia,
} from "@/lib/stats";
import {
  DEFAULT_STATISTICS_SETTINGS,
  normalizeStatisticsSettings,
  type StatisticsSettings,
} from "@/lib/statisticsSettings";

export const REPORT_ROUTE = "/relatorio";
export const MAX_SHARED_VALUES = 2000;
const MAX_TOKEN_LENGTH = 18000;

export interface AnalysisMethodology {
  quartiles: string;
  variance: string;
  outliers: string;
  invalidData: string;
}

export interface AnalysisSnapshot {
  version: 1;
  values: number[];
  generatedAt: string;
  methodology: AnalysisMethodology;
  settings: StatisticsSettings;
}

export interface AnalysisSnapshotMetrics {
  count: number;
  sum: number;
  minimum: number;
  maximum: number;
  range: number;
  mean: number;
  median: number;
  mode: string;
  variance: number;
  standardDeviation: number;
  coefficientOfVariation: number | null;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  outlierCount: number;
  lowerOutliers: number[];
  upperOutliers: number[];
  lowerLimit: number;
  upperLimit: number;
  excludedOutlierCount: number;
}

export function createAnalysisSnapshot(
  values: number[],
  settings: StatisticsSettings = DEFAULT_STATISTICS_SETTINGS
): AnalysisSnapshot {
  const sortedValues = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  const normalizedSettings = normalizeStatisticsSettings(settings);

  return {
    version: 1,
    values: sortedValues,
    generatedAt: new Date().toISOString(),
    settings: normalizedSettings,
    methodology: {
      quartiles: normalizedSettings.quartileMethod === "interpolated"
        ? "Percentis interpolados pela posição (n − 1) × p."
        : "Mediana das metades (método de Tukey).",
      variance: normalizedSettings.varianceMethod === "population"
        ? "Variância populacional: soma dos desvios ao quadrado dividida por n."
        : "Variância amostral: soma dos desvios ao quadrado dividida por n − 1.",
      outliers: normalizedSettings.outlierPolicy === "exclude"
        ? "Outliers identificados pelo IQR e excluídos das métricas; os valores originais permanecem no relatório."
        : "Limites definidos por Q1 − 1,5 × IQR e outliers apenas sinalizados.",
      invalidData: "O relatório contém somente valores numéricos válidos presentes no link.",
    },
  };
}

export function calculateSnapshotMetrics(snapshot: AnalysisSnapshot): AnalysisSnapshotMetrics {
  const settings = normalizeStatisticsSettings(snapshot.settings);
  const detectedOutliers = calcularOutliers(snapshot.values, settings.quartileMethod);
  const values = settings.outlierPolicy === "exclude"
    ? snapshot.values.filter((value) => value >= detectedOutliers.limiteInferior && value <= detectedOutliers.limiteSuperior)
    : snapshot.values;
  const mean = calcularMedia(values);
  const standardDeviation = calcularDesvioPadrao(values, undefined, settings.varianceMethod);
  const q1 = calcularQuartil(values, 0.25, settings.quartileMethod);
  const q2 = calcularMediana(values);
  const q3 = calcularQuartil(values, 0.75, settings.quartileMethod);
  const outliers = calcularOutliers(values, settings.quartileMethod);
  const mode = calcularModa(values);
  const modeLabel = typeof mode === "object"
    ? Array.isArray(mode) ? mode.join(", ") : String(mode)
    : String(mode);

  return {
    count: values.length,
    sum: values.reduce((total, value) => total + value, 0),
    minimum: values[0] ?? 0,
    maximum: values[values.length - 1] ?? 0,
    range: (values[values.length - 1] ?? 0) - (values[0] ?? 0),
    mean,
    median: q2,
    mode: modeLabel,
    variance: calcularVariancia(values, mean, settings.varianceMethod),
    standardDeviation,
    coefficientOfVariation: mean === 0 ? null : (standardDeviation / mean) * 100,
    q1,
    q2,
    q3,
    iqr: q3 - q1,
    outlierCount: outliers.inferior.length + outliers.superior.length,
    lowerOutliers: outliers.inferior,
    upperOutliers: outliers.superior,
    lowerLimit: outliers.limiteInferior,
    upperLimit: outliers.limiteSuperior,
    excludedOutlierCount: snapshot.values.length - values.length,
  };
}

function encodeToken(value: string): string {
  return btoa(encodeURIComponent(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeToken(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return decodeURIComponent(atob(padded));
}

export function serializeAnalysisSnapshot(snapshot: AnalysisSnapshot): string {
  const token = encodeToken(JSON.stringify(snapshot));
  if (token.length > MAX_TOKEN_LENGTH) {
    throw new Error("A análise é grande demais para um link compartilhável.");
  }
  return token;
}

export function deserializeAnalysisSnapshot(token: string): AnalysisSnapshot | null {
  if (!token || token.length > MAX_TOKEN_LENGTH) return null;

  try {
    const parsed: unknown = JSON.parse(decodeToken(token));
    if (!parsed || typeof parsed !== "object") return null;

    const snapshot = parsed as Partial<AnalysisSnapshot>;
    if (
      snapshot.version !== 1 ||
      !Array.isArray(snapshot.values) ||
      snapshot.values.length === 0 ||
      snapshot.values.length > MAX_SHARED_VALUES ||
      !snapshot.values.every((value) => typeof value === "number" && Number.isFinite(value)) ||
      typeof snapshot.generatedAt !== "string" ||
      !snapshot.methodology ||
      typeof snapshot.methodology !== "object"
    ) {
      return null;
    }

    return {
      version: 1,
      values: [...snapshot.values].sort((a, b) => a - b),
      generatedAt: snapshot.generatedAt,
      methodology: snapshot.methodology as AnalysisMethodology,
      settings: normalizeStatisticsSettings(snapshot.settings),
    };
  } catch {
    return null;
  }
}

export function createReportShareUrl(
  values: number[],
  settings: StatisticsSettings = DEFAULT_STATISTICS_SETTINGS
): string {
  if (typeof window === "undefined") {
    throw new Error("Links compartilháveis só podem ser criados no navegador.");
  }
  if (values.length === 0) {
    throw new Error("Não há dados para compartilhar.");
  }
  if (values.length > MAX_SHARED_VALUES) {
    throw new Error(`Compartilhamento limitado a ${MAX_SHARED_VALUES} valores. Use a exportação para conjuntos maiores.`);
  }

  const snapshot = createAnalysisSnapshot(values, settings);
  return `${window.location.origin}${REPORT_ROUTE}?data=${serializeAnalysisSnapshot(snapshot)}`;
}
