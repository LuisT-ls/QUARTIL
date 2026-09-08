export const faqItems = [
  {
    question: "Como calcular quartis Q1, Q2 e Q3?",
    answer:
      "Use a fórmula de percentil interpolado: posição = (n − 1) × p, onde p é 0,25 para Q1, 0,5 para Q2 (mediana) e 0,75 para Q3. Se a posição for inteira, o valor é o dado correspondente. Se for decimal, interpole entre os dois valores vizinhos. Use nossa calculadora de quartil online para resultados instantâneos.",
  },
  {
    question: "Como calcular quartil em dados agrupados?",
    answer:
      "Para dados agrupados em classes, use a fórmula do quartil baseada na frequência acumulada. Ou insira os dados brutos na calculadora de quartil online e gere a tabela de frequência automaticamente.",
  },
  {
    question: "Quartil e mediana são a mesma coisa?",
    answer:
      "O Q2 (segundo quartil) é exatamente a mediana: o valor central que divide os dados ao meio. Q1 e Q3 dividem cada metade ao meio.",
  },
] as const;

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};
