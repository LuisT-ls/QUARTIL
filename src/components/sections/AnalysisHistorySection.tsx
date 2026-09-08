"use client";

import { useMemo, useState } from "react";
import { Copy, History, Pencil, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCalculator } from "@/context/CalculatorContext";
import { useAnalysisHistory, analysisHistoryStore, type AnalysisRecord } from "@/lib/analysisHistory";
import {
  calcularDesvioPadrao,
  calcularMediana,
  calcularMedia,
  calcularOutliers,
  calcularQuartil,
} from "@/lib/stats";
import { trackEvent } from "@/lib/analytics";
import { normalizeStatisticsSettings } from "@/lib/statisticsSettings";

interface AnalysisSummary {
  count: number;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  standardDeviation: number;
  outliers: number;
}

function summarize(values: number[], settings = normalizeStatisticsSettings(null)): AnalysisSummary {
  const analysisValues = settings.outlierPolicy === "exclude"
    ? values.filter((value) => {
      const result = calcularOutliers(values, settings.quartileMethod);
      return value >= result.limiteInferior && value <= result.limiteSuperior;
    })
    : values;
  const outlierResult = calcularOutliers(analysisValues, settings.quartileMethod);

  return {
    count: analysisValues.length,
    mean: calcularMedia(analysisValues),
    median: calcularMediana(analysisValues),
    q1: calcularQuartil(analysisValues, 0.25, settings.quartileMethod),
    q3: calcularQuartil(analysisValues, 0.75, settings.quartileMethod),
    standardDeviation: calcularDesvioPadrao(analysisValues, null, settings.varianceMethod),
    outliers: outlierResult.inferior.length + outlierResult.superior.length,
  };
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function metricRows(first: AnalysisSummary, second: AnalysisSummary) {
  return [
    ["Valores", first.count, second.count, false],
    ["Média", first.mean, second.mean, true],
    ["Mediana", first.median, second.median, true],
    ["Q1", first.q1, second.q1, true],
    ["Q3", first.q3, second.q3, true],
    ["Desvio padrão", first.standardDeviation, second.standardDeviation, true],
    ["Outliers", first.outliers, second.outliers, false],
  ] as const;
}

export function AnalysisHistorySection() {
  const { currentData, isCalculated, calculateData, statisticsSettings, setStatisticsSettings } = useCalculator();
  const history = useAnalysisHistory();
  const [name, setName] = useState("Minha análise");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const selectedAnalyses = useMemo(
    () => selectedIds.map((id) => history.find((record) => record.id === id)).filter(Boolean) as AnalysisRecord[],
    [history, selectedIds]
  );

  const comparison = useMemo(() => {
    if (selectedAnalyses.length !== 2) return null;
    return [
      summarize(selectedAnalyses[0].values, normalizeStatisticsSettings(selectedAnalyses[0].settings)),
      summarize(selectedAnalyses[1].values, normalizeStatisticsSettings(selectedAnalyses[1].settings)),
    ] as const;
  }, [selectedAnalyses]);

  if (!isCalculated && history.length === 0) return null;

  const saveCurrent = () => {
    if (!isCalculated || currentData.length === 0) {
      toast.error("Calcule uma análise antes de salvá-la.");
      return;
    }

    const record = analysisHistoryStore.save({ name, values: currentData, settings: statisticsSettings });
    if (!record) {
      toast.error("Informe um nome válido para salvar a análise.");
      return;
    }

    setName("Minha análise");
    toast.success("Análise salva no histórico local.");
    trackEvent("save_analysis_history", { count: record.values.length });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((selectedId) => selectedId !== id);
      if (current.length >= 2) {
        toast.info("Selecione no máximo duas análises para comparar.");
        return current;
      }
      return [...current, id];
    });
  };

  const loadAnalysis = (record: AnalysisRecord) => {
    setStatisticsSettings(normalizeStatisticsSettings(record.settings));
    calculateData(record.values);
    toast.success(`“${record.name}” carregada na calculadora.`);
    trackEvent("load_analysis_history", { count: record.values.length });
  };

  const removeAnalysis = (record: AnalysisRecord) => {
    if (!window.confirm(`Excluir a análise “${record.name}” do histórico local?`)) return;
    analysisHistoryStore.remove(record.id);
    setSelectedIds((current) => current.filter((id) => id !== record.id));
    toast.success("Análise removida do histórico.");
  };

  const startRename = (record: AnalysisRecord) => {
    setEditingId(record.id);
    setEditingName(record.name);
  };

  const finishRename = () => {
    if (!editingId) return;
    const normalizedName = editingName.trim();
    if (!normalizedName) {
      toast.error("Informe um nome válido.");
      return;
    }
    analysisHistoryStore.rename(editingId, normalizedName);
    setEditingId(null);
    setEditingName("");
  };

  const duplicateAnalysis = (record: AnalysisRecord) => {
    analysisHistoryStore.duplicate(record.id);
    toast.success("Cópia criada no histórico.");
  };

  return (
    <section className="rounded-2xl border border-white/10 border-t-white/15 bg-gradient-to-br from-slate-800/50 to-slate-900/80 p-6 backdrop-blur-md" aria-labelledby="historico-title">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <History className="mt-1 h-6 w-6 text-blue-300" aria-hidden />
          <div>
            <h2 id="historico-title" className="text-xl font-semibold text-slate-100">Histórico local</h2>
            <p className="mt-1 text-sm text-slate-400">
              Salve análises no navegador para reutilizar ou comparar depois. Os valores não são enviados para um servidor.
            </p>
          </div>
        </div>
        {isCalculated && (
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="analysis-name" className="sr-only">Nome da análise atual</label>
            <input
              id="analysis-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") saveCurrent();
              }}
              maxLength={80}
              className="w-44 rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
            <button
              type="button"
              onClick={saveCurrent}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-400"
            >
              <Save className="h-4 w-4" aria-hidden />
              Salvar análise
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <p className="rounded-lg border border-dashed border-white/15 p-4 text-sm text-slate-400">
          Ainda não há análises salvas. Dê um nome à análise atual e clique em “Salvar análise”.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            Selecione até duas análises para comparar os principais indicadores.
          </p>
          {history.map((record) => {
            const isSelected = selectedIds.includes(record.id);
            const isEditing = editingId === record.id;

            return (
              <article key={record.id} className={`rounded-xl border p-4 transition-colors ${isSelected ? "border-blue-400/60 bg-blue-500/10" : "border-white/10 bg-slate-900/30"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <label className="flex min-w-0 flex-1 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(record.id)}
                      className="mt-1 h-4 w-4 accent-blue-500"
                      aria-label={`Selecionar ${record.name} para comparação`}
                    />
                    <span className="min-w-0">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editingName}
                          onChange={(event) => setEditingName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") finishRename();
                            if (event.key === "Escape") setEditingId(null);
                          }}
                          onBlur={finishRename}
                          maxLength={80}
                          className="w-full rounded border border-blue-400/50 bg-slate-900 px-2 py-1 font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                          aria-label="Novo nome da análise"
                        />
                      ) : (
                        <span className="block truncate font-medium text-slate-100">{record.name}</span>
                      )}
                      <span className="mt-1 block text-xs text-slate-500">
                        {record.values.length} valor(es) · salva em {formatDate(record.updatedAt)}
                      </span>
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-1">
                    <button type="button" onClick={() => loadAnalysis(record)} className="rounded px-2 py-1 text-xs text-blue-300 hover:bg-blue-500/10" aria-label={`Carregar ${record.name}`}>
                      Carregar
                    </button>
                    <button type="button" onClick={() => startRename(record)} className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label={`Renomear ${record.name}`}>
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" onClick={() => duplicateAnalysis(record)} className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" aria-label={`Duplicar ${record.name}`}>
                      <Copy className="h-4 w-4" aria-hidden />
                    </button>
                    <button type="button" onClick={() => removeAnalysis(record)} className="rounded p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-300" aria-label={`Excluir ${record.name}`}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
                <p className="mt-3 truncate text-xs text-slate-500">{record.values.slice(0, 10).join(" · ")}{record.values.length > 10 ? " · …" : ""}</p>
              </article>
            );
          })}
        </div>
      )}

      {selectedAnalyses.length === 2 && comparison && (
        <div className="mt-5 overflow-x-auto rounded-xl border border-blue-400/25 bg-slate-950/30 p-4">
          <h3 className="mb-3 font-semibold text-slate-100">Comparação</h3>
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">Comparação entre duas análises salvas</caption>
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="px-3 py-2 font-medium">Indicador</th>
                <th className="px-3 py-2 font-medium">{selectedAnalyses[0].name}</th>
                <th className="px-3 py-2 font-medium">{selectedAnalyses[1].name}</th>
              </tr>
            </thead>
            <tbody>
              {metricRows(comparison[0], comparison[1]).map(([label, first, second, decimal]) => (
                <tr key={label} className="border-b border-white/5 last:border-0">
                  <th className="px-3 py-2 font-medium text-slate-300">{label}</th>
                  <td className="px-3 py-2 text-slate-200">{decimal ? formatNumber(first) : first}</td>
                  <td className="px-3 py-2 text-slate-200">{decimal ? formatNumber(second) : second}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
