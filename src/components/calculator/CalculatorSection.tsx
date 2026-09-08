"use client";

import { useState, useCallback, type MouseEvent } from "react";
import {
  Calculator,
  ChevronDown,
  Dices,
  Download,
  Eraser,
  FileUp,
  Lightbulb,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { useCalculator } from "@/context/CalculatorContext";
import { NumberInputChips } from "@/components/ui/NumberInputChips";
import { RandomPopup } from "./RandomPopup";
import { ExportPopup } from "./ExportPopup";
import { ImportPopup, type ImportedData } from "./ImportPopup";
import { trackEvent } from "@/lib/analytics";
import { createReportShareUrl } from "@/lib/analysisSnapshot";
import { StatisticsSettingsPanel } from "./StatisticsSettingsPanel";

const EXAMPLE_DATA = [5, 8, 10, 12, 15, 18, 20, 22, 25, 30];

const closeActionMenu = (event: MouseEvent<HTMLButtonElement>) => {
  event.currentTarget.closest("details")?.removeAttribute("open");
};

export function CalculatorSection() {
  const [showRandomPopup, setShowRandomPopup] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);

  const {
    inputData,
    clearAll,
    setInputData,
    calculateData,
    currentData,
    isCalculated,
    isDirty,
    calculationTimeMs,
    statisticsSettings,
  } = useCalculator();

  const handleCalculate = useCallback(() => {
    if (inputData.length === 0) {
      toast.error("Por favor, insira alguns números.");
      return;
    }
    trackEvent("calculate_data", {
      count: inputData.length,
      source: "manual",
    });
    calculateData(inputData);
  }, [calculateData, inputData]);

  const handleClear = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleRandomGenerate = useCallback(
    (numbers: number[]) => {
      setInputData(numbers);
      calculateData(numbers);
    },
    [calculateData, setInputData]
  );

  const handleExample = useCallback(() => {
    setInputData(EXAMPLE_DATA);
    calculateData(EXAMPLE_DATA);
    trackEvent("calculate_data", {
      count: EXAMPLE_DATA.length,
      source: "example",
    });
  }, [calculateData, setInputData]);

  const handleExportClick = () => {
    if (isCalculated && currentData.length > 0) {
      setShowExportPopup(true);
    } else {
      toast.warning("Por favor, calcule os dados primeiro.");
    }
  };

  const handleShareReport = useCallback(async () => {
    if (!isCalculated || currentData.length === 0) {
      toast.warning("Por favor, calcule os dados primeiro.");
      return;
    }

    try {
      const url = createReportShareUrl(currentData, statisticsSettings);
      if (navigator.share) {
        await navigator.share({
          title: "Relatório de análise estatística",
          text: "Confira este relatório estatístico.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link do relatório copiado. Ele contém os valores da análise.");
      }
      trackEvent("share_report", { count: currentData.length });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error(error instanceof Error ? error.message : "Não foi possível compartilhar o relatório.");
    }
  }, [currentData, isCalculated, statisticsSettings]);

  const handleImportedData = useCallback(
    ({ values, fileName }: ImportedData) => {
      setInputData(values);
      calculateData(values);
      trackEvent("import_data", {
        count: values.length,
        format: fileName.toLowerCase().endsWith(".xlsx") ? "xlsx" : "csv",
      });
      setShowImportPopup(false);
      toast.success(`${values.length} número(s) importado(s) com sucesso.`);
    },
    [calculateData, setInputData]
  );

  return (
    <>
      <section id="entrada-dados" className="py-6" aria-labelledby="input-section-title" suppressHydrationWarning>
        <h2 id="input-section-title" className="sr-only">
          Entrada de Dados
        </h2>
        <div className="mb-4">
          <NumberInputChips
            values={inputData}
            onChange={setInputData}
            onCalculate={handleCalculate}
            placeholder="Ex: 10, 20, 30... (decimais: 1,5; 2,75)"
          />
          <p className="mt-2 text-xs text-slate-500">
            Cole uma coluna do Excel, importe um CSV/XLSX ou use <strong className="text-slate-400">Usar exemplo</strong> para experimentar.
          </p>
        </div>
        {isDirty && (
          <p className="mb-4 text-sm text-amber-300" role="status">
            Os dados foram alterados. Clique em <strong>Calcular</strong> para atualizar os resultados.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            aria-label="Calcular"
          >
            <Calculator className="h-4 w-4" aria-hidden />
            Calcular
          </button>
          <button
            type="button"
            onClick={() => setShowImportPopup(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 hover:from-teal-400 hover:to-emerald-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
            aria-label="Importar arquivo"
          >
            <FileUp className="h-4 w-4" aria-hidden />
            Importar arquivo
          </button>
          <button
            type="button"
            onClick={handleExample}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 font-medium text-slate-200 transition-all duration-300 hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white"
            aria-label="Testar com dados de exemplo"
          >
            <Lightbulb className="h-4 w-4 text-amber-300" aria-hidden />
            Usar exemplo
          </button>
          <details className="group relative">
            <summary className="inline-flex min-h-[42px] cursor-pointer list-none items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 font-medium text-slate-200 transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:text-white [&::-webkit-details-marker]:hidden">
              <MoreHorizontal className="h-4 w-4" aria-hidden />
              Mais ações
              <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" aria-hidden />
            </summary>
            <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-white/10 bg-slate-900/95 p-2 shadow-xl shadow-slate-950/40 backdrop-blur-xl">
              <button
                type="button"
                onClick={(event) => {
                  closeActionMenu(event);
                  handleClear();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Limpar"
              >
                <Eraser className="h-4 w-4 text-amber-300" aria-hidden />
                Limpar
              </button>
              <button
                type="button"
                onClick={(event) => {
                  closeActionMenu(event);
                  handleExportClick();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Exportar"
              >
                <Download className="h-4 w-4 text-emerald-300" aria-hidden />
                Exportar
              </button>
              <button
                type="button"
                onClick={(event) => {
                  closeActionMenu(event);
                  void handleShareReport();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Compartilhar relatório"
              >
                <Share2 className="h-4 w-4 text-blue-300" aria-hidden />
                Compartilhar
              </button>
              <button
                type="button"
                onClick={(event) => {
                  closeActionMenu(event);
                  setShowRandomPopup(true);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Gerar Dados"
              >
                <Dices className="h-4 w-4 text-cyan-300" aria-hidden />
                Gerar dados
              </button>
            </div>
          </details>
        </div>

        {isCalculated && currentData.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <h3 className="mb-2 font-semibold text-slate-100">Rol Ordenado</h3>
            <p className="mb-2 text-sm text-slate-300">{currentData.join(" - ")}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span>
                <strong>n =</strong> {currentData.length}
              </span>
              <span>
                <strong>Mínimo:</strong> {Math.min(...currentData)}
              </span>
              <span>
                <strong>Máximo:</strong> {Math.max(...currentData)}
              </span>
              <span>
                <strong>Amplitude:</strong>{" "}
                {Math.max(...currentData) - Math.min(...currentData)}
              </span>
              <span>
                <strong>Tempo:</strong> {calculationTimeMs?.toFixed(2) ?? "0.00"}ms
              </span>
            </div>
          </div>
        )}
        <StatisticsSettingsPanel />
      </section>

      <RandomPopup
        isOpen={showRandomPopup}
        onClose={() => setShowRandomPopup(false)}
        onGenerate={handleRandomGenerate}
      />
      <ImportPopup
        isOpen={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImport={handleImportedData}
      />
      <ExportPopup
        isOpen={showExportPopup}
        onClose={() => setShowExportPopup(false)}
      />
    </>
  );
}
