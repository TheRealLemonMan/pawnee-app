import { EstadoInvestigacion, TipoCriatura } from "../tipos";

export const ETIQUETA_TIPO: Record<TipoCriatura, string> = {
  mitica: "Mítica",
  elemental: "Elemental",
  mecanica: "Mecánica",
  espectral: "Espectral",
};

export const ETIQUETA_TIPO_PLURAL: Record<TipoCriatura, string> = {
  mitica: "míticas",
  elemental: "elementales",
  mecanica: "mecánicas",
  espectral: "espectrales",
};

export const DETALLE_TIPO: Record<TipoCriatura, string> = {
  mitica: "Leyenda del parque",
  elemental: "Fuerza natural",
  mecanica: "Artefacto con pulso",
  espectral: "Presencia sin censo",
};

export const ETIQUETA_ESTADO: Record<EstadoInvestigacion, string> = {
  activa: "Activa",
  en_investigacion: "En investigación",
  descartada: "Descartada",
};

export type BandaPeligro = "bajo" | "moderado" | "alto" | "critico";

export function bandaPeligro(valor: number): BandaPeligro {
  if (valor <= 3) return "bajo";
  if (valor <= 6) return "moderado";
  if (valor <= 8) return "alto";
  return "critico";
}

export function etiquetaPeligro(valor: number): string {
  if (valor <= 3) return "Riesgo bajo";
  if (valor <= 6) return "Riesgo moderado";
  if (valor <= 8) return "Riesgo alto";
  return "Riesgo crítico";
}

export function codigoExpediente(id: string): string {
  return `PAW-${id.slice(-4).toUpperCase()}`;
}

export function formatearFecha(iso: string): string {
  const fecha = new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(fecha.getTime())) return iso;
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(fecha);
}

export function fechaHoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}
