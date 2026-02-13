"use client";

import dynamic from "next/dynamic";

/** KaTeX só é carregado quando o usuário expande "Ver cálculo passo a passo" */
export const MathDisplay = dynamic(
  () => import("./MathDisplay").then((mod) => mod.MathDisplay),
  { ssr: false, loading: () => <span className="inline-block h-6 w-16 animate-pulse rounded bg-slate-600" /> }
);
