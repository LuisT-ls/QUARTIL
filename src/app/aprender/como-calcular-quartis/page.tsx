import type { Metadata } from "next";
import { EducationalArticle } from "@/components/seo/EducationalArticle";
import { baseUrl } from "@/lib/metadata";

const title = "Como Calcular Q1, Q2 e Q3: Fórmula dos Quartis";
const description =
  "Aprenda como calcular quartis passo a passo, entenda a posição interpolada e veja um exemplo completo de Q1, Q2 e Q3.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["como calcular quartis", "como calcular Q1 Q2 Q3", "fórmula dos quartis", "quartil estatística"],
  alternates: { canonical: `${baseUrl}/aprender/como-calcular-quartis` },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/aprender/como-calcular-quartis`,
    type: "article",
    locale: "pt_BR",
    images: [`${baseUrl}/img/og-preview-desktop.png`],
  },
};

export default function ComoCalcularQuartisPage() {
  return (
    <EducationalArticle title={title} description={description}>
      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">1. Ordene os dados</h2>
        <p className="leading-relaxed">
          Coloque os valores em ordem crescente. A posição de cada quartil depende da quantidade total de valores e da posição desses valores na lista ordenada.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">2. Calcule a posição</h2>
        <p className="leading-relaxed">
          Para a interpolação usada pela calculadora, aplique <strong className="text-slate-100">posição = (n − 1) × p</strong>. Use p = 0,25 para Q1, p = 0,50 para Q2 e p = 0,75 para Q3.
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-slate-400">
          <li><strong className="text-slate-200">Q1:</strong> primeiro quartil, correspondente ao 25º percentil.</li>
          <li><strong className="text-slate-200">Q2:</strong> segundo quartil, que é a mediana.</li>
          <li><strong className="text-slate-200">Q3:</strong> terceiro quartil, correspondente ao 75º percentil.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">3. Interpole quando necessário</h2>
        <p className="leading-relaxed">
          Se a posição for inteira, use o valor naquela posição. Se for decimal, combine proporcionalmente os dois valores vizinhos. Assim, a calculadora mantém resultados consistentes mesmo quando a quantidade de dados não divide os quartis exatamente.
        </p>
      </section>

      <section className="rounded-xl border border-blue-400/20 bg-blue-500/5 p-5">
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">Exemplo resolvido</h2>
        <p className="leading-relaxed">
          Para os dados 5, 10, 15, 20 e 25, temos n = 5. Q1 ocupa a posição 4 × 0,25 = 1 e vale 10; Q2 ocupa a posição 4 × 0,50 = 2 e vale 15; Q3 ocupa a posição 4 × 0,75 = 3 e vale 20. A amplitude interquartil é IQR = 20 − 10 = 10.
        </p>
      </section>
    </EducationalArticle>
  );
}
