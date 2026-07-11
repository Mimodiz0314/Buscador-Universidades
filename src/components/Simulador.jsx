import { useMemo, useState } from 'react';
import { UNIVERSIDADES } from '../data/universidades.js';
import { estimarAdmision, recomendaciones } from '../utils/simulador.js';
import { normalizar } from '../utils/texto.js';

const ESTILO_NIVEL = {
  verde: 'border-emerald-300 bg-emerald-50',
  amarillo: 'border-amber-300 bg-amber-50',
  rojo: 'border-rose-300 bg-rose-50',
  propio: 'border-blue-300 bg-blue-50',
  abierta: 'border-slate-300 bg-slate-50',
  privada: 'border-violet-300 bg-violet-50',
};

const ETIQUETA_NIVEL = {
  verde: '🟢 Opción fuerte',
  amarillo: '🟡 Zona límite',
  rojo: '🔴 Poco probable este ciclo',
  propio: '🔵 Examen propio (otra oportunidad)',
  abierta: '⚪ Admisión abierta',
  privada: '🟣 Privada (depende de entrevista y financiación)',
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
    // Coincidencia EXACTA con la carrera elegida en la lista desplegable.
    const lista = UNIVERSIDADES.filter((u) =>
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
    <div>
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Simulador de admisión</h2>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa tu <strong>puntaje global Saber 11 (ICFES)</strong> y la carrera que quieres.
          Te mostramos, universidad por universidad, qué tan viable es tu ingreso según rangos
          históricos — y qué hacer para mejorar tus opciones.
        </p>
        <form onSubmit={simular} className="mt-4 flex flex-wrap gap-3">
          <input
            type="number"
            min="0"
            max="500"
            value={puntaje}
            onChange={(e) => setPuntaje(e.target.value)}
            placeholder="Puntaje global (ej: 320)"
            className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <select
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            className="min-w-56 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">— Elige la carrera —</option>
            {carreras.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Analizar mis opciones
          </button>
        </form>
      </div>

      {resultados?.error && (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{resultados.error}</p>
      )}

      {resultados?.lista && (
        <>
          <p className="mt-5 text-sm text-slate-500">
            {resultados.lista.length} universidades ofrecen «{carrera}». Estimación{' '}
            <strong>orientativa</strong> — el corte real cambia cada semestre.
          </p>
          <div className="mt-3 space-y-3">
            {resultados.lista.map(({ uni, programa, est }) => (
              <div
                key={uni.id}
                className={`rounded-xl border p-4 ${ESTILO_NIVEL[est.nivel]}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {uni.ranking && (
                      <span className="mr-1.5 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                        🏆 #{uni.ranking}
                      </span>
                    )}
                    <span className="font-semibold text-slate-900">{uni.nombre}</span>
                    <span className="ml-2 text-sm text-slate-500">— {programa}</span>
                  </div>
                  <span className="text-sm font-semibold">{ETIQUETA_NIVEL[est.nivel]}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-700">{est.mensaje}</p>
                <a
                  href={uni.admisiones}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline"
                >
                  Verificar corte oficial y calendario →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="font-bold text-slate-900">
              📋 Análisis y plan para asegurar tu ingreso
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {resultados.recs.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
