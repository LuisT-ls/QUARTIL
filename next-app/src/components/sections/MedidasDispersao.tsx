"use client";

import { useCalculator } from "@/context/CalculatorContext";
import {
  calcularMedia,
  calcularVariancia,
  calcularDesvioPadrao,
  calcularCV,
  calcularAssimetria,
  calcularCurtose,
} from "@/lib/stats";

function interpretarCV(cv: number): string {
  if (cv < 15) return "Baixa dispersão (dados homogêneos)";
  if (cv < 30) return "Média dispersão";
  return "Alta dispersão (dados heterogêneos)";
}

function interpretarAssimetria(a: number): string {
  if (a === 0) return "Distribuição simétrica";
  if (a > 0) return "Assimetria positiva (cauda à direita)";
  return "Assimetria negativa (cauda à esquerda)";
}

function interpretarCurtose(k: number): string {
  if (k === 0) return "Curtose normal (mesocúrtica)";
  if (k > 0) return "Curtose alta (leptocúrtica)";
  return "Curtose baixa (platicúrtica)";
}

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

export function MedidasDispersao() {
  const { currentData, isCalculated } = useCalculator();

  if (!isCalculated || currentData.length === 0) {
    return (
      <section className="mb-12" aria-labelledby="medidas-dispersao-title">
        <h2 id="medidas-dispersao-title" className="mb-4 text-2xl font-semibold">
          Medidas de Dispersão
        </h2>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {["Desvio Padrão", "Variância", "CV", "Assimetria", "Curtose"].map((name) => (
            <div key={name}>
              <h3 className="mb-3 text-lg font-medium">{name}</h3>
              <div className="text-neutral-500">-</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const media = calcularMedia(currentData);
  const variancia = calcularVariancia(currentData, media);
  const desvioPadrao = Math.sqrt(variancia);
  const cv = (desvioPadrao / media) * 100;
  const assimetria = calcularAssimetria(currentData, media, desvioPadrao);
  const curtose = calcularCurtose(currentData, media, desvioPadrao);

  return (
    <section className="mb-12" aria-labelledby="medidas-dispersao-title">
      <h2 id="medidas-dispersao-title" className="mb-4 text-2xl font-semibold">
        Medidas de Dispersão
      </h2>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <h3 className="mb-3 text-lg font-medium">Desvio Padrão</h3>
          <ResultCard
            value={desvioPadrao.toFixed(2)}
            formula="<strong>Fórmula:</strong> σ = √(∑(xᵢ - μ)²/n)"
          >
            <p>μ = {media.toFixed(2)}</p>
            <p>n = {currentData.length}</p>
            <p>σ = √{variancia.toFixed(2)} = {desvioPadrao.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Variância</h3>
          <ResultCard
            value={variancia.toFixed(2)}
            formula="<strong>Fórmula:</strong> σ² = ∑(xᵢ - μ)²/n"
          >
            <p>∑(xᵢ - μ)² = {(variancia * currentData.length).toFixed(2)}</p>
            <p>σ² = {variancia.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Coeficiente de Variação (CV)</h3>
          <ResultCard
            value={`${cv.toFixed(2)}%`}
            formula="<strong>Fórmula:</strong> CV = (σ/μ) × 100%"
          >
            <p>σ = {desvioPadrao.toFixed(2)}, μ = {media.toFixed(2)}</p>
            <p>CV = {cv.toFixed(2)}%</p>
            <p>Interpretação: {interpretarCV(cv)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Assimetria</h3>
          <ResultCard
            value={assimetria.toFixed(2)}
            formula="<strong>Fórmula:</strong> As = n/(n-1)(n-2) × ∑[(xᵢ-μ)/σ]³"
          >
            <p>As = {assimetria.toFixed(2)}</p>
            <p>Interpretação: {interpretarAssimetria(assimetria)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Curtose</h3>
          <ResultCard
            value={curtose.toFixed(2)}
            formula="<strong>Fórmula:</strong> K (coef. de curtose)"
          >
            <p>K = {curtose.toFixed(2)}</p>
            <p>Interpretação: {interpretarCurtose(curtose)}</p>
          </ResultCard>
        </div>
      </div>
    </section>
  );
}
