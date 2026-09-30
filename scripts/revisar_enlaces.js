// Revisa los enlaces oficiales (web y admisiones de cada universidad, y becas).
// SOLO AVISA: escribe un informe en enlaces_rotos.md; no cambia ningún dato.
// Detecta: errores (404, 500…), sitios que no responden, "admisiones" que
// redirige a la página principal y páginas de error disfrazadas (responden 200).
// Muchos sitios .edu.co tienen la cadena de certificados incompleta: el
// navegador los abre igual, pero Node los rechaza. Como aquí solo se LEE para
// comprobar que la página existe, se omite esa verificación (solo en este script).
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import fs from 'fs';
import { UNIVERSIDADES } from '../src/data/universidades.js';
import { LATAM } from '../src/data/latam.js';
import { BECAS } from '../src/data/becas.js';
import { listaUnica } from './reglas_estados.js';

const enlaces = [];
for (const u of listaUnica(UNIVERSIDADES, LATAM)) {
  if (u.admisiones) enlaces.push({ quien: u.nombre, tipo: 'admisiones', url: u.admisiones });
  if (u.web && u.web !== u.admisiones) enlaces.push({ quien: u.nombre, tipo: 'web', url: u.web });
}
for (const b of BECAS) if (b.link) enlaces.push({ quien: b.nombre, tipo: 'beca', url: b.link });

const esInicio = (url) => { try { return new URL(url).pathname.replace(/\/+$/, '') === ''; } catch { return false; } };

async function revisar(enlace) {
  const r1 = await revisarUnaVez(enlace);
  // Un fallo de conexión puede ser momentáneo: se reintenta una vez.
  if (r1 && /no respondió|sin conexión/.test(r1)) return revisarUnaVez(enlace);
  return r1;
}

async function revisarUnaVez({ url, tipo }) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Mozilla/5.0 (UniScoop revisor de enlaces)' } });
    const final = res.url || url;
    // 401/403/429: el sitio bloquea robots, pero para una persona suele abrir.
    if ([401, 403, 429].includes(res.status)) return null;
    if (res.status >= 400) return `error ${res.status}`;
    if (/(^|[/._-])(error|404|not-?found)([/._-]|$)/i.test(new URL(final).pathname)) return `página de error (${final})`;
    const html = (await res.text()).slice(0, 20000);
    const titulo = (html.match(/<title[^>]*>([^<]*)/i)?.[1] || '').trim();
    if (/404|no encontrad|not found/i.test(titulo)) return `página de error: «${titulo.slice(0, 60)}»`;
    if (tipo === 'admisiones' && !esInicio(url) && esInicio(final)) return `redirige a la página principal (${final})`;
    return null;
  } catch (e) {
    return e.name === 'TimeoutError' ? 'no respondió en 20 s' : `sin conexión (${e.cause?.code || e.message})`;
  }
}

const problemas = [];
const LOTE = 8;
for (let i = 0; i < enlaces.length; i += LOTE) {
  const grupo = enlaces.slice(i, i + LOTE);
  const res = await Promise.all(grupo.map(revisar));
  res.forEach((p, j) => p && problemas.push({ ...grupo[j], problema: p }));
}

const hoy = new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10);
const informe = problemas.length
  ? `# Enlaces con problemas (${hoy})\n\nSe revisaron ${enlaces.length} enlaces; ${problemas.length} necesitan revisión.\n` +
    `Algunos sitios bloquean robots y pueden salir como falsos errores: ábrelos a mano antes de cambiar nada en \`src/data\`.\n\n` +
    `| Institución | Tipo | Problema | Enlace |\n|---|---|---|---|\n` +
    problemas.map((p) => `| ${p.quien} | ${p.tipo} | ${p.problema} | ${p.url} |`).join('\n') + '\n'
  : '';

if (informe) fs.writeFileSync('enlaces_rotos.md', informe, 'utf-8');
console.log(`Revisados ${enlaces.length} enlaces. Con problemas: ${problemas.length}.`);
problemas.forEach((p) => console.log(` - ${p.quien} [${p.tipo}]: ${p.problema}`));
