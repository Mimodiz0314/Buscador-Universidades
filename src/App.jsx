import { useMemo, useState } from 'react';
import {
  UNIVERSIDADES,
  ZONAS_COLOMBIA,
} from './data/universidades.js';
import { TAXONOMIA } from './data/taxonomia.js';
import { normalizar } from './utils/texto.js';

import ESTADOS_ADMISION from './data/estados.json';

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
import LogoUniversidad from './components/LogoUniversidad.jsx';

export default function App() {
  const [pestana, setPestana] = useState('buscar');
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

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
      if (selectedEstados.length > 0 && !selectedEstados.includes(u.estadoAdmision)) return false;

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
  }, [region, zona, tipo, admisionTipo, nivelFormacion, universidadFiltro, areaFiltro, carreraFiltro, estadoFiltro, consulta]);

  function buscar(e) {
    e.preventDefault();
    setConsulta(carreraInput);
    if (pestana !== 'buscar') setPestana('buscar');
  }

  const sidebarItemClass = (id) => `flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    pestana === id ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-700 hover:bg-slate-100'
  }`;

  const getColors = (id) => {
    const colors = [
      'from-blue-100 to-indigo-100', 'from-emerald-100 to-teal-100',
      'from-rose-100 to-pink-100', 'from-amber-100 to-orange-100',
      'from-purple-100 to-fuchsia-100', 'from-cyan-100 to-blue-100',
      'from-slate-100 to-gray-200'
    ];
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return colors[sum % colors.length];
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans antialiased text-slate-900 overflow-hidden">

      {/* ── HEADER ── */}
      <header className="flex h-16 shrink-0 items-center justify-between px-4 w-full bg-white relative z-20 border-b border-slate-100">

        <div className="flex items-center gap-4 w-1/4">
          <button
            onClick={() => setSidebarAbierto(!sidebarAbierto)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-800">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span className="text-lg font-bold tracking-tight hidden sm:block">UniScoop</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-2xl px-4">
          <form onSubmit={buscar} className="flex w-full">
            <div className="flex w-full items-center rounded-l-full border border-slate-300 bg-white px-4 py-1.5 focus-within:border-blue-500 focus-within:shadow-inner ml-2">
              <input
                type="text"
                placeholder="Buscar universidades o carreras..."
                value={carreraInput}
                onChange={(e) => {
                  setCarreraInput(e.target.value);
                  setConsulta(e.target.value);
                  if (pestana !== 'buscar') setPestana('buscar');
                }}
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
              {carreraInput && (
                <button
                  type="button"
                  onClick={() => { setCarreraInput(''); setConsulta(''); }}
                  className="text-slate-400 hover:text-slate-600 px-1"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              onClick={(e) => e.preventDefault()}
              className="rounded-r-full border border-l-0 border-slate-300 bg-slate-50 px-5 py-1.5 hover:bg-slate-100 text-slate-600 transition-colors"
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
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            TÚ
          </div>
        </div>
      </header>

      {/* ── BODY: Sidebar + Main ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside
          className={`flex-col overflow-y-auto bg-white transition-all duration-200 z-10 ${
            sidebarAbierto ? 'w-60 px-3' : 'w-0 sm:w-[72px] sm:px-1'
          } hidden sm:flex shrink-0 border-r border-slate-100 hover:overflow-y-scroll`}
        >
          <div className="py-2 space-y-1">
            <button onClick={() => { setSeleccion(null); setPestana('buscar'); }} className={sidebarItemClass('buscar')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {sidebarAbierto && <span className="truncate">Inicio</span>}
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
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              {sidebarAbierto && <span className="truncate">Test Vocacional</span>}
            </button>
            <button onClick={() => { setSeleccion(null); setPestana('simulador'); }} className={sidebarItemClass('simulador')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              {sidebarAbierto && <span className="truncate">Simulador</span>}
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
            <>
              <div className="my-3 border-t border-slate-200"></div>

              <div className="px-3 pb-1 pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filtros Avanzados</h3>
                  <button 
                    onClick={() => {
                      setChipsActivos([]);
                      setAdmisionTipo('todos'); 
                      setNivelFormacion('todas');
                      setUniversidadFiltro('todas'); 
                      setAreaFiltro('todas'); 
                      setCarreraFiltro('todas'); 
                      setRegion('colombia');
                      setZona('Todas');
                      setConsulta(''); 
                      setCarreraInput(''); 
                      setPestana('buscar');
                    }}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors"
                    title="Limpiar todos los filtros"
                  >
                    Reiniciar
                  </button>
                </div>

                <div className="space-y-4">
                  {/* El filtro de Financiación se maneja exclusivamente con los Chips superiores */}

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">País / Región</label>
                    <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                      <option value="colombia">🇨🇴 Colombia</option>
                      <option value="latam">🌎 Latinoamérica</option>
                      <option value="todas">Todas las regiones</option>
                    </select>
                  </div>

                  {region === 'colombia' && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">Ubicación</label>
                      <select value={zona} onChange={(e) => setZona(e.target.value)} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                        {ZONAS_COLOMBIA.map((z) => (
                          <option key={z} value={z}>{z === 'Todas' ? 'Todo Colombia' : `Región ${z}`}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Admisión</label>
                    <select value={admisionTipo} onChange={(e) => setAdmisionTipo(e.target.value)} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                      <option value="todos">Cualquiera</option>
                      <option value="icfes">ICFES / Saber 11</option>
                      <option value="propio">Examen Propio</option>
                      <option value="abierta">Abierta</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Nivel de Formación</label>
                    <select value={nivelFormacion} onChange={(e) => setNivelFormacion(e.target.value)} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                      <option value="todas">Todas las Carreras</option>
                      <option value="profesional">Profesional / Universitaria</option>
                      <option value="tecnica">Técnica / Tecnológica</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Universidad Específica</label>
                    <select value={universidadFiltro} onChange={(e) => setUniversidadFiltro(e.target.value)} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                      <option value="todas">Todas las Universidades</option>
                      {listaUniversidades.map((uni) => (
                        <option key={uni.id} value={uni.id}>{uni.nombre} ({uni.sigla})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Área de Conocimiento</label>
                    <select value={areaFiltro} onChange={(e) => { setAreaFiltro(e.target.value); setCarreraFiltro('todas'); }} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                      <option value="todas">Todas las Áreas</option>
                      {TAXONOMIA.map((t) => (
                        <option key={t.area} value={t.area}>{t.area}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Carrera / Profesión</label>
                    <select value={carreraFiltro} onChange={(e) => { setCarreraFiltro(e.target.value); if (e.target.value !== 'todas') setAreaFiltro('todas'); }} className="w-full text-xs rounded border border-slate-300 p-1.5 focus:border-blue-500 outline-none">
                      <option value="todas">Todas las Profesiones</option>
                      {listaCarreras.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* El filtro de Estado se maneja exclusivamente con los Chips superiores */}
                </div>
              </div>

              <div className="my-3 border-t border-slate-200"></div>

              <div className="px-3 pb-4 text-[10px] text-slate-400 space-y-1">
                <p>Curado con propósitos educativos.</p>
                <p>Verifica fuentes oficiales.</p>
                <p>© 2026 UniScoop Col.</p>
              </div>
            </>
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
                universidadesRelacionadas={resultados.filter(r => r.uni.id !== seleccion.uni.id).slice(0, 10)}
                onSelectRelated={(item) => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSeleccion(item); }}
              />
            </div>

          ) : pestana === 'explorar' ? (
            /* ── EXPLORAR ÁREAS ── */
            <ExplorarAreas
              onAreaClick={(area) => { setCarreraInput(area); setConsulta(area); setPestana('buscar'); }}
              onCarreraClick={(carrera) => { setCarreraInput(carrera); setConsulta(carrera); setPestana('buscar'); }}
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
                {['Todas', 'Públicas', 'Privadas', 'Inscripciones Abiertas', 'Matrículas Abiertas', 'Próximamente'].map((chip) => (
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
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-200/60 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Status */}
              {consulta && (
                <p className="text-sm text-slate-500 mb-4 px-2">
                  Resultados para <span className="font-semibold text-slate-800">"{consulta}"</span> ({resultados.length})
                </p>
              )}



              {/* Grid de tarjetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                {resultados.map(({ uni, programas }) => {
                  const esFav = favoritos.has(uni.id);
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
                      {/* Thumbnail 16:9 */}
                      <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${getColors(uni.id)} flex items-center justify-center p-6 border border-slate-200/60 transition-all duration-300 group-hover:shadow-md`}>
                        {/* Estado Badge flotante en esquina superior izquierda */}
                        <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm z-10 backdrop-blur-sm bg-opacity-90 ${estadoConfig.bg}`}>
                          {estadoConfig.text}
                        </div>

                        <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                          <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="md" />
                        </div>
                        {/* Favorito */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorito(uni.id); }}
                          className="absolute top-2 right-2 p-1.5 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 backdrop-blur-sm"
                          title="Guardar en favoritos"
                        >
                          <svg viewBox="0 0 24 24" fill={esFav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={`w-4 h-4 ${esFav ? 'text-amber-400' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                        </button>
                        {/* Tipo Badge */}
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-medium backdrop-blur-sm">
                          {uni.tipo === 'pública' ? 'Matrícula $0' : 'Privada'}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-3 pr-2">
                        <div className="shrink-0">
                          <div className="w-9 h-9 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                            <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">
                            {uni.nombre}
                          </h3>
                          <div className="text-xs text-slate-500 mt-1 flex flex-col gap-0.5">
                            <span className="truncate">{uni.sigla} • Región {uni.zona}</span>
                            <span className="truncate flex items-center gap-1">
                              {uni.ranking ? (
                                <>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-amber-500">
                                    <circle cx="12" cy="8" r="7"></circle>
                                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                                  </svg>
                                  <span>Rank #{uni.ranking}</span>
                                </>
                              ) : <span>Sin Rank</span>} • {uni.tipoAdmision}
                            </span>
                            {programas.length > 0 && (
                              <span className="text-blue-600 truncate mt-0.5">
                                ✓ {programas.join(', ')}
                              </span>
                            )}
                          </div>
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
    </div>
  );
}
