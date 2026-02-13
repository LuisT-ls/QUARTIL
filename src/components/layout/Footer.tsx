import Link from "next/link";
import { Github, Linkedin, Mail, Send } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="relative mt-16 border-t border-t-white/15 border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/90 py-12 backdrop-blur-sm"
      role="contentinfo"
      aria-label="Rodapé"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/aprender"
              className="text-sm text-slate-400 underline-offset-2 transition-colors hover:text-slate-200"
            >
              Conteúdo educativo
            </Link>
          </div>
          <p className="text-center text-sm text-slate-400">
            &copy; <time dateTime="2026">2026</time> Calculadora de Estatística.
            Todos os direitos reservados.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/LuisT-ls"
              target="_blank"
              rel="noopener noreferrer me"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-800/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-slate-100"
              title="Luís Teixeira no GitHub"
              aria-label="Luís Teixeira no GitHub"
            >
              <Github className="h-5 w-5" aria-hidden />
              <span className="sr-only">Perfil de Luís Teixeira no GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/luis-tei"
              target="_blank"
              rel="noopener noreferrer me"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-800/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-slate-100"
              title="Luís Teixeira no LinkedIn"
              aria-label="Luís Teixeira no LinkedIn"
            >
              <Linkedin className="h-5 w-5" aria-hidden />
              <span className="sr-only">Perfil de Luís Teixeira no LinkedIn</span>
            </a>
            <a
              href="mailto:luishg213@outlook.com"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-800/50 text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-slate-100"
              title="Enviar email para contato"
              aria-label="Enviar email para contato"
            >
              <Mail className="h-5 w-5" aria-hidden />
              <span className="sr-only">Enviar email para contato</span>
            </a>
          </div>

          <Link
            href="mailto:luishg213@outlook.com"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
            title="Entre em contato por email"
          >
            <Send className="h-4 w-4" aria-hidden />
            Entre em contato
          </Link>
        </div>
      </div>
    </footer>
  );
}
