"use client";

import { useState } from "react";
import { Calculator, Eraser, Download, Dices } from "lucide-react";

export function CalculatorSection() {
  const [inputValue, setInputValue] = useState("");

  return (
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
          placeholder="Ex: 10, 20, 30 ou 10 20 30"
          className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-[#4361ee] focus:outline-none focus:ring-2 focus:ring-[#4361ee]/30"
          aria-label="Campo de entrada de dados numéricos"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white transition-colors hover:bg-[#3a0ca3]"
          aria-label="Calcular"
        >
          <Calculator className="h-4 w-4" aria-hidden />
          Calcular
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50"
          aria-label="Limpar"
        >
          <Eraser className="h-4 w-4" aria-hidden />
          Limpar
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
          aria-label="Exportar"
        >
          <Download className="h-4 w-4" aria-hidden />
          Exportar
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-white transition-colors hover:bg-sky-600"
          aria-label="Gerar Dados"
        >
          <Dices className="h-4 w-4" aria-hidden />
          Gerar Dados
        </button>
      </div>
      <div id="rolResult" className="mt-4" />
    </section>
  );
}
