import type { Metadata } from "next";

const baseUrl = "https://quartil.vercel.app";

export const siteMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title:
    "Calculadora de Quartil e Estatística Online | Média, Mediana, Moda, Desvio Padrão",
  description:
    "Calculadora de quartil e estatística online gratuita. Calcule quartis (Q1, Q2, Q3), média, mediana, moda, desvio padrão, variância e crie tabelas de frequência. Ferramenta completa para análise estatística.",
  keywords: [
    "calculadora de quartil",
    "calculadora de estatística",
    "quartis Q1 Q2 Q3",
    "média aritmética",
    "mediana",
    "moda",
    "desvio padrão",
    "variância",
    "tabela de frequência",
    "estatística online",
    "análise de dados",
    "medidas de posição",
    "medidas de dispersão",
    "boxplot",
    "histograma",
  ],
  authors: [{ name: "Luís Antonio Souza Teixeira", url: "https://github.com/LuisT-ls" }],
  creator: "Luís Antonio Souza Teixeira",
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "Quartil - Calculadora de Estatística",
    locale: "pt_BR",
    title:
      "Calculadora de Quartil e Estatística Online | Média, Mediana, Moda, Desvio Padrão",
    description:
      "Calculadora de quartil e estatística online gratuita. Calcule quartis (Q1, Q2, Q3), média, mediana, moda, desvio padrão, variância e crie tabelas de frequência.",
    images: [
      {
        url: `${baseUrl}/logo/logo.png`,
        width: 1200,
        height: 630,
        alt: "Quartil - Calculadora de Estatística",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@luis_teixeira",
    creator: "@luis_teixeira",
    title:
      "Calculadora de Quartil e Estatística Online | Média, Mediana, Moda, Desvio Padrão",
    description:
      "Calculadora de quartil e estatística online gratuita. Calcule quartis (Q1, Q2, Q3), média, mediana, moda, desvio padrão, variância.",
    images: [`${baseUrl}/imagem-preview.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};
