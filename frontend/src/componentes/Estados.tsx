import { ReactNode } from "react";
import { Sello } from "./Sello";

export function Cargando({ etiqueta }: { etiqueta: string }) {
  return (
    <div className="cargando" role="status">
      <Sello className="sello sello-pulso" />
      <p>{etiqueta}</p>
    </div>
  );
}

export function EsqueletoFichas() {
  return (
    <div className="rejilla" aria-hidden="true">
      {Array.from({ length: 6 }, (_, indice) => (
        <div className="ficha ficha-esqueleto" key={indice}>
          <div className="hueso hueso-corto" />
          <div className="hueso hueso-titulo" />
          <div className="hueso" />
          <div className="hueso hueso-medio" />
        </div>
      ))}
    </div>
  );
}

export function EsqueletoExpediente() {
  return (
    <div role="status">
      <span className="sr-only">Cargando expediente</span>
      <div className="expediente-esqueleto" aria-hidden="true">
        <div className="hueso hueso-corto" />
        <div className="hueso hueso-titulo" />
        <div className="paneles">
          <div className="hueso-panel" />
          <div className="hueso-panel" />
          <div className="hueso-panel" />
        </div>
      </div>
    </div>
  );
}

export function AvisoError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <div className="aviso aviso-error" role="alert">
      <h2>El archivo no respondió</h2>
      <p>{mensaje}</p>
      {onReintentar && (
        <button type="button" className="boton boton-secundario" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}

export function Vacio({ titulo, texto, accion }: { titulo: string; texto: string; accion?: ReactNode }) {
  return (
    <div className="vacio">
      <Sello className="sello sello-suave" />
      <h2>{titulo}</h2>
      <p>{texto}</p>
      {accion}
    </div>
  );
}
