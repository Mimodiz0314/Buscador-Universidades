import { useState } from 'react';
import { TAXONOMIA } from '../data/taxonomia.js';

export default function ExplorarAreas({ onAreaClick, onCarreraClick }) {
  const [areaExpandida, setAreaExpandida] = useState(null);

  return (
    <div className="p-4 sm:p-6 pb-24 max-w-7xl mx-auto animate-in fade-in duration-300">
      
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-blue-600 dark:text-blue-400">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
          Explorar Áreas de Conocimiento
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
          Navega por la clasificación oficial del Ministerio de Educación (SNIES) para descubrir tu vocación. Haz clic en un área para desplegar sus grupos y carreras específicas, o busca qué universidades las ofrecen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {TAXONOMIA.map((tax) => {
          const expandido = areaExpandida === tax.area;
          const totalCarreras = tax.subgrupos.reduce((acc, s) => acc + s.carreras.length, 0);

          return (
            <div 
              key={tax.area} 
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col bg-white dark:bg-slate-900
                ${expandido 
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-lg col-span-1 md:col-span-2 lg:col-span-2' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'}`}
            >
              {/* Card Header (Click toggles expansion) */}
              <div 
                className="p-5 cursor-pointer flex flex-col"
                onClick={() => setAreaExpandida(expandido ? null : tax.area)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tax.color} flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                    {tax.icono}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                    <span className="text-[11px] font-medium hidden sm:inline">
                      {expandido ? 'Plegar' : 'Explorar'}
                    </span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 transition-transform duration-300 ${expandido ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
                
                <h3 className={`font-bold text-lg leading-tight mb-2 ${expandido ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {tax.area}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {tax.descripcion}
                </p>
                
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>{tax.subgrupos.length} grupos • {totalCarreras} carreras</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {expandido ? 'Cerrar lista ↑' : 'Ver carreras →'}
                  </span>
                </div>
              </div>

              {/* Card Expanded Content */}
              {expandido && (
                <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-5 flex-1 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-6">
                    {tax.subgrupos.map((sub, i) => (
                      <div key={i}>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2.5 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
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
                              className="text-left bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-2xs hover:scale-[1.02]"
                              title={`Buscar universidades que ofrecen ${carrera}`}
                            >
                              🎓 {carrera}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Botón para ver todas las universidades del área */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Haz clic en una carrera para ver dónde estudiarla o explora toda el área.
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAreaClick) onAreaClick(tax.area);
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <span>Ver universidades con {tax.area}</span>
                      </button>
                    </div>
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
