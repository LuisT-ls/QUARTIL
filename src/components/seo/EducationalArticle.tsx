import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";

type EducationalArticleProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function EducationalArticle({ title, description, children }: EducationalArticleProps) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
        <Link href="/" className="hover:text-slate-200">Calculadora</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link href="/aprender" className="hover:text-slate-200">Aprender</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-slate-500">{title}</span>
      </nav>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md sm:p-10">
        <Link
          href="/aprender"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-200"
          aria-label="Voltar para aprender estatística"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Voltar para aprender
        </Link>

        <header className="mb-10 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-bold text-slate-100 md:text-4xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-400">{description}</p>
        </header>

        <div className="space-y-8 text-slate-300">{children}</div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <Link
            href="/#entrada-dados"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 font-medium text-white transition-all hover:from-blue-400 hover:to-blue-500"
          >
            <Calculator className="h-4 w-4" aria-hidden />
            Usar a calculadora
          </Link>
        </div>
      </article>
    </div>
  );
}
