import Link from "next/link";
import { Github, Linkedin, Mail, Send } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative mt-12 overflow-hidden bg-gradient-to-br from-[#4361ee] to-[#7209b7] py-12 text-white shadow-[0_10px_15px_rgba(0,0,0,0.1)] before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:rotate-[30deg] before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] before:content-['']"
      role="contentinfo"
      aria-label="Rodapé"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center text-lg drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] opacity-90">
            &copy; <time dateTime="2025">2025</time> Calculadora de Estatística.
            Todos os direitos reservados.
          </div>

          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/LuisT-ls"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full text-white/90 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.3)] transition-all hover:scale-110 hover:text-white hover:bg-white/20"
              title="GitHub"
            >
              <Github className="h-6 w-6" aria-hidden />
            </a>
            <a
              href="https://www.linkedin.com/in/luis-tei"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full text-white/90 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.3)] transition-all hover:scale-110 hover:text-white hover:bg-white/20"
              title="LinkedIn"
            >
              <Linkedin className="h-6 w-6" aria-hidden />
            </a>
            <a
              href="mailto:luishg213@outlook.com"
              className="flex h-12 w-6 items-center justify-center rounded-full text-white/90 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.3)] transition-all hover:scale-110 hover:text-white hover:bg-white/20"
              title="Email"
            >
              <Mail className="h-6 w-6" aria-hidden />
            </a>
          </div>

          <div className="mt-4">
            <Link
              href="mailto:luishg213@outlook.com"
              className="inline-flex items-center gap-2 rounded-3xl bg-[#4361ee] px-7 py-3 text-base font-medium text-white shadow-none transition-all hover:translate-y-[-2px] hover:scale-[1.04] hover:bg-[#7209b7] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 active:translate-y-px active:shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            >
              <Send className="h-4 w-4" aria-hidden />
              Entre em contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
