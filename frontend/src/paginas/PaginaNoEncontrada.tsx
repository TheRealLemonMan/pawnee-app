import { Link } from "react-router-dom";
import { Sello } from "../componentes/Sello";
import { useTitulo } from "../util/useTitulo";

export function PaginaNoEncontrada() {
  useTitulo("Página no encontrada");

  return (
    <section className="pagina vacio vacio-pagina">
      <Sello className="sello sello-suave" />
      <p className="sobrelinea">Sendero 404</p>
      <h1>Este expediente no está en el mapa</h1>
      <p>La ruta no corresponde a ninguna criatura, nota de campo ni formulario del archivo.</p>
      <Link className="boton boton-primario" to="/">
        Volver al archivo
      </Link>
    </section>
  );
}
