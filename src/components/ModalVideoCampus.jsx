import { useEffect } from 'react';

/**
 * ModalVideoCampus
 * Modal interactivo que reproduce el video institucional o tour de YouTube de la universidad
 */
export default function ModalVideoCampus({ videoId, titulo, uniNombre, onCerrar }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onCerrar();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCerrar]);

  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onCerrar}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-bold text-sm truncate">{uniNombre}:</span>
            <span className="text-xs text-slate-300 truncate">{titulo || 'Tour Virtual y Vida Universitaria'}</span>
          </div>
          <button
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar video (Esc)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenedor 16:9 con iframe de YouTube */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={titulo || 'Recorrido de Campus'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>

        {/* Footer con llamada a la acción */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Fuente: Canal Institucional Oficial (YouTube)</span>
          <button
            onClick={onCerrar}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
          >
            Entendido, volver
          </button>
        </div>
      </div>
    </div>
  );
}
