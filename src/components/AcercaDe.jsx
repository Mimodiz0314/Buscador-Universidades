import { useState } from 'react';
import { CREDITOS } from '../data/creditos.js';
import { useInstalacion } from '../utils/instalar.js';

function TarjetaInstalar() {
  const { puedeInstalarDirecto, instalada, ios, instalar } = useInstalacion();
  const [verPasos, setVerPasos] = useState(false);

  if (instalada) {
    return (
      <section className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-5">
        <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-200">✅ UniScoop ya está instalada en este dispositivo</h2>
        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
          Ábrela desde el ícono en tu pantalla de inicio. Funciona sin internet y se actualiza sola.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-5">
      <h2 className="text-base font-bold text-blue-900 dark:text-blue-200">📲 Instala UniScoop en tu celular</h2>
      <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
        Gratis, sin descargar archivos y sin tienda de aplicaciones. Queda con su ícono en tu pantalla,
        funciona sin internet y se actualiza sola.
      </p>

      {puedeInstalarDirecto && (
        <button
          onClick={instalar}
          className="mt-4 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors"
        >
          Instalar UniScoop
        </button>
      )}

      {(!puedeInstalarDirecto || verPasos) ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div className={`rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 p-4 ${ios ? 'sm:order-2' : ''}`}>
            <p className="font-semibold text-slate-900 dark:text-white">Android (Chrome)</p>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Toca el menú <strong>⋮</strong> (arriba a la derecha).</li>
              <li>Elige <strong>«Instalar aplicación»</strong> o <strong>«Agregar a la pantalla principal»</strong>.</li>
              <li>Confirma con <strong>«Instalar»</strong>.</li>
            </ol>
          </div>
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 p-4">
            <p className="font-semibold text-slate-900 dark:text-white">iPhone / iPad (Safari)</p>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Abre esta página en <strong>Safari</strong>.</li>
              <li>Toca el botón <strong>Compartir</strong> (cuadro con flecha ↑).</li>
              <li>Elige <strong>«Agregar a inicio»</strong> y luego <strong>«Agregar»</strong>.</li>
            </ol>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setVerPasos(true)}
          className="mt-3 block text-xs font-medium text-blue-700 dark:text-blue-300 underline"
        >
          ¿No te funciona el botón? Ver los pasos a mano
        </button>
      )}
    </section>
  );
}

export default function AcercaDe() {
  const c = CREDITOS;
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-5 pb-24">
      <TarjetaInstalar />

      {/* ── CRÉDITOS ── */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <img src="/pwa-192x192.png" alt="" className="w-12 h-12 rounded-xl shadow-sm" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">UniScoop</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Buscador de oportunidades universitarias · Versión {c.version}</p>
          </div>
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Creado por</p>
        <ul className="mt-2 space-y-1.5">
          {c.autores.map((nombre) => (
            <li key={nombre} className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0"></span>
              {nombre}
            </li>
          ))}
        </ul>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Institución</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">{c.institucion}</dd>
            <dd className="text-slate-600 dark:text-slate-300">{c.ciudad}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Proyecto presentado en</dt>
            <dd className="font-medium text-slate-900 dark:text-slate-100">{c.evento} {c.anio}</dd>
          </div>
        </dl>
      </section>

      {/* ── DERECHOS Y AVISOS LEGALES ── */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">Derechos de autor</h2>
          <p className="mt-1">
            © {c.anio} {c.autores.join(', ')}. <strong>Todos los derechos reservados.</strong>
          </p>
          <p className="mt-1">
            El nombre UniScoop, el diseño, el código, los textos y las herramientas originales de esta
            aplicación son obra de sus autores y están protegidos por la legislación colombiana de derecho
            de autor (Ley 23 de 1982 y Decisión Andina 351 de 1993). No se permite copiarlos, distribuirlos
            ni modificarlos, total o parcialmente, sin autorización escrita de los autores.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">Aviso sobre la información</h2>
          <p className="mt-1">
            Los datos de universidades, programas, fechas, costos y becas son <strong>orientativos</strong> y
            pueden cambiar sin previo aviso. Antes de inscribirte o pagar, confirma siempre la información en el
            sitio oficial de cada institución. UniScoop no está afiliada a ninguna universidad ni entidad del
            Estado (como el ICFES, el Ministerio de Educación o el ICETEX).
          </p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">Marcas y logos</h2>
          <p className="mt-1">
            Los nombres, escudos y logos de las universidades y entidades mencionadas pertenecen a sus
            respectivos dueños y se muestran únicamente con fines informativos y educativos.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-slate-900 dark:text-white">Privacidad</h2>
          <p className="mt-1">
            UniScoop no pide registro ni recoge datos personales. Tus favoritos y preferencias (como el modo
            oscuro) se guardan solo en tu propio dispositivo.
          </p>
        </div>
      </section>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Hecho en {c.ciudad.split(' —')[0]} con dedicación para estudiantes de Colombia y Latinoamérica.
      </p>
    </div>
    </div>
  );
}
