export type QuartileMethod = "interpolated" | "median-halves";
export type VarianceMethod = "population" | "sample";
export type InvalidDataPolicy = "ignore" | "block";
export type OutlierPolicy = "flag" | "exclude";

export interface StatisticsSettings {
  quartileMethod: QuartileMethod;
  varianceMethod: VarianceMethod;
  invalidDataPolicy: InvalidDataPolicy;
  outlierPolicy: OutlierPolicy;
}

export const DEFAULT_STATISTICS_SETTINGS: StatisticsSettings = {
  quartileMethod: "interpolated",
  varianceMethod: "population",
  invalidDataPolicy: "ignore",
  outlierPolicy: "flag",
};

export function normalizeStatisticsSettings(value: unknown): StatisticsSettings {
  if (!value || typeof value !== "object") return { ...DEFAULT_STATISTICS_SETTINGS };

  const candidate = value as Partial<StatisticsSettings>;
  return {
    quartileMethod: candidate.quartileMethod === "median-halves" ? "median-halves" : "interpolated",
    varianceMethod: candidate.varianceMethod === "sample" ? "sample" : "population",
    invalidDataPolicy: candidate.invalidDataPolicy === "block" ? "block" : "ignore",
    outlierPolicy: candidate.outlierPolicy === "exclude" ? "exclude" : "flag",
  };
}

export function describeStatisticsSettings(settings: StatisticsSettings): string {
  const quartiles = settings.quartileMethod === "interpolated"
    ? "quartis interpolados (n − 1) × p"
    : "quartis pela mediana das metades";
  const variance = settings.varianceMethod === "population" ? "variância populacional" : "variância amostral";
  const outliers = settings.outlierPolicy === "flag" ? "outliers sinalizados" : "outliers excluídos das métricas";
  return `${quartiles}, ${variance}; ${outliers}.`;
}
