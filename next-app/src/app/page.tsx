import { CalculatorSection } from "@/components/calculator/CalculatorSection";
import { MedidasPosicao } from "@/components/sections/MedidasPosicao";
import { MedidasDispersao } from "@/components/sections/MedidasDispersao";
import { QuartisSection } from "@/components/sections/QuartisSection";
import { GraficosSection } from "@/components/sections/GraficosSection";
import { TabelaFrequenciaSection } from "@/components/sections/TabelaFrequenciaSection";
import { TabelaFrequenciaManualSection } from "@/components/sections/TabelaFrequenciaManualSection";
import { CasosUsoSection } from "@/components/sections/CasosUsoSection";
import { EducativoSection } from "@/components/sections/EducativoSection";

export default function Home() {
  return (
    <div className="container mx-auto max-w-6xl px-4 pb-8">
      <CalculatorSection />
      <MedidasPosicao />
      <MedidasDispersao />
      <QuartisSection />
      <GraficosSection />
      <TabelaFrequenciaSection />
      <TabelaFrequenciaManualSection />
      <CasosUsoSection />
      <EducativoSection />
    </div>
  );
}
