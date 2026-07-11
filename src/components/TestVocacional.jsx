import { useState } from 'react';
import {
  PREGUNTAS,
  OPCIONES_RESPUESTA,
  puntuarAreas,
  recomendarCarreras,
} from '../utils/vocacional.js';

const BARRA_COLOR = {
  rose: 'bg-rose-500', blue: 'bg-blue-500', cyan: 'bg-cyan-500', violet: 'bg-violet-500',
  emerald: 'bg-emerald-500', fuchsia: 'bg-fuchsia-500', amber: 'bg-amber-500',
  green: 'bg-green-500', slate: 'bg-slate-500',
};

export default function TestVocacional({ onElegirCarrera }) {
  const [fase, setFase] = useState('intro'); // 'intro' | 'test' | 'resultado'
  const [respuestas, setRespuestas] = useState(Array(PREGUNTAS.length).fill(null));
  const [resultado, setResultado] = useState(null);

  const contestadas = respuestas.filter((r) => r !== null).length;
  const completo = contestadas === PREGUNTAS.length;

  function responder(i, valor) {
    setRespuestas((prev) => {
      const sig = [...prev];
      sig[i] = valor;
      return sig;
    });
  }

  function verResultado() {
    const areas = puntuarAreas(respuestas);
    const top = areas.slice(0, 3);
    const carreras = recomendarCarreras(top.map((a) => a.id), 12);
    setResultado({ areas, top, carreras });
    setFase('resultado');
  }

  function reiniciar() {
    setRespuestas(Array(PREGUNTAS.length).fill(null));
    setResultado(null);
    setFase('intro');
  }

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (fase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h2 className="text-2xl font-bold text-slate-900">¿No sabes qué estudiar?</h2>
        <p className="mt-2 text-slate-600">
          Responde 14 preguntas rápidas sobre lo que te gusta hacer. Te decimos las áreas que
          más van contigo y <strong>carreras reales</strong> que puedes estudiar — con las
          universidades donde encontrarlas. Tarda 2 minutos y es anónimo.
        </p>
        <button
          onClick={() => setFase('test')}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Empezar el test →
        </button>
        <p className="mt-4 text-xs text-slate-400">
          Es una guía de orientación, no una decisión definitiva. Ninguna respuesta es incorrecta.
        </p>
      </div>
    );
  }

  // ── TEST ──────────────────────────────────────────────────────────────────
  if (fase === 'test') {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Progreso */}
        <div className="sticky top-0 bg-white/90 backdrop-blur py-3 z-10">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Cuánto te gusta cada actividad</span>
            <span className="font-semibold">{contestadas}/{PREGUNTAS.length}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(contestadas / PREGUNTAS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {PREGUNTAS.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3.5 transition-colors ${
                respuestas[i] !== null ? 'border-blue-200 bg-blue-50/40' : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-sm text-slate-800 mb-2.5">{p.texto}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {OPCIONES_RESPUESTA.map((op) => (
                  <button
                    key={op.valor}
                    onClick={() => responder(i, op.valor)}
                    className={`text-xs font-medium py-1.5 rounded-md border transition-colors ${
                      respuestas[i] === op.valor
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    {op.etiqueta}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white/90 backdrop-blur py-4 mt-2">
          <button
            onClick={verResultado}
            disabled={!completo}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {completo ? 'Ver mis resultados →' : `Responde las ${PREGUNTAS.length - contestadas} que faltan`}
          </button>
        </div>
      </div>
    );
  }

  // ── RESULTADO ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-2">✨</div>
        <h2 className="text-2xl font-bold text-slate-900">Tus áreas con más afinidad</h2>
        <p className="text-sm text-slate-500 mt-1">Según lo que te gusta hacer</p>
      </div>

      {/* Top 3 áreas con barras */}
      <div className="space-y-3">
        {resultado.top.map((a, idx) => (
          <div key={a.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">
                {idx === 0 && '🥇 '}{idx === 1 && '🥈 '}{idx === 2 && '🥉 '}
                {a.emoji} {a.nombre}
              </span>
              <span className="text-sm font-bold text-slate-700">{a.porcentaje}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className={`h-full ${BARRA_COLOR[a.color]}`} style={{ width: `${a.porcentaje}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Carreras recomendadas */}
      <div>
        <h3 className="font-bold text-slate-900 mb-1">Carreras que podrías estudiar</h3>
        <p className="text-xs text-slate-500 mb-3">
          Toca una carrera para ver en qué universidades la encuentras.
        </p>
        <div className="flex flex-wrap gap-2">
          {resultado.carreras.map(({ carrera, universidades }) => (
            <button
              key={carrera}
              onClick={() => onElegirCarrera?.(carrera)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              {carrera}
              <span className="text-[10px] text-slate-400 group-hover:text-blue-500">
                {universidades} U →
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
        💡 ¿Ya tienes una carrera en mente? Prueba el <strong>Simulador de admisión</strong> con
        tu puntaje ICFES para ver dónde tienes más opciones de entrar.
      </div>

      <div className="flex gap-2">
        <button
          onClick={reiniciar}
          className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-lg transition-colors"
        >
          Volver a hacer el test
        </button>
      </div>
    </div>
  );
}
