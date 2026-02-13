"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Calculator } from "lucide-react";
import type { PassoQuartil } from "@/lib/stats";
import { obterPassosQuartis } from "@/lib/stats";
import { MathDisplay } from "@/components/ui/MathDisplay";

function PassoCard({ passo }: { passo: PassoQuartil }) {
  const usaLatex = passo.formulaLatex ?? passo.substituicaoLatex;

  return (
    <div className="rounded-xl border border-white/10 border-l-4 border-l-indigo-500/90 bg-slate-800/50 p-5 shadow-sm">
      <h4 className="mb-4 text-base font-semibold text-slate-100">{passo.titulo}</h4>
      <div className="space-y-4">
        {usaLatex ? (
          <>
            {passo.formulaLatex && (
              <div className="math-passo text-slate-200 text-[1.05rem]">
                <MathDisplay latex={passo.formulaLatex} displayMode />
              </div>
            )}
            {passo.substituicaoLatex && (
              <div className="math-passo text-cyan-300 text-[1.05rem]">
                <MathDisplay latex={passo.substituicaoLatex} displayMode />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2 font-mono text-sm">
            <p className="font-medium text-slate-200">{passo.formula}</p>
            <p className="text-cyan-300">{passo.substituicao}</p>
          </div>
        )}
        <p className="font-mono text-lg font-semibold text-emerald-400">= {passo.resultado}</p>
      </div>
      {passo.explicacao && (
        <p className="mt-4 text-xs leading-relaxed text-slate-400">{passo.explicacao}</p>
      )}
    </div>
  );
}

export function PassoAPassoQuartis({ dados }: { dados: number[] }) {
  const [expandido, setExpandido] = useState(false);
  const passos = obterPassosQuartis(dados);

  if (!passos || dados.length === 0) return null;

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setExpandido(!expandido)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/15 bg-slate-800/50 px-4 py-3 text-left text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700/50 hover:text-white"
        aria-expanded={expandido}
        aria-controls="passo-a-passo-quartis"
      >
        <span className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-blue-400" aria-hidden />
          Ver cálculo passo a passo
        </span>
        {expandido ? (
          <ChevronUp className="h-4 w-4 text-slate-400" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" aria-hidden />
        )}
      </button>

      {expandido && (
        <div
          id="passo-a-passo-quartis"
          className="mt-4 max-h-[480px] space-y-4 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/30 p-4"
          role="region"
          aria-label="Detalhes do cálculo dos quartis e amplitude interquartil"
        >
          <PassoCard passo={passos.q1} />
          <PassoCard passo={passos.q2} />
          <PassoCard passo={passos.q3} />
          <PassoCard passo={passos.iqr} />
        </div>
      )}
    </div>
  );
}
