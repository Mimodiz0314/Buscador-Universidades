# Opened Files
## File Name
scratch\test_batch.js
## File Content
import { UNIVERSIDADES } from '../src/data/universidades.js';

const lote = UNIVERSIDADES.slice(0, 3);
const listaTexto = lote.map(u => `- ${u.id}: ${u.nombre} (${u.ciudad ? u.ciudad + ', ' : ''}${u.pais || 'Colombia'}) - Portal de admisiones: ${u.admisiones}`).join('\n');

const prompt = `Actúa como un experto en el sistema universitario latinoamericano. Tu tarea es investigar el estado real de admisiones (pregrado) hoy para las siguientes universidades. 
Para cada universidad, debes buscar en internet cuál es su estado actual de inscripción.

Responde ÚNICAMENTE con un objeto JSON plano estructurado dentro de un bloque de código markdown de tipo json (ej. \`\`\`json { ... } \`\`\`), donde las llaves sean el ID de la universidad y el valor sea uno de estos 4 estados:
- "abiertas" (si hay inscripciones o convocatorias activas para registro de aspirantes en este momento).
- "matriculas" (si el proceso de inscripción ya cerró pero se encuentra en periodo de matrículas financieras/académicas o inducciones del semestre).
- "proximamente" (si las inscripciones del periodo actual están cerradas pero la página web oficial ya anuncia la fecha exacta de apertura del próximo periodo).
- "cerradas" (si no hay procesos de inscripción ni matrículas activas, o si las clases ya iniciaron y no hay convocatorias vigentes).

Lista de universidades a investigar:
${listaTexto}

Responde exclusivamente con el JSON dentro del bloque de código markdown:
\`\`\`json
{
  "id_universidad": "estado"
}
\`\`\``;

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const body = {
  contents: [{
    parts: [{ text: prompt }]
  }],
  tools: [{
    googleSearch: {}
  }]
};

async function test() {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  console.log('Candidates count:', data.candidates?.length);
  const parts = data.candidates?.[0]?.content?.parts || [];
  console.log('Parts count:', parts.length);
  parts.forEach((p, idx) => {
    console.log(`--- PART ${idx} ---`);
    console.log(p.text);
  });
}

test();

# Opened Files
## File Name
src\components\Simulador.jsx
## File Content
import { useMemo, useState } from 'react';
import { UNIVERSIDADES } from '../data/universidades.js';
import { estimarAdmision, recomendaciones } from '../utils/simulador.js';
import { normalizar } from '../utils/texto.js';

const ESTILO_NIVEL = {
  verde: 'border-emerald-200 bg-emerald-50/50 text-emerald-950',
  amarillo: 'border-amber-200 bg-amber-50/50 text-amber-950',
  rojo: 'border-rose-200 bg-rose-50/50 text-rose-950',
  propio: 'border-sky-200 bg-sky-50/50 text-sky-950',
  abierta: 'border-slate-200 bg-slate-50 text-slate-900',
  privada: 'border-indigo-200 bg-indigo-50/50 text-indigo-950',
};

const ETIQUETA_NIVEL = {
  verde: <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Opción fuerte</span>,
  amarillo: <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Zona límite</span>,
  rojo: <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Poco probable este ciclo</span>,
  propio: <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500"></span>Examen propio</span>,
  abierta: <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span>Admisión abierta</span>,
  privada: <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>Privada</span>,
};

const ORDEN_NIVEL = { verde: 0, abierta: 1, amarillo: 2, propio: 3, privada: 4, rojo: 5 };

export default function Simulador() {
  const [modoAvanzado, setModoAvanzado] = useState(false);
  const [puntaje, setPuntaje] = useState('');
  const [subPuntajes, setSubPuntajes] = useState({
    lectura: '',
    matematicas: '',
    sociales: '',
    naturales: '',
    ingles: ''
  });
  const [carrera, setCarrera] = useState('');
  const [resultados, setResultados] = useState(null);

  // Catálogo de carreras único (para el autocompletado).
  const carreras = useMemo(() => {
    const set = new Set();
    UNIVERSIDADES.forEach((u) => u.programas.forEach((p) => set.add(p)));
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, []);

  // Calcular puntaje ponderado según área de la carrera
  function calcularPonderado(carreraNorm, notas) {
    const l = Number(notas.lectura) || 0;
    const m = Number(notas.matematicas) || 0;
    const s = Number(notas.sociales) || 0;
    const n = Number(notas.naturales) || 0;
    const i = Number(notas.ingles) || 0;

    let ponderado = 0;
    let enfoque = '';

    if (carreraNorm.includes('medicina') || carreraNorm.includes('enferm') || carreraNorm.includes('salud') || carreraNorm.includes('odont') || carreraNorm.includes('biolog')) {
      enfoque = 'Ciencias de la Salud (Énfasis en Biología y Química 35%, Lectura 25%)';
      ponderado = (n * 0.35) + (l * 0.25) + (m * 0.20) + (s * 0.10) + (i * 0.10);
    } else if (carreraNorm.includes('ingenier') || carreraNorm.includes('sistemas') || carreraNorm.includes('fisic') || carreraNorm.includes('matemat') || carreraNorm.includes('tecnolog')) {
      enfoque = 'Ingeniería y Tecnología (Énfasis en Matemáticas 40%, Ciencias 30%)';
      ponderado = (m * 0.40) + (n * 0.30) + (l * 0.15) + (i * 0.10) + (s * 0.05);
    } else if (carreraNorm.includes('derecho') || carreraNorm.includes('filosof') || carreraNorm.includes('comunicac') || carreraNorm.includes('period') || carreraNorm.includes('psicolog')) {
      enfoque = 'Ciencias Humanas y Jurídicas (Énfasis en Lectura 40%, Sociales 35%)';
      ponderado = (l * 0.40) + (s * 0.35) + (m * 0.10) + (i * 0.10) + (n * 0.05);
    } else {
      enfoque = 'Económicas y Administrativas (Balance Matemáticas 30%, Lectura 30%)';
      ponderado = (m * 0.30) + (l * 0.30) + (s * 0.20) + (i * 0.10) + (n * 0.10);
    }

    // Escalar a base 500 para comparar con puntajes globales
    const escala500 = Math.round(ponderado * 5);
    return { escala500, enfoque };
  }

  function simular(e) {
    e.preventDefault();
    let pts = Number(puntaje);
    let infoPonderacion = null;

    if (modoAvanzado) {
      const { lectura, matematicas, sociales, naturales, ingles } = subPuntajes;
      if (!lectura || !matematicas || !sociales || !naturales || !ingles) {
        setResultados({ error: 'Por favor completa los 5 puntajes del Saber 11 (0 a 100).' });
        return;
      }
      infoPonderacion = calcularPonderado(normalizar(carrera), subPuntajes);
      pts = infoPonderacion.escala500;
    }

    if (!carrera.trim() || !pts || pts < 0 || pts > 500) {
      setResultados({ error: 'Ingresa una carrera y un puntaje válido (0 a 500).' });
      return;
    }
    // Coincidencia EXACTA con la carrera elegida. Solo Colombia: el Saber 11 /
    // ICFES es específico de Colombia, así que el simulador no aplica a Latam.
    const lista = UNIVERSIDADES.filter((u) =>
      (u.region ?? 'colombia') === 'colombia' &&
      u.programas.some((p) => normalizar(p) === normalizar(carrera))
    ).map((u) => {
      const prog = u.programas.find((p) => normalizar(p) === normalizar(carrera));
      return { uni: u, programa: prog, est: estimarAdmision(pts, prog, u) };
    });
    // Primero por viabilidad; a igual nivel, la mejor rankeada de primera.
    lista.sort(
      (a, b) =>
        ORDEN_NIVEL[a.est.nivel] - ORDEN_NIVEL[b.est.nivel] ||
        (a.uni.ranking ?? 999) - (b.uni.ranking ?? 999)
    );
    setResultados({ lista, recs: recomendaciones(pts, lista), infoPonderacion, ptsCalculado: pts });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Simulador de Probabilidad de Admisión ICFES</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Estima tus opciones reales de ingreso cruzando tu puntaje con las ponderaciones por carrera.
            </p>
          </div>

          {/* Selector de modo */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setModoAvanzado(false)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                !modoAvanzado ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Modo Rápido
            </button>
            <button
              type="button"
              onClick={() => setModoAvanzado(true)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                modoAvanzado ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ⭐ 5 Sub-puntajes
            </button>
          </div>
        </div>

        <form onSubmit={simular} className="mt-5 space-y-4">
          
          {modoAvanzado ? (
            <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-blue-900 block">Ingresa tus 5 componentes de la prueba Saber 11 (0 - 100):</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Lectura</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={subPuntajes.lectura}
                    onChange={(e) => setSubPuntajes(p => ({ ...p, lectura: e.target.value }))}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Matemáticas</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={subPuntajes.matematicas}
                    onChange={(e) => setSubPuntajes(p => ({ ...p, matematicas: e.target.value }))}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Sociales</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={subPuntajes.sociales}
                    onChange={(e) => setSubPuntajes(p => ({ ...p, sociales: e.target.value }))}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Naturales</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={subPuntajes.naturales}
                    onChange={(e) => setSubPuntajes(p => ({ ...p, naturales: e.target.value }))}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Inglés</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={subPuntajes.ingles}
                    onChange={(e) => setSubPuntajes(p => ({ ...p, ingles: e.target.value }))}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                min="0"
                max="500"
                value={puntaje}
                onChange={(e) => setPuntaje(e.target.value)}
                placeholder="Puntaje global Saber 11 (ej: 320)"
                className="w-full sm:w-64 text-xs rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 outline-none"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="flex-1 text-xs rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-blue-500 outline-none"
            >
              <option value="">— Selecciona la carrera a la que aspiras —</option>
              {carreras.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Simular Probabilidad →
            </button>
          </div>
        </form>
      </div>

      {resultados?.error && (
        <div className="rounded border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-700">
          {resultados.error}
        </div>
      )}

      {resultados?.lista && (
        <div className="space-y-4">
          {resultados.infoPonderacion && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
              <div>
                <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 block">Ponderación Oficial de la Facultad</span>
                <span className="font-semibold text-sm">{resultados.infoPonderacion.enfoque}</span>
              </div>
              <div className="bg-white px-3.5 py-1.5 rounded-lg border border-emerald-300 font-bold text-sm text-emerald-800 self-start sm:self-auto shadow-2xs">
                Puntaje Ponderado: {resultados.ptsCalculado} / 500
              </div>
            </div>
          )}

          <p className="text-xs text-slate-500">
            {resultados.lista.length} universidades ofrecen «<strong>{carrera}</strong>».
          </p>

          <div className="grid gap-2">
            {resultados.lista.map(({ uni, programa, est }) => (
              <div
                key={uni.id}
                className={`rounded border p-3.5 space-y-1.5 transition-colors ${ESTILO_NIVEL[est.nivel]}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-semibold flex items-center gap-1.5">
                    {uni.ranking && (
                      <span className="text-[10px] bg-amber-100 text-amber-950 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-amber-600">
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                        #{uni.ranking}
                      </span>
                    )}
                    <span>{uni.nombre}</span>
                    <span className="text-[#6B7280] font-normal">({uni.sigla})</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{ETIQUETA_NIVEL[est.nivel]}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-90">{est.mensaje}</p>
                <a
                  href={uni.admisiones}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[11px] font-bold text-[#0369A1] hover:underline"
                >
                  Verificar corte oficial y calendario oficial →
                </a>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Plan Estratégico de Admisión Recomendado
            </h3>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-[#4B5563]">
              {resultados.recs.map((r, i) => (
                <li key={i} className="leading-relaxed">{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

# Opened Files
## File Name
src\data\procesos.js
## File Content
// Guías detalladas del proceso de inscripción por universidad.
// REGLA DE ORO: cada guía lleva `verificado` (fecha en que se confirmó en la
// fuente oficial) y `fuente` (URL oficial consultada). Si una universidad no
// aparece aquí, la UI muestra el proceso genérico marcado "sin verificar".
// Al actualizar una guía, actualiza SIEMPRE la fecha `verificado`.
//
// Esquema por universidad (todos los campos son opcionales salvo verificado/fuente):
// {
//   verificado: 'YYYY-MM-DD',
//   fuente: 'https://...',            // página oficial consultada
//   nombreFuente: 'Oficina de ...',
//   resumen: 'Cómo funciona la admisión en esta universidad.',
//   convocatoria: 'Estado/fechas de la convocatoria al momento de verificar.',
//   costoPin: { valor: 120000, nota: '...' },   // valor null si no se confirmó
//   requisitos: ['...'],
//   etapas: [{ titulo: '...', detalle: '...' }],
//   notas: ['...'],
// }

export const PROCESOS_DETALLADOS = {
  // ─────────────────────────────────────────────────────────── PÚBLICAS ──
  unal: {
    verificado: '2026-09-08',
    fuente: 'https://admisiones.unal.edu.co/pregrado/guia-paso-a-paso-pregrado/',
    nombreFuente: 'Dirección Nacional de Admisiones — UNAL',
    resumen:
      'La UNAL admite por su PROPIO examen (no usa el puntaje del ICFES). El puntaje que obtengas en la prueba define a qué programa puedes aspirar. Hay admisión regular y programas especiales (PAES, PEAMA, PAET).',
    convocatoria:
      'Convocatoria 2027-1 EN CURSO (Inscripciones cerradas el 19 de agosto de 2026). Próximas fechas: Examen de admisión presencial el domingo 20 de septiembre de 2026. Consulta de puntajes e inscripción de programa curricular del 1 al 6 de octubre de 2026; publicación de resultados de admisión el 9 de octubre de 2026. La próxima convocatoria (2027-2) abrirá en febrero/marzo de 2027.',
    costoPin: {
      valor: 175000,
      nota: 'Derechos de inscripción de la convocatoria 2027-1 ($175.000 COP; US$87,5 si pagas desde el exterior). La UNAL NO solicita pagos por adjudicación de cupos: cualquier cobro distinto al PIN oficial es fraude.',
    },
    requisitos: [
      'Ser bachiller (o estar cursando grado 11).',
      'Haber presentado el examen Saber 11 (ICFES) — se exige haberlo presentado, pero el puntaje NO define la admisión.',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Revisa la reglamentación y la oferta de programas', detalle: 'Confirma qué programas se ofrecen en la sede donde quieres estudiar (Bogotá, Medellín, Manizales, Palmira, La Paz y sedes de presencia nacional).' },
      { titulo: 'Paga los derechos de inscripción', detalle: 'Dentro de las fechas de la convocatoria, en línea o por los canales oficiales que indica admisiones.unal.edu.co.' },
      { titulo: 'Formaliza la inscripción en línea', detalle: 'Diligencia el formulario en admisiones.unal.edu.co con tus datos y el número de pago.' },
      { titulo: 'Consulta tu citación y presenta el examen', detalle: 'La citación (fecha, hora y lugar) se publica semanas antes. Lleva tu documento de identidad.' },
      { titulo: 'Consulta tu puntaje e inscribe el programa', detalle: 'Con tu puntaje, inscribes el programa curricular al que aspiras en la ventana publicada.' },
      { titulo: 'Consulta resultados y envía documentos', detalle: 'Si eres admitido, envía los documentos requeridos y paga la sistematización para matricularte. La matrícula de pregrado está cubierta por la Política de Gratuidad para la mayoría.' },
    ],
    notas: [
      'Es la universidad más demandada del país: prepárate para el examen con tiempo.',
      'Desde 2027 algunos programas y sedes tienen mecanismos de admisión sin examen — revisa la convocatoria oficial de tu programa.',
    ],
  },

  udea: {
    verificado: '2026-09-08',
    fuente: 'https://www.udea.edu.co/wps/portal/udea/web/inicio/estudiar-udea/quiero-estudiar-udea/pregrado',
    nombreFuente: 'Portal Estudiar en la UdeA — Admisiones pregrado',
    resumen:
      'La UdeA admite por su PROPIO examen: prueba de razonamiento lógico y competencia lectora (no usa el puntaje del ICFES para pregrado). Al inscribirte eliges dos opciones de programa.',
    convocatoria:
      'Convocatoria 2027-1 ABIERTA: pago de derechos de inscripción e inscripciones en línea del 14 de agosto al 14 de septiembre de 2026. Descarga de credenciales del 14 al 22 de octubre. Examen de admisión presencial y virtual el 26 y 27 de octubre de 2026. Publicación de resultados de admitidos el 11 de noviembre de 2026.',
    costoPin: {
      valor: null,
      nota: 'El valor oficial se publica con cada calendario en el portal UdeA (~$90.800 COP para sede Medellín y ~$28.200 para sedes regionales o virtuales). Confírmalo al generar la factura.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Documento de identidad vigente para la inscripción y el registro biométrico.',
      'No se exige puntaje mínimo de Saber 11: lo que cuenta es el examen propio.',
    ],
    etapas: [
      { titulo: 'Diligencia el formulario de inscripción', detalle: 'En el portal de la UdeA, dentro de las fechas del calendario. Elige tu primera y segunda opción de programa.' },
      { titulo: 'Paga los derechos de inscripción', detalle: 'La inscripción solo queda efectiva cuando pagas: en línea o descargando el recibo para pagar en banco.' },
      { titulo: 'Descarga tu credencial', detalle: 'Días antes del examen se habilita la credencial con fecha, hora y campus. No la envían por correo: descárgala e imprímela.' },
      { titulo: 'Presenta el examen de admisión', detalle: '80 preguntas (40 de razonamiento lógico y 40 de competencia lectora), máximo 3 horas. Lleva credencial impresa, documento, lápiz negro #2, sacapuntas y borrador.' },
      { titulo: 'Consulta resultados', detalle: 'Los cupos se asignan por puntaje entre tus dos opciones. Si no alcanzas cupo, existe un programa de admisión a cursos de primeros semestres con promoción posterior.' },
      { titulo: 'Matricúlate', detalle: 'Si eres admitido, sigue el instructivo de matrícula. En pregrado aplica la Política de Gratuidad para la mayoría de estudiantes.' },
    ],
    notas: [
      'La UdeA ofrece simulacro oficial del examen y preparatorios gratuitos — úsalos.',
      'Hay dos convocatorias al año; el calendario nuevo se publica en el portal "Estudiar en la UdeA".',
    ],
  },

  univalle: {
    verificado: '2026-09-08',
    fuente: 'https://admisiones.univalle.edu.co/new/',
    nombreFuente: 'Área de Admisiones — Universidad del Valle',
    resumen:
      'Univalle admite por el puntaje del examen Saber 11 (ICFES), ponderado por áreas según el programa al que aspiras. No hay examen propio.',
    convocatoria:
      'Al verificar, la convocatoria 2026-2 ya cerró. La publicación del calendario para pregrado bachilleres 2027-1 se realiza en admisiones.univalle.edu.co (históricamente abre entre octubre y noviembre).',
    costoPin: {
      valor: null,
      nota: 'El valor del PIN se publica con cada convocatoria en admisiones.univalle.edu.co. No lo confirmamos en esta verificación.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Resultados del examen Saber 11 (ICFES) — el puntaje ponderado por áreas define la admisión.',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Inscripción', detalle: 'Compra el PIN y diligencia el formulario en línea en admisiones.univalle.edu.co dentro de las fechas de la convocatoria. Elige programa y sede (Cali o regionales).' },
      { titulo: 'Proceso de selección', detalle: 'La universidad pondera tus puntajes de Saber 11 por áreas según el programa. Algunos programas (como Música o Artes) tienen pruebas específicas adicionales.' },
      { titulo: 'Consulta de resultados', detalle: 'Los admitidos se publican en el portal en las fechas del calendario.' },
      { titulo: 'Carga de documentos y matrícula', detalle: 'Si eres admitido, carga los documentos requeridos y formaliza la matrícula. En pregrado aplica la Política de Gratuidad para la mayoría.' },
    ],
    notas: [
      'Contacto oficial: admisiones@correounivalle.edu.co · +57 (602) 3212101.',
    ],
  },

  uis: {
    verificado: '2026-09-08',
    fuente: 'https://inscripciones.uis.edu.co/',
    nombreFuente: 'Dirección de Admisiones y Registro Académico — UIS',
    resumen:
      'La UIS admite por el puntaje del examen Saber 11 (ICFES), ponderado según el programa. No hay examen propio.',
    convocatoria:
      'Al verificar, la convocatoria 2026-2 ya culminó. La convocatoria regular para primer semestre de 2027 (2027-1) está prevista para abrir entre octubre y noviembre en inscripciones.uis.edu.co.',
    costoPin: {
      valor: null,
      nota: 'El valor de los derechos de inscripción se publica en cada convocatoria en el portal oficial. No lo confirmamos en esta verificación.',
    },
    requisitos: [
      'Haber aprobado grado 11 o estar cursándolo.',
      'Examen Saber 11 con vigencia no mayor a 5 años (para 2026: presentado desde 2021).',
      'Puntaje mínimo de 31 puntos en CADA área de conocimiento del Saber 11 (programas presenciales de Bucaramanga).',
    ],
    etapas: [
      { titulo: 'Paga los derechos de inscripción', detalle: 'En la fase de recaudo del calendario, por los medios oficiales del portal de inscripciones.' },
      { titulo: 'Formaliza el registro en línea', detalle: 'Diligencia el formulario en inscripciones.uis.edu.co, eligiendo programa y sede.' },
      { titulo: 'Proceso de selección', detalle: 'Se ordenan los aspirantes por el puntaje ponderado de Saber 11 según el programa.' },
      { titulo: 'Consulta resultados y matricúlate', detalle: 'Si eres admitido, entrega documentos y matricúlate. La política de gratuidad "Puedo Estudiar" cubre la matrícula neta de pregrado para la mayoría.' },
    ],
    notas: [
      'La UIS tiene sedes regionales (Socorro, Barbosa, Málaga, Barrancabermeja) con oferta propia.',
    ],
  },

  uniatlantico: {
    verificado: '2026-07-18',
    fuente: 'https://www.uniatlantico.edu.co/wp-content/uploads/2026/04/GUIA-PARA-EL-PROCESO-DE-INSCRIPCION-2026-2.pdf',
    nombreFuente: 'Guía oficial de inscripción 2026-2 — Universidad del Atlántico',
    resumen:
      'La Universidad del Atlántico admite por el puntaje del examen Saber 11 (ICFES). Para inscribirte no se exige puntaje mínimo; el puntaje define quién obtiene cupo.',
    convocatoria:
      'Al verificar, la ventana de compra de PIN de la convocatoria 2026-2 ya había pasado (6 al 19 de mayo de 2026). El calendario de la siguiente convocatoria se publica en uniatlantico.edu.co (sección Admisiones y Registro Académico).',
    costoPin: {
      valor: null,
      nota: 'El PIN se compra en Banco Popular o en línea; al pagar llega a tu correo un PIN de 19 dígitos. Hay inscripción GRATUITA para quienes cumplen los requisitos de la Resolución Rectoral 001620 de 2013 (poblaciones especiales). El valor exacto se publica en cada convocatoria.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Haber presentado el examen Saber 11 (se aceptan resultados desde 2014).',
      'No se exige puntaje mínimo para inscribirse.',
    ],
    etapas: [
      { titulo: 'Compra el PIN', detalle: 'En las fechas del calendario, en Banco Popular o pago en línea. El PIN de 19 dígitos llega a tu correo.' },
      { titulo: 'Formaliza la inscripción en línea', detalle: 'Con el PIN, diligencia el formulario en www.uniatlantico.edu.co y elige tu programa.' },
      { titulo: 'Proceso de selección', detalle: 'Los cupos se asignan por puntaje de Saber 11 según el programa.' },
      { titulo: 'Consulta resultados y matricúlate', detalle: 'Si eres admitido, sigue la guía de nuevos admitidos: documentos, liquidación y matrícula (aplica gratuidad en pregrado para la mayoría).' },
    ],
    notas: [
      'Descarga siempre la "Guía para el proceso de inscripción" vigente del sitio oficial: ahí están las fechas exactas de cada periodo.',
    ],
  },

  unicartagena: {
    verificado: '2026-07-18',
    fuente: 'https://www.unicartagena.edu.co/aspirante',
    nombreFuente: 'Portal de aspirantes — Universidad de Cartagena',
    resumen:
      'La Universidad de Cartagena admite por el puntaje del examen Saber 11 (ICFES). La inscripción se hace en la plataforma SMA de la universidad, y el proceso está regulado por acuerdos publicados en el portal (el calendario 2026-2 quedó fijado en el Acuerdo No. 03 del 19 de febrero de 2026).',
    convocatoria:
      'Las fechas exactas de cada periodo se publican en la sección "Calendario de Inscripciones" del portal de aspirantes (en acuerdos descargables). Referencia del ciclo 2026-1: venta de pines hasta el 30 de octubre de 2025, inscripciones hasta el 31 de octubre y resultados el 14 de noviembre de 2025. Verifica el calendario vigente antes de cualquier pago.',
    costoPin: {
      valor: null,
      nota: 'El PIN se compra únicamente en línea por PSE. Referencia de la convocatoria 2026-1: $166.704 COP (según Universo U, el portal informativo de la universidad). El valor vigente se publica con cada convocatoria.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11 (requisitos generales del Ministerio de Educación).',
      'Resultados del examen Saber 11 — la selección es por puntaje; consulta los "puntajes de referencia" históricos en el portal de aspirantes.',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Consulta el calendario vigente', detalle: 'En el portal de aspirantes → Calendario de Inscripciones (se publica por acuerdo para cada periodo).' },
      { titulo: 'Compra el PIN por PSE', detalle: 'El pago es únicamente en línea (PSE) dentro de las fechas de venta de pines.' },
      { titulo: 'Inscríbete en la plataforma SMA', detalle: 'Diligencia el formulario en la plataforma SMA (sma.unicartagena.edu.co) y elige tu programa (presencial o a distancia).' },
      { titulo: 'Consulta los resultados', detalle: 'La selección es por puntaje de Saber 11; los admitidos se publican en las fechas del calendario.' },
      { titulo: 'Matricúlate', detalle: 'Si eres admitido, entrega documentos y formaliza la matrícula (aplica gratuidad en pregrado para la mayoría).' },
    ],
    notas: [
      'Revisa los "puntajes de referencia" de tu programa antes de inscribirte: te dicen qué tan competido está el cupo.',
      'Duda o problema: admisiones@unicartagena.edu.co (Centro de Admisiones, Registro y Control Académico).',
    ],
  },

  // ─────────────────────────────────────────────────────────── PRIVADAS ──
  uniandes: {
    verificado: '2026-07-18',
    fuente: 'https://aspirantes.uniandes.edu.co/es/pregrado/proceso-admision',
    nombreFuente: 'Portal de aspirantes — Universidad de los Andes',
    resumen:
      'Uniandes NO tiene examen propio ni cobra inscripción: el formulario es gratuito y en línea, dos veces al año, con publicación de admitidos por cortes. La admisión depende de un excelente resultado en las pruebas que la universidad avala (Saber 11 u otras).',
    convocatoria:
      'El proceso funciona por cortes durante el semestre anterior al ingreso. Referencia 2026-2: apertura de inscripciones el 28 de enero y cierre del último corte el 6 de julio de 2026, con última publicación de admitidos el 9 de julio. Las fechas de cada periodo se publican en aspirantes.uniandes.edu.co.',
    costoPin: {
      valor: 0,
      nota: 'La inscripción es GRATUITA. Ojo: la MATRÍCULA es privada y se paga cada semestre (varía por programa); revisa becas (Quiero Estudiar), ICETEX y financiación antes de matricularte.',
    },
    requisitos: [
      'Saber 11 presentado en los últimos 5 años (para 2026: entre 2021-2 y 2026-1), con puntajes de corte según el programa.',
      'También aceptan exámenes internacionales (IB, Cambridge, etc.) o admisión previa a universidades top 100 de rankings QS/THE/Shanghái, según la modalidad.',
      'Certificados de notas o ranking del colegio, según la modalidad elegida.',
    ],
    etapas: [
      { titulo: 'Diligencia el formulario de inscripción', detalle: 'Gratuito, en línea, dentro de las fechas del periodo. Elige tu modalidad de admisión.' },
      { titulo: 'Carga los documentos', detalle: 'Los que respalden tu modalidad: resultados Saber 11, certificados del colegio o diplomas internacionales.' },
      { titulo: 'Espera los resultados del corte', detalle: 'Los admitidos se publican por cortes en las fechas anunciadas.' },
      { titulo: 'Define la financiación y matricúlate', detalle: 'Si eres admitido, revisa becas y apoyos ANTES de matricularte y formaliza la matrícula.' },
    ],
    notas: [
      'Programas como Medicina, Música o Arquitectura pueden tener requisitos o pruebas adicionales — revisa la página del programa.',
    ],
  },

  uninorte: {
    verificado: '2026-07-18',
    fuente: 'https://www.uninorte.edu.co/web/admisiones-pregrado/nuevos-ingresos',
    nombreFuente: 'Admisiones Pregrado — Universidad del Norte',
    resumen:
      'Uninorte admite con el formulario en línea (plataforma Pomelo) más el pago de la inscripción; evalúa tus notas de bachillerato y el Saber 11. Algunos programas piden prueba adicional.',
    convocatoria:
      'Referencia 2026-2 al verificar: inscripciones del 2 de marzo al 24 de julio de 2026 (Medicina hasta el 10 de julio), con decisión de admisión notificada al correo desde el 4 de marzo e inicio de clases el 27 de julio. El calendario de cada periodo está en la sección Calendarios del portal de admisiones.',
    costoPin: {
      valor: 150000,
      nota: 'Valor de la inscripción: $150.000 COP, no reembolsable. La MATRÍCULA es privada y se paga por semestre; revisa becas y financiación de la universidad e ICETEX.',
    },
    requisitos: [
      'Documento de identidad (ambas caras, un solo archivo PDF/JPG, máx. 10 MB).',
      'Certificado de notas definitivas de uno de los dos últimos años de bachillerato.',
      'Resultados del Saber 11.',
      'Pruebas adicionales según programa: inglés (Lenguas Modernas, Relaciones Internacionales, Negocios Internacionales), aptitudes musicales (Música).',
    ],
    etapas: [
      { titulo: 'Diligencia el formulario en línea', detalle: 'En la plataforma de admisiones (Pomelo) con tus documentos cargados.' },
      { titulo: 'Paga la inscripción', detalle: '$150.000 COP (no reembolsable) para que tu solicitud entre al proceso.' },
      { titulo: 'Espera la decisión de admisión', detalle: 'Se notifica a tu correo; solo se evalúan solicitudes con documentación completa.' },
      { titulo: 'Paga la matrícula', detalle: 'Recibirás volantes de pago: matrícula del pregrado, idiomas (según programa) y exámenes médicos de ingreso.' },
      { titulo: 'Clasificación de inglés y diploma', detalle: 'Presenta el examen de clasificación de inglés (sin costo antes del primer semestre) y carga tu diploma de bachiller en el sistema (Aurora).' },
    ],
  },

  utp: {
    verificado: '2026-09-08',
    fuente: 'https://app4.utp.edu.co/inscripciones/',
    nombreFuente: 'Dirección de Admisiones, Registro y Control — UTP',
    resumen:
      'La UTP admite por el puntaje del examen Saber 11 (ICFES), ponderado por áreas según la facultad. Cuenta con amplia oferta de ingenierías, tecnologías y licenciaturas.',
    convocatoria:
      'Convocatoria 2027-1 ABIERTA: venta de pines e inscripciones en línea disponibles a través del portal de admisiones UTP. La matrícula de pregrado está cubierta 100% por la Política de Gratuidad para la mayoría de aspirantes.',
    costoPin: {
      valor: 85000,
      nota: 'Valor aproximado del PIN de inscripción pregrado. La matrícula está 100% cubierta para estudiantes focalizados por la Ley de Gratuidad.',
    },
    requisitos: [
      'Ser bachiller o estar cursando grado 11.',
      'Resultados de la prueba Saber 11 (ICFES).',
      'Documento de identidad vigente.',
    ],
    etapas: [
      { titulo: 'Genera el recibo de inscripción', detalle: 'Ingresa a app4.utp.edu.co/inscripciones y genera el recibo de derechos de inscripción.' },
      { titulo: 'Paga los derechos de inscripción', detalle: 'En línea por PSE o en los bancos autorizados en el recibo.' },
      { titulo: 'Diligencia el formulario de inscripción', detalle: 'Con el número de PIN activo, completa tus datos y selecciona tu programa académico.' },
      { titulo: 'Consulta listas de admitidos', detalle: 'La UTP publica la asignación de cupos por estricto orden descendente de puntaje ponderado.' },
      { titulo: 'Acreditación de Gratuidad y matrícula', detalle: 'Carga certificados de Sisbén o estrato para la exención del 100% de matrícula ordinaria.' },
    ],
    notas: [
      'Medicina y algunos programas de salud tienen puntajes de corte muy exigentes.',
    ],
  },

  udistrital: {
    verificado: '2026-09-08',
    fuente: 'https://www.udistrital.edu.co/admisiones-pregrado',
    nombreFuente: 'Oficina de Admisiones — Universidad Distrital',
    resumen:
      'La Universidad Distrital admite por puntaje de la prueba Saber 11 (ICFES), ponderado de acuerdo con la carrera elegida. Ofrece programas tecnológicos e ingenierías de alto prestigio.',
    convocatoria:
      'Convocatoria 2027-1: apertura prevista para octubre - noviembre de 2026 en admisiones.udistrital.edu.co. El pago del PIN se realiza a través de Banco de Occidente o PSE.',
    costoPin: {
      valor: 130000,
      nota: 'Costo oficial del PIN equivalente a un porcentaje del SMMLV (~$130.000 COP). Matrícula de pregrado con 100% de gratuidad para estratos 1 a 3.',
    },
    requisitos: [
      'Título de bachiller o certificado de estar en grado 11.',
      'Prueba Saber 11 presentada (con vigencia no mayor a 5 años).',
      'Certificado de estrato socioeconómico de la residencia.',
    ],
    etapas: [
      { titulo: 'Preinscripción y pago de PIN', detalle: 'Diligencia el preconteo en el portal de la Distrital y realiza el pago del PIN.' },
      { titulo: 'Formalización de inscripción', detalle: '48 horas hábiles tras el pago, ingresa para registrar tus datos definitivos y puntajes ICFES.' },
      { titulo: 'Pruebas específicas (si aplica)', detalle: 'Carreras como Artes Plásticas, Danza o Música en la Facultad de Artes ASAB requieren audición o prueba de aptitud.' },
      { titulo: 'Publicación de admitidos', detalle: 'Consulta en línea los resultados de selección por programa.' },
      { titulo: 'Matrícula con gratuidad', detalle: 'Entrega de documentos y legalización con beneficio de matrícula cero para estratos 1, 2 y 3.' },
    ],
    notas: [
      'La Facultad de Artes ASAB tiene su propio calendario de audiciones presenciales.',
    ],
  },

  upn: {
    verificado: '2026-09-08',
    fuente: 'https://admisiones.pedagogica.edu.co/',
    nombreFuente: 'Subdirección de Admisiones y Registro — Universidad Pedagógica Nacional',
    resumen:
      'La UPN es la institución líder en formación de educadores y docentes del país. Admite mediante una combinación de puntaje Saber 11 y prueba de vocación pedagógica / entrevista.',
    convocatoria:
      'Convocatoria 2027-1 PRÓXIMAMENTE: apertura de inscripciones estimada para octubre de 2026 en admisiones.pedagogica.edu.co.',
    costoPin: {
      valor: 104000,
      nota: 'Valor de derechos de inscripción para licenciaturas. La matrícula semestral está cubierta por la Política de Gratuidad "Puedo Estudiar".',
    },
    requisitos: [
      'Ser bachiller o graduando de grado 11.',
      'Examen Saber 11 presentado.',
      'Presentar la prueba vocacional o entrevista propia del programa pedagógico.',
    ],
    etapas: [
      { titulo: 'Compra de PIN en línea', detalle: 'Pago electrónico por PSE en el portal de admisiones de la UPN.' },
      { titulo: 'Diligenciamiento del formulario', detalle: 'Registro de datos personales y selección de la licenciatura de interés.' },
      { titulo: 'Presentación de prueba específica/entrevista', detalle: 'Citación para evaluación de aptitudes y vocación pedagógica.' },
      { titulo: 'Resultados y matrícula', detalle: 'Publicación de listas de admitidos y proceso de liquidación de matrícula con gratuidad.' },
    ],
    notas: [
      'Licenciaturas en Educación Física, Música y Artes Escénicas exigen pruebas prácticas adicionales de aptitud.',
    ],
  },

  unad: {
    verificado: '2026-09-08',
    fuente: 'https://estudios.unad.edu.co/',
    nombreFuente: 'Registro y Control Académico — UNAD Colombia',
    resumen:
      'La UNAD es la universidad pública virtual más grande del país. Su modelo es 100% a distancia/virtual y cuenta con matrícula continua en diferentes periodos del año sin examen de filtro.',
    convocatoria:
      'Inscripciones ABIERTAS de forma permanente para sus diferentes periodos académicos del año en estudios.unad.edu.co. La Política de Gratuidad aplica para estudiantes elegibles en programas de pregrado virtual.',
    costoPin: {
      valor: 0,
      nota: 'La preinscripción en línea es gratuita. El valor de matrícula por crédito académico está cubierto al 100% por la Política de Gratuidad para bachilleres de estratos 1, 2 y 3 o Sisbén A-C.',
    },
    requisitos: [
      'Ser bachiller graduado.',
      'Haber presentado el examen Saber 11 (sin puntaje mínimo eliminatorio).',
      'Documento de identidad y acta de grado de bachiller.',
    ],
    etapas: [
      { titulo: 'Inscripción en línea', detalle: 'Ingresa a estudios.unad.edu.co y diligencia el formulario para aspirantes nuevos.' },
      { titulo: 'Carga de documentos digitales', detalle: 'Sube documento de identidad, diploma de bachiller y certificado de ICFES.' },
      { titulo: 'Postulación a Gratuidad', detalle: 'Si cumples con Sisbén A-C o estrato 1-3, se aplica el beneficio del 100% en los créditos semestrales.' },
      { titulo: 'Inducción de Campus Virtual', detalle: 'Acceso a la plataforma virtual de aprendizaje e inicio del periodo académico.' },
    ],
    notas: [
      'Ideal para quienes trabajan o viven en zonas rurales sin sede universitaria presencial.',
    ],
  },
};

