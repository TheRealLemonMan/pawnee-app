import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { crearAvistamiento } from "../api/avistamientosApi";
import { obtenerCriaturas } from "../api/criaturasApi";
import { AvisoError, Cargando, Vacio } from "../componentes/Estados";
import { AvistamientoFormulario, Criatura } from "../tipos";
import { ETIQUETA_TIPO, etiquetaPeligro, fechaHoy, formatearFecha } from "../util/etiquetas";
import { useTitulo } from "../util/useTitulo";

const FORM_VACIO: AvistamientoFormulario = {
  criatura: "",
  testigo: "",
  ubicacion: "",
  descripcion: "",
  fecha: "",
};

export function FormularioAvistamiento() {
  const [parametros] = useSearchParams();
  const navigate = useNavigate();
  const criaturaInicial = parametros.get("criaturaId") ?? "";

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [form, setForm] = useState<AvistamientoFormulario>({
    ...FORM_VACIO,
    criatura: criaturaInicial,
    fecha: fechaHoy(),
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useTitulo("Nuevo avistamiento");

  useEffect(() => {
    setCargando(true);
    setError(null);
    obtenerCriaturas()
      .then((lista) => {
        setCriaturas(lista);
        setForm((actual) => {
          if (actual.criatura && lista.some((criatura) => criatura._id === actual.criatura)) return actual;
          if (criaturaInicial && lista.some((criatura) => criatura._id === criaturaInicial)) {
            return { ...actual, criatura: criaturaInicial };
          }
          return { ...actual, criatura: lista[0]?._id ?? "" };
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudieron cargar las criaturas."))
      .finally(() => setCargando(false));
  }, [criaturaInicial, intento]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.criatura || !form.testigo.trim() || !form.ubicacion.trim() || !form.fecha) {
      setError("Criatura, testigo, ubicación y fecha son obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      await crearAvistamiento({
        ...form,
        testigo: form.testigo.trim(),
        ubicacion: form.ubicacion.trim(),
        descripcion: form.descripcion?.trim() ?? "",
      });
      navigate(criaturaInicial ? `/criaturas/${criaturaInicial}` : "/avistamientos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el avistamiento.");
    } finally {
      setGuardando(false);
    }
  }

  const destino = criaturaInicial ? `/criaturas/${criaturaInicial}` : "/avistamientos";
  const elegida = criaturas.find((criatura) => criatura._id === form.criatura);

  return (
    <section className="pagina">
      <Link className="volver" to={destino}>
        {criaturaInicial ? "← Volver al expediente" : "← Volver a avistamientos"}
      </Link>

      <header className="encabezado">
        <div>
          <p className="sobrelinea">Bitácora de campo</p>
          <h1>Registrar avistamiento</h1>
          <p className="lede">Quién la vio, dónde, y qué conviene no olvidar.</p>
        </div>
      </header>

      {cargando && <Cargando etiqueta="Buscando criaturas en el archivo…" />}
      {!cargando && error && criaturas.length === 0 && (
        <AvisoError mensaje={error} onReintentar={() => setIntento((valor) => valor + 1)} />
      )}
      {!cargando && !error && criaturas.length === 0 && (
        <Vacio
          titulo="Primero hace falta una criatura"
          texto="Abre un expediente y después anota quién la encontró en el parque."
          accion={
            <Link className="boton boton-primario" to="/criaturas/nueva">
              Registrar criatura
            </Link>
          }
        />
      )}

      {!cargando && criaturas.length > 0 && (
        <div className="composicion">
          <form className="form-tarjeta" onSubmit={manejarEnvio} noValidate>
            {error && (
              <p className="aviso aviso-error aviso-inline" role="alert">
                {error}
              </p>
            )}

            <div className="campo">
              <label htmlFor="criatura">Criatura</label>
              <select
                id="criatura"
                value={form.criatura}
                onChange={(evento) => setForm({ ...form, criatura: evento.target.value })}
              >
                {criaturas.map((criatura) => (
                  <option key={criatura._id} value={criatura._id}>
                    {criatura.nombre}
                  </option>
                ))}
              </select>
              {elegida && (
                <p className="ayuda">
                  {ETIQUETA_TIPO[elegida.tipo]} · {etiquetaPeligro(elegida.nivelPeligro)} ({elegida.nivelPeligro}/10)
                </p>
              )}
            </div>

            <div className="campo">
              <label htmlFor="testigo">Testigo</label>
              <input
                id="testigo"
                type="text"
                value={form.testigo}
                autoComplete="name"
                autoFocus
                placeholder="Ej. Guardabosques de turno"
                onChange={(evento) => setForm({ ...form, testigo: evento.target.value })}
              />
            </div>

            <div className="campo">
              <label htmlFor="ubicacion">Ubicación</label>
              <input
                id="ubicacion"
                type="text"
                value={form.ubicacion}
                placeholder="Ej. Orilla norte del lago"
                onChange={(evento) => setForm({ ...form, ubicacion: evento.target.value })}
              />
            </div>

            <div className="campo">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                type="date"
                value={form.fecha}
                onChange={(evento) => setForm({ ...form, fecha: evento.target.value })}
              />
            </div>

            <div className="campo">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                rows={4}
                value={form.descripcion}
                placeholder="Qué se vio, a qué hora, y qué hizo después."
                onChange={(evento) => setForm({ ...form, descripcion: evento.target.value })}
              />
              <p className="ayuda">Opcional. El detalle es lo que convierte un rumor en expediente.</p>
            </div>

            <div className="form-acciones">
              <button type="submit" className="boton boton-primario" disabled={guardando}>
                {guardando ? "Guardando…" : "Registrar avistamiento"}
              </button>
              <Link className="boton boton-secundario" to={destino}>
                Cancelar
              </Link>
            </div>
          </form>

          <aside className="vista-previa">
            <p className="sobrelinea">Nota de campo</p>
            <article className="hito-cuerpo nota-previa">
              <p className="hito-fecha">{form.fecha ? formatearFecha(form.fecha) : "Sin fecha"}</p>
              <h2>{elegida?.nombre ?? "Criatura"}</h2>
              <p className="nota-linea">
                <strong>{form.testigo.trim() || "Testigo sin nombre"}</strong>
                <span> en {form.ubicacion.trim() || "ubicación por confirmar"}</span>
              </p>
              <p className="ayuda">{form.descripcion?.trim() || "La descripción aparecerá aquí."}</p>
            </article>
          </aside>
        </div>
      )}
    </section>
  );
}
