import { baseUrl } from "@/lib/metadata";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Aprender Estatística - Quartis, Gráficos e Medidas",
  description:
    "Conteúdo educativo sobre quartis, medidas de posição (média, mediana, moda), gráficos (histograma, boxplot) e tabela de frequência. História, fórmulas e exemplos resolvidos.",
  url: `${baseUrl}/aprender`,
  inLanguage: "pt-BR",
  educationalLevel: "Ensino médio e superior",
  teaches: [
    "Quartis (Q1, Q2, Q3) e IQR",
    "Medidas de posição: média, mediana, moda",
    "Histograma e boxplot",
    "Tabela de frequência e fórmula de Sturges",
  ],
  about: {
    "@type": "Thing",
    name: "Estatística descritiva",
  },
  isPartOf: {
    "@type": "WebApplication",
    name: "Calculadora de Quartil e Estatística",
    url: baseUrl,
  },
};

export default function AprenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
