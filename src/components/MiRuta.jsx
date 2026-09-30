import { useEffect, useMemo, useState } from 'react';
import { BECAS } from '../data/becas.js';
import { PROCESOS_DETALLADOS } from '../data/procesos.js';
import { candidatas, sugerirRuta, leerRutaGuardada, guardarRuta, textoParaCompartir, esCerca } from '../utils/ruta.js';
import { analizarFechas } from '../utils/fechas.js';
import { hoyISO } from '../utils/estados.js';
import { generarUrlGoogleCalendar } from '../utils/calendar.js';
import { compartir, URL_PUBLICA } from '../utils/rutas.js';
import LogoUniversidad from './LogoUniversidad.jsx';

const PUESTOS = [
  { id: 'segura', titulo: '✅ Opción segura', ayuda: 'Donde tu puntaje tiene buenas probabilidades.' },
  { id: 'posible', titulo: '🎯 Opción posible', ayuda: 'Una buena alternativa: vale la pena intentarlo.' },
  { id: 'sueno', titulo: '⭐ Universidad sueño', ayuda: 'La más exigente: apunta alto con un plan B.' },
];

export default function MiRuta({ universidades, onVerDetalle, onVerProceso, onIrTest }) {
  const guardada = useMemo(() => leerRutaGuardada(), []);
  const [carrera, setCarrera] = useState(guardada.carrera || '');
  const [puntaje, setPuntaje] = useState(guardada.puntaje || '');
  const [elegidas, setElegidas] = useState(guardada.elegidas || {});

  const carreras = useMemo(() => {
    const set = new Set();
    universidades.filter((u) => (u.region ?? 'colombia') === 'colombia').forEach((u) => u.programas.forEach((p) => set.add(p)));
    return [...set].sort((a, b) => a.localeCompare(b, 'es'));
  }, [universidades]);

  const opciones = useMemo(() => candidatas(carrera, universidades), [carrera, universidades]);
  const sugeridas = useMemo(() => sugerirRuta(carrera, puntaje, universidades), [carrera, puntaje, universidades]);
  const idsFinales = Object.fromEntries(PUESTOS.map((p) => [p.id, elegidas[p.id] || sugeridas[p.id] || null]));
  const porId = (id) => universidades.find((u) => u.id === id);

  useEffect(() => { guardarRuta({ carrera, puntaje, elegidas }); }, [carrera, puntaje, elegidas]);

  // Próximas fechas verificadas de las universidades elegidas.
  const fechas = PUESTOS.map((p) => {
    const uni = porId(idsFinales[p.id]);
    const proxima = uni ? analizarFechas(PROCESOS_DETALLADOS[uni.id]?.fechasClave, hoyISO()).proxima : null;
    return uni ? { uni, proxima } : null;
  }).filter(Boolean);
  const siguiente = fechas.filter((f) => f.proxima).sort((a, b) => a.proxima.fecha.localeCompare(b.proxima.fecha))[0];

  const becas = BECAS.filter((b) => b.destacada).concat(BECAS.filter((b) => !b.destacada)).slice(0, 3);

  const onCompartir = () => {
    const nombres = Object.fromEntries(PUESTOS.map((p) => [p.id, porId(idsFinales[p.id])?.nombre]));
    compartir({
      titulo: 'Mi Ruta — UniScoop',
      texto: textoParaCompartir({
        carrera,
        nombres,
        proxima: siguiente ? `${siguiente.proxima.evento} (${siguiente.uni.sigla || siguiente.uni.nombre}) — ${siguiente.proxima.fecha}` : null,
        url: `${URL_PUBLICA}#/ruta`,
      }).replace(/\nArma la tuya: .*$/, ''),
      url: `${URL_PUBLICA}#/ruta`,
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-5 pb-24">
      <header className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-5 sm:p-6 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Tu plan personal</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Mi Ruta</h1>
        <p className="text-sm text-blue-50 mt-1">
          Elige tu carrera y tu puntaje: te proponemos una universidad segura, una posible y una sueño, con becas y fechas.
          Se guarda solo en tu celular.
        </p>
      </header>

      {/* Paso 1 y 2 */}
      <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-slate-900">1. ¿Qué quieres estudiar?</span>
          <select
            value={carrera}
            onChange={(e) => { setCarrera(e.target.value); setElegidas({}); }}
            className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white"
          >
            <option value="">— Elige una carrera —</option>
            {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="button" onClick={onIrTest} className="mt-1.5 text-xs font-semibold text-blue-700 underline">
            ¿No sabes? Haz el test vocacional
          </button>
        </label>
        <label className="block">
          <span className="text-sm font-bold text-slate-900">2. Tu puntaje Saber 11 (opcional)</span>
          <input
            type="number" min="0" max="500" inputMode="numeric" placeholder="Ej. 300"
            value={puntaje}
            onChange={(e) => {
              const v = e.target.value === '' ? '' : String(Math.min(500, Math.max(0, Math.round(Number(e.target.value)) || 0)));
              setPuntaje(v); setElegidas({});
            }}
            className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white"
          />
          <span className="mt-1.5 block text-xs text-slate-600">Con puntaje, la propuesta usa el simulador (estimación orientativa, no oficial).</span>
        </label>
      </section>

      {!carrera ? (
        <p className="text-center text-sm text-slate-600 py-8">Elige una carrera para armar tu ruta.</p>
      ) : opciones.length === 0 ? (
        <p className="text-center text-sm text-slate-600 py-8">No encontramos universidades con esa carrera exacta.</p>
      ) : (
        <>
          {/* Paso 3: universidades */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">3. Tus universidades <span className="font-normal text-slate-600">(puedes cambiarlas)</span></h2>
            <div className="grid gap-3 md:grid-cols-3">
              {PUESTOS.map((p) => {
                const uni = porId(idsFinales[p.id]);
                return (
                  <div key={p.id} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs flex flex-col gap-2">
                    <p className="text-sm font-bold text-slate-900">{p.titulo}</p>
                    <p className="text-xs text-slate-600">{p.ayuda}</p>
                    {uni && (
                      <button type="button" onClick={() => onVerDetalle(uni)} className="flex items-center gap-2 text-left rounded-xl bg-slate-50 hover:bg-slate-100 p-2">
                        <LogoUniversidad url={uni.web} sigla={uni.sigla} nombre={uni.nombre} uniId={uni.id} size="sm" />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-slate-900 truncate">{uni.sigla || uni.nombre}</span>
                          <span className="block text-xs text-slate-600 truncate">{uni.ciudad.split('(')[0].trim()}{esCerca(uni) ? ' · cerca de ti' : ''}</span>
                        </span>
                      </button>
                    )}
                    <select
                      value={idsFinales[p.id] || ''}
                      onChange={(e) => setElegidas((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      aria-label={`Cambiar ${p.titulo}`}
                      className="mt-auto w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
                    >
                      {opciones.map(({ uni: u }) => (
                        <option key={u.id} value={u.id}>{u.nombre}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Paso 4: fechas */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-2">
            <h2 className="text-sm font-bold text-slate-900">4. Próximas fechas</h2>
            {fechas.map(({ uni, proxima }) => (
              <div key={uni.id} className="flex flex-wrap items-center justify-between gap-2 text-sm border-b border-slate-100 last:border-0 py-2">
                <span className="font-semibold text-slate-900">{uni.sigla || uni.nombre}</span>
                {proxima ? (
                  <span className="flex flex-wrap items-center gap-2 text-slate-700">
                    <span>{proxima.evento}: <strong>{proxima.fecha}</strong>{proxima.enCurso ? ' (en curso)' : proxima.diasFaltan > 0 ? ` · faltan ${proxima.diasFaltan} días` : ''}</span>
                    <a
                      href={generarUrlGoogleCalendar({ titulo: `${uni.sigla || uni.nombre}: ${proxima.evento}`, descripcion: `Portal oficial: ${uni.admisiones}`, ubicacion: uni.nombre, fechaInicio: proxima.fecha, fechaFin: proxima.hasta })}
                      target="_blank" rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-700 underline"
                    >
                      📅 Agendar
                    </a>
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs">
                    Sin fechas verificadas ·{' '}
                    <button type="button" onClick={() => onVerProceso(uni.id)} className="underline font-semibold text-blue-700">ver guía</button>{' '}
                    o <a href={uni.admisiones} target="_blank" rel="noopener noreferrer" className="underline font-semibold text-blue-700">portal oficial</a>
                  </span>
                )}
              </div>
            ))}
          </section>

          {/* Paso 5: becas */}
          <section className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-2">
            <h2 className="text-sm font-bold text-slate-900">5. Apoyos que debes revisar</h2>
            {becas.map((b) => (
              <a key={b.id} href={b.link} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-slate-50 hover:bg-slate-100 p-3">
                <span className="block text-sm font-semibold text-slate-900">{b.nombre}</span>
                <span className="block text-xs text-slate-600">{b.cobertura}</span>
              </a>
            ))}
          </section>

          <button
            type="button"
            onClick={onCompartir}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
          >
            📤 Compartir mi ruta (WhatsApp)
          </button>
          <p className="text-xs text-slate-600">
            Las propuestas son orientativas. Antes de pagar o inscribirte, confirma todo en el sitio oficial de cada institución.
          </p>
        </>
      )}
    </div>
  );
}
