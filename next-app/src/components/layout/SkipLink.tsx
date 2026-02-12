"use client";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link fixed left-4 top-4 z-[1070] -translate-y-full bg-[#4361ee] px-4 py-2 text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
    >
      Pular para o conteúdo principal
    </a>
  );
}
