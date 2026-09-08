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
