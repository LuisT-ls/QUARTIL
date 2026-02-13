"use client";

import { useRef, useEffect } from "react";
import { FileText, FileSpreadsheet, Braces } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import {
  calcularMedia,
  calcularMediana,
  calcularModa,
  calcularDesvioPadrao,
  calcularQuartil,
} from "@/lib/stats";

type ExportFormat = "pdf" | "txt" | "csv" | "json" | "xlsx";

interface ExportPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportPopup({ isOpen, onClose }: ExportPopupProps) {
  const { currentData, isCalculated } = useCalculator();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  const exportData = async (formato: ExportFormat) => {
    if (!isCalculated || currentData.length === 0) {
      alert("Não há dados para exportar. Por favor, calcule os dados primeiro.");
      return;
    }

    const rol = currentData;
    const nomeArquivo = `estatistica_${new Date().toISOString().split("T")[0]}`;
    const media = calcularMedia(rol);
    const mediana = calcularMediana(rol);
    const moda = calcularModa(rol);
    const desvioPadrao = calcularDesvioPadrao(rol);
    const variancia = desvioPadrao * desvioPadrao;
    const cv = (desvioPadrao / media) * 100;
    const q1 = calcularQuartil(rol, 0.25);
    const q3 = calcularQuartil(rol, 0.75);
    const modaStr =
      typeof moda === "object"
        ? Array.isArray(moda)
          ? moda.join(", ")
          : String(moda)
        : String(moda);

    switch (formato) {
      case "pdf": {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Relatório de Estatística", 14, 22);
        doc.setFontSize(10);
        doc.text(`Data: ${new Date().toLocaleString()}`, 14, 30);
        doc.setFontSize(12);
        doc.text("Rol de Dados:", 14, 40);
        doc.setFontSize(10);
        const rolText = rol.join(", ");
        const splitRol = doc.splitTextToSize(rolText, 180);
        doc.text(splitRol, 14, 47);

        const stats = [
          `Número de Elementos: ${rol.length}`,
          `Média: ${media.toFixed(2)}`,
          `Mediana: ${mediana.toFixed(2)}`,
          `Moda: ${modaStr}`,
          `Desvio Padrão: ${desvioPadrao.toFixed(2)}`,
          `Variância: ${variancia.toFixed(2)}`,
          `Coeficiente de Variação: ${cv.toFixed(2)}%`,
          `Mínimo: ${Math.min(...rol)}`,
          `Máximo: ${Math.max(...rol)}`,
          `Amplitude: ${Math.max(...rol) - Math.min(...rol)}`,
          `Q1: ${q1.toFixed(2)}`,
          `Q2 (Mediana): ${mediana.toFixed(2)}`,
          `Q3: ${q3.toFixed(2)}`,
          `IQR: ${(q3 - q1).toFixed(2)}`,
        ];

        doc.setFontSize(12);
        doc.text("Estatísticas Descritivas:", 14, 70);
        doc.setFontSize(10);
        stats.forEach((s, i) => doc.text(s, 14, 77 + i * 7));

        doc.save(`${nomeArquivo}.pdf`);
        break;
      }

      case "txt": {
        const txt =
          `Calculadora de Estatística - Resultados\n` +
          `Data: ${new Date().toLocaleString()}\n\n` +
          `Rol (${rol.length} elementos): ${rol.join(", ")}\n\n` +
          `Estatísticas:\n` +
          `- Média: ${media.toFixed(2)}\n` +
          `- Mediana: ${mediana.toFixed(2)}\n` +
          `- Moda: ${modaStr}\n` +
          `- Desvio Padrão: ${desvioPadrao.toFixed(2)}\n` +
          `- Variância: ${variancia.toFixed(2)}\n` +
          `- CV: ${cv.toFixed(2)}%\n` +
          `- Q1: ${q1.toFixed(2)}\n` +
          `- Q2: ${mediana.toFixed(2)}\n` +
          `- Q3: ${q3.toFixed(2)}\n` +
          `- IQR: ${(q3 - q1).toFixed(2)}\n`;

        downloadFile(txt, `${nomeArquivo}.txt`, "text/plain");
        break;
      }

      case "csv": {
        let csv = `"Estatística","Valor"\n`;
        csv += `"Tamanho","${rol.length}"\n`;
        csv += `"Mínimo","${Math.min(...rol)}"\n`;
        csv += `"Máximo","${Math.max(...rol)}"\n`;
        csv += `"Amplitude","${Math.max(...rol) - Math.min(...rol)}"\n`;
        csv += `"Média","${media.toFixed(2)}"\n`;
        csv += `"Mediana","${mediana.toFixed(2)}"\n`;
        csv += `"Moda","${modaStr.replace(/"/g, '""')}"\n`;
        csv += `"Desvio Padrão","${desvioPadrao.toFixed(2)}"\n`;
        csv += `"Variância","${variancia.toFixed(2)}"\n`;
        csv += `"CV","${cv.toFixed(2)}%"\n`;
        csv += `"Q1","${q1.toFixed(2)}"\n`;
        csv += `"Q2","${mediana.toFixed(2)}"\n`;
        csv += `"Q3","${q3.toFixed(2)}"\n`;
        csv += `"IQR","${(q3 - q1).toFixed(2)}"\n\n`;
        csv += `"Rol"\n`;
        rol.forEach((v, i) => {
          csv += `"${i + 1}","${v}"\n`;
        });

        downloadFile(csv, `${nomeArquivo}.csv`, "text/csv");
        break;
      }

      case "json": {
        const json = {
          metadata: {
            date: new Date().toISOString(),
            totalElements: rol.length,
          },
          rawData: rol,
          descriptiveStatistics: {
            centralTendency: {
              mean: media.toFixed(2),
              median: mediana.toFixed(2),
              mode: typeof moda === "object" ? moda : [moda],
            },
            dispersion: {
              standardDeviation: desvioPadrao.toFixed(2),
              variance: variancia.toFixed(2),
              coefficientOfVariation: cv.toFixed(2),
              range: (Math.max(...rol) - Math.min(...rol)).toFixed(2),
            },
            quartiles: {
              Q1: q1.toFixed(2),
              Q2: mediana.toFixed(2),
              Q3: q3.toFixed(2),
              IQR: (q3 - q1).toFixed(2),
            },
          },
        };

        downloadFile(
          JSON.stringify(json, null, 2),
          `${nomeArquivo}.json`,
          "application/json"
        );
        break;
      }

      case "xlsx": {
        const XLSX = await import("xlsx");
        const wb = XLSX.utils.book_new();
        const statsData = [
          ["Calculadora de Estatística - Resultados", ""],
          ["Data", new Date().toLocaleString()],
          ["", ""],
          ["Estatística", "Valor"],
          ["Tamanho", rol.length],
          ["Mínimo", Math.min(...rol)],
          ["Máximo", Math.max(...rol)],
          ["Amplitude", Math.max(...rol) - Math.min(...rol)],
          ["Média", media.toFixed(2)],
          ["Mediana", mediana.toFixed(2)],
          ["Moda", modaStr],
          ["Desvio Padrão", desvioPadrao.toFixed(2)],
          ["Variância", variancia.toFixed(2)],
          ["CV", `${cv.toFixed(2)}%`],
          ["Q1", q1.toFixed(2)],
          ["Q2", mediana.toFixed(2)],
          ["Q3", q3.toFixed(2)],
          ["IQR", (q3 - q1).toFixed(2)],
        ];

        const ws = XLSX.utils.aoa_to_sheet(statsData);
        XLSX.utils.book_append_sheet(wb, ws, "Estatísticas");

        const rawData: (string | number)[][] = rol.map((v, i) => [i + 1, v]);
        rawData.unshift(["#", "Valor"]);
        const dataSheet = XLSX.utils.aoa_to_sheet(rawData);
        XLSX.utils.book_append_sheet(wb, dataSheet, "Dados");

        XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
        break;
      }
    }

    onClose();
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1060] flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-popup-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-900">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded p-2 text-2xl leading-none text-neutral-500 hover:bg-neutral-100"
          aria-label="Fechar"
        >
          &times;
        </button>
        <h3 id="export-popup-title" className="mb-4 text-xl font-semibold">
          Exportar Rol
        </h3>
        <p className="mb-4 text-neutral-600">Escolha o formato de exportação:</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["pdf", "PDF", "from-red-500 to-red-600", "0 0 15px rgba(239,68,68,0.3)", FileText],
              ["txt", "TXT", "from-amber-500 to-amber-600", "0 0 15px rgba(245,158,11,0.3)", FileText],
              ["csv", "CSV", "from-sky-500 to-sky-600", "0 0 15px rgba(14,165,233,0.3)", FileSpreadsheet],
              ["json", "JSON", "from-emerald-500 to-emerald-600", "0 0 15px rgba(16,185,129,0.3)", Braces],
              ["xlsx", "XLSX", "from-indigo-500 to-indigo-600", "0 0 15px rgba(99,102,241,0.3)", FileSpreadsheet],
            ] as [ExportFormat, string, string, string, typeof FileText][]
          ).map(([fmt, label, gradient, shadow, Icon]) => (
            <button
              key={fmt}
              type="button"
              onClick={() => exportData(fmt)}
              className={`inline-flex items-center gap-2 rounded-lg bg-gradient-to-r ${gradient} px-4 py-2.5 font-medium text-white transition-all duration-300 hover:opacity-90`}
              style={{ boxShadow: shadow }}
              aria-label={`Exportar como ${label}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
