// "Mi Ruta": une carrera + puntaje + universidades + becas + fechas en un plan
// que el estudiante guarda en SU celular (sin servidor, sin datos personales).
import { estimarAdmision } from './simulador.js';
import { normalizar } from './texto.js';

export const CLAVE_RUTA = 'uniscoop_ruta';
export const DEPARTAMENTOS_CERCA = ['Córdoba', 'Sucre'];

export function leerRutaGuardada() {
  try { return JSON.parse(localStorage.getItem(CLAVE_RUTA) || 'null') || {}; } catch { return {}; }
}

export function guardarRuta(datos) {
  try { localStorage.setItem(CLAVE_RUTA, JSON.stringify(datos)); } catch {}
}

// El test vocacional puede dejar la carrera elegida lista en Mi Ruta.
export function guardarCarreraEnRuta(carrera) {
  const r = leerRutaGuardada();
  if (r.carrera !== carrera) guardarRuta({ ...r, carrera, elegidas: {} });
}

export const esCerca = (u) => DEPARTAMENTOS_CERCA.includes(u.departamento) || u.zona === 'Nacional';

// Universidades de Colombia que ofrecen exactamente esa carrera.
export function candidatas(carrera, universidades) {
  if (!carrera) return [];
  const c = normalizar(carrera);
  return universidades
    .filter((u) => (u.region ?? 'colombia') === 'colombia' && u.programas?.some((p) => normalizar(p) === c))
    .map((u) => ({ uni: u, programa: u.programas.find((p) => normalizar(p) === c) }));
}

const CATEGORIA = { verde: 'segura', abierta: 'segura', amarillo: 'posible', propio: 'posible', privada: 'posible', rojo: 'sueno' };

// Orden: primero las cercanas a Lorica (Córdoba/Sucre y nacionales), luego mejor ranking.
const porCercaniaYRanking = (a, b) =>
  Number(esCerca(b.uni)) - Number(esCerca(a.uni)) || (a.uni.ranking ?? 999) - (b.uni.ranking ?? 999);

// Propone una universidad "segura", una "posible" y una "sueño".
export function sugerirRuta(carrera, puntaje, universidades) {
  const lista = candidatas(carrera, universidades);
  const pts = Number(puntaje);
  const conEst = lista.map((x) => ({
    ...x,
    categoria: pts > 0 ? CATEGORIA[estimarAdmision(pts, x.programa, x.uni).nivel] : null,
  }));
  const usadas = new Set();
  const tomar = (filtro, orden = porCercaniaYRanking) => {
    const elegido = conEst.filter((x) => !usadas.has(x.uni.id) && filtro(x)).sort(orden)[0];
    if (elegido) usadas.add(elegido.uni.id);
    return elegido?.uni.id || null;
  };
  const porRanking = (a, b) => (a.uni.ranking ?? 999) - (b.uni.ranking ?? 999);
  if (!(pts > 0)) {
    // Sin puntaje: cercana, otra opción y la mejor rankeada como sueño.
    const sueno = tomar(() => true, porRanking);
    return { segura: tomar(() => true), posible: tomar(() => true), sueno };
  }
  const sueno = tomar((x) => x.categoria === 'sueno', porRanking);
  const segura = tomar((x) => x.categoria === 'segura');
  const posible = tomar((x) => x.categoria === 'posible') || tomar(() => true);
  return { segura: segura || tomar(() => true), posible, sueno: sueno || tomar(() => true, porRanking) };
}

export function textoParaCompartir({ carrera, nombres, proxima, url }) {
  const lineas = [
    '🎓 Mi Ruta en UniScoop',
    `Carrera: ${carrera}`,
    nombres.segura && `✅ Segura: ${nombres.segura}`,
    nombres.posible && `🎯 Posible: ${nombres.posible}`,
    nombres.sueno && `⭐ Sueño: ${nombres.sueno}`,
    proxima && `📅 Próxima fecha: ${proxima}`,
    `Arma la tuya: ${url}`,
  ];
  return lineas.filter(Boolean).join('\n');
}
