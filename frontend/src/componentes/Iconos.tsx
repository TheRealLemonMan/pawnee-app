import { TipoCriatura } from "../tipos";

interface PropsIcono {
  nombre: "buscar" | TipoCriatura;
  className?: string;
}

export function Icono({ nombre, className }: PropsIcono) {
  const comunes = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (nombre) {
    case "buscar":
      return (
        <svg {...comunes}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16.5 20.5 21" />
        </svg>
      );
    case "mitica":
      return (
        <svg {...comunes}>
          <path d="M12 3.2 13.4 8.6 18.8 10 13.4 11.4 12 16.8 10.6 11.4 5.2 10 10.6 8.6 12 3.2z" />
          <path d="M18 15.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9z" />
        </svg>
      );
    case "elemental":
      return (
        <svg {...comunes}>
          <path d="M12 3s6 6.1 6 10.1A6 6 0 1 1 6 13.1C6 9.1 12 3 12 3z" />
        </svg>
      );
    case "mecanica":
      return (
        <svg {...comunes}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.4v2.3M12 18.3v2.3M3.4 12h2.3M18.3 12h2.3M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6 5.8 18.2" />
        </svg>
      );
    case "espectral":
      return (
        <svg {...comunes}>
          <path d="M15.2 3.6A7.6 7.6 0 1 0 20.4 14 6 6 0 0 1 15.2 3.6z" />
        </svg>
      );
  }
}
