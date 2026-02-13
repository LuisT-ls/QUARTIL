import Link from "next/link";
import { BookOpen, TrendingUp, BarChart3, PieChart } from "lucide-react";

export function EducativoSection() {
  return (
    <section id="educativo" className="py-6" aria-labelledby="educativo-title">
      <h2
        id="educativo-title"
        className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100"
      >
        <BookOpen className="h-6 w-6 text-blue-400" aria-hidden />
        O que são Quartis e como calcular?
      </h2>
      <p className="mb-6 text-lg leading-relaxed text-slate-300">
        Os <strong className="text-slate-100">quartis</strong> são medidas estatísticas que dividem um
        conjunto de dados ordenados em quatro partes iguais, cada uma contendo
        25% dos dados.
      </p>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-blue-400">
            <TrendingUp className="h-5 w-5" aria-hidden />
            Primeiro Quartil (Q1)
          </h3>
          <p className="text-sm text-slate-400">
            Representa o valor que separa os primeiros 25% dos dados. É o 25º
            percentil.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-emerald-400">
            <BarChart3 className="h-5 w-5" aria-hidden />
            Segundo Quartil (Q2)
          </h3>
          <p className="text-sm text-slate-400">
            É a <strong>mediana</strong> dos dados, separando os primeiros 50% dos
            últimos 50%.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-amber-400">
            <PieChart className="h-5 w-5" aria-hidden />
            Terceiro Quartil (Q3)
          </h3>
          <p className="text-sm text-slate-400">
            Representa o valor que separa os primeiros 75% dos dados. É o 75º
            percentil.
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 text-sky-300 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50">
        <p className="text-sm">
          <strong>Dica:</strong>{" "}
          <Link
            href="/aprender"
            className="text-sky-400 underline decoration-sky-400/50 underline-offset-2 transition-colors hover:text-sky-300"
          >
            Aprenda mais sobre quartis, gráficos e medidas
          </Link>
          {" · "}
          <Link
            href="/#entrada-dados"
            className="text-sky-400 underline decoration-sky-400/50 underline-offset-2 transition-colors hover:text-sky-300"
          >
            Use a calculadora online
          </Link>{" "}
          para calcular automaticamente.
        </p>
      </div>
    </section>
  );
}
