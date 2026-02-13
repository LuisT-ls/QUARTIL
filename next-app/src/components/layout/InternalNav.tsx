"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function InternalNav() {
  return (
    <nav aria-label="Conteúdo educativo" className="mt-4 flex justify-center">
      <Link
        href="/aprender"
        className="inline-flex items-center gap-1.5 text-sm text-white/90 underline decoration-white/40 underline-offset-2 transition-colors hover:text-white hover:decoration-white"
      >
        <BookOpen className="h-4 w-4" aria-hidden />
        Conteúdo educativo
      </Link>
    </nav>
  );
}
