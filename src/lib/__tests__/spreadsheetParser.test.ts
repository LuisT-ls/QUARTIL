import { describe, expect, it } from "vitest";
import {
  analyzeSpreadsheetRows,
  columnLabel,
  detectHeaderRow,
  parseSpreadsheetCell,
} from "../spreadsheetParser";

describe("spreadsheetParser", () => {
  it("gera rótulos de coluna no padrão de planilhas", () => {
    expect(columnLabel(0)).toBe("A");
    expect(columnLabel(25)).toBe("Z");
    expect(columnLabel(26)).toBe("AA");
  });

  it("aceita números e decimais com vírgula em uma célula", () => {
    expect(parseSpreadsheetCell(10)).toBe(10);
    expect(parseSpreadsheetCell("1,5")).toBe(1.5);
    expect(parseSpreadsheetCell("texto")).toBeNull();
  });

  it("detecta cabeçalho e resume valores inválidos ou vazios", () => {
    const rows = [
      ["Nota", "Turma"],
      ["8,5", "A"],
      ["", "B"],
      ["inválido", "C"],
    ];

    expect(detectHeaderRow(rows)).toBe(true);
    const analysis = analyzeSpreadsheetRows(rows, true);

    expect(analysis.totalRows).toBe(3);
    expect(analysis.columns[0]).toMatchObject({
      label: "Nota",
      values: [8.5],
      emptyCount: 1,
      invalidCount: 1,
    });
  });
});
