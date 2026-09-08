import { useMemo, useState, useEffect } from 'react';
import {
  UNIVERSIDADES,
  ZONAS_COLOMBIA,
} from './data/universidades.js';
import { TAXONOMIA } from './data/taxonomia.js';
import { normalizar } from './utils/texto.js';
import { getCampusMedia } from './data/campusMedia.js';

import ESTADOS_ADMISION from './data/estados.json';
import META_SINCRONIZACION from './data/meta.json';

// Helper to dynamically inject real admission status to universities from estados.json
const injectEstadoAdmision = (uni) => {
  return { ...uni, estadoAdmision: ESTADOS_ADMISION[uni.id] || 'cerradas' };
};

const UNIVERSIDADES_CON_ESTADO = UNIVERSIDADES.map(injectEstadoAdmision);
import DetalleUniversidad from './components/DetalleUniversidad.jsx';
import ExplorarAreas from './components/ExplorarAreas.jsx';
import Simulador from './components/Simulador.jsx';
import Becas from './components/Becas.jsx';
import TestVocacional from './components/TestVocacional.jsx';
import ProcesoInscripcion from './components/ProcesoInscripcion.jsx';
import LogoUniversidad from './components/LogoUniversidad.jsx';
import LineaTiempo from './components/LineaTiempo.jsx';
import ComparadorUniversidades from './components/ComparadorUniversidades.jsx';
import CalculadoraGratuidad from './components/CalculadoraGratuidad.jsx';
import ModalVideoCampus from './components/ModalVideoCampus.jsx';

export default function App() {
  const [pestana, setPestana] = useState('buscar');
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [unisComparar, setUnisComparar] = useState(['unal', 'udea']);
  const [videoActivo, setVideoActivo] = useState(null);

  // Dark Mode
  const [temaOscuro, setTemaOscuro] = useState(() => {
    try {
      const guardado = localStorage.getItem('uniscoop_theme');
      if (guardado) return guardado === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (temaOscuro) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('uniscoop_theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('uniscoop_theme', 'light'); } catch {}
    }
  }, [temaOscuro]);

  // Filters
  const [region, setRegion] = useState('colombia');
  const [zona, setZona] = useState('Todas');
  const [chipsActivos, setChipsActivos] = useState([]);
  const [admisionTipo, setAdmisionTipo] = useState('todos');
  const [nivelFormacion, setNivelFormacion] = useState('todas');
  const [universidadFiltro, setUniversidadFiltro] = useState('todas');
  const [areaFiltro, setAreaFiltro] = useState('todas');
  const [carreraFiltro, setCarreraFiltro] = useState('todas');

  // Sorted list of universities for the dropdown
  const listaUniversidades = useMemo(() => {
    return [...UNIVERSIDADES_CON_ESTADO].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, []);

  // List of all unique careers/professions in the taxonomy
  const listaCarreras = useMemo(() => {
    const setCarreras = new Set();
    TAXONOMIA.forEach((t) => {
      t.subgrupos.forEach((s) => {
        s.carreras.forEach((c) => {
          setCarreras.add(c);
        });
      });
    });
    return Array.from(setCarreras).sort((a, b) => a.localeCompare(b));
  }, []);

  // Search
  const [carreraInput, setCarreraInput] = useState('');
  const [consulta, setConsulta] = useState('');

  // Interactions
  const [seleccion, setSeleccion] = useState(null);
  const [procesoUni, setProcesoUni] = useState(null);
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('buscadoru-favs-yt') || '[]'));
    } catch {
      return new Set();
    }
  });

  function toggleFavorito(id) {
    setFavoritos((prev) => {
      const sig = new Set(prev);
      if (sig.has(id)) sig.delete(id);
      else sig.add(id);
      localStorage.setItem('buscadoru-favs-yt', JSON.stringify([...sig]));
      return sig;
    });
  }

  // Helper for technical careers
  const esTecnica = (nombre) => {
    const norm = nombre.toLowerCase();
    return norm.includes('tecnolog') || norm.includes('técnic') || norm.includes('tecnic');
  };

  // Smart matching with exclusion logic (e.g. separates "Medicina" from "Medicina Veterinaria")
  const matchConExclusion = (programStr, searchStr) => {
    const pNorm = normalizar(programStr);
    const sNorm = normalizar(searchStr).trim();
    
    // Exclude veterinary medicine if the search query does not explicitly ask for it
    if (pNorm.includes('veterinaria') && !sNorm.includes('veterinaria')) {
      return false;
    }
    return pNorm.includes(sNorm);
  };

  // Filter logic
  const resultados = useMemo(() => {
    return UNIVERSIDADES_CON_ESTADO.filter((u) => {
      if (region !== 'todas' && (u.region ?? 'colombia') !== region) return false;
      if (region === 'colombia' && zona !== 'Todas' && u.zona !== zona) return false;
      const selectedTipos = [];
      if (chipsActivos.includes('Públicas')) selectedTipos.push('pública');
      if (chipsActivos.includes('Privadas')) selectedTipos.push('privada');
      if (selectedTipos.length > 0 && !selectedTipos.includes(u.tipo)) return false;

      const selectedEstados = [];
      if (chipsActivos.includes('Inscripciones Abiertas')) selectedEstados.push('abiertas');
      if (chipsActivos.includes('Matrículas Abiertas')) selectedEstados.push('matriculas');
      if (chipsActivos.includes('Próximamente')) selectedEstados.push('proximamente');
      if (selectedEstados.length > 0) {
        let matchedEstado = false;
        if (selectedEstados.includes(u.estadoAdmision)) matchedEstado = true;
        if (u.estadoAdmision === 'ambas' && (selectedEstados.includes('abiertas') || selectedEstados.includes('matriculas'))) matchedEstado = true;
        if (!matchedEstado) return false;
      }

      if (chipsActivos.includes('Examen Propio') && u.tipoAdmision !== 'propio') return false;
      if (chipsActivos.includes('Saber 11') && u.tipoAdmision !== 'icfes') return false;

      if (admisionTipo !== 'todos' && u.tipoAdmision !== admisionTipo) return false;
      if (universidadFiltro !== 'todas' && u.id !== universidadFiltro) return false;

      if (areaFiltro !== 'todas') {
        const areaObj = TAXONOMIA.find(t => t.area === areaFiltro);
        const carrerasDelArea = areaObj ? areaObj.subgrupos.flatMap(s => s.carreras) : [];
        const tieneCarreraDelArea = u.programas.some(p => carrerasDelArea.some(c => matchConExclusion(p, c)));
        if (!tieneCarreraDelArea) return false;
      }

      if (carreraFiltro !== 'todas') {
        const tieneCarreraSpec = u.programas.some(p => matchConExclusion(p, carreraFiltro));
        if (!tieneCarreraSpec) return false;
      }

      if (nivelFormacion !== 'todas') {
        const tieneNivel = u.programas.some(p =>
          nivelFormacion === 'tecnica' ? esTecnica(p) : !esTecnica(p)
        );
        if (!tieneNivel) return false;
      }
      return true;
    })
      .map((u) => {
        let progsAFiltrar = u.programas;
        if (nivelFormacion !== 'todas') {
          progsAFiltrar = progsAFiltrar.filter(p => nivelFormacion === 'tecnica' ? esTecnica(p) : !esTecnica(p));
        }
        if (areaFiltro !== 'todas') {
          const areaObj = TAXONOMIA.find(t => t.area === areaFiltro);
          const carrerasDelArea = areaObj ? areaObj.subgrupos.flatMap(s => s.carreras) : [];
          progsAFiltrar = progsAFiltrar.filter(p => carrerasDelArea.some(c => matchConExclusion(p, c)));
        }
        if (carreraFiltro !== 'todas') {
          progsAFiltrar = progsAFiltrar.filter(p => matchConExclusion(p, carreraFiltro));
        }

        if (!consulta) return { uni: u, programas: progsAFiltrar.slice(0, 3) };

        const term = normalizar(consulta).trim();
        const matchNombre = normalizar(u.nombre).includes(term) || normalizar(u.sigla).includes(term);

        // Semantic search: also match taxonomy area names
        const matchedAreas = TAXONOMIA.filter(t => normalizar(t.area).includes(term));
        const carrerasFromMatchedAreas = matchedAreas.flatMap(a => a.subgrupos.flatMap(s => s.carreras));

        const programasMatch = progsAFiltrar.filter((p) => {
          return matchConExclusion(p, consulta) || carrerasFromMatchedAreas.some(c => matchConExclusion(p, c));
        });

        if (matchNombre || programasMatch.length > 0) return { uni: u, programas: programasMatch };
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => (a.uni.ranking ?? 999) - (b.uni.ranking ?? 999));
  }, [region, zona, chipsActivos, admisionTipo, nivelFormacion, universidadFiltro, areaFiltro, carreraFiltro, consulta]);

  function buscar(e) {
    e.preventDefault();
    setConsulta(carreraInput);
    if (pestana !== 'buscar') setPestana('buscar');
  }

  const sidebarItemClass = (id) => `flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    pestana === id ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
  }`;

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-slate-950 font-sans antialiased text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">
      {videoActivo && (
        <ModalVideoCampus
          videoId={videoActivo.videoId}
          titulo={videoActivo.titulo}
          uniNombre={videoActivo.uniNombre}
          onCerrar={() => setVideoActivo(null)}
        />
      )}

      {/* ── HEADER ── */}
      <header className="flex h-16 shrink-0 items-center justify-between px-4 w-full bg-white dark:bg-slate-900 relative z-20 border-b border-slate-100 dark:border-slate-800 transition-colors">

        <div className="flex items-center gap-4 w-1/4">
          <button
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="Toggle Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => { setPestana('buscar'); setConsulta(''); setCarreraInput(''); setSeleccion(null); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600 dark:text-blue-400">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span className="text-lg font-bold tracking-tight hidden sm:block text-slate-900 dark:text-white">UniScoop</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-2xl px-4">
          <form onSubmit={buscar} className="flex w-full">
            <div className="flex w-full items-center rounded-l-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-1.5 focus-within:border-blue-500 focus-within:shadow-inner ml-2 transition-colors">
              <input
                type="text"
                placeholder="Buscar universidades o carreras..."
                value={carreraInput}
                onChange={(e) => {
                  setCarreraInput(e.target.value);
                  setConsulta(e.target.value);
                  if (pestana !== 'buscar') setPestana('buscar');
                }}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
              />
              {carreraInput && (
                <button
                  type="button"
                  onClick={() => { setCarreraInput(''); setConsulta(''); }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-1"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              onClick={(e) => e.preventDefault()}
              className="rounded-r-full border border-l-0 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Buscar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/4">
          {/* Botón Modo Oscuro */}
          <button
            onClick={() => setTemaOscuro(prev => !prev)}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={temaOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar tema claro y oscuro"
          >
            {temaOscuro ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-700">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>

          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            TÚ
          </div>
        </div>
      </header>

      {/* ── BODY: Sidebar + Main ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside
          className={`flex-col justify-between bg-white dark:bg-slate-900 transition-all duration-200 z-10 ${
            sidebarAbierto ? 'w-60 px-3' : 'w-0 sm:w-[72px] sm:px-1'
          } hidden sm:flex shrink-0 border-r border-slate-100 dark:border-slate-800 overflow-hidden`}
        >
          <div className="py-2 space-y-1">
            <button onClick={() => { setSeleccion(null); setPestana('buscar'); }} className={sidebarItemClass('buscar')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {sidebarAbierto && <span className="truncate">Inicio</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('lineatiempo'); }} className={sidebarItemClass('lineatiempo')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-600">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {sidebarAbierto && <span className="truncate font-semibold text-blue-900">Línea de Tiempo</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('comparar'); }} className={sidebarItemClass('comparar')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
                <path d="M16 3h5v5"></path>
                <path d="M4 20L21 3"></path>
                <path d="M21 16v5h-5"></path>
                <path d="M15 15l6 6"></path>
                <path d="M4 4l5 5"></path>
              </svg>
              {sidebarAbierto && <span className="truncate">Comparar</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('gratuidad'); }} className={sidebarItemClass('gratuidad')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600">
                <path d="M3 21h18"></path>
                <path d="M3 10h18"></path>
                <path d="M5 6l7-3 7 3"></path>
                <path d="M4 10v11"></path>
                <path d="M20 10v11"></path>
                <path d="M8 14v4"></path>
                <path d="M12 14v4"></path>
                <path d="M16 14v4"></path>
              </svg>
              {sidebarAbierto && <span className="truncate font-semibold text-emerald-900">Gratuidad 100%</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setProcesoUni(null); setPestana('proceso'); }} className={sidebarItemClass('proceso')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              {sidebarAbierto && <span className="truncate">Procesos de Admisión</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('simulador'); }} className={sidebarItemClass('simulador')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              {sidebarAbierto && <span className="truncate">Simulador ICFES</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('explorar'); }} className={sidebarItemClass('explorar')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
              </svg>
              {sidebarAbierto && <span className="truncate">Explorar Áreas</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('test'); }} className={sidebarItemClass('test')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              {sidebarAbierto && <span className="truncate">Test Vocacional</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('becas'); }} className={sidebarItemClass('becas')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
              {sidebarAbierto && <span className="truncate">Becas y Apoyos</span>}
            </button>
          </div>

          {sidebarAbierto && (
            <div className="mt-auto pt-3 pb-4 border-t border-slate-100 px-3 space-y-1 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>UniScoop Colombia</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">Guía y buscador de admisiones universitarias.</p>
              <p className="text-[9px] text-slate-400">© 2026 UniScoop Col.</p>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">

          {seleccion ? (
            /* ── WATCH PAGE: Universidad Seleccionada ── */
            <div className="w-full h-full">
              <DetalleUniversidad
                uni={seleccion.uni}
                programasCoinciden={seleccion.programas}
                onCerrar={() => setSeleccion(null)}
                onVerProceso={(id) => { setSeleccion(null); setProcesoUni(id); setPestana('proceso'); }}
                onComparar={(id) => {
                  setUnisComparar(prev => [id, ...prev.filter(x => x !== id)].slice(0, 3));
                  setSeleccion(null);
                  setPestana('comparar');
                }}
                universidadesRelacionadas={resultados.filter(r => r.uni.id !== seleccion.uni.id).slice(0, 10)}
                onSelectRelated={(item) => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSeleccion(item); }}
              />
            </div>

          ) : pestana === 'lineatiempo' ? (
            /* ── LÍNEA DE TIEMPO / CRONOGRAMA ── */
            <LineaTiempo
              onVerProceso={(id) => { setSeleccion(null); setProcesoUni(id); setPestana('proceso'); }}
            />

          ) : pestana === 'comparar' ? (
            /* ── COMPARADOR LADO A LADO ── */
            <ComparadorUniversidades
              universidades={UNIVERSIDADES_CON_ESTADO}
              seleccionadasIniciales={unisComparar}
              onVerDetalle={(uni) => setSeleccion({ uni, programas: [] })}
              onVerProceso={(id) => { setSeleccion(null); setProcesoUni(id); setPestana('proceso'); }}
            />

          ) : pestana === 'gratuidad' ? (
            /* ── CALCULADORA POLÍTICA DE GRATUIDAD ── */
            <CalculadoraGratuidad
              onExplorarPublicas={() => {
                setChipsActivos(['Públicas']);
                setSeleccion(null);
                setPestana('buscar');
              }}
            />

          ) : pestana === 'explorar' ? (
            /* ── EXPLORAR ÁREAS ── */
            <ExplorarAreas
              onAreaClick={(area) => { setCarreraInput(area); setConsulta(area); setPestana('buscar'); }}
              onCarreraClick={(carrera) => { setCarreraInput(carrera); setConsulta(carrera); setPestana('buscar'); }}
            />

          ) : pestana === 'proceso' ? (
            /* ── PROCESO DE INSCRIPCIÓN ── */
            <ProcesoInscripcion
              key={procesoUni || 'sin-seleccion'}
              universidades={UNIVERSIDADES_CON_ESTADO}
              uniInicial={procesoUni}
            />

          ) : pestana === 'test' ? (
            /* ── TEST VOCACIONAL ── */
            <div className="p-4 sm:p-6 lg:p-8">
              <TestVocacional
                onElegirCarrera={(carrera) => {
                  setCarreraInput(carrera);
                  setConsulta(carrera);
                  setPestana('buscar');
                }}
              />
            </div>

          ) : pestana === 'simulador' ? (
            /* ── SIMULADOR ── */
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <Simulador />
            </div>

          ) : pestana === 'becas' ? (
            /* ── BECAS ── */
            <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
              <Becas />
            </div>

          ) : (
            /* ── INICIO / BUSCAR (default) ── */
            <div className="p-4 sm:p-6 pb-24">

              {/* Category Chips (YouTube style quick filters) */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                {['Todas', 'Públicas', 'Privadas', 'Inscripciones Abiertas', 'Matrículas Abiertas', 'Próximamente', 'Examen Propio', 'Saber 11'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      if (chip === 'Todas') {
                        setChipsActivos([]);
                        setAdmisionTipo('todos'); 
                        setNivelFormacion('todas');
                        setUniversidadFiltro('todas'); 
                        setAreaFiltro('todas'); 
                        setCarreraFiltro('todas'); 
                        setConsulta(''); 
                        setCarreraInput(''); 
                      } else {
                        setChipsActivos(prev => {
                          if (prev.includes(chip)) return prev.filter(c => c !== chip);
                          return [...prev, chip];
                        });
                      }
                      setPestana('buscar');
                    }}
                    className={`whitespace-nowrap px-3.5 py-1.5 text-sm rounded-lg transition-colors font-medium ${
                      (chip === 'Todas' && chipsActivos.length === 0) || chipsActivos.includes(chip)
                        ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white hover:bg-slate-800'
                        : 'bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Status & Sync Badge */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4 px-2">
                {consulta ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Resultados para <span className="font-semibold text-slate-800 dark:text-slate-100">"{consulta}"</span> ({resultados.length})
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Mostrando {resultados.length} universidades disponibles
                  </p>
                )}
                {META_SINCRONIZACION?.fechaTexto && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-full px-3 py-1 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Estados verificados vía IA: <strong>{META_SINCRONIZACION.fechaTexto}</strong></span>
                  </div>
                )}
              </div>

              {/* Grid de tarjetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                {resultados.map(({ uni, programas }) => {
                  const esFav = favoritos.has(uni.id);
                  const media = getCampusMedia(uni.id);
                  const estadoConfig = {
                    abiertas: { bg: 'bg-emerald-500', text: 'Inscripciones Abiertas' },
                    matriculas: { bg: 'bg-blue-600', text: 'Matrículas Abiertas' },
                    proximamente: { bg: 'bg-amber-500', text: 'Próximamente' },
                    cerradas: { bg: 'bg-slate-500', text: 'Cerrado' },
                  }[uni.estadoAdmision] || { bg: 'bg-slate-500', text: 'Cerrado' };

                  return (
                    <div
                      key={uni.id}
                      className="group cursor-pointer flex flex-col"
                      onClick={() => setSeleccion({ uni, programas })}
                    >
                      {/* Thumbnail 16:9 con Fotografía Real de Campus */}
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-500/50">
                        {/* Foto Real de Campus */}
                        <img
                          src={media.foto}
                          alt={`Campus de ${uni.nombre}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.90] group-hover:brightness-100"
                          loading="lazy"
                        />

                        {/* Overlay gradiente oscuro para legibilidad y elegancia cinematográfica */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/20 to-black/30 pointer-events-none"></div>

                        {/* Logo oficial y sigla sobre el campus */}
                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 z-10">
                          <div className="w-10 h-10 rounded-xl bg-white/95 dark:bg-slate-900/95 p-1 shadow-md border border-white/40 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                            <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
                          </div>
                          <div className="text-white drop-shadow-md pr-1">
                            <span className="text-[12px] font-bold block leading-tight text-white">{uni.sigla}</span>
                            <span className="text-[10px] text-slate-200 font-medium leading-tight">Región {uni.zona}</span>
                          </div>
                        </div>

                        {/* Estado Badge flotante en esquina superior izquierda */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {uni.estadoAdmision === 'ambas' ? (
                            <>
                              <div className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm backdrop-blur-md bg-emerald-500/90">
                                Inscripciones
                              </div>
                              <div className="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm backdrop-blur-md bg-blue-600/90">
                                Matrículas
                              </div>
                            </>
                          ) : (
                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm backdrop-blur-md ${estadoConfig.bg}`}>
                              {estadoConfig.text}
                            </div>
                          )}
                        </div>

                        {/* Acciones flotantes en esquina superior derecha */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                          {media.youtubeId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setVideoActivo({
                                  videoId: media.youtubeId,
                                  titulo: media.tituloVideo,
                                  uniNombre: uni.nombre,
                                });
                              }}
                              className="px-2 py-1 rounded bg-black/70 hover:bg-rose-600 text-white font-bold text-[10px] flex items-center gap-1 transition-all backdrop-blur-md shadow-sm"
                              title="Ver Tour de Campus (YouTube)"
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-rose-400">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              <span>Tour</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUnisComparar(prev => [uni.id, ...prev.filter(x => x !== uni.id)].slice(0, 3));
                              setPestana('comparar');
                            }}
                            className="p-1.5 rounded bg-black/70 text-white hover:bg-indigo-600 transition-colors backdrop-blur-md text-xs shadow-sm"
                            title="Comparar lado a lado"
                          >
                            ⚖️
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFavorito(uni.id); }}
                            className="p-1.5 rounded bg-black/70 text-white hover:bg-black/90 transition-colors backdrop-blur-md shadow-sm"
                            title="Guardar en favoritos"
                          >
                            <svg viewBox="0 0 24 24" fill={esFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${esFav ? 'text-amber-400' : ''}`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                          </button>
                        </div>

                        {/* Tipo Badge en esquina inferior derecha */}
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-semibold backdrop-blur-md border border-white/10">
                          {uni.tipo === 'pública' ? 'Matrícula $0' : 'Privada'}
                        </div>
                      </div>

                      <div className="flex flex-col mt-2.5 pr-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {uni.nombre}
                        </h3>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-col gap-0.5">
                          <span className="truncate flex items-center gap-1 font-medium">
                            {uni.ranking ? (
                              <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-amber-500 shrink-0">
                                  <circle cx="12" cy="8" r="7"></circle>
                                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                                </svg>
                                <span className="text-slate-700 dark:text-slate-200 font-semibold">Rank #{uni.ranking}</span>
                              </>
                            ) : <span>Sin Rank</span>} • <span className="capitalize">{uni.tipoAdmision}</span>
                          </span>
                          {programas.length > 0 && (
                            <span className="text-blue-600 dark:text-blue-400 truncate mt-0.5 font-medium">
                              ✓ {programas.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty state */}
              {resultados.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-20 text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 mb-4 text-slate-300">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <h3 className="text-lg font-medium">No se encontraron resultados</h3>
                  <p className="text-sm">Prueba ajustando los filtros o buscando otro término.</p>
                  <button
                    onClick={() => setPestana('explorar')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Explorar Áreas de Conocimiento
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="sm:hidden shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg z-30 transition-colors">
        <button
          onClick={() => { setSeleccion(null); setPestana('buscar'); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded-lg transition-colors ${
            pestana === 'buscar' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Buscar</span>
        </button>

        <button
          onClick={() => { setSeleccion(null); setPestana('lineatiempo'); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded-lg transition-colors ${
            pestana === 'lineatiempo' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Fechas</span>
        </button>

        <button
          onClick={() => { setSeleccion(null); setPestana('comparar'); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded-lg transition-colors ${
            pestana === 'comparar' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"></path>
          </svg>
          <span>Comparar</span>
        </button>

        <button
          onClick={() => { setSeleccion(null); setPestana('simulador'); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded-lg transition-colors ${
            pestana === 'simulador' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <span>Simulador</span>
        </button>

        <button
          onClick={() => { setSeleccion(null); setPestana('gratuidad'); }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-2 rounded-lg transition-colors ${
            pestana === 'gratuidad' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span className="text-sm leading-none">🏛️</span>
          <span>Gratuidad</span>
        </button>
      </nav>
    </div>
  );
}
