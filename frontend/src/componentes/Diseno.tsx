import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Sello } from "./Sello";

export function Diseno() {
  const { pathname } = useLocation();
  const enAvistamientos = pathname.startsWith("/avistamientos");
  const enCriaturas = pathname === "/" || pathname.startsWith("/criaturas");

  return (
    <div className="app">
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>

      <header className="cabecera">
        <div className="cabecera-interior">
          <NavLink to="/" className="marca" end>
            <Sello className="sello sello-marca" />
            <span className="marca-texto">
              <span className="marca-ciudad">Ciudad de Pawnee</span>
              <span className="marca-depto">Parques y criaturas</span>
            </span>
          </NavLink>

          <nav className="nav" aria-label="Secciones">
            <NavLink to="/" end className={enCriaturas ? "nav-link activo" : "nav-link"}>
              Criaturas
            </NavLink>
            <NavLink to="/avistamientos" className={enAvistamientos ? "nav-link activo" : "nav-link"}>
              Avistamientos
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="contenido" className="lienzo">
        <Outlet />
      </main>

      <footer className="pie">
        <div className="pie-interior">
          <Sello className="sello sello-pie" />
          <div>
            <p className="pie-titulo">Departamento de Parques de Pawnee</p>
            <p className="pie-nota">Archivo municipal de lo que habita —o insiste en habitar— los parques de la ciudad.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
