// Estado de admisiones que se le muestra al estudiante.
// Regla: si no hay dato confiable y reciente, se dice "Sin confirmar" (nunca
// "Cerradas" por defecto, porque eso podría hacer que alguien no se inscriba).

export const DIAS_VIGENCIA_ESTADO = 30;

export const ESTADO_INFO = {
  abiertas: { texto: 'Inscripciones Abiertas', corto: 'Abiertas', solido: 'bg-emerald-500' },
  matriculas: { texto: 'Matrículas Abiertas', corto: 'Matrículas', solido: 'bg-blue-600' },
  proximamente: { texto: 'Próximamente', corto: 'Próximamente', solido: 'bg-amber-500' },
  cerradas: { texto: 'Convocatoria Cerrada', corto: 'Cerrado', solido: 'bg-slate-500' },
  sin_dato: { texto: 'Sin confirmar', corto: 'Sin confirmar', solido: 'bg-slate-400' },
};

const diasEntre = (desde, hasta) => {
  const a = Date.parse(desde + 'T00:00:00Z');
  const b = Date.parse(hasta + 'T00:00:00Z');
  return Number.isNaN(a) || Number.isNaN(b) ? Infinity : Math.round((b - a) / 86400000);
};

export const hoyISO = (ahora = new Date()) =>
  new Date(ahora.getTime() - 5 * 3600 * 1000).toISOString().slice(0, 10); // hora Colombia

// estados: { id: 'abiertas' | ... }   detalle: { id: { consultado, cierre, fuente, ... } }
// meta: { ultimaActualizacion }       hoy: 'YYYY-MM-DD'
export function estadoVigente(id, { estados = {}, detalle = {}, meta = {}, hoy = hoyISO() } = {}) {
  const base = ESTADO_INFO[estados[id]] ? estados[id] : 'sin_dato';
  if (base === 'sin_dato') return 'sin_dato';
  const d = detalle[id];
  const fecha = d?.consultado || meta.ultimaActualizacion;
  // Dato viejo (el robot dejó de confirmarlo): mejor no afirmar nada.
  if (!fecha || diasEntre(fecha, hoy) > DIAS_VIGENCIA_ESTADO) return 'sin_dato';
  // "Abiertas" pero la fecha de cierre oficial ya pasó.
  if (base === 'abiertas' && d?.cierre && d.cierre < hoy) return 'sin_dato';
  return base;
}
