export function MedidasPosicao() {
  return (
    <section className="mb-12" aria-labelledby="medidas-posicao-title">
      <h2 id="medidas-posicao-title" className="mb-4 text-2xl font-semibold">
        Medidas de Posição
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-lg font-medium">Média</h3>
          <div id="mediaResult" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Mediana</h3>
          <div id="medianaResult" />
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Moda</h3>
          <div id="modaResult" />
        </div>
      </div>
    </section>
  );
}
