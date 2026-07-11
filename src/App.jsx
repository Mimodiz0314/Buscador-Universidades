import { useMemo, useState } from 'react';
import {
  UNIVERSIDADES,
  REGIONES_BUSQUEDA,
  ZONAS_COLOMBIA,
  META_DATOS,
} from './data/universidades.js';
import { normalizar } from './utils/texto.js';
import DetalleUniversidad from './components/DetalleUniversidad.jsx';
import Simulador from './components/Simulador.jsx';
import Becas from './components/Becas.jsx';

const BADGE_ADMISION = {
  propio: { txt: 'Examen propio', cls: 'bg-blue-100 text-blue-700' },
  icfes: { txt: 'Admisión con ICFES', cls: 'bg-emerald-100 text-emerald-700' },
  abierta: { txt: 'Admisión abierta', cls: 'bg-slate-200 text-slate-700' },
};

const BADGE_TIPO = {
  'pública': 'bg-emerald-600 text-white',
  privada: 'bg-violet-600 text-white',
};

export default function App() {
  const [pestana, setPestana] = useState('buscar');
  const [region, setRegion] = useState('colombia');
  const [zona, setZona] = useState('Todas');
  const [tipo, setTipo] = useState('todas'); // 'todas' | 'pública' | 'privada'
  const [carrera, setCarrera] = useState(''); // selección de la lista desplegable
  const [consulta, setConsulta] = useState(''); // se aplica al dar clic en la lupa
  const [seleccion, setSeleccion] = useState(null);
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [orden, setOrden] = useState('ranking'); // 'ranking' | 'nombre'
  // Favoritos persistentes en el dispositivo (sin necesidad de cuenta).
  const [favoritos, setFavoritos] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('buscadoru-favoritos') || '[]'));
    } catch {
      return new Set();
    }
  });

  function toggleFavorito(id) {
    setFavoritos((prev) => {
      const sig = new Set(prev);
      if (sig.has(id)) sig.delete(id);
      else sig.add(id);
      localStorage.setItem('buscadoru-favoritos', JSON.stringify([...sig]));
      return sig;
    });
  }

  // Catálogo único de carreras para la lista desplegable (coincidencia EXACTA:
  // elegir "Medicina" ya no trae "Medicina Veterinaria").
  const carreras = useMemo(() => {
    const set = new Set();
    UNIVERSIDADES.forEach((u) => u.programas.forEach((p) => set.add(p)));
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, []);

  const resultados = useMemo(() => {
    return UNIVERSIDADES.filter(
      (u) =>
        (zona === 'Todas' || u.zona === zona) &&
        (tipo === 'todas' || u.tipo === tipo) &&
        (!soloFavoritas || favoritos.has(u.id))
    )
      .map((u) => {
        if (!consulta) return { uni: u, programas: [] };
        const programas = u.programas.filter((p) => normalizar(p) === normalizar(consulta));
        return programas.length ? { uni: u, programas } : null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        orden === 'ranking'
          ? (a.uni.ranking ?? 999) - (b.uni.ranking ?? 999)
          : a.uni.nombre.localeCompare(b.uni.nombre, 'es')
      );
  }, [consulta, zona, tipo, soloFavoritas, favoritos, orden]);

  function buscar(e) {
    e.preventDefault();
    setConsulta(carrera);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      {/* Encabezado */}
      <header className="pt-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          🎓 Buscador de Oportunidades Universitarias
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500">
          Encuentra tu carrera en las universidades públicas y privadas de Colombia: links
          oficiales para el trámite, fechas, costos, pasos de inscripción, becas y un análisis de
          tus opciones reales.
        </p>
      </header>

      {/* Banner gratuidad — el dato que más estudiantes desconocen */}
      <div className="mt-5 rounded-xl bg-emerald-50 p-3 text-center text-sm text-emerald-800 ring-1 ring-emerald-200">
        💡 ¿Sabías que con la <strong>Política de Gratuidad</strong> la matrícula de pregrado en
        universidades <strong>públicas</strong> es <strong>$0</strong> para la mayoría de
        estudiantes? Solo pagas la inscripción (PIN).
      </div>

      {/* Pestañas */}
      <nav className="mt-6 flex justify-center gap-2">
        {[
          ['buscar', '🔍 Buscar universidad'],
          ['simulador', '📊 Simulador de admisión'],
          ['becas', '🎁 Becas y apoyos'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setPestana(id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              pestana === id
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="mt-6">
        {pestana === 'buscar' && (
          <>
            {/* Barra de búsqueda */}
            <form
              onSubmit={buscar}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex flex-wrap gap-3">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {REGIONES_BUSQUEDA.map((r) => (
                    <option key={r.id} value={r.id} disabled={!r.activo}>
                      {r.nombre}
                      {!r.activo ? ' (próximamente)' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="todas">Públicas y privadas</option>
                  <option value="pública">Solo públicas</option>
                  <option value="privada">Solo privadas</option>
                </select>
                <select
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {ZONAS_COLOMBIA.map((z) => (
                    <option key={z} value={z}>
                      {z === 'Todas' ? 'Todas las regiones del país' : `Región ${z}`}
                    </option>
                  ))}
                </select>
                <div className="flex min-w-60 flex-1">
                  <select
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="w-full rounded-l-lg border border-r-0 border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">— Elige la carrera que quieres estudiar —</option>
                    {carreras.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    aria-label="Buscar"
                    title="Buscar"
                    className="rounded-r-lg bg-blue-600 px-4 text-white hover:bg-blue-700"
                  >
                    🔍
                  </button>
                </div>
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  title="Orden de los resultados"
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="ranking">🏆 Ordenar por ranking</option>
                  <option value="nombre">🔤 Ordenar A–Z</option>
                </select>
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={soloFavoritas}
                    onChange={(e) => setSoloFavoritas(e.target.checked)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  ⭐ Solo mis favoritas
                </label>
              </div>
            </form>

            {/* Resultados */}
            <p className="mt-4 text-sm text-slate-500">
              {consulta
                ? `${resultados.length} universidades ofrecen «${consulta}»`
                : `${resultados.length} universidades en la base — elige una carrera de la lista y da clic en la lupa`}
              {tipo !== 'todas' ? ` (solo ${tipo}s)` : ''}
              {zona !== 'Todas' ? ` en la región ${zona}` : ''}.
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {resultados.map(({ uni, programas }) => {
                const badge = BADGE_ADMISION[uni.tipoAdmision];
                const esFav = favoritos.has(uni.id);
                return (
                  <div
                    key={uni.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSeleccion({ uni, programas })}
                    onKeyDown={(e) => e.key === 'Enter' && setSeleccion({ uni, programas })}
                    className="cursor-pointer rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{uni.nombre}</h3>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {uni.ranking && (
                          <span
                            title={META_DATOS.fuenteRanking}
                            className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800"
                          >
                            🏆 #{uni.ranking}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${BADGE_TIPO[uni.tipo]}`}
                        >
                          {uni.tipo}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorito(uni.id);
                          }}
                          aria-label={esFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
                          title={esFav ? 'Quitar de favoritas' : 'Marcar como favorita'}
                          className={`text-lg leading-none transition ${
                            esFav ? '' : 'opacity-30 grayscale hover:opacity-70'
                          }`}
                        >
                          ⭐
                        </button>
                      </div>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {uni.ciudad} · Región {uni.zona}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}
                    >
                      {badge.txt}
                    </span>
                    {programas.length > 0 && (
                      <p className="mt-2 text-sm text-blue-700">✓ {programas.join(' · ')}</p>
                    )}
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Ver fechas, costos, pasos y link de inscripción →
                    </p>
                  </div>
                );
              })}
            </div>

            {consulta && resultados.length === 0 && (
              <div className="mt-6 rounded-xl bg-white p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                Ninguna universidad de la base ofrece «{consulta}» con los filtros actuales.
                Prueba quitando el filtro de tipo o región, o consulta la oferta oficial completa
                en el{' '}
                <a
                  href={META_DATOS.linkHecaa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-700 hover:underline"
                >
                  SNIES del Ministerio de Educación
                </a>
                .
              </div>
            )}
          </>
        )}

        {pestana === 'simulador' && <Simulador />}
        {pestana === 'becas' && <Becas />}
      </main>

      {/* Detalle */}
      {seleccion && (
        <DetalleUniversidad
          uni={seleccion.uni}
          programasCoinciden={seleccion.programas}
          onCerrar={() => setSeleccion(null)}
        />
      )}

      <footer className="mt-12 text-center text-xs text-slate-400">
        Base curada · última revisión {META_DATOS.ultimaRevision} · Verifica siempre en las fuentes
        oficiales antes de hacer un trámite. Hecho para facilitar el acceso a la universidad. 🇨🇴
      </footer>
    </div>
  );
}
