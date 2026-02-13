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
      <section className="mb-12" aria-labelledby="input-section-title">
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-[#4361ee] focus:outline-none focus:ring-2 focus:ring-[#4361ee]/30 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
            aria-label="Campo de entrada de dados numéricos"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white transition-colors hover:bg-[#3a0ca3]"
            aria-label="Calcular"
          >
            <Calculator className="h-4 w-4" aria-hidden />
            Calcular
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Limpar"
          >
            <Eraser className="h-4 w-4" aria-hidden />
            Limpar
          </button>
          <button
            type="button"
            onClick={handleExportClick}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
            aria-label="Exportar"
          >
            <Download className="h-4 w-4" aria-hidden />
            Exportar
          </button>
          <button
            type="button"
            onClick={() => setShowRandomPopup(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600"
            aria-label="Gerar Dados"
          >
            <Dices className="h-4 w-4" aria-hidden />
            Gerar Dados
          </button>
        </div>

        {rolResult && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-2 font-semibold">Rol Ordenado</h3>
            <p className="mb-2 text-sm">{rolResult.rol.join(" - ")}</p>
            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
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
