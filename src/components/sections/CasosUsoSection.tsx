import { Star, Lightbulb, GraduationCap, TrendingUp, Briefcase } from "lucide-react";

export function CasosUsoSection() {
  return (
    <>
      <section id="beneficios" className="py-6" aria-labelledby="beneficios-title">
        <h2
          id="beneficios-title"
          className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100"
        >
          <Star className="h-6 w-6 text-amber-400" aria-hidden />
          Por que usar nossa Calculadora de Quartil?
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <h3 className="mb-3 font-medium text-blue-400">Para Estudantes</h3>
            <ul className="space-y-2 text-slate-300">
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
          <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <h3 className="mb-3 font-medium text-emerald-400">
              Para Profissionais
            </h3>
            <ul className="space-y-2 text-slate-300">
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

      <section id="casos-uso" className="py-6" aria-labelledby="casos-uso-title">
        <h2
          id="casos-uso-title"
          className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100"
        >
          <Lightbulb className="h-6 w-6 text-sky-400" aria-hidden />
          Casos de Uso Comuns
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <GraduationCap
              className="mx-auto mb-3 h-12 w-12 text-blue-400"
              aria-hidden
            />
            <h3 className="mb-2 font-medium text-slate-100">Educação</h3>
            <p className="text-sm text-slate-400">
              Cálculo de notas, análise de desempenho escolar, trabalhos de
              estatística
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <TrendingUp
              className="mx-auto mb-3 h-12 w-12 text-emerald-400"
              aria-hidden
            />
            <h3 className="mb-2 font-medium text-slate-100">Pesquisa</h3>
            <p className="text-sm text-slate-400">
              Análise de dados de pesquisa, estudos científicos, relatórios
              acadêmicos
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 text-center backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
            <Briefcase
              className="mx-auto mb-3 h-12 w-12 text-amber-400"
              aria-hidden
            />
            <h3 className="mb-2 font-medium text-slate-100">Negócios</h3>
            <p className="text-sm text-slate-400">
              Análise de vendas, métricas de performance, relatórios financeiros
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
