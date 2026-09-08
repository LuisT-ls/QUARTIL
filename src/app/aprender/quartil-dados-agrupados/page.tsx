import type { Metadata } from "next";
import { EducationalArticle } from "@/components/seo/EducationalArticle";
import { baseUrl } from "@/lib/metadata";

const title = "Quartil em Dados Agrupados: Como Calcular";
const description =
  "Entenda como encontrar quartis em dados agrupados por classes usando frequência acumulada e saiba quando usar dados brutos.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["quartil em dados agrupados", "quartil por classe", "frequência acumulada", "fórmula do quartil"],
  alternates: { canonical: `${baseUrl}/aprender/quartil-dados-agrupados` },
  openGraph: {
    title,
    description,
    url: `${baseUrl}/aprender/quartil-dados-agrupados`,
    type: "article",
    locale: "pt_BR",
    images: [`${baseUrl}/img/og-preview-desktop.png`],
  },
};

export default function QuartilDadosAgrupadosPage() {
  return (
    <EducationalArticle title={title} description={description}>
      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">O que são dados agrupados?</h2>
        <p className="leading-relaxed">
          São dados organizados em classes ou intervalos, como 0–10, 10–20 e 20–30. Em vez de cada valor individual, a tabela informa a frequência de cada classe e a frequência acumulada.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">Passo a passo</h2>
        <ol className="list-inside list-decimal space-y-3 text-slate-400">
          <li>Calcule a posição do quartil: Qk = k·n/4, para k = 1, 2 ou 3.</li>
          <li>Localize a classe que contém essa posição pela frequência acumulada.</li>
          <li>Use o limite inferior da classe, a frequência acumulada anterior, a frequência da classe e a amplitude do intervalo.</li>
          <li>Interprete o resultado como uma estimativa, pois os valores individuais dentro da classe não são conhecidos.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-5">
        <h2 className="mb-3 text-2xl font-semibold text-slate-100">Atenção à diferença</h2>
        <p className="leading-relaxed">
          A calculadora principal trabalha com valores numéricos brutos e calcula os quartis por interpolação. Para dados já agrupados, use a tabela de frequência e a fórmula específica da classe; não misture os dois métodos sem indicar a metodologia no relatório.
        </p>
      </section>
    </EducationalArticle>
  );
}
