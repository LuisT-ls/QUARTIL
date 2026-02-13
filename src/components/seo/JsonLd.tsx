import { baseUrl } from "@/lib/metadata";

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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
