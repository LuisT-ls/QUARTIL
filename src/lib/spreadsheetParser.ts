import { parseNumberInput } from "@/lib/numberParser";

export type SpreadsheetCell = unknown;

export interface SpreadsheetColumnSummary {
  index: number;
  label: string;
  values: number[];
  emptyCount: number;
  invalidCount: number;
}

export interface SpreadsheetAnalysis {
  dataRows: SpreadsheetCell[][];
  previewRows: SpreadsheetCell[][];
  columns: SpreadsheetColumnSummary[];
  totalRows: number;
}

const DECIMAL_COMMA_CELL_PATTERN = /^[+-]?\d+,\d+$/;

export function columnLabel(index: number): string {
  let value = index + 1;
  let label = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / 26);
  }

  return label;
}

export function parseSpreadsheetCell(cell: SpreadsheetCell): number | null {
  if (typeof cell === "number") {
    return Number.isFinite(cell) ? cell : null;
  }

  if (typeof cell !== "string") return null;

  const text = cell.trim();
  if (!text) return null;

  const normalized = DECIMAL_COMMA_CELL_PATTERN.test(text)
    ? text.replace(",", ".")
    : text;
  const parsed = parseNumberInput(normalized);

  if (parsed.values.length !== 1 || parsed.invalidTokens.length > 0) {
    return null;
  }

  return parsed.values[0] ?? null;
}

export function isEmptySpreadsheetCell(cell: SpreadsheetCell): boolean {
  return cell === null || cell === undefined || (typeof cell === "string" && cell.trim() === "");
}

export function detectHeaderRow(rows: SpreadsheetCell[][]): boolean {
  const firstRow = rows[0];
  if (!firstRow || firstRow.length === 0) return false;

  const firstRowHasText = firstRow.some(
    (cell) => typeof cell === "string" && cell.trim() !== "" && parseSpreadsheetCell(cell) === null
  );
  const dataHasNumber = rows
    .slice(1)
    .some((row) => row.some((cell) => parseSpreadsheetCell(cell) !== null));

  return firstRowHasText && dataHasNumber;
}

export function analyzeSpreadsheetRows(
  rows: SpreadsheetCell[][],
  hasHeader: boolean
): SpreadsheetAnalysis {
  const normalizedRows = rows.map((row) => (Array.isArray(row) ? row : []));
  const headerRow = hasHeader ? normalizedRows[0] ?? [] : [];
  const dataRows = hasHeader ? normalizedRows.slice(1) : normalizedRows;
  const columnCount = normalizedRows.reduce((max, row) => Math.max(max, row.length), 0);

  const columns = Array.from({ length: columnCount }, (_, index) => {
    const values: number[] = [];
    let emptyCount = 0;
    let invalidCount = 0;

    dataRows.forEach((row) => {
      const cell = row[index];

      if (isEmptySpreadsheetCell(cell)) {
        emptyCount += 1;
        return;
      }

      const value = parseSpreadsheetCell(cell);
      if (value === null) {
        invalidCount += 1;
      } else {
        values.push(value);
      }
    });

    const headerLabel = typeof headerRow[index] === "string" ? headerRow[index]?.trim() : "";

    return {
      index,
      label: headerLabel || `Coluna ${columnLabel(index)}`,
      values,
      emptyCount,
      invalidCount,
    };
  });

  return {
    dataRows,
    previewRows: dataRows.slice(0, 8),
    columns,
    totalRows: dataRows.length,
  };
}

export function formatSpreadsheetCell(cell: SpreadsheetCell): string {
  if (cell === null || cell === undefined) return "";
  if (cell instanceof Date) return cell.toLocaleDateString("pt-BR");
  return String(cell);
}
