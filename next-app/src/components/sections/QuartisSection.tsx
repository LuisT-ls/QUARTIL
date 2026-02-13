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
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <p className="text-xl font-semibold text-[#4361ee]">{value}</p>
      <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: formula }} />
      <div className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        {children}
      </div>
    </div>
  );
}

export function QuartisSection() {
  const { currentData, isCalculated } = useCalculator();

  if (!isCalculated || currentData.length === 0) {
    return (
      <section className="mb-12" aria-labelledby="quartis-title">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <TrendingUp className="h-6 w-6 text-[#4361ee]" aria-hidden />
          Quartis - Análise de Distribuição
        </h2>
        <p className="mb-6 text-neutral-600">
          Os quartis dividem os dados em quatro partes iguais. Insira os dados e
          clique em Calcular.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {["Q1", "Q2", "Q3", "IQR"].map((q) => (
            <div key={q} className="rounded-lg border p-4">
              <p className="text-neutral-500">-</p>
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
    <section className="mb-12" aria-labelledby="quartis-title">
      <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
        <TrendingUp className="h-6 w-6 text-[#4361ee]" aria-hidden />
        Quartis - Análise de Distribuição
      </h2>
      <p className="mb-6 text-neutral-600">
        Os quartis são essenciais para entender a distribuição dos dados.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="mb-2 font-medium text-[#4361ee]">Primeiro Quartil (Q1)</h3>
          <p className="mb-3 text-sm text-neutral-600">25% dos dados abaixo</p>
          <ResultCard
            value={q1.toFixed(2)}
            formula="<strong>Fórmula:</strong> Q₁ = posição n×0,25"
          >
            <p>Dados: [{ordenado.join(", ")}]</p>
            <p>Q₁ = {q1.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 font-medium text-emerald-600">Mediana (Q2)</h3>
          <p className="mb-3 text-sm text-neutral-600">50% dos dados abaixo</p>
          <ResultCard
            value={q2.toFixed(2)}
            formula="<strong>Fórmula:</strong> Q₂ = Mediana"
          >
            <p>Q₂ = {q2.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 font-medium text-amber-600">Terceiro Quartil (Q3)</h3>
          <p className="mb-3 text-sm text-neutral-600">75% dos dados abaixo</p>
          <ResultCard
            value={q3.toFixed(2)}
            formula="<strong>Fórmula:</strong> Q₃ = posição n×0,75"
          >
            <p>Q₃ = {q3.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 font-medium text-sky-600">Amplitude Interquartil (IQR)</h3>
          <p className="mb-3 text-sm text-neutral-600">Q3 - Q1</p>
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
          <h3 className="mb-2 font-medium text-neutral-600">Média das Juntas</h3>
          <p className="mb-3 text-sm text-neutral-600">(Q1 + Q2 + Q3) / 3</p>
          <ResultCard
            value={mediaJuntas.toFixed(2)}
            formula="<strong>Fórmula:</strong> (Q₁+Q₂+Q₃)/3"
          >
            <p>= ({q1.toFixed(2)} + {q2.toFixed(2)} + {q3.toFixed(2)}) / 3</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-2 font-medium text-neutral-800">Detecção de Outliers</h3>
          <p className="mb-3 text-sm text-neutral-600">Limites = Q₁ ± 1.5×IQR</p>
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
