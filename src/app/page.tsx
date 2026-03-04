"use client";

import { useCalculator, CalculatorProvider } from "@/context/CalculatorContext";
import { CalculatorSection } from "@/components/calculator/CalculatorSection";
import { MedidasPosicao } from "@/components/sections/MedidasPosicao";
import { MedidasDispersao } from "@/components/sections/MedidasDispersao";
import { QuartisSection } from "@/components/sections/QuartisSection";
import { GraficosSection } from "@/components/sections/GraficosSection";
import { TabelaFrequenciaSection } from "@/components/sections/TabelaFrequenciaSection";
import { TabelaFrequenciaManualSection } from "@/components/sections/TabelaFrequenciaManualSection";
import { CasosUsoSection } from "@/components/sections/CasosUsoSection";
import { EducativoSection } from "@/components/sections/EducativoSection";
import { FadeInView } from "@/components/ui/FadeInView";

function MainContent() {
  const { isCalculated } = useCalculator();

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 pb-8">
      <CalculatorSection />

      {isCalculated && (
        <>
          <FadeInView delay={0.1}>
            <MedidasPosicao />
          </FadeInView>

          <FadeInView delay={0.2}>
            <MedidasDispersao />
          </FadeInView>

          <FadeInView delay={0.3}>
            <QuartisSection />
          </FadeInView>

          <FadeInView delay={0.4}>
            <GraficosSection />
          </FadeInView>
        </>
      )}

      {/* Exibimos as tabelas e seções contínuas com outro delay isolado ou de forma padrão */}
      <FadeInView delay={isCalculated ? 0.5 : 0.1}>
        <TabelaFrequenciaSection />
      </FadeInView>

      <FadeInView delay={isCalculated ? 0.6 : 0.2}>
        <TabelaFrequenciaManualSection />
      </FadeInView>

      <FadeInView delay={isCalculated ? 0.7 : 0.3}>
        <CasosUsoSection />
      </FadeInView>

      <FadeInView delay={isCalculated ? 0.8 : 0.4}>
        <EducativoSection />
      </FadeInView>
    </div>
  );
}

export default function Home() {
  return (
    <CalculatorProvider>
      <MainContent />
    </CalculatorProvider>
  );
}
