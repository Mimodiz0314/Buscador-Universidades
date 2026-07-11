import { BECAS } from '../data/becas.js';

export default function Becas() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">Becas, fondos y apoyos</h2>
      <p className="mt-1 text-sm text-slate-500">
        Lo primero que debes saber: en las universidades públicas la <strong>matrícula de
        pregrado es $0</strong> para la mayoría de estudiantes gracias a la Política de
        Gratuidad. Estos apoyos cubren lo demás: inscripción, sostenimiento, transporte.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {BECAS.map((b) => (
          <div
            key={b.id}
            className={`rounded-xl p-4 ring-1 ${
              b.destacada ? 'bg-emerald-50 ring-emerald-200' : 'bg-white ring-slate-200'
            }`}
          >
            <h3 className="font-semibold text-slate-900">
              {b.destacada && '⭐ '}
              {b.nombre}
            </h3>
            <p className="mt-1 text-sm text-slate-700">
              <strong>Cubre:</strong> {b.cobertura}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <strong>Para quién:</strong> {b.quienes}
            </p>
            {b.link && (
              <a
                href={b.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline"
              >
                Sitio oficial →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
