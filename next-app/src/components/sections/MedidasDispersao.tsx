export function MedidasDispersao() {
  return (
    <section className="mb-12" aria-labelledby="medidas-dispersao-title">
      <h2 id="medidas-dispersao-title" className="mb-4 text-2xl font-semibold">
        Medidas de Dispersão
      </h2>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <h3 className="mb-3 text-lg font-medium">Desvio Padrão</h3>
          <div id="desvioPadraoResult" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Variância</h3>
          <div id="varianciaResult" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">
            Coeficiente de Variação (CV)
          </h3>
          <div id="cvResult" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Assimetria</h3>
          <div id="assimetriaResult" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Curtose</h3>
          <div id="curtoseResult" />
        </div>
      </div>
    </section>
  );
}
