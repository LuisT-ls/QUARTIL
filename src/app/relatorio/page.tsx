import type { Metadata } from "next";
import { Suspense } from "react";
import { SharedReport } from "@/components/report/SharedReport";
import { baseUrl } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Relatório de Análise Estatística | Quartil",
  description: "Relatório compartilhável com resultados e metodologia da análise estatística.",
  alternates: {
    canonical: `${baseUrl}/relatorio`,
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

function ReportFallback() {
  return (
    <main className="container mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
      <p className="text-slate-400">Carregando relatório...</p>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<ReportFallback />}>
      <SharedReport />
    </Suspense>
  );
}
