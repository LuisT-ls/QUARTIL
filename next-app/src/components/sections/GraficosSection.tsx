"use client";

import { useEffect, useRef } from "react";
import { BarChart3 } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import { calcularQuartil, calcularOutliers } from "@/lib/stats";

export function GraficosSection() {
  const { currentData, isCalculated } = useCalculator();
  const histogramRef = useRef<HTMLCanvasElement>(null);
  const boxplotRef = useRef<HTMLCanvasElement>(null);
  const histogramChartRef = useRef<unknown>(null);
  const boxplotChartRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isCalculated || currentData.length === 0) return;

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
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Frequência" },
              },
              x: {
                title: { display: true, text: "Classes" },
                ticks: { maxRotation: 45, minRotation: 45 },
              },
            },
            plugins: {
              title: { display: true, text: "Histograma" },
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
            scales: {
              x: {
                position: "top",
                title: { display: true, text: "Valores" },
                grid: { color: "rgba(0,0,0,0.1)" },
              },
              y: { display: true, grid: { display: false } },
            },
            plugins: {
              title: { display: true, text: "Boxplot" },
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
    <section className="mb-12" aria-labelledby="graficos-title">
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <BarChart3 className="h-6 w-6 text-emerald-600" aria-hidden />
        Gráficos e Visualizações
      </h2>
      <p className="mb-6 text-neutral-600">
        Visualize seus dados através de gráficos interativos.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-2 font-medium text-[#4361ee]">Histograma</h3>
          <p className="mb-3 text-sm text-neutral-600">
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
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-2 font-medium text-amber-600">Boxplot</h3>
          <p className="mb-3 text-sm text-neutral-600">
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
        </div>
      </div>
    </section>
  );
}
