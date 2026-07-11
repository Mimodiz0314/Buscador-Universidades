import { META_DATOS } from '../data/universidades.js';
import LogoUniversidad from './LogoUniversidad.jsx';

function ChipVerificado({ verificado }) {
  if (verificado) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-100/50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Verificado: {verificado}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100/50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      Confirmar oficial
    </span>
  );
}

// Banner de universidad: fondo de gradiente oscuro + logo real centrado
function UniversityBanner({ uni }) {
  const PALETAS = [
    { from: '#1e3a5f', to: '#0c4a6e' },
    { from: '#14532d', to: '#064e3b' },
    { from: '#7c2d12', to: '#9a3412' },
    { from: '#3b0764', to: '#4c1d95' },
    { from: '#0c4a6e', to: '#1e40af' },
    { from: '#1c1917', to: '#292524' },
    { from: '#0f172a', to: '#1e293b' },
  ];
  const sum = (uni.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const p = PALETAS[sum % PALETAS.length];

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)` }}
    >
      <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center p-6 shadow-2xl ring-1 ring-white/20">
        <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="lg" />
      </div>
    </div>
  );
}


// Miniatura pequeña para la columna de universidades relacionadas
function RelatedThumbnail({ u }) {
  const PALETAS = [
    { from: '#1e3a5f', to: '#0c4a6e' },
    { from: '#14532d', to: '#064e3b' },
    { from: '#7c2d12', to: '#9a3412' },
    { from: '#3b0764', to: '#4c1d95' },
    { from: '#0c4a6e', to: '#1e40af' },
    { from: '#1c1917', to: '#292524' },
    { from: '#0f172a', to: '#1e293b' },
  ];
  const sum = (u.id || '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const p = PALETAS[sum % PALETAS.length];

  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${p.from} 0%, ${p.to} 100%)` }}
    >
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1 shadow">
        <LogoUniversidad url={u.web} sigla={u.sigla} nombre={u.nombre} uniId={u.id} size="sm" />
      </div>
    </div>
  );
}

export default function DetalleUniversidad({ uni, programasCoinciden, onCerrar, universidadesRelacionadas = [], onSelectRelated }) {

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* LEFT COLUMN: Main "Video" Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Video Player Header */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] bg-slate-900 overflow-hidden shrink-0 group">
          
          <UniversityBanner uni={uni} />
          
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
            <div className="text-white">
              <div className="flex gap-2 mb-2">
                <span className={`inline-block px-2 py-0.5 text-xs font-bold uppercase rounded ${uni.tipo === 'pública' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                  {uni.tipo}
                </span>
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
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
                {uni.nombre}
              </h2>
            </div>
          </div>
        </div>

        {/* Video Details Area */}
        <div className="p-4 sm:p-6 lg:px-8 bg-white flex-1">
          
          {/* Channel Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                <LogoUniversidad sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{uni.sigla || 'Universidad'}</h3>
                <p className="text-sm text-slate-500">
                  {uni.ciudad} • {uni.ranking ? `Ranking #${uni.ranking}` : 'Sin Ranking'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={uni.web}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-full text-sm transition-colors"
              >
                Sitio Web
              </a>
              <a
                href={uni.admisiones}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full text-sm transition-colors shadow-md"
              >
                Admisiones
              </a>
            </div>
          </div>

          {/* Aviso legal en el detalle */}
          <div className="mt-3 bg-amber-50 text-[11px] text-amber-800 border border-amber-200/60 rounded-lg p-2.5">
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
