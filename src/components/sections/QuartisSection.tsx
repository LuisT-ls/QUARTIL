"use client";

import { TrendingUp } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import {
  calcularMediana,
  calcularQuartil,
  calcularOutliers,
} from "@/lib/stats";

function ResultCard({
  value,
  formula,
  children,
}: {
  value: React.ReactNode;
  formula: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
      <p className="font-mono text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{value}</p>
      <p className="mt-2 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: formula }} />
      <div className="mt-2 space-y-1 text-sm text-slate-400">
        {children}
      </div>
    </div>
  );
}

export function QuartisSection() {
  const { currentData, isCalculated } = useCalculator();

  if (!isCalculated || currentData.length === 0) {
    return (
      <section id="quartis" className="py-6" aria-labelledby="quartis-title" suppressHydrationWarning>
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-slate-100">
          <TrendingUp className="h-6 w-6 text-blue-400" aria-hidden />
          Quartis - Análise de Distribuição
        </h2>
        <p className="mb-6 text-slate-400">
          Os quartis dividem os dados em quatro partes iguais. Insira os dados e
          clique em Calcular.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {["Q1", "Q2", "Q3", "IQR"].map((q) => (
            <div key={q} className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
              <p className="text-slate-500">-</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const ordenado = [...currentData].sort((a, b) => a - b);
  const q1 = calcularQuartil(currentData, 0.25);
  const q2 = calcularMediana(currentData);
  const q3 = calcularQuartil(currentData, 0.75);
  const iqr = q3 - q1;
  const mediaJuntas = (q1 + q2 + q3) / 3;
  const outliers = calcularOutliers(currentData);
  const totalOutliers = outliers.inferior.length + outliers.superior.length;

  return (
    <section id="quartis" className="py-6" aria-labelledby="quartis-title" suppressHydrationWarning>
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold text-slate-100">
        <TrendingUp className="h-6 w-6 text-blue-400" aria-hidden />
        Quartis - Análise de Distribuição
      </h2>
      <p className="mb-6 text-slate-400">
        Os quartis são essenciais para entender a distribuição dos dados.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Primeiro Quartil (Q1)</h3>
          <p className="mb-3 text-sm text-slate-400">25% dos dados abaixo</p>
          <ResultCard
            value={q1.toFixed(2)}
            formula="<strong>Fórmula:</strong> Q₁ = posição n×0,25"
          >
            <p>Dados: [{ordenado.join(", ")}]</p>
            <p>Q₁ = {q1.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Mediana (Q2)</h3>
          <p className="mb-3 text-sm text-slate-400">50% dos dados abaixo</p>
          <ResultCard
            value={q2.toFixed(2)}
            formula="<strong>Fórmula:</strong> Q₂ = Mediana"
          >
            <p>Q₂ = {q2.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Terceiro Quartil (Q3)</h3>
          <p className="mb-3 text-sm text-slate-400">75% dos dados abaixo</p>
          <ResultCard
            value={q3.toFixed(2)}
            formula="<strong>Fórmula:</strong> Q₃ = posição n×0,75"
          >
            <p>Q₃ = {q3.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Amplitude Interquartil (IQR)</h3>
          <p className="mb-3 text-sm text-slate-400">Q3 - Q1</p>
          <ResultCard
            value={iqr.toFixed(2)}
            formula="<strong>Fórmula:</strong> IQR = Q₃ - Q₁"
          >
            <p>IQR = {q3.toFixed(2)} - {q1.toFixed(2)} = {iqr.toFixed(2)}</p>
          </ResultCard>
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Média das Juntas</h3>
          <p className="mb-3 text-sm text-slate-400">(Q1 + Q2 + Q3) / 3</p>
          <ResultCard
            value={mediaJuntas.toFixed(2)}
            formula="<strong>Fórmula:</strong> (Q₁+Q₂+Q₃)/3"
          >
            <p>= ({q1.toFixed(2)} + {q2.toFixed(2)} + {q3.toFixed(2)}) / 3</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">Detecção de Outliers</h3>
          <p className="mb-3 text-sm text-slate-400">Limites = Q₁ ± 1.5×IQR</p>
          <ResultCard
            value={
              totalOutliers > 0
                ? `${totalOutliers} outlier(s) detectado(s)`
                : "Nenhum outlier detectado"
            }
            formula="<strong>Fórmula:</strong> Limites = Q₁ ± (1.5 × IQR)"
          >
            <p>Limite Inferior = {outliers.limiteInferior.toFixed(2)}</p>
            <p>Limite Superior = {outliers.limiteSuperior.toFixed(2)}</p>
            {outliers.inferior.length > 0 && (
              <p><strong>Inferiores:</strong> [{outliers.inferior.join(", ")}]</p>
            )}
            {outliers.superior.length > 0 && (
              <p><strong>Superiores:</strong> [{outliers.superior.join(", ")}]</p>
            )}
            {totalOutliers === 0 && <p>Nenhum outlier nos dados.</p>}
          </ResultCard>
        </div>
      </div>
    </section>
  );
}
