import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { Header, Footer, Watermark, ScrollToTop, OfflineModal } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteMetadata } from "@/lib/metadata";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-SZW57KN2PE";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <JsonLd />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
        <OfflineModal />
        <Watermark />
        <ScrollToTop />
        <Header />
        <main id="main" role="main" aria-label="Conteúdo principal">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
