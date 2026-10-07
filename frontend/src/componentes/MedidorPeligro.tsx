import { bandaPeligro, etiquetaPeligro } from "../util/etiquetas";

export function MedidorPeligro({ valor }: { valor: number }) {
  const seguro = Math.min(10, Math.max(1, valor || 1));
  const banda = bandaPeligro(seguro);

  return (
    <div
      className="medidor"
      data-banda={banda}
      role="meter"
      aria-valuemin={1}
      aria-valuemax={10}
      aria-valuenow={seguro}
      aria-valuetext={`${etiquetaPeligro(seguro)}, ${seguro} de 10`}
    >
      <div className="medidor-pista">
        <span className="medidor-relleno" style={{ width: `${seguro * 10}%` }} />
      </div>
      <span className="medidor-cifra">
        {seguro}
        <small>/10</small>
      </span>
    </div>
  );
}
