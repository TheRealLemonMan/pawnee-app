import { useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sello } from "./Sello";
import { FondoParque } from "./FondoParque";

function sinMovimiento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Diseno() {
  const { pathname } = useLocation();
  const appRef = useRef<HTMLDivElement>(null);
  const enAvistamientos = pathname.startsWith("/avistamientos");
  const enCriaturas = pathname === "/" || pathname.startsWith("/criaturas");

  useGSAP(
    () => {
      if (sinMovimiento()) return;
      gsap.from(".cabecera-interior", { y: -16, autoAlpha: 0, duration: 0.65, ease: "power3.out" });
      gsap.from(".nav-link", { y: -8, autoAlpha: 0, duration: 0.4, stagger: 0.06, delay: 0.15, ease: "power2.out" });
      const sello = gsap.timeline();
      sello.from(".sello-marca", { rotation: -28, scale: 0.55, duration: 0.85, ease: "back.out(1.7)" });
      sello.to(".sello-marca", { rotation: 4, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.from(".pie-interior", { y: 14, autoAlpha: 0, duration: 0.6, delay: 0.25, ease: "power2.out" });
    },
    { scope: appRef }
  );

  useGSAP(
    () => {
      if (sinMovimiento()) return;
      gsap.from(".pagina > *", {
        y: 20,
        autoAlpha: 0,
        duration: 0.58,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
    },
    { scope: appRef, dependencies: [pathname] }
  );

  return (
    <div className="app" ref={appRef}>
      <FondoParque />
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
