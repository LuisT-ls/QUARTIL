"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertTriangle, ArrowLeft, Copy, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import {
  calculateSnapshotMetrics,
  deserializeAnalysisSnapshot,
} from "@/lib/analysisSnapshot";

function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "data desconhecida";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function SharedReport() {
  const searchParams = useSearchParams();
  const snapshot = useMemo(
    () => deserializeAnalysisSnapshot(searchParams.get("data") ?? ""),
    [searchParams]
  );
  const metrics = useMemo(
    () => (snapshot ? calculateSnapshotMetrics(snapshot) : null),
    [snapshot]
  );

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link do relatório copiado.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  if (!snapshot || !metrics) {
    return (
      <main className="container mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4 py-16">
        <section className="w-full rounded-2xl border border-amber-400/20 bg-slate-900/70 p-8 text-center shadow-xl" aria-labelledby="report-error-title">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-300" aria-hidden />
          <h1 id="report-error-title" className="text-2xl font-semibold text-slate-100">Relatório indisponível</h1>
          <p className="mt-3 text-slate-400">O link está incompleto, expirou ou não contém uma análise válida.</p>
          <Link href="/#entrada-dados" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white hover:bg-blue-400">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar para a calculadora
          </Link>
        </section>
      </main>
    );
  }

  const metricRows: Array<[string, string]> = [
    ["Quantidade de valores", String(metrics.count)],
    ["Soma", formatNumber(metrics.sum)],
    ["Mínimo", formatNumber(metrics.minimum)],
    ["Máximo", formatNumber(metrics.maximum)],
    ["Amplitude", formatNumber(metrics.range)],
    ["Média", formatNumber(metrics.mean)],
    ["Mediana (Q2)", formatNumber(metrics.median)],
    ["Moda", metrics.mode],
    ["Variância populacional", formatNumber(metrics.variance)],
    ["Desvio padrão", formatNumber(metrics.standardDeviation)],
    ["Coeficiente de variação", metrics.coefficientOfVariation === null ? "Indefinido (média igual a zero)" : `${formatNumber(metrics.coefficientOfVariation)}%`],
    ["Q1", formatNumber(metrics.q1)],
    ["Q3", formatNumber(metrics.q3)],
    ["IQR", formatNumber(metrics.iqr)],
    ["Outliers", String(metrics.outlierCount)],
  ];

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-md sm:p-8" aria-labelledby="report-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-300">Relatório compartilhável</p>
            <h1 id="report-title" className="text-3xl font-semibold text-slate-100">Relatório de análise estatística</h1>
            <p className="mt-2 text-sm text-slate-400">Gerado em {formatDate(snapshot.generatedAt)} · {metrics.count} valor(es)</p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <button type="button" onClick={copyCurrentUrl} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10">
              <Copy className="h-4 w-4" aria-hidden />
              Copiar link
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10">
              <Printer className="h-4 w-4" aria-hidden />
              Imprimir / PDF
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3 rounded-xl border border-amber-400/25 bg-amber-500/10 p-4 text-sm text-amber-100" role="note">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
          <p>Este link contém os valores da análise para reproduzir o relatório. Compartilhe-o apenas com pessoas autorizadas a ver esses dados.</p>
        </div>

        <section className="mt-8" aria-labelledby="report-metrics-title">
          <h2 id="report-metrics-title" className="mb-3 text-xl font-semibold text-slate-100">Resultados</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">Resultados estatísticos da análise</caption>
              <thead className="bg-white/5 text-slate-400">
                <tr><th className="px-4 py-3 font-medium">Indicador</th><th className="px-4 py-3 font-medium">Valor</th></tr>
              </thead>
              <tbody>
                {metricRows.map(([label, value]) => (
                  <tr key={label} className="border-t border-white/5">
                    <th className="px-4 py-3 font-medium text-slate-300">{label}</th>
                    <td className="px-4 py-3 text-slate-100">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="report-methodology-title">
          <h2 id="report-methodology-title" className="mb-3 text-xl font-semibold text-slate-100">Metodologia</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><strong className="text-slate-100">Quartis:</strong> {snapshot.methodology.quartiles}</li>
            <li><strong className="text-slate-100">Variância:</strong> {snapshot.methodology.variance}</li>
            <li><strong className="text-slate-100">Outliers:</strong> {snapshot.methodology.outliers}</li>
          </ul>
        </section>

        <section className="mt-8" aria-labelledby="report-data-title">
          <h2 id="report-data-title" className="mb-3 text-xl font-semibold text-slate-100">Dados utilizados</h2>
          <details className="rounded-xl border border-white/10 bg-white/5 p-4">
            <summary className="cursor-pointer font-medium text-slate-200">Exibir rol ordenado ({snapshot.values.length} valores)</summary>
            <p className="mt-3 break-words text-sm text-slate-400">{snapshot.values.join(" · ")}</p>
          </details>
        </section>

        <div className="mt-8 border-t border-white/10 pt-5 print:hidden">
          <Link href="/#entrada-dados" className="inline-flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Abrir calculadora
          </Link>
        </div>
      </article>
    </main>
  );
}
