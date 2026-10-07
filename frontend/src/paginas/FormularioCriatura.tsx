import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { actualizarCriatura, crearCriatura, obtenerCriaturaPorId } from "../api/criaturasApi";
import { FichaCriatura } from "../componentes/FichaCriatura";
import { AvisoError, Cargando } from "../componentes/Estados";
import { Icono } from "../componentes/Iconos";
import { MedidorPeligro } from "../componentes/MedidorPeligro";
import { CriaturaFormulario, ESTADOS_INVESTIGACION, TIPOS_CRIATURA } from "../tipos";
import { DETALLE_TIPO, ETIQUETA_ESTADO, ETIQUETA_TIPO, etiquetaPeligro } from "../util/etiquetas";
import { useTitulo } from "../util/useTitulo";

const FORM_VACIO: CriaturaFormulario = {
  nombre: "",
  tipo: "mitica",
  habilidades: [],
  nivelPeligro: 5,
  estado: "activa",
};

function unirHabilidades(lista: string[], borrador: string): string[] {
  const extras = borrador
    .split(",")
    .map((habilidad) => habilidad.trim())
    .filter((habilidad) => habilidad.length > 0);
  const todas = [...lista];
  for (const extra of extras) {
    if (!todas.some((habilidad) => habilidad.toLowerCase() === extra.toLowerCase())) {
      todas.push(extra);
    }
  }
  return todas;
}

export function FormularioCriatura() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [form, setForm] = useState<CriaturaFormulario>(FORM_VACIO);
  const [borradorHabilidad, setBorradorHabilidad] = useState("");
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useTitulo(esEdicion ? "Editar criatura" : "Nueva criatura");

  useEffect(() => {
    if (!id) {
      setForm(FORM_VACIO);
      setBorradorHabilidad("");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError(null);
    obtenerCriaturaPorId(id)
      .then((criatura) => {
        setForm({
          nombre: criatura.nombre,
          tipo: criatura.tipo,
          habilidades: criatura.habilidades,
          nivelPeligro: criatura.nivelPeligro,
          estado: criatura.estado,
        });
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "No se pudo cargar la criatura."))
      .finally(() => setCargando(false));
  }, [id, intento]);

  const habilidadesPrevias = useMemo(
    () => unirHabilidades(form.habilidades, borradorHabilidad),
    [form.habilidades, borradorHabilidad]
  );

  function agregarBorrador() {
    const habilidades = unirHabilidades(form.habilidades, borradorHabilidad);
    setForm({ ...form, habilidades });
    setBorradorHabilidad("");
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    const nivel = Math.min(10, Math.max(1, Number(form.nivelPeligro) || 1));
    const datosAEnviar: CriaturaFormulario = {
      ...form,
      nombre: form.nombre.trim(),
      nivelPeligro: nivel,
      habilidades: unirHabilidades(form.habilidades, borradorHabilidad),
    };

    try {
      setGuardando(true);
      if (esEdicion && id) {
        await actualizarCriatura(id, datosAEnviar);
        navigate(`/criaturas/${id}`);
      } else {
        const creada = await crearCriatura(datosAEnviar);
        navigate(`/criaturas/${creada._id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la criatura.");
    } finally {
      setGuardando(false);
    }
  }

  const destino = id ? `/criaturas/${id}` : "/";

  return (
    <section className="pagina">
      <Link className="volver" to={destino}>
        {id ? "← Volver al expediente" : "← Volver al archivo"}
      </Link>

      <header className="encabezado">
        <div>
          <p className="sobrelinea">{esEdicion ? "Actualizar expediente" : "Nuevo expediente"}</p>
          <h1>{esEdicion ? "Editar criatura" : "Registrar criatura"}</h1>
          <p className="lede">Nombre, naturaleza y qué tan en serio hay que tomársela.</p>
        </div>
      </header>

      {cargando && <Cargando etiqueta="Abriendo el expediente…" />}
      {!cargando && error && !form.nombre && esEdicion && (
        <AvisoError mensaje={error} onReintentar={() => setIntento((valor) => valor + 1)} />
      )}

      {!cargando && !(error && !form.nombre && esEdicion) && (
        <div className="composicion">
          <form className="form-tarjeta" onSubmit={manejarEnvio} noValidate>
            {error && (
              <p className="aviso aviso-error aviso-inline" role="alert">
                {error}
              </p>
            )}

            <div className="campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={form.nombre}
                autoFocus
                placeholder="Ej. Luciérnaga del embarcadero"
                aria-invalid={Boolean(error && !form.nombre.trim())}
                onChange={(evento) => setForm({ ...form, nombre: evento.target.value })}
              />
            </div>

            <fieldset className="campo">
              <legend>Tipo</legend>
              <div className="tipos-grid">
                {TIPOS_CRIATURA.map((tipo) => (
                  <label key={tipo} className="tipo-opcion" data-tipo={tipo}>
                    <input
                      className="sr-only"
                      type="radio"
                      name="tipo"
                      value={tipo}
                      checked={form.tipo === tipo}
                      onChange={() => setForm({ ...form, tipo })}
                    />
                    <span className="tipo-cuerpo">
                      <span className="tipo-icono">
                        <Icono nombre={tipo} />
                      </span>
                      <strong>{ETIQUETA_TIPO[tipo]}</strong>
                      <small>{DETALLE_TIPO[tipo]}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="campo">
              <label htmlFor="habilidades">Habilidades</label>
              <div className="chip-editor">
                {form.habilidades.map((habilidad) => (
                  <span className="chip" key={habilidad}>
                    {habilidad}
                    <button
                      type="button"
                      aria-label={`Quitar ${habilidad}`}
                      onClick={() =>
                        setForm({
                          ...form,
                          habilidades: form.habilidades.filter((actual) => actual !== habilidad),
                        })
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="habilidades"
                  type="text"
                  value={borradorHabilidad}
                  placeholder="Escribe y pulsa Enter"
                  onChange={(evento) => {
                    const valor = evento.target.value;
                    if (valor.includes(",")) {
                      const habilidades = unirHabilidades(form.habilidades, valor);
                      setForm({ ...form, habilidades });
                      setBorradorHabilidad("");
                      return;
                    }
                    setBorradorHabilidad(valor);
                  }}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter") {
                      evento.preventDefault();
                      agregarBorrador();
                    }
                    if (evento.key === "Backspace" && borradorHabilidad === "" && form.habilidades.length > 0) {
                      setForm({ ...form, habilidades: form.habilidades.slice(0, -1) });
                    }
                  }}
                />
              </div>
              <p className="ayuda">Separa con comas o Enter. Vuelo, niebla, oxidarse con estilo.</p>
            </div>

            <div className="campo">
              <div className="campo-cabeza">
                <label htmlFor="nivelPeligro">Nivel de peligro</label>
                <span>{etiquetaPeligro(form.nivelPeligro)}</span>
              </div>
              <input
                id="nivelPeligro"
                className="rango"
                type="range"
                min={1}
                max={10}
                step={1}
                value={form.nivelPeligro}
                onChange={(evento) => setForm({ ...form, nivelPeligro: Number(evento.target.value) })}
              />
              <MedidorPeligro valor={form.nivelPeligro} />
            </div>

            <fieldset className="campo">
              <legend>Estado</legend>
              <div className="segmento" role="radiogroup" aria-label="Estado de investigación">
                {ESTADOS_INVESTIGACION.map((estado) => (
                  <label key={estado}>
                    <input
                      className="sr-only"
                      type="radio"
                      name="estado"
                      value={estado}
                      checked={form.estado === estado}
                      onChange={() => setForm({ ...form, estado })}
                    />
                    <span>{ETIQUETA_ESTADO[estado]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form-acciones">
              <button type="submit" className="boton boton-primario" disabled={guardando}>
                {guardando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Crear expediente"}
              </button>
              <Link className="boton boton-secundario" to={destino}>
                Cancelar
              </Link>
            </div>
          </form>

          <aside className="vista-previa">
            <p className="sobrelinea">Vista previa</p>
            <FichaCriatura
              enlace={false}
              criatura={{
                nombre: form.nombre.trim() || "Sin nombre",
                tipo: form.tipo,
                habilidades: habilidadesPrevias,
                nivelPeligro: form.nivelPeligro,
                estado: form.estado,
                _id: id,
              }}
            />
            <p className="ayuda">Así se verá la ficha en el archivo.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
