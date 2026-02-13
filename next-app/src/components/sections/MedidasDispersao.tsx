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
    <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
      <p className="font-mono text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{value}</p>
      <p className="mt-2 text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: formula }} />
      <div className="mt-2 space-y-1 text-sm text-slate-400">
        {children}
      </div>
    </div>
  );
}

export function MedidasDispersao() {
  const { currentData, isCalculated } = useCalculator();

  if (!isCalculated || currentData.length === 0) {
    return (
      <section className="py-6" aria-labelledby="medidas-dispersao-title">
        <h2 id="medidas-dispersao-title" className="mb-6 text-2xl font-semibold text-slate-100">
          Medidas de Dispersão
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {["Desvio Padrão", "Variância", "CV", "Assimetria", "Curtose"].map((name) => (
            <div key={name}>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">{name}</h3>
              <div className="text-slate-500">-</div>
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
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Desvio Padrão</h3>
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
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Variância</h3>
          <ResultCard
            value={variancia.toFixed(2)}
            formula="<strong>Fórmula:</strong> σ² = ∑(xᵢ - μ)²/n"
          >
            <p>∑(xᵢ - μ)² = {(variancia * currentData.length).toFixed(2)}</p>
            <p>σ² = {variancia.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Coeficiente de Variação (CV)</h3>
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
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Assimetria</h3>
          <ResultCard
            value={assimetria.toFixed(2)}
            formula="<strong>Fórmula:</strong> As = n/(n-1)(n-2) × ∑[(xᵢ-μ)/σ]³"
          >
            <p>As = {assimetria.toFixed(2)}</p>
            <p>Interpretação: {interpretarAssimetria(assimetria)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Curtose</h3>
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
