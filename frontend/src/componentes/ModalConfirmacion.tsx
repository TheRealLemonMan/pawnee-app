import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface PropsModal {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  confirmar: string;
  confirmando?: boolean;
  error?: string | null;
  onCerrar: () => void;
  onConfirmar: () => void;
}

export function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  confirmar,
  confirmando = false,
  error,
  onCerrar,
  onConfirmar,
}: PropsModal) {
  const cerrarRef = useRef(onCerrar);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    if (!abierto) return;
    cancelarRef.current?.focus();
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function alTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !confirmando) cerrarRef.current();
    }

    window.addEventListener("keydown", alTeclar);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", alTeclar);
    };
  }, [abierto, confirmando]);

  if (!abierto) return null;

  return createPortal(
    <div
      className="velo"
      onClick={() => {
        if (!confirmando) onCerrar();
      }}
    >
      <div
        className="dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-dialogo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <p className="sobrelinea">Confirmar archivo</p>
        <h2 id="titulo-dialogo">{titulo}</h2>
        <p>{mensaje}</p>
        {error && (
          <p className="ayuda ayuda-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialogo-acciones">
          <button ref={cancelarRef} type="button" className="boton boton-secundario" onClick={onCerrar} disabled={confirmando}>
            Cancelar
          </button>
          <button type="button" className="boton boton-peligro boton-peligro-solido" onClick={onConfirmar} disabled={confirmando}>
            {confirmando ? "Eliminando…" : confirmar}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
