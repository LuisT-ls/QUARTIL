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
      <section className="mb-12" aria-labelledby="tabela-frequencia-title">
        <h2 id="tabela-frequencia-title" className="mb-4 text-2xl font-semibold">
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:bg-neutral-800"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCalculate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white hover:bg-[#3a0ca3]"
          >
            <Table className="h-4 w-4" /> Calcular Tabela de Frequência
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700"
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
    <section className="mb-12" aria-labelledby="tabela-frequencia-title">
      <h2 id="tabela-frequencia-title" className="mb-4 text-2xl font-semibold">
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
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 dark:border-neutral-600 dark:bg-neutral-800"
        />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCalculate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#4361ee] px-4 py-2 text-white hover:bg-[#3a0ca3]"
        >
          <Table className="h-4 w-4" /> Calcular Tabela de Frequência
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700"
        >
          <Eraser className="h-4 w-4" /> Limpar
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b bg-neutral-50 dark:bg-neutral-800">
              <th className="p-2 text-left font-medium">Classe</th>
              <th className="p-2 text-left font-medium">Ponto Médio</th>
              <th className="p-2 text-left font-medium">h</th>
              <th className="p-2 text-left font-medium">fi</th>
              <th className="p-2 text-left font-medium">fri</th>
              <th className="p-2 text-left font-medium">fri (%)</th>
              <th className="p-2 text-left font-medium">Fi</th>
              <th className="p-2 text-left font-medium">Fri</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c, i) => (
              <tr
                key={i}
                className="border-b hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <td className="p-2">
                  {c.limiteInferior.toFixed(2)} ⊢ {c.limiteSuperior.toFixed(2)}
                </td>
                <td className="p-2">{c.pontoMedio.toFixed(2)}</td>
                <td className="p-2">{h.toFixed(2)}</td>
                <td className="p-2">{c.frequencia}</td>
                <td className="p-2">{c.frequenciaRelativa.toFixed(4)}</td>
                <td className="p-2">{c.frequenciaRelativaPercentual.toFixed(2)}%</td>
                <td className="p-2">{c.frequenciaAcumulada}</td>
                <td className="p-2">{c.frequenciaRelativaAcumulada.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t bg-neutral-50 font-medium dark:bg-neutral-800">
              <td className="p-2">Total</td>
              <td className="p-2">-</td>
              <td className="p-2">-</td>
              <td className="p-2">{tableData.length}</td>
              <td className="p-2">1.0000</td>
              <td className="p-2">100.00%</td>
              <td className="p-2">-</td>
              <td className="p-2">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
          <h4 className="mb-2 font-medium">Legenda</h4>
          <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <li><strong>h:</strong> Largura da classe</li>
            <li><strong>fi:</strong> Frequência absoluta</li>
            <li><strong>fri:</strong> Frequência relativa</li>
            <li><strong>fri (%):</strong> Fri em porcentagem</li>
            <li><strong>Fi:</strong> Frequência acumulada</li>
            <li><strong>Fri:</strong> Frequência relativa acumulada</li>
          </ul>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
          <h4 className="mb-2 font-medium">Estatísticas</h4>
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
