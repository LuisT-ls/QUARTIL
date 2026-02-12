import Image from "next/image";

export function Header() {
  return (
    <header
      className="relative mb-12 overflow-hidden bg-gradient-to-br from-[#4361ee] to-[#7209b7] py-12 text-white shadow-[0_10px_15px_rgba(0,0,0,0.1)] before:absolute before:-left-1/2 before:-top-1/2 before:h-[200%] before:w-[200%] before:rotate-[30deg] before:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] before:content-['']"
      role="banner"
    >
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="mb-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Image
            src="/logo/logo.svg"
            alt="Logo da Calculadora de Quartil e Estatística: gráfico de barras estilizado com as letras Q e L em destaque"
            className="h-10 w-10 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] sm:h-[60px] sm:w-[60px]"
            width={60}
            height={60}
            loading="eager"
            priority
          />
          <h1 className="m-0 text-center text-2xl font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] sm:text-3xl">
            Calculadora de Quartil e Estatística
          </h1>
        </div>
        <p className="mx-auto max-w-[600px] text-center text-lg opacity-90">
          Rápida, precisa e fácil de usar. Calcule quartis (Q1, Q2, Q3), média,
          mediana, moda, desvio padrão e muito mais!
        </p>
      </div>
    </header>
  );
}
