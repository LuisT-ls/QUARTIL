import { TrendingUp } from "lucide-react";

export function QuartisSection() {
  return (
    <section className="mb-12" aria-labelledby="quartis-title">
      <h2
        id="quartis-title"
        className="mb-2 flex items-center gap-2 text-2xl font-semibold"
      >
        <TrendingUp className="h-6 w-6 text-[#4361ee]" aria-hidden />
        Quartis - Análise de Distribuição
      </h2>
      <p className="mb-6 text-neutral-600">
        Os quartis são essenciais para entender a distribuição dos dados. Eles
        dividem os dados em quatro partes iguais, permitindo identificar
        outliers e analisar a dispersão dos valores.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-[#4361ee]">
            Primeiro Quartil (Q1)
          </h3>
          <p className="mb-3 text-sm text-neutral-600">
            25% dos dados estão abaixo deste valor
          </p>
          <div id="q1Result" />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-emerald-600">Mediana (Q2)</h3>
          <p className="mb-3 text-sm text-neutral-600">
            50% dos dados estão abaixo deste valor
          </p>
          <div id="q2Result" />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-amber-600">
            Terceiro Quartil (Q3)
          </h3>
          <p className="mb-3 text-sm text-neutral-600">
            75% dos dados estão abaixo deste valor
          </p>
          <div id="q3Result" />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-sky-600">
            Amplitude Interquartil (IQR)
          </h3>
          <p className="mb-3 text-sm text-neutral-600">
            Q3 - Q1: medida de dispersão robusta
          </p>
          <div id="iqrResult" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-neutral-600">Média das Juntas</h3>
          <p className="mb-3 text-sm text-neutral-600">
            Média dos valores mínimo e máximo
          </p>
          <div id="mediaJuntasResult" />
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-medium text-neutral-800">
            Detecção de Outliers
          </h3>
          <p className="mb-3 text-sm text-neutral-600">
            Valores abaixo de Q1 - 1.5×IQR ou acima de Q3 + 1.5×IQR são
            considerados outliers
          </p>
          <div id="outliersResult" />
        </div>
      </div>
    </section>
  );
}
