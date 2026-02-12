"use client";

import { Table, Eraser } from "lucide-react";

export function TabelaFrequenciaSection() {
  return (
    <section className="mb-12" aria-labelledby="tabela-frequencia-title">
      <h2 id="tabela-frequencia-title" className="mb-4 text-2xl font-semibold">
        Tabela de Frequência
      </h2>
      <div className="mb-4">
        <label
          htmlFor="tabelaFrequenciaInput"
          className="mb-2 block text-sm font-medium"
        >
          Insira os números separados por vírgula:
        </label>
        <input
          type="text"
          id="tabelaFrequenciaInput"
          placeholder="Ex: 1, 2, 3, 4, 5"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-[#4361ee] focus:outline-none focus:ring-2 focus:ring-[#4361ee]/30"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white transition-colors hover:bg-[#3a0ca3]"
          aria-label="Calcular Tabela de Frequência"
        >
          <Table className="h-4 w-4" aria-hidden />
          Calcular Tabela de Frequência
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 transition-colors hover:bg-neutral-50"
          aria-label="Limpar"
        >
          <Eraser className="h-4 w-4" aria-hidden />
          Limpar
        </button>
      </div>
      <div id="tabelaFrequenciaResult" className="mt-4" />
    </section>
  );
}
