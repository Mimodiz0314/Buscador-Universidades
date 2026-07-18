import { useMemo, useState } from 'react';
import { PROCESOS_DETALLADOS } from '../data/procesos.js';
import { estadoVerificacion, MESES_VIGENCIA } from '../utils/verificacion.js';
import LogoUniversidad from './LogoUniversidad.jsx';

// Banner grande de confianza: le dice al estudiante, sin rodeos, qué tan
// confiable es la información que está viendo y siempre lo lleva a la fuente.
function BannerVerificacion({ estado, verificado, fuente, admisiones }) {
  if (estado.nivel === 'vigente') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Información verificada el {verificado} en la fuente oficial.
        </div>
        <div className="sm:ml-auto flex gap-2">
          {fuente && (
            <a href={fuente} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-900">
              Ver fuente consultada
            </a>
          )}
        </div>
      </div>
    );
  }

  if (estado.nivel === 'antigua') {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
        <div className="flex items-start gap-2 text-amber-900 text-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div>
            <p className="font-bold">Esta información se verificó el {verificado} (hace {estado.meses} meses) y puede haber cambiado para la convocatoria actual.</p>
            <p className="mt-1">Los calendarios de admisión cambian cada semestre. <strong>Confírmala en el sitio oficial antes de pagar el PIN o inscribirte</strong> — un dato desactualizado puede atrasar tu ingreso a la universidad.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={admisiones} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors">
                Confirmar en el sitio oficial
              </a>
              {fuente && (
                <a href={fuente} target="_blank" rel="noopener noreferrer" className="inline-block px-3 py-1.5 text-amber-800 underline text-xs font-semibold">
                  Fuente consultada en su momento
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // sin_verificar
  return (
    <div className="rounded-xl border border-rose-300 bg-rose-50 p-4">
      <div className="flex items-start gap-2 text-rose-900 text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <p className="font-bold">Aún no hemos verificado los datos específicos de esta universidad.</p>
          <p className="mt-1">
            La guía de abajo describe el <strong>proceso típico</strong> para su tipo de admisión, no las fechas ni valores exactos de esta universidad.
            <strong> Verifica todo en el sitio oficial antes de hacer cualquier pago o trámite</strong> — información errada puede atrasar tu proceso.
          </p>
          <a href={admisiones} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors">
            Ir al sitio oficial de admisiones
          </a>
        </div>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wide">{titulo}</h4>
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  );
}

export default function ProcesoInscripcion({ universidades = [], uniInicial = null }) {
  const [tipoFiltro, setTipoFiltro] = useState('todas');
  const [uniId, setUniId] = useState(uniInicial || '');

  // Por ahora la guía cubre universidades de Colombia.
  const colombianas = useMemo(
    () => universidades.filter((u) => (u.region ?? 'colombia') === 'colombia'),
    [universidades]
  );

  const filtradas = useMemo(() => {
    return colombianas
      .filter((u) => tipoFiltro === 'todas' || u.tipo === tipoFiltro)
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [colombianas, tipoFiltro]);

  const uni = colombianas.find((u) => u.id === uniId) || null;
  const proceso = uni ? PROCESOS_DETALLADOS[uni.id] : null;
  const estado = estadoVerificacion(proceso?.verificado);

  const chipClass = (activo) =>
    `px-3.5 py-1.5 text-sm rounded-lg font-medium transition-colors ${
      activo ? 'bg-slate-900 text-white' : 'bg-slate-200/60 hover:bg-slate-200 text-slate-900'
    }`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Proceso de Inscripción</h2>
        <p className="text-sm text-slate-600 mt-1">
          Guía paso a paso para inscribirte, con la fecha en que verificamos cada dato en la fuente oficial.
          Si un dato no está verificado, te lo decimos claramente.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'pública', label: 'Públicas' },
            { id: 'privada', label: 'Privadas' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTipoFiltro(t.id);
                // Si la uni elegida ya no cae en el filtro, se limpia la selección.
                const sigueVisible = colombianas.some(
                  (u) => u.id === uniId && (t.id === 'todas' || u.tipo === t.id)
                );
                if (!sigueVisible) setUniId('');
              }}
              className={chipClass(tipoFiltro === t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <select
          value={uniId}
          onChange={(e) => setUniId(e.target.value)}
          className="flex-1 text-sm rounded-lg border border-slate-300 p-2 focus:border-blue-500 outline-none bg-white"
        >
          <option value="">— Elige una universidad —</option>
          {filtradas.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} ({u.sigla}) · {u.tipo}
            </option>
          ))}
        </select>
      </div>

      {!uni ? (
        /* Selección rápida en tarjetas */
        <div>
          <p className="text-xs text-slate-500 mb-3">
            {filtradas.length} universidades · las marcadas en verde tienen guía verificada
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtradas.map((u) => {
              const p = PROCESOS_DETALLADOS[u.id];
              const est = estadoVerificacion(p?.verificado);
              return (
                <button
                  key={u.id}
                  onClick={() => setUniId(u.id)}
                  className="text-left bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    <LogoUniversidad url={u.web} sigla={u.sigla} nombre={u.nombre} uniId={u.id} size="sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{u.nombre}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{u.tipo} · {u.tipoAdmision}</p>
                    {est.nivel === 'vigente' ? (
                      <span className="text-[10px] font-bold text-emerald-700">✓ Guía verificada {p.verificado}</span>
                    ) : est.nivel === 'antigua' ? (
                      <span className="text-[10px] font-bold text-amber-700">⚠ Verificada {p.verificado} — confirmar</span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">Guía genérica · por verificar</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Guía de la universidad elegida */
        <div className="space-y-4">
          {/* Encabezado */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{uni.nombre}</h3>
                <p className="text-xs text-slate-500">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-white text-[10px] font-bold uppercase mr-1.5 ${uni.tipo === 'pública' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                    {uni.tipo}
                  </span>
                  Admisión: {uni.tipoAdmision === 'icfes' ? 'por puntaje ICFES (Saber 11)' : uni.tipoAdmision === 'propio' ? 'examen propio' : uni.tipoAdmision}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a href={uni.admisiones} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full text-sm transition-colors">
                Admisiones oficial
              </a>
            </div>
          </div>

          {/* Banner de verificación — SIEMPRE visible */}
          <BannerVerificacion
            estado={estado}
            verificado={proceso?.verificado}
            fuente={proceso?.fuente}
            admisiones={uni.admisiones}
          />

          {proceso ? (
            <>
              {proceso.resumen && (
                <Seccion titulo="Cómo funciona la admisión aquí">
                  <p>{proceso.resumen}</p>
                </Seccion>
              )}

              {proceso.convocatoria && (
                <Seccion titulo="Convocatoria y fechas">
                  <p>{proceso.convocatoria}</p>
                </Seccion>
              )}

              {proceso.costoPin && (
                <Seccion titulo="Costo de inscripción (PIN)">
                  <p>
                    {proceso.costoPin.valor != null && (
                      <strong className="text-slate-900">${proceso.costoPin.valor.toLocaleString('es-CO')} COP. </strong>
                    )}
                    {proceso.costoPin.nota}
                  </p>
                </Seccion>
              )}

              {proceso.requisitos?.length > 0 && (
                <Seccion titulo="Requisitos">
                  <ul className="list-disc pl-5 space-y-1.5">
                    {proceso.requisitos.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </Seccion>
              )}

              {proceso.etapas?.length > 0 && (
                <Seccion titulo="Etapas del proceso, en orden">
                  <ol className="space-y-3">
                    {proceso.etapas.map((e, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{e.titulo}</p>
                          {e.detalle && <p className="text-slate-600 mt-0.5">{e.detalle}</p>}
                        </div>
                      </li>
                    ))}
                  </ol>
                </Seccion>
              )}

              {proceso.notas?.length > 0 && (
                <Seccion titulo="Ten en cuenta">
                  <ul className="list-disc pl-5 space-y-1.5">
                    {proceso.notas.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </Seccion>
              )}
            </>
          ) : (
            /* Fallback: proceso genérico del tipo de admisión, claramente marcado */
            <>
              <Seccion titulo="Cómo funciona la admisión aquí">
                <p>{uni.notaAdmision}</p>
              </Seccion>
              <Seccion titulo="Calendario (orientativo)">
                <p>{uni.fechas?.texto}</p>
              </Seccion>
              <Seccion titulo="Costos (orientativos)">
                <p>{uni.costoInscripcion?.nota}</p>
              </Seccion>
              <Seccion titulo="Proceso típico, paso a paso">
                <ol className="space-y-3">
                  {(uni.pasos || []).map((p, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p>{p}</p>
                    </li>
                  ))}
                </ol>
              </Seccion>
            </>
          )}

          {/* Descargo permanente */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600">
            ⚠️ Esta guía es un apoyo informativo. La única fuente definitiva es el sitio oficial de admisiones de la
            universidad. Antes de pagar, inscribirte o dejar pasar una fecha, <strong>confirma siempre allí</strong>.
            Los datos verificados tienen vigencia aproximada de {MESES_VIGENCIA} meses porque cada convocatoria cambia.
          </div>
        </div>
      )}
    </div>
  );
}
