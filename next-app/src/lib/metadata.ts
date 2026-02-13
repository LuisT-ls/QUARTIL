import type { Metadata } from "next";

export const baseUrl = "https://quartil.vercel.app";

/** Código do Google Search Console. Configure GOOGLE_SITE_VERIFICATION no .env.local */
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

/** Título otimizado para SEO: 50-60 caracteres para melhor exibição nos resultados */
const seoTitle = "Calculadora de Quartil e Estatística | Média, Mediana, Moda";

/** Descrição otimizada: 70-155 caracteres para snippet no Google */
const seoDescription =
  "Calculadora de quartil e estatística online gratuita. Calcule Q1, Q2, Q3, média, mediana, moda e tabelas de frequência. Conteúdo educativo incluído.";

export const siteMetadata: Metadata = {
  ...(googleVerification && {
    verification: { google: googleVerification },
  }),
  metadataBase: new URL(baseUrl),
  title: seoTitle,
  description: seoDescription,
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
    "aprender estatística",
    "conteúdo educativo quartis",
  ],
  authors: [{ name: "Luís Antonio Souza Teixeira", url: "https://github.com/LuisT-ls" }],
  creator: "Luís Antonio Souza Teixeira",
  openGraph: {
    type: "website",
    url: `${baseUrl}/`,
    siteName: "Quartil - Calculadora de Estatística",
    locale: "pt_BR",
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        url: `${baseUrl}/imagem-preview.jpg`,
        width: 1200,
        height: 630,
        alt: "Calculadora de Quartil e Estatística - Ferramenta online para análise de dados",
        type: "image/jpeg",
      },
      {
        url: `${baseUrl}/logo/logo.png`,
        width: 1200,
        height: 630,
        alt: "Logo Quartil - Calculadora de Estatística",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@luis_teixeira",
    creator: "@luis_teixeira",
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        url: `${baseUrl}/imagem-preview.jpg`,
        width: 1200,
        height: 630,
        alt: "Calculadora de Quartil e Estatística",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${baseUrl}/`,
    languages: {
      "pt-BR": `${baseUrl}/`,
    },
  },
  manifest: "/manifest.json",
  applicationName: "Quartil - Calculadora de Estatística",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};
