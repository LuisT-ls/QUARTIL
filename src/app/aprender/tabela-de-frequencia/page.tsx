import type { Metadata } from "next";
import { EducationalArticle } from "@/components/seo/EducationalArticle";
import { baseUrl } from "@/lib/metadata";

const title = "Como Montar uma Tabela de Frequência";
const description =
  "Aprenda a criar uma tabela de frequência com classes, frequência absoluta, relativa e acumulada usando a fórmula de Sturges.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["tabela de frequência", "como montar tabela de frequência", "frequência absoluta e relativa", "fórmula de Sturges"],
  alternates: { canonical: `${baseUrl}/aprender/tabela-de-frequencia` },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/aprender/tabela-de-frequencia`,
    type: "article",
    locale: "pt_BR",
    images: [`${baseUrl}/img/og-preview-desktop.png`],
  },
};

export default function TabelaDeFrequenciaPage() {
  return (
    <EducationalArticle title={title} description={description}>
      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">O que a tabela mostra?</h2>
        <p className="leading-relaxed">
          A tabela organiza os dados em classes e mostra quantas observações pertencem a cada intervalo. Ela ajuda a enxergar a distribuição mesmo quando o conjunto tem muitos valores.
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-slate-400">
          <li><strong className="text-slate-200">fi:</strong> frequência absoluta da classe.</li>
          <li><strong className="text-slate-200">fri:</strong> frequência relativa, calculada por fi/n.</li>
          <li><strong className="text-slate-200">Fi:</strong> frequência acumulada até a classe.</li>
          <li><strong className="text-slate-200">Fri:</strong> frequência relativa acumulada.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">Como criar</h2>
        <ol className="list-inside list-decimal space-y-3 text-slate-400">
          <li>Ordene os dados e encontre o menor e o maior valor.</li>
          <li>Estime o número de classes com k ≈ 1 + 3,322 × log₁₀(n), pela fórmula de Sturges.</li>
          <li>Calcule a amplitude total e a largura aproximada de cada classe.</li>
          <li>Conte os valores em cada intervalo e calcule as frequências acumuladas.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-5">
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">Exemplo rápido</h2>
        <p className="leading-relaxed">
          Para os valores 10, 15, 20, 25 e 30, a amplitude é 20. Com três classes aproximadas, os intervalos podem ser 10–16,67, 16,67–23,33 e 23,33–30. Depois, conte os valores de cada classe e preencha fi, fri, Fi e Fri.
        </p>
      </section>
    </EducationalArticle>
  );
}
