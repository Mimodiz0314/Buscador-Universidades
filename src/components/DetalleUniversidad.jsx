import { useState } from 'react';
import { META_DATOS } from '../data/universidades.js';
import LogoUniversidad from './LogoUniversidad.jsx';
import { generarUrlGoogleCalendar } from '../utils/calendar.js';
import { getCampusMedia } from '../data/campusMedia.js';
import ModalVideoCampus from './ModalVideoCampus.jsx';

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

// Banner de universidad: fotografía HD de campus + botón Tour Virtual + logo oficial
function UniversityBanner({ uni, onVerVideo }) {
  const media = getCampusMedia(uni.id);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <img
        src={media.foto}
        alt={`Campus de ${uni.nombre}`}
        className="w-full h-full object-cover brightness-[0.88] contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30"></div>

      {media.youtubeId && (
        <button
          onClick={onVerVideo}
          className="absolute z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-white/20"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Ver Tour Virtual de Campus (YouTube)</span>
        </button>
      )}

      <div className="absolute top-4 right-4 z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 shadow-xl border border-white/40 dark:border-slate-700 flex items-center justify-center">
        <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
      </div>
    </div>
  );
}

// Miniatura pequeña para la columna de universidades relacionadas
function RelatedThumbnail({ u }) {
  const media = getCampusMedia(u.id);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      <img
        src={media.foto}
        alt={u.nombre}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white/90 dark:bg-slate-900/90 p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
        <LogoUniversidad url={u.web} sigla={u.sigla} nombre={u.nombre} uniId={u.id} size="sm" />
      </div>
    </div>
  );
}

export default function DetalleUniversidad({ uni, programasCoinciden, onCerrar, universidadesRelacionadas = [], onSelectRelated, onVerProceso, onComparar }) {
  const [modalVideo, setModalVideo] = useState(false);
  const media = getCampusMedia(uni.id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full animate-in fade-in duration-300">
      {modalVideo && (
        <ModalVideoCampus
          videoId={media.youtubeId}
          titulo={media.tituloVideo}
          uniNombre={uni.nombre}
          onCerrar={() => setModalVideo(false)}
        />
      )}
      
      {/* LEFT COLUMN: Main "Video" Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Video Player Header */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-900 overflow-hidden shrink-0 group">
          
          <UniversityBanner uni={uni} onVerVideo={() => setModalVideo(true)} />
          
          {/* Top-left back button (simulate Youtube back or close) */}
          <button
            onClick={onCerrar}
            className="absolute top-4 left-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 backdrop-blur-md transition-colors z-10"
            title="Volver a búsqueda"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          {/* Overlay gradient & Title */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="text-white">
              <div className="flex gap-2 mb-2">
                <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase rounded ${uni.tipo === 'pública' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                  {uni.tipo}
                </span>
                {uni.estadoAdmision === 'ambas' ? (
                  <>
                    <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded bg-emerald-500">
                      Inscripciones
                    </span>
                    <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase rounded bg-blue-600">
                      Matrículas
                    </span>
                  </>
                ) : (
                  <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase rounded ${
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
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                {uni.nombre}
              </h2>
            </div>
          </div>
        </div>

        {/* Video Details Area */}
        <div className="p-4 sm:p-6 lg:px-8 bg-white dark:bg-slate-900 flex-1">
          
          {/* Channel Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <LogoUniversidad sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{uni.sigla || 'Universidad'}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {uni.ciudad} • {uni.ranking ? `Ranking #${uni.ranking}` : 'Sin Ranking'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {media.youtubeId && (
                <button
                  onClick={() => setModalVideo(true)}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold rounded-full text-sm transition-colors border border-rose-200 dark:border-rose-800 flex items-center gap-1.5"
                  title="Ver tour en video"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-rose-600">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Tour Virtual
                </button>
              )}
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
                  {uni.costoInscripcion.valor && <strong className="text-slate-900">PIN / Inscripción: ${uni.costoInscripcion.valor.toLocaleString('es-CO')}. </strong>}
                  {uni.costoInscripcion.nota}
                </p>
              </div>
            </div>
          </div>

          {/* Steps & Sample Programs */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Pasos para Inscripción</h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                {uni.pasos.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
            </div>

            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <h4 className="font-bold text-slate-900">Muestra de Programas</h4>
                <a href={META_DATOS.linkHecaa} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-blue-600 hover:underline">Ver catálogo oficial</a>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
                {uni.programas.map((p) => (
                  <span key={p} className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded-md text-[11px] font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Related "Videos" (Universities) */}
      <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-3">
        <h3 className="font-bold text-slate-900 text-lg mb-1 px-1">Relacionadas</h3>
        
        {universidadesRelacionadas.map((item) => {
          const u = item.uni;
          // Simple thumbnail for the right column
          const thumb = `https://image.thum.io/get/width/240/crop/180/${u.web}`;
          
          return (
            <div 
              key={u.id} 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onSelectRelated(item);
              }}
              className="group flex gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors"
            >
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-slate-200 shrink-0">
                <RelatedThumbnail u={u} />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                  {u.zona}
                </div>
              </div>
              
              <div className="flex flex-col min-w-0 py-0.5">
                <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700">
                  {u.nombre}
                </h4>
                <span className="text-xs text-slate-500 mt-1 truncate">{u.sigla || 'Uni'}</span>
                <span className="text-xs text-slate-500 truncate">{u.tipo}</span>
              </div>
            </div>
          );
        })}

        {universidadesRelacionadas.length === 0 && (
          <p className="text-sm text-slate-500 italic px-2">No hay recomendaciones adicionales bajo estos filtros.</p>
        )}
      </div>

    </div>
  );
}
