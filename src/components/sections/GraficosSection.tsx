"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import { calcularQuartil, calcularOutliers } from "@/lib/stats";

interface ClasseHistograma {
  limiteInferior: number;
  limiteSuperior: number;
  frequencia: number;
}

interface DetalhesHistograma {
  numClasses: number;
  min: number;
  max: number;
  amplitude: number;
  larguraClasse: number;
  classes: ClasseHistograma[];
}

interface DetalhesBoxplot {
  min: number;
  max: number;
  q1: number;
  mediana: number;
  q3: number;
  iqr: number;
  whiskerMin: number;
  whiskerMax: number;
  limiteInferior: number;
  limiteSuperior: number;
  outliersInferior: number[];
  outliersSuperior: number[];
}

export function GraficosSection() {
  const { currentData, isCalculated } = useCalculator();
  const [detalhesHistograma, setDetalhesHistograma] = useState<DetalhesHistograma | null>(null);
  const [detalhesBoxplot, setDetalhesBoxplot] = useState<DetalhesBoxplot | null>(null);
  const histogramRef = useRef<HTMLCanvasElement>(null);
  const boxplotRef = useRef<HTMLCanvasElement>(null);
  const histogramChartRef = useRef<unknown>(null);
  const boxplotChartRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isCalculated || currentData.length === 0) {
      setDetalhesHistograma(null);
      setDetalhesBoxplot(null);
      return;
    }

    const loadCharts = async () => {
      const { Chart } = await import("chart.js/auto");

      if (histogramRef.current) {
        if (histogramChartRef.current && typeof (histogramChartRef.current as { destroy?: () => void }).destroy === "function") {
          (histogramChartRef.current as { destroy: () => void }).destroy();
        }

        const numClasses = Math.ceil(1 + 3.322 * Math.log10(currentData.length));
        const min = Math.min(...currentData);
        const max = Math.max(...currentData);
        const amplitude = max - min;
        const larguraClasse = amplitude / numClasses;

        const classes: { limiteInferior: number; limiteSuperior: number; frequencia: number }[] = [];
        const labels: string[] = [];

        for (let i = 0; i < numClasses; i++) {
          const li = min + i * larguraClasse;
          const ls = min + (i + 1) * larguraClasse;
          classes.push({ limiteInferior: li, limiteSuperior: ls, frequencia: 0 });
          labels.push(`${li.toFixed(1)} - ${ls.toFixed(1)}`);
        }

        currentData.forEach((valor) => {
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

        setDetalhesHistograma({
          numClasses,
          min,
          max,
          amplitude,
          larguraClasse,
          classes: [...classes],
        });

        const maxFreq = Math.max(...classes.map((c) => c.frequencia));
        const getColor = (freq: number, type: "bg" | "border") => {
          const int = freq / maxFreq;
          const r = Math.floor(52 + 54 * (1 - int));
          const g = 162;
          const b = Math.floor(235 - 135 * (1 - int));
          const a = type === "bg" ? 0.4 + 0.6 * int : 1;
          return `rgba(${r}, ${g}, ${b}, ${a})`;
        };

        histogramChartRef.current = new Chart(histogramRef.current, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Frequência",
                data: classes.map((c) => c.frequencia),
                backgroundColor: classes.map((c) => getColor(c.frequencia, "bg")),
                borderColor: classes.map((c) => getColor(c.frequencia, "border")),
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            color: "#e2e8f0",
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Frequência", color: "#e2e8f0" },
                ticks: { color: "#e2e8f0" },
                grid: { color: "rgba(226, 232, 240, 0.15)" },
              },
              x: {
                title: { display: true, text: "Classes", color: "#e2e8f0" },
                ticks: { color: "#e2e8f0", maxRotation: 45, minRotation: 45 },
                grid: { color: "rgba(226, 232, 240, 0.1)" },
              },
            },
            plugins: {
              title: { display: true, text: "Histograma", color: "#e2e8f0" },
              legend: { display: false },
            },
          },
        });
      }

      if (boxplotRef.current) {
        if (boxplotChartRef.current && typeof (boxplotChartRef.current as { destroy?: () => void }).destroy === "function") {
          (boxplotChartRef.current as { destroy: () => void }).destroy();
        }

        const min = Math.min(...currentData);
        const max = Math.max(...currentData);
        const q1 = calcularQuartil(currentData, 0.25);
        const mediana = calcularQuartil(currentData, 0.5);
        const q3 = calcularQuartil(currentData, 0.75);
        const res = calcularOutliers(currentData);
        const whiskerMin =
          res.inferior.length > 0
            ? Math.min(...currentData.filter((v) => v >= res.limiteInferior))
            : min;
        const whiskerMax =
          res.superior.length > 0
            ? Math.max(...currentData.filter((v) => v <= res.limiteSuperior))
            : max;
        const iqr = q3 - q1;

        setDetalhesBoxplot({
          min,
          max,
          q1,
          mediana,
          q3,
          iqr,
          whiskerMin,
          whiskerMax,
          limiteInferior: res.limiteInferior,
          limiteSuperior: res.limiteSuperior,
          outliersInferior: res.inferior,
          outliersSuperior: res.superior,
        });

        boxplotChartRef.current = new Chart(boxplotRef.current, {
          type: "bar",
          data: {
            labels: [""],
            datasets: [
              {
                label: "Whisker Inferior",
                data: [q1 - whiskerMin],
                backgroundColor: "rgba(55, 126, 184, 0.3)",
                borderColor: "rgba(55, 126, 184, 1)",
                borderWidth: 2,
                barPercentage: 1,
                categoryPercentage: 1,
              },
              {
                label: "Q1-Mediana",
                data: [mediana - q1],
                backgroundColor: "rgba(77, 175, 74, 0.5)",
                borderColor: "rgba(0,0,0,0.6)",
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 1,
              },
              {
                label: "Mediana-Q3",
                data: [q3 - mediana],
                backgroundColor: "rgba(228, 26, 28, 0.5)",
                borderColor: "rgba(0,0,0,0.6)",
                borderWidth: 1,
                barPercentage: 1,
                categoryPercentage: 1,
              },
              {
                label: "Whisker Superior",
                data: [whiskerMax - q3],
                backgroundColor: "rgba(55, 126, 184, 0.3)",
                borderColor: "rgba(55, 126, 184, 1)",
                borderWidth: 2,
                barPercentage: 1,
                categoryPercentage: 1,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            color: "#e2e8f0",
            scales: {
              x: {
                position: "top",
                title: { display: true, text: "Valores", color: "#e2e8f0" },
                ticks: { color: "#e2e8f0" },
                grid: { color: "rgba(226, 232, 240, 0.15)" },
              },
              y: {
                display: true,
                grid: { display: false },
                ticks: { color: "#e2e8f0" },
              },
            },
            plugins: {
              title: { display: true, text: "Boxplot", color: "#e2e8f0" },
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const lbl = String(ctx.dataset?.label ?? "");
                    if (lbl === "Whisker Inferior")
                      return `${whiskerMin.toFixed(2)} - ${q1.toFixed(2)}`;
                    if (lbl === "Q1-Mediana")
                      return `Q1: ${q1.toFixed(2)}, Mediana: ${mediana.toFixed(2)}`;
                    if (lbl === "Mediana-Q3")
                      return `Mediana: ${mediana.toFixed(2)}, Q3: ${q3.toFixed(2)}`;
                    if (lbl === "Whisker Superior")
                      return `${q3.toFixed(2)} - ${whiskerMax.toFixed(2)}`;
                    return String(ctx.raw ?? "");
                  },
                },
              },
            },
          },
        });
      }
    };

    loadCharts();

    return () => {
      if (histogramChartRef.current && typeof (histogramChartRef.current as { destroy?: () => void }).destroy === "function") {
        (histogramChartRef.current as { destroy: () => void }).destroy();
      }
      if (boxplotChartRef.current && typeof (boxplotChartRef.current as { destroy?: () => void }).destroy === "function") {
        (boxplotChartRef.current as { destroy: () => void }).destroy();
      }
    };
  }, [currentData, isCalculated]);

  return (
      <section id="graficos" className="py-6" aria-labelledby="graficos-title" suppressHydrationWarning>
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-slate-100">
        <BarChart3 className="h-6 w-6 text-emerald-400" aria-hidden />
        Gráficos e Visualizações
      </h2>
      <p className="mb-6 text-slate-400">
        Visualize seus dados através de gráficos interativos.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h3 className="mb-2 font-medium text-blue-400">Histograma</h3>
          <p className="mb-3 text-sm text-slate-400">
            Distribuição de frequência dos dados
          </p>
          <div className="relative h-64">
            <canvas
              ref={histogramRef}
              id="histogramaChart"
              className="max-h-full w-full"
              role="img"
              aria-label="Histograma da distribuição de frequência"
            />
          </div>
          {detalhesHistograma && (
            <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Como ler o histograma
              </h4>
              <div className="mb-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Número de classes:</span>
                  <span className="font-mono text-slate-200">{detalhesHistograma.numClasses}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Valor mínimo:</span>
                  <span className="font-mono text-slate-200">{detalhesHistograma.min.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Valor máximo:</span>
                  <span className="font-mono text-slate-200">{detalhesHistograma.max.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Amplitude total:</span>
                  <span className="font-mono text-slate-200">{detalhesHistograma.amplitude.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Largura da classe (h):</span>
                  <span className="font-mono text-slate-200">{detalhesHistograma.larguraClasse.toFixed(2)}</span>
                </div>
              </div>
              <p className="mb-2 text-xs text-slate-500">
                Cada barra representa um intervalo. A altura indica quantos valores pertencem àquela faixa.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px] border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-2 text-left font-medium text-slate-400">Classe</th>
                      <th className="py-2 text-right font-medium text-slate-400">Frequência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalhesHistograma.classes.map((c, i) => (
                      <tr key={i} className="border-b border-white/5 text-slate-300">
                        <td className="py-1.5 font-mono">
                          {c.limiteInferior.toFixed(2)} ⊢ {c.limiteSuperior.toFixed(2)}
                        </td>
                        <td className="py-1.5 text-right font-mono">{c.frequencia}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/5 font-medium text-slate-200">
                      <td className="py-1.5">Total</td>
                      <td className="py-1.5 text-right font-mono">
                        {detalhesHistograma.classes.reduce((s, c) => s + c.frequencia, 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Fórmula de Sturges: k = 1 + 3,322 × log₁₀({currentData.length}) ≈ {detalhesHistograma.numClasses} classes
              </p>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h3 className="mb-2 font-medium text-amber-400">Boxplot</h3>
          <p className="mb-3 text-sm text-slate-400">
            Visualização dos quartis e outliers
          </p>
          <div className="relative h-64">
            <canvas
              ref={boxplotRef}
              id="boxplotChart"
              className="max-h-full w-full"
              role="img"
              aria-label="Boxplot dos quartis"
            />
          </div>
          {detalhesBoxplot && (
            <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Como ler o boxplot
              </h4>
              <div className="mb-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Mínimo (bigode):</span>
                  <span className="font-mono text-slate-200">{detalhesBoxplot.whiskerMin.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Q1 (25%):</span>
                  <span className="font-mono text-slate-200">{detalhesBoxplot.q1.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Mediana (50%):</span>
                  <span className="font-mono text-slate-200">{detalhesBoxplot.mediana.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Q3 (75%):</span>
                  <span className="font-mono text-slate-200">{detalhesBoxplot.q3.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Máximo (bigode):</span>
                  <span className="font-mono text-slate-200">{detalhesBoxplot.whiskerMax.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">IQR (Q3 − Q1):</span>
                  <span className="font-mono text-slate-200">{detalhesBoxplot.iqr.toFixed(2)}</span>
                </div>
              </div>
              <p className="mb-3 text-xs text-slate-500">
                A caixa central representa 50% dos dados (entre Q1 e Q3). Os bigodes vão até o valor mais próximo dentro de 1,5×IQR dos quartis.
              </p>
              <div className="mb-2 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded bg-blue-500/20 px-2 py-0.5 text-blue-300">
                  <span className="size-2 rounded bg-blue-400" aria-hidden /> Bigodes
                </span>
                <span className="inline-flex items-center gap-1.5 rounded bg-green-500/20 px-2 py-0.5 text-green-300">
                  <span className="size-2 rounded bg-green-500" aria-hidden /> Q1 → Mediana
                </span>
                <span className="inline-flex items-center gap-1.5 rounded bg-red-500/20 px-2 py-0.5 text-red-300">
                  <span className="size-2 rounded bg-red-500" aria-hidden /> Mediana → Q3
                </span>
              </div>
              {(detalhesBoxplot.outliersInferior.length > 0 || detalhesBoxplot.outliersSuperior.length > 0) && (
                <div className="space-y-1 text-xs text-slate-400">
                  <p className="font-medium text-slate-300">Outliers (valores fora de Q₁ ± 1,5×IQR):</p>
                  {detalhesBoxplot.outliersInferior.length > 0 && (
                    <p>Inferiores: [{detalhesBoxplot.outliersInferior.map((v) => v.toFixed(2)).join(", ")}]</p>
                  )}
                  {detalhesBoxplot.outliersSuperior.length > 0 && (
                    <p>Superiores: [{detalhesBoxplot.outliersSuperior.map((v) => v.toFixed(2)).join(", ")}]</p>
                  )}
                  <p className="mt-1 text-slate-500">Limites: {detalhesBoxplot.limiteInferior.toFixed(2)} e {detalhesBoxplot.limiteSuperior.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
