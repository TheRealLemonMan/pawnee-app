import { Link } from "react-router-dom";
import { Criatura } from "../tipos";
import { codigoExpediente, ETIQUETA_ESTADO, ETIQUETA_TIPO, etiquetaPeligro } from "../util/etiquetas";
import { Icono } from "./Iconos";
import { MedidorPeligro } from "./MedidorPeligro";

type CriaturaVisible = Pick<Criatura, "nombre" | "tipo" | "habilidades" | "nivelPeligro" | "estado"> & {
  _id?: string;
};

export function FichaCriatura({ criatura, enlace = true }: { criatura: CriaturaVisible; enlace?: boolean }) {
  const habilidades = criatura.habilidades.slice(0, 3);
  const resto = criatura.habilidades.length - habilidades.length;
  const puedeAbrir = enlace && Boolean(criatura._id);

  return (
    <article className="ficha" data-tipo={criatura.tipo}>
      <div className="ficha-cabeza">
        <span className="codigo">{criatura._id ? codigoExpediente(criatura._id) : "PAW-····"}</span>
        <span className="estado" data-estado={criatura.estado}>
          {ETIQUETA_ESTADO[criatura.estado]}
        </span>
      </div>

      <div>
        <p className="insignia" data-tipo={criatura.tipo}>
          <Icono nombre={criatura.tipo} className="insignia-icono" />
          {ETIQUETA_TIPO[criatura.tipo]}
        </p>
        <h2 className="ficha-titulo">
          {puedeAbrir ? <Link to={`/criaturas/${criatura._id}`}>{criatura.nombre}</Link> : criatura.nombre}
        </h2>
      </div>

      <div className="ficha-peligro">
        <span>{etiquetaPeligro(criatura.nivelPeligro)}</span>
        <MedidorPeligro valor={criatura.nivelPeligro} />
      </div>

      {criatura.habilidades.length > 0 ? (
        <ul className="chips">
          {habilidades.map((habilidad) => (
            <li className="chip" key={habilidad}>
              {habilidad}
            </li>
          ))}
          {resto > 0 && <li className="chip chip-resto">+{resto}</li>}
        </ul>
      ) : (
        <p className="ayuda">Sin habilidades registradas</p>
      )}

      {puedeAbrir && (
        <footer className="ficha-pie">
          <Link className="boton-texto" to={`/criaturas/${criatura._id}`}>
            Abrir expediente
          </Link>
          <Link className="boton-texto boton-texto-suave" to={`/criaturas/${criatura._id}/editar`}>
            Editar
          </Link>
        </footer>
      )}
    </article>
  );
}
