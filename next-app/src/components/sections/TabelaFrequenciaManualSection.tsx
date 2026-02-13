"use client";

import { useState } from "react";
import { Plus, Calculator, Trash2 } from "lucide-react";
import {
  calcularMedia,
  calcularMediana,
  calcularModa,
} from "@/lib/stats";

interface TableRow {
  limiteInferior: string;
  limiteSuperior: string;
  pontoMedio: string;
  h: string;
  fi: string;
  fri: string;
  friPerc: string;
  Fi: string;
  Fri: string;
}

const emptyRow = (): TableRow => ({
  limiteInferior: "",
  limiteSuperior: "",
  pontoMedio: "",
  h: "",
  fi: "",
  fri: "",
  friPerc: "",
  Fi: "",
  Fri: "",
});

export function TabelaFrequenciaManualSection() {
  const [rows, setRows] = useState<TableRow[]>([emptyRow()]);
  const [result, setResult] = useState<{
    table: TableRow[];
    totalFi: number;
    media: number;
    mediana: number;
    moda: string | number | number[];
  } | null>(null);

  const addRow = () => setRows((r) => [...r, emptyRow()]);

  const updateRow = (index: number, field: keyof TableRow, value: string) => {
    setRows((r) => {
      let next = r.map((row, i) =>
        i === index ? { ...row, [field]: value } : { ...row }
      );
      const li = parseFloat(next[index]!.limiteInferior);
      const ls = parseFloat(next[index]!.limiteSuperior);
      if (field === "limiteInferior" || field === "limiteSuperior") {
        if (!Number.isNaN(li) && !Number.isNaN(ls)) {
          next = next.map((row, i) =>
            i === index
              ? {
                  ...row,
                  pontoMedio: ((li + ls) / 2).toFixed(2),
                  h: (ls - li).toFixed(2),
                }
              : row
          );
        }
      }
      const totalFi = next.reduce((s, row) => s + (parseFloat(row.fi) || 0), 0);
      if (totalFi > 0) {
        let accFi = 0;
        next = next.map((row) => {
          const fi = parseFloat(row.fi) || 0;
          accFi += fi;
          return {
            ...row,
            fri: (fi / totalFi).toFixed(4),
            friPerc: ((fi / totalFi) * 100).toFixed(2),
            Fi: String(accFi),
            Fri: (accFi / totalFi).toFixed(4),
          };
        });
      }
      return next;
    });
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) {
      alert("A tabela deve ter pelo menos uma linha.");
      return;
    }
    setRows((r) => r.filter((_, i) => i !== index));
  };

  const calculate = () => {
    const totalFi = rows.reduce((s, r) => s + (parseFloat(r.fi) || 0), 0);
    if (totalFi === 0) {
      alert("Preencha as frequências (fi) para calcular.");
      return;
    }

    const computed = rows.map((row, i) => {
      const li = parseFloat(row.limiteInferior);
      const ls = parseFloat(row.limiteSuperior);
      const fi = parseFloat(row.fi) || 0;
      const pm = row.pontoMedio ? parseFloat(row.pontoMedio) : (li + ls) / 2;
      const fri = fi / totalFi;
      const friPerc = fri * 100;
      const prevFi = rows
        .slice(0, i)
        .reduce((s, r) => s + (parseFloat(r.fi) || 0), 0);
      const Fi = prevFi + fi;
      const Fri = Fi / totalFi;

      return {
        ...row,
        pontoMedio: pm.toFixed(2),
        h: row.h || (ls - li).toFixed(2),
        fri: fri.toFixed(4),
        friPerc: friPerc.toFixed(2),
        Fi: String(Fi),
        Fri: Fri.toFixed(4),
      };
    });

    const dados = rows.flatMap((row) => {
      const pm = parseFloat(row.pontoMedio || "0");
      const fi = parseInt(row.fi, 10) || 0;
      return Array(fi).fill(pm);
    });

    const media = calcularMedia(dados);
    const mediana = calcularMediana(dados);
    const moda = calcularModa(dados);

    setResult({
      table: computed,
      totalFi,
      media,
      mediana,
      moda: typeof moda === "object" ? (Array.isArray(moda) ? moda.join(", ") : String(moda)) : moda,
    });
  };

  const clear = () => {
    setRows([emptyRow()]);
    setResult(null);
  };

  return (
    <section className="mb-12" aria-labelledby="tabela-frequencia-manual-title">
      <h2 id="tabela-frequencia-manual-title" className="mb-4 text-2xl font-semibold">
        Tabela de Frequência Manual
      </h2>
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <p className="mb-4 text-neutral-600">
          Configure manualmente a tabela adicionando limites das classes e frequências.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white hover:bg-[#3a0ca3]"
          >
            <Plus className="h-4 w-4" /> Adicionar Linha
          </button>
          <button
            type="button"
            onClick={calculate}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            <Calculator className="h-4 w-4" /> Calcular Tabela
          </button>
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            <Trash2 className="h-4 w-4" /> Limpar Tabela
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b bg-neutral-50 dark:bg-neutral-800">
                <th className="p-2 text-left">Classe</th>
                <th className="p-2 text-left">Ponto Médio</th>
                <th className="p-2 text-left">h</th>
                <th className="p-2 text-left">fi</th>
                <th className="p-2 text-left">fri</th>
                <th className="p-2 text-left">fri (%)</th>
                <th className="p-2 text-left">Fi</th>
                <th className="p-2 text-left">Fri</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-1">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="any"
                        value={row.limiteInferior}
                        onChange={(e) => updateRow(i, "limiteInferior", e.target.value)}
                        placeholder="Li"
                        className="w-20 rounded border px-2 py-1 text-sm dark:bg-neutral-800"
                      />
                      <span>⊢</span>
                      <input
                        type="number"
                        step="any"
                        value={row.limiteSuperior}
                        onChange={(e) => updateRow(i, "limiteSuperior", e.target.value)}
                        placeholder="Ls"
                        className="w-20 rounded border px-2 py-1 text-sm dark:bg-neutral-800"
                      />
                    </div>
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="any"
                      value={row.pontoMedio}
                      onChange={(e) => updateRow(i, "pontoMedio", e.target.value)}
                      placeholder="PM"
                      className="w-20 rounded border px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="any"
                      value={row.h}
                      onChange={(e) => updateRow(i, "h", e.target.value)}
                      placeholder="h"
                      className="w-16 rounded border px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      value={row.fi}
                      onChange={(e) => updateRow(i, "fi", e.target.value)}
                      placeholder="fi"
                      className="w-16 rounded border px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="any"
                      value={row.fri}
                      readOnly
                      className="w-20 rounded border bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="any"
                      value={row.friPerc}
                      readOnly
                      className="w-16 rounded border bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      value={row.Fi}
                      readOnly
                      className="w-16 rounded border bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="number"
                      step="any"
                      value={row.Fri}
                      readOnly
                      className="w-16 rounded border bg-neutral-50 px-2 py-1 text-sm dark:bg-neutral-800"
                    />
                  </td>
                  <td className="p-1">
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="rounded bg-red-100 p-1 text-red-600 hover:bg-red-200 dark:bg-red-900/30"
                      aria-label="Remover linha"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Tabela Final</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b bg-neutral-50 dark:bg-neutral-800">
                    <th className="p-2 text-left">Classe</th>
                    <th className="p-2 text-left">PM</th>
                    <th className="p-2 text-left">h</th>
                    <th className="p-2 text-left">fi</th>
                    <th className="p-2 text-left">fri</th>
                    <th className="p-2 text-left">fri (%)</th>
                    <th className="p-2 text-left">Fi</th>
                    <th className="p-2 text-left">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  {result.table.map((row, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">
                        {row.limiteInferior} ⊢ {row.limiteSuperior}
                      </td>
                      <td className="p-2">{row.pontoMedio}</td>
                      <td className="p-2">{row.h}</td>
                      <td className="p-2">{row.fi}</td>
                      <td className="p-2">{row.fri}</td>
                      <td className="p-2">{row.friPerc}%</td>
                      <td className="p-2">{row.Fi}</td>
                      <td className="p-2">{row.Fri}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-neutral-50 font-medium dark:bg-neutral-800">
                    <td className="p-2">Total</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                    <td className="p-2">{result.totalFi}</td>
                    <td className="p-2">1.0000</td>
                    <td className="p-2">100.00%</td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Estatísticas</h4>
              <p><strong>Média:</strong> {result.media.toFixed(2)}</p>
              <p><strong>Mediana:</strong> {result.mediana.toFixed(2)}</p>
              <p><strong>Moda:</strong> {String(result.moda)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
