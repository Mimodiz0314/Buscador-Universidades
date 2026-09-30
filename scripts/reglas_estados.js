// Reglas para aceptar (o no) el estado de admisiones que propone la IA.
// Van en un archivo aparte, sin llamadas a internet, para poder probarlas
// (scripts/__tests__/reglas_estados.test.js).
//
// Principio: a un estudiante es peor decirle algo falso que decirle "sin dato".
//   1. Solo se acepta un estado si la IA da un enlace del sitio OFICIAL de la
//      universidad donde lo vio.
//   2. Si el estado cambia respecto al anterior, se exige que la IA lo repita
//      dos semanas seguidas antes de mostrarlo (evita el "sube y baja").
//   3. Si nunca hubo prueba, el estado es "sin_dato".

export const ESTADOS_VALIDOS = ['abiertas', 'matriculas', 'proximamente', 'cerradas'];

// Fecha YYYY-MM-DD en hora de Colombia (UTC-5, sin horario de verano).
export function hoyColombia(ahora = new Date()) {
  return new Date(ahora.getTime() - 5 * 3600 * 1000).toISOString().slice(0, 10);
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function fechaEnTexto(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

// Lista sin repetidos (UNIVERSIDADES ya incluye las de Latinoamérica).
export function listaUnica(...listas) {
  const vistos = new Set();
  return listas.flat().filter((u) => u?.id && !vistos.has(u.id) && vistos.add(u.id));
}

export function normalizarEstado(raw) {
  const v = String(raw ?? '').toLowerCase();
  if (v.includes('abiert')) return 'abiertas';
  if (v.includes('matricul')) return 'matriculas';
  if (v.includes('proxim') || v.includes('próxim')) return 'proximamente';
  if (v.includes('cerrad')) return 'cerradas';
  return null;
}

const host = (url) => {
  try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ''); } catch { return ''; }
};

// ¿El enlace pertenece al sitio oficial de la universidad (su web o su portal
// de admisiones, incluidos subdominios)?
export function esFuenteOficial(url, uni) {
  const h = host(url);
  if (!h || !/^https?:/i.test(url)) return false;
  const oficiales = [uni.web, uni.admisiones].map(host).filter(Boolean);
  return oficiales.some((o) => h === o || h.endsWith('.' + o) || o.endsWith('.' + h));
}

const esFecha = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);

// Revisa una respuesta de la IA. Devuelve { ok, motivo, dato }.
export function validarRespuesta(resp, uni, hoy) {
  if (!resp || typeof resp !== 'object') return { ok: false, motivo: 'sin respuesta' };
  const estado = normalizarEstado(resp.estado);
  if (!estado) return { ok: false, motivo: 'estado no válido' };
  if (!esFuenteOficial(resp.fuente, uni)) return { ok: false, motivo: 'fuente no oficial' };
  const cierre = esFecha(resp.cierre) ? resp.cierre : null;
  const apertura = esFecha(resp.apertura) ? resp.apertura : null;
  // Contradicción: "abiertas" pero la fecha de cierre ya pasó.
  if (estado === 'abiertas' && cierre && cierre < hoy) return { ok: false, motivo: 'dice abiertas pero el cierre ya pasó' };
  return {
    ok: true,
    dato: {
      estado,
      fuente: resp.fuente,
      apertura,
      cierre,
      evidencia: String(resp.evidencia || '').slice(0, 240),
    },
  };
}

// Decide el estado final de UNA universidad.
//   previoEstado: lo que hay hoy en estados.json (puede venir de antes, sin prueba)
//   previoDetalle: lo que hay en estados_detalle.json (con prueba), o undefined
//   resp: lo que respondió la IA para esta universidad, o undefined
export function decidirEstado({ uni, previoEstado, previoDetalle, resp, hoy }) {
  const v = validarRespuesta(resp, uni, hoy);
  const confirmadoPrevio = previoDetalle?.confirmado ? previoDetalle : null;

  if (!v.ok) {
    if (confirmadoPrevio) {
      // Se conserva lo último confirmado (con su fecha antigua: la app lo
      // pasa a "sin dato" sola si envejece demasiado).
      return { estado: confirmadoPrevio.estado, detalle: { ...confirmadoPrevio, pendiente: null, ultimoIntento: hoy, motivo: v.motivo }, cambio: 'sin_cambio' };
    }
    return { estado: 'sin_dato', detalle: { confirmado: false, estado: 'sin_dato', ultimoIntento: hoy, motivo: v.motivo }, cambio: previoEstado === 'sin_dato' ? 'sin_cambio' : 'a_sin_dato' };
  }

  const nuevo = { ...v.dato, confirmado: true, consultado: hoy, pendiente: null };

  // Primera vez con prueba, o confirma lo mismo que ya había: se acepta.
  if (!confirmadoPrevio || confirmadoPrevio.estado === nuevo.estado) {
    return { estado: nuevo.estado, detalle: nuevo, cambio: previoEstado === nuevo.estado ? 'sin_cambio' : 'aceptado' };
  }

  // Cambio respecto a lo confirmado: exigir que se repita dos veces seguidas.
  if (confirmadoPrevio.pendiente?.estado === nuevo.estado) {
    return { estado: nuevo.estado, detalle: nuevo, cambio: 'aceptado' };
  }
  return {
    estado: confirmadoPrevio.estado,
    detalle: { ...confirmadoPrevio, pendiente: { estado: nuevo.estado, desde: hoy, fuente: nuevo.fuente } },
    cambio: 'pendiente',
  };
}
