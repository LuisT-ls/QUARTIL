import type { Metadata } from "next";

export const baseUrl = "https://quartil.vercel.app";

/** Código do Google Search Console. Configure GOOGLE_SITE_VERIFICATION no .env.local */
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

/** Título otimizado para SEO/Bing: inclui "calculadora de quartil" (keyword de conversão) e "como calcular" */
const seoTitle = "Calculadora de Quartil Online | Como Calcular Quartis Q1 Q2 Q3 Grátis";

/** Descrição otimizada: CTA claro + keywords de alto volume (quartil estatística, calcular quartis) */
const seoDescription =
  "Calculadora de quartil e estatística online gratuita. Calcular quartis, média, mediana, moda e tabela de frequência. Análise de quartis instantânea. Sem cadastro.";

export const siteMetadata: Metadata = {
  ...(googleVerification && {
    verification: { google: googleVerification },
  }),
  metadataBase: new URL(baseUrl),
  title: seoTitle,
  description: seoDescription,
  keywords: [
    "calculadora de quartil",
    "calculadora de quartis",
    "quartil estatística",
    "como calcular quartis",
    "calcular quartis",
    "cálculo de quartis",
    "quartis Q1 Q2 Q3",
    "tabela de frequência estatística online",
    "média aritmética",
    "mediana",
    "moda",
    "desvio padrão",
    "análise de quartis",
    "calculadora de estatística",
    "boxplot",
    "histograma",
    "aprender estatística",
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
        url: `${baseUrl}/img/og-preview-desktop.png`,
        width: 1200,
        height: 630,
        alt: "Calculadora de Quartil e Estatística - Ferramenta online para análise de dados",
        type: "image/png",
      },
      {
        url: `${baseUrl}/img/og-preview-mobile.png`,
        width: 600,
        height: 800,
        alt: "Calculadora de Quartil - Preview mobile",
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
        url: `${baseUrl}/img/og-preview-desktop.png`,
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
