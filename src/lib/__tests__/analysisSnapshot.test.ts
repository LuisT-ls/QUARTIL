import { describe, expect, it } from "vitest";
import {
  calculateSnapshotMetrics,
  createAnalysisSnapshot,
  deserializeAnalysisSnapshot,
  serializeAnalysisSnapshot,
} from "../analysisSnapshot";

describe("analysisSnapshot", () => {
  it("mantém os dados e a metodologia em um token reproduzível", () => {
    const snapshot = createAnalysisSnapshot([30, 10, 20]);
    const decoded = deserializeAnalysisSnapshot(serializeAnalysisSnapshot(snapshot));

    expect(decoded?.values).toEqual([10, 20, 30]);
    expect(decoded?.methodology.quartiles).toContain("(n − 1)");
  });

  it("centraliza as métricas principais da análise", () => {
    const metrics = calculateSnapshotMetrics(createAnalysisSnapshot([1, 2, 3, 4, 100]));

    expect(metrics.count).toBe(5);
    expect(metrics.mean).toBe(22);
    expect(metrics.q1).toBe(2);
    expect(metrics.q3).toBe(4);
    expect(metrics.outlierCount).toBe(1);
    expect(metrics.upperOutliers).toEqual([100]);
  });

  it("preserva a metodologia escolhida no relatório compartilhado", () => {
    const snapshot = createAnalysisSnapshot([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 100], {
      quartileMethod: "median-halves",
      varianceMethod: "sample",
      invalidDataPolicy: "block",
      outlierPolicy: "exclude",
    });
    const metrics = calculateSnapshotMetrics(snapshot);

    expect(snapshot.settings.varianceMethod).toBe("sample");
    expect(snapshot.methodology.quartiles).toContain("Tukey");
    expect(metrics.excludedOutlierCount).toBe(1);
    expect(metrics.count).toBe(12);
  });

  it("rejeita tokens inválidos", () => {
    expect(deserializeAnalysisSnapshot("token-invalido")).toBeNull();
  });
});
