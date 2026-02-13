"use client";

import Link from "next/link";

const sections = [
  { href: "/#entrada-dados", label: "Entrada de Dados" },
  { href: "/#medidas-posicao", label: "Medidas de Posição" },
  { href: "/#medidas-dispersao", label: "Medidas de Dispersão" },
  { href: "/#quartis", label: "Quartis" },
  { href: "/#graficos", label: "Gráficos" },
  { href: "/#tabela-frequencia", label: "Tabela de Frequência" },
  { href: "/#educativo", label: "Quartis - Educativo" },
] as const;

export function InternalNav() {
  return (
    <nav aria-label="Navegação entre seções" className="mt-4 flex flex-wrap justify-center gap-2">
      {sections.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-white/90 transition-colors hover:border-blue-400/50 hover:bg-white/10 hover:text-white"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
