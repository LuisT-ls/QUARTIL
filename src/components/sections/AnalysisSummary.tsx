"use client";

import { BarChart3, Download, ListTree, TrendingUp } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import {
  calcularDesvioPadrao,
  calcularMedia,
  calcularMediana,
  calcularOutliers,
  calcularQuartil,
} from "@/lib/stats";

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
        {value}
      </p>
    </div>
  );
}

export function AnalysisSummary() {
  const { analysisData, currentData, excludedOutlierCount, isCalculated, isDirty, statisticsSettings } = useCalculator();

  if (!isCalculated || analysisData.length === 0) return null;

  const media = calcularMedia(analysisData);
  const desvioPadrao = calcularDesvioPadrao(analysisData, media, statisticsSettings.varianceMethod);
  const q1 = calcularQuartil(analysisData, 0.25, statisticsSettings.quartileMethod);
  const mediana = calcularMediana(analysisData);
  const q3 = calcularQuartil(analysisData, 0.75, statisticsSettings.quartileMethod);
  const outliers = calcularOutliers(currentData, statisticsSettings.quartileMethod);
  const totalOutliers = outliers.inferior.length + outliers.superior.length;

  return (
    <section
      id="resumo-analise"
      className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-950/60 to-slate-900/80 p-6 shadow-[0_0_30px_rgba(59,130,246,0.08)]"
      aria-labelledby="resumo-analise-title"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="resumo-analise-title" className="flex items-center gap-2 text-xl font-semibold text-slate-100">
            <TrendingUp className="h-5 w-5 text-blue-400" aria-hidden />
            Resumo da análise
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Visão rápida dos principais resultados para {analysisData.length} valores.
          </p>
        </div>
        {isDirty && (
          <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200" role="status">
            Resultados da última análise. Recalcule após editar os dados.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <SummaryItem label="Q1" value={q1.toFixed(2)} />
        <SummaryItem label="Mediana" value={mediana.toFixed(2)} />
        <SummaryItem label="Q3" value={q3.toFixed(2)} />
        <SummaryItem label="IQR" value={(q3 - q1).toFixed(2)} />
        <SummaryItem label="Média" value={media.toFixed(2)} />
        <SummaryItem label="Desvio padrão" value={desvioPadrao.toFixed(2)} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
        <span><strong>Outliers:</strong> {totalOutliers}</span>
        <span><strong>Mínimo:</strong> {Math.min(...analysisData)}</span>
        <span><strong>Máximo:</strong> {Math.max(...analysisData)}</span>
        {excludedOutlierCount > 0 && (
          <span className="text-amber-200"><strong>Excluídos:</strong> {excludedOutlierCount} outlier(s)</span>
        )}
      </div>

      <nav className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4" aria-label="Navegação da análise">
        <a href="#medidas-posicao" className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-blue-500/20 hover:text-white">
          <ListTree className="h-4 w-4" aria-hidden />
          Medidas
        </a>
        <a href="#quartis" className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-blue-500/20 hover:text-white">
          Quartis e outliers
        </a>
        <a href="#graficos" className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-blue-500/20 hover:text-white">
          <BarChart3 className="h-4 w-4" aria-hidden />
          Gráficos
        </a>
        <a href="#tabela-frequencia" className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-blue-500/20 hover:text-white">
          Tabela de frequência
        </a>
        <a href="#entrada-dados" className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-blue-500/20 hover:text-white">
          <Download className="h-4 w-4" aria-hidden />
          Voltar aos dados e exportar
        </a>
      </nav>
    </section>
  );
}
