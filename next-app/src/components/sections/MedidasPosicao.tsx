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
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <p className="text-xl font-semibold text-[#4361ee]">{value}</p>
      <p className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: formula }} />
      <div className="mt-2 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
        {children}
      </div>
    </div>
  );
}

export function MedidasPosicao() {
  const { currentData, isCalculated } = useCalculator();

  if (!isCalculated || currentData.length === 0) {
    return (
      <section className="mb-12" aria-labelledby="medidas-posicao-title">
        <h2 id="medidas-posicao-title" className="mb-4 text-2xl font-semibold">
          Medidas de Posição
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div><h3 className="mb-3 text-lg font-medium">Média</h3><div className="text-neutral-500">-</div></div>
          <div><h3 className="mb-3 text-lg font-medium">Mediana</h3><div className="text-neutral-500">-</div></div>
          <div><h3 className="mb-3 text-lg font-medium">Moda</h3><div className="text-neutral-500">-</div></div>
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
    <section className="mb-12" aria-labelledby="medidas-posicao-title">
      <h2 id="medidas-posicao-title" className="mb-4 text-2xl font-semibold">
        Medidas de Posição
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-medium">Média</h3>
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
          <h3 className="mb-3 text-lg font-medium">Mediana</h3>
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
          <h3 className="mb-3 text-lg font-medium">Moda</h3>
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
