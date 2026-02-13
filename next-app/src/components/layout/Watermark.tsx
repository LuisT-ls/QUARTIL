"use client";

import Link from "next/link";

export function Watermark() {
  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      <Link
        href="https://github.com/LuisT-ls"
        target="_blank"
        rel="noopener noreferrer"
        className="group block text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
        title="Desenvolvido por Luís Teixeira"
        aria-label="Desenvolvido por Luís Teixeira — GitHub"
      >
        <div className="watermark-badge relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 ease-out group-hover:w-52 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4),0_0_80px_rgba(34,211,238,0.2)]">
          {/* Camada base - glassmorphism */}
          <div className="absolute inset-0 rounded-2xl border border-white/20 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl transition-colors duration-500 group-hover:border-blue-400/40" />

          {/* Borda com gradiente e brilho */}
          <div className="watermark-border absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_100%] opacity-60 blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />

          {/* Anel orbital */}
          <div className="absolute inset-1 rounded-xl border border-white/10" />
          <div className="watermark-ring absolute inset-1 rounded-xl border-2 border-transparent border-t-blue-400/80 border-r-cyan-400/50" />

          {/* Conteúdo */}
          <div className="relative z-10 flex h-full w-full items-center justify-center px-4 group-hover:justify-start">
            <span className="flex size-10 shrink-0 items-center justify-center text-xl font-bold tracking-[0.02em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_16px_rgba(56,189,248,0.5)]">
              LT
            </span>
            <div className="flex max-w-0 flex-col overflow-hidden text-right opacity-0 transition-all duration-500 group-hover:max-w-[140px] group-hover:opacity-100 group-hover:ml-1">
              <span className="text-[10px] font-medium uppercase tracking-widest text-slate-300">
                Desenvolvido por
              </span>
              <span className="font-semibold text-slate-100 truncate">
                Luís Teixeira
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
