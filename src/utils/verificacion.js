// Utilidades de verificación de datos de admisión.
// REGLA DE ORO del proyecto: ningún dato se muestra como cierto si no tiene
// fecha de verificación en fuente oficial. Los calendarios de admisión cambian
// cada semestre, así que un dato verificado "envejece" y hay que avisarlo.

// Meses tras los cuales un dato verificado pasa a "antigua" (un ciclo de admisión).
export const MESES_VIGENCIA = 5;

// Convierte 'YYYY-MM' o 'YYYY-MM-DD' a Date (día 1 si no viene día). Null si no parsea.
export function parsearFechaVerificacion(fecha) {
  if (typeof fecha !== 'string') return null;
  const m = fecha.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3] ?? 1));
  return Number.isNaN(d.getTime()) ? null : d;
}

// Meses completos transcurridos desde la fecha de verificación hasta hoy.
export function mesesDesde(fecha, hoy = new Date()) {
  const d = parsearFechaVerificacion(fecha);
  if (!d) return null;
  const meses = (hoy.getFullYear() - d.getFullYear()) * 12 + (hoy.getMonth() - d.getMonth());
  return meses < 0 ? 0 : meses;
}

// Estado de un dato según su fecha de verificación:
//  - 'vigente'       → verificado hace <= MESES_VIGENCIA meses
//  - 'antigua'       → verificado, pero puede corresponder a una convocatoria pasada
//  - 'sin_verificar' → sin fecha válida: la UI debe marcarlo y llevar al link oficial
export function estadoVerificacion(fecha, hoy = new Date()) {
  const meses = mesesDesde(fecha, hoy);
  if (meses === null) return { nivel: 'sin_verificar', meses: null };
  return { nivel: meses <= MESES_VIGENCIA ? 'vigente' : 'antigua', meses };
}
