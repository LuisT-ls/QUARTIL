"use client";

import { useMemo, useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
import { useDialogAccessibility } from "@/hooks/useDialogAccessibility";
import {
  analyzeSpreadsheetRows,
  detectHeaderRow,
  formatSpreadsheetCell,
  type SpreadsheetCell,
} from "@/lib/spreadsheetParser";

export interface ImportedData {
  values: number[];
  fileName: string;
  columnLabel: string;
}

interface ImportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: ImportedData) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function ImportPopup({ isOpen, onClose, onImport }: ImportPopupProps) {
  const [rawRows, setRawRows] = useState<SpreadsheetCell[][]>([]);
  const [fileName, setFileName] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [hasHeader, setHasHeader] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(
    () => (rawRows.length > 0 ? analyzeSpreadsheetRows(rawRows, hasHeader) : null),
    [hasHeader, rawRows]
  );

  const effectiveColumn = selectedColumn ?? analysis?.columns.find((column) => column.values.length > 0)?.index ?? null;
  const selectedSummary = effectiveColumn === null
    ? null
    : analysis?.columns.find((column) => column.index === effectiveColumn) ?? null;

  const reset = () => {
    setRawRows([]);
    setFileName("");
    setSheetName("");
    setHasHeader(false);
    setSelectedColumn(null);
    setIsLoading(false);
    setErrorMessage("");
  };

  const handleClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  useDialogAccessibility(isOpen, handleClose, dialogRef);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setErrorMessage("");

    if (!/\.(csv|xlsx)$/i.test(file.name)) {
      setErrorMessage("Selecione um arquivo CSV ou XLSX.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("O arquivo deve ter no máximo 10 MB.");
      return;
    }

    setIsLoading(true);

    try {
      const { read, utils } = await import("xlsx");
      const workbook = read(await file.arrayBuffer(), { type: "array", cellDates: false });
      const firstSheet = workbook.SheetNames[0];

      if (!firstSheet) {
        throw new Error("O arquivo não contém planilhas.");
      }

      const worksheet = workbook.Sheets[firstSheet];
      const rows = utils.sheet_to_json<SpreadsheetCell[]>(worksheet, {
        header: 1,
        raw: true,
        defval: null,
      });

      if (rows.length === 0) {
        throw new Error("A planilha está vazia.");
      }

      const detectedHeader = detectHeaderRow(rows);
      setRawRows(rows);
      setFileName(file.name);
      setSheetName(firstSheet);
      setHasHeader(detectedHeader);
      setSelectedColumn(null);
    } catch {
      setRawRows([]);
      setFileName("");
      setSheetName("");
      setErrorMessage("Não foi possível ler o arquivo. Verifique o formato e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (!selectedSummary || selectedSummary.values.length === 0) {
      toast.error("Selecione uma coluna com valores numéricos válidos.");
      return;
    }

    onImport({
      values: selectedSummary.values,
      fileName,
      columnLabel: selectedSummary.label,
    });
    reset();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1060] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 text-slate-900 shadow-xl dark:bg-neutral-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-popup-title"
        aria-describedby="import-popup-description"
        tabIndex={-1}
      >
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoading}
          className="absolute right-2 top-2 rounded p-2 text-2xl leading-none text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-700"
          aria-label="Fechar"
        >
          &times;
        </button>

        <div className="mb-5 flex items-start gap-3 pr-8">
          <FileSpreadsheet className="mt-1 h-6 w-6 text-emerald-500" aria-hidden />
          <div>
            <h3 id="import-popup-title" className="text-xl font-semibold">
              Importar dados
            </h3>
            <p id="import-popup-description" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Carregue um CSV ou XLSX, escolha a coluna numérica e revise os valores antes de calcular.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 font-medium text-white transition-all hover:from-emerald-400 hover:to-emerald-500 disabled:cursor-wait disabled:opacity-60"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {isLoading ? "Lendo arquivo..." : "Selecionar arquivo"}
        </button>

        {errorMessage && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300" role="alert">
            {errorMessage}
          </p>
        )}

        {analysis && (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-white/10 bg-slate-100/70 p-3 text-sm dark:bg-white/5">
              <p className="font-medium">{fileName}</p>
              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Planilha: {sheetName} · {analysis.totalRows} linha(s) de dados
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasHeader}
                onChange={(event) => setHasHeader(event.target.checked)}
                className="h-4 w-4 accent-blue-500"
              />
              A primeira linha é cabeçalho
            </label>

            <div>
              <label htmlFor="import-column" className="mb-1 block text-sm font-medium">
                Coluna para importar
              </label>
              <select
                id="import-column"
                value={effectiveColumn ?? ""}
                onChange={(event) => setSelectedColumn(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-white/15 dark:bg-slate-800 dark:text-slate-100"
              >
                {analysis.columns.map((column) => (
                  <option key={column.index} value={column.index}>
                    {column.label} — {column.values.length} número(s)
                  </option>
                ))}
              </select>
            </div>

            {selectedSummary && (
              <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-3 text-sm">
                <p>
                  <strong>{selectedSummary.values.length}</strong> número(s) válido(s), {selectedSummary.emptyCount} célula(s) vazia(s) e {selectedSummary.invalidCount} inválida(s).
                </p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Células vazias e inválidas serão ignoradas na importação.
                </p>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full min-w-[360px] text-left text-sm">
                <caption className="sr-only">Pré-visualização da coluna selecionada</caption>
                <thead className="bg-slate-100 dark:bg-white/5">
                  <tr>
                    <th className="px-3 py-2 font-medium">Linha</th>
                    <th className="px-3 py-2 font-medium">{selectedSummary?.label ?? "Valor"}</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.previewRows.map((row, index) => (
                    <tr key={index} className="border-t border-white/10">
                      <td className="px-3 py-2 text-slate-500">{hasHeader ? index + 2 : index + 1}</td>
                      <td className="px-3 py-2">{formatSpreadsheetCell(row[effectiveColumn ?? 0]) || "(vazio)"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={!selectedSummary || selectedSummary.values.length === 0 || isLoading}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 font-medium text-white transition-all hover:from-blue-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Carregar na calculadora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
