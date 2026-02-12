"use client";

import { BarChart3 } from "lucide-react";

export function GraficosSection() {
  return (
    <section className="mb-12" aria-labelledby="graficos-title">
      <h2
        id="graficos-title"
        className="mb-2 flex items-center gap-2 text-2xl font-semibold"
      >
        <BarChart3 className="h-6 w-6 text-emerald-600" aria-hidden />
        Gráficos e Visualizações
      </h2>
      <p className="mb-6 text-neutral-600">
        Visualize seus dados através de gráficos interativos que facilitam a
        interpretação estatística.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-[#4361ee]">Histograma</h3>
          <p className="mb-3 text-sm text-neutral-600">
            Distribuição de frequência dos dados
          </p>
          <div className="flex h-64 items-center justify-center rounded-lg bg-neutral-50">
            <canvas id="histogramaChart" className="max-h-full w-full" />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-amber-600">Boxplot</h3>
          <p className="mb-3 text-sm text-neutral-600">
            Visualização dos quartis e outliers
          </p>
          <div className="flex h-64 items-center justify-center rounded-lg bg-neutral-50">
            <canvas id="boxplotChart" className="max-h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
