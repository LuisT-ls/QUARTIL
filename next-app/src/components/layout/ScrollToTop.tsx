"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const SCROLL_THRESHOLD = 400;

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-28 right-6 z-[999] flex size-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 backdrop-blur-md transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-700/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      aria-label="Voltar ao topo"
    >
      <ChevronUp className="h-5 w-5 text-slate-200" aria-hidden />
    </button>
  );
}
