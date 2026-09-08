"use client";

import { ChevronDown, Settings2 } from "lucide-react";
import { useCalculator } from "@/context/CalculatorContext";
import { trackEvent } from "@/lib/analytics";

export function StatisticsSettingsPanel() {
  const {
    currentData,
    statisticsSettings,
    setStatisticsSettings,
    excludedOutlierCount,
  } = useCalculator();

  const updateSetting = <K extends keyof typeof statisticsSettings>(
    key: K,
    value: (typeof statisticsSettings)[K]
  ) => {
    if (key === "outlierPolicy" && value === "exclude" && currentData.length > 0) {
      const confirmed = window.confirm(
        "Os outliers serão removidos das métricas, tabelas e gráficos, mas continuarão preservados nos dados originais. Deseja continuar?"
      );
      if (!confirmed) return;
    }

    setStatisticsSettings({ [key]: value });
    trackEvent("statistics_settings_changed", { setting: String(key), value: String(value) });
  };

  const quartileLabel = statisticsSettings.quartileMethod === "interpolated"
    ? "Interpolação (n − 1) × p"
    : "Mediana das metades (Tukey)";
  const varianceLabel = statisticsSettings.varianceMethod === "population"
    ? "Populacional (divide por n)"
    : "Amostral (divide por n − 1)";

  const selectClassName = "w-full appearance-none rounded-lg border border-white/15 bg-slate-900 px-3 py-2 pr-10 text-slate-100 shadow-inner shadow-black/10 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 hover:border-white/25";

  const selectIcon = (
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors"
      aria-hidden
    />
  );

  return (
    <details className="mt-4 rounded-xl border border-white/10 bg-slate-950/30 p-4">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-slate-200">
        <Settings2 className="h-4 w-4 text-blue-300" aria-hidden />
        Configurações estatísticas
        <span className="ml-auto text-xs font-normal text-slate-500">Ajustar metodologia</span>
      </summary>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5 text-sm text-slate-300">
          <span className="block font-medium">Método dos quartis</span>
          <div className="relative">
            <select
              value={statisticsSettings.quartileMethod}
              onChange={(event) => updateSetting("quartileMethod", event.target.value as typeof statisticsSettings.quartileMethod)}
              className={selectClassName}
            >
              <option value="interpolated">{quartileLabel}</option>
              <option value="median-halves">Mediana das metades (Tukey)</option>
            </select>
            {selectIcon}
          </div>
          <span className="block text-xs text-slate-500">Afeta Q1, Q3, IQR, outliers e boxplot.</span>
        </label>

        <label className="space-y-1.5 text-sm text-slate-300">
          <span className="block font-medium">Variância e desvio padrão</span>
          <div className="relative">
            <select
              value={statisticsSettings.varianceMethod}
              onChange={(event) => updateSetting("varianceMethod", event.target.value as typeof statisticsSettings.varianceMethod)}
              className={selectClassName}
            >
              <option value="population">{varianceLabel}</option>
              <option value="sample">Amostral (divide por n − 1)</option>
            </select>
            {selectIcon}
          </div>
          <span className="block text-xs text-slate-500">Escolha populacional quando os dados representam todo o grupo.</span>
        </label>

        <label className="space-y-1.5 text-sm text-slate-300">
          <span className="block font-medium">Dados inválidos na importação</span>
          <div className="relative">
            <select
              value={statisticsSettings.invalidDataPolicy}
              onChange={(event) => updateSetting("invalidDataPolicy", event.target.value as typeof statisticsSettings.invalidDataPolicy)}
              className={selectClassName}
            >
              <option value="ignore">Ignorar e avisar</option>
              <option value="block">Bloquear até revisar</option>
            </select>
            {selectIcon}
          </div>
          <span className="block text-xs text-slate-500">Controla células inválidas encontradas em CSV/XLSX.</span>
        </label>

        <label className="space-y-1.5 text-sm text-slate-300">
          <span className="block font-medium">Tratamento de outliers</span>
          <div className="relative">
            <select
              value={statisticsSettings.outlierPolicy}
              onChange={(event) => updateSetting("outlierPolicy", event.target.value as typeof statisticsSettings.outlierPolicy)}
              className={selectClassName}
            >
              <option value="flag">Sinalizar, sem excluir</option>
              <option value="exclude">Excluir das métricas</option>
            </select>
            {selectIcon}
          </div>
          <span className="block text-xs text-slate-500">{excludedOutlierCount > 0 ? `${excludedOutlierCount} outlier(s) excluído(s) atualmente.` : "Os dados originais permanecem preservados."}</span>
        </label>
      </div>
    </details>
  );
}
