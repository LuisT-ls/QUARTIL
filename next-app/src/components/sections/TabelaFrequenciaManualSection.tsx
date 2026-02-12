"use client";

import { Plus, Calculator, Trash2 } from "lucide-react";

export function TabelaFrequenciaManualSection() {
  return (
    <section
      className="mb-12"
      aria-labelledby="tabela-frequencia-manual-title"
    >
      <h2
        id="tabela-frequencia-manual-title"
        className="mb-4 text-2xl font-semibold"
      >
        Tabela de Frequência Manual
      </h2>
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="mb-4 text-neutral-600">
          Configure manualmente a tabela de frequência adicionando os valores
          para cada classe.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white transition-colors hover:bg-[#3a0ca3]"
            aria-label="Adicionar Linha"
          >
            <Plus className="h-4 w-4 sm:inline" aria-hidden />
            <span className="hidden sm:inline">Adicionar Linha</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
            aria-label="Calcular Tabela"
          >
            <Calculator className="h-4 w-4 sm:inline" aria-hidden />
            <span className="hidden sm:inline">Calcular Tabela</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 transition-colors hover:bg-neutral-50"
            aria-label="Limpar Tabela"
          >
            <Trash2 className="h-4 w-4 sm:inline" aria-hidden />
            <span className="hidden sm:inline">Limpar Tabela</span>
          </button>
        </div>
        <div
          id="tabelaFrequenciaManualContainer"
          className="overflow-auto"
        />
        <div id="tabelaFrequenciaManualResult" className="mt-4" />
      </div>
    </section>
  );
}
