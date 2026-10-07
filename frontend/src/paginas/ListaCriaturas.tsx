import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { obtenerCriaturas } from "../api/criaturasApi";
import { FichaCriatura } from "../componentes/FichaCriatura";
import { AvisoError, EsqueletoFichas, Vacio } from "../componentes/Estados";
import { Icono } from "../componentes/Iconos";
import { Sello } from "../componentes/Sello";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";
import { ETIQUETA_TIPO, ETIQUETA_TIPO_PLURAL } from "../util/etiquetas";
import { useTitulo } from "../util/useTitulo";

type Orden = "peligro-desc" | "peligro-asc" | "nombre" | "recientes";

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("peligro-desc");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const paginaRef = useRef<HTMLElement>(null);

  useTitulo("Registro de criaturas");

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setCriaturas([]);
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo, intento]);

  const visibles = useMemo(() => {
    const consulta = busqueda.trim().toLowerCase();
    const filtradas = criaturas.filter((criatura) => {
      if (!consulta) return true;
      return (
        criatura.nombre.toLowerCase().includes(consulta) ||
        criatura.habilidades.some((habilidad) => habilidad.toLowerCase().includes(consulta))
      );
    });

    return [...filtradas].sort((a, b) => {
      if (orden === "peligro-desc") return b.nivelPeligro - a.nivelPeligro || a.nombre.localeCompare(b.nombre, "es");
      if (orden === "peligro-asc") return a.nivelPeligro - b.nivelPeligro || a.nombre.localeCompare(b.nombre, "es");
      if (orden === "recientes") return +new Date(b.createdAt) - +new Date(a.createdAt);
      return a.nombre.localeCompare(b.nombre, "es");
    });
  }, [criaturas, busqueda, orden]);

  const idsVisibles = visibles.map((criatura) => criatura._id).join("|");

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".placa .sello", {
        rotation: -18,
        scale: 0.78,
        duration: 0.9,
        delay: 0.2,
        ease: "back.out(1.6)",
      });
    },
    { scope: paginaRef }
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || cargando || error) return;

      gsap.utils.toArray<HTMLElement>(".metrica dd").forEach((cifra) => {
        const destino = Number((cifra.textContent ?? "").trim().replace(",", "."));
        if (!Number.isFinite(destino)) return;
        const estado = { valor: 0 };
        const entero = Number.isInteger(destino);
        gsap.to(estado, {
          valor: destino,
          duration: 0.85,
          ease: "power2.out",
          onUpdate: () => {
            cifra.textContent = entero
              ? String(Math.round(estado.valor))
              : estado.valor.toLocaleString("es", { maximumFractionDigits: 1 });
          },
        });
      });

      const fichas = gsap.utils.toArray<HTMLElement>(".ficha");
      if (!fichas.length) return;
      gsap.from(fichas, {
        y: 28,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
      gsap.from(".medidor-relleno", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        stagger: 0.07,
        delay: 0.1,
        ease: "power2.out",
      });
    },
    { scope: paginaRef, dependencies: [idsVisibles, cargando, error] }
  );

  const primeraCarga = cargando && criaturas.length === 0 && !error;
  const sinDatos = primeraCarga || Boolean(error);
  const activas = visibles.filter((criatura) => criatura.estado === "activa").length;
  const enInvestigacion = visibles.filter((criatura) => criatura.estado === "en_investigacion").length;
  const peligroMedio = visibles.length
    ? (visibles.reduce((suma, criatura) => suma + criatura.nivelPeligro, 0) / visibles.length).toLocaleString("es", {
        maximumFractionDigits: 1,
      })
    : "—";

  return (
    <section className="pagina" ref={paginaRef}>
      <header className="hero">
        <div className="hero-texto">
          <p className="sobrelinea">Departamento de Parques · Pawnee</p>
          <h1>Registro de criaturas</h1>
          <p className="lede">
            El archivo vivo de lo que camina, brilla o se oxida entre los senderos. Cada ficha es un expediente. Cada
            avistamiento, una nota de campo.
          </p>
          <div className="hero-acciones">
            <Link className="boton boton-primario" to="/criaturas/nueva">
              Registrar criatura
            </Link>
            <Link className="boton boton-secundario" to="/avistamientos">
              Ver avistamientos
            </Link>
          </div>
        </div>

        <aside className="placa">
          <Sello className="sello" />
          <p className="placa-ciudad">Ciudad de Pawnee</p>
          <p className="placa-depto">Departamento de Parques</p>
          <p className="placa-lema">Nada en el parque queda sin expediente.</p>
        </aside>
      </header>

      <dl className="metricas">
        <div className="metrica">
          <dt>En esta vista</dt>
          <dd>{sinDatos ? "—" : visibles.length}</dd>
        </div>
        <div className="metrica">
          <dt>Peligro medio</dt>
          <dd>{sinDatos ? "—" : peligroMedio}</dd>
        </div>
        <div className="metrica">
          <dt>Activas</dt>
          <dd>{sinDatos ? "—" : activas}</dd>
        </div>
        <div className="metrica">
          <dt>En investigación</dt>
          <dd>{sinDatos ? "—" : enInvestigacion}</dd>
        </div>
      </dl>

      <div className="barra">
        <label className="busqueda">
          <span className="sr-only">Buscar por nombre o habilidad</span>
          <Icono nombre="buscar" className="busqueda-icono" />
          <input
            type="search"
            value={busqueda}
            placeholder="Buscar por nombre o habilidad"
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </label>

        <div className="pastillas" role="group" aria-label="Filtrar por tipo">
          <button
            type="button"
            className="pastilla-filtro"
            aria-pressed={filtroTipo === ""}
            onClick={() => setFiltroTipo("")}
          >
            Todas
          </button>
          {TIPOS_CRIATURA.map((tipo) => (
            <button
              key={tipo}
              type="button"
              className="pastilla-filtro"
              data-tipo={tipo}
              aria-pressed={filtroTipo === tipo}
              onClick={() => setFiltroTipo(tipo)}
            >
              {ETIQUETA_TIPO[tipo]}
            </button>
          ))}
        </div>

        <label className="orden">
          <span className="sr-only">Ordenar</span>
          <select value={orden} onChange={(evento) => setOrden(evento.target.value as Orden)}>
            <option value="peligro-desc">Mayor peligro</option>
            <option value="peligro-asc">Menor peligro</option>
            <option value="nombre">Nombre</option>
            <option value="recientes">Más recientes</option>
          </select>
        </label>
      </div>

      <p className="conteo" aria-live="polite">
        {cargando
          ? "Consultando el archivo…"
          : error
            ? "No se pudo leer el archivo."
            : `${visibles.length} ${visibles.length === 1 ? "criatura" : "criaturas"}`}
      </p>

      {primeraCarga && <EsqueletoFichas />}
      {!cargando && error && <AvisoError mensaje={error} onReintentar={() => setIntento((valor) => valor + 1)} />}

      {!cargando && !error && criaturas.length === 0 && filtroTipo === "" && (
        <Vacio
          titulo="El archivo todavía está en blanco"
          texto="La primera criatura abre el registro. El lago puede esperar; el expediente, no."
          accion={
            <Link className="boton boton-primario" to="/criaturas/nueva">
              Registrar la primera
            </Link>
          }
        />
      )}

      {!cargando && !error && criaturas.length === 0 && filtroTipo !== "" && (
        <Vacio
          titulo={`Sin criaturas ${ETIQUETA_TIPO_PLURAL[filtroTipo]}`}
          texto="Prueba otro tipo o abre un expediente nuevo con esta naturaleza."
          accion={
            <Link className="boton boton-primario" to="/criaturas/nueva">
              Registrar criatura
            </Link>
          }
        />
      )}

      {!error && criaturas.length > 0 && visibles.length === 0 && (
        <Vacio
          titulo="Ninguna ficha coincide"
          texto={`No hay resultados para “${busqueda.trim()}”. Prueba con el nombre o con una habilidad.`}
        />
      )}

      {!error && visibles.length > 0 && (
        <div className={cargando ? "rejilla rejilla-tenue" : "rejilla"}>
          {visibles.map((criatura) => (
            <FichaCriatura key={criatura._id} criatura={criatura} />
          ))}
        </div>
      )}
    </section>
  );
}
