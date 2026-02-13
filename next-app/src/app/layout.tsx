import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Header, Footer, Watermark } from "@/components/layout";
import { siteMetadata } from "@/lib/metadata";
import "./globals.css";

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
        <link rel="canonical" href="https://quartil.vercel.app/" />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <Watermark />
        <Header />
        <main id="main" role="main" aria-label="Conteúdo principal">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
