import { Star, Lightbulb, GraduationCap, TrendingUp, Briefcase } from "lucide-react";

export function CasosUsoSection() {
  return (
    <>
      <section className="mb-12" aria-labelledby="beneficios-title">
        <h2
          id="beneficios-title"
          className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        >
          <Star className="h-6 w-6 text-amber-500" aria-hidden />
          Por que usar nossa Calculadora de Quartil?
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-[#4361ee]">Para Estudantes</h3>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Cálculos precisos de quartis (Q1, Q2, Q3)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Aprenda estatística de forma prática
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Ideal para trabalhos acadêmicos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Gráficos para melhor compreensão
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-medium text-emerald-600">
              Para Profissionais
            </h3>
            <ul className="space-y-2 text-neutral-700">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Análise rápida de dados estatísticos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Detecção de outliers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Relatórios profissionais
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600" aria-hidden>✓</span>
                Exportação em múltiplos formatos
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12" aria-labelledby="casos-uso-title">
        <h2
          id="casos-uso-title"
          className="mb-4 flex items-center gap-2 text-2xl font-semibold"
        >
          <Lightbulb className="h-6 w-6 text-sky-500" aria-hidden />
          Casos de Uso Comuns
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <GraduationCap
              className="mx-auto mb-3 h-12 w-12 text-[#4361ee]"
              aria-hidden
            />
            <h3 className="mb-2 font-medium">Educação</h3>
            <p className="text-sm text-neutral-600">
              Cálculo de notas, análise de desempenho escolar, trabalhos de
              estatística
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <TrendingUp
              className="mx-auto mb-3 h-12 w-12 text-emerald-600"
              aria-hidden
            />
            <h3 className="mb-2 font-medium">Pesquisa</h3>
            <p className="text-sm text-neutral-600">
              Análise de dados de pesquisa, estudos científicos, relatórios
              acadêmicos
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <Briefcase
              className="mx-auto mb-3 h-12 w-12 text-amber-500"
              aria-hidden
            />
            <h3 className="mb-2 font-medium">Negócios</h3>
            <p className="text-sm text-neutral-600">
              Análise de vendas, métricas de performance, relatórios financeiros
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
