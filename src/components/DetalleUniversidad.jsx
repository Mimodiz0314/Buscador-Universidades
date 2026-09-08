import { META_DATOS } from '../data/universidades.js';
import LogoUniversidad from './LogoUniversidad.jsx';
import { generarUrlGoogleCalendar } from '../utils/calendar.js';

function ChipVerificado({ verificado }) {
  if (verificado) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100/50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Verificado: {verificado}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100/50 dark:bg-amber-950/50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      Confirmar oficial
    </span>
  );
}

// Banner académico ejecutivo: Escudo oficial destacado + atmósfera institucional de alto nivel
function UniversityBanner({ uni }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-6 sm:p-10">
      {/* Patrón de fondo geométrico sutil */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

      {/* Escudo Oficial en tamaño óptico de alta nitidez */}
      <div className="relative z-10 transition-transform duration-500 hover:scale-105">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2.5 sm:p-3 shadow-xl border-2 border-white/80 dark:border-slate-700/80 flex items-center justify-center">
          <LogoUniversidad
            url={uni.web}
            sigla={uni.sigla}
            nombre={uni.nombre}
            uniId={uni.id}
            size="md"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Badges superiores */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-xs border border-white/20">
          📍 {uni.zona}
        </span>
        {uni.ranking && (
          <span className="px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 font-black text-xs shadow-md">
            Rank #{uni.ranking}
          </span>
        )}
      </div>
    </div>
  );
}

// Miniatura para la columna de universidades relacionadas
function RelatedThumbnail({ u }) {
  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center p-2">
      <div className="w-11 h-11 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center">
        <LogoUniversidad
          url={u.web}
          sigla={u.sigla}
          nombre={u.nombre}
          uniId={u.id}
          size="sm"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default function DetalleUniversidad({ uni, programasCoinciden, onCerrar, universidadesRelacionadas = [], onSelectRelated, onVerProceso, onComparar }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full animate-in fade-in duration-300">
      {/* LEFT COLUMN: Main Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Banner Header */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-900 overflow-hidden shrink-0 group">
          
          <UniversityBanner uni={uni} />
          
          {/* Top-left back button */}
          <button
            onClick={onCerrar}
            className="absolute top-4 left-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2.5 backdrop-blur-md transition-colors z-20 shadow-md"
            title="Volver a búsqueda"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          {/* Overlay gradient & Title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="text-white">
              <div className="flex gap-2 mb-2">
                <span className={`inline-block px-2.5 py-0.5 text-xs font-bold uppercase rounded-md shadow-sm ${uni.tipo === 'pública' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                  {uni.tipo === 'pública' ? 'Pública (Matrícula $0)' : 'Privada'}
                </span>
                {uni.estadoAdmision === 'ambas' ? (
                  <>
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-emerald-500 shadow-sm">
                      Inscripciones
                    </span>
                    <span className="inline-block px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-blue-600 shadow-sm">
                      Matrículas
                    </span>
                  </>
                ) : (
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-bold uppercase rounded-md shadow-sm ${
                    {
                      abiertas: 'bg-emerald-500',
                      matriculas: 'bg-blue-600',
                      proximamente: 'bg-amber-500',
                      cerradas: 'bg-slate-500'
                    }[uni.estadoAdmision] || 'bg-slate-500'
                  }`}>
                    {
                      {
                        abiertas: 'Inscripciones Abiertas',
                        matriculas: 'Matrículas Abiertas',
                        proximamente: 'Próximamente',
                        cerradas: 'Cerrado'
                      }[uni.estadoAdmision] || 'Cerrado'
                    }
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md">
                {uni.nombre}
              </h2>
            </div>
          </div>
        </div>

        {/* Video / University Details Area */}
        <div className="p-4 sm:p-6 lg:px-8 bg-white dark:bg-slate-900 flex-1">
          
          {/* Institutional Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs p-1.5">
                <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" className="w-full h-full" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{uni.sigla || 'Universidad'}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {uni.ciudad} • {uni.ranking ? `Ranking #${uni.ranking}` : 'Acreditada de Alta Calidad'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onComparar && (
                <button
                  onClick={() => onComparar(uni.id)}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-full text-sm transition-colors border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5"
                  title="Comparar con otras universidades"
                >
                  ⚖️ Comparar
                </button>
              )}
              {onVerProceso && (
                <button
                  onClick={() => onVerProceso(uni.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-sm transition-colors shadow-md"
                >
                  Guía de inscripción
                </button>
              )}
              <a
                href={generarUrlGoogleCalendar({
                  titulo: `Admisión ${uni.sigla || uni.nombre}`,
                  descripcion: `Información de admisiones ${uni.nombre}.\nPortal oficial: ${uni.admisiones}`,
                  ubicacion: uni.nombre,
                  fechaInicio: '2026-09-08'
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold rounded-full text-sm transition-colors border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
                title="Agendar en Google Calendar"
              >
                📅 Agendar
              </a>
              <a
                href={uni.web}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold rounded-full text-sm transition-colors"
              >
                Sitio Web
              </a>
              <a
                href={uni.admisiones}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-semibold rounded-full text-sm transition-colors shadow-md"
              >
                Admisiones
              </a>
            </div>
          </div>

          {/* Aviso legal en el detalle */}
          <div className="mt-3 bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 rounded-lg p-2.5">
            ⚠️ <span className="font-bold">Aviso importante:</span> Los calendarios y estados son orientativos. El estudiante tiene la responsabilidad de validar los plazos oficiales ingresando al enlace de **Admisiones** arriba provisto antes de iniciar trámites.
          </div>

          {/* Description Box */}
          <div className="mt-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-4 sm:p-5 text-sm text-slate-800">
            {programasCoinciden?.length > 0 && (
              <div className="mb-4 bg-blue-50 text-blue-900 p-3 rounded-lg font-medium border border-blue-100">
                <span className="text-blue-700 font-bold mr-2">✓ Coincidencias de tu búsqueda:</span>
                {programasCoinciden.join(', ')}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <h4 className="font-bold mb-1">Proceso de Admisión: {uni.tipoAdmision}</h4>
                <p className="opacity-90">{uni.notaAdmision}</p>
              </div>

              <div>
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  Calendario de Ingreso <ChipVerificado verificado={uni.fechas.verificado} />
                </h4>
                <p className="opacity-90">{uni.fechas.texto}</p>
              </div>

              <div>
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  Costos Estimados <ChipVerificado verificado={uni.costoInscripcion.verificado} />
                </h4>
                <p className="opacity-90">
                  {uni.costoInscripcion.valor && <strong className="text-slate-900 dark:text-white">PIN / Inscripción: ${uni.costoInscripcion.valor.toLocaleString('es-CO')}. </strong>}
                  {uni.costoInscripcion.nota}
                </p>
              </div>
            </div>
          </div>

          {/* Steps & Sample Programs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">Pasos para Inscripción</h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {uni.pasos.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <h4 className="font-bold text-slate-900 dark:text-white">Muestra de Programas</h4>
                <a href={META_DATOS.linkHecaa} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ver catálogo oficial</a>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {uni.programas.map((p) => (
                  <span key={p} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md text-[11px] font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Related Universities */}
      <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 px-1">Relacionadas</h3>
        
        {universidadesRelacionadas.map((item) => {
          const u = item.uni;
          
          return (
            <div 
              key={u.id} 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onSelectRelated(item);
              }}
              className="group flex gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/70 p-2 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
            >
              <div className="relative w-36 sm:w-40 aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 shadow-xs">
                <RelatedThumbnail u={u} />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {u.zona}
                </div>
              </div>
              
              <div className="flex flex-col min-w-0 py-0.5 justify-center">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {u.nombre}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{u.sigla || 'Uni'}</span>
                  <span>•</span>
                  <span className="capitalize">{u.tipo}</span>
                </div>
              </div>
            </div>
          );
        })}

        {universidadesRelacionadas.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic px-2">No hay recomendaciones adicionales bajo estos filtros.</p>
        )}
      </div>

    </div>
  );
}
