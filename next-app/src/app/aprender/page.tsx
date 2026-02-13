import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  BarChart3,
  Calculator,
  Target,
  History,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Aprender Estatística | Quartis, Gráficos e Medidas",
  description:
    "Conteúdo educativo sobre quartis, medidas de posição, gráficos (histograma, boxplot), tabela de frequência. História, fórmulas e exercícios resolvidos.",
};

const topics = [
  { id: "quartis", label: "Quartis", icon: TrendingUp },
  { id: "medidas-posicao", label: "Medidas de Posição", icon: Target },
  { id: "graficos", label: "Gráficos", icon: BarChart3 },
  { id: "tabela-frequencia", label: "Tabela de Frequência", icon: Calculator },
] as const;

export default function AprenderPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
        aria-label="Voltar à página inicial"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Voltar à calculadora
      </Link>
      <header className="text-center">
        <h1 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold text-slate-100 md:text-4xl">
          <BookOpen className="h-10 w-10 text-blue-400" aria-hidden />
          Conteúdo Educativo de Estatística
        </h1>
        <p className="text-lg text-slate-400">
          História, conceitos, fórmulas e como resolver questões de forma detalhada.
        </p>
        <Link
          href="/#entrada-dados"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500"
        >
          <Calculator className="h-4 w-4" aria-hidden />
          Usar calculadora
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </header>

      <nav
        aria-label="Navegação entre tópicos"
        className="rounded-2xl border border-white/10 bg-slate-800/30 p-6"
      >
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Navegação rápida
        </h2>
        <ul className="flex flex-wrap gap-2">
          {topics.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <article id="quartis" className="scroll-mt-24">
        <section className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 backdrop-blur-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100">
            <TrendingUp className="h-6 w-6 text-blue-400" aria-hidden />
            Quartis
          </h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="mb-2 flex items-center gap-2 font-medium text-blue-300">
                <History className="h-5 w-5" aria-hidden />
                História e descoberta
              </h3>
              <p className="leading-relaxed">
                Os quartis fazem parte da estatística descritiva e estão ligados aos{" "}
                <strong className="text-slate-200">percentis</strong>. O conceito de dividir dados em
                partes iguais remonta ao desenvolvimento da análise de dados no início do século XX.
                O <strong className="text-slate-200">boxplot</strong> (ou diagrama de caixa) foi
                popularizado por <strong className="text-slate-200">John Tukey</strong> nos anos 1970,
                como forma visual de representar quartis, mediana e outliers.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-blue-300">O que são quartis?</h3>
              <p className="mb-4 leading-relaxed">
                Quartis dividem um conjunto de dados <strong className="text-slate-200">ordenado</strong> em quatro
                partes iguais:
              </p>
              <ul className="mb-4 list-inside list-disc space-y-2 text-slate-400">
                <li><strong className="text-slate-200">Q1 (25º percentil):</strong> Valor abaixo do qual estão 25% dos dados</li>
                <li><strong className="text-slate-200">Q2 (mediana, 50º percentil):</strong> Valor central, 50% abaixo e 50% acima</li>
                <li><strong className="text-slate-200">Q3 (75º percentil):</strong> Valor abaixo do qual estão 75% dos dados</li>
              </ul>
              <p className="leading-relaxed">
                O <strong className="text-slate-200">IQR</strong> (amplitude interquartil) = Q3 − Q1 representa a dispersão dos 50% centrais.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-blue-300">Como calcular</h3>
              <p className="mb-2 leading-relaxed">
                Para dados ordenados, usa-se a posição: <code className="rounded bg-slate-700/50 px-1.5 py-0.5 font-mono text-sm text-cyan-300">posição = (n + 1) × p</code>, onde <em>p</em> é a fração (0,25 para Q1; 0,5 para mediana; 0,75 para Q3).
              </p>
              <p className="mb-2 leading-relaxed">
                Se a posição for inteira, o valor é o dado nessa posição. Se for decimal, interpola-se entre os dois valores vizinhos.
              </p>
              <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
                <p className="mb-2 text-sm font-medium text-slate-200">Exemplo:</p>
                <p className="text-sm text-slate-400">
                  Dados: 5, 10, 15, 20, 25 (n=5). Q1: pos = 6×0,25 = 1,5 → valor entre 5 e 10 = 7,5. Q2: pos = 3 → 15. Q3: pos = 6×0,75 = 4,5 → entre 20 e 25 = 22,5.
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-blue-300">Outliers</h3>
              <p className="leading-relaxed">
                Valores fora do intervalo <strong className="text-slate-200">[Q1 − 1,5×IQR ; Q3 + 1,5×IQR]</strong> são considerados outliers (discrepantes) e podem ser destacados no boxplot.
              </p>
            </div>
          </div>
        </section>
      </article>

      <article id="medidas-posicao" className="scroll-mt-24">
        <section className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 backdrop-blur-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100">
            <Target className="h-6 w-6 text-emerald-400" aria-hidden />
            Medidas de Posição
          </h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="mb-2 font-medium text-emerald-300">Média aritmética (μ ou x̄)</h3>
              <p className="mb-2 leading-relaxed">
                Soma de todos os valores dividida pela quantidade: <strong className="text-slate-200">μ = Σx / n</strong>
              </p>
              <p className="text-sm text-slate-400">
                Sensível a valores extremos. Use quando os dados forem simétricos e não tiverem outliers fortes.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-emerald-300">Mediana</h3>
              <p className="mb-2 leading-relaxed">
                Valor central dos dados ordenados. Se <em>n</em> é ímpar: o valor do meio. Se <em>n</em> é par: média dos dois valores centrais.
              </p>
              <p className="text-sm text-slate-400">
                Mais robusta que a média frente a outliers. Ideal para distribuições assimétricas.
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-emerald-300">Moda</h3>
              <p className="mb-2 leading-relaxed">
                Valor(es) de maior frequência no conjunto. Pode haver uma moda (unimodal), duas (bimodal), várias ou nenhuma (amodal).
              </p>
              <p className="text-sm text-slate-400">
                Útil para dados categóricos ou quando o pico de frequência importa.
              </p>
            </div>
          </div>
        </section>
      </article>

      <article id="graficos" className="scroll-mt-24">
        <section className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 backdrop-blur-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100">
            <BarChart3 className="h-6 w-6 text-amber-400" aria-hidden />
            Gráficos
          </h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="mb-2 font-medium text-amber-300">Histograma</h3>
              <p className="mb-2 leading-relaxed">
                Gráfico de barras que representa a <strong className="text-slate-200">distribuição de frequência</strong> dos dados em intervalos (classes). Cada barra corresponde a um intervalo; a <strong className="text-slate-200">altura</strong> indica a quantidade de valores naquele intervalo.
              </p>
              <p className="text-sm text-slate-400">
                O número de classes pode ser obtido pela <strong className="text-slate-200">fórmula de Sturges</strong>: k ≈ 1 + 3,322 × log₁₀(n).
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-amber-300">Boxplot (diagrama de caixa)</h3>
              <p className="mb-2 leading-relaxed">
                Resume a distribuição em: mínimo, Q1, mediana, Q3 e máximo. A <strong className="text-slate-200">caixa</strong> vai de Q1 a Q3; a linha interna é a mediana. Os <strong className="text-slate-200">bigodes</strong> vão até o menor/maior valor dentro de 1,5×IQR; valores fora são outliers.
              </p>
              <p className="text-sm text-slate-400">
                Ideal para comparar distribuições e identificar assimetria e outliers.
              </p>
            </div>
          </div>
        </section>
      </article>

      <article id="tabela-frequencia" className="scroll-mt-24">
        <section className="rounded-2xl border border-white/10 border-t border-l border-t-white/15 border-l-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-8 backdrop-blur-md">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-100">
            <Calculator className="h-6 w-6 text-cyan-400" aria-hidden />
            Tabela de Frequência
          </h2>

          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="mb-2 font-medium text-cyan-300">O que é</h3>
              <p className="leading-relaxed">
                Organiza os dados em <strong className="text-slate-200">classes</strong> (intervalos) e mostra quantos valores pertencem a cada uma. Inclui frequência absoluta (fi), relativa (fri), acumulada (Fi) e relativa acumulada (Fri).
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-cyan-300">Como montar</h3>
              <ol className="list-inside list-decimal space-y-2 text-slate-400">
                <li>Ordene os dados e calcule min e max</li>
                <li>Número de classes: k ≈ 1 + 3,322 × log₁₀(n) (Sturges)</li>
                <li>Amplitude total: A = max − min</li>
                <li>Largura da classe: h = A / k</li>
                <li>Monte os intervalos e conte as frequências</li>
              </ol>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-cyan-300">Exemplo rápido</h3>
              <p className="text-sm text-slate-400">
                Dados: 10, 15, 20, 25, 30. Min=10, max=30, A=20. Para n=5: k≈3. Classes: 10–16,67; 16,67–23,33; 23,33–30. Conte quantos valores em cada.
              </p>
            </div>
          </div>
        </section>
      </article>

      <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-12">
        <p className="text-center text-slate-400">
          Pronto para calcular? Use nossa ferramenta online.
        </p>
        <Link
          href="/#entrada-dados"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500"
        >
          <Calculator className="h-4 w-4" aria-hidden />
          Ir para a calculadora
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
