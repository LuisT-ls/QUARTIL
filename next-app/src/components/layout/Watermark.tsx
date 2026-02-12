"use client";

import Link from "next/link";

export function Watermark() {
  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      <Link
        href="https://github.com/LuisT-ls"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-inherit no-underline"
        title="Desenvolvido por Luís Teixeira"
      >
        <div className="watermark-logo relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white to-neutral-100 shadow-[5px_5px_10px_#d9d9d9,-5px_-5px_10px_#fff] transition-all duration-300 hover:w-48 hover:rounded-3xl hover:shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#fff] group">
          <div className="logo-ring absolute inset-0 animate-[spin_2s_linear_infinite] rounded-full border-2 border-transparent border-t-[#0066cc]" />
          <span className="logo-initials relative z-[2] text-xl font-bold text-[#0066cc] transition-transform duration-300 group-hover:-translate-x-[70px]">
            LT
          </span>
          <div className="logo-text pointer-events-none absolute right-14 text-right opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            <span className="mb-0.5 block text-xs text-neutral-600">
              Desenvolvido por
            </span>
            <span className="block text-sm font-semibold text-[#0066cc]">
              Luís Teixeira
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
