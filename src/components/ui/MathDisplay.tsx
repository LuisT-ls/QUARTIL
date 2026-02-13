"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathDisplayProps {
  /** Expressão LaTeX para renderizar */
  latex: string;
  /** Modo display (bloco centralizado) ou inline */
  displayMode?: boolean;
  className?: string;
}

export function MathDisplay({ latex, displayMode = true, className = "" }: MathDisplayProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || !latex) return;
    try {
      katex.render(latex, ref.current, {
        displayMode,
        throwOnError: false,
        output: "html",
        strict: false,
      });
    } catch {
      ref.current.textContent = latex;
    }
  }, [latex, displayMode]);

  return <span ref={ref} className={className} aria-hidden />;
}
