import { useState, useMemo } from 'react';
import LogoUniversidad from './LogoUniversidad.jsx';
import { generarUrlGoogleCalendar } from '../utils/calendar.js';

export default function ComparadorUniversidades({ universidades = [], seleccionadasIniciales = [], onVerDetalle, onVerProceso }) {
  // Lista de hasta 3 IDs de universidades para comparar
  const [seleccionadas, setSeleccionadas] = useState(() => {
    if (seleccionadasIniciales.length > 0) return seleccionadasIniciales.slice(0, 3);
    // Por defecto sugerir 2 referentes populares (UNAL y UdeA o Javeriana)
    const porDefecto = ['unal', 'udea'];
    return porDefecto.filter(id => universidades.some(u => u.id === id));
  });

  const [uniAAgregar, setUniAAgregar] = useState('');

  const unisComparadas = useMemo(() => {
    return seleccionadas
      .map(id => universidades.find(u => u.id === id))
      .filter(Boolean);
  }, [seleccionadas, universidades]);

  function agregarUniversidad(id) {
    if (!id || seleccionadas.includes(id) || seleccionadas.length >= 3) return;
    setSeleccionadas(prev => [...prev, id]);
    setUniAAgregar('');
  }

  function quitarUniversidad(id) {
    setSeleccionadas(prev => prev.filter(item => item !== id));
  }

  // Carreras que tienen en común las universidades seleccionadas
  const carrerasComunes = useMemo(() => {
    if (unisComparadas.length < 2) return [];
    let comunes = [...(unisComparadas[0].programas || [])];
    for (let i = 1; i < unisComparadas.length; i++) {
      const progsSet = new Set((unisComparadas[i].programas || []).map(p => p.toLowerCase()));
      comunes = comunes.filter(p => progsSet.has(p.toLowerCase()));
    }
    return comunes;
  }, [unisComparadas]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
            ⚖️ Modo Comparador Frente a Frente
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compara Universidades Lado a Lado
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analiza requisitos, costos de PIN, tipo de examen y gratuidad entre hasta 3 instituciones en simultáneo.
          </p>
        </div>

        {/* Selector para añadir una universidad más */}
        {seleccionadas.length < 3 && (
          <div className="flex items-center gap-2">
            <select
              value={uniAAgregar}
              onChange={(e) => agregarUniversidad(e.target.value)}
              className="text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 outline-none max-w-xs"
            >
              <option value="">+ Agregar universidad ({seleccionadas.length}/3)...</option>
              {universidades
                .filter(u => !seleccionadas.includes(u.id))
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} ({u.sigla || u.tipo})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {unisComparadas.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">Selecciona al menos dos universidades para comenzar la comparación.</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-[700px]">
            {unisComparadas.map((uni) => {
              const estadoBadge = {
                abiertas: { bg: 'bg-emerald-500', text: 'Inscripciones Abiertas' },
                matriculas: { bg: 'bg-blue-600', text: 'Matrículas Abiertas' },
                proximamente: { bg: 'bg-amber-500', text: 'Próximamente' },
                cerradas: { bg: 'bg-slate-500', text: 'Cerrado' },
              }[uni.estadoAdmision] || { bg: 'bg-slate-500', text: 'Cerrado' };

              return (
                <div
                  key={uni.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative"
                >
                  {/* Botón para remover de la comparación */}
                  <button
                    onClick={() => quitarUniversidad(uni.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center text-xs transition-colors z-10"
                    title="Quitar de la comparación"
                  >
                    ✕
                  </button>

                  {/* Header de la tarjeta */}
                  <div className="p-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white shadow-xs p-1 flex items-center justify-center shrink-0 border border-slate-100">
                      <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
                    </div>
                    <div className="pr-6">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded text-white ${uni.tipo === 'pública' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                        {uni.tipo}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                        {uni.sigla || uni.nombre}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{uni.ciudad}</p>
                    </div>
                  </div>

                  {/* Atributos comparativos */}
                  <div className="p-5 space-y-4 text-xs text-slate-700 flex-1">
                    
                    {/* Estado actual */}
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Estado de Convocatoria</span>
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold text-white rounded-lg ${estadoBadge.bg}`}>
                        {estadoBadge.text}
                      </span>
                    </div>

                    {/* Mecanismo de admisión */}
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Mecanismo de Selección</span>
                      <p className="font-semibold text-slate-800">
                        {uni.tipoAdmision === 'propio' ? '📝 Examen Propio (no ICFES)' : '📊 Puntaje ICFES / Saber 11'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{uni.notaAdmision}</p>
                    </div>

                    {/* Costo del PIN / Inscripción */}
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Costo de Inscripción (PIN)</span>
                      <p className="font-bold text-slate-900 text-sm">
                        {uni.costoInscripcion?.valor
                          ? `$${uni.costoInscripcion.valor.toLocaleString('es-CO')} COP`
                          : uni.tipo === 'privada'
                          ? 'Inscripción gratuita o variable'
                          : 'Aproximadamente $70.000 - $175.000'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{uni.costoInscripcion?.nota}</p>
                    </div>

                    {/* Política de Gratuidad */}
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Matrícula y Gratuidad</span>
                      {uni.tipo === 'pública' ? (
                        <div className="bg-emerald-50 border border-emerald-200/60 rounded-lg p-2.5">
                          <span className="font-bold text-emerald-800 block">✓ 100% Cubierta por el Estado</span>
                          <span className="text-[11px] text-emerald-700 mt-0.5 block">Aplica la Política de Gratuidad "Puedo Estudiar" para estratos 1, 2, 3 o Sisbén A-C.</span>
                        </div>
                      ) : (
                        <div className="bg-indigo-50 border border-indigo-200/60 rounded-lg p-2.5">
                          <span className="font-bold text-indigo-900 block">Requiere Pago Semestral</span>
                          <span className="text-[11px] text-indigo-700 mt-0.5 block">No aplica gratuidad estatal; cuenta con becas por mérito propio y líneas ICETEX.</span>
                        </div>
                      )}
                    </div>

                    {/* Cantidad de carreras */}
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Oferta Orientativa</span>
                      <p className="font-medium text-slate-800">
                        {uni.programas?.length || 0} carreras pre-cargadas
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                        {(uni.programas || []).slice(0, 8).map(p => (
                          <span key={p} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                            {p}
                          </span>
                        ))}
                        {(uni.programas || []).length > 8 && (
                          <span className="text-[10px] text-slate-400 self-center">+{(uni.programas.length - 8)} más</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Footer con acciones */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                    {onVerProceso && (
                      <button
                        onClick={() => onVerProceso(uni.id)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Ver Guía Paso a Paso →
                      </button>
                    )}
                    <div className="flex gap-2">
                      <a
                        href={uni.admisiones}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
                      >
                        Portal Admisiones ↗
                      </a>
                      {onVerDetalle && (
                        <button
                          onClick={() => onVerDetalle(uni)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
                          title="Ver ficha completa"
                        >
                          Ficha
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Carreras en común */}
      {unisComparadas.length >= 2 && carrerasComunes.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200/70 rounded-2xl p-5">
          <h4 className="font-bold text-sm text-blue-900 flex items-center gap-2 mb-2">
            <span>🎯</span> Carreras que ofrecen en común estas instituciones ({carrerasComunes.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {carrerasComunes.map(c => (
              <span key={c} className="bg-white border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-2xs">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
