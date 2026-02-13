"use client";

import { useState, useEffect } from "react";
import { Table, Eraser } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import {
  calcularMedia,
  calcularMediana,
  calcularModa,
} from "@/lib/stats";

export function TabelaFrequenciaSection() {
  const { currentData, isCalculated } = useCalculator();
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState<number[] | null>(null);

  useEffect(() => {
    if (isCalculated && currentData.length > 0) {
      setTableData(currentData);
    } else if (!isCalculated && currentData.length === 0) {
      setTableData(null);
    }
  }, [currentData, isCalculated]);

  const processInput = (raw: string): number[] | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const parts = trimmed.split(/[,\s]+/);
    const nums = parts
      .map((n) => parseFloat(n.replace(",", ".")))
      .filter((n) => !Number.isNaN(n));
    return nums.length > 0 ? nums : null;
  };

  const handleCalculate = () => {
    const nums = processInput(inputValue);
    if (!nums) {
      alert("Por favor, insira alguns números para criar a tabela de frequência.");
      return;
    }
    setTableData(nums);
  };

  const handleClear = () => {
    setInputValue("");
    setTableData(null);
  };

  if (!tableData || tableData.length === 0) {
    return (
      <section className="py-6" aria-labelledby="tabela-frequencia-title">
        <h2 id="tabela-frequencia-title" className="mb-6 text-2xl font-semibold text-slate-100">
          Tabela de Frequência
        </h2>
        <div className="mb-4">
          <label htmlFor="tabelaFrequenciaInput" className="mb-2 block text-sm font-medium">
            Insira os números separados por vírgula:
          </label>
          <input
            id="tabelaFrequenciaInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            placeholder="Ex: 1, 2, 3, 4, 5"
            className="w-full rounded-lg border border-white/20 bg-slate-800/50 px-4 py-2 text-slate-100 placeholder-slate-500 backdrop-blur-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            <Table className="h-4 w-4" /> Calcular Tabela de Frequência
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
          >
            <Eraser className="h-4 w-4" /> Limpar
          </button>
        </div>
      </section>
    );
  }

  const numClasses = Math.ceil(1 + 3.322 * Math.log10(tableData.length));
  const min = Math.min(...tableData);
  const max = Math.max(...tableData);
  const amplitudeTotal = max - min;
  const h = amplitudeTotal / numClasses;

  const classes: {
    limiteInferior: number;
    limiteSuperior: number;
    pontoMedio: number;
    frequencia: number;
    frequenciaRelativa: number;
    frequenciaRelativaPercentual: number;
    frequenciaAcumulada: number;
    frequenciaRelativaAcumulada: number;
  }[] = [];

  for (let i = 0; i < numClasses; i++) {
    const li = min + i * h;
    const ls = li + h;
    classes.push({
      limiteInferior: li,
      limiteSuperior: ls,
      pontoMedio: (li + ls) / 2,
      frequencia: 0,
      frequenciaRelativa: 0,
      frequenciaRelativaPercentual: 0,
      frequenciaAcumulada: 0,
      frequenciaRelativaAcumulada: 0,
    });
  }

  tableData.forEach((valor) => {
    for (let i = 0; i < classes.length; i++) {
      if (
        valor >= classes[i].limiteInferior &&
        (valor < classes[i].limiteSuperior ||
          (i === classes.length - 1 && valor <= classes[i].limiteSuperior))
      ) {
        classes[i].frequencia++;
        break;
      }
    }
  });

  let freqAcumulada = 0;
  classes.forEach((c) => {
    freqAcumulada += c.frequencia;
    c.frequenciaAcumulada = freqAcumulada;
    c.frequenciaRelativa = c.frequencia / tableData.length;
    c.frequenciaRelativaPercentual = c.frequenciaRelativa * 100;
    c.frequenciaRelativaAcumulada = freqAcumulada / tableData.length;
  });

  const media = calcularMedia(tableData);
  const mediana = calcularMediana(tableData);
  const moda = calcularModa(tableData);
  const modaStr = typeof moda === "object" ? (Array.isArray(moda) ? moda.join(", ") : String(moda)) : String(moda);

  return (
    <section className="py-6" aria-labelledby="tabela-frequencia-title">
      <h2 id="tabela-frequencia-title" className="mb-6 text-2xl font-semibold text-slate-100">
        Tabela de Frequência
      </h2>
      <div className="mb-4">
        <label htmlFor="tabelaFrequenciaInput" className="mb-2 block text-sm font-medium">
          Insira os números separados por vírgula:
        </label>
        <input
          id="tabelaFrequenciaInput"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
          placeholder="Ex: 1, 2, 3, 4, 5"
          className="w-full rounded-lg border border-white/20 bg-slate-800/50 px-4 py-2 text-slate-100 placeholder-slate-500 backdrop-blur-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCalculate}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
        >
          <Table className="h-4 w-4" /> Calcular Tabela de Frequência
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
        >
          <Eraser className="h-4 w-4" /> Limpar
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-md">
        <table className="w-full min-w-[600px] border-collapse text-sm text-slate-300">
          <thead>
            <tr className="border-b border-white/5 bg-black/20">
              <th className="p-3 text-left font-bold">Classe</th>
              <th className="p-3 text-left font-bold">Ponto Médio</th>
              <th className="p-3 text-left font-bold">h</th>
              <th className="p-3 text-left font-bold">fi</th>
              <th className="p-3 text-left font-bold">fri</th>
              <th className="p-3 text-left font-bold">fri (%)</th>
              <th className="p-3 text-left font-bold">Fi</th>
              <th className="p-3 text-left font-bold">Fri</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c, i) => (
              <tr
                key={i}
                className="border-b border-white/5 transition-colors hover:bg-blue-500/10"
              >
                <td className="p-3">
                  {c.limiteInferior.toFixed(2)} ⊢ {c.limiteSuperior.toFixed(2)}
                </td>
                <td className="p-3">{c.pontoMedio.toFixed(2)}</td>
                <td className="p-3">{h.toFixed(2)}</td>
                <td className="p-3">{c.frequencia}</td>
                <td className="p-3">{c.frequenciaRelativa.toFixed(4)}</td>
                <td className="p-3">{c.frequenciaRelativaPercentual.toFixed(2)}%</td>
                <td className="p-3">{c.frequenciaAcumulada}</td>
                <td className="p-3">{c.frequenciaRelativaAcumulada.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/5 bg-black/20 font-bold">
              <td className="p-3">Total</td>
              <td className="p-3">-</td>
              <td className="p-3">-</td>
              <td className="p-3">{tableData.length}</td>
              <td className="p-3">1.0000</td>
              <td className="p-3">100.00%</td>
              <td className="p-3">-</td>
              <td className="p-3">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h4 className="mb-2 font-medium text-slate-200">Legenda</h4>
          <ul className="space-y-1 text-sm text-slate-400">
            <li><strong>h:</strong> Largura da classe</li>
            <li><strong>fi:</strong> Frequência absoluta</li>
            <li><strong>fri:</strong> Frequência relativa</li>
            <li><strong>fri (%):</strong> Fri em porcentagem</li>
            <li><strong>Fi:</strong> Frequência acumulada</li>
            <li><strong>Fri:</strong> Frequência relativa acumulada</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h4 className="mb-2 font-medium text-slate-200">Estatísticas</h4>
          <p><strong>Número de classes:</strong> {numClasses}</p>
          <p><strong>Amplitude total:</strong> {amplitudeTotal.toFixed(2)}</p>
          <p><strong>Largura (h):</strong> {h.toFixed(2)}</p>
          <p><strong>Média:</strong> {media.toFixed(2)}</p>
          <p><strong>Mediana:</strong> {mediana.toFixed(2)}</p>
          <p><strong>Moda:</strong> {modaStr}</p>
        </div>
      </div>
    </section>
  );
}
