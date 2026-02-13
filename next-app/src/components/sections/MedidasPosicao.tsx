"use client";

import { useCalculator } from "@/context/CalculatorContext";
import {
  calcularMedia,
  calcularMediana,
  calcularModa,
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

export function MedidasPosicao() {
  const { currentData, isCalculated } = useCalculator();

  if (!isCalculated || currentData.length === 0) {
    return (
      <section className="py-6" aria-labelledby="medidas-posicao-title">
        <h2 id="medidas-posicao-title" className="mb-6 text-2xl font-semibold text-slate-100">
          Medidas de Posição
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div><h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Média</h3><div className="text-slate-500">-</div></div>
          <div><h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Mediana</h3><div className="text-slate-500">-</div></div>
          <div><h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Moda</h3><div className="text-slate-500">-</div></div>
        </div>
      </section>
    );
  }

  const media = calcularMedia(currentData);
  const mediana = calcularMediana(currentData);
  const moda = calcularModa(currentData);
  const somaTotal = currentData.reduce((a, b) => a + b, 0).toFixed(2);
  const ordenado = [...currentData].sort((a, b) => a - b);
  const isPar = currentData.length % 2 === 0;
  const posicaoMediana = isPar
    ? `${currentData.length / 2} e ${currentData.length / 2 + 1}`
    : (currentData.length + 1) / 2;
  const formulaMediana = isPar
    ? `Md = <span class="text-[#4361ee]">(X${currentData.length / 2} + X${currentData.length / 2 + 1}) / 2</span>`
    : `Md = X<sub>${(currentData.length + 1) / 2}</sub>`;
  const valorModa = typeof moda === "object" ? (Array.isArray(moda) ? moda.join(", ") : String(moda)) : String(moda);
  const tipoDistribuicao =
    typeof moda === "object" && Array.isArray(moda) && moda.length > 1
      ? "Distribuição multimodal"
      : typeof moda === "string" && moda.includes("Não há")
        ? "Distribuição amodal"
        : "Distribuição unimodal";

  return (
    <section className="py-6" aria-labelledby="medidas-posicao-title">
      <h2 id="medidas-posicao-title" className="mb-6 text-2xl font-semibold text-slate-100">
        Medidas de Posição
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Média</h3>
          <ResultCard
            value={media.toFixed(2)}
            formula="<strong>Fórmula:</strong> μ = ∑x/n"
          >
            <p>∑x = {somaTotal} (soma dos valores)</p>
            <p>n = {currentData.length} (quantidade)</p>
            <p>μ = {somaTotal}/{currentData.length} = {media.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Mediana</h3>
          <ResultCard
            value={mediana.toFixed(2)}
            formula={`<strong>Fórmula:</strong> ${formulaMediana}`}
          >
            <p>Dados ordenados: [{ordenado.join(", ")}]</p>
            <p>Posição: {posicaoMediana}</p>
            <p>Mediana = {mediana.toFixed(2)}</p>
          </ResultCard>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">Moda</h3>
          <ResultCard
            value={valorModa}
            formula="<strong>Fórmula:</strong> Mo = valor(es) com maior frequência"
          >
            <p>{tipoDistribuicao}</p>
            <p>Valor(es) mais frequente(s): {valorModa}</p>
          </ResultCard>
        </div>
      </div>
    </section>
  );
}
