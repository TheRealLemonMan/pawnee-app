import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { eliminarAvistamiento, obtenerAvistamientos } from "../api/avistamientosApi";
import { AvisoError, Cargando, Vacio } from "../componentes/Estados";
import { ModalConfirmacion } from "../componentes/ModalConfirmacion";
import { Avistamiento, Criatura } from "../tipos";
import { ETIQUETA_TIPO, formatearFecha } from "../util/etiquetas";
import { useTitulo } from "../util/useTitulo";

function criaturaDe(avistamiento: Avistamiento): Criatura | null {
  const criatura = avistamiento.criatura;
  if (criatura && typeof criatura === "object" && "_id" in criatura) return criatura;
  return null;
}

export function ListaAvistamientos() {
  const [avistamientos, setAvistamientos] = useState<Avistamiento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const [pendiente, setPendiente] = useState<Avistamiento | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  useTitulo("Avistamientos");

  useEffect(() => {
    setCargando(true);
    setError(null);
    obtenerAvistamientos()
      .then(setAvistamientos)
      .catch((err: unknown) => {
        setAvistamientos([]);
        setError(err instanceof Error ? err.message : "Error al cargar los avistamientos.");
      })
      .finally(() => setCargando(false));
  }, [intento]);

  const ordenados = useMemo(
    () => [...avistamientos].sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha)),
    [avistamientos]
  );

  async function confirmarEliminar() {
    if (!pendiente) return;
    setEliminando(true);
    setErrorModal(null);
    try {
      await eliminarAvistamiento(pendiente._id);
      setAvistamientos((lista) => lista.filter((avistamiento) => avistamiento._id !== pendiente._id));
      setPendiente(null);
    } catch (err) {
      setErrorModal(err instanceof Error ? err.message : "No se pudo eliminar el avistamiento.");
    } finally {
      setEliminando(false);
    }
  }

  return (
    <section className="pagina">
      <header className="encabezado">
        <div>
          <p className="sobrelinea">Bitácora de campo</p>
          <h1>Avistamientos</h1>
          <p className="lede">Quién vio qué, y en qué rincón de Pawnee decidió contarlo.</p>
        </div>
        <Link className="boton boton-primario" to="/avistamientos/nuevo">
          Registrar avistamiento
        </Link>
      </header>

      {cargando && <Cargando etiqueta="Revisando la bitácora…" />}
      {!cargando && error && <AvisoError mensaje={error} onReintentar={() => setIntento((valor) => valor + 1)} />}
      {!cargando && !error && ordenados.length === 0 && (
        <Vacio
          titulo="Todavía no hay notas de campo"
          texto="Cuando alguien vea algo que no debería estar en el césped, el registro empieza aquí."
          accion={
            <Link className="boton boton-primario" to="/avistamientos/nuevo">
              Anotar el primero
            </Link>
          }
        />
      )}

      {!cargando && !error && ordenados.length > 0 && (
        <ol className="linea-tiempo">
          {ordenados.map((avistamiento) => {
            const criatura = criaturaDe(avistamiento);
            return (
              <li className="hito" key={avistamiento._id}>
                <span className="hito-punto" aria-hidden="true" />
                <article className="hito-cuerpo">
                  <div className="hito-cabeza">
                    <p className="hito-fecha">{formatearFecha(avistamiento.fecha)}</p>
                    <button
                      type="button"
                      className="boton-texto boton-texto-peligro"
                      onClick={() => {
                        setErrorModal(null);
                        setPendiente(avistamiento);
                      }}
                    >
                      Retirar
                    </button>
                  </div>
                  <h2>
                    {criatura ? (
                      <Link to={`/criaturas/${criatura._id}`}>{criatura.nombre}</Link>
                    ) : (
                      "Criatura sin expediente"
                    )}
                  </h2>
                  {criatura && (
                    <p className="insignia" data-tipo={criatura.tipo}>
                      {ETIQUETA_TIPO[criatura.tipo]}
                    </p>
                  )}
                  <p className="nota-linea">
                    <strong>{avistamiento.testigo}</strong>
                    <span> en {avistamiento.ubicacion}</span>
                  </p>
                  {avistamiento.descripcion && <p className="cita">{avistamiento.descripcion}</p>}
                </article>
              </li>
            );
          })}
        </ol>
      )}

      <ModalConfirmacion
        abierto={Boolean(pendiente)}
        titulo="¿Retirar este avistamiento?"
        mensaje="La nota sale de la bitácora. La criatura se queda en el archivo."
        confirmar="Retirar nota"
        confirmando={eliminando}
        error={errorModal}
        onCerrar={() => {
          if (!eliminando) setPendiente(null);
        }}
        onConfirmar={confirmarEliminar}
      />
    </section>
  );
}
