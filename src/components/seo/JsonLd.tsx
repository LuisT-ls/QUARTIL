import { baseUrl } from "@/lib/metadata";

/** FAQ schema para rich snippets e buscas "como calcular quartis" */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como calcular quartis Q1, Q2 e Q3?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a fórmula: posição = (n + 1) × p, onde p é 0,25 para Q1, 0,5 para Q2 (mediana) e 0,75 para Q3. Se a posição for inteira, o valor é o dado nessa posição. Se for decimal, interpole entre os dois valores vizinhos. Use nossa calculadora de quartil online para resultados instantâneos.",
      },
    },
    {
      "@type": "Question",
      name: "Como calcular quartil em dados agrupados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para dados agrupados em classes, use a fórmula do quartil baseada na frequência acumulada. Ou insira os dados brutos na calculadora de quartil online e gere a tabela de frequência automaticamente.",
      },
    },
    {
      "@type": "Question",
      name: "Quartil e mediana são a mesma coisa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O Q2 (segundo quartil) é exatamente a mediana: o valor central que divide os dados ao meio. Q1 e Q3 dividem cada metade ao meio.",
      },
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculadora de Quartil e Estatística",
  description:
    "Calculadora de quartil e estatística online gratuita. Calcule Q1, Q2, Q3, média, mediana, moda e tabelas de frequência.",
  url: `${baseUrl}/`,
  image: `${baseUrl}/img/og-preview-desktop.png`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Person",
    name: "Luís Antonio Souza Teixeira",
    url: "https://github.com/LuisT-ls",
  },
  inLanguage: "pt-BR",
  featureList: [
    "Cálculo de quartis (Q1, Q2, Q3)",
    "Média, mediana e moda",
    "Desvio padrão e variância",
    "Tabela de frequência",
    "Gráficos: histograma e boxplot",
    "Conteúdo educativo (história, fórmulas, exemplos)",
    "Exportação em PDF, CSV, JSON, XLSX",
  ],
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
