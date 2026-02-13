"use client";

import { useState, useCallback } from "react";
import { Calculator, Eraser, Download, Dices } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import { RandomPopup } from "./RandomPopup";
import { ExportPopup } from "./ExportPopup";

export function CalculatorSection() {
  const [inputValue, setInputValue] = useState("");
  const [rolResult, setRolResult] = useState<{
    rol: number[];
    tempo: number;
  } | null>(null);
  const [showRandomPopup, setShowRandomPopup] = useState(false);
  const [showExportPopup, setShowExportPopup] = useState(false);

  const {
    processData,
    setCurrentData,
    setIsCalculated,
    clearAll,
    currentData,
    isCalculated,
  } = useCalculator();

  const processWithData = useCallback(
    (numeros: number[]) => {
      const start = performance.now();
      const rol = [...numeros].sort((a, b) => a - b);
      setCurrentData(rol);
      setIsCalculated(true);
      setRolResult({
        rol,
        tempo: performance.now() - start,
      });
    },
    [setCurrentData, setIsCalculated]
  );

  const handleCalculate = useCallback(() => {
    const numeros = processData(inputValue);
    if (!numeros) {
      alert("Por favor, insira alguns números.");
      return;
    }
    processWithData(numeros);
  }, [inputValue, processData, processWithData]);

  const handleClear = useCallback(() => {
    setInputValue("");
    setRolResult(null);
    clearAll();
  }, [clearAll]);

  const handleRandomGenerate = useCallback(
    (numbers: number[]) => {
      setInputValue(numbers.join(", "));
      processWithData(numbers);
    },
    [processWithData]
  );

  const handleExportClick = () => {
    if (isCalculated && currentData.length > 0) {
      setShowExportPopup(true);
    } else {
      alert("Por favor, calcule os dados primeiro.");
    }
  };

  return (
    <>
      <section className="py-6" aria-labelledby="input-section-title">
        <h2 id="input-section-title" className="sr-only">
          Entrada de Dados
        </h2>
        <div className="mb-4">
          <input
            type="text"
            id="rolInput"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            placeholder="Ex: 10, 20, 30 ou 10 20 30"
            className="w-full rounded-lg border border-white/20 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-500 backdrop-blur-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Campo de entrada de dados numéricos"
          />
        </div>
        <div className="flex flex-wrap gap-2">
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
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
            aria-label="Limpar"
          >
            <Eraser className="h-4 w-4" aria-hidden />
            Limpar
          </button>
          <button
            type="button"
            onClick={handleExportClick}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            aria-label="Exportar"
          >
            <Download className="h-4 w-4" aria-hidden />
            Exportar
          </button>
          <button
            type="button"
            onClick={() => setShowRandomPopup(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all duration-300 hover:from-sky-400 hover:to-cyan-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            aria-label="Gerar Dados"
          >
            <Dices className="h-4 w-4" aria-hidden />
            Gerar Dados
          </button>
        </div>

        {rolResult && (
          <div className="mt-4 rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <h3 className="mb-2 font-semibold text-slate-100">Rol Ordenado</h3>
            <p className="mb-2 text-sm text-slate-300">{rolResult.rol.join(" - ")}</p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span>
                <strong>n =</strong> {rolResult.rol.length}
              </span>
              <span>
                <strong>Mínimo:</strong> {Math.min(...rolResult.rol)}
              </span>
              <span>
                <strong>Máximo:</strong> {Math.max(...rolResult.rol)}
              </span>
              <span>
                <strong>Amplitude:</strong>{" "}
                {Math.max(...rolResult.rol) - Math.min(...rolResult.rol)}
              </span>
              <span>
                <strong>Tempo:</strong> {rolResult.tempo.toFixed(2)}ms
              </span>
            </div>
          </div>
        )}
      </section>

      <RandomPopup
        isOpen={showRandomPopup}
        onClose={() => setShowRandomPopup(false)}
        onGenerate={handleRandomGenerate}
      />
      <ExportPopup
        isOpen={showExportPopup}
        onClose={() => setShowExportPopup(false)}
      />
    </>
  );
}
