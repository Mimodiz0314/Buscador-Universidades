import { META_DATOS } from '../data/universidades.js';

// Chip de estado de verificación de un dato (regla de oro del proyecto:
// nunca mostrar un dato sin decir si está verificado).
function ChipVerificado({ verificado }) {
  if (verificado) {
    return (
      <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
        ✓ verificado {verificado}
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
      ⚠ por verificar — confirma en el sitio oficial
    </span>
  );
}

export default function DetalleUniversidad({ uni, programasCoinciden, onCerrar }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
      onClick={onCerrar}
    >
      <div
        className="mt-4 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {uni.nombre}{' '}
              <span
                className={`ml-1 inline-block align-middle rounded-full px-2 py-0.5 text-[11px] font-bold uppercase text-white ${
                  uni.tipo === 'privada' ? 'bg-violet-600' : 'bg-emerald-600'
                }`}
              >
                {uni.tipo}
              </span>
            </h2>
            <p className="text-sm text-slate-500">
              {uni.ciudad} · {uni.departamento} · Región {uni.zona}
            </p>
            {uni.ranking && (
              <p className="mt-1 text-sm font-semibold text-amber-700" title={META_DATOS.fuenteRanking}>
                🏆 #{uni.ranking} en Colombia{' '}
                <span className="font-normal text-slate-400">(orientativo — según QS, THE, U-Sapiens y Webometrics)</span>
              </p>
            )}
          </div>
          <button
            onClick={onCerrar}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-200"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {programasCoinciden?.length > 0 && (
          <div className="mt-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            <strong>Programas que coinciden con tu búsqueda:</strong>{' '}
            {programasCoinciden.join(' · ')}
          </div>
        )}

        {/* Links directos (punto 2 de la idea) */}
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={uni.admisiones}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            🔗 Ir a Admisiones (trámite oficial)
          </a>
          <a
            href={uni.web}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Sitio web
          </a>
          <a
            href={META_DATOS.linkHecaa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Oferta completa en SNIES
          </a>
        </div>

        {/* Tipo de admisión */}
        <section className="mt-5">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Cómo se ingresa
          </h3>
          <p className="mt-1 text-sm text-slate-700">{uni.notaAdmision}</p>
        </section>

        {/* Fechas (punto 3) */}
        <section className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Fechas de inscripción y matrícula <ChipVerificado verificado={uni.fechas.verificado} />
          </h3>
          <p className="mt-1 text-sm text-slate-700">{uni.fechas.texto}</p>
        </section>

        {/* Costos (punto 4) */}
        <section className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Costos <ChipVerificado verificado={uni.costoInscripcion.verificado} />
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            {uni.costoInscripcion.valor
              ? `Inscripción: $${uni.costoInscripcion.valor.toLocaleString('es-CO')}. `
              : ''}
            {uni.costoInscripcion.nota}
          </p>
        </section>

        {/* Pasos (punto 5) */}
        <section className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Pasos para inscribirte
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
            {uni.pasos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </section>

        {/* Programas */}
        <section className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Programas (lista parcial)
          </h3>
          <p className="mt-1 text-xs text-slate-400">{META_DATOS.fuentePrograma}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {uni.programas.map((p) => (
              <span key={p} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                {p}
              </span>
            ))}
          </div>
        </section>

        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          ⚠ Este buscador es una guía. Antes de pagar un PIN o planear tu inscripción, confirma
          fechas, costos y requisitos en el sitio oficial de admisiones de la universidad (botón
          azul de arriba). Última revisión de esta ficha: {META_DATOS.ultimaRevision}.
        </p>
      </div>
    </div>
  );
}
