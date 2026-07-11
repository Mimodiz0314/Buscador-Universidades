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
  const [puntaje, setPuntaje] = useState('');
  const [carrera, setCarrera] = useState('');
  const [resultados, setResultados] = useState(null);

  // Catálogo de carreras único (para el autocompletado).
  const carreras = useMemo(() => {
    const set = new Set();
    UNIVERSIDADES.forEach((u) => u.programas.forEach((p) => set.add(p)));
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, []);

  function simular(e) {
    e.preventDefault();
    const pts = Number(puntaje);
    if (!carrera.trim() || !pts || pts < 0 || pts > 500) {
      setResultados({ error: 'Ingresa una carrera y un puntaje global válido (0 a 500).' });
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
    setResultados({ lista, recs: recomendaciones(pts, lista) });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <h2 className="text-sm font-bold text-[#111827]">Simulador de Probabilidad de Admisión</h2>
        <p className="mt-1 text-xs text-[#6B7280]">
          Ingresa tu puntaje global de las pruebas Saber 11 / ICFES y selecciona la carrera de interés para estimar la viabilidad de ingreso según datos históricos aproximados.
        </p>

        <form onSubmit={simular} className="mt-4 flex flex-wrap gap-2">
          <input
            type="number"
            min="0"
            max="500"
            value={puntaje}
            onChange={(e) => setPuntaje(e.target.value)}
            placeholder="Puntaje global (ej: 320)"
            className="w-48 text-xs rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-[#111827] focus:border-[#0369A1] focus:ring-0 outline-none"
          />
          <select
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            className="min-w-56 flex-1 text-xs rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-[#111827] focus:border-[#0369A1] focus:ring-0 outline-none"
          >
            <option value="">— Selecciona la carrera —</option>
            {carreras.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-[#0369A1] hover:bg-[#025a8b] text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors"
          >
            Analizar Opciones
          </button>
        </form>
      </div>

      {resultados?.error && (
        <div className="rounded border border-rose-200 bg-rose-50/50 p-3 text-xs text-rose-700">
          {resultados.error}
        </div>
      )}

      {resultados?.lista && (
        <div className="space-y-4">
          <p className="text-xs text-[#6B7280]">
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
