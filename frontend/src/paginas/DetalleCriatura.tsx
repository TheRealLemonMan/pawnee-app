import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eliminarCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { obtenerAvistamientosDeCriatura } from "../api/avistamientosApi";
import { AvisoError, EsqueletoExpediente } from "../componentes/Estados";
import { Icono } from "../componentes/Iconos";
import { MedidorPeligro } from "../componentes/MedidorPeligro";
import { ModalConfirmacion } from "../componentes/ModalConfirmacion";
import { Criatura } from "../tipos";
import { codigoExpediente, ETIQUETA_ESTADO, ETIQUETA_TIPO, etiquetaPeligro, formatearFecha } from "../util/etiquetas";
import { useTitulo } from "../util/useTitulo";

interface AvistamientoSinPopular {
  _id: string;
  testigo: string;
  ubicacion: string;
  descripcion?: string;
  fecha: string;
}

export function DetalleCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [criatura, setCriatura] = useState<Criatura | null>(null);
  const [avistamientos, setAvistamientos] = useState<AvistamientoSinPopular[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const [confirmar, setConfirmar] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  useTitulo(criatura?.nombre ?? "Expediente");

  useEffect(() => {
    if (!id) return;

    setCargando(true);
    setError(null);
    Promise.all([obtenerCriaturaPorId(id), obtenerAvistamientosDeCriatura(id)])
      .then(([criaturaCargada, avistamientosCargados]) => {
        setCriatura(criaturaCargada);
        setAvistamientos(avistamientosCargados as unknown as AvistamientoSinPopular[]);
      })
      .catch((err: unknown) => {
        setCriatura(null);
        setError(err instanceof Error ? err.message : "Error al cargar la criatura.");
      })
      .finally(() => setCargando(false));
  }, [id, intento]);

  async function manejarEliminar() {
    if (!id) return;
    setEliminando(true);
    setErrorModal(null);
    try {
      await eliminarCriatura(id);
      navigate("/");
    } catch (err) {
      setErrorModal(err instanceof Error ? err.message : "No se pudo eliminar la criatura.");
      setEliminando(false);
    }
  }

  const notas = [...avistamientos].sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));

  return (
    <section className="pagina">
      <Link className="volver" to="/">
        ← Archivo de criaturas
      </Link>

      {cargando && <EsqueletoExpediente />}
      {!cargando && error && <AvisoError mensaje={error} onReintentar={() => setIntento((valor) => valor + 1)} />}
      {!cargando && !error && criatura && (
        <>
          <header className="expediente-cabecera">
            <div>
              <p className="sobrelinea">Expediente {codigoExpediente(criatura._id)}</p>
              <h1>{criatura.nombre}</h1>
              <div className="fila-insignias">
                <span className="insignia" data-tipo={criatura.tipo}>
                  <Icono nombre={criatura.tipo} className="insignia-icono" />
                  {ETIQUETA_TIPO[criatura.tipo]}
                </span>
                <span className="estado" data-estado={criatura.estado}>
                  {ETIQUETA_ESTADO[criatura.estado]}
                </span>
              </div>
            </div>
            <div className="acciones">
              <Link className="boton boton-primario" to={`/criaturas/${criatura._id}/editar`}>
                Editar expediente
              </Link>
              <button
                type="button"
                className="boton boton-peligro"
                onClick={() => {
                  setErrorModal(null);
                  setConfirmar(true);
                }}
              >
                Eliminar
              </button>
            </div>
          </header>

          <div className="paneles">
            <article className="panel">
              <h2>Nivel de peligro</h2>
              <p className="panel-frase">{etiquetaPeligro(criatura.nivelPeligro)}</p>
              <MedidorPeligro valor={criatura.nivelPeligro} />
            </article>

            <article className="panel">
              <h2>Habilidades</h2>
              {criatura.habilidades.length > 0 ? (
                <ul className="chips">
                  {criatura.habilidades.map((habilidad) => (
                    <li className="chip" key={habilidad}>
                      {habilidad}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ayuda">Ninguna habilidad anotada todavía.</p>
              )}
            </article>

            <article className="panel">
              <h2>Bitácora</h2>
              <dl>
                <div className="dato">
                  <dt>Abierta</dt>
                  <dd>{formatearFecha(criatura.createdAt)}</dd>
                </div>
                <div className="dato">
                  <dt>Actualizada</dt>
                  <dd>{formatearFecha(criatura.updatedAt)}</dd>
                </div>
                <div className="dato">
                  <dt>Avistamientos</dt>
                  <dd>{notas.length}</dd>
                </div>
              </dl>
            </article>
          </div>

          <div className="seccion-cabeza">
            <h2>Avistamientos</h2>
            <Link className="boton boton-secundario" to={`/avistamientos/nuevo?criaturaId=${criatura._id}`}>
              Registrar avistamiento
            </Link>
          </div>

          {notas.length === 0 ? (
            <p className="ayuda ayuda-bloque">Todavía no hay notas de campo para esta criatura.</p>
          ) : (
            <ol className="linea-tiempo">
              {notas.map((avistamiento) => (
                <li className="hito" key={avistamiento._id}>
                  <span className="hito-punto" aria-hidden="true" />
                  <article className="hito-cuerpo">
                    <p className="hito-fecha">{formatearFecha(avistamiento.fecha)}</p>
                    <p className="nota-linea">
                      <strong>{avistamiento.testigo}</strong>
                      <span> en {avistamiento.ubicacion}</span>
                    </p>
                    {avistamiento.descripcion && <p className="cita">{avistamiento.descripcion}</p>}
                  </article>
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      <ModalConfirmacion
        abierto={confirmar}
        titulo={`¿Eliminar a ${criatura?.nombre ?? "esta criatura"}?`}
        mensaje="El expediente sale del archivo. Esta acción no se puede deshacer."
        confirmar="Eliminar expediente"
        confirmando={eliminando}
        error={errorModal}
        onCerrar={() => {
          if (!eliminando) setConfirmar(false);
        }}
        onConfirmar={manejarEliminar}
      />
    </section>
  );
}
