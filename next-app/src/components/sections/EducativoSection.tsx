import { BookOpen, TrendingUp, BarChart3, PieChart } from "lucide-react";

export function EducativoSection() {
  return (
    <section className="mb-12" aria-labelledby="educativo-title">
      <h2
        id="educativo-title"
        className="mb-4 flex items-center gap-2 text-2xl font-semibold"
      >
        <BookOpen className="h-6 w-6 text-[#4361ee]" aria-hidden />
        O que são Quartis e como calcular?
      </h2>
      <p className="mb-6 text-lg leading-relaxed">
        Os <strong>quartis</strong> são medidas estatísticas que dividem um
        conjunto de dados ordenados em quatro partes iguais, cada uma contendo
        25% dos dados.
      </p>
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-[#4361ee]/20 bg-[#4361ee]/5 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-[#4361ee]">
            <TrendingUp className="h-5 w-5" aria-hidden />
            Primeiro Quartil (Q1)
          </h3>
          <p className="text-sm text-neutral-700">
            Representa o valor que separa os primeiros 25% dos dados. É o 25º
            percentil.
          </p>
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-emerald-700">
            <BarChart3 className="h-5 w-5" aria-hidden />
            Segundo Quartil (Q2)
          </h3>
          <p className="text-sm text-neutral-700">
            É a <strong>mediana</strong> dos dados, separando os primeiros 50% dos
            últimos 50%.
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-amber-700">
            <PieChart className="h-5 w-5" aria-hidden />
            Terceiro Quartil (Q3)
          </h3>
          <p className="text-sm text-neutral-700">
            Representa o valor que separa os primeiros 75% dos dados. É o 75º
            percentil.
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-800">
        <p className="text-sm">
          <strong>Dica:</strong> Use nossa calculadora online para calcular
          quartis automaticamente. Basta inserir seus dados e clicar em calcular!
        </p>
      </div>
    </section>
  );
}
