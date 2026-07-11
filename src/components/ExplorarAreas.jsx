import { useState } from 'react';
import { TAXONOMIA } from '../data/taxonomia.js';

export default function ExplorarAreas({ onAreaClick, onCarreraClick }) {
  const [areaExpandida, setAreaExpandida] = useState(null);

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          Explorar Áreas de Conocimiento
        </h2>
        <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl">
          Navega por el catálogo oficial (SNIES) para descubrir tu vocación. Selecciona un área para ver sus grupos y carreras específicas, y haz clic en una carrera para buscar dónde estudiarla.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TAXONOMIA.map((tax) => {
          const expandido = areaExpandida === tax.area;
          
          return (
            <div 
              key={tax.area} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col bg-white
                ${expandido ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md row-span-2' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
            >
              {/* Card Header */}
              <div 
                className="p-5 cursor-pointer flex flex-col h-full"
                onClick={() => {
                  setAreaExpandida(expandido ? null : tax.area);
                  if (!expandido && onAreaClick) onAreaClick(tax.area);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tax.color} flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                    {tax.icono}
                  </div>
                  <div className="text-slate-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 transition-transform duration-300 ${expandido ? 'rotate-180 text-blue-500' : ''}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
                
                <h3 className={`font-bold text-lg leading-tight mb-2 ${expandido ? tax.textColor : 'text-slate-900'}`}>
                  {tax.area}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 flex-1">
                  {tax.descripcion}
                </p>
                
                {!expandido && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{tax.subgrupos.length} grupos</span>
                    <span>Ver carreras →</span>
                  </div>
                )}
              </div>

              {/* Card Expanded Content */}
              {expandido && (
                <div className="bg-slate-50 border-t border-slate-100 p-5 flex-1 overflow-y-auto custom-scrollbar max-h-80 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-6">
                    {tax.subgrupos.map((sub, i) => (
                      <div key={i}>
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${tax.textColor} opacity-80`}>
                          {sub.nombre}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sub.carreras.map(carrera => (
                            <button
                              key={carrera}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onCarreraClick) onCarreraClick(carrera);
                              }}
                              className="text-left bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shadow-sm"
                            >
                              {carrera}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
